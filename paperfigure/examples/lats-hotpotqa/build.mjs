import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import {saveEditableFigure,toEditableSVG} from '../../scripts/layout-export.mjs';
import {fitCenteredBlocks,transformText} from '../../scripts/layout-reflow.mjs';
import {inspectLayout,measureSVG} from '../../scripts/layout-inspect.mjs';
import {auditNativeLayout} from '../../scripts/layout-native-audit.mjs';
import {assertSpec} from '../../scripts/spec.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname),revision=process.argv[2]??'output-v1',spec=JSON.parse(await fs.readFile(path.join(dir,'spec.json')));assertSpec(spec);
const BLUE='#E8F1FB',GREEN='#E8F4EC',GRAY='#F6F7F8',INK='#243746',GOLD='#BF8A20';
const scene={version:'1.0',title:'LATS code-grounded HotPotQA',width:1820,height:1000,source:{repository:'https://github.com/andyz245/LanguageAgentTreeSearch',commit:'853d81614607dd27433faf17c7b0a7d660f95d22',scope:spec.claims.scope,specSHA256:crypto.createHash('sha256').update(JSON.stringify(spec)).digest('hex'),palette:'Blue = LM inference; green = question-scoped stored state; neutral = controls/tools/I-O; gold line = selected trajectory.',treeMotif:'Schematic branches, not actual execution, literal branching factor, neural layers or branch-specific environment states.'},groupIcons:true,cleanArrowTips:true,modules:[],primitives:[],labels:[],edges:[],exceptions:[]};
const M=(x,y)=>['M',x,y],L=(x,y)=>['L',x,y],C=(...a)=>['C',...a],Z=()=>['Z'];let seq=0;
function bounds(cs){const ps=cs.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0).map((v,i)=>[v,c[i*2+2]])),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(.01,Math.max(...xs)-Math.min(...xs)),Math.max(.01,Math.max(...ys)-Math.min(...ys))];}
function vector(id,owner,cs,fill='none',stroke=INK,width=2,icon){scene.primitives.push({id,owner,type:'path',seq:seq++,commands:cs,box:bounds(cs),fill,stroke,width,fillRule:'nonzero',lineCap:'round',...(icon?{icon}: {})});}
function rounded(x,y,w,h,r=18){const k=.552285*r;return [M(x+r,y),L(x+w-r,y),C(x+w-r+k,y,x+w,y+r-k,x+w,y+r),L(x+w,y+h-r),C(x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h),L(x+r,y+h),C(x+r-k,y+h,x,y+h-r+k,x,y+h-r),L(x,y+r),C(x,y+r-k,x+r-k,y,x+r,y),Z()];}
function text(id,owner,t,x,y,size=27,bold=false){const o={id,owner,type:'text',seq:seq++,text:t,positions:[[x,y]],box:[x,y-size,t.length*size*.57,size*1.2],font:'Arial',size,bold,italic:false,fill:INK,angle:0};scene.primitives.push(o);scene.labels.push({id,owner});return o;}
function card(id,box,fill,lines,textBox){const m={id,box,container:id==='tree',anchorShapeId:`shape-${id}`,centerTextIds:[],textBox:textBox??box,minPadding:14,minFontScale:.94};scene.modules.push(m);vector(`shape-${id}`,id,rounded(...box),fill,fill===GREEN?'#6E9683':fill===BLUE?'#718DA7':'#84929B',2.2);let y=(textBox??box)[1]+36;for(const [i,line] of lines.entries()){const [t,size,bold]=Array.isArray(line)?line:[line,i===0?32:27,i===0];const tid=`label-${id}-${i}`;text(tid,id,t,box[0]+20,y,size,bold);m.centerTextIds.push(tid);y+=size*1.12;}return m;}
card('question',[20,180,160,80],GRAY,[['Question',30,true]]);
card('tree',[220,90,360,590],GREEN,[['Trajectory tree',34,true],['This question',28,false]],[238,105,324,95]);
card('select',[630,120,160,100],GRAY,[['Select',32,true],['(UCT)',28,false]]);
card('policy',[860,120,225,100],BLUE,[['Expand',32,true],['LM candidates',27,false]]);
card('tools',[1160,110,400,160],GRAY,[['Shared WikiEnv',32,true],['Search / Lookup / Finish',27,false],['Observation / done',27,false],['Exact-match reward',27,false]]);
card('value',[630,620,170,90],BLUE,[['LM value',30,true]]);
card('rollout',[860,560,660,210],GRAY,[['Value-guided rollout',33,true],['Absolute depth < 4',27,false]],[878,570,624,110]);
card('backup',[1570,600,220,145],GRAY,[['Backup',32,true],['If no success',27,false],['Values / visits',27,false]]);
card('failed',[1420,350,220,130],GREEN,[['Failed traces',30,true],['Wrong terminal',26,false]]);
card('reflect',[1090,350,270,130],BLUE,[['Self-reflection',30,true],['New distinct failure',26,false],['1-3 total',26,false]]);
card('context',[800,350,230,130],GREEN,[['Reflection',30,true],['context',30,true],['This question',26,false]]);
card('result',[1390,850,370,100],GRAY,[['Return state',32,true],['Success / budget fallback',27,false]]);
// Node motif is semantically owned artwork, not additional scientific modules.
const icon='trajectory-motif',points={root:[400,255],a:[300,345],b:[400,345],c:[500,345],d:[260,435],e:[340,435],f:[470,435],g:[530,435],h:[300,515],i:[380,515]},pairs=[['root','a'],['root','b'],['root','c'],['a','d'],['a','e'],['c','f'],['c','g'],['e','h'],['e','i']],selected=new Set(['root-a','a-e','e-h']);
for(const [a,b] of pairs)vector(`tree-branch-${a}-${b}`,'tree',[M(...points[a]),L(...points[b])],'none',selected.has(`${a}-${b}`)?GOLD:'#71857A',selected.has(`${a}-${b}`)?4.3:2.1,icon);
for(const [id,[x,y]] of Object.entries(points)){const r=20,cs=[M(x+r,y),C(x+r,y+r*.5523,x+r*.5523,y+r,x,y+r),C(x-r*.5523,y+r,x-r,y+r*.5523,x-r,y),C(x-r,y-r*.5523,x-r*.5523,y-r,x,y-r),C(x+r*.5523,y-r,x+r,y-r*.5523,x+r,y),Z()];vector(`tree-node-${id}`,'tree',cs,['root','a','e','h'].includes(id)?'#D1E8D8':'#FFFFFF',['root','a','e','h'].includes(id)?GOLD:'#71857A',2.4,icon);}
for(const [id,t,x,y] of [['tree-more-a','...',245,380],['tree-more-b','...',505,480],['tree-field-a','Thought + action',290,580],['tree-field-b','Observation',320,618],['tree-field-c','Values + visits',310,656]])text(id,'tree',t,x,y,27,false);
// Rollout call sites are explanatory native text, not independent model instances.
text('rollout-reuse','rollout','Reuse policy, shared tools and LM value',900,696,27,false);
text('rollout-greedy','rollout','Keep the highest-valued continuation',900,735,27,false);
const mod=id=>scene.modules.find(m=>m.id===id);
function wire(id,from,to,pts,opt={}){const semantic=spec.edges.find(e=>e.id===id);if(!semantic)throw Error(`Missing semantic edge ${id}`);const a=pts[0],b=pts.at(-1),port=(module,p)=>{const [x,y,w,h]=mod(module).box;if(Math.abs(p[0]-x)<.01)return {module,side:'left',fraction:(p[1]-y)/h};if(Math.abs(p[0]-x-w)<.01)return {module,side:'right',fraction:(p[1]-y)/h};if(Math.abs(p[1]-y)<.01)return {module,side:'top',fraction:(p[0]-x)/w};if(Math.abs(p[1]-y-h)<.01)return {module,side:'bottom',fraction:(p[0]-x)/w};throw Error(`Not a border ${module} ${p}`);};scene.edges.push({id,from:port(from,a),to:port(to,b),points:pts,stroke:INK,width:2.8,startArrow:'none',endArrow:'triangle',arrowSize:'med',meaning:semantic.kind+': '+semantic.label,...opt});}
wire('initialize','question','tree',[[180,220],[220,220]]);
wire('select-path','tree','select',[[580,170],[630,170]],{stroke:GOLD,width:3.3});
wire('expand-path','select','policy',[[790,170],[860,170]],{stroke:GOLD,width:3.3});
wire('execute','policy','tools',[[1085,170],[1160,170]]);
wire('store-children','tools','tree',[[1360,110],[1360,70],[560,70],[560,90]],{dashed:true});
wire('candidate-values','tree','value',[[580,665],[630,665]]);
wire('best-child','value','rollout',[[800,665],[860,665]]);
wire('rollout-step','rollout','tools',[[1454,560],[1454,520],[1680,520],[1680,300],[1540,300],[1540,270]],{dashed:true});
wire('rollout-feedback','tools','rollout',[[1560,230],[1710,230],[1710,545],[1490,545],[1490,560]],{dashed:true});
wire('no-success','rollout','backup',[[1520,665],[1570,665]]);
wire('update-statistics','backup','tree',[[1700,745],[1700,805],[400,805],[400,680]],{dashed:true});
wire('terminal-failure','tools','failed',[[1500,270],[1500,350]]);
wire('reflect-failures','failed','reflect',[[1420,415],[1360,415]]);
wire('store-reflection','reflect','context',[[1090,415],[1030,415]]);
wire('policy-feedback','context','policy',[[930,350],[930,220]],{dashed:true});
wire('return-tree','tree','result',[[238,680],[238,835],[1650,835],[1650,850]]);
wire('return-rollout','rollout','result',[[1450,770],[1450,785],[1785,785],[1785,900],[1760,900]]);
const centerTargets=[];
function note(id,t,x,y,edge){text(id,'tree',t,x,y,26,false);const label=scene.labels.find(l=>l.id===id);label.owner='annotation-layer';const p=scene.primitives.find(p=>p.id===id);p.owner='annotation-layer';if(edge)scene.edges.find(e=>e.id===edge).labelIds=[id];}
scene.modules.push({id:'annotation-layer',box:[0,0,1820,1000],container:true,routingObstacle:false});
note('store-label','Expanded children',1090,52,'store-children');
note('call-label','Call',1600,290,'rollout-step');
note('observe-label','Observation',1540,585,'rollout-feedback');
note('stats-label','Update values + visits',650,790,'update-statistics');
note('fallback-label','Budget fallback',950,865,'return-tree');
note('success-label','Success',1570,778,'return-rollout');
// Measured manual centering for source-owned non-contiguous text regions.
let measured=await measureSVG(toEditableSVG(scene),scene);
for(const id of ['tree-field-a','tree-field-b','tree-field-c','rollout-reuse','rollout-greedy']){const o=scene.primitives.find(p=>p.id===id),b=measured.texts[id].bbox,x=id.startsWith('tree')?400:1190;transformText(o,x-(b.x+b.w/2),0);}
const fitted=await fitCenteredBlocks(scene);const out=path.join(dir,revision);await saveEditableFigure(fitted.scene,out);await fs.copyFile(path.join(dir,'spec.json'),path.join(out,'spec.json'));const qa=await inspectLayout(await fs.readFile(path.join(out,'editable.svg'),'utf8'),fitted.scene),native=await auditNativeLayout(fitted.scene,await fs.readFile(path.join(out,'figure.pptx')),JSON.parse(await fs.readFile(path.join(out,'pptx-object-map.json'))));await fs.writeFile(path.join(out,'layout-qa.json'),JSON.stringify(qa,null,2));await fs.writeFile(path.join(out,'native-audit.json'),JSON.stringify(native,null,2));await fs.writeFile(path.join(out,'layout-changes.json'),JSON.stringify(fitted.changes,null,2));console.log(JSON.stringify({out,passed:qa.qa.passed,errors:qa.qa.errors,warnings:qa.qa.warnings,native:native.passed}));if(!qa.qa.passed||!native.passed)process.exitCode=2;
