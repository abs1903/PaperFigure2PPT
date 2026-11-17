// One explicit design vocabulary shared by ImageGen prompting and native authoring.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {digest} from './spec.mjs';
const nonempty=(v,n)=>{if(typeof v!=='string'||!v.trim())throw Error(`Missing ${n}`);};
export function assertVisualContract(c){
 if(c?.version!=='1.0'||!['partial','complete'].includes(c.coverage))throw Error('Visual contract needs version 1.0 and partial/complete coverage');
 if(!Number.isFinite(c.canvas?.publicationWidthIn)||c.canvas.publicationWidthIn<=0)throw Error('Visual contract publication width required');
 for(const k of ['width','height'])if(c.canvas[k]!==undefined&&(!Number.isFinite(c.canvas[k])||c.canvas[k]<=0))throw Error(`Invalid canvas ${k}`);
 if(!c.typography||!Object.keys(c.typography).length||!c.colors||!Object.keys(c.colors).length)throw Error('Typography and color roles required');
 for(const [id,r] of Object.entries(c.typography)){nonempty(r.font,`font role ${id}`);if(!Number.isFinite(r.size)||r.size<=0||typeof r.bold!=='boolean')throw Error(`Invalid typography role ${id}`);}
 for(const [id,r] of Object.entries(c.colors)){nonempty(r.meaning,`color meaning ${id}`);if(!/^(#[a-f0-9]{6}|none)$/i.test(r.value))throw Error(`Invalid color role ${id}`);}
 const seen=new Set();for(const kind of ['modules','labels','shapes','edges']){
  if(!Array.isArray(c[kind]))throw Error(`Visual contract ${kind} must be an array`);
  for(const b of c[kind]){
   nonempty(b.id,'binding id');if(seen.has(b.id))throw Error(`Duplicate visual binding ${b.id}`);seen.add(b.id);
   if(kind==='labels'){nonempty(b.owner,'label owner');nonempty(b.text,'label text');if(!c.typography[b.typography]||!c.colors[b.color])throw Error(`Unknown label role ${b.id}`);}
   if(kind==='shapes'){nonempty(b.owner,'shape owner');for(const k of ['fill','stroke'])if(b[k]!==undefined&&!c.colors[b[k]])throw Error(`Unknown shape color ${b.id}`);}
   if(kind==='edges'){for(const k of ['from','to'])nonempty(b[k]?.module,`edge ${k}`);if(!c.colors[b.color])throw Error(`Unknown edge color ${b.id}`);}
   if(b.box&&(!Array.isArray(b.box)||b.box.length!==4||!b.box.every(Number.isFinite)||b.box[2]<0||b.box[3]<0))throw Error(`Invalid visual box ${b.id}`);
  }
 }
 const t=c.geometryTolerancePx??2;if(!Number.isFinite(t)||t<0||t>20)throw Error('Visual geometry tolerance must be within 0..20px');
 return c;
}
export async function loadVisualContract(binding,baseDir){
 if(!binding?.path||!/^[a-f0-9]{64}$/.test(binding.sha256??''))throw Error('Visual contract needs path and digest(parsed JSON)');
 const bytes=await fs.readFile(path.resolve(baseDir,binding.path)),contract=assertVisualContract(JSON.parse(bytes));if(digest(contract)!==binding.sha256)throw Error('Visual contract file changed');
 return {contract,bytes};
}
export function visualContractPrompt(input){
 const c=assertVisualContract(input);
 return ['Shared visual contract (role IDs are authoring metadata, never extra canvas text):',
  `Publication width ${c.canvas.publicationWidthIn} inches; ${c.canvas.width??'exploratory'} × ${c.canvas.height??'exploratory'} source pixels.`,
  ...Object.entries(c.typography).map(([id,r])=>`Type role ${id}: ${r.font}, ${r.size}px, ${r.bold?'bold':'regular'}.`),
  ...Object.entries(c.colors).map(([id,r])=>`Paint role ${id}: ${r.value}; ${r.meaning}.`),
  ...c.modules.filter(m=>m.box).map(m=>`Registered module ${m.id}: [x,y,width,height]=[${m.box.join(',')}]; authoring metadata, not canvas text.`),
  ...c.modules.filter(m=>m.box).map(m=>`Registered module ${m.id}: [x,y,width,height]=[${m.box.join(',')}]; authoring metadata, not canvas text.`),
  ...c.modules.filter(m=>m.box).map(m=>`Registered module ${m.id}: [x,y,width,height]=[${m.box.join(',')}]; authoring metadata, not canvas text.`),
  ...c.labels.map(l=>`Label ${JSON.stringify(l.text)} uses type ${l.typography} and paint ${l.color}.`),
  ...c.edges.map(e=>`Relation ${e.from.module} -> ${e.to.module}: ${e.color}${e.dashed?', dashed reuse/state route':''}.`),
  'Native text, simple vector contours and explicit anchor relationships must remain reproducible. Pixel output still requires inspection; this contract does not prove generated compliance.'
 ].join('\n');
}
export function auditVisualContract(scene,input){
 const c=assertVisualContract(input),errors=[],tol=c.geometryTolerancePx??2;
 const primitives=new Map(scene.primitives.map(p=>[p.id,p])),modules=new Map(scene.modules.map(m=>[m.id,m])),edges=new Map(scene.edges.map(e=>[e.id,e]));
 const err=(id,field,expected,actual)=>errors.push({id,field,expected,actual});
 const same=(id,field,a,b)=>{if(a!==b)err(id,field,a,b);};
 const box=(b,o)=>{if(b.box&&(!o.box||b.box.some((v,i)=>Math.abs(v-o.box[i])>tol)))err(b.id,'box',b.box,o.box);};
 for(const k of ['width','height'])if(c.canvas[k]!==undefined)same('canvas',k,c.canvas[k],scene[k]);
 for(const b of c.modules){const o=modules.get(b.id);if(!o){err(b.id,'module','present','missing');continue;}box(b,o);}
 for(const b of c.labels){const o=primitives.get(b.id);if(!o||o.type!=='text'){err(b.id,'label','native text','missing');continue;}const t=c.typography[b.typography];
  for(const k of ['font','size','bold'])same(b.id,k,t[k],o[k]??false);
  same(b.id,'text',b.text,o.text);same(b.id,'fill',c.colors[b.color].value.toLowerCase(),o.fill?.toLowerCase());if(b.owner)same(b.id,'owner',b.owner,o.owner);box(b,o);
 }
 for(const b of c.shapes){const o=primitives.get(b.id);if(!o||o.type!=='path'){err(b.id,'shape','native vector path','missing');continue;}same(b.id,'owner',b.owner,o.owner);box(b,o);
  for(const k of ['fill','stroke'])if(b[k]!==undefined)same(b.id,k,c.colors[b[k]].value.toLowerCase(),o[k]?.toLowerCase());
  if(b.width!==undefined)same(b.id,'width',b.width,o.width);
 }
 for(const b of c.edges){const e=edges.get(b.id);if(!e){err(b.id,'edge','present','missing');continue;}
  for(const k of ['from','to']){same(b.id,k+'.module',b[k].module,e[k].module);if(b[k].side)same(b.id,k+'.side',b[k].side,e[k].side);if(b[k].offset&&(!e[k].offset||b[k].offset.some((v,i)=>Math.abs(v-e[k].offset[i])>tol)))err(b.id,k+'.offset',b[k].offset,e[k].offset);}
  same(b.id,'stroke',c.colors[b.color].value.toLowerCase(),e.stroke?.toLowerCase());for(const k of ['width','endArrow'])if(b[k]!==undefined)same(b.id,k,b[k],e[k]);if(b.dashed!==undefined)same(b.id,'dashed',b.dashed,!!e.dashed);
 }
 if(c.coverage==='complete')for(const [kind,actual] of [['modules',scene.modules],['labels',scene.primitives.filter(p=>p.type==='text')],['shapes',scene.primitives.filter(p=>p.type==='path')],['edges',scene.edges]]){
  const ids=new Set(c[kind].map(b=>b.id));for(const o of actual)if(!ids.has(o.id))err(o.id,'coverage',kind+' binding','missing');
 }
 return {version:'1.0',passed:!errors.length,coverage:c.coverage,errors,contractDigest:digest(c),sceneDigest:digest(scene),counts:Object.fromEntries(['modules','labels','shapes','edges'].map(k=>[k,c[k].length])),scope:'Native authoring values versus explicit design roles/geometry. Raster adherence, original-font identity, Office rendering and scientific meaning require their own checks.'};
}
async function main(){const args=process.argv.slice(2),o={};for(let i=0;i<args.length;i+=2)o[args[i].replace(/^--/,'')]=args[i+1];const report=auditVisualContract(JSON.parse(await fs.readFile(o.scene,'utf8')),JSON.parse(await fs.readFile(o.contract,'utf8')));await fs.writeFile(o.out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.passed)process.exitCode=2;}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
