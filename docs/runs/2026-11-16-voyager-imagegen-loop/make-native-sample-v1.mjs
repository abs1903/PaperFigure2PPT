// Partial source-registered feasibility sample, not a full-figure reconstruction.
import fs from 'node:fs/promises';import path from 'node:path';
import {saveEditableFigure} from '../../../paperfigure/scripts/layout-export.mjs';
import {browserRuntime,inspectLayout} from '../../../paperfigure/scripts/layout-inspect.mjs';
import {auditNativeLayout} from '../../../paperfigure/scripts/layout-native-audit.mjs';
import {freezeTypography} from '../../../paperfigure/scripts/typography-profile.mjs';
const base=path.dirname(new URL(import.meta.url).pathname),out=path.join(base,'native-sample-v1');
const scene={version:'1.0',title:'PARTIAL native-feasibility sample',width:1860,height:845,source:{reference:'../selected-reference.png',scope:'Only log icon, code text and lower feedback junction; omitted content is deliberate and not a complete reconstruction.'},modules:[{id:'log',box:[76,140,110,122]},{id:'code',box:[707,202,475,44]},{id:'refine',box:[657,674,281,69],centerTextIds:['t-refine'],minPadding:4},{id:'verify',box:[1026,674,183,69],centerTextIds:['t-verify'],minPadding:4},{id:'store',box:[1537,684,262,71],centerTextIds:['t-store'],minPadding:4}],primitives:[],labels:[],edges:[],groupIcons:true,cleanArrowTips:true};
let seq=0;
function poly(id,owner,points,fill,stroke='#111111',width=2.6,icon){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);scene.primitives.push({id,owner,type:'path',seq:seq++,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)],commands:points.map(([x,y],i)=>[i?'L':'M',x,y]).concat([['Z']]),fill,stroke,width,...(icon?{icon}: {})});}
function rect(id,owner,[x,y,w,h]){const r=13,k=r*.55228475;scene.primitives.push({id,owner,type:'path',seq:seq++,box:[x,y,w,h],commands:[['M',x+r,y],['L',x+w-r,y],['C',x+w-r+k,y,x+w,y+r-k,x+w,y+r],['L',x+w,y+h-r],['C',x+w,y+h-r+k,x+w-r+k,y+h,x+w-r,y+h],['L',x+r,y+h],['C',x+r-k,y+h,x,y+h-r+k,x,y+h-r],['L',x,y+r],['C',x,y+r-k,x+r-k,y,x+r,y],['Z']],fill:'#FFFFFF',stroke:'#111111',width:2.6});}
poly('log-left','log',[[78,169],[130,197],[130,258],[78,231]],'#9A641D','#111111',2.8,'icon-log');
poly('log-right','log',[[130,197],[181,169],[181,231],[130,258]],'#7C4D19','#111111',2.8,'icon-log');
poly('log-top','log',[[78,169],[129,142],[181,169],[130,197]],'#F5C66C','#111111',2.8,'icon-log');
poly('log-ring-outer','log',[[97,169],[129,152],[161,169],[130,186]],'#E8B354','#99601F',2.6,'icon-log');
poly('log-ring-inner','log',[[115,169],[129,161],[145,169],[130,177]],'#F8D184','#99601F',2.6,'icon-log');
// Each remaining part is a native vector face/line, not a bitmap or outlined word.
for(const [id,pts] of [['grain-a',[[95,179],[95,240],[99,242],[99,182]]],['grain-b',[[149,191],[149,247],[153,245],[153,189]]]])poly(id,'log',pts,'#623F19','none',0,'icon-log');
for(const id of ['refine','verify','store'])rect('box-'+id,id,scene.modules.find(m=>m.id===id).box);
const runtime=await browserRuntime(),browser=await runtime.chromium.launch({headless:true,executablePath:runtime.executablePath,timeout:30000});
try{
 const page=await browser.newPage();await page.setContent('<html><body></body></html>');
 async function text(id,owner,value,font,size,bold,x,y,center=false){
  const m=scene.modules.find(m=>m.id===owner),metrics=await page.evaluate(({value,font,size,bold})=>{const c=document.createElement('canvas').getContext('2d');c.font=`${bold?'bold ':''}${size}px "${font}"`;const t=c.measureText(value);return {width:t.width,asc:t.actualBoundingBoxAscent,desc:t.actualBoundingBoxDescent,offsets:[...value].map((_,i)=>c.measureText(value.slice(0,i)).width)};},{value,font,size,bold});
  if(center){x=m.box[0]+(m.box[2]-metrics.width)/2;y=m.box[1]+m.box[3]/2+(metrics.asc-metrics.desc)/2;}
  scene.primitives.push({id,owner,type:'text',seq:seq++,text:value,box:[x,y-size,metrics.width,size*1.25],positions:metrics.offsets.map(dx=>[x+dx,y]),font,size,bold,fill:owner==='verify'?'#244B73':owner==='store'?'#2F6B4C':'#111111'});scene.labels.push({id,owner});
 }
 await text('t-code','code','await craftCraftingTable(bot);','Courier New',25.5,false,714,234);
 await text('t-refine','refine','Refine prompt','Arial',36,true,0,0,true);
 await text('t-verify','verify','Verify','Arial',36,true,0,0,true);
 await text('t-store','store','Store skill','Arial',36,true,0,0,true);
}finally{await browser.close();}
scene.edges=[{id:'critique-to-refine',from:{module:'verify',side:'left',fraction:.5},to:{module:'refine',side:'right',fraction:.5},points:[[1026,708.5],[938,708.5]],stroke:'#111111',width:4,startArrow:'none',endArrow:'triangle',arrowSize:'med'},
{id:'success-to-store',from:{module:'verify',side:'right',fraction:48/69},to:{module:'store',side:'left',fraction:38/71},points:[[1209,722],[1537,722]],stroke:'#111111',width:4,startArrow:'none',endArrow:'triangle',arrowSize:'med'},
{id:'bounded-return',from:{module:'verify',side:'bottom',fraction:.5},to:{module:'refine',side:'bottom',fraction:50/281},points:[[1117.5,743],[1117.5,795],[707,795],[707,743]],stroke:'#111111',width:4,startArrow:'none',endArrow:'triangle',arrowSize:'med'}];
poly('stop-diamond','verify',[[1117.5,774],[1139,795],[1117.5,816],[1096,795]],'#FFFFFF','#111111',3);
await saveEditableFigure(scene,out);
const svg=await fs.readFile(path.join(out,'editable.svg'),'utf8');
const measured=await inspectLayout(svg,scene),native=await auditNativeLayout(scene,await fs.readFile(path.join(out,'figure.pptx')),JSON.parse(await fs.readFile(path.join(out,'pptx-object-map.json'))));
await fs.writeFile(path.join(out,'layout-qa.json'),JSON.stringify(measured,null,2)+'\n');await fs.writeFile(path.join(out,'native-audit.json'),JSON.stringify(native,null,2)+'\n');
await fs.writeFile(path.join(out,'typography-profile.json'),JSON.stringify(freezeTypography(scene,{kind:'image-approximation',locator:'../selected-reference.png',notes:'Manual partial source registration. Arial/Courier New approximate generated-image type; original typeface identity cannot be established from pixels. The small code text retains its observed approximate size rather than asserting a 9pt global floor.'}),null,2)+'\n');
await fs.writeFile(path.join(out,'delivery.json'),JSON.stringify({deliveryReady:false,scope:'Partial feasibility sample only; no complete-figure fidelity/Office delivery acceptance.'},null,2)+'\n');
console.log(JSON.stringify({out,measuredPassed:measured.qa.passed,nativePassed:native.passed,errors:measured.qa.errors,nativeCounts:native.counts}));
