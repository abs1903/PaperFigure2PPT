// Code-regeneration edit probes on copies of a real accepted scene.
// These are editing fixtures, not newly source-reviewed CLIP method figures.
import fs from 'node:fs/promises';import path from 'node:path';import {performance} from 'node:perf_hooks';
import {saveEditableFigure,toEditableSVG} from '../../../paperfigure/scripts/layout-export.mjs';
import {inspectLayout,browserRuntime} from '../../../paperfigure/scripts/layout-inspect.mjs';
import {auditNativeLayout} from '../../../paperfigure/scripts/layout-native-audit.mjs';
import {moveModules,wrapText} from '../../../paperfigure/scripts/layout-reflow.mjs';
import {sha256} from '../../../paperfigure/scripts/reader-test.mjs';
const root=path.dirname(new URL(import.meta.url).pathname),source=path.join(root,'../2026-11-17-clip-refinement/output-v2/layout-scene.json'),baseline=JSON.parse(await fs.readFile(source));
const runtime=await browserRuntime(),browser=await runtime.chromium.launch({headless:true,executablePath:runtime.executablePath}),page=await browser.newPage();
async function label(s,module,text,size=32){
 const m=s.modules.find(m=>m.id===module),old=new Set(m.centerTextIds),first=s.primitives.find(p=>old.has(p.id));
 s.primitives=s.primitives.filter(p=>!old.has(p.id));s.labels=s.labels.filter(p=>!old.has(p.id));m.centerTextIds=[];
 const lines=await wrapText(text,{width:m.box[2]-12,font:first.font,size,bold:first.bold});
 const ms=await page.evaluate(({lines,font,size,bold})=>{const c=document.createElement('canvas').getContext('2d');c.font=`${bold?'bold ':''}${size}px "${font}"`;return lines.map(text=>{const m=c.measureText(text);return {width:m.width,asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent,offsets:[...text].map((_,i)=>c.measureText(text.slice(0,i)).width)};});},{lines,font:first.font,size,bold:first.bold});
 const gap=size*1.1,total=ms[0].asc+(lines.length-1)*gap+ms.at(-1).desc,base=m.box[1]+(m.box[3]-total)/2+ms[0].asc;
 for(let i=0;i<lines.length;i++){const id=`probe-${module}-${i}`,x=m.box[0]+(m.box[2]-ms[i].width)/2,y=base+i*gap;
  s.primitives.push({...first,id,text:lines[i],size,seq:1000+i,box:[x,y-size,ms[i].width,size*1.25],positions:ms[i].offsets.map(dx=>[x+dx,y])});s.labels.push({id,owner:module});m.centerTextIds.push(id);
 }
}
const tasks=[
 {id:'long-label',request:'Replace Nearest label with Nearest class description, with explicit wrapping.',async edit(s){await label(s,'nearest','Nearest class description',28);}},
 {id:'move-module',request:'Move the nearest-output module and reroute its incident connector.',async edit(s){return moveModules(s,[{id:'nearest',dx:-10,dy:-35}]);}},
 {id:'add-branch',request:'Add a native comparison/output branch (structural editing fixture only).',async edit(s){
  const id='probe-output',box=[1288,650,300,60];s.modules.push({id,box,anchorShapeId:id+'-frame',centerTextIds:[]});
  s.primitives.push({id:id+'-frame',owner:id,type:'path',seq:999,box,commands:[['M',1288,650],['L',1588,650],['L',1588,710],['L',1288,710],['Z']],fill:'#F0F2F3',stroke:'#CCD2D7',width:1.6});
  const exemplar=s.primitives.find(p=>p.id==='text-nearest-0');s.primitives.push({...exemplar,id:'probe-initial-label',owner:id,seq:1000});s.labels.push({id:'probe-initial-label',owner:id});s.modules.at(-1).centerTextIds=['probe-initial-label'];
  await label(s,id,'Comparison output',30);
  s.edges.push({id:'probe-branch',from:{module:'cosine',side:'right',offset:[268,43]},to:{module:id,side:'left',offset:[-5,30]},points:[[1164,914],[1275,914],[1275,680],[1283,680]],stroke:'#76848F',width:3.3,startArrow:'none',endArrow:'triangle',arrowSize:'lg'});
 }}
];
await fs.mkdir(path.join(root,'scene-edits'),{recursive:true});
const records=[];
try{for(const task of tasks){const start=performance.now(),dir=path.join(root,'scene-edits',task.id);let record={id:task.id,request:task.request,method:'code-regeneration',application:'PaperFigure native exporter; actual LibreOffice evidence is recorded separately',status:'unverified'};
 try{let scene=structuredClone(baseline);scene.title='Editing benchmark fixture: '+task.id+' (not a scientific redesign)';scene=(await task.edit(scene))??scene;
  const generated=await saveEditableFigure(scene,dir),qa=await inspectLayout(toEditableSVG(scene),scene),native=await auditNativeLayout(scene,generated.pptx.bytes,generated.pptx.map);
  await fs.writeFile(path.join(dir,'layout-qa.json'),JSON.stringify(qa,null,2)+'\n');await fs.writeFile(path.join(dir,'native-audit.json'),JSON.stringify(native,null,2)+'\n');
  const text=scene.primitives.filter(p=>p.type==='text').map(p=>p.text).join(' ');
  const taskCheck=task.id==='long-label'?text.includes('Nearest class description'):task.id==='move-module'?scene.modules.find(m=>m.id==='nearest').box[0]===1280:scene.edges.some(e=>e.id==='probe-branch')&&scene.modules.some(m=>m.id==='probe-output');
  Object.assign(record,{status:qa.qa.passed&&native.passed&&taskCheck?'pass':'fail',checks:{layout:qa.qa.passed,native:native.passed,requestedEdit:taskCheck},inputSHA256:sha256(await fs.readFile(source)),outputSHA256:sha256(generated.pptx.bytes),output:path.relative(root,dir),errors:qa.qa.errors});
 }catch(e){record.status='fail';record.error=e.message;}
 record.elapsedSeconds=(performance.now()-start)/1000;records.push(record);
}}finally{await browser.close();}
await fs.writeFile(path.join(root,'scene-edit-results.json'),JSON.stringify({scope:'Code-regeneration functional probes; not Microsoft PowerPoint editing, human effort or source-reviewed new method figures.',requested:tasks.length,tasks:records},null,2)+'\n');console.log(JSON.stringify(records.map(({id,status,error,checks})=>({id,status,error,checks}))));
