#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readJSON,ROOT,digest,assertSpec,semanticSnapshot} from './spec.mjs';
import {buildScene} from './layout.mjs';
import {writeArtifacts} from './export.mjs';
import {runQA} from './qa.mjs';
import {saveDeliveryStatus,validateOutput} from './output-validation.mjs';

export async function build(spec,out,{force=false}={}) {
  assertSpec(spec);
  if(spec.visual.reference?.mode==='target')throw new Error('Selected PNG target cannot be rebuilt by generic build. Use reconstruct --scene FILE --contract FILE --out NEW_DIRECTORY; preserve target geometry and record source-required changes.');
  const dir=path.resolve(out);
  let existing=[];
  try{existing=await fs.readdir(dir);}catch(e){if(e.code!=='ENOENT')throw e;}
  if(existing.length){
    if(!force)throw new Error(`Output exists; use a new directory (or --force on a PaperFigure-owned output): ${dir}`);
    let old;try{old=readJSON(path.join(dir,'manifest.json'));}catch{throw new Error('Refusing to overwrite an output without a PaperFigure manifest');}
    if(old.generator!=='PaperFigure')throw new Error('Output is not owned by PaperFigure');
  }
  const scene=buildScene(spec);
  await fs.mkdir(path.dirname(dir),{recursive:true});
  const temp=await fs.mkdtemp(path.join(path.dirname(dir),'.paperfigure-tmp-'));
  try{
    await writeArtifacts(temp,scene,spec);
    const qa=await runQA(temp,scene);
    await fs.writeFile(path.join(temp,'qa.json'),JSON.stringify(qa,null,2)+'\n');
    const sourceFiles=(await fs.readdir(new URL('scripts/',ROOT))).filter(n=>n.endsWith('.mjs')).sort();
    const generatorHash=digest((await Promise.all(sourceFiles.map(n=>fs.readFile(new URL(`scripts/${n}`,ROOT),'utf8')))).join('\n'));
    const artifacts={};
    const {createHash}=await import('node:crypto');
    for(const name of (await fs.readdir(temp)).sort())artifacts[name]=createHash('sha256').update(await fs.readFile(path.join(temp,name))).digest('hex');
    const manifest={generator:'PaperFigure',version:'0.1.0',specHash:digest(spec),semanticHash:digest(semanticSnapshot(spec)),generatorHash,node:process.version,dependencies:readJSON(new URL('package.json',ROOT)).dependencies,artifacts};
    await fs.writeFile(path.join(temp,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
    await fs.mkdir(dir,{recursive:true});
    for(const name of await fs.readdir(temp))await fs.rename(path.join(temp,name),path.join(dir,name));
    const status=await saveDeliveryStatus(dir);
    return {dir,qa,status};
  }finally{await fs.rm(temp,{recursive:true,force:true});}
}

function options(args){const flags={};for(let i=0;i<args.length;i++){if(!args[i].startsWith('--'))throw new Error(`Unexpected argument: ${args[i]}`);const k=args[i].slice(2);flags[k]=args[i+1]&&!args[i+1].startsWith('--')?args[++i]:true;}return flags;}
async function main(){
  const [command,...args]=process.argv.slice(2),o=options(args);
  if(command==='reconstruct'){
    if(!o.scene||!o.contract||!o.out)throw new Error('reconstruct requires --scene FILE --contract FILE --out NEW_DIRECTORY');
    const {saveEditableFigure,toEditableSVG}=await import('./layout-export.mjs'),{inspectLayout}=await import('./layout-inspect.mjs'),{auditNativeLayout}=await import('./layout-native-audit.mjs'),{checkReferenceLayout}=await import('./reference-layout.mjs');
    const scene=readJSON(o.scene),contract=readJSON(o.contract),svg=toEditableSVG(scene),binding=await checkReferenceLayout(svg,scene,contract,path.dirname(path.resolve(o.contract)));
    if(!binding.passed)throw new Error('Reference reconstruction failed before export: '+JSON.stringify(binding.errors));
    let visual;
    if(contract.visualContract){
      const {loadVisualContract,auditVisualContract}=await import('./visual-contract.mjs');
      visual=await loadVisualContract(contract.visualContract,path.dirname(path.resolve(o.contract)));
      visual.report=auditVisualContract(scene,visual.contract);
      if(visual.contract.coverage!=='complete'||!visual.report.passed)throw Error('Complete visual contract failed before export: '+JSON.stringify(visual.report.errors));
    }
    await saveEditableFigure(scene,o.out);let typographyStyle;if(contract.typography){const {auditTypography}=await import('./typography-profile.mjs');const bytes=await fs.readFile(path.resolve(path.dirname(path.resolve(o.contract)),contract.typography.path)),profile=JSON.parse(bytes);await fs.writeFile(path.join(o.out,'typography-profile.json'),bytes);contract.typography.path='typography-profile.json';typographyStyle=await auditTypography(scene,svg,await fs.readFile(path.join(o.out,'figure.pptx')),readJSON(path.join(o.out,'pptx-object-map.json')),profile);await fs.writeFile(path.join(o.out,'typography-style-qa.json'),JSON.stringify(typographyStyle,null,2));}const qa=await inspectLayout(svg,scene),native=await auditNativeLayout(scene,await fs.readFile(path.join(o.out,'figure.pptx')),readJSON(path.join(o.out,'pptx-object-map.json')));
    if(visual){await fs.writeFile(path.join(o.out,'visual-contract.json'),visual.bytes);await fs.writeFile(path.join(o.out,'visual-contract-qa.json'),JSON.stringify(visual.report,null,2)+'\n');contract.visualContract.path='visual-contract.json';}
    contract.reference.path=path.relative(path.resolve(o.out),path.resolve(path.dirname(path.resolve(o.contract)),contract.reference.path));
    binding.contractSHA256=digest(contract);
    for(const [name,value] of Object.entries({'reference-contract.json':contract,'reference-layout-qa.json':binding,'layout-qa.json':qa,'native-audit.json':native}))await fs.writeFile(path.join(o.out,name),JSON.stringify(value,null,2)+'\n');
    const status=await saveDeliveryStatus(o.out);
    console.log(JSON.stringify({out:path.resolve(o.out),...status}));if(!qa.qa.passed||!native.passed||typographyStyle?.passed===false)process.exitCode=2;
  }else if(command==='build'){
    if(o.mode&&o.mode!=='design')throw new Error('build supports design mode only; use reconstruct for a selected PNG target');
    if(o.reference||o['reference-contract'])throw new Error('build does not reconstruct a PNG. Use reconstruct --scene FILE --contract FILE --out NEW_DIRECTORY');
    if(!o.spec||!o.out)throw new Error('build requires --spec FILE --out DIRECTORY');
    const spec=readJSON(o.spec);
    if(o['font-family']){spec.visual.typography??={};spec.visual.typography.fontFamily=o['font-family'];}
    if(o['font-scale']){
      const scale=Number(o['font-scale']);if(!Number.isFinite(scale)||scale<=0)throw new Error('font-scale must be positive');
      const defaults={moduleSize:24,detailSize:20,annotationSize:20,titleSize:30};
      spec.visual.typography??={};for(const [k,v] of Object.entries(defaults))spec.visual.typography[k]=(spec.visual.typography[k]??v)*scale;
      for(const n of Object.values(spec.layout.nodes??{}))if(n.fontSize)n.fontSize*=scale;
    }
    const r=await build(spec,o.out,{force:o.force===true});
    console.log(JSON.stringify({out:r.dir,...r.status,errors:r.qa.errors.length,warnings:r.qa.warnings.length}));
    if(!r.qa.passed)process.exitCode=2;
  }else if(command==='validate'){
    if(!o.spec)throw new Error('validate requires --spec FILE');
    assertSpec(readJSON(o.spec));console.log('Specification valid (scientific entailment requires review).');
  }else if(command==='qa'){
    if(!o.out)throw new Error('qa requires --out DIRECTORY');
    const status=await validateOutput(o.out);
    console.log(JSON.stringify(status,null,2));if(!status.mechanicalPassed)process.exitCode=2;
  }else if(command==='review-status'){
    if(!o.out)throw new Error('review-status requires --out DIRECTORY');
    const status=await saveDeliveryStatus(o.out,o.review);
    console.log(JSON.stringify(status,null,2));if(!status.deliveryReady)process.exitCode=2;
  }else if(command==='reference-prompt'){
    if(!o.spec||!o.brief)throw new Error('reference-prompt requires --spec FILE --brief FILE. Author a reviewed communication brief using references/image-reference.md before generation.');
    const spec=assertSpec(readJSON(o.spec));
    const {designPrompt}=await import('./design-prompt.mjs');
    const brief=readJSON(o.brief);let narrativePlan;
    if(brief.version==='1.1'){
      if(typeof brief.narrative?.path!=='string'||!brief.narrative.path.trim())throw new Error('Version 1.1 requires narrative.path relative to the brief file');
      narrativePlan=readJSON(path.resolve(path.dirname(path.resolve(o.brief)),brief.narrative.path));
    }
    let visualContract;
    if(brief.visualContract){const {loadVisualContract}=await import('./visual-contract.mjs');visualContract=(await loadVisualContract(brief.visualContract,path.dirname(path.resolve(o.brief)))).contract;}
    process.stdout.write(designPrompt(spec,brief,narrativePlan,visualContract));
  }else if(command==='candidates'){
    if(!o.spec||!o.out)throw new Error('candidates requires --spec FILE --out NEW_DIRECTORY');
    const spec=assertSpec(readJSON(o.spec));
    for(const theme of ['paper','mono']){
      const candidate=structuredClone(spec);candidate.visual.theme=theme;
      if(digest(semanticSnapshot(spec))!==digest(semanticSnapshot(candidate)))throw new Error('Candidate changed semantics');
      const r=await build(candidate,path.join(o.out,theme));console.log(JSON.stringify({candidate:theme,passed:r.qa.passed}));if(!r.qa.passed)process.exitCode=2;
    }
  }else{
    console.log('PaperFigure\n  build --spec FILE --out NEW_DIRECTORY [--force] [--font-family Arial] [--font-scale 1.1]\n  reconstruct --scene FILE --contract FILE --out NEW_DIRECTORY\n  validate --spec FILE\n  qa --out DIRECTORY\n  review-status --out DIRECTORY [--review FILE]\n  reference-prompt --spec FILE --brief FILE\n  candidates --spec FILE --out NEW_DIRECTORY\n\nNatural-language understanding runs in Codex via SKILL.md; this CLI never silently calls an AI API.');
    if(command&&command!=='help')process.exitCode=1;
  }
}
if(process.argv[1]&&await fs.realpath(process.argv[1]).catch(()=>null)===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1;});
