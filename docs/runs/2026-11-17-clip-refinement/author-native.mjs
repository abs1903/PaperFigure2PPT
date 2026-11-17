import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import {browserRuntime} from '../../../paperfigure/scripts/layout-inspect.mjs';
import {freezeTypography} from '../../../paperfigure/scripts/typography-profile.mjs';
import {toEditableSVG,saveEditableFigure} from '../../../paperfigure/scripts/layout-export.mjs';
import sharp from '../../../paperfigure/node_modules/sharp/lib/index.js';
const base=path.dirname(new URL(import.meta.url).pathname),revision=process.argv[2]??'rebuild',dest=path.join(base,'source-'+revision);await fs.mkdir(dest);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),reference=path.join(base,'selected-reference.png'),referenceHash=sha(await fs.readFile(reference)),geo=JSON.parse(await fs.readFile(path.join(base,'reference-geometry.json'),'utf8'));if(geo.sha256!==referenceHash)throw Error('Frozen target changed');
const s={version:'1.0',title:'CLIP — refined ImageGen reference reconstruction',width:1609,height:977,source:{reference,sha256:referenceHash,scope:'Source-informed conceptual schematic, not measured model outputs. Frozen refined candidate A; native editable geometry. No new empirical claim.'},modules:[],primitives:[],labels:[],edges:[],groupIcons:true,cleanArrowTips:true};
let seq=0;const regions=geo.regions,ink='#22313A',line='#76848F',blue='#396F90',teal='#236E57',coral='#DFA88C';
function M(id,box,anchorShapeId,extra={}){s.modules.push({id,box,...(anchorShapeId?{anchorShapeId}:{}),...extra});}
function P(id,owner,commands,fill='none',stroke=ink,width=2.2,extra={}){const pts=commands.flatMap(c=>{const a=[];for(let i=1;i<c.length;i+=2)a.push([c[i],c[i+1]]);return a;});const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);s.primitives.push({id,owner,type:'path',seq:seq++,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)],commands,fill,stroke,width,...extra});}
function R(id,owner,[x,y,w,h],fill='#FFFFFF',stroke=line,width=2.2,r=10,extra={}){r=Math.min(r,w/2,h/2);const k=r*.55228475;P(id,owner,[['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k,y,x+w,y+r-k,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k,y+h,x,y+h-r+k,x,y+h-r],['L',x,y+r],['C',x,y+r-k,x+r-k,y,x+r,y],['Z']],fill,stroke,width,extra);}
function poly(id,owner,pts,fill,stroke='none',width=0,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]).concat([['Z']]),fill,stroke,width,extra);}
function L(id,owner,pts,stroke=line,width=2.4,extra={}){P(id,owner,pts.map((p,i)=>[i?'L':'M',...p]),'none',stroke,width,{lineCap:'round',...extra});}
function anchorRegions(){for(const m of s.modules){if(!m.anchorShapeId)continue;const a=s.primitives.find(p=>p.id===m.anchorShapeId);regions.push({module:m.id,box:a.box,anchorMeaning:'Main visible source shape; associated labels are independently bound by the transcript and frozen typography profile.'});}}
function E(id,from,to,pts,extra={}){const fm=s.modules.find(m=>m.id===from),tm=s.modules.find(m=>m.id===to);s.edges.push({id,from:{module:from,side:'right',offset:[pts[0][0]-fm.box[0],pts[0][1]-fm.box[1]],reason:'Source-registered visible endpoint'},to:{module:to,side:'left',offset:[pts.at(-1)[0]-tm.box[0],pts.at(-1)[1]-tm.box[1]],reason:'Source-registered visible endpoint'},points:pts,stroke:line,width:3.3,startArrow:'none',endArrow:'triangle',arrowSize:'lg',...extra});}


for(const g of regions)M(g.module,g.box,g.module+'-anchor');
for(const [id,box] of Object.entries(geo.unboxedHeadingRegions))M(id,box,undefined,{container:true,routingObstacle:false});
function rcCommands([x,y,w,h],r=12){const k=.55228475;r=Math.min(r,w/2,h/2);return [['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k*r,y,x+w,y+r-k*r,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k*r,x+w-r+k*r,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k*r,y+h,x,y+h-r+k*r,x,y+h-r],['L',x,y+r],['C',x,y+r-k*r,x+r-k*r,y,x+r,y],['Z']];}
function compound(id,owner,boxes,fill,stroke,width,r=14){P(id,owner,boxes.flatMap(box=>rcCommands(box,r)),fill,stroke,width);}

compound('train-images-anchor','train-images',[[84,202,167,116],[85,338,166,112],[85,466,167,108]],'#FFFFFF','#99A3AC',2,17);
compound('train-captions-anchor','train-captions',[[661,16,173,58],[864,16,173,58],[1067,16,172,58]],'#EAF1EC','#568B79',2.2,16);
R('train-image-encoder-anchor','train-image-encoder',[351,334,205,130],'#E6EEF4','#A9BCCB',1.8,18);
R('train-text-encoder-anchor','train-text-encoder',[764,132,377,59],'#E9F1EC','#91B2A3',1.8,16);
R('matrix-anchor','matrix',[735,278,444,272],'#F1F3F4',line,2.6,0);
for(let r=0;r<3;r++)for(let c=0;c<3;c++)R('matrix-cell-'+r+'-'+c,'matrix',[735+c*148,278+r*(272/3),148,272/3],r===c?coral:'#F1F3F4',line,1.6,0,{icon:'alignment-matrix'});
R('objective-anchor','objective',[1229,449,353,61],'#F2DFD3','#E3C2AF',1.5,16);
L('separator-anchor','separator',[[22,601],[1589,601]],'#8D989F',2.3);
R('query-anchor','query',[54,750,176,118],'#FFFFFF','#99A3AC',2,17);
R('test-image-encoder-anchor','test-image-encoder',[317,744,207,94],'#E6EEF4','#A9BCCB',1.8,17);
R('test-text-encoder-anchor','test-text-encoder',[649,744,209,94],'#E9F1EC','#91B2A3',1.8,17);
R('template-anchor','template',[916,707,349,52],'#EAF1EC','#568B79',2.2,15);
compound('class-chips-anchor','class-chips',[[936,774,101,48],[1050,774,99,48],[1164,774,99,48]],'#EAF1EC','#568B79',2.2,14);
R('cosine-anchor','cosine',[896,871,267,87],'#F2DFD3','#D5B6A3',1.6,19);
R('nearest-anchor','nearest',[1290,875,300,78],'#F0F2F3','#CCD2D7',1.6,18);

// Source-registered, independently editable illustration contours. Flat fills
// approximate the generated raster's mild shading, retaining all major details.
function QP(id,owner,cs,x,y,w,h,fill,icon,stroke='none',width=0){P(id,owner,cs.map(c=>[c[0],...c.slice(1).map((v,i)=>i%2?y+v*h:x+v*w)]),fill,stroke,width,{icon});}
function boat(id,owner,x,y,w,h){const icon=id+'-glyph';
 QP(id+'-sail-a',owner,[['M',.20,.54],['L',.48,.02],['L',.48,.54],['Z']],x,y,w,h,blue,icon);
 QP(id+'-sail-b',owner,[['M',.53,0],['L',.82,.33],['L',.53,.52],['Z']],x,y,w,h,'#6C9BB5',icon);
 QP(id+'-hull',owner,[['M',.02,.62],['L',.98,.59],['L',.85,.86],['C',.75,.80,.63,.91,.51,.83],['C',.39,.76,.30,.91,.17,.86],['Z']],x,y,w,h,blue,icon);
 QP(id+'-wave',owner,[['M',.06,.94],['C',.20,1.02,.28,.86,.42,.94],['C',.57,1.03,.65,.87,.78,.94],['C',.84,.98,.90,.98,.94,.94]],x,y,w,h,'none',icon,'#7CA2B7',3.8);
}
boat('train-boat','train-images',117,219,110,88);boat('query-boat','query',88,767,119,88);
const birdIcon='train-bird-glyph';
QP('bird-body','train-images',[['M',.02,.89],['L',.35,.51],['C',.48,.40,.54,.23,.64,.08],['C',.75,-.09,.96,.03,.91,.24],['C',.86,.44,.86,.65,.70,.77],['C',.53,.89,.32,.85,.20,.81],['L',.08,.96],['C',.03,1.01,-.03,.95,.02,.89],['Z']],110,350,101,88,blue,birdIcon);
QP('bird-beak','train-images',[['M',.89,.15],['L',1.12,.24],['L',.89,.26],['Z']],110,350,101,88,'#73828C',birdIcon);
QP('bird-wing','train-images',[['M',.13,.66],['C',.28,.53,.40,.37,.52,.31],['C',.82,.20,.87,.72,.13,.66],['Z']],110,350,101,88,'#7CA5BA',birdIcon);
QP('bird-wing-contour','train-images',[['M',.13,.66],['C',.75,.81,.85,.38,.53,.31]],110,350,101,88,'none',birdIcon,'#DAE5E9',1.3);
R('bird-eye','train-images',[195,360,6,6],'#FFFFFF','none',0,3,{icon:birdIcon});
L('bird-foot-a','train-images',[[165,420],[165,434],[176,434]],blue,3,{icon:birdIcon});
L('bird-foot-b','train-images',[[181,420],[182,433],[189,433]],blue,3,{icon:birdIcon});
P('bird-perch','train-images',[['M',145,440],['C',171,436,197,438,218,424]],'none','#7B7B72',2.7,{icon:birdIcon,lineCap:'round'});
P('bird-sprig-stem','train-images',[['M',204,432],['C',210,421,217,420,224,415]],'none','#5D947D',1.8,{icon:birdIcon});
P('bird-leaf-a','train-images',[['M',209,426],['C',198,426,202,413,208,413],['C',213,416,212,421,209,426],['Z']],'#488A6E','none',0,{icon:birdIcon});
P('bird-leaf-b','train-images',[['M',213,425],['C',213,415,222,413,227,414],['C',227,422,220,426,213,425],['Z']],'#488A6E','none',0,{icon:birdIcon});
P('bird-leaf-c','train-images',[['M',211,433],['C',217,427,226,432,227,439],['C',218,442,213,437,211,433],['Z']],'#488A6E','none',0,{icon:birdIcon});
const cupIcon='train-cup-glyph';
P('cup-handle','train-images',[['M',195,501],['C',232,488,233,531,194,539]],'none',blue,7.5,{icon:cupIcon});
P('cup-body','train-images',[['M',122,491],['C',130,482,191,480,199,492],['C',199,516,197,548,179,555],['C',162,563,140,559,133,549],['C',126,535,123,508,122,491],['Z']],blue,blue,1.7,{icon:cupIcon});
P('cup-rim','train-images',[['M',125,491],['C',125,481,197,479,197,491],['C',197,504,125,504,125,491],['Z']],'#DCE7ED',blue,4,{icon:cupIcon});
// Input collection branches and the two directional legends are source-visible line art.
L('image-branch-boat','train-images',[[249,259],[293,259],[293,396]],blue,3.2);L('image-branch-cup','train-images',[[249,521],[293,521],[293,396]],blue,3.2);L('image-branch-bird','train-images',[[249,396],[293,396]],blue,3.2);
L('caption-branch-boat','train-captions',[[749,75],[749,102],[952,102]],teal,3.2);L('caption-branch-cup','train-captions',[[1153,75],[1153,102],[952,102]],teal,3.2);L('caption-branch-bird','train-captions',[[952,75],[952,102]],teal,3.2);
L('direction-i2t','objective',[[1230,331],[1302,331]],blue,4.2);poly('direction-i2t-tip','objective',[[1302,320],[1319,331],[1302,342]],blue);
L('direction-t2i','objective',[[1317,393],[1248,393]],teal,4.2);poly('direction-t2i-tip','objective',[[1248,382],[1231,393],[1248,404]],teal);
const runtime=await browserRuntime(),browser=await runtime.chromium.launch({headless:true,executablePath:runtime.executablePath,timeout:30000});
const pg=await browser.newPage();await pg.setContent('<html></html>');
async function metrics(text,font,size,bold){return await pg.evaluate(({text,font,size,bold})=>{const c=document.createElement('canvas').getContext('2d');c.font=`${bold?'bold ':''}${size}px "${font}"`;const m=c.measureText(text);return {width:m.width,asc:m.actualBoundingBoxAscent,desc:m.actualBoundingBoxDescent,offsets:[...text].map((_,i)=>c.measureText(text.slice(0,i)).width)};},{text,font,size,bold});}
async function T(id,owner,text,box,size=28,bold=false,align='center',fill='#07090C',font='Arial',icon){let m=await metrics(text,font,size,bold);if(m.width>box[2]){size=+(size*box[2]/m.width).toFixed(3);m=await metrics(text,font,size,bold);}const x=align==='left'?box[0]:box[0]+(box[2]-m.width)/2,y=box[1]+(box[3]+m.asc-m.desc)/2;const part={id,owner,type:'text',seq:seq++,text,box:[x,y-size,m.width,size*1.25],positions:m.offsets.map(dx=>[x+dx,y]),font,size,bold,fill,...(icon?{icon}: {})};s.primitives.push(part);s.labels.push({id,owner,textBox:box,padding:0});return part;}
async function C(owner,lines,size,bold=true,fill='#07090C',font='Arial'){const m=s.modules.find(m=>m.id===owner),box=m.textBox??m.box;let ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const fit=Math.min(1,(box[2]-8)/Math.max(...ms.map(m=>m.width)));size=+(size*fit).toFixed(3);ms=await Promise.all(lines.map(t=>metrics(t,font,size,bold)));const gap=size*1.1,total=ms[0].asc+(lines.length-1)*gap+ms.at(-1).desc,baseY=box[1]+(box[3]-total)/2+ms[0].asc;m.centerTextIds=[];m.minPadding=3;for(let i=0;i<lines.length;i++){const x=box[0]+(box[2]-ms[i].width)/2,y=baseY+i*gap,id='text-'+owner+'-'+i;s.primitives.push({id,owner,type:'text',seq:seq++,text:lines[i],box:[x,y-size,ms[i].width,size*1.25],positions:ms[i].offsets.map(dx=>[x+dx,y]),font,size,bold,fill});s.labels.push({id,owner});m.centerTextIds.push(id);}}



await T('train-phase-label','train-phase','Contrastive pre-training',[47,23,490,50],44,false,'left',ink);
await T('test-phase-label','test-phase','Zero-shot use',[47,630,282,48],42,false,'left',ink);
await T('paired-caption','train-images','Paired examples',[51,132,300,42],36,false,'left',ink);
for(const [i,t] of ['boat','bird','cup'].entries())await T('train-caption-'+i,'train-captions',t,[[661,16,173,58],[864,16,173,58],[1067,16,172,58]][i],36,false,'center',teal);
await C('train-image-encoder',['Image','encoder'],36,true,ink);
await C('train-text-encoder',['Text encoder'],34,true,ink);
await T('train-image-norm-a','train-image-encoder','Normalized',[572,347,151,30],28,false,'center','#4F5E69');
await T('train-image-norm-b','train-image-encoder','embeddings',[568,377,158,30],28,false,'center','#4F5E69');
await T('train-text-norm','train-text-encoder','Normalized embeddings',[819,201,312,31],28,false,'center','#4F5E69');
await T('i2t-caption','objective','Image to text',[1331,310,258,40],32,false,'left',ink);
await T('t2i-caption','objective','Text to image',[1340,375,249,40],32,false,'left',ink);
await C('objective',['Symmetric loss'],36,true,ink);
await T('same-encoders-caption','test-text-encoder','Same encoders',[480,631,239,36],30,false,'left','#3E4F59');
await T('query-caption','query','New image',[64,700,188,40],32,false,'left',ink);
await T('class-caption','template','Class descriptions',[949,636,350,41],35,false,'left',ink);
await C('test-image-encoder',['Image','encoder'],32,true,ink);
await C('test-text-encoder',['Text','encoder'],32,true,ink);
await C('template',['a photo of a {label}'],30,false,ink);
for(const [i,t] of ['boat','bird','cup'].entries())await T('class-caption-'+i,'class-chips',t,[[936,774,101,48],[1050,774,99,48],[1164,774,99,48]][i],31,false,'center',teal);
await T('test-norm-caption','cosine','Normalized embeddings',[479,918,355,34],27,false,'left','#4F5E69');
await C('cosine',['Cosine','similarity'],36,false,ink);
await C('nearest',['Nearest label'],38,false,ink);
await browser.close();
// All data/model-reuse routes remain native polyline connectors. Legend arrows above are line art.
E('image-batch-encode','train-images','train-image-encoder',[[293,396],[346,396]],{stroke:blue,width:3.3});
E('text-batch-encode','train-captions','train-text-encoder',[[952,102],[952,127]],{stroke:teal,width:3.3});
E('image-to-matrix','train-image-encoder','matrix',[[556,423],[730,423]],{stroke:blue,width:3.3});
E('text-to-matrix-left','train-text-encoder','matrix',[[952,239],[811,239],[811,274]],{stroke:teal,width:3.3});
E('text-to-matrix-mid','train-text-encoder','matrix',[[952,239],[952,274]],{stroke:teal,width:3.3});
E('text-to-matrix-right','train-text-encoder','matrix',[[952,239],[1105,239],[1105,274]],{stroke:teal,width:3.3});
E('reuse-image','train-image-encoder','test-image-encoder',[[413,465],[414,739]],{stroke:blue,width:3,dashed:true,dashPattern:[8,10]});
E('reuse-text','train-text-encoder','test-text-encoder',[[1141,161],[1203,161],[1203,576],[750,576],[750,739]],{stroke:teal,width:3,dashed:true,dashPattern:[8,10]});
E('query-image-encode','query','test-image-encoder',[[231,794],[315,794]],{stroke:blue,width:3.3});
E('class-text-encode','template','test-text-encoder',[[916,738],[916,784],[863,784]],{stroke:teal,width:3.3});
E('image-to-similarity','test-image-encoder','cosine',[[428,837],[428,878],[596,878],[596,915],[890,915]],{stroke:blue,width:3.3});
E('text-to-similarity','test-text-encoder','cosine',[[750,837],[750,878],[596,878]],{stroke:teal,width:3.3,endArrow:'none'});
E('similarity-readout','cosine','nearest',[[1164,914],[1283,914]],{stroke:line,width:3.3});
s.exceptions=['reuse-image','reuse-text'].map(id=>({code:'edge-through-module',ids:[id,'separator'],sourceReferenceSHA256:referenceHash,reason:'Candidate A visibly carries the dashed model-reuse route across the horizontal train/use phase divider. The divider is a graphic phase annotation, not an intervening neural module; preserve this exact owner-pair crossing.'}));
const profile=freezeTypography(s,{kind:'image-approximation',locator:reference,notes:'Unknown generated raster sans-serif approximated with measured Arial regular/bold by source role. Native solid fills replace mild tonal shading. Source icon silhouettes preserved with minor contour approximation; rounded elbows approximated as native orthogonal bends on the same centerline.'});
await fs.writeFile(path.join(dest,'layout-scene.json'),JSON.stringify(s,null,2)+'\n');const pb=Buffer.from(JSON.stringify(profile,null,2)+'\n');await fs.writeFile(path.join(dest,'typography-profile.json'),pb);
const contract={version:'1.0',mode:'reconstruct',reference:{path:path.relative(dest,reference),sha256:referenceHash,width:1609,height:977},centerTolerancePx:4,sizeTolerancePx:6,regions,nonVisualGroups:Object.keys(geo.unboxedHeadingRegions).map(id=>({id,kind:'annotation',reason:'The accepted PNG has a visible unboxed phase text heading, with no box or neural-module frame. Native text is verified by its frozen typography; no invisible anchor shape is added.'})),geometryChanges:[],contentChanges:[],typography:{path:'typography-profile.json',sha256:sha(pb)},appearanceApproximations:['Mild generated texture/shading approximated by matched flat native fills; major two-tone icon facets and contours are preserved.','Unknown generated sans-serif approximated with measured Arial regular by source role; major icon contours and two-tone details retained as native paths, with small contour/antialiasing differences.','Rounded connector elbows represented as editable orthogonal bends on registered routes.'],reviewRequired:'Actual target/SVG/Office full and paper-width comparison; exact texts, 3x3 pairing, correct reuse/input origins, native XML/object map and actual typography.'};await fs.writeFile(path.join(dest,'reference-contract.json'),JSON.stringify(contract,null,2)+'\n');
const transcript={version:'1.0',reference:contract.reference,expectedCounts:{modules:s.modules.length,edges:s.edges.length,labels:s.labels.length,primitives:s.primitives.length},labels:s.labels.map(l=>{const p=s.primitives.find(p=>p.id===l.id);return {id:l.id,owner:l.owner,text:p.text,referenceRegion:l.textBox??s.modules.find(m=>m.id===l.owner).box,font:p.font,size:p.size,bold:p.bold};}),groups:s.modules.map(m=>({id:m.id,anchorShapeId:m.anchorShapeId,referenceRegion:regions.find(r=>r.module===m.id)?.box??geo.unboxedHeadingRegions[m.id]})),edges:s.edges.map(e=>({id:e.id,from:e.from.module,to:e.to.module,sourceRoute:e.points,arrowhead:e.endArrow})),notes:['Native-reference-inspection.md supplies independent pixel inventory; author declarations do not self-certify completeness.','Native training image branch collection and paired-caption collection are shared inputs, not additional neural modules. Image-to-text and text-to-image direction glyphs are legend line art.','Lower two normalized outputs meet at a shared junction feeding Cosine similarity. Teal output joins there without a separate arrowhead, preserving candidate A topology.']};await fs.writeFile(path.join(dest,'reference-transcript.json'),JSON.stringify(transcript,null,2)+'\n');
await fs.writeFile(path.join(dest,'draft.svg'),toEditableSVG(s));await sharp(Buffer.from(toEditableSVG(s))).png().toFile(path.join(dest,'draft.png'));
if(revision==='v3'){const ids=['train-images','train-captions','train-image-encoder','train-text-encoder','matrix','template'];const sample={...s,modules:s.modules.filter(m=>ids.includes(m.id)),primitives:s.primitives.filter(p=>ids.includes(p.owner)),labels:s.labels.filter(l=>ids.includes(l.owner)),edges:s.edges.filter(e=>ids.includes(e.from.module)&&ids.includes(e.to.module))};await saveEditableFigure(sample,path.join(base,'typography-sample-v3'));}
console.log(JSON.stringify({source:dest,modules:s.modules.length,edges:s.edges.length,labels:s.labels.length,primitives:s.primitives.length}));
