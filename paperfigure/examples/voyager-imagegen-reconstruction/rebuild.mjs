// Source-registered reconstruction. A common editable object tree emits SVG and OOXML.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import sharp from 'sharp';
import {esc} from '../../scripts/export.mjs';
const root=path.dirname(new URL(import.meta.url).pathname),out=path.join(root,process.argv[2]??'output-v1');
await fs.mkdir(out); // Never overwrite an existing revision.
const W=2061,H=763,N='#081C50',INK='#050F22',BLUE='#E5F0FC',GREEN='#ECFAEC',WHITE='#FAFAFA',BORDER='#111C32';
const tree=[],groups=[],labels=[],objects=[];let seq=0;
const box=p=>{const xy=p.flatMap(c=>c.slice(1).reduce((r,v,i,a)=>i%2?r:[...r,[v,a[i+1]]],[]));const xs=xy.map(p=>p[0]),ys=xy.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(1,Math.max(...xs)-Math.min(...xs)),Math.max(1,Math.max(...ys)-Math.min(...ys))];};
function group(id,role,region,fn,parent=tree){const g={id,role,region,children:[]};parent.push(g);groups.push({id,role,referenceRegion:region});const add=o=>{o.id??=`${id}-${++seq}`;o.owner=id;g.children.push(o);(o.type==='text'?labels:objects).push(o.type==='text'?{id:o.id,text:o.text,owner:id,referenceRegion:o.region}:{id:o.id,kind:o.kind??(role==='icon'?'icon-part':role==='edge'?'connector':'shape'),owner:id,referenceRegion:o.region});return o;};fn(add,g.children);return g;}
const rect=(a,x,y,w,h,fill=WHITE,stroke=BORDER,sw=1.7,r=13)=>a({type:'rect',region:[x,y,w,h],fill,stroke,sw,r});
const line=(a,x1,y1,x2,y2,stroke=BORDER,sw=1.4)=>a({type:'path',region:[Math.min(x1,x2),Math.min(y1,y2),Math.max(1,Math.abs(x2-x1)),Math.max(1,Math.abs(y2-y1))],cmd:[['M',x1,y1],['L',x2,y2]],fill:'none',stroke,sw});
function text(a,s,x,baseline,size=23,bold=false,w=500,opt={}){return a({type:'text',text:s,region:[x,baseline-size*.85,w,size*1.16],baseline,size,bold,fill:INK,font:'Times New Roman',...opt});}
const curve=(a,cmd,fill='none',stroke=BORDER,sw=1.6,kind)=>a({type:'path',region:box(cmd),cmd,fill,stroke,sw,kind});
function edge(id,pts,arrow=true,sw=4){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);group(id,'edge',[Math.min(...xs)-10,Math.min(...ys)-10,Math.max(20,Math.max(...xs)-Math.min(...xs)+20),Math.max(20,Math.max(...ys)-Math.min(...ys)+20)],a=>{
 // Rounded route corners, with individually editable straight connector segments.
 let last=pts[0];for(let i=1;i<pts.length;i++){let end=pts[i];if(i<pts.length-1){let next=pts[i+1],d=Math.hypot(end[0]-last[0],end[1]-last[1]),d2=Math.hypot(next[0]-end[0],next[1]-end[1]),r=Math.min(10,d/2,d2/2);const pre=[end[0]+(last[0]-end[0])*r/d,end[1]+(last[1]-end[1])*r/d],post=[end[0]+(next[0]-end[0])*r/d2,end[1]+(next[1]-end[1])*r/d2];line(a,...last,...pre,N,sw);curve(a,[['M',...pre],['Q',...end,...post]],'none',N,sw);last=post;}else{line(a,...last,...end,N,sw);}}
 if(arrow){const b=pts.at(-1),p=pts.at(-2),ang=Math.atan2(b[1]-p[1],b[0]-p[0]),u=[Math.cos(ang),Math.sin(ang)],v=[-u[1],u[0]],len=16,ww=7;curve(a,[['M',...b],['L',b[0]-len*u[0]+ww*v[0],b[1]-len*u[1]+ww*v[1]],['L',b[0]-len*u[0]-ww*v[0],b[1]-len*u[1]-ww*v[1]],['Z']],N,'none',0,'decoration');}
 });}
// Major areas carry the original semantic palette: blue = proposing/executing,
// green = retained state and reusable successful skills, gray = runtime scene.
group('curriculum-panel','container',[3,40,496,474],a=>{rect(a,3,40,496,474,BLUE,N,2.3,20);text(a,'Automatic Curriculum',88,81,34,true,400);});
group('generation-panel','container',[517,7,1070,672],a=>{rect(a,517,7,1070,672,BLUE,N,2.5,21);text(a,'Program Generation & Iterative Refinement',604,53,40,true,950);});
group('library-panel','container',[1646,48,413,571],a=>{rect(a,1646,48,413,571,GREEN,'#14592B',2.4,22);text(a,'Reusable Skill Library',1731,87,32,true,325);text(a,'(Persistent, Growing)',1731,119,27,false,325);});
// Long routes behind modules, registered to the reference rather than re-laid out.
edge('observations-to-curriculum',[[233,161],[256,161],[256,207],[282,207]]);
edge('history-to-curriculum',[[233,258],[256,258],[256,207],[282,207]]);
edge('curriculum-to-task',[[383,263],[383,325]]);
edge('retained-to-curriculum',[[373,615],[440,615],[440,513]],true,4.5);
edge('context-to-generator',[[1166,148],[1166,207],[871,207],[871,238]],true,4.3);
edge('generator-to-program',[[720,333],[720,371]]);
edge('program-to-runtime',[[909,509],[946,509]]);
edge('runtime-to-critic',[[1231,442],[1269,442]]);
edge('critic-to-feedback',[[1359,480],[1359,506]]);
edge('feedback-refinement-upper',[[1338,362],[1338,276],[1047,276]],true,4.5);
edge('feedback-refinement-outer',[[1536,512],[1536,275],[1047,275]],true,4.5);
edge('critic-success-to-library',[[1449,409],[1645,409]]);
edge('critic-failure',[[1449,435],[1474,435],[1474,544],[1501,544]]);
edge('next-task-return',[[1946,619],[1946,732],[194,732],[194,689]],true,4.4);
// Source modules and verbatim visible labels.
group('world-observations','module',[18,118,215,91],a=>{rect(a,18,118,215,91);text(a,'World',100,147,23,true,130);text(a,'Observations',100,170,22,true,130);text(a,'(latest)',100,194,23,false,130);});
group('task-history','module',[19,223,214,71],a=>{rect(a,19,223,214,71);text(a,'Task History',100,253,23,true,130);text(a,'(completed)',100,278,23,false,130);});
group('curriculum-controller','module',[282,130,203,133],a=>{rect(a,282,130,203,133,BLUE,N,2,16);line(a,282,183,485,183,'#9CA7B6',1.2);text(a,'Curriculum',340,166,26,true,142);text(a,'Propose Task',384,215,23,false,190,{align:'center'});text(a,'+ Context',384,241,23,false,170,{align:'center'});});
group('task-context','module',[149,325,315,175],a=>{curve(a,[['M',165,325],['L',440,325],['L',464,348],['L',464,484],['Q',464,500,448,500],['L',165,500],['Q',149,500,149,484],['L',149,341],['Q',149,325,165,325],['Z']],WHITE,BORDER,2);curve(a,[['M',441,326],['L',441,348],['L',464,348]],'none',BORDER,1.8);text(a,'Task:',179,354,24,true,200);rect(a,179,362,205,39,'#D5E8FC','none',0,7);text(a,'Mine 1 wood log',191,389,25,true,210);text(a,'Context:',179,427,23,true,220);text(a,'•  Retrieved code (top-k)',185,454,23,false,274);text(a,'•  Recent events (filtered)',185,480,23,false,274);});
group('retained-state','module',[13,537,360,152],a=>{rect(a,13,537,360,152,GREEN,'#14592B',2.2,18);text(a,'State (Retained)',100,573,27,true,270);rect(a,32,592,323,37,'#F3F9F3','#657B69',1.1,9);rect(a,32,635,323,37,'#F3F9F3','#657B69',1.1,9);text(a,'Latest world observations',100,617,22,false,250);text(a,'Runtime events (recent)',100,660,22,false,250);text(a,'</>',46,662,24,true,35,{font:'DejaVu Sans Mono'});});
group('retrieved-code','module',[544,77,371,122],a=>{rect(a,544,77,371,122,WHITE,N,1.8,16);text(a,'Retrieved Code (top-k)',635,109,24,true,275);text(a,'• chopTree()',639,137,18,true,260,{font:'DejaVu Sans Mono'});text(a,'• placeBlock()',639,159,18,true,260,{font:'DejaVu Sans Mono'});text(a,'• ...',639,181,18,true,230,{font:'DejaVu Sans Mono'});});
group('task-chat-context','module',[942,84,414,64],a=>{rect(a,942,84,414,64,WHITE,BORDER,2,15);text(a,'Context (task + filtered chat log)',1021,122,23,true,332);});
group('action-generator','module',[558,238,489,95],a=>{rect(a,558,238,489,95,BLUE,N,2,16);text(a,'Action LM (Code Generator)',666,278,28,true,376);line(a,666,288,1023,288,'#6484A2',1);text(a,'Generate / Refine JavaScript (bounded)',652,313,23,false,390);});
group('refine-caption','module',[1265,213,177,52],a=>{text(a,'Refine',1347,235,26,true,185,{align:'center'});text(a,'(with feedback)',1347,261,25,false,220,{align:'center'});});
group('program-document','module',[537,371,373,263],a=>{rect(a,537,371,373,263,WHITE,BORDER,1.7,16);line(a,538,418,909,418,'#9DA1A7',1.3);text(a,'</>',554,404,23,true,45,{font:'DejaVu Sans Mono'});text(a,'program.js',600,403,24,true,252);rect(a,540,421,41,196,'#F2F2F2','none',0,0);
 const ys=[449,477,505,533,561];for(let i=0;i<5;i++)text(a,String(i+1),555,ys[i],18,false,24,{font:'DejaVu Sans Mono',fill:'#555555'});
 // Native rich text and separate editable code lines, with source truncation retained.
 const code=[['async function ','main() {'],['const ','tree = await findBlock('],['','"oak_log");'],['await ','mineBlock(tree);'],['','}']];
 code.forEach((r,i)=>text(a,r.join(''),i===1||i===3?607:i===2?623:589,ys[i],18.5,false,i===1?299:317,{font:'DejaVu Sans Mono',letterSpacing:i===1?-1.30:-.75,runs:i===1?[{text:'const ',fill:'#001FBE'},{text:'tree = ',fill:INK},{text:'await ',fill:'#001FBE'},{text:'findBlock(',fill:INK}]:r[0]?[{text:r[0],fill:'#001FBE'},{text:r[1],fill:INK}]:[{text:r[1],fill:INK}]}));
});
group('runtime-execution','module',[946,365,286,290],(a,ch)=>{rect(a,946,365,286,290,WHITE,BORDER,2,16);line(a,947,410,1231,410,'#C5C8CB',1.1);text(a,'Execute JS',1000,396,24,true,227);rect(a,948,412,282,185,'#FAFAFA','none',0,0);text(a,'Runtime',1088,621,23,true,240,{align:'center'});text(a,'(all saved programs + primitives)',1088,644,20,false,280,{align:'center'});});
group('critic','module',[1269,362,180,118],a=>{rect(a,1269,362,180,118,BLUE,N,2,14);line(a,1270,414,1448,414,'#9CA7B6',1);text(a,'Critic',1345,398,29,true,100);text(a,'Verify',1361,439,22,false,150,{align:'center'});text(a,'(+ critique)',1361,463,22,false,170,{align:'center'});});
group('feedback','module',[1254,506,206,141],a=>{rect(a,1254,506,206,141,WHITE,BORDER,2,15);text(a,'Feedback',1269,534,24,true,185);rect(a,1265,545,184,35,'#D6F8D2','none',0,7);rect(a,1270,551,25,24,'#328D0F','none',0,3);curve(a,[['M',1275,562],['L',1280,568],['L',1291,556]],'none','#FFFFFF',2.4);text(a,'Success: Yes',1308,569,22,true,145);text(a,'Critique:',1308,608,21,false,145);text(a,'(clear and reusable)',1308,631,18,false,150);});
group('success-filter','module',[1491,389,132,42],a=>{rect(a,1491,389,132,42,GREEN,'#14592B',2,13);text(a,'Success only',1557,416,20,true,125,{align:'center'});});
group('failure-filter','module',[1501,512,120,62],a=>{rect(a,1501,512,120,62,WHITE,BORDER,1.8,14);text(a,'Failure',1561,537,22,true,114,{align:'center'});text(a,'(not saved)',1561,561,22,false,114,{align:'center'});});
const skillNames=['chopTree()','mineBlock(type)','placeBlock(type, pos)'],skillLines=[['Chop an entire tree and','collect the wood logs.'],['Mine a block of the given','type (e.g., "oak_log").'],['Place a block of the given','type at the target position.']];
for(let i=0;i<3;i++){const y=[164,283,396][i];group(`skill-card-${i+1}`,'module',[1674,y,368,i===1?100:106],a=>{rect(a,1674,y,368,i===1?100:106,WHITE,'#62666A',1.2,12);text(a,skillNames[i],1725,y+32,25,true,311);text(a,skillLines[i][0],1724,y+63,22,false,250);text(a,skillLines[i][1],1724,y+87,22,false,250);rect(a,1966,y+19,64,68,'#F3F3F3','#9F9F9F',1.4,8);text(a,'</>',1998,y+64,28,false,55,{font:'DejaVu Sans Mono',align:'center',fill:i===2?'#141C23':'#4E4E4E'});});}
group('library-continuation','module',[1675,521,367,51],a=>{rect(a,1675,521,367,51,'#F3F9F3','#66716A',1.3,11);text(a,'•••',1859,559,31,true,150,{align:'center',letterSpacing:6});});
group('next-task-label','module',[938,710,186,45],a=>{rect(a,938,710,186,45,WHITE,N,2.2,13);text(a,'Next task',1031,741,26,true,170,{align:'center'});});
// Import contour geometry only from non-text source crops. Each icon remains independent.
const graphics=JSON.parse(await fs.readFile(path.join(root,'traced-graphics.json')));
const addContour=(a,icon)=>{const cmd=icon.paths.flatMap(poly=>[['M',...poly[0]],...poly.slice(1).map(p=>['L',...p]),['Z']]);if(cmd.length)curve(a,cmd,icon.fill,'none',0);};
const iconOwners={'curriculum-mark':'curriculum-panel','generation-mark':'generation-panel','controller-mark':'curriculum-controller','action-mark':'action-generator','critic-mark':'critic','history-icon':'task-history','retrieved-icon':'retrieved-code','context-icon':'task-chat-context','edit-icon':'program-document','cube-icon':'runtime-execution','state-database':'retained-state','state-globe':'retained-state','library-database':'library-panel','skill-document-1':'skill-card-1','skill-document-2':'skill-card-2','skill-document-3':'skill-card-3','feedback-bubble':'feedback'};
for(const icon of graphics.filter(o=>!o.id.startsWith('minecraft-')&&!o.id.startsWith('world-icon-tone-')))group(icon.id,'icon',icon.region,a=>addContour(a,icon),tree.find(g=>g.id===iconOwners[icon.id]).children);
group('world-icon','icon',[34,137,53,47],a=>graphics.filter(o=>o.id.startsWith('world-icon-tone-')).forEach(o=>addContour(a,o)),tree.find(g=>g.id==='world-observations').children);
group('runtime-scene','icon',[947,412,283,185],a=>graphics.filter(o=>o.id.startsWith('minecraft-')).forEach(o=>addContour(a,o)),tree.find(g=>g.id==='runtime-execution').children);
// One shared tree, two native output encoders.
function pathD(cmd){return cmd.map(c=>c.join(' ')).join(' ');}
function svgNode(o){if(o.children)return `<g id="${o.id}" data-role="${o.role}">${o.children.map(svgNode).join('\n')}</g>`;
 const [x,y,w,h]=o.region,attrs=`id="${o.id}" fill="${o.fill}"`;
 if(o.type==='text'){const anchor=o.align==='center'?'middle':'start';return `<text ${attrs} x="${x}" y="${o.baseline}" font-family="${o.font==='DejaVu Sans Mono'?'Menlo, DejaVu Sans Mono, monospace':o.font}" xml:space="preserve" font-size="${o.size}" font-weight="${o.bold?'bold':'normal'}" text-anchor="${anchor}"${o.letterSpacing?` letter-spacing="${o.letterSpacing}"`:''}>${o.runs?o.runs.map(r=>`<tspan fill="${r.fill}">${esc(r.text)}</tspan>`).join(''):esc(o.text)}</text>`;}
 if(o.type==='rect')return `<rect ${attrs} x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r}" stroke="${o.stroke}" stroke-width="${o.sw}"/>`;
 return `<path ${attrs} d="${pathD(o.cmd)}" fill-rule="evenodd" stroke="${o.stroke}" stroke-width="${o.sw}" stroke-linejoin="round" stroke-linecap="round"/>`;}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" data-pptx-page-role="content"><rect id="canvas-background" width="${W}" height="${H}" fill="#FFFFFF"/>${tree.map(svgNode).join('\n')}</svg>\n`;
await fs.writeFile(path.join(out,'figure.svg'),svg);
const reference=await fs.readFile(path.join(root,'reference.png')),sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const inventory={version:'1.0',reference:{width:W,height:H,sha256:sha256(reference)},expectedCounts:{modules:groups.filter(g=>g.role==='module').length,edges:groups.filter(g=>g.role==='edge').length,icons:groups.filter(g=>g.role==='icon').length,labels:labels.length},labels,groups,objects,backgroundIds:['canvas-background']};
await fs.writeFile(path.join(out,'inventory.json'),JSON.stringify(inventory,null,2));await fs.writeFile(path.join(out,'object-tree.json'),JSON.stringify(tree,null,2));
// Native OOXML uses original pixel coordinates, rescaled only by the slide unit.
const E=v=>Math.round(v*9525),P=v=>Math.round(v*1000),clr=c=>c.replace('#','');let oid=1;const map=[];
const paint=c=>c==='none'?'<a:noFill/>':`<a:solidFill><a:srgbClr val="${clr(c)}"/></a:solidFill>`;
function nativeNode(o,parentId=null){const id=++oid;if(o.children){map.push({id,name:o.id,type:'group',role:o.role,owner:parentId});return `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="${id}" name="${o.id}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="${E(o.region[0])}" y="${E(o.region[1])}"/><a:ext cx="${E(o.region[2])}" cy="${E(o.region[3])}"/><a:chOff x="${E(o.region[0])}" y="${E(o.region[1])}"/><a:chExt cx="${E(o.region[2])}" cy="${E(o.region[3])}"/></a:xfrm></p:grpSpPr>${o.children.map(c=>nativeNode(c,o.id)).join('')}</p:grpSp>`;}
 let [x,y,w,h]=o.region;const isLine=o.type==='path'&&o.cmd.length===2&&o.cmd[0][0]==='M'&&o.cmd[1][0]==='L',tag=isLine?'cxnSp':'sp';map.push({id,name:o.id,owner:o.owner,type:o.type==='text'?'text':isLine?'connector':'shape',text:o.text??null});
 const nv=isLine?`<p:nvCxnSpPr><p:cNvPr id="${id}" name="${o.id}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr>`:`<p:nvSpPr><p:cNvPr id="${id}" name="${o.id}"/><p:cNvSpPr${o.type==='text'?' txBox="1"':''}/><p:nvPr/></p:nvSpPr>`;
 let content='';if(isLine){const a=o.cmd[0],b=o.cmd[1];content=`<a:xfrm${a[1]>b[1]?' flipH="1"':''}${a[2]>b[2]?' flipV="1"':''}><a:off x="${E(Math.min(a[1],b[1]))}" y="${E(Math.min(a[2],b[2]))}"/><a:ext cx="${Math.max(1,E(Math.abs(a[1]-b[1])))}" cy="${Math.max(1,E(Math.abs(a[2]-b[2])))}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="${E(o.sw)}" cap="rnd">${paint(o.stroke)}<a:headEnd type="none"/><a:tailEnd type="none"/></a:ln></p:spPr>`;}else if(o.type==='text'){
  if(o.align==='center')x-=w/2;
  const rpr=fill=>`sz="${Math.round(o.size*75)}" spc="${Math.round((o.letterSpacing??0)*75)}" b="${o.bold?1:0}"`;
  const runs=o.runs??[{text:o.text,fill:o.fill}];
  content=`<a:xfrm><a:off x="${E(x)}" y="${E(o.baseline-o.size*.91)}"/><a:ext cx="${E(w)}" cy="${E(o.size*1.25)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="t"><a:noAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="${o.align==='center'?'ctr':'l'}"/>${runs.map(r=>`<a:r><a:rPr lang="en-US" ${rpr(r.fill)}>${paint(r.fill)}<a:latin typeface="${o.font}"/><a:ea typeface="${o.font}"/><a:cs typeface="${o.font}"/></a:rPr><a:t xml:space="preserve">${esc(r.text)}</a:t></a:r>`).join('')}<a:endParaRPr lang="en-US"/></a:p></p:txBody>`;
 }else{let cmd=o.cmd;if(o.type==='rect'){const r=Math.min(o.r,w/2,h/2),k=.55228475;cmd=[['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k*r,y,x+w,y+r-k*r,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k*r,x+w-r+k*r,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k*r,y+h,x,y+h-r+k*r,x,y+h-r],['L',x,y+r],['C',x,y+r-k*r,x+r-k*r,y,x+r,y],['Z']];}
 const cmds=cmd.map(c=>{const pts=c.slice(1).reduce((r,v,i,a)=>i%2?r:[...r,`<a:pt x="${P(v-x)}" y="${P(a[i+1]-y)}"/>`],[]).join('');return c[0]==='Z'?'<a:close/>':`<a:${{M:'moveTo',L:'lnTo',C:'cubicBezTo',Q:'quadBezTo'}[c[0]]}>${pts}</a:${{M:'moveTo',L:'lnTo',C:'cubicBezTo',Q:'quadBezTo'}[c[0]]}>`;}).join('');
 content=`<a:xfrm><a:off x="${E(x)}" y="${E(y)}"/><a:ext cx="${E(w)}" cy="${E(h)}"/></a:xfrm><a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${P(w)}" h="${P(h)}">${cmds}</a:path></a:pathLst></a:custGeom>${paint(o.fill)}<a:ln w="${E(o.sw)}" cap="rnd">${paint(o.stroke)}<a:round/><a:headEnd type="none"/><a:tailEnd type="none"/></a:ln></p:spPr>`;
 }
 return `<p:${tag}>${nv}<p:spPr>${content}</p:${tag}>`;
}
const pptx=new PptxGenJS();pptx.defineLayout({name:'SOURCE',width:W/96,height:H/96});pptx.layout='SOURCE';pptx.author='PaperFigure';pptx.title='Voyager — native reconstruction of imagegen reference';pptx.addSlide();
const zip=await JSZip.loadAsync(await pptx.write({outputType:'nodebuffer'}));let slide=await zip.file('ppt/slides/slide1.xml').async('string');const native=tree.map(o=>nativeNode(o)).join('');slide=slide.replace('</p:spTree>',native+'</p:spTree>');zip.file('ppt/slides/slide1.xml',slide);zip.file('paperfigure/object-tree.json',JSON.stringify(tree));zip.file('paperfigure/reference-contract.json',await fs.readFile(path.join(root,'reconstruction-contract.json')));
let core=await zip.file('docProps/core.xml').async('string');core=core.replace(/<dcterms:(created|modified)[^>]*>.*?<\/dcterms:\1>/g,(_m,k)=>`<dcterms:${k} xsi:type="dcterms:W3CDTF">2000-01-01T00:00:00Z</dcterms:${k}>`);zip.file('docProps/core.xml',core);
zip.forEach((_,f)=>{f.date=new Date('2000-01-01T00:00:00Z');});await fs.writeFile(path.join(out,'figure.pptx'),await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
await fs.writeFile(path.join(out,'pptx-object-map.json'),JSON.stringify(map,null,2));
await sharp(Buffer.from(svg)).png().toFile(path.join(out,'figure.png'));
console.log(JSON.stringify({out,counts:inventory.expectedCounts,nativeObjects:map.length}));
