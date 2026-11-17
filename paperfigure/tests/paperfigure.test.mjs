import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import JSZip from 'jszip';
import sharp from 'sharp';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import {ROOT,readJSON,assertSpec,semanticSnapshot,digest} from '../scripts/spec.mjs';
import {buildScene} from '../scripts/layout.mjs';
import {toSVG,toPPTX} from '../scripts/export.mjs';
import {layoutQA,artifactQA,crossing} from '../scripts/qa.mjs';
import {build} from '../scripts/paperfigure.mjs';
import {routeCoverage} from '../scripts/render-metrics.mjs';
import {visualReviewStatus,REVIEW_CHECKS,REVIEW_ARTIFACTS,fileHash} from '../scripts/visual-review.mjs';

const names=['vlm','tool-memory-agent','physical-vln'];
const specs=Object.fromEntries(names.map(n=>[n,readJSON(new URL(`examples/${n}/spec.json`,ROOT))]));
const copy=(name='vlm')=>structuredClone(specs[name]);
let tmp;const builds={};
before(async()=>{tmp=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-test-'));for(const n of names)builds[n]=await build(specs[n],path.join(tmp,n));});
after(async()=>{await fs.rm(tmp,{recursive:true,force:true});});

for(const name of names)test(`${name}: complete exports, valid graph, native editability, zero layout errors`,async()=>{
  const {dir,qa}=builds[name];assert.equal(qa.passed,true,JSON.stringify(qa.errors));assert.equal(qa.warnings.length,0,JSON.stringify(qa.warnings));assert.equal(qa.metrics.editableRatio,1);assert.equal(qa.metrics.logicalEdges,specs[name].edges.length);assert.ok(qa.metrics.nativeConnectors>=specs[name].edges.length);assert.equal(qa.metrics.pictures,0);
  for(const ext of ['svg','pptx','png','pdf','drawio'])assert.ok((await fs.stat(path.join(dir,`figure.${ext}`))).size>100);
  assert.ok((await sharp(path.join(dir,'figure.png')).stats()).entropy>0);
  assert.equal(XMLValidator.validate(await fs.readFile(path.join(dir,'figure.drawio'),'utf8')),true);
});
test('default is caption-free and footer-free, with metadata title retained',()=>{
  const s=copy();delete s.visual.showTitle;delete s.visual.showSubtitle;delete s.visual.showLegend;
  const scene=buildScene(s);assert.ok(!scene.texts.some(t=>['title','subtitle','legend'].includes(t.id)));assert.match(toSVG(scene),/<title>Vision-language/);
});
test('headings and legend are explicit opt-ins',()=>{
  const s=copy();Object.assign(s.visual,{showTitle:true,showSubtitle:true,showLegend:true});
  assert.deepEqual(buildScene(s).texts.filter(t=>['title','subtitle','legend'].includes(t.id)).map(t=>t.id),['title','subtitle','legend']);
});
test('global typography and per-node font override change native text',async()=>{
  const s=copy();s.visual.typography.fontFamily='Helvetica';s.visual.typography.moduleSize=28;s.layout.nodes.projector.fontSize=22;
  const scene=buildScene(s);assert.equal(scene.nodes.find(n=>n.id==='projector').texts[0].fontSize,22);assert.equal(scene.nodes.find(n=>n.id==='image').texts[0].fontSize,28);assert.ok(scene.texts.every(t=>t.fontFamily==='Helvetica'));
  const zip=await JSZip.loadAsync(await toPPTX(scene,s));assert.match(await zip.file('ppt/slides/slide1.xml').async('string'),/typeface="Helvetica"/);
});
test('duplicate node id is rejected',()=>{const s=copy();s.nodes[1].id=s.nodes[0].id;assert.throws(()=>assertSpec(s),/Duplicate/);});
test('missing endpoint is rejected',()=>{const s=copy();s.edges[0].to='missing';assert.throws(()=>assertSpec(s),/endpoint/);});
test('fabricated evidence quote is rejected',()=>{const s=copy();s.nodes[0].evidence[0].quote='A nonexistent magical image model';assert.throws(()=>assertSpec(s),/Evidence/);});
test('wrong evidence source is rejected',()=>{const s=copy();s.edges[0].evidence[0].source='missing';assert.throws(()=>assertSpec(s),/Evidence/);});
test('phase mismatch is rejected',()=>{const s=copy();s.edges.find(e=>e.id==='e6').phase='inference';assert.throws(()=>assertSpec(s),/Phase mismatch/);});
test('unmarked cycle is rejected',()=>{const s=copy('tool-memory-agent');s.edges.find(e=>e.id==='e3').kind='data';assert.throws(()=>assertSpec(s),/cycle/);});
test('unjustified novelty highlighting is rejected',()=>{const s=copy();s.nodes[0].status='proposed';assert.throws(()=>assertSpec(s),/innovation/);});
test('unknown layout node is rejected',()=>{const s=copy();s.layout.nodes.ghost={x:1,y:1,w:100,h:100};assert.throws(()=>assertSpec(s),/unknown node/);});
test('group parent cycle is rejected',()=>{const s=copy();s.groups[0].parent=s.groups[0].id;assert.throws(()=>assertSpec(s),/hierarchy cycle/);});
test('schema rejects unknown fields and invalid glyphs',()=>{const s=copy();s.nodes[0].invented=true;assert.throws(()=>assertSpec(s),/Schema/);});
test('node overlaps are detected',()=>{const scene=buildScene(copy());Object.assign(scene.nodes[1],{x:scene.nodes[0].x,y:scene.nodes[0].y});assert.ok(layoutQA(scene).errors.some(e=>e.code==='node-overlap'));});
test('text overflow is detected without reducing fonts',()=>{const s=copy();s.nodes.find(n=>n.id==='projector').label='UnbreakablyLongModelComponentNameThatDoesNotFit';assert.ok(layoutQA(buildScene(s)).errors.some(e=>e.code==='text-width'));});
test('edge through a module is detected',()=>{const s=copy();s.layout.edges.e1={via:[[400,180]]};assert.ok(layoutQA(buildScene(s)).errors.some(e=>e.code==='edge-node-occlusion'));});
test('final publication size has an independent readability gate',()=>{const s=copy();s.visual.publicationWidthIn=3.25;assert.ok(layoutQA(buildScene(s)).errors.some(e=>e.code==='print-legibility'));});
test('crossing detector distinguishes crossing from shared endpoint',()=>{assert.ok(crossing([0,5],[10,5],[5,0],[5,10]));assert.ok(!crossing([0,0],[10,0],[10,0],[10,10]));});
test('independent raster route metric catches displaced thin arrows',()=>{
  const scene={width:100,height:100,nodes:[],texts:[],edges:[{id:'edge',points:[[10,50],[90,50]]}]};
  const image=y=>{const b=Buffer.alloc(100*100*3,255);for(let x=10;x<=90;x++)b.fill(90,(y*100+x)*3,(y*100+x)*3+3);return b;};
  const ref=image(50);assert.equal(routeCoverage(scene,ref,ref)[0].passed,true);assert.equal(routeCoverage(scene,ref,image(80))[0].coverage,0);
});
test('two routes sharing a segment are reported',()=>{const scene=buildScene(copy());scene.edges[1].points=structuredClone(scene.edges[0].points);assert.ok(layoutQA(scene).warnings.some(e=>e.code==='edge-shared-segment'));});
test('automatic layout routes an unseen linear graph',()=>{
  const s=copy();s.nodes=s.nodes.slice(0,3);s.edges=s.edges.slice(0,2);s.groups=[];s.layout.nodes={};s.layout.edges={};s.visual.nodeGlyphs={};
  assert.equal(layoutQA(buildScene(s)).errors.length,0);
});
test('SVG and PPTX are byte-reproducible for identical input',async()=>{
  const scene=buildScene(copy());assert.equal(toSVG(scene),toSVG(buildScene(copy())));assert.deepEqual(await toPPTX(scene,copy()),await toPPTX(scene,copy()));
});
test('appearance candidates preserve the entire semantic graph',()=>{const s=copy(),other=copy();other.visual.theme='mono';assert.equal(digest(semanticSnapshot(s)),digest(semanticSnapshot(other)));assert.notEqual(toSVG(buildScene(s)),toSVG(buildScene(other)));});
test('output source and existing user files are preserved',async()=>{
  const dir=path.join(tmp,'protected');await fs.mkdir(dir);await fs.writeFile(path.join(dir,'note.txt'),'User work');
  await assert.rejects(build(copy(),dir),/Output exists/);await assert.rejects(build(copy(),dir,{force:true}),/manifest/);assert.equal(await fs.readFile(path.join(dir,'note.txt'),'utf8'),'User work');
});
test('tampered SVG label is detected from actual output',async()=>{
  const dir=path.join(tmp,'tamper-svg');await fs.cp(builds.vlm.dir,dir,{recursive:true});const p=path.join(dir,'figure.svg');await fs.writeFile(p,(await fs.readFile(p,'utf8')).replace('>Projector<','>Hallucination<'));
  assert.ok((await artifactQA(dir,buildScene(copy()))).errors.some(e=>e.code==='text-mismatch'));
});
test('missing native PPTX connector is detected',async()=>{
  const dir=path.join(tmp,'tamper-pptx');await fs.cp(builds.vlm.dir,dir,{recursive:true});const p=path.join(dir,'figure.pptx'),zip=await JSZip.loadAsync(await fs.readFile(p));zip.file('ppt/slides/slide1.xml',(await zip.file('ppt/slides/slide1.xml').async('string')).replace(/<p:cxnSp>.*?<\/p:cxnSp>/s,''));await fs.writeFile(p,await zip.generateAsync({type:'nodebuffer'}));
  const qa=await artifactQA(dir,buildScene(copy()));assert.ok(qa.errors.some(e=>e.code==='connector-count'));assert.ok(qa.errors.some(e=>e.code==='missing-edge'));
});
test('connector geometry corruption is detected',async()=>{
  const dir=path.join(tmp,'tamper-route');await fs.cp(builds.vlm.dir,dir,{recursive:true});const p=path.join(dir,'figure.pptx'),zip=await JSZip.loadAsync(await fs.readFile(p));
  let xml=await zip.file('ppt/slides/slide1.xml').async('string');xml=xml.replace(/<p:cxnSp>.*?<\/p:cxnSp>/s,block=>block.replace(/cx="\d+"/,'cx="9999999"'));zip.file('ppt/slides/slide1.xml',xml);await fs.writeFile(p,await zip.generateAsync({type:'nodebuffer'}));
  assert.ok((await artifactQA(dir,buildScene(copy()))).errors.some(e=>e.code==='pptx-route-mismatch'));
});
test('isolated skill installation refuses a second installation',async()=>{
  const install=fileURLToPath(new URL('scripts/install.mjs',ROOT)),dest=path.join(tmp,'installed');
  const one=spawnSync(process.execPath,[install,dest],{encoding:'utf8',timeout:15000});assert.equal(one.status,0,one.stderr);await fs.access(path.join(dest,'SKILL.md'));await fs.access(path.join(dest,'package-lock.json'));await fs.access(path.join(dest,'examples/vlm/design-reference/imagegen-v1.png'));await fs.access(path.join(dest,'assets/illustrations/vlm-scene.png'));
  const two=spawnSync(process.execPath,[install,dest],{encoding:'utf8',timeout:15000});assert.notEqual(two.status,0);
});
test('CLI executes through a symlinked installation path',async()=>{
  const alias=path.join(tmp,'skill-alias');await fs.symlink(fileURLToPath(ROOT),alias,'dir');
  const r=spawnSync(process.execPath,[path.join(alias,'scripts/paperfigure.mjs'),'help'],{encoding:'utf8',timeout:10000});assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/PaperFigure/);
});
test('renderer can be imported by a stdin-driven generation script',()=>{
  const url=new URL('scripts/paperfigure.mjs',ROOT).href;
  const r=spawnSync(process.execPath,['--input-type=module','-'],{input:`import {build} from ${JSON.stringify(url)}; console.log(typeof build);`,encoding:'utf8',timeout:10000});assert.equal(r.status,0,r.stderr);assert.equal(r.stdout.trim(),'function');
});
test('installer rejects a recursive destination before making changes',()=>{
  const install=fileURLToPath(new URL('scripts/install.mjs',ROOT)),dest=fileURLToPath(new URL('recursive-install-test',ROOT));
  const r=spawnSync(process.execPath,[install,dest],{encoding:'utf8',timeout:10000});assert.notEqual(r.status,0);assert.match(r.stderr,/outside the source/);
});
test('mechanical success cannot imply visual acceptance',async()=>{
  const {dir,qa}=builds.vlm;assert.equal(qa.passed,true);assert.equal(qa.deliveryReady,false);assert.equal((await visualReviewStatus(dir)).visualAcceptance,'unreviewed');
});
test('a rejected or stale review cannot approve delivery',async()=>{
  const dir=path.join(tmp,'review-gate');await fs.cp(builds.vlm.dir,dir,{recursive:true});await fs.mkdir(path.join(dir,'rendered-pptx'));
  await fs.copyFile(path.join(dir,'figure.png'),path.join(dir,'rendered-pptx/figure.png'));
  await fs.writeFile(path.join(dir,'rendered-pptx/render-report.json'),JSON.stringify({routeAlignmentPassed:true,pdfCheck:{rendered:true,routeAlignmentPassed:true,textComplete:true}}));
  const artifacts={};for(const n of REVIEW_ARTIFACTS)artifacts[n]=await fileHash(path.join(dir,n));
  const record={reviewer:{kind:'independent-agent',name:'Synthetic gate test fixture; not an actual visual review'},verdict:'revise',checks:Object.fromEntries(REVIEW_CHECKS.map(k=>[k,'pass'])),artifacts,reference:{path:'figure.png',sha256:await fileHash(path.join(dir,'figure.png'))}};
  const review=path.join(dir,'visual-review.json');await fs.writeFile(review,JSON.stringify(record));assert.equal((await visualReviewStatus(dir)).deliveryReady,false);
  record.verdict='accept';await fs.writeFile(review,JSON.stringify(record));assert.equal((await visualReviewStatus(dir)).deliveryReady,true);
  await fs.writeFile(path.join(dir,'user-feedback.json'),JSON.stringify({verdict:'revise',source:'User test fixture'}));assert.equal((await visualReviewStatus(dir)).deliveryReady,false);await fs.unlink(path.join(dir,'user-feedback.json'));
  await fs.appendFile(path.join(dir,'spec.json'),' ');assert.equal((await visualReviewStatus(dir)).deliveryReady,false);
});
test('reference-driven VLM preserves source semantics and native structure',async()=>{
  const spec=readJSON(new URL('examples/vlm/revisions/v2/spec.json',ROOT));assert.deepEqual(semanticSnapshot(spec),semanticSnapshot(specs.vlm));
  const result=await build(spec,path.join(tmp,'reference-vlm'));assert.equal(result.qa.passed,true,JSON.stringify(result.qa.errors));assert.equal(result.qa.metrics.pictures,1);assert.equal(result.qa.metrics.logicalEdges,6);assert.ok(result.qa.metrics.editableRatio>.98);
  const scene=buildScene(spec);assert.equal(scene.assets.length,1);assert.ok(scene.decorations.some(d=>d.owner==='e3'));assert.ok(scene.decorations.some(d=>d.owner==='e4'));
});
test('illustrations cannot escape asset roots or cover other modules',()=>{
  const s=copy();s.visual.artwork=[{id:'bad',owner:'image',type:'asset',x:0,y:0,w:200,h:200,purpose:'Invalid test',asset:'assets/../private.png'}];assert.throws(()=>assertSpec(s),/Unsafe/);
  s.visual.artwork[0].asset='assets/illustrations/vlm-scene.png';assert.ok(layoutQA(buildScene(s)).errors.some(e=>e.code==='asset-owner-bounds'));
});
test('paper-grounded native reconstruction retains gradients, math and a cropped independent input',async()=>{
  const spec=readJSON(new URL('examples/llava-paper/spec.json',ROOT)),dir=path.join(tmp,'llava-native'),r=await build(spec,dir);
  assert.equal(r.qa.passed,true,JSON.stringify(r.qa.errors));assert.equal(r.qa.metrics.logicalEdges,5);assert.equal(r.qa.metrics.pictures,1);assert.ok(r.qa.metrics.editableRatio>.98);
  const svg=await fs.readFile(path.join(dir,'figure.svg'),'utf8');assert.match(svg,/<linearGradient/);assert.match(svg,/baseline-shift="sub"/);assert.match(svg,/<svg id="viewport:art:input-photo"/);
  const z=await JSZip.loadAsync(await fs.readFile(path.join(dir,'figure.pptx'))),xml=await z.file('ppt/slides/slide1.xml').async('string');assert.match(xml,/<a:gradFill/);assert.match(xml,/<a:srcRect/);assert.match(xml,/baseline="-40000"/);
  z.file('ppt/slides/slide1.xml',xml.replace(/(<a:srcRect l=")\d+/, '$199999'));await fs.writeFile(path.join(dir,'figure.pptx'),await z.generateAsync({type:'nodebuffer'}));
  assert.ok((await artifactQA(dir,buildScene(spec))).errors.some(e=>e.code==='asset-crop'));
});
test('a corrupted native gradient is rejected',async()=>{
  const spec=readJSON(new URL('examples/llava-paper/spec.json',ROOT)),dir=path.join(tmp,'gradient-tamper');await build(spec,dir);
  const p=path.join(dir,'figure.pptx'),z=await JSZip.loadAsync(await fs.readFile(p));let xml=await z.file('ppt/slides/slide1.xml').async('string');xml=xml.replace(/<a:gradFill.*?<\/a:gradFill>/s,block=>block.replace(/<a:srgbClr val="[0-9A-Fa-f]+"/,'<a:srgbClr val="FF0000"'));z.file('ppt/slides/slide1.xml',xml);await fs.writeFile(p,await z.generateAsync({type:'nodebuffer'}));
  assert.ok((await artifactQA(dir,buildScene(spec))).errors.some(e=>e.code==='gradient-mismatch'));
});
test('PDF math keeps embedded fonts and the Greek phi glyph',async t=>{
  const spec=readJSON(new URL('examples/llava-paper/spec.json',ROOT)),dir=path.join(tmp,'pdf-math');await build(spec,dir);
  const pdf=await fs.readFile(path.join(dir,'figure.pdf'));assert.match(pdf.toString('latin1'),/\/FontFile2\b/);
  const extracted=spawnSync('pdftotext',[path.join(dir,'figure.pdf'),'-'],{encoding:'utf8',timeout:10000});
  if(extracted.error?.code==='ENOENT'){t.skip('Optional Poppler text extraction is unavailable');return;}
  assert.equal(extracted.status,0,extracted.stderr);assert.match(extracted.stdout,/φ/);assert.match(extracted.stdout,/Learned linear/);
});
test('PDF downward arrowhead follows the final edge direction',async t=>{
  const spec=readJSON(new URL('examples/blip2-opt-code/spec.json',ROOT)),dir=path.join(tmp,'blip2-downward-arrow');
  await build(spec,dir);
  const raster=spawnSync('pdftoppm',['-singlefile','-scale-to','2240','-png',path.join(dir,'figure.pdf'),path.join(dir,'pdf-arrow')],{encoding:'utf8',timeout:20000});
  if(raster.error?.code==='ENOENT'){t.skip('Optional Poppler rasterization unavailable');return;}
  assert.equal(raster.status,0,raster.stderr);
  const {data,info}=await sharp(path.join(dir,'pdf-arrow.png')).removeAlpha().raw().toBuffer({resolveWithObject:true});
  // Sample the two wings above e4's downward tip (980,280), excluding shaft/node.
  const ink=(x1,x2)=>{let n=0;for(let y=263;y<277;y++)for(let x=x1;x<x2;x++){const i=(y*info.width+x)*info.channels;if(data[i]<160&&data[i+1]<180&&data[i+2]<190)n++;}return n;};
  assert.ok(ink(969,977)>8,'Missing left downward-arrow wing');
  assert.ok(ink(984,992)>8,'Missing right downward-arrow wing; a rightward PDF marker can pass route checks');
});
for(const [name,specName] of [['react-hotpotqa','spec-reviewed.json'],['reflexion-hotpotqa','spec.json'],['voyager-agent','spec-reviewed.json']])test(`${name}: pinned code, solid semantic colors, entirely native exports`,async()=>{
  const base=new URL(`examples/${name}/`,ROOT),spec=readJSON(new URL(specName,base)),manifest=readJSON(new URL('source-manifest.json',base));
  for(const [file,record] of Object.entries(manifest.files))assert.equal(await fileHash(fileURLToPath(new URL(`source/${file}`,base))),record.sha256,`Source changed: ${file}`);
  const contract=readJSON(new URL('design-contract.json',base));
  for(const category of Object.values(contract.palette))for(const id of category.nodes){const st=spec.visual.appearances.nodes[id];assert.equal(st.fill,category.fill);assert.equal(st.stroke,category.stroke);}
  assert.ok(!JSON.stringify(spec.visual).includes('"gradient"'),'Only solid fills are allowed in current examples');
  const dir=path.join(tmp,name),r=await build(spec,dir);assert.equal(r.qa.passed,true,JSON.stringify(r.qa.errors));assert.equal(r.qa.metrics.editableRatio,1);assert.equal(r.qa.metrics.pictures,0);
  assert.ok(!buildScene(spec).texts.some(t=>['title','subtitle','legend'].includes(t.id)));
  const svg=await fs.readFile(path.join(dir,'figure.svg'),'utf8');assert.doesNotMatch(svg,/<linearGradient/);
  const z=await JSZip.loadAsync(await fs.readFile(path.join(dir,'figure.pptx')));assert.doesNotMatch(await z.file('ppt/slides/slide1.xml').async('string'),/<a:gradFill/);
});
test('BLIP-2 solid revision preserves scientific graph and removes all gradients',async()=>{
  const base=new URL('examples/blip2-opt-code/',ROOT),spec=readJSON(new URL('spec-solid.json',base)),prior=readJSON(new URL('spec-reviewed.json',base));
  for(const key of ['sources','claims','nodes','edges','groups'])assert.deepEqual(spec[key],prior[key],key);
  assert.ok(!JSON.stringify(spec.visual).includes('"gradient"'));
  const dir=path.join(tmp,'blip2-solid'),r=await build(spec,dir);assert.equal(r.qa.passed,true,JSON.stringify(r.qa.errors));
  assert.doesNotMatch(await fs.readFile(path.join(dir,'figure.svg'),'utf8'),/<linearGradient/);
  const z=await JSZip.loadAsync(await fs.readFile(path.join(dir,'figure.pptx')));assert.doesNotMatch(await z.file('ppt/slides/slide1.xml').async('string'),/<a:gradFill/);
});
test('Voyager refinement: large group labels, source examples and native solid exports',async()=>{
  const base=new URL('examples/voyager-agent/refinement/',ROOT),spec=readJSON(new URL('spec-final.json',base));
  const scene=buildScene(spec),geometry=layoutQA(scene);
  // A 36px group heading formerly overlapped the first member: fixed 52px padding was insufficient.
  assert.ok(!geometry.errors.some(e=>e.code==='text-node-overlap'&&e.objects.includes('group-label:refinement-loop')),JSON.stringify(geometry.errors));
  const group=scene.groups.find(g=>g.id==='refinement-loop'),heading=scene.texts.find(t=>t.id==='group-label:refinement-loop');
  assert.ok(heading.y+heading.h<Math.min(...scene.nodes.filter(n=>group.members.includes(n.id)).map(n=>n.y)));
  const manifest=readJSON(new URL('example-source-manifest.json',base));
  for(const [file,record] of Object.entries(manifest.files))assert.equal(await fileHash(fileURLToPath(new URL(`source/${file}`,base))),record.sha256,file);
  assert.equal(spec.edges.find(e=>e.id==='refine').label,'If not done');
  assert.ok(spec.nodes.some(n=>n.id==='feedback'&&n.role==='neutral'),'Prompt assembly is parameter-free, not an invented LM');
  assert.ok(!JSON.stringify(spec.visual).includes('"gradient"'));
  const dir=path.join(tmp,'voyager-refinement-final'),r=await build(spec,dir);assert.equal(r.qa.passed,true,JSON.stringify(r.qa.errors));assert.equal(r.qa.metrics.editableRatio,1);assert.equal(r.qa.metrics.pictures,0);
  const zip=await JSZip.loadAsync(await fs.readFile(path.join(dir,'figure.pptx'))),xml=await zip.file('ppt/slides/slide1.xml').async('string');
  assert.match(xml,/craftCraftingTable/);assert.match(xml,/If not done/);assert.doesNotMatch(xml,/<a:gradFill/);
});
