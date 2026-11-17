import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {browserRuntime} from '../../../paperfigure/scripts/layout-inspect.mjs';
import {freezeTypography} from '../../../paperfigure/scripts/typography-profile.mjs';
import {toEditableSVG,saveEditableFigure} from '../../../paperfigure/scripts/layout-export.mjs';
import sharp from '../../../paperfigure/node_modules/sharp/lib/index.js';
const base=path.dirname(new URL(import.meta.url).pathname), revision=process.argv[2]??'v1';
const dest=path.join(base,'source-'+revision);await fs.mkdir(dest,{recursive:true});
const reference='../2026-11-17-agentless-contribution/selected-reference.png';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const referenceHash=sha(await fs.readFile(path.resolve(base,reference)));
if(referenceHash!=='8e42486349ee50cb69b29b9708c3347ad601252ef878e19b8ea1ac102db7fcfb')throw Error('Target changed');
const s={version:'1.0',title:'Agentless — editable reconstruction of selected contribution design',width:1637,height:960,source:{reference,sha256:referenceHash,scope:'Reference-bound full native reconstruction; not a redesigned layout. Typeface identity and raster texture are approximated.'},modules:[],primitives:[],labels:[],edges:[],groupIcons:true,cleanArrowTips:true};
let seq=0;const regions=[];
const ink='#10151F',line='#344256',blue='#1454F5',teal='#087C78',muted='#D1D5DC',gold='#FDE47B';
function M(id,box,anchorShapeId,extra={}){s.modules.push({id,box,...(anchorShapeId?{anchorShapeId}:{}),...extra});}
function P(id,owner,commands,fill='none',stroke=ink,width=2.2,extra={}){const pts=commands.flatMap(c=>{const a=[];for(let i=1;i<c.length;i+=2)a.push([c[i],c[i+1]]);return a;});const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);s.primitives.push({id,owner,type:'path',seq:seq++,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)],commands,fill,stroke,width,...extra});}
function R(id,owner,[x,y,w,h],fill='#FFFFFF',stroke=line,width=2.2,r=10,extra={}){r=Math.min(r,w/2,h/2);const k=r*.55228475;P(id,owner,[['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k,y,x+w,y+r-k,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k,y+h,x,y+h-r+k,x,y+h-r],['L',x,y+r],['C',x,y+r-k,x+r-k,y,x+r,y],['Z']],fill,stroke,width,extra);}
function poly(id,owner,pts,fill,stroke='none',width=0,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]).concat([['Z']]),fill,stroke,width,extra);}
function L(id,owner,pts,stroke=line,width=2.4,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]),'none',stroke,width,{lineCap:'round',...extra});}
function anchorRegions(){for(const m of s.modules){if(!m.anchorShapeId)continue;const a=s.primitives.find(p=>p.id===m.anchorShapeId);regions.push({module:m.id,box:a.box,anchorMeaning:'Main visible source shape; associated labels are independently bound by the transcript and frozen typography profile.'});}}
function E(id,from,to,pts,extra={}){const fm=s.modules.find(m=>m.id===from),tm=s.modules.find(m=>m.id===to);s.edges.push({id,from:{module:from,side:'right',offset:[pts[0][0]-fm.box[0],pts[0][1]-fm.box[1]],reason:'Source-registered visible endpoint'},to:{module:to,side:'left',offset:[pts.at(-1)[0]-tm.box[0],pts.at(-1)[1]-tm.box[1]],reason:'Source-registered visible endpoint'},points:pts,stroke:line,width:4,startArrow:'none',endArrow:'triangle',arrowSize:'med',...extra});}
M('control-brace',[126,54,1468,35],'control-brace-path',{container:true,routingObstacle:false});L('control-brace-path','control-brace',[[127,87],[127,57],[1593,57],[1593,87]],ink,3.3);
M('fixed-control',[334,8,637,68],'fixed-control-box');R('fixed-control-box','fixed-control',[334,8,637,68],'#FFFFFF',ink,3.3,10);
M('no-autonomy',[1003,14,421,52],'no-autonomy-box');R('no-autonomy-box','no-autonomy',[1003,14,421,52],'#FFFFFF','#697180',2.8,8);
M('funnel',[95,117,805,838],'funnel-outline',{container:true,routingObstacle:false});
const funnel=[['M',111,117],['L',883,117],['C',897,117,902,122,898,140],['L',702,931],['C',698,950,688,955,672,955],['L',316,955],['C',298,955,288,950,283,931],['L',96,141],['C',92,125,95,117,111,117],['Z']];
P('funnel-fill','funnel',funnel,'#F4F6F9','none',0);
poly('repo-band','funnel',[[108,185],[887,185],[840,382],[155,382]],'#E7EDF4');
poly('files-band','funnel',[[157,391],[838,391],[800,552],[195,552]],'#E9EFF5');
poly('elements-band','funnel',[[197,562],[797,562],[764,701],[230,701]],'#E7EEF5');
poly('locations-band','funnel',[[232,710],[762,710],[748,765],[245,765]],'#E6ECF3');
poly('context-band','funnel',[[248,777],[744,777],[702,931],[687,951],[300,951],[284,931]],'#E6ECF3');
P('funnel-outline','funnel',funnel,'none',line,3);
M('repair-panel',[914,141,717,588],'repair-panel-box',{container:true,routingObstacle:false});R('repair-panel-box','repair-panel',[914,141,717,588],'#FFFFFF',ink,2.8,12);
M('selection-panel',[907,775,729,173],'selection-panel-box',{container:true,routingObstacle:false});R('selection-panel-box','selection-panel',[907,775,729,173],'#FFFFFF',line,2.2,12);
M('issue-left',[6,572,131,88],'issue-left-box');R('issue-left-box','issue-left',[6,572,131,88],'#EEF0F5',line,3.2,12);
M('repo-icon',[237,268,134,105],'repo-page-front',{parent:'funnel'});
for(const [n,x,y,w,h] of [[0,255,268,91,77],[1,252,284,104,77],[2,238,299,132,74]]){const icon='repo-document-stack';P('repo-page-'+n,'repo-icon',[['M',x+6,y],['L',x+w-17,y],['L',x+w,y+17],['L',x+w,y+h-6],['Q',x+w,y+h,x+w-6,y+h],['L',x+6,y+h],['Q',x,y+h,x,y+h-6],['L',x,y+6],['Q',x,y,x+6,y],['Z']],'#FFFFFF',ink,2.5,{icon});poly('repo-fold-'+n,'repo-icon',[[x+w-17,y],[x+w-17,y+17],[x+w,y+17]],'#CBD2DE',ink,1.5,{icon});}
for(const [n,x,y,w]of [[0,275,315,71],[1,275,331,80],[2,275,347,52]])R('repo-line-'+n,'repo-icon',[x,y,w,6],'#AAB2C1','none',0,2,{icon:'repo-document-stack'});
// Anchor is the full front sheet, not an invisible box.
s.modules.find(m=>m.id==='repo-icon').anchorShapeId='repo-page-2';
M('tree',[555,229,220,144],'tree-selected',{parent:'funnel',container:true,routingObstacle:false});
function folder(id,x,y,fill='#E8EEF6'){P(id,'tree',[['M',x+2,y+5],['L',x+11,y+5],['L',x+14,y+9],['L',x+25,y+9],['L',x+25,y+24],['L',x+2,y+24],['Z']],fill,line,2.3,{icon:'icon-'+id});}
folder('folder-root',558,225);folder('folder-django',589,260);folder('folder-selected',618,315);folder('folder-other',589,348,'#B7C2D4');
L('tree-trunk','tree',[[568,263],[568,363],[584,363]],ink,2.2);L('tree-branch-a','tree',[[568,277],[584,277]],ink,2.2);L('tree-subtrunk','tree',[[598,299],[598,332],[614,332]],ink,2.2);
R('tree-selected','tree',[646,316,118,33],'#D5E4FF','#5889EF',1.7,7);
M('llm-files',[178,442,80,42],'llm-files-box',{parent:'funnel'});R('llm-files-box','llm-files',[178,442,80,42],blue,'#FFFFFF',1.8,15);
M('selected-files',[275,459,162,50],'selected-files-box',{parent:'funnel'});R('selected-files-box','selected-files',[275,459,162,50],'#F7F9FC','#7A879D',2.4,8);R('selected-files-highlight','selected-files',[287,468,136,32],'#D8E7FF','none',0,4);
M('skeleton',[582,449,213,86],'skeleton-box',{parent:'funnel'});R('skeleton-box','skeleton',[582,449,213,86],'#F8FAFD','#56647B',2.3,8);R('skeleton-highlight','skeleton',[593,490,191,35],'#BBD2FF','none',0,3);
M('llm-elements',[212,597,80,42],'llm-elements-box',{parent:'funnel'});R('llm-elements-box','llm-elements',[212,597,80,42],blue,'#FFFFFF',1.8,15);
M('selected-element',[303,619,155,42],'selected-element-box',{parent:'funnel'});R('selected-element-box','selected-element',[303,619,155,42],'#D5E6FF','#286BFF',2.2,7);
M('selected-code',[584,612,195,81],'selected-code-box',{parent:'funnel'});R('selected-code-box','selected-code',[584,612,195,81],'#FAFBFD',ink,2,8);
M('llm-locations',[238,720,81,42],'llm-locations-box',{parent:'funnel'});R('llm-locations-box','llm-locations',[238,720,81,42],blue,'#FFFFFF',1.8,15);
M('left-context',[413,833,251,111],'left-context-box',{parent:'funnel'});R('left-context-box','left-context',[413,833,251,111],'#FAFBFC','#56647B',2.2,8);
R('left-context-bar-0','left-context',[424,845,216,12],muted,'none',0,2);R('left-context-highlight','left-context',[424,879,231,32],gold,'none',0,3);R('left-context-bar-1','left-context',[425,920,215,11],muted,'none',0,2);
M('right-context',[945,307,245,180],'right-context-box',{parent:'repair-panel'});R('right-context-box','right-context',[945,307,245,180],'#FCFCFD','#667087',2.2,8);
for(const [n,y]of [[0,326],[1,355],[2,441],[3,463]])R('context-bar-'+n,'right-context',[964,y,204-(n%2)*17,12],muted,'none',0,2);
R('right-context-highlight','right-context',[946,388,233,39],gold,'none',0,3);
M('search',[1298,242,314,96],'search-box',{parent:'repair-panel'});R('search-box','search',[1298,242,314,96],'#FAFAFC','#737A88',2,8);R('search-minus-band','search',[1322,286,38,40],'#FCE5E6','none',0,0);R('search-code-band','search',[1362,286,238,40],'#E0E1E6','none',0,1);
M('replace',[1298,350,314,96],'replace-box',{parent:'repair-panel'});R('replace-box','replace',[1298,350,314,96],'#FAFCFC','#737A88',2,8);R('replace-plus-band','replace',[1322,394,38,38],'#DCF6ED','none',0,0);R('replace-code-band','replace',[1362,394,238,38],'#D1EDE5','none',0,1);
M('issue-right',[887,586,97,66],'issue-right-box',{aboveEdges:true});R('issue-right-box','issue-right',[887,586,97,66],'#F1F2F6',line,2.6,10);
M('llm-repair',[1035,596,101,49],'llm-repair-box',{parent:'repair-panel'});R('llm-repair-box','llm-repair',[1035,596,101,49],blue,'#FFFFFF',1.7,16);
M('candidates',[1318,538,273,165],'candidate-front',{parent:'repair-panel',container:true,routingObstacle:false});
for(const [name,x,y,w,h]of [['back',1369,538,221,123],['middle',1343,559,222,122],['front',1318,582,221,121]]){R('candidate-'+name,'candidates',[x,y,w,h],'#FCFFFF',teal,3.6,9,{icon:'candidate-stack'});R('candidate-green-'+name,'candidates',[x+11,y+55,w-23,34],'#B7F4D0','none',0,2,{icon:'candidate-stack'});if(name==='front')R('candidate-gray-front','candidates',[x+12,y+34,w-34,11],'#CCD3D9','none',0,2,{icon:'candidate-stack'});}
M('syntax',[926,824,170,78],'syntax-box',{parent:'selection-panel'});R('syntax-box','syntax',[926,824,170,78],'#E4E8EF',line,2.2,13);
M('normalize',[1164,824,188,78],'normalize-box',{parent:'selection-panel'});R('normalize-box','normalize',[1164,824,188,78],'#E4E8EF',line,2.2,13);
M('selected-patch',[1415,790,208,141],'selected-patch-box',{parent:'selection-panel'});R('selected-patch-box','selected-patch',[1415,790,208,141],'#FCFFFF',teal,2.3,11);R('selected-patch-sheet','selected-patch',[1433,830,159,92],'#FBFFFE','#7BADA5',1.8,10);R('selected-patch-green','selected-patch',[1443,862,142,31],'#B7F4D0','none',0,2);
// Native text plan, based on source glyph appearance and local metrics (not OCR).
const runtime=await browserRuntime(),browser=await runtime.chromium.launch({headless:true,executablePath:runtime.executablePath,timeout:30000});
const pg=await browser.newPage();await pg.setContent('<html></html>');
async function metrics(text,font,size,bold){return await pg.evaluate(({text,font,size,bold})=>{const c=document.createElement('canvas').getContext('2d');c.font=`${bold?'bold ':''}${size}px "${font}"`;const m=c.measureText(text);return {width:m.width,asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent,offsets:[...text].map((_,i)=>c.measureText(text.slice(0,i)).width)};},{text,font,size,bold});}
async function T(id,owner,text,box,size=28,bold=false,align='center',fill='#07090C',font='Arial',icon){let m=await metrics(text,font,size,bold);if(m.width>box[2]){size=+(size*box[2]/m.width).toFixed(3);m=await metrics(text,font,size,bold);}const x=align==='left'?box[0]:box[0]+(box[2]-m.width)/2,y=box[1]+(box[3]+m.asc-m.desc)/2;const part={id,owner,type:'text',seq:seq++,text,box:[x,y-size,m.width,size*1.25],positions:m.offsets.map(dx=>[x+dx,y]),font,size,bold,fill,...(icon?{icon}: {})};s.primitives.push(part);s.labels.push({id,owner,textBox:box,padding:0});return part;}
async function C(owner,lines,size,bold=true,fill='#07090C',font='Arial'){const m=s.modules.find(m=>m.id===owner),box=m.textBox??m.box;let ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const fit=Math.min(1,(box[2]-8)/Math.max(...ms.map(m=>m.width)));size=+(size*fit).toFixed(3);ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const gap=size*1.1,total=ms[0].asc+(lines.length-1)*gap+ms.at(-1).desc,baseY=box[1]+(box[3]-total)/2+ms[0].asc;m.centerTextIds=[];m.minPadding=3;for(let i=0;i<lines.length;i++){const x=box[0]+(box[2]-ms[i].width)/2,y=baseY+i*gap,id='text-'+owner+'-'+i;s.primitives.push({id,owner,type:'text',seq:seq++,text:lines[i],box:[x,y-size,ms[i].width,size*1.25],positions:ms[i].offsets.map(dx=>[x+dx,y]),font,size,bold,fill});s.labels.push({id,owner});m.centerTextIds.push(id);}}
await C('fixed-control',['Fixed localization + repair'],44);await C('no-autonomy',['No autonomous planning'],32);
await T('heading-localize','funnel','Hierarchical localization',[251,126,527,48],44,true);
await T('heading-repair','repair-panel','Localized Search/Replace',[989,149,586,43],42,true);
await T('repo-caption-a','funnel','Code',[209,192,146,32],30,true);await T('repo-caption-b','funnel','repository',[209,220,153,32],30,true);
await T('tree-caption','funnel','Repository tree',[546,187,225,35],29,true);
await T('build-tree','funnel','Build tree',[405,257,120,30],25,false);
await T('tree-django','tree','django/',[627,258,118,33],27,false,'left');
for(const [n,y]of [[0,232],[1,290],[2,351]])await T('tree-dots-'+n,'tree','...',[(n===2&&revision!=='v1')?620:609,y,45,25],26,true,'left');
await T('tree-selected-text','tree','fields.py',[653,318,108,29],27,false);
for(const id of ['llm-files','llm-elements','llm-locations'])await C(id,['LLM'],29,true,'#FFFFFF');await C('llm-repair',['LLM'],34,true,'#FFFFFF');
await C('issue-left',['Issue','report'],30);await C('issue-right',['Issue','report'],24);
await T('selected-files-caption','funnel','Selected files',[275,424,163,28],25,true);
await C('selected-files',['fields.py'],27,false);
await T('build-skeletons-a','funnel','Build',[467,440,70,28],24,false);await T('build-skeletons-b','funnel','skeletons',[445,467,119,29],24,false);
await T('skeleton-caption','funnel','Skeletons',[594,416,177,32],27,true);
await T('skeleton-uuid','skeleton','UUIDField(...)',[598,458,185,29],25,false,'left');await T('skeleton-method','skeleton','to_python(...)',[607,491,177,31],27,false,'left',blue);
await T('selected-element-caption','funnel','Selected element',[302,580,198,30],26,true,'left','#07090C','Arial Narrow');await C('selected-element',['to_python'],28,false,blue);
await T('read-code','funnel','Read code',[470,615,104,32],25,false,'center','#07090C','Arial Narrow');await T('selected-code-caption','funnel','Selected code',[586,578,182,32],26,true);
await T('code-dots-top','selected-code','...',[597,619,37,18],21,false,'left');await T('code-definition','selected-code','def to_python(self, ...):',[598,640,174,24],20,false,'left','#07090C','Arial Narrow');await T('code-dots-bottom','selected-code','...',[597,668,37,18],21,false,'left');
await T('locations-caption','funnel','Edit locations',[432,723,177,33],26,true);await T('left-context-caption','funnel','Context window',[423,799,229,32],26,true);
await T('context-padding-a','funnel','Context',[280,828,98,26],24,false);await T('context-padding-b','funnel','padding',[280,854,98,26],24,false);
for(const [n,y]of [[0,846],[1,863],[2,883],[3,917]])await T('left-context-dots-'+n,'left-context','...',[439,y,39,18],20,true,'left');
await T('right-context-caption','repair-panel','Context window',[961,270,224,33],27,true);
for(const [n,y]of [[0,320],[1,349],[2,396],[3,435],[4,457]])await T('right-context-dots-'+n,'right-context','...',[969,y,41,23],22,true,'left');
await T('search-heading','search','SEARCH',[1318,247,160,32],29,true,'left');await T('replace-heading','replace','REPLACE',[1318,355,175,32],29,true,'left');
await T('search-minus','search','−',[1322,285,38,40],33,true,'center','#D51D2A');await T('search-dots','search','...',[1370,285,80,40],31,true,'left','#B61F28');await T('replace-plus','replace','+',[1322,394,38,38],35,true,'center','#00876B');await T('replace-dots','replace','...',[1370,394,80,38],31,true,'left','#08775E');
await T('candidates-caption','repair-panel','Candidate patches',[1319,494,270,35],28,true);
for(const [id,x,y]of [['back',1380,542],['middle',1355,564],['front-top',1330,586],['front-gray',1330,608],['front-bottom',1330,677]])await T('candidate-dots-'+id,'candidates','...',[x,y,45,24],22,true,'left','#07090C','Arial','candidate-stack');
await T('candidate-plus','candidates','+',[1327,637,36,33],32,true,'center','#006E52','Arial','candidate-stack');await T('candidate-change','candidates','...',[1374,637,70,33],25,true,'left','#006E52','Arial','candidate-stack');
await C('syntax',['Syntax +','regression'],25);await C('normalize',['Normalize +','frequency'],25);
await T('selected-patch-heading','selected-patch','Selected patch',[1430,795,181,29],25,true,'left','#064B43');
await T('selected-dots-top','selected-patch','...',[1449,837,50,22],21,true,'left');await T('selected-plus','selected-patch','+',[1442,861,34,31],30,true,'center','#00785B');await T('selected-change','selected-patch','...',[1486,861,61,31],23,true,'left','#00785B');await T('selected-dots-bottom','selected-patch','...',[1449,894,50,22],21,true,'left');
await browser.close();
// Source-visible connectors; endpoints use source-registered offsets, not auto-layout.
E('build-tree-arrow','repo-icon','tree',[[411,299],[529,299]],{meaning:'Deterministic tree construction'});
E('tree-to-file-selection','tree','selected-files',[[487,386],[487,415]],{meaning:'Repository tree to first bounded selection'});
E('file-to-skeleton','selected-files','skeleton',[[457,500],[567,500]],{meaning:'Build skeletons from selected files'});
E('skeleton-to-element','skeleton','selected-element',[[496,552],[496,580]],{meaning:'Skeletons to selected elements'});
E('element-to-code','selected-element','selected-code',[[471,652],[571,652]],{meaning:'Read original selected source'});
E('code-to-locations','selected-code','llm-locations',[[504,694],[504,720]],{meaning:'Selected source to bounded edit localization'});
E('locations-to-context','llm-locations','left-context',[[515,766],[515,794]],{meaning:'Edit locations to padded source context'});
E('padding-to-context','funnel','left-context',[[287,889],[401,889]],{meaning:'Deterministic context padding'});
E('issue-file','issue-left','llm-files',[[80,572],[80,464],[174,464]],{meaning:'Shared issue to file selection'});
E('issue-elements','issue-left','llm-elements',[[137,620],[207,620]],{meaning:'Shared issue to element selection'});
E('focused-context-handoff','left-context','right-context',[[669,882],[869,882],[869,410],[942,410]],{meaning:'Focused context to localized generation'});
E('magnify-search','right-context','search',[[1179,421],[1179,393],[1298,286]],{endArrow:'none',width:3,stroke:'#7D8490',meaning:'Magnification of selected interval into SEARCH'});
E('magnify-replace','right-context','replace',[[1179,421],[1298,432]],{endArrow:'none',width:3,stroke:'#7D8490',meaning:'Magnification into REPLACE, no dataflow arrowhead'});
E('context-to-generator','right-context','llm-repair',[[1084,487],[1084,589]],{meaning:'Focused context input to LLM generation'});
E('issue-to-generator','issue-right','llm-repair',[[987,621],[1029,621]],{meaning:'Same issue input to generation'});
E('generator-to-candidates','llm-repair','candidates',[[1141,621],[1296,621]],{meaning:'LLM generates candidate local patches'});
E('candidate-to-filter','repair-panel','selection-panel',[[1274,729],[1274,767]],{meaning:'Generated candidates to deterministic selection'});
E('syntax-to-frequency','syntax','normalize',[[1102,861],[1155,861]],{meaning:'Syntax/regression then normalization/frequency'});
E('frequency-to-patch','normalize','selected-patch',[[1360,861],[1406,861]],{meaning:'Ranking to selected patch'});
if(revision==='v1')anchorRegions();else{const frozen=JSON.parse(await fs.readFile(path.join(base,'reference-geometry.json'),'utf8'));if(frozen.sha256!==referenceHash)throw Error('Frozen source geometry is stale');regions.push(...frozen.regions);}
const profile=freezeTypography(s,{kind:'image-approximation',locator:reference,notes:'Generated raster font identity is unknown. Arial/Arial Narrow chosen by glyph shape and per-label source dimensions, with actual Chromium measurement. Gray raster microtexture is represented by native solid fills; all geometry/text remains independently editable.'});
await fs.writeFile(path.join(dest,'layout-scene.json'),JSON.stringify(s,null,2)+'\n');
const profileBytes=Buffer.from(JSON.stringify(profile,null,2)+'\n');await fs.writeFile(path.join(dest,'typography-profile.json'),profileBytes);
const contract={version:'1.0',mode:'reconstruct',reference:{path:path.relative(dest,path.resolve(base,reference)),sha256:referenceHash,width:1637,height:960},centerTolerancePx:4,sizeTolerancePx:6,regions,geometryChanges:[],contentChanges:[],typography:{path:'typography-profile.json',sha256:sha(profileBytes)},appearanceApproximations:['Raster anti-aliasing, soft microtexture and subtle nonuniform tint approximated by solid source-color native fills; no rearrangement.','Typeface identity is approximate; per-label geometry and weights frozen, actual Office fonts must pass.'],reviewRequired:'Exact target versus full SVG and actual Office render; native audit and contribution prominence, not pixel error alone.'};
await fs.writeFile(path.join(dest,'reference-contract.json'),JSON.stringify(contract,null,2)+'\n');
const transcript={version:'1.0',reference:contract.reference,expectedCounts:{modules:s.modules.length,edges:s.edges.length,labels:s.labels.length,primitives:s.primitives.length},labels:s.labels.map(l=>{const p=s.primitives.find(p=>p.id===l.id);return {id:l.id,owner:l.owner,text:p.text,referenceRegion:l.textBox??s.modules.find(m=>m.id===l.owner).box,font:p.font,size:p.size,bold:p.bold,confidence:'Manually transcribed; approximate typography'};}),groups:s.modules.map(m=>({id:m.id,parent:m.parent,anchorShapeId:m.anchorShapeId,referenceRegion:regions.find(r=>r.module===m.id)?.box})),edges:s.edges.map(e=>({id:e.id,from:e.from.module,to:e.to.module,sourceRoute:e.points,arrowhead:e.endArrow,meaning:e.meaning})),notes:['Independent reference-inspection.md is the non-authoring inventory check. Counts here are declarations checked against that and source pixels, not automatic completeness proof.','Hidden portions of overlapping rear patch cards contain no manufactured text. Visible rear-card dots are separate native text.']};
await fs.writeFile(path.join(dest,'reference-transcript.json'),JSON.stringify(transcript,null,2)+'\n');
const draftSVG=toEditableSVG(s);await fs.writeFile(path.join(dest,'draft.svg'),draftSVG);await sharp(Buffer.from(draftSVG)).png().toFile(path.join(dest,'draft.png'));
// A small native sample of heading, badge and dense code before full reconstruction.
const sampleIDs=['fixed-control','llm-files','selected-code'];const sample={...s,title:'Partial typography feasibility sample',modules:s.modules.filter(m=>sampleIDs.includes(m.id)).map(m=>{const x={...m};delete x.parent;return x;}),primitives:s.primitives.filter(p=>sampleIDs.includes(p.owner)),labels:s.labels.filter(l=>sampleIDs.includes(l.owner)),edges:[]};
const sampleOut=path.join(base,'typography-sample-v1');if(revision==='v1')await saveEditableFigure(sample,sampleOut);
console.log(JSON.stringify({source:dest,sample:sampleOut,modules:s.modules.length,labels:s.labels.length,edges:s.edges.length,primitives:s.primitives.length}));
