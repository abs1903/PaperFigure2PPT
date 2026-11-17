import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import {saveEditableFigure,toEditableSVG} from '../../scripts/layout-export.mjs';
import {fitCenteredBlocks,transformText} from '../../scripts/layout-reflow.mjs';
import {inspectLayout,measureSVG} from '../../scripts/layout-inspect.mjs';
import {auditNativeLayout} from '../../scripts/layout-native-audit.mjs';
import {assertSpec} from '../../scripts/spec.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname),revision=process.argv[2]??'target-scene',spec=JSON.parse(await fs.readFile(path.join(dir,'spec-figure.json')));assertSpec(spec);
const BLUE='#E8F1FB',GREEN='#E8F4EC',GRAY='#F6F7F8',INK='#243746',GOLD='#BF8A20';
const scene={version:'1.0',title:'LATS code-grounded HotPotQA',width:1752,height:897,source:{repository:'https://github.com/andyz245/LanguageAgentTreeSearch',commit:'853d81614607dd27433faf17c7b0a7d660f95d22',scope:spec.claims.scope,specSHA256:crypto.createHash('sha256').update(JSON.stringify(spec)).digest('hex'),palette:'Blue = LM inference; green = question-scoped stored state; neutral = controls/tools/I-O; gold line = selected trajectory.',treeMotif:'Schematic branches, not actual execution, literal branching factor, neural layers or branch-specific environment states.'},groupIcons:true,cleanArrowTips:true,modules:[],primitives:[],labels:[],edges:[],exceptions:[]};
const M=(x,y)=>['M',x,y],L=(x,y)=>['L',x,y],C=(...a)=>['C',...a],Z=()=>['Z'];let seq=0;
function bounds(cs){const ps=cs.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0).map((v,i)=>[v,c[i*2+2]])),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(.01,Math.max(...xs)-Math.min(...xs)),Math.max(.01,Math.max(...ys)-Math.min(...ys))];}
function vector(id,owner,cs,fill='none',stroke=INK,width=2,icon){scene.primitives.push({id,owner,type:'path',seq:seq++,commands:cs,box:bounds(cs),fill,stroke,width,fillRule:'nonzero',lineCap:'round',...(icon?{icon}: {})});}
function rounded(x,y,w,h,r=18){const k=.552285*r;return [M(x+r,y),L(x+w-r,y),C(x+w-r+k,y,x+w,y+r-k,x+w,y+r),L(x+w,y+h-r),C(x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h),L(x+r,y+h),C(x+r-k,y+h,x,y+h-r+k,x,y+h-r),L(x,y+r),C(x,y+r-k,x+r-k,y,x+r,y),Z()];}
function text(id,owner,t,x,y,size=27,bold=false){const o={id,owner,type:'text',seq:seq++,text:t,positions:[[x,y]],box:[x,y-size,t.length*size*.57,size*1.2],font:'Arial',size,bold,italic:false,fill:INK,angle:0};scene.primitives.push(o);scene.labels.push({id,owner});return o;}
function card(id,box,fill,lines,textBox){const m={id,box,container:id==='tree',anchorShapeId:`shape-${id}`,centerTextIds:[],textBox:textBox??box,minPadding:8,minFontScale:1};scene.modules.push(m);vector(`shape-${id}`,id,rounded(...box),fill,fill===GREEN?'#6E9683':fill===BLUE?'#718DA7':'#84929B',2.2);let y=(textBox??box)[1]+36;for(const [i,line] of lines.entries()){const [t,size,bold]=Array.isArray(line)?line:[line,i===0?32:27,i===0];const tid=`label-${id}-${i}`;text(tid,id,t,box[0]+20,y,size,bold);m.centerTextIds.push(tid);y+=size*1.12;}return m;}
const contract=JSON.parse(await fs.readFile(path.join(dir,'reference-contract.json'))),boxes=Object.fromEntries(contract.regions.map(r=>[r.module,r.box]));
card('question',boxes.question,GRAY,[['Question',28,true]]);
card('tree',boxes.tree,GREEN,[['Trajectory tree',30,true],['This question',25,false]],[204,110,302,82]);
card('select',boxes.select,GRAY,[['Select',29,true],['(UCT)',25,false]]);
card('policy',boxes.policy,BLUE,[['Expand',29,true],['LM candidates',25,false]]);
card('tools',boxes.tools,GRAY,[['Shared tool environment',28,true],['WikiEnv + QA wrapper',25,false],['Search / Lookup / Finish',25,false],['Observation + EM reward',25,false]]);
card('failed',boxes.failed,GREEN,[['Failed traces',25,true]]);
card('reflect',boxes.reflect,BLUE,[['Self-reflection',25,true]]);
card('context',boxes.context,GREEN,[['Reflection',27,true],['context',27,true],['This question',25,false]]);
card('value',boxes.value,BLUE,[['LM value',28,true]]);
card('rollout',boxes.rollout,GRAY,[['Value-guided rollout',30,true],['Absolute depth < 4',25,false]],[760,539,626,78]);
card('backup',boxes.backup,GRAY,[['Backup',28,true],['No success',25,false],['Value / visits',25,false]]);
scene.modules.find(m=>m.id==='backup').minPadding=6;
card('result',boxes.result,GRAY,[['Return state',29,true],['Success / fallback',25,false]]);
// Preserve the selected PNG's tree-region geometry, including internal motifs.
vector('tree-fields-a','tree',rounded(210,202,291,58,9),'#FFFFFF','#84948A',1.7);
vector('tree-fields-b','tree',rounded(210,268,291,35,9),'#FFFFFF','#84948A',1.7);
text('tree-thought','tree','Thought / action',240,226,25,false);text('tree-observation','tree','Observation',265,253,25,false);text('tree-stats','tree','Values + visits',250,294,25,false);
const icon='trajectory-motif',points={root:[355,335],a:[277,423],b:[355,423],c:[432,423],d:[247,514],e:[323,514],f:[404,514],g:[460,514],h:[282,599],i:[360,599]},pairs=[['root','a'],['root','b'],['root','c'],['a','d'],['a','e'],['c','f'],['c','g'],['e','h'],['e','i']],chosen=new Set(['root-a','a-e','e-h']);
for(const [a,b] of pairs)vector(`tree-branch-${a}-${b}`,'tree',[M(...points[a]),L(...points[b])],'none',chosen.has(`${a}-${b}`)?GOLD:'#67796D',chosen.has(`${a}-${b}`)?4:2,icon);
for(const [id,[x,y]] of Object.entries(points)){const r=20,cs=[M(x+r,y),C(x+r,y+r*.5523,x+r*.5523,y+r,x,y+r),C(x-r*.5523,y+r,x-r,y+r*.5523,x-r,y),C(x-r,y-r*.5523,x-r*.5523,y-r,x,y-r),C(x+r*.5523,y-r,x+r,y-r*.5523,x+r,y),Z()];vector(`tree-node-${id}`,'tree',cs,['root','a','e','h'].includes(id)?'#D1E8D8':'#FFFFFF',['root','a','e','h'].includes(id)?GOLD:'#67796D',2.2,icon);}
for(const [id,x,y] of [['more-a',210,460],['more-b',470,460],['more-c',210,605],['more-d',405,605]])text(id,'tree','...',x,y,25,false);
// Rollout body explicitly references existing routines, not a second UCT tree.
for(const [id,x,w,fill,label] of [['reuse-policy',768,156,BLUE,'Same policy'],['reuse-tools',966,175,GRAY,'Same tools'],['reuse-value',1183,185,BLUE,'LM value']]){vector(`shape-${id}`,'rollout',rounded(x,617,w,56,9),fill,'#84929B',1.8);text(`text-${id}`,'rollout',label,x+9,653,25,true);}
for(const [i,x,xx] of [[0,924,966],[1,1141,1183]]){vector(`routine-line-${i}`,'rollout',[M(x,645),L(xx-8,645)],'none',INK,2);vector(`routine-head-${i}`,'rollout',[M(xx,645),L(xx-10,640),L(xx-10,650),Z()],INK,INK,0);}
text('rollout-greedy','rollout','Greedy continuation',920,708,25,false);
const mod=id=>scene.modules.find(m=>m.id===id);
function wire(id,a,b,pts,opt={}){const e=spec.edges.find(e=>e.id===id);if(!e)throw Error(`Unknown semantic relation ${id}`);const port=(module,p)=>{const [x,y,w,h]=mod(module).box;if(p[0]===x)return {module,side:'left',fraction:(p[1]-y)/h};if(p[0]===x+w)return {module,side:'right',fraction:(p[1]-y)/h};if(p[1]===y)return {module,side:'top',fraction:(p[0]-x)/w};if(p[1]===y+h)return {module,side:'bottom',fraction:(p[0]-x)/w};throw Error(`Invalid visible border anchor ${module}`);};scene.edges.push({id,from:port(a,pts[0]),to:port(b,pts.at(-1)),points:pts,stroke:INK,width:2.6,startArrow:'none',endArrow:'triangle',arrowSize:'med',meaning:e.kind+': '+e.label,...opt});}
wire('initialize','question','tree',[[156,209],[186,209]]);
wire('select-path','tree','select',[[524,181],[570,181]],{stroke:GOLD,width:3});
wire('expand-path','select','policy',[[717,181],[782,181]],{stroke:GOLD,width:3});
wire('execute','policy','tools',[[987,181],[1055,181]]);
wire('store-children','tools','tree',[[1200,118],[1200,82],[500,82],[500,101]],{dashed:true});
wire('candidate-values','tree','value',[[524,625],[570,625]]);
wire('best-child','value','rollout',[[722,625],[744,625]]);
wire('no-success','rollout','backup',[[1402,625],[1560,625]]);
wire('update-statistics','backup','tree',[[1726,625],[1740,625],[1740,52],[363,52],[363,101]],{dashed:true});
wire('terminal-failure','tools','failed',[[1142,258],[1142,324],[954,324],[954,377]]);
wire('reflect-failures','failed','reflect',[[1064,412],[1102,412]]);
wire('store-reflection','reflect','context',[[1298,412],[1335,412]]);
wire('policy-feedback','context','policy',[[1417,467],[1417,494],[839,494],[839,222]],{dashed:true});
wire('return-tree','tree','result',[[524,600],[540,600],[540,512],[1540,512],[1540,780],[1500,780],[1500,811]],{dashed:true});
wire('return-rollout','rollout','result',[[1088,722],[1088,846],[1263,846]]);
scene.modules.push({id:'annotation-layer',box:[0,0,1752,897],container:true,routingObstacle:false});
for(const [id,t,x,y,edge] of [['note-child','Expanded children',955,109,'store-children'],['note-failure','Wrong terminal',1164,290,'terminal-failure'],['note-reflect-a','New distinct (1-3)',975,365,null],['note-backup','Update values + visits',1370,32,'update-statistics'],['note-fallback','Budget fallback',1425,505,'return-tree'],['note-endpoint','Success / fallback',1107,798,'return-rollout']]){text(id,'annotation-layer',t,x,y,25,false);if(edge)scene.edges.find(e=>e.id===edge).labelIds=[id];}
let measured=await measureSVG(toEditableSVG(scene),scene);
for(const [id,x] of [['tree-thought',355.5],['tree-observation',355.5],['tree-stats',355.5],['text-reuse-policy',846],['text-reuse-tools',1053.5],['text-reuse-value',1275.5],['rollout-greedy',1073]]){const p=scene.primitives.find(p=>p.id===id),b=measured.texts[id].bbox;transformText(p,x-b.x-b.w/2,0);}
const fitIssues=[];for(const m of scene.modules){const ts=(m.centerTextIds??[]).map(id=>measured.texts[id]);if(!ts.length)continue;const box=m.textBox??m.box,pad=m.minPadding??4,w=Math.max(...ts.map(t=>Math.max(t.bbox.w,t.positionedAdvance??0))),h=Math.max(...ts.map(t=>t.bbox.y+t.bbox.h))-Math.min(...ts.map(t=>t.bbox.y));if(w>box[2]-2*pad-1.5||h>box[3]-2*pad)fitIssues.push({id:m.id,w,h,availableW:box[2]-2*pad-1.5,availableH:box[3]-2*pad});}if(fitIssues.length)console.log(JSON.stringify({fitIssues}));
const fitted=await fitCenteredBlocks(scene),target=path.join(dir,revision);await fs.mkdir(target);await fs.writeFile(path.join(target,'layout-scene.json'),JSON.stringify(fitted.scene,null,2));await fs.writeFile(path.join(target,'layout-changes.json'),JSON.stringify(fitted.changes,null,2));console.log(JSON.stringify({scene:path.join(target,'layout-scene.json'),next:'paperfigure.mjs reconstruct --scene ... --contract reference-contract.json --out NEW_OUTPUT'}));
