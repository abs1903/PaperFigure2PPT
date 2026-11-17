import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import JSZip from 'jszip';
import {freezeTypography,auditTypography} from '../scripts/typography-profile.mjs';import {toEditableSVG,toNativePPTX} from '../scripts/layout-export.mjs';
const base=new URL('../assets/typography/',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const id of ['agemem','memskill'])test(`accepted ${id} typography and native artifacts remain unchanged`,{timeout:30000},async()=>{const index=JSON.parse(await fs.readFile(new URL('goldens.json',base))),c=index.cases.find(c=>c.id===id),root=new URL(c.output+'/',base),read=f=>fs.readFile(new URL(f,root));for(const [f,want] of Object.entries(c.sha256))assert.equal(hash(await read(f)),want,f);const scene=JSON.parse(await read('layout-scene.json')),svg=await read('editable.svg'),bytes=await read('figure.pptx'),profile=JSON.parse(await fs.readFile(new URL(c.profile,base))),native=await toNativePPTX(scene);assert.equal(toEditableSVG(scene),svg.toString());await assertCompatibilityOnlyDelta(bytes,native.bytes);assert.ok(native.bytes.equals((await toNativePPTX(scene)).bytes),'regeneration must remain deterministic');const qa=await auditTypography(scene,svg.toString(),bytes,JSON.parse(await read('pptx-object-map.json')),profile,{renderReport:JSON.parse(await read('native-render/render-qa.json'))});if(c.knownFontIdentityFindings){assert.equal(qa.passed,false);assert.deepEqual(qa.errors.map(e=>({code:e.code,family:e.family})),c.knownFontIdentityFindings.map(e=>({code:e.code,family:e.family})));assert.equal(qa.renderedFontCoverage,false);}else{assert.equal(qa.passed,true,JSON.stringify(qa.errors));assert.equal(qa.renderedFontCoverage,true);}});
function fixture(){return {version:'1.0',width:300,height:150,modules:[{id:'a',box:[20,20,260,110],centerTextIds:['ta'],textBox:[20,20,260,110]}],edges:[],labels:[{id:'ta',owner:'a'}],primitives:[{id:'ta',type:'text',seq:0,owner:'a',box:[60,55,150,35],text:'Agent memory',positions:[[60,85]],font:'Arial',size:25,bold:true,italic:false,fill:'#000000',angle:0}],exceptions:[]};}
test('actual SVG/native font, size and weight substitutions fail a frozen profile',{timeout:30000},async()=>{const s=fixture(),profile=freezeTypography(s,{kind:'user-specified',locator:'unit fixture',notes:'Synthetic regression data, not a source font-identification claim.'}),native=await toNativePPTX(s),zip=await JSZip.loadAsync(native.bytes),file='ppt/slides/slide1.xml';let xml=await zip.file(file).async('string');xml=xml.replace('typeface="Arial"','typeface="Courier New"').replace('sz="1875"','sz="1975"').replace('b="1"','b="0"');zip.file(file,xml);const q=await auditTypography(s,toEditableSVG(s).replace('font-family="Arial"','font-family="Times New Roman"'),await zip.generateAsync({type:'nodebuffer'}),native.map,profile);for(const code of ['native-font-family-drift','native-font-size-drift','native-font-style-drift','svg-font-family-drift'])assert.ok(q.errors.some(e=>e.code===code),code);});
test('choosing a font is distinct from observing it in an actual Office render',{timeout:30000},async()=>{const s=fixture(),profile=freezeTypography(s,{kind:'image-approximation',locator:'synthetic image',notes:'Approximate Arial chosen for a test, not identified from raster pixels.'}),p=await toNativePPTX(s),q=await auditTypography(s,toEditableSVG(s),p.bytes,p.map,profile,{renderReport:{renderedFonts:['TimesNewRomanPSMT']}});assert.equal(q.renderedFontCoverage,false);assert.ok(q.errors.some(e=>e.code==='rendered-font-not-observed'));});

test('PDF face normalization is explicit and never mutates the accepted source scene',async()=>{const {normalizeTypographyFaces}=await import('../scripts/typography-profile.mjs');const s=fixture();s.primitives[0].font='Verdana-Bold';assert.throws(()=>freezeTypography(s,{kind:'source-pdf',locator:'source',notes:'Known source face'}),/PostScript face/);const r=normalizeTypographyFaces(s);assert.equal(s.primitives[0].font,'Verdana-Bold');assert.equal(r.scene.primitives[0].font,'Verdana');assert.equal(r.scene.primitives[0].bold,true);assert.equal(r.scene.primitives[0].sourceFont,'Verdana-Bold');assert.equal(r.changes.length,1);});

// Historical goldens stay byte-frozen. Newly emitted files may contain only the
// declared ECMA packaging repair; all drawing data and other ZIP parts are exact.
async function assertCompatibilityOnlyDelta(before,after){
 const a=await JSZip.loadAsync(before),b=await JSZip.loadAsync(after);
 const names=Object.keys(a.files).filter(k=>!a.files[k].dir).sort();
 assert.deepEqual(Object.keys(b.files).filter(k=>!b.files[k].dir).sort(),names);
 for(const name of names){
  const old=await a.file(name).async('string'),next=await b.file(name).async('string');
  if(name==='[Content_Types].xml'){
   assert.equal(next.replace(/<Default Extension="json" ContentType="application\/json"\/>/,''),old);
  }else if(/^ppt\/slides\/slide\d+\.xml$/.test(name)){
   assert.equal(next,old.replace(/ xml:space="preserve"/g,''),name);
  }else if(name==='ppt/presentation.xml'){
   const notes=old.match(/<p:notesMasterIdLst>.*?<\/p:notesMasterIdLst>/s)?.[0];
   const expected=notes?old.replace(notes,'').replace(/<p:(handoutMasterIdLst|sldIdLst|sldSz|notesSz)\b/,m=>notes+m):old;
   assert.equal(next,expected,name);
  }else assert.ok((await a.file(name).async('nodebuffer')).equals(await b.file(name).async('nodebuffer')),name);
 }
}
