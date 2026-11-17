#!/usr/bin/env node
// Diagnostics for authored SVG, not an automatic PNG vectorizer or a fidelity verdict.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',parseTagValue:false,trimValues:false});
const local=s=>s.split(':').at(-1),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const normalized=s=>String(s).replace(/\s+/g,' ').trim();
const externalPaint=s=>[...String(s).matchAll(/url\(([^)]*)\)/gi)].some(m=>!m[1].trim().replace(/^['"]|['"]$/g,'').startsWith('#'));
const drawable=new Set(['text','rect','path','line','circle','ellipse','polygon','polyline','use']);
const roles=new Set(['module','edge','icon','container']);
const kinds=new Set(['shape','connector','icon-part','decoration']);
const fraction=(v,fallback=1)=>v===undefined?fallback:parseFloat(v)*(String(v).trim().endsWith('%')?.01:1);
const invisibleColor=v=>['none','transparent'].includes(String(v).toLowerCase())||/^#(?:[0-9a-f]{3}0|[0-9a-f]{6}00)$/i.test(String(v));
const region=r=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&r[2]>0&&r[3]>0;
const inlineStyle=a=>Object.fromEntries(String(a.style??'').split(';').filter(x=>x.includes(':')).map(x=>{const i=x.indexOf(':');return [x.slice(0,i).trim(),x.slice(i+1).trim()];}));
const nonvisual=new Set(['defs','marker','clipPath','mask','symbol','metadata','title','desc']);
const textContent=items=>items.map(item=>Object.entries(item).filter(([k])=>k!==':@').map(([k,v])=>k==='#text'?String(v):Array.isArray(v)?textContent(v):'').join('')).join('');

export function inspectNativeSVG(xml,inventory){
  const errors=[],warnings=[],objects=[],ids=new Map();
  const fail=(code,id,message)=>errors.push({code,id,message});
  if(XMLValidator.validate(xml)!==true)throw new Error('SVG XML is not well formed');
  if(/<!DOCTYPE/i.test(xml))throw new Error('DOCTYPE is not supported by this reconstruction checker');
  if(inventory.version!=='1.0'||!Array.isArray(inventory.labels)||!Array.isArray(inventory.groups)||!inventory.groups.length||!Array.isArray(inventory.objects))throw new Error('Version 1.0 inventory requires labels, semantic groups and vector objects');
  if(!inventory.reference||!Number.isFinite(inventory.reference.width)||!Number.isFinite(inventory.reference.height)||!/^[a-f0-9]{64}$/i.test(inventory.reference.sha256??''))throw new Error('Inventory must bind actual PNG dimensions and SHA-256');
  const expectedGroups=new Map(),expectedLabels=new Map(),expectedObjects=new Map();
  for(const g of inventory.groups){if(!g.id||!roles.has(g.role)||!region(g.referenceRegion)||expectedGroups.has(g.id))throw new Error('Semantic groups require unique IDs, module/edge/icon/container roles and reference regions');expectedGroups.set(g.id,g);}
  for(const t of inventory.labels){if(!t.id||typeof t.text!=='string'||!expectedGroups.has(t.owner)||!region(t.referenceRegion)||expectedLabels.has(t.id))throw new Error('Labels require unique IDs, text, declared owner and reference region');expectedLabels.set(t.id,t);}
  for(const o of inventory.objects){if(!o.id||!kinds.has(o.kind)||!expectedGroups.has(o.owner)||!region(o.referenceRegion)||expectedObjects.has(o.id))throw new Error('Vector objects require unique IDs, kind, semantic owner and reference region');expectedObjects.set(o.id,o);}
  const allIds=[...expectedGroups.keys(),...expectedLabels.keys(),...expectedObjects.keys(),...(inventory.backgroundIds??[])];if(new Set(allIds).size!==allIds.length)throw new Error('Inventory IDs must be unique across categories');
  const counts=inventory.expectedCounts;if(!counts||!['modules','edges','icons','labels'].every(k=>Number.isInteger(counts[k])&&counts[k]>=0))throw new Error('Record source-inventoried expected module/edge/icon/label counts');
  for(const [key,role] of [['modules','module'],['edges','edge'],['icons','icon']])if(counts[key]!==inventory.groups.filter(g=>g.role===role).length)fail('inventory-count',key,'Group counts do not match the declared source ledger');
  if(counts.labels!==inventory.labels.length)fail('inventory-count','labels','Label count does not match source ledger');
  let root;
  function walk(items,owner=null,inDefinitions=false,parent={opacity:1,hiddenDisplay:false,collapsed:false,paint:{fill:'black',stroke:'none','font-size':'16',visibility:'visible'}}){
    for(const item of items)for(const [name,children] of Object.entries(item)){
      if(name===':@'||name.startsWith('#')||name.startsWith('?'))continue;
      const tag=local(name),attrs=item[':@']??{},id=attrs.id;
      if(!root){if(tag!=='svg')throw new Error('Root element must be SVG');root=attrs;}
      if(id&&ids.has(id))fail('duplicate-id',id,'IDs must be unique');
      const group=tag==='g'&&expectedGroups.has(id)?id:owner;
      const own={...attrs,...inlineStyle(attrs)},paint={...parent.paint,...own};
      const opacity=parent.opacity*fraction(own.opacity);
      const hiddenDisplay=parent.hiddenDisplay||own.display==='none';
      const transform=String(own.transform??'');
      const zeroScale=[...transform.matchAll(/scale\(([^)]*)\)/g)].some(m=>m[1].split(/[ ,]+/).filter(Boolean).some(x=>Number(x)===0));
      const singularMatrix=[...transform.matchAll(/matrix\(([^)]*)\)/g)].some(m=>{const v=m[1].trim().split(/[ ,]+/).map(Number);return v.length===6&&v.every(Number.isFinite)&&v[0]*v[3]-v[1]*v[2]===0;});
      const collapsed=parent.collapsed||zeroScale||singularMatrix;
      const noFill=invisibleColor(paint.fill)||fraction(paint['fill-opacity'])===0;
      const noStroke=invisibleColor(paint.stroke)||fraction(paint['stroke-opacity'])===0;
      const hidden=hiddenDisplay||opacity===0||['hidden','collapse'].includes(paint.visibility)||parseFloat(paint['font-size'])===0||(own.textLength!==undefined&&parseFloat(own.textLength)===0)||collapsed||(tag==='text'&&noFill&&noStroke);
      const defined=inDefinitions||nonvisual.has(tag);
      const entry={tag,id,attrs,owner:group,inDefinitions:defined,hidden};
      if(tag==='text')entry.text=textContent(children);
      if(tag!=='text'&&parent.textRoot&&hidden&&textContent(Array.isArray(children)?children:[]).trim())parent.textRoot.hiddenContent=true;
      objects.push(entry);if(id)ids.set(id,entry);
      if(['image','foreignObject','script'].includes(tag))fail('non-native-content',id,`${tag} is forbidden in the strict native reconstruction check`);
      for(const [key,value] of Object.entries(attrs)){
        if(/^on/i.test(key))fail('active-content',id,'Event handlers are unsupported');
        if(local(key)==='href'&&!String(value).startsWith('#'))fail('external-resource',id,'Only local fragment references are supported');
        if(externalPaint(value))fail('external-resource',id,'Only internal SVG paint/clip resources are supported');
      }
      if(tag==='style')fail('stylesheet-unverified',id,'The strict audit requires explicit presentation/inline styles so label visibility is auditable');
      if(drawable.has(tag)&&!defined&&!group&&!(inventory.backgroundIds??[]).includes(id))fail('ungrouped-object',id,`${tag} must have a declared semantic group owner`);
      if(drawable.has(tag)&&tag!=='text'&&!defined&&!(inventory.backgroundIds??[]).includes(id)&&!expectedObjects.has(id))fail('undeclared-vector',id,'Account for each independently editable vector object in the source ledger');
      if(Array.isArray(children))walk(children,group,defined,{opacity,hiddenDisplay,collapsed,paint,textRoot:tag==='text'?entry:parent.textRoot});
    }
  }
  walk(parser.parse(xml));
  for(const [id,g] of expectedGroups){const actual=ids.get(id);if(actual?.tag!=='g'||actual.inDefinitions||actual.hidden)fail('missing-group',id,'Expected visible semantic <g> is missing or hidden');else if(actual.attrs['data-role']&&actual.attrs['data-role']!==g.role)fail('group-role',id,'data-role disagrees with inventory');}
  for(const [id,label] of expectedLabels){const actual=ids.get(id);if(actual?.tag!=='text')fail('missing-native-text',id,'Expected label must be native <text>, never outlined glyphs');else if(actual.inDefinitions||actual.hidden||actual.hiddenContent)fail('hidden-native-text',id,'Declared labels must be visibly rendered, not in definitions or zero-opacity/hidden groups');else if(actual.owner!==label.owner)fail('label-owner',id,'Native label has the wrong semantic owner');else if(normalized(actual.text)!==normalized(label.text))fail('label-content',id,'Native text differs from the inventory');}
  for(const [id,o] of expectedObjects){const actual=ids.get(id);if(!actual||!drawable.has(actual.tag)||actual.tag==='text'||actual.inDefinitions)fail('missing-vector',id,'Expected native vector geometry is missing');else{if(actual.owner!==o.owner)fail('vector-owner',id,'Vector belongs to the wrong semantic owner');if(o.kind==='connector'&&(!['path','line','polyline'].includes(actual.tag)||expectedGroups.get(o.owner)?.role!=='edge'))fail('connector-owner',id,'Connectors require independent edge groups and path/line/polyline geometry');if(o.kind==='icon-part'&&expectedGroups.get(o.owner)?.role!=='icon')fail('icon-owner',id,'Icon parts require an independent icon group');}}
  for(const id of inventory.backgroundIds??[])if(ids.get(id)?.tag!=='rect')fail('background-kind',id,'Background exemptions are limited to declared rectangle elements');
  const texts=objects.filter(o=>o.tag==='text'&&!o.inDefinitions&&!o.hidden&&!o.hiddenContent);
  for(const t of texts)if(!expectedLabels.has(t.id))fail('undeclared-label',t.id,'Account for each native label in the inventory');
  if(!texts.length)fail('no-native-text',null,'No native text labels were found; outlined words cannot be accepted as editable text');
  warnings.push('The checker cannot identify outlined words among legitimate icon paths, recover fonts, OCR the PNG, fully resolve clipping/paint effects or prove the inventory is complete. Inspect manually.');
  return {errors,warnings,root,counts:{semanticGroups:expectedGroups.size,nativeTextElements:texts.length,vectorElements:objects.filter(o=>drawable.has(o.tag)&&o.tag!=='text'&&!o.inDefinitions).length,rasterElements:objects.filter(o=>o.tag==='image').length}};
}

export async function checkReconstruction({reference,svg,inventory,out}){
  const target=path.resolve(out);
  try{await fs.access(target);throw new Error('Comparison output exists; use a new directory');}catch(e){if(e.code!=='ENOENT')throw e;}
  const [refBytes,svgBytes,invBytes]=await Promise.all([fs.readFile(reference),fs.readFile(svg),fs.readFile(inventory)]);
  const meta=await sharp(refBytes).metadata();if(meta.format!=='png')throw new Error('Reference must be PNG');
  const manifest=JSON.parse(invBytes),audit=inspectNativeSVG(svgBytes.toString('utf8'),manifest);
  if(manifest.reference.sha256!==hash(refBytes)||manifest.reference.width!==meta.width||manifest.reference.height!==meta.height)audit.errors.push({code:'reference-ledger',message:'Inventory does not match the frozen PNG hash/dimensions'});
  if(!audit.errors.length){
    const svgMeta=await sharp(svgBytes).metadata();
    if(Math.abs(svgMeta.width/svgMeta.height-meta.width/meta.height)>.001)audit.errors.push({code:'aspect-ratio',message:'SVG canvas aspect differs from reference PNG; preserve the layout rather than stretching it'});
  }
  const report={mode:'png-native-reconstruction',reference:{path:path.resolve(reference),sha256:hash(refBytes),width:meta.width,height:meta.height},svg:{path:path.resolve(svg),sha256:hash(svgBytes)},inventory:{path:path.resolve(inventory),sha256:hash(invBytes)},native:audit,visualAcceptance:'unreviewed',deliveryReady:false,limits:['Structural checks and pixel diagnostics are not fidelity or aesthetic acceptance.','PPTX native editability and independent rendering require separate review.']};
  await fs.mkdir(target); // Atomic refusal if another process claimed this directory.
  if(!audit.errors.length){
    const options={width:meta.width,height:meta.height,fit:'contain',background:{r:255,g:255,b:255,alpha:0}};
    const preview=await sharp(svgBytes,{density:96}).resize(options).png().toBuffer();
    await fs.writeFile(path.join(target,'preview.png'),preview);
    const rgba=async b=>sharp(b).toColourspace('srgb').ensureAlpha().raw().toBuffer();
    const [a,b]=await Promise.all([rgba(refBytes),rgba(preview)]);
    const n=meta.width*meta.height,rgbA=Buffer.alloc(n*3),rgbB=Buffer.alloc(n*3),overlay=Buffer.alloc(n*3),diff=Buffer.alloc(n*3);
    let error=0,alphaError=0;
    for(let i=0;i<n;i++){
      const aa=a[i*4+3]/255,ab=b[i*4+3]/255;alphaError+=Math.abs(a[i*4+3]-b[i*4+3]);
      for(let c=0;c<3;c++){const j=i*3+c,x=Math.round(a[i*4+c]*aa+255*(1-aa)),y=Math.round(b[i*4+c]*ab+255*(1-ab)),d=Math.abs(x-y);rgbA[j]=x;rgbB[j]=y;overlay[j]=Math.round((x+y)/2);diff[j]=Math.min(255,d*4);error+=d;}
    }
    const raw={width:meta.width,height:meta.height,channels:3};
    const png=buf=>sharp(buf,{raw}).png().toBuffer();
    const [refWhite,renderWhite,over,delta]=await Promise.all([png(rgbA),png(rgbB),png(overlay),png(diff)]);
    await fs.writeFile(path.join(target,'overlay.png'),over);await fs.writeFile(path.join(target,'difference.png'),delta);
    await sharp({create:{width:meta.width*2,height:meta.height,channels:3,background:'white'}}).composite([{input:refWhite,left:0,top:0},{input:renderWhite,left:meta.width,top:0}]).png().toFile(path.join(target,'side-by-side.png'));
    report.diagnostics={normalizedRGBMAE:error/(n*3*255),normalizedAlphaMAE:alphaError/(n*255),comparisonBackground:'white',differenceAmplification:4,threshold:'none; inspect each region'};
    report.comparisonArtifacts={};for(const name of ['preview.png','overlay.png','difference.png','side-by-side.png'])report.comparisonArtifacts[name]=await fileDigest(path.join(target,name));
  }
  await fs.writeFile(path.join(target,'report.json'),JSON.stringify(report,null,2)+'\n');
  return report;
}
async function fileDigest(p){return hash(await fs.readFile(p));}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    const opts={};for(let i=2;i<process.argv.length;i+=2){const key=process.argv[i];if(!['--reference','--svg','--inventory','--out'].includes(key)||!process.argv[i+1])throw new Error('Usage: reconstruction-check.mjs --reference PNG --svg SVG --inventory JSON --out NEW_DIRECTORY');opts[key.slice(2)]=process.argv[i+1];}
    if(!['reference','svg','inventory','out'].every(k=>opts[k]))throw new Error('Required: --reference, --svg, --inventory, --out');
    const r=await checkReconstruction(opts);console.log(JSON.stringify({out:path.resolve(opts.out),nativePassed:!r.native.errors.length,errors:r.native.errors,diagnostics:r.diagnostics,visualAcceptance:r.visualAcceptance}));if(r.native.errors.length)process.exitCode=2;
  }catch(e){console.error(e.message);process.exitCode=1;}
}
