#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {readJSON} from './spec.mjs';
import {routeCoverage} from './render-metrics.mjs';

// Optional independent rendering. Never reports success if office/poppler is absent.
// Each child has a hard timeout; no application GUI or shared Office profile is used.
const dir=path.resolve(process.argv[2]??'.');
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-office-'));
const output=path.join(dir,'rendered-pptx');await fs.mkdir(output,{recursive:true});
let report;
function run(cmd,args,timeout){
  const r=spawnSync(cmd,args,{timeout,encoding:'utf8',maxBuffer:1024*1024});
  if(r.error||r.status!==0)throw new Error(`${cmd}: ${r.error?.message??r.stderr??r.stdout}`);
  return (r.stdout??'').trim();
}
try{
  const scene=readJSON(path.join(dir,'scene.json'));
  const office=process.env.PAPERFIGURE_SOFFICE??'soffice',poppler=process.env.PAPERFIGURE_PDFTOPPM??'pdftoppm';
  const log=run(office,[`-env:UserInstallation=${new URL(`file://${profile}`).href}`,'--headless','--convert-to','pdf','--outdir',output,path.join(dir,'figure.pptx')],45000);
  await fs.access(path.join(output,'figure.pdf'));
  run(poppler,['-png','-singlefile','-scale-to-x',String(scene.width),'-scale-to-y',String(scene.height),path.join(output,'figure.pdf'),path.join(output,'figure')],20000);
  const ref=await sharp(path.join(dir,'figure.png')).resize(scene.width,scene.height).removeAlpha().raw().toBuffer();
  const cand=await sharp(path.join(output,'figure.png')).resize(scene.width,scene.height).removeAlpha().raw().toBuffer();
  let diff=0,darkA=0,darkB=0,union=0,intersection=0;
  const heat=Buffer.alloc(scene.width*scene.height*3);
  for(let i=0;i<ref.length;i+=3){
    const a=Math.min(...ref.subarray(i,i+3))<170,b=Math.min(...cand.subarray(i,i+3))<170;
    darkA+=a;darkB+=b;union+=a||b;intersection+=a&&b;
    for(let c=0;c<3;c++){const d=Math.abs(ref[i+c]-cand[i+c]);diff+=d;heat[i+c]=255-d;}
  }
  await sharp(heat,{raw:{width:scene.width,height:scene.height,channels:3}}).png().toFile(path.join(output,'difference.png'));
  await sharp({create:{width:scene.width*2,height:scene.height,channels:3,background:'#fff'}}).composite([
    {input:await sharp(path.join(dir,'figure.png')).resize(scene.width,scene.height).toBuffer(),left:0,top:0},
    {input:await sharp(path.join(output,'figure.png')).resize(scene.width,scene.height).toBuffer(),left:scene.width,top:0}
  ]).png().toFile(path.join(output,'side-by-side.png'));
  const routes=routeCoverage(scene,ref,cand),routeAlignmentPassed=routes.every(r=>r.passed);
  const pdfOutput=path.join(dir,'rendered-pdf');await fs.mkdir(pdfOutput,{recursive:true});
  run(poppler,['-png','-singlefile','-scale-to-x',String(scene.width),'-scale-to-y',String(scene.height),path.join(dir,'figure.pdf'),path.join(pdfOutput,'figure')],20000);
  const pdfImage=await sharp(path.join(pdfOutput,'figure.png')).removeAlpha().raw().toBuffer();
  const pdfRoutes=routeCoverage(scene,ref,pdfImage),pdfRouteAlignmentPassed=pdfRoutes.every(r=>r.passed);
  const pdfText=run(process.env.PAPERFIGURE_PDFTOTEXT??'pdftotext',[path.join(dir,'figure.pdf'),'-'],10000);
  const normalize=s=>s.replace(/\s/g,'');const missingLabels=scene.texts.filter(t=>!normalize(pdfText).includes(normalize(t.text))).map(t=>t.id);
  await fs.writeFile(path.join(pdfOutput,'text.txt'),pdfText+'\n');
  const pdfCheck={rendered:true,routeAlignmentPassed:pdfRouteAlignmentPassed,textComplete:missingLabels.length===0,missingLabels,routes:pdfRoutes};
  report={status:'rendered',renderer:office,log,routeAlignmentPassed,routes,pdfCheck,normalizedPixelMAE:diff/ref.length/255,darkForegroundIoU:intersection/(union||1),foregroundPixelRatio:darkB/(darkA||1),limits:'Route ink alignment is an objective check with a 3px tolerance and 90% minimum per edge. PDF text extraction checks label presence including math glyphs, not visual typography. Pixel similarity is diagnostic, not an aesthetic score; independent visual review remains necessary.'};
  if(!routeAlignmentPassed||!pdfRouteAlignmentPassed||missingLabels.length)process.exitCode=2;
}catch(e){report={status:'unverified',reason:e.message};process.exitCode=2;}
finally{await fs.rm(profile,{recursive:true,force:true});}
await fs.writeFile(path.join(output,'render-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
