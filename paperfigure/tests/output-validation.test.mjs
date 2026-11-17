import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import JSZip from 'jszip';
import sharp from 'sharp';
import {build} from '../scripts/paperfigure.mjs';
import {validateOutput} from '../scripts/output-validation.mjs';
import {fileHash} from '../scripts/delivery-status.mjs';
import {toEditableSVG} from '../scripts/layout-export.mjs';

const cli=new URL('../scripts/paperfigure.mjs',import.meta.url).pathname;
async function temporary(t){const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-output-qa-'));t.after(()=>fs.rm(dir,{recursive:true,force:true}));return dir;}

async function assertNoOpQA(dir,report,mode){
  const before=await fileHash(path.join(dir,report));
  const result=spawnSync(process.execPath,[cli,'qa','--out',dir],{encoding:'utf8',timeout:30000});
  assert.equal(result.status,0,result.stderr);
  const status=JSON.parse(result.stdout);
  assert.equal(status.mode,mode);assert.equal(status.mechanicalPassed,true);
  assert.equal(status.deliveryReady,false);assert.equal(status.visualAcceptance,'unreviewed');
  assert.equal(await fileHash(path.join(dir,report)),before,'no-op QA must preserve reviewed report bytes');
  assert.deepEqual(status,JSON.parse(await fs.readFile(path.join(dir,'delivery.json'))));
}

test('design QA refreshes evidence from actual SVG and preserves no-op report bytes',{timeout:30000},async t=>{
  const tmp=await temporary(t),dir=path.join(tmp,'output');
  const spec=JSON.parse(await fs.readFile(new URL('../examples/react-hotpotqa/spec-reviewed.json',import.meta.url)));
  const result=await build(spec,dir);assert.equal(result.status.mode,'design');
  await assertNoOpQA(dir,'qa.json','design');
  const file=path.join(dir,'figure.svg');
  await fs.writeFile(file,(await fs.readFile(file,'utf8')).replace('</svg>','<text id="injected-label" x="1" y="1">Unaccounted label</text></svg>'));
  const status=await validateOutput(dir);
  assert.equal(status.mechanicalPassed,false);assert.equal(status.validation.mechanical.status,'fail');
  assert.equal(JSON.parse(await fs.readFile(path.join(dir,'qa.json'))).passed,false);
});

test('reconstruct and QA use the shared contract and detect undeclared native-picture substitution',{timeout:60000},async t=>{
  const tmp=await temporary(t),dir=path.join(tmp,'output');
  const scene={version:'1.0',width:100,height:100,
    modules:[{id:'a',box:[10,20,50,40],anchorShapeId:'box-a'}],labels:[],edges:[],
    primitives:[{id:'box-a',type:'path',seq:0,owner:'a',box:[10,20,50,40],commands:[['M',10,20],['L',60,20],['L',60,60],['L',10,60],['Z']],fill:'#DDDDDD',stroke:'#000000',width:1}]};
  const reference=path.join(tmp,'reference.png');await sharp(Buffer.from(toEditableSVG(scene))).png().toFile(reference);
  const contract={version:'1.0',mode:'reconstruct',reference:{path:'reference.png',sha256:await fileHash(reference),width:100,height:100},regions:[{module:'a',box:[10,20,50,40]}]};
  await fs.writeFile(path.join(tmp,'scene.json'),JSON.stringify(scene));await fs.writeFile(path.join(tmp,'contract.json'),JSON.stringify(contract));
  const result=spawnSync(process.execPath,[cli,'reconstruct','--scene',path.join(tmp,'scene.json'),'--contract',path.join(tmp,'contract.json'),'--out',dir],{encoding:'utf8',timeout:30000});
  assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).mode,'reconstruct');
  await assertNoOpQA(dir,'reference-layout-qa.json','reconstruct');
  await assertNoOpQA(dir,'layout-qa.json','reconstruct');
  const pptx=path.join(dir,'figure.pptx'),zip=await JSZip.loadAsync(await fs.readFile(pptx)),slide='ppt/slides/slide1.xml';
  const xml=await zip.file(slide).async('string');
  zip.file(slide,xml.replace('</p:spTree>','<p:pic><p:nvPicPr><p:cNvPr id="999" name="injected-picture"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill/><p:spPr/></p:pic></p:spTree>'));
  await fs.writeFile(pptx,await zip.generateAsync({type:'nodebuffer'}));
  const status=await validateOutput(dir);
  assert.equal(status.mechanicalPassed,false);assert.equal(status.validation.mechanical.status,'fail');
  const audit=JSON.parse(await fs.readFile(path.join(dir,'native-audit.json')));
  assert.ok(audit.errors.some(e=>e.code==='raster-or-image-substitution'));
});
