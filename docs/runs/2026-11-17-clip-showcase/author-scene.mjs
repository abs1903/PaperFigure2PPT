import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import {browserRuntime} from '../../../paperfigure/scripts/layout-inspect.mjs';
import {freezeTypography} from '../../../paperfigure/scripts/typography-profile.mjs';
import {toEditableSVG,saveEditableFigure} from '../../../paperfigure/scripts/layout-export.mjs';
import sharp from '../../../paperfigure/node_modules/sharp/lib/index.js';
const base=path.dirname(new URL(import.meta.url).pathname),revision=process.argv[2]??'v1',dest=path.join(base,'source-'+revision);await fs.mkdir(dest,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),reference=path.join(base,'selected-reference.png'),referenceHash=sha(await fs.readFile(reference)),geo=JSON.parse(await fs.readFile(path.join(base,'reference-geometry.json'),'utf8'));if(geo.sha256!==referenceHash)throw Error('Frozen target changed');
const s={version:'1.0',title:'CLIP — editable reconstruction of selected current-skill showcase',width:1610,height:977,source:{reference,sha256:referenceHash,scope:'Source-informed conceptual schematic, not measured model outputs. Frozen B2 composition, native editable geometry.'},modules:[],primitives:[],labels:[],edges:[],groupIcons:true,cleanArrowTips:true};
let seq=0;const regions=geo.regions,ink='#14171D',line='#4E576B',blue='#1656CC',teal='#108C80',coral='#E58C78';
function M(id,box,anchorShapeId,extra={}){s.modules.push({id,box,...(anchorShapeId?{anchorShapeId}:{}),...extra});}
function P(id,owner,commands,fill='none',stroke=ink,width=2.2,extra={}){const pts=commands.flatMap(c=>{const a=[];for(let i=1;i<c.length;i+=2)a.push([c[i],c[i+1]]);return a;});const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);s.primitives.push({id,owner,type:'path',seq:seq++,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)],commands,fill,stroke,width,...extra});}
function R(id,owner,[x,y,w,h],fill='#FFFFFF',stroke=line,width=2.2,r=10,extra={}){r=Math.min(r,w/2,h/2);const k=r*.55228475;P(id,owner,[['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k,y,x+w,y+r-k,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k,y+h,x,y+h-r+k,x,y+h-r],['L',x,y+r],['C',x,y+r-k,x+r-k,y,x+r,y],['Z']],fill,stroke,width,extra);}
function poly(id,owner,pts,fill,stroke='none',width=0,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]).concat([['Z']]),fill,stroke,width,extra);}
function L(id,owner,pts,stroke=line,width=2.4,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]),'none',stroke,width,{lineCap:'round',...extra});}
function anchorRegions(){for(const m of s.modules){if(!m.anchorShapeId)continue;const a=s.primitives.find(p=>p.id===m.anchorShapeId);regions.push({module:m.id,box:a.box,anchorMeaning:'Main visible source shape; associated labels are independently bound by the transcript and frozen typography profile.'});}}
function E(id,from,to,pts,extra={}){const fm=s.modules.find(m=>m.id===from),tm=s.modules.find(m=>m.id===to);s.edges.push({id,from:{module:from,side:'right',offset:[pts[0][0]-fm.box[0],pts[0][1]-fm.box[1]],reason:'Source-registered visible endpoint'},to:{module:to,side:'left',offset:[pts.at(-1)[0]-tm.box[0],pts.at(-1)[1]-tm.box[1]],reason:'Source-registered visible endpoint'},points:pts,stroke:line,width:4,startArrow:'none',endArrow:'triangle',arrowSize:'lg',...extra});}


for(const g of regions)M(g.module,g.box,g.module+'-anchor');
function rcCommands([x,y,w,h],r=12){const k=.55228475;r=Math.min(r,w/2,h/2);return [['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k*r,y,x+w,y+r-k*r,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k*r,x+w-r+k*r,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k*r,y+h,x,y+h-r+k*r,x,y+h-r],['L',x,y+r],['C',x,y+r-k*r,x+r-k*r,y,x+r,y],['Z']];}
function compound(id,owner,boxes,fill,stroke,width,r=14){P(id,owner,boxes.flatMap(box=>rcCommands(box,r)),fill,stroke,width);}
R('train-phase-anchor','train-phase',[22,15,542,66],blue,'none',0,15);R('test-phase-anchor','test-phase',[22,623,329,58],blue,'none',0,13);
compound('train-images-anchor','train-images',[[88,203,161,112],[88,338,161,111],[88,465,161,108]],'#FFFFFF',blue,4.5,15);
compound('train-captions-anchor','train-captions',[[663,15,171,59],[865,15,173,59],[1066,15,171,59]],'#ECF6F1',teal,4,15);
R('train-image-encoder-anchor','train-image-encoder',[350,333,207,135],blue,'none',0,18);R('train-text-encoder-anchor','train-text-encoder',[764,132,379,59],teal,'none',0,14);
R('matrix-anchor','matrix',[736,278,441,270],'#DCE9F7',line,3.5,0);for(let r=0;r<3;r++)for(let c=0;c<3;c++)R('matrix-cell-'+r+'-'+c,'matrix',[736+c*147,278+r*90,147,90],r===c?coral:'#DCE9F7',line,1.5,0,{icon:'alignment-matrix'});
R('objective-anchor','objective',[1227,447,355,65],coral,'none',0,17);
L('separator-anchor','separator',[[22,601],[1590,601]],line,2.8);
R('query-anchor','query',[55,749,175,119],'#FFFFFF',blue,4.5,17);R('test-image-encoder-anchor','test-image-encoder',[318,743,207,93],blue,'none',0,16);R('test-text-encoder-anchor','test-text-encoder',[649,743,211,93],teal,'none',0,16);
R('template-anchor','template',[916,708,347,50],'#F2FAF3',teal,4,15);compound('class-chips-anchor','class-chips',[[936,774,99,48],[1048,774,100,48],[1163,774,97,48]],'#F2FAF3',teal,4,14);
R('cosine-anchor','cosine',[895,872,267,88],coral,'none',0,20);R('nearest-anchor','nearest',[1285,874,307,81],'#4C596C','none',0,20);
// Native source-matched schematic glyphs. Coordinates are normalized within icon box.
function QP(id,owner,cs,x,y,w,h,fill,icon){P(id,owner,cs.map(c=>[c[0],...c.slice(1).map((v,i)=>i%2?y+v*h:x+v*w)]),fill,'none',0,{icon});}
function boat(id,owner,x,y,w,h){const icon=id+'-glyph';QP(id+'-sail-a',owner,[['M',.26,.55],['L',.51,.02],['L',.51,.55],['Z']],x,y,w,h,blue,icon);QP(id+'-sail-b',owner,[['M',.55,0],['L',.82,.31],['L',.55,.51],['Z']],x,y,w,h,blue,icon);QP(id+'-hull',owner,[['M',.04,.61],['L',.96,.61],['L',.80,.96],['L',.20,.96],['Z']],x,y,w,h,blue,icon);}
boat('train-boat','train-images',106,219,127,86);boat('query-boat','query',74,767,139,84);
const birdIcon='train-bird-glyph';QP('bird-body','train-images',[['M',.02,.59],['C',.22,.59,.42,.34,.56,.12],['C',.64,-.03,.80,.02,.84,.17],['L',.98,.27],['L',.85,.31],['C',.83,.64,.68,.85,.47,.85],['C',.28,.86,.10,.74,.02,.59],['Z']],108,347,122,88,blue,birdIcon);
QP('bird-leg-a','train-images',[['M',.47,.80],['L',.52,.80],['L',.52,.96],['L',.60,.96],['L',.60,1],['L',.47,1],['Z']],108,347,122,88,blue,birdIcon);QP('bird-leg-b','train-images',[['M',.62,.80],['L',.67,.80],['L',.67,.96],['L',.72,.96],['L',.72,1],['L',.62,1],['Z']],108,347,122,88,blue,birdIcon);
R('bird-eye','train-images',[197,362,7,7],'#FFFFFF','none',0,3.5,{icon:birdIcon});
const cupIcon='train-cup-glyph';QP('cup-handle','train-images',[['M',.59,.09],['C',1.02,-.01,1.10,.61,.60,.64],['L',.60,.48],['C',.89,.48,.91,.16,.60,.23],['Z']],121,490,109,66,blue,cupIcon);QP('cup-body','train-images',[['M',0,0],['L',.75,0],['L',.75,.54],['C',.75,1.15,0,1.15,0,.54],['Z']],121,490,109,66,blue,cupIcon);
// Input collection branches and the two directional legends are source-visible line art.
L('image-branch-boat','train-images',[[249,259],[293,259],[293,396]],blue,4);L('image-branch-cup','train-images',[[249,521],[293,521],[293,396]],blue,4);L('image-branch-bird','train-images',[[249,396],[293,396]],blue,4);
L('caption-branch-boat','train-captions',[[749,75],[749,102],[952,102]],teal,4);L('caption-branch-cup','train-captions',[[1153,75],[1153,102],[952,102]],teal,4);L('caption-branch-bird','train-captions',[[952,75],[952,102]],teal,4);
L('direction-i2t','objective',[[1230,331],[1302,331]],blue,4.2);poly('direction-i2t-tip','objective',[[1302,320],[1319,331],[1302,342]],blue);
L('direction-t2i','objective',[[1317,393],[1248,393]],teal,4.2);poly('direction-t2i-tip','objective',[[1248,382],[1231,393],[1248,404]],teal);
const runtime=await browserRuntime(),browser=await runtime.chromium.launch({headless:true,executablePath:runtime.executablePath,timeout:30000});
const pg=await browser.newPage();await pg.setContent('<html></html>');
async function metrics(text,font,size,bold){return await pg.evaluate(({text,font,size,bold})=>{const c=document.createElement('canvas').getContext('2d');c.font=`${bold?'bold ':''}${size}px "${font}"`;const m=c.measureText(text);return {width:m.width,asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent,offsets:[...text].map((_,i)=>c.measureText(text.slice(0,i)).width)};},{text,font,size,bold});}
async function T(id,owner,text,box,size=28,bold=false,align='center',fill='#07090C',font='Arial',icon){let m=await metrics(text,font,size,bold);if(m.width>box[2]){size=+(size*box[2]/m.width).toFixed(3);m=await metrics(text,font,size,bold);}const x=align==='left'?box[0]:box[0]+(box[2]-m.width)/2,y=box[1]+(box[3]+m.asc-m.desc)/2;const part={id,owner,type:'text',seq:seq++,text,box:[x,y-size,m.width,size*1.25],positions:m.offsets.map(dx=>[x+dx,y]),font,size,bold,fill,...(icon?{icon}: {})};s.primitives.push(part);s.labels.push({id,owner,textBox:box,padding:0});return part;}
async function C(owner,lines,size,bold=true,fill='#07090C',font='Arial'){const m=s.modules.find(m=>m.id===owner),box=m.textBox??m.box;let ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const fit=Math.min(1,(box[2]-8)/Math.max(...ms.map(m=>m.width)));size=+(size*fit).toFixed(3);ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const gap=size*1.1,total=ms[0].asc+(lines.length-1)*gap+ms.at(-1).desc,baseY=box[1]+(box[3]-total)/2+ms[0].asc;m.centerTextIds=[];m.minPadding=3;for(let i=0;i<lines.length;i++){const x=box[0]+(box[2]-ms[i].width)/2,y=baseY+i*gap,id='text-'+owner+'-'+i;s.primitives.push({id,owner,type:'text',seq:seq++,text:lines[i],box:[x,y-size,ms[i].width,size*1.25],positions:ms[i].offsets.map(dx=>[x+dx,y]),font,size,bold,fill});s.labels.push({id,owner});m.centerTextIds.push(id);}}


await C('train-phase',['Contrastive pre-training'],44,true,'#FFFFFF');await C('test-phase',['Zero-shot use'],41,true,'#FFFFFF');
await T('paired-caption','train-images','Paired examples',[53,131,285,47],36,true);
for(const [i,t] of ['boat','bird','cup'].entries())await T('train-caption-'+i,'train-captions',t,[[663,15,171,59],[865,15,173,59],[1066,15,171,59]][i],36,true,'center','#08786D');
await C('train-image-encoder',['Image','encoder'],41,true,'#FFFFFF');await C('train-text-encoder',['Text encoder'],36,true,'#FFFFFF');
await T('train-image-norm-a','train-image-encoder','Normalized',[569,346,153,32],28,false);await T('train-image-norm-b','train-image-encoder','embeddings',[569,376,153,32],28,false);
await T('train-text-norm','train-text-encoder','Normalized embeddings',[819,199,317,34],28,false);
await T('i2t-caption','objective','Image to text',[1330,313,259,37],32,true,'left');await T('t2i-caption','objective','Text to image',[1340,376,249,37],32,true,'left');await C('objective',['Symmetric loss'],39,true,'#FFFFFF');
await T('same-encoders-caption','test-text-encoder','Same encoders',[475,625,235,39],31,true);await T('query-caption','query','New image',[52,701,190,39],32,true);
await T('class-caption','template','Class descriptions',[933,636,338,41],35,true);
await C('test-image-encoder',['Image','encoder'],34,true,'#FFFFFF');await C('test-text-encoder',['Text','encoder'],34,true,'#FFFFFF');
await C('template',['a photo of a {label}'],30,true);
for(const [i,t] of ['boat','bird','cup'].entries())await T('class-caption-'+i,'class-chips',t,[[936,774,99,48],[1048,774,100,48],[1163,774,97,48]][i],30,true,'center','#08786D');
await T('test-norm-caption','cosine','Normalized embeddings',[451,921,354,35],28,false);
await C('cosine',['Cosine','similarity'],36,true,'#FFFFFF');await C('nearest',['Nearest label'],39,true,'#FFFFFF');await browser.close();
// All data/model-reuse routes remain native polyline connectors. Legend arrows above are line art.
E('image-batch-encode','train-images','train-image-encoder',[[293,396],[346,396]],{stroke:blue,width:4});
E('text-batch-encode','train-captions','train-text-encoder',[[952,102],[952,127]],{stroke:teal,width:4});
E('image-to-matrix','train-image-encoder','matrix',[[557,422],[732,422]],{stroke:blue,width:4});
E('text-to-matrix-left','train-text-encoder','matrix',[[952,239],[811,239],[811,274]],{stroke:teal,width:4});
E('text-to-matrix-mid','train-text-encoder','matrix',[[952,239],[952,274]],{stroke:teal,width:4});
E('text-to-matrix-right','train-text-encoder','matrix',[[952,239],[1105,239],[1105,274]],{stroke:teal,width:4});
E('reuse-image','train-image-encoder','test-image-encoder',[[412,468],[414,739]],{stroke:blue,width:3.5,dashed:true,dashPattern:[10,9]});
E('reuse-text','train-text-encoder','test-text-encoder',[[1143,161],[1202,161],[1202,576],[750,576],[750,739]],{stroke:teal,width:3.5,dashed:true,dashPattern:[10,9]});
E('query-image-encode','query','test-image-encoder',[[231,794],[315,794]],{stroke:blue,width:4});
E('class-text-encode','template','test-text-encoder',[[916,738],[916,784],[863,784]],{stroke:teal,width:4});
E('image-to-similarity','test-image-encoder','cosine',[[428,837],[428,878],[596,878],[596,915],[890,915]],{stroke:blue,width:4});
E('text-to-similarity','test-text-encoder','cosine',[[750,837],[750,878],[596,878]],{stroke:teal,width:4,endArrow:'none'});
E('similarity-readout','cosine','nearest',[[1164,915],[1280,915]],{stroke:line,width:4});
s.exceptions=['reuse-image','reuse-text'].map(id=>({code:'edge-through-module',ids:[id,'separator'],sourceReferenceSHA256:referenceHash,reason:'B2 visibly carries the dashed model-reuse route across the horizontal train/use phase divider. The divider is a graphic phase annotation, not an intervening neural module; preserve this exact owner-pair crossing.'}));
const profile=freezeTypography(s,{kind:'image-approximation',locator:reference,notes:'Unknown generated raster sans-serif approximated with measured Arial regular/bold by source role. Native solid fills replace mild tonal shading. Source icon silhouettes preserved with minor contour approximation; rounded elbows approximated as native orthogonal bends on the same centerline.'});
await fs.writeFile(path.join(dest,'layout-scene.json'),JSON.stringify(s,null,2)+'\n');const pb=Buffer.from(JSON.stringify(profile,null,2)+'\n');await fs.writeFile(path.join(dest,'typography-profile.json'),pb);
const contract={version:'1.0',mode:'reconstruct',reference:{path:path.relative(dest,reference),sha256:referenceHash,width:1610,height:977},centerTolerancePx:4,sizeTolerancePx:6,regions,geometryChanges:[],contentChanges:[],typography:{path:'typography-profile.json',sha256:sha(pb)},appearanceApproximations:['Mild raster shading replaced by solid source-color native fills.','Unknown raster font approximated with measured Arial/Arialbold. Minor boat/bird/cup contours and antialiasing approximate, preserving major silhouette.','Rounded connector elbows represented as editable orthogonal bends on registered routes.'],reviewRequired:'Actual target/SVG/Office full and paper-width comparison; exact texts, 3x3 pairing, correct reuse/input origins, native XML/object map and actual typography.'};await fs.writeFile(path.join(dest,'reference-contract.json'),JSON.stringify(contract,null,2)+'\n');
const transcript={version:'1.0',reference:contract.reference,expectedCounts:{modules:s.modules.length,edges:s.edges.length,labels:s.labels.length,primitives:s.primitives.length},labels:s.labels.map(l=>{const p=s.primitives.find(p=>p.id===l.id);return {id:l.id,owner:l.owner,text:p.text,referenceRegion:l.textBox??s.modules.find(m=>m.id===l.owner).box,font:p.font,size:p.size,bold:p.bold};}),groups:s.modules.map(m=>({id:m.id,anchorShapeId:m.anchorShapeId,referenceRegion:regions.find(r=>r.module===m.id)?.box})),edges:s.edges.map(e=>({id:e.id,from:e.from.module,to:e.to.module,sourceRoute:e.points,arrowhead:e.endArrow})),notes:['Native-reference-inspection.md supplies independent pixel inventory; author declarations do not self-certify completeness.','Native training image branch collection and paired-caption collection are shared inputs, not additional neural modules. Image-to-text and text-to-image direction glyphs are legend line art.','Lower two normalized outputs meet at a shared junction feeding Cosine similarity. Teal output joins there without a separate arrowhead, preserving B2 topology.']};await fs.writeFile(path.join(dest,'reference-transcript.json'),JSON.stringify(transcript,null,2)+'\n');
await fs.writeFile(path.join(dest,'draft.svg'),toEditableSVG(s));await sharp(Buffer.from(toEditableSVG(s))).png().toFile(path.join(dest,'draft.png'));
if(revision==='v1'){const ids=['train-images','train-image-encoder','template'];const sample={...s,modules:s.modules.filter(m=>ids.includes(m.id)),primitives:s.primitives.filter(p=>ids.includes(p.owner)),labels:s.labels.filter(l=>ids.includes(l.owner)),edges:[]};await saveEditableFigure(sample,path.join(base,'typography-sample-v1'));}
console.log(JSON.stringify({source:dest,modules:s.modules.length,edges:s.edges.length,labels:s.labels.length,primitives:s.primitives.length}));
