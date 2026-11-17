import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import crypto from 'node:crypto';
import {inspectNativeSVG,checkReconstruction} from '../scripts/reconstruction-check.mjs';
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60"><rect id="bg" width="120" height="60" fill="white"/><g id="encoder" data-role="module"><rect id="box" x="10" y="10" width="60" height="35" fill="#E8F0F7" stroke="#14344B"/><text id="label" x="20" y="32" font-size="12" font-family="Arial">Encoder</text></g><g id="edge" data-role="edge"><path id="route" d="M 70 25 H 110" stroke="#14344B" fill="none"/></g></svg>`;
const inventory={version:'1.0',reference:{width:120,height:60,sha256:'0'.repeat(64)},expectedCounts:{modules:1,edges:1,icons:0,labels:1},labels:[{id:'label',text:'Encoder',owner:'encoder',referenceRegion:[20,20,50,15]}],groups:[{id:'encoder',role:'module',referenceRegion:[10,10,60,35]},{id:'edge',role:'edge',referenceRegion:[70,24,40,2]}],objects:[{id:'box',kind:'shape',owner:'encoder',referenceRegion:[10,10,60,35]},{id:'route',kind:'connector',owner:'edge',referenceRegion:[70,24,40,2]}],backgroundIds:['bg']};
const bind=async p=>({...inventory,reference:{width:120,height:60,sha256:crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex')}});
test('native reconstruction inventory preserves text, vector ownership and roles',()=>{
 const a=inspectNativeSVG(svg,inventory);assert.deepEqual(a.errors,[]);assert.equal(a.counts.nativeTextElements,1);assert.equal(a.counts.semanticGroups,2);assert.equal(a.counts.rasterElements,0);
});
test('a screenshot behind native labels cannot pass the native SVG check',()=>{
 const bad=svg.replace('<g id="encoder"','<image href="data:image/png;base64,AA==" width="120" height="60"/><g id="encoder"');
 const a=inspectNativeSVG(bad,inventory);assert.ok(a.errors.some(e=>e.code==='non-native-content'));
});
test('outlined-label substitution fails even though paths are valid icon geometry',()=>{
 const bad=svg.replace(/<text[^>]*>Encoder<\/text>/,'<path id="label" d="M 20 20 H 40"/>');
 const a=inspectNativeSVG(bad,inventory);assert.ok(a.errors.some(e=>e.code==='missing-native-text'));assert.ok(a.errors.some(e=>e.code==='no-native-text'));
});
test('unowned vectors and duplicate IDs are reported',()=>{
 const bad=svg.replace('</svg>','<rect id="box" x="0" y="0" width="4" height="4"/></svg>');
 const a=inspectNativeSVG(bad,inventory);assert.ok(a.errors.some(e=>e.code==='ungrouped-object'));assert.ok(a.errors.some(e=>e.code==='duplicate-id'));
});
test('local quoted paint URLs are allowed; resource-loading URLs are not',()=>{
 const good=svg.replace('fill="#E8F0F7"',`fill="url('#paint')"`);assert.ok(!inspectNativeSVG(good,inventory).errors.some(e=>e.code==='external-resource'));
 const bad=svg.replace('fill="#E8F0F7"','fill="url(https://example.invalid/picture.png)"');assert.ok(inspectNativeSVG(bad,inventory).errors.some(e=>e.code==='external-resource'));
});
test('comparison renders original size and exposes visual drift without approving it',async()=>{
 const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-reconstruct-'));
 try{
  const reference=path.join(tmp,'ref.png'),vector=path.join(tmp,'figure.svg'),inv=path.join(tmp,'inventory.json');
  await sharp(Buffer.from(svg),{density:96}).resize({width:120,height:60,fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).png().toFile(reference);
  const original=await fs.readFile(reference);
  await fs.writeFile(vector,svg);await fs.writeFile(inv,JSON.stringify(await bind(reference)));
  const r=await checkReconstruction({reference,svg:vector,inventory:inv,out:path.join(tmp,'same')});
  assert.equal(r.diagnostics.normalizedRGBMAE,0);assert.equal(r.deliveryReady,false);assert.equal(r.visualAcceptance,'unreviewed');
  const size=await sharp(path.join(tmp,'same/preview.png')).metadata();assert.equal(size.width,120);assert.equal(size.height,60);
  for(const name of ['overlay.png','difference.png','side-by-side.png','report.json'])assert.ok((await fs.stat(path.join(tmp,'same',name))).size>0);
  await fs.writeFile(vector,svg.replace('x="10" y="10"','x="20" y="10"'));
  const drift=await checkReconstruction({reference,svg:vector,inventory:inv,out:path.join(tmp,'shifted')});assert.ok(drift.diagnostics.normalizedRGBMAE>0);
  await assert.rejects(checkReconstruction({reference,svg:vector,inventory:inv,out:path.join(tmp,'same')}),/exists/);
  assert.deepEqual(await fs.readFile(reference),original,'The supplied reference must remain byte-identical');
 }finally{await fs.rm(tmp,{recursive:true,force:true});}
});
test('aspect-ratio changes fail instead of being hidden by resizing',async()=>{
 const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-aspect-'));
 try{
  const reference=path.join(tmp,'ref.png'),vector=path.join(tmp,'bad.svg'),inv=path.join(tmp,'inventory.json');
  await sharp({create:{width:120,height:60,channels:3,background:'white'}}).png().toFile(reference);
  await fs.writeFile(vector,svg.replace('width="120" height="60" viewBox','width="120" height="100" viewBox'));await fs.writeFile(inv,JSON.stringify(await bind(reference)));
  const r=await checkReconstruction({reference,svg:vector,inventory:inv,out:path.join(tmp,'check')});assert.ok(r.native.errors.some(e=>e.code==='aspect-ratio'));assert.equal(r.deliveryReady,false);
 }finally{await fs.rm(tmp,{recursive:true,force:true});}
});

test('definition and hidden-label substitutions cannot satisfy visible native text',()=>{
 const inDefs=svg.replace('<text id="label"', '<defs><text id="label"').replace('Encoder</text>','Encoder</text></defs>');
 assert.ok(inspectNativeSVG(inDefs,inventory).errors.some(e=>e.code==='hidden-native-text'));
 for(const style of ['opacity="0"','style="opacity:0%"','display="none"','visibility="hidden"','font-size="0"','fill="transparent"']){
  const hidden=style==='font-size="0"'?svg.replace('font-size="12"','font-size="0"'):svg.replace('<g id="encoder"',`<g ${style} id="encoder"`);
  assert.ok(inspectNativeSVG(hidden,inventory).errors.some(e=>e.code==='hidden-native-text'),style);
 }
});
test('catch-all roles, missing vector ledger entries and wrong semantic owners fail',()=>{
 const broad=structuredClone(inventory);broad.groups[0].role='figure';assert.throws(()=>inspectNativeSVG(svg,broad),/module\/edge\/icon\/container/);
 const incomplete=structuredClone(inventory);incomplete.objects=[];assert.ok(inspectNativeSVG(svg,incomplete).errors.some(e=>e.code==='undeclared-vector'));
 const wrong=structuredClone(inventory);wrong.labels[0].owner='edge';assert.ok(inspectNativeSVG(svg,wrong).errors.some(e=>e.code==='label-owner'));
});
test('explicit photograph exception does not silently pass a strict native audit',()=>{
 const claimed={...inventory,rasterExceptions:[{id:'photo',reason:'Photograph approved separately'}]};
 const mixed=svg.replace('</svg>','<image id="photo" href="data:image/png;base64,AA=="/></svg>');
 assert.ok(inspectNativeSVG(mixed,claimed).errors.some(e=>e.code==='non-native-content'));
});

test('hidden tspan glyphs and definition-only semantic groups cannot count as visible',()=>{
 const hiddenRun=svg.replace('>Encoder</text>','><tspan opacity="0">Encoder</tspan></text>');
 assert.ok(inspectNativeSVG(hiddenRun,inventory).errors.some(e=>e.code==='hidden-native-text'));
 const defGroup=svg.replace('<g id="edge"','<defs><g id="edge"').replace('</g></svg>','</g></defs></svg>');
 assert.ok(inspectNativeSVG(defGroup,inventory).errors.some(e=>e.code==='missing-group'));
});

test('singular transforms and zero text length cannot masquerade as visible labels',()=>{
 for(const transform of ['matrix(0 0 0 0 0 0)','matrix(1 0 0 0 0 0)']){
  const hidden=svg.replace('<g id="encoder"',`<g transform="${transform}" id="encoder"`);
  assert.ok(inspectNativeSVG(hidden,inventory).errors.some(e=>e.code==='hidden-native-text'));
 }
 const squeezed=svg.replace('<text id="label"','<text textLength="0" id="label"');
 assert.ok(inspectNativeSVG(squeezed,inventory).errors.some(e=>e.code==='hidden-native-text'));
});
