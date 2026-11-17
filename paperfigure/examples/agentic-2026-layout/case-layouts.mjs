import fs from 'node:fs/promises';import path from 'node:path';
import {saveEditableFigure} from '../../scripts/layout-export.mjs';
import {fitCenteredBlocks,transformText} from '../../scripts/layout-reflow.mjs';
import {anchor,rect,contains,intersection,topologyHash,geometryPairHash} from '../../scripts/figure-geometry.mjs';
const root=path.dirname(new URL(import.meta.url).pathname),revision=process.argv[2]??'output-v1';
const bounds=cs=>{const ps=cs.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0).map((v,i)=>[v,c[i*2+2]])),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(.1,Math.max(...xs)-Math.min(...xs)),Math.max(.1,Math.max(...ys)-Math.min(...ys))];};
function define(name,s){const modules=[{id:'source-context',box:[0,0,Math.ceil(s.width),Math.ceil(s.height)],container:true,routingObstacle:false}],edges=[],exceptions=[],math=[];
 const module=(id,box,opt={})=>{const m={id,box,parent:'source-context',...opt};modules.push(m);return m;};
 const edge=(id,from,to,opt={})=>{const e={id,from:{module:from[0],side:from[1],fraction:from[2]??.5},to:{module:to[0],side:to[1],fraction:to[2]??.5},stroke:'#000000',width:3.4,startArrow:'none',endArrow:'triangle',arrowSize:'lg',...opt};e.points??=[anchor(modules.find(m=>m.id===from[0]),e.from),anchor(modules.find(m=>m.id===to[0]),e.to)];edges.push(e);return e;};
 if(name==='agemem'){
  module('query',[43,20,231,154]);module('session-content',[314,24,231,149]);
  module('memory-manager',[43,237,508,163],{container:true});module('short-term-tools',[66,314,224,64],{parent:'memory-manager'});module('long-term-tools',[314,310,218,65],{parent:'memory-manager'});
  module('agentic-context',[43,466,246,65]);module('agentic-memory',[314,465,237,66]);module('llm-answer',[43,584,247,151]);
  module('construction',[308,555,274,203],{container:true});module('construction-agent',[417,561,61,64],{parent:'construction'});module('stm-instance',[340,665,40,43],{parent:'construction'});module('ltm-instance',[505,665,40,43],{parent:'construction'});
  edge('query-input',['query','bottom'],['memory-manager','top',(158.5-43)/508],{stroke:'#C9A128',width:11,arrowSize:'med'});edge('session-input',['session-content','bottom'],['memory-manager','top',(429.5-43)/508],{stroke:'#C9A128',width:11,arrowSize:'med'});
  edge('stm-operation',['short-term-tools','bottom',(166-66)/224],['agentic-context','top'],{stroke:'#F5B1B7',width:6});edge('ltm-operation',['long-term-tools','bottom'],['agentic-memory','top',(423-314)/237],{stroke:'#F1B28D',width:6});
  edge('memory-retrieval',['agentic-memory','top',(459-314)/237],['memory-manager','bottom',(459-43)/508],{stroke:'#F5B1B7',width:3.3,dashed:true});
  edge('context-answer',['agentic-context','bottom'],['llm-answer','top',(166-43)/247],{stroke:'#F5B1B7',width:4.6});
  edge('multi-round',['llm-answer','left',(654-584)/151],['memory-manager','left',(317-237)/163],{stroke:'#C1C1C1',width:3.5,dashed:true,points:[[43,654],[10,654],[10,317],[43,317]]});
  edge('construct-stm',['construction-agent','left',.7],['stm-instance','top',.65],{stroke:'#8B8B8B',width:1.8});edge('construct-ltm',['construction-agent','right',.7],['ltm-instance','top',.65],{stroke:'#8B8B8B',width:1.8});
  edge('memory-coordination',['stm-instance','right',.58],['ltm-instance','left',.58],{stroke:'#679A3A',width:2,dashed:true,startArrow:'triangle',labelIds:[]});
 }else{
  module('interaction-traces',[20,8,308,800],{container:true});module('learning',[349,8,738,800],{container:true});module('skill-bank',[1114,9,477,493],{container:true});module('hard-cases',[1114,515,477,293],{container:true});module('designer',[1618,8,306,801],{container:true});
  module('trace-input',[34,114,272,112],{parent:'interaction-traces'});for(const [i,y] of [[2,240],[3,365],[4,490],['E',675]])module(`trace-${i}`,[34,y,272,112],{parent:'interaction-traces'});
  module('selected-trace',[360,118,273,111],{parent:'learning'});module('span-sequence',[810,142,272,56],{parent:'learning'});module('step-loop',[362,243,711,384],{parent:'learning',container:true});
  module('current-span',[375,292,119,106],{parent:'step-loop'});module('retriever',[611,309,179,71],{parent:'step-loop'});module('controller',[878,251,188,237],{parent:'step-loop',container:true});module('state-skill-encoder',[885,328,174,69],{parent:'controller'});module('skill-selection',[885,407,174,69],{parent:'controller'});module('executor',[876,536,190,84],{parent:'step-loop'});module('memory-bank',[374,489,361,138],{parent:'step-loop'});
  module('memory-token-notation',[794,294,61,63.098],{parent:'step-loop',routingObstacle:false,semanticRole:'source notation, not a computational module'});module('retrieved-memory-notation',[751,418.4827,127,73],{parent:'step-loop',routingObstacle:false,semanticRole:'source notation, not a computational module'});
  module('reset-event',[384,426,220,34],{parent:'step-loop',semanticRole:'per-trace-reset'});
  module('evaluation',[367,675,375,50],{parent:'learning'});module('task-reward',[882,675,190,50],{parent:'learning'});
  module('designer-evolution',[1627,124,286,247],{parent:'designer',container:true});module('refine-skills',[1643,138,254,80],{parent:'designer-evolution'});module('analyze-failures',[1644.2595,267.9744,252.8184,52.9419],{parent:'designer-evolution'});
  module('designer-selection',[1627,394,286,375],{parent:'designer',container:true});module('aggregate-cases',[1640.9297,411.2171,252.8184,73.8398],{parent:'designer-selection'});module('difficulty-filtering',[1643,549,254,52],{parent:'designer-selection'});module('cluster-cases',[1643,654,254,52],{parent:'designer-selection'});
  for(const [id,x,y] of [['skip',1121,125],['update',1128,171],['new-skill-1',1135,216],['delete',1354,125],['insert',1361,171],['new-skill-2',1368,216]])module(id,[x,y,212,218],{parent:'skill-bank'});
  for(const [id,x,y] of [['failure-1',1121,577],['failure-2',1202,592],['failure-3',1284,607],['failure-N',1368,622]])module(id,[x,y,216,181],{parent:'hard-cases'});
  module('loop-label',[1003,814,491,44],{aboveEdges:true,routingObstacle:false});
  module('trace-transfer-band',[306,116,54,113],{container:true,routingObstacle:false,semanticRole:'source transfer-channel background'});
  module('read-skills-band',[1066,251,48,237],{container:true,routingObstacle:false,semanticRole:'source transfer-channel background'});
  module('hard-case-transfer-band',[1590,501,34,307],{container:true,routingObstacle:false,semanticRole:'source transfer-channel background'});
  module('evolution-transfer-band',[1589,129,35,252],{container:true,routingObstacle:false,semanticRole:'source transfer-channel background'});
  edge('trace-selection-a',['trace-input','right',.286],['selected-trace','left',.25]);edge('trace-selection-b',['trace-input','right',.786],['selected-trace','left',.757]);edge('segmentation',['selected-trace','right',.496],['span-sequence','left',.554]);
  for(const [i,x] of [[1,839],[2,889],[3,965],[4,1040]])edge(`span-step-${i}`,['span-sequence','bottom',(x-810)/272],['step-loop','top',(x-362)/711]);
  edge('current-to-retriever',['current-span','right'],['retriever','left']);edge('current-to-controller',['current-span','top',.49],['controller','left',20/237],{points:[[433.31,292],[433.31,271],[878,271]]});edge('retrieved-to-controller',['retriever','right'],['controller','left',94/237]);
  edge('retrieve-memory',['memory-bank','top',(699-374)/361],['retriever','bottom',(699-611)/179],{dashed:true,points:[[699,489],[699,380]]});edge('memory-query',['retriever','bottom',(632-611)/179],['memory-bank','top',(632-374)/361],{dashed:true});
  edge('selected-skills-to-executor',['controller','bottom'],['executor','top'],{points:[[972,488],[972,536]]});edge('memory-update',['executor','left',.333],['memory-bank','right',75/138]);
  for(const [i,x] of [[1,405],[2,509],[3,610],[4,709]])edge(`evaluate-${i}`,['memory-bank','bottom',(x-374)/361],['evaluation','top',(x-367)/375]);
  edge('evaluation-to-reward',['evaluation','right'],['task-reward','left']);edge('optimize-controller',['task-reward','right'],['controller','right',220/237],{points:[[1072,700],[1098,700],[1098,471],[1066,471]],removeSourcePoints:[[977,675],[977,627]],meaning:'Task reward optimizes controller only; frozen executor is not updated (§3.3.3).'});
  edge('record-failures',['evaluation','bottom',39/375],['hard-cases','left',265/293],{points:[[406,725],[406,780],[1114,780]]});
  for(const y of [535,775])edge(`read-hard-cases-${y}`,['hard-cases','right',(y-515)/293],['designer','left',(y-8)/801]);
  for(const y of [165,345])edge(`evolve-skills-${y}`,['designer','left',(y-8)/801],['skill-bank','right',(y-9)/493]);
  for(const y of [286,450])edge(`read-skills-${y}`,['skill-bank','left',(y-9)/493],['controller','right',(y-251)/237]);
  edge('cluster-to-filter',['cluster-cases','top',.05],['difficulty-filtering','bottom',.05]);edge('cluster-to-filter-b',['cluster-cases','top',.95],['difficulty-filtering','bottom',.95]);
  edge('filter-to-aggregate',['difficulty-filtering','top',.05],['aggregate-cases','bottom',.05]);edge('filter-to-aggregate-b',['difficulty-filtering','top',.95],['aggregate-cases','bottom',.95]);
  edge('aggregate-to-analysis',['aggregate-cases','left'],['analyze-failures','left'],{points:[[1640.9297,448.137],[1631,448.137],[1631,294.44535],[1644.2595,294.44535]],removeSourcePoints:[[1658,394],[1658,371]]});edge('aggregate-to-analysis-b',['aggregate-cases','right'],['analyze-failures','right'],{points:[[1893.7481,448.137],[1907,448.137],[1907,294.44535],[1897.0779,294.44535]],removeSourcePoints:[[1882,394],[1882,371]]});
  edge('analysis-to-refine',['analyze-failures','top',.05],['refine-skills','bottom',.05]);edge('analysis-to-refine-b',['analyze-failures','top',.95],['refine-skills','bottom',.95]);
  edge('closed-loop',['designer','bottom',160/306],['learning','bottom',363/738],{endArrow:'none',width:4.5,points:[[1778,809],[1778,838],[712,838],[712,808]],labelIds:['text-244']});
  edge('retrieved-memory-notation-link',['memory-token-notation','bottom',(822.2324-794)/61],['retrieved-memory-notation','top',(822.2324-751)/127],{points:[[822.2324,357.098],[822.2324,418.4827]],width:5.5728,startArrow:'triangle',endArrow:'triangle',arrowSize:'med',meaning:'Source bidirectional notation linking M_t and Retrieved Memory; not an agent action.'});
  math.push([3,'x','1'],[4,'x','2'],[5,'x','T'],[7,'M','t'],[8,'x','t'],[10,'M','t'],[11,'x','t',', A','t']);
 }
 return {modules,edges,exceptions,math};}
function distance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
for(const name of ['agemem','memskill']){
 const dir=path.join(root,name),raw=JSON.parse(await fs.readFile(path.join(dir,'source-primitives.json'))),{modules,edges,exceptions,math}=define(name,raw);
 let primitives=raw.primitives.filter(o=>o.type!=='text'||o.text.trim());
 for(const o of primitives)if(o.commands)o.box=bounds(o.commands);
 const replacedMath=[];for(const [idx,base,sub,base2,sub2] of math){const icon=raw.icons.find(i=>i.id===`icon-${idx}`),[x,y,w,h]=icon.box,seq=primitives.find(o=>o.icon===icon.id)?.seq??0;primitives=primitives.filter(o=>o.icon!==icon.id);const count=base2?2:1,bw=w/count,size=Math.min(h*.93,bw*1.15),add=(suffix,t,xx,baseline,sz)=>primitives.push({id:`math-${idx}-${suffix}`,type:'text',seq:seq+.1,box:[xx,baseline-sz,sz*.9,sz],text:t,positions:[[xx,baseline]],font:'Times New Roman',size:sz,bold:true,italic:true,fill:'#000000',angle:0});add('base',base,x,y+h*.77,size);add('sub',sub,x+size*(base==='M'?.8:.55),y+h*.95,size*.58);if(base2){add('base2',base2,x+bw,y+h*.77,size);add('sub2',sub2,x+bw+size*1.05,y+h*.95,size*.58);}exceptions.push({code:'text-overlap',ids:[`math-${idx}-base`,`math-${idx}-sub`],reason:'Intentional typeset subscript: separate editable glyphs share a baseline region, not overlapping prose.'});if(base2)exceptions.push({code:'text-overlap',ids:[`math-${idx}-base2`,`math-${idx}-sub2`],reason:'Intentional typeset subscript.'});replacedMath.push({sourceIcon:icon.id,nativeText:base+'_'+sub+(base2?base2+'_'+sub2:''),reason:'Source math was raster in PDF; recovered by direct figure inspection, never traced as words'});}
 if(name==='memskill'){
  const reset=modules.find(m=>m.id==='reset-event');reset.anchorShapeId='label-block:reset-event';
  for(const m of modules)if(m.id==='memory-bank')m.captionIncluded=true;
  const from=edges.find(e=>e.id==='retrieve-memory');from.from.offset=[325,31];from.from.surface=[134,31,227,70];from.from.reason='Top edge of the rectangular bank component in the compound memory-bank silhouette.';from.points=[[699,520],[699,380]];
  const query=edges.find(e=>e.id==='memory-query');query.to.offset=[258,31];query.to.surface=[134,31,227,70];query.to.reason='Top edge of the rectangular bank component, offset from whole compound module bbox.';query.points=[[632,380],[632,520]];
  edges.push({id:'reset-every-trace',from:{module:'reset-event',side:'bottom',fraction:126/220},to:{module:'memory-bank',side:'top',offset:[136,31],surface:[134,31,227,70],reason:'Bank component top edge in compound cylinder-and-bank silhouette.'},points:[[510,460],[510,520]],stroke:'#000000',width:3.4,startArrow:'triangle',endArrow:'triangle',arrowSize:'lg',meaning:'Per-trace memory reset; bidirectional visual style retained from source reset indicator.'});
  const segmentation=edges.find(e=>e.id==='segmentation');segmentation.operator='segmenter';segmentation.labelIds=['text-4','text-5'];
 }
 if(name==='memskill'){
  primitives=primitives.filter(o=>!o.icon||!Array.from({length:8},(_,i)=>`icon-${i+27}`).includes(o.icon));
  for(const [owner,points] of [
   ['trace-transfer-band',[[306,134],[360,116],[360,229],[306,213]]],
   ['read-skills-band',[[1066,251],[1114,267],[1114,470],[1066,488]]],
   ['hard-case-transfer-band',[[1591,515],[1618,501],[1618,809],[1591,808]]],
   ['evolution-transfer-band',[[1591,129],[1618,145],[1618,365],[1591,381]]]
  ])primitives.push({id:`flat-${owner}`,type:'path',seq:-5,owner,box:bounds([['M',...points[0]],...points.slice(1).map(p=>['L',...p]),['Z']]),commands:[['M',...points[0]],...points.slice(1).map(p=>['L',...p]),['Z']],fill:'#B9CBDD',stroke:'none',width:0});
 }
 const removed=[];for(const o of primitives){if(o.type!=='path'||o.icon)continue;const ps=o.commands.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0).map((x,i)=>[x,c[i*2+2]]));if(!ps.length)continue;const e=edges.find(e=>ps.every(p=>[e.points,e.removeSourcePoints].filter(Boolean).some(route=>route.slice(1).some((b,i)=>distance(p,route[i],b)<24))));if(e){removed.push(o.id);o.replacedBy=e.id;}}
 if(name==='agemem')for(const o of primitives)if(['icon-52','icon-53','icon-54','icon-60'].includes(o.icon))removed.push(o.id);
 // First locate actual border shapes, then respect source painter order when
 // assigning overlapping stack cards. A region center alone is insufficient.
 for(const m of modules){if(m.id==='source-context')continue;const candidates=primitives.filter(o=>o.type==='path'&&!o.icon&&!removed.includes(o.id));const score=o=>o.box.reduce((n,v,i)=>n+Math.abs(v-m.box[i]),0);candidates.sort((a,b)=>score(a)-score(b));if(candidates[0]&&score(candidates[0])<45){m.anchorShapeId=candidates[0].id;m.sourceStart=Math.min(...candidates.filter(o=>score(o)<45).map(o=>o.seq));}else{const parts=candidates.filter(o=>Math.abs(o.box[0]-m.box[0])<5&&Math.abs(o.box[2]-m.box[2])<8&&contains(m.box,o.box,8));if(parts.length){parts.sort((a,b)=>b.box[2]*b.box[3]-a.box[2]*a.box[3]);m.anchorShapeId=parts[0].id;m.sourceStart=Math.min(...parts.map(o=>o.seq));}}}
 for(const o of primitives){const [x,y,w,h]=o.box,c={x:x+w/2,y:y+h/2,w:0,h:0};let owners=modules.filter(m=>m.id!=='source-context'&&(o.type==='text'?contains(m.box,c,1):contains(m.box,o.box,15)));
  const stacks=owners.filter(m=>['skill-bank','hard-cases'].includes(m.parent)&&m.sourceStart!==undefined&&m.sourceStart<=o.seq);if(stacks.length){stacks.sort((a,b)=>b.sourceStart-a.sourceStart);o.owner=stacks[0].id;continue;}
  owners=owners.filter(m=>!['skill-bank','hard-cases'].includes(m.parent)||m.sourceStart===undefined||m.sourceStart<=o.seq);
  owners.sort((a,b)=>(a.box[2]*a.box[3])-(b.box[2]*b.box[3]));o.owner=owners[0]?.id??'source-context';}
 for(const m of modules)if(!m.anchorShapeId&&edges.some(e=>e.from.module===m.id||e.to.module===m.id)){const paths=primitives.filter(o=>o.owner===m.id&&o.type==='path'&&!removed.includes(o.id));paths.sort((a,b)=>b.box[2]*b.box[3]-a.box[2]*a.box[3]);if(paths[0])m.anchorShapeId=paths[0].id;}
 if(name==='memskill')modules.find(m=>m.id==='reset-event').anchorShapeId='label-block:reset-event';
 // Explicit source-preserved stacking is audited as an exception, never hidden.
 for(let i=0;i<modules.length;i++)for(let j=i+1;j<modules.length;j++){const a=modules[i],b=modules[j];if(a.parent===b.parent&&['skill-bank','hard-cases'].includes(a.parent)&&intersection(a.box,b.box))exceptions.push({code:'module-overlap',ids:[a.id,b.id],reason:'Original figure intentionally stacks reusable-skill/failure-case cards; preserve source occlusion and order.'});}
 if(name==='memskill')primitives.push({id:'loop-label-whiteplate',type:'path',seq:-10,owner:'loop-label',box:[1004,815,490,43],commands:[['M',1004,815],['L',1494,815],['L',1494,858],['L',1004,858],['Z']],fill:'#FFFFFF',stroke:'none',width:0});
 const scene={version:'1.0',title:name,width:Math.ceil(raw.width),height:Math.ceil(raw.height),source:{...raw.source,paperURL:name==='agemem'?'https://arxiv.org/abs/2601.01885v1':'https://arxiv.org/abs/2602.02474v1',selectedFigure:name==='agemem'?'Figure 1(c), selected unified-management panel; excludes panels a/b and external captions':'Figure 2, full architecture; external paper caption excluded'},modules,edges,primitives,labels:primitives.filter(o=>o.type==='text').map(o=>({id:o.id,owner:o.owner,...(name==='memskill'&&o.id==='text-10'?{textBox:[530,590,200,40],placement:'outside-bottom',reason:'Source caption of the compound memory-bank illustration; outside the bank silhouette intentionally.'}:{})})),removedPrimitiveIds:[...new Set(removed)],exceptions,replacedMath,operations:name==='memskill'?[{id:'segmenter',label:'Segmenter',onEdge:'segmentation',primitiveIds:['text-4','text-5'],input:'selected-trace',output:'span-sequence',source:'Method §3.1/3.3; operation is an arrow annotation in Figure 2, not an invented visible box.'}]:[],layoutChanges:['Original PDF coordinates and labels recovered; only source-backed math images converted to native text.','Original raster gradient arrows converted to editable solid-color native connectors, per user no-gradient constraint; AgeMem input shafts retain a broad 11 px weight.','Connectors extended to declared module edges; full-line routes and layer ordering are explicitly editable.']};
 const configure=(id,ids,textBox,pad=4)=>{const m=scene.modules.find(m=>m.id===id);m.centerTextIds=ids;m.textBox=textBox??m.box;m.minPadding=pad;m.minFontScale=.9;};
 if(name==='agemem'){
  configure('query',['text-91','text-92','text-93'],[51,84,215,81]);
  configure('session-content',['text-94','text-95'],[397,28,119,65],2);
  configure('short-term-tools',['text-102','text-103'],[126,316,156,59],2);
  configure('long-term-tools',['text-104','text-105'],[371,311,153,59],2);
  configure('llm-answer',['text-108','text-109'],[130,587,119,57],2);
 }else{
  configure('state-skill-encoder',['text-19','text-20'],null,4);configure('skill-selection',['text-245','text-246'],null,4);configure('executor',['text-17','text-18'],null,4);
  configure('evaluation',['text-23'],null,4);configure('task-reward',['text-24'],null,4);configure('retriever',['text-13'],null,5);configure('reset-event',['text-26'],null,1);
  configure('analyze-failures',['text-238'],null,5);configure('aggregate-cases',['text-235','text-236'],null,4);configure('difficulty-filtering',['text-234'],null,5);configure('cluster-cases',['text-228'],null,5);configure('refine-skills',['text-240','text-241'],null,4);
 }
 if(name==='memskill'){transformText(scene.primitives.find(o=>o.id==='text-10'),0,-3);for(const o of scene.primitives.filter(o=>o.id.startsWith('math-11-')))transformText(o,-12,0);scene.layoutChanges.push('Action notation moved 12 px left to clear the selected-skills arrowhead; wording and topology preserved.');}
 if(name==='memskill')scene.layoutChanges.push('Aggregate/analysis module boundaries calibrated to original vector outlines; side lanes moved outward to prevent border intrusion.');
 const fitted=await fitCenteredBlocks(scene);
 const rawIds=new Set(raw.primitives.map(o=>o.id)),refHash=(await import('node:crypto')).default.createHash('sha256').update(await fs.readFile(path.join(dir,'source/reference.png'))).digest('hex');
 for(const text of fitted.scene.primitives.filter(o=>o.type==='text'&&rawIds.has(o.id)))for(const shape of fitted.scene.primitives.filter(o=>o.type==='path'&&!o.icon&&rawIds.has(o.id)&&o.fill!=='none'&&(o.opacity??1)>.95&&o.seq>text.seq)){
  const a=modules.find(m=>m.id===text.owner),b=modules.find(m=>m.id===shape.owner);if(a?.id===b?.id||!['skill-bank','hard-cases'].includes(a?.parent)||a?.parent!==b?.parent||!intersection(text.box,shape.box))continue;
  const ids=[text.id,shape.id];fitted.scene.exceptions.push({code:'opaque-label-occlusion',ids,reason:'Original PDF painter order intentionally places this exact later card shape over this exact earlier card label; source stack geometry preserved.',geometryHash:geometryPairHash(fitted.scene,ids),sourceReferenceSHA256:refHash});
 }
 await saveEditableFigure(fitted.scene,path.join(dir,revision));await fs.writeFile(path.join(dir,revision,'layout-changes.json'),JSON.stringify(fitted.changes,null,2));console.log(name,{modules:modules.length,edges:edges.length,text:scene.labels.length,removed:removed.length,boundShapes:modules.filter(m=>m.anchorShapeId).length,hash:topologyHash(scene)});
}
