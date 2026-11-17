#!/usr/bin/env node
// Source-region contact sheets and independent native geometry/style evidence.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
import sharp from 'sharp';import JSZip from 'jszip';import {XMLParser} from 'fast-xml-parser';
import {auditNativeLayout} from './layout-native-audit.mjs';
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'',parseAttributeValue:false});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const color=v=>v?.replace('#','').toUpperCase();
const bounds=commands=>{const ps=commands.flatMap(c=>c.slice(1).filter((_,i)=>i%2===0).map((x,i)=>[x,c[i*2+2]]));const x=Math.min(...ps.map(p=>p[0])),y=Math.min(...ps.map(p=>p[1]));return [x,y,Math.max(.01,Math.max(...ps.map(p=>p[0]))-x),Math.max(.01,Math.max(...ps.map(p=>p[1]))-y)];};
export async function auditIconDetails(scene,bytes,map){
 const native=await auditNativeLayout(scene,bytes,map),errors=[...native.errors];
 const zip=await JSZip.loadAsync(bytes),xml=await zip.file('ppt/slides/slide1.xml').async('string');
 const objects=new Map();for(const m of xml.matchAll(/<p:(sp|cxnSp)>.*?<\/p:\1>/gs)){const name=m[0].match(/<p:cNvPr\b[^>]*name="([^"]+)"/)?.[1];if(name)objects.set(name,{raw:m[0],node:parser.parse(m[0])['p:'+m[1]]});}
 const ids=[...new Set(scene.primitives.filter(o=>o.icon&&!(scene.removedPrimitiveIds??[]).includes(o.id)).map(o=>o.icon))],icons=[];
 for(const icon of ids){
  const parts=scene.primitives.filter(o=>o.icon===icon&&!(scene.removedPrimitiveIds??[]).includes(o.id)),group=map.find(o=>o.name===icon&&o.type==='group');
  if(!group||group.owner!==parts[0].owner)errors.push({code:'missing-native-icon-group',id:icon});
  for(const p of parts){const actual=objects.get(p.id),record=map.find(o=>o.name===p.id);if(!actual||record?.owner!==icon){errors.push({code:'wrong-native-icon-part',id:p.id});continue;}
   if(p.type==='text')continue; // Native text/content/visibility is checked separately.
   const pr=actual.node['p:spPr'],line=pr?.['a:ln'];
   if(record.type!=='line-decoration'&&(p.fill==='none'?!('a:noFill' in pr):color(p.fill)!==color(pr?.['a:solidFill']?.['a:srgbClr']?.val)))errors.push({code:'icon-fill-drift',id:p.id});
   if(p.stroke==='none'?!('a:noFill' in (line??{})):color(p.stroke)!==color(line?.['a:solidFill']?.['a:srgbClr']?.val))errors.push({code:'icon-stroke-drift',id:p.id});
   if(Math.abs(Number(line?.w)/9525-(p.width??0))>.001)errors.push({code:'icon-stroke-width-drift',id:p.id});
   if(p.lineCap&&line?.cap!=={round:'rnd',butt:'flat',square:'sq'}[p.lineCap])errors.push({code:'icon-line-cap-drift',id:p.id});
   const fillAlpha=Number(pr?.['a:solidFill']?.['a:srgbClr']?.['a:alpha']?.val??100000)/100000;if(p.fill!=='none'&&Math.abs(fillAlpha-(p.opacity??1))>.00002)errors.push({code:'icon-opacity-drift',id:p.id});
   const xfrm=pr?.['a:xfrm'],off=[Number(xfrm?.['a:off']?.x)/9525,Number(xfrm?.['a:off']?.y)/9525],ext=[Number(xfrm?.['a:ext']?.cx)/9525,Number(xfrm?.['a:ext']?.cy)/9525];
   if(record.type==='line-decoration'){
    const pts=[[off[0],off[1]],[off[0]+ext[0],off[1]+ext[1]]];if(xfrm.flipH==='1')[pts[0][0],pts[1][0]]=[pts[1][0],pts[0][0]];if(xfrm.flipV==='1')[pts[0][1],pts[1][1]]=[pts[1][1],pts[0][1]];
    if(pts.some((pt,i)=>Math.hypot(pt[0]-p.commands[i][1],pt[1]-p.commands[i][2])>.002))errors.push({code:'icon-line-geometry-drift',id:p.id});continue;
   }
   const b=bounds(p.commands);if([...off,...ext].some((v,i)=>Math.abs(v-b[i])>.002))errors.push({code:'icon-shape-extent-drift',id:p.id});
   const pp=pr?.['a:custGeom']?.['a:pathLst']?.['a:path'],commands=[];
   for(const m of actual.raw.matchAll(/<a:(moveTo|lnTo|cubicBezTo|quadBezTo)>(.*?)<\/a:\1>|<a:close\/>/gs)){
    if(!m[1]){commands.push(['Z']);continue;}const c=[{moveTo:'M',lnTo:'L',cubicBezTo:'C',quadBezTo:'Q'}[m[1]]];
    for(const pt of m[2].matchAll(/<a:pt x="([^"]+)" y="([^"]+)"\/>/g))c.push(off[0]+Number(pt[1])/Number(pp?.w)*ext[0],off[1]+Number(pt[2])/Number(pp?.h)*ext[1]);commands.push(c);
   }
   if(commands.length!==p.commands.length||commands.some((c,i)=>c[0]!==p.commands[i][0]||c.length!==p.commands[i].length||c.slice(1).some((v,j)=>!Number.isFinite(v)||Math.abs(v-p.commands[i][j+1])>.003)))errors.push({code:'icon-path-geometry-drift',id:p.id});
  }
  icons.push({id:icon,module:parts[0].owner,parts:parts.length,textParts:parts.filter(p=>p.type==='text').length,grouped:Boolean(group)});
 }
 return {passed:errors.length===0,errors,icons,native,limits:['OOXML geometry/style evidence does not replace actual rendering.','Native text glyph ink, contour holes, anti-aliasing and source silhouette require visual comparison.','No interactive Microsoft PowerPoint edit test.']};
}
async function main(){
 const opts={};for(let i=2;i<process.argv.length;i+=2)opts[process.argv[i].slice(2)]=process.argv[i+1];if(!opts.out||!opts.reference||!opts.regions||!opts.report)throw Error('Usage: --out OUTPUT --reference ORIGINAL.png --regions SOURCE-REGIONS.json --report NEW_DIR [--previous OLD_PREVIEW.png]');
 const folder=path.resolve(opts.out),target=path.resolve(opts.report);await fs.mkdir(target);
 const read=f=>fs.readFile(path.join(folder,f)),scene=JSON.parse(await read('layout-scene.json')),bytes=await read('figure.pptx'),mapping=JSON.parse(await read('pptx-object-map.json')),report=await auditIconDetails(scene,bytes,mapping),regions=JSON.parse(await fs.readFile(opts.regions));
 const files=[opts.reference,...(opts.previous?[opts.previous]:[]),path.join(folder,'preview.png'),path.join(folder,'native-render/preview.png')],labels=['Original',...(opts.previous?['Previous']:[]),'SVG','Native PPTX'],layers=[],cell=180,row=210,atlas=[],padding=3;
 for(let i=0;i<report.icons.length;i++){
  const icon=report.icons[i],region=(Array.isArray(regions)?regions:regions.icons).find(r=>r.id===icon.id);if(!region)throw Error(`Missing source region ${icon.id}`);const [x,y,w,h]=region.box;
  layers.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cell*files.length}" height="34"><rect width="100%" height="100%" fill="white"/><text x="8" y="23" font-family="Arial" font-size="17">${icon.id} · ${icon.module}</text></svg>`),left:0,top:i*row+26});
  const crops=[];for(let k=0;k<files.length;k++){
   const meta=await sharp(files[k]).metadata(),rect={left:Math.max(0,Math.floor(x)-padding),top:Math.max(0,Math.floor(y)-padding),width:0,height:0};rect.width=Math.min(meta.width,Math.ceil(x+w)+padding)-rect.left;rect.height=Math.min(meta.height,Math.ceil(y+h)+padding)-rect.top;
   const crop=await sharp(files[k]).extract(rect).flatten({background:'#fff'}).resize(150,150,{fit:'contain',background:'#fff'}).png().toBuffer();crops.push(crop);layers.push({input:crop,left:k*cell+15,top:i*row+65});
  }
  const a=await sharp(crops.at(-2)).removeAlpha().raw().toBuffer(),b=await sharp(crops.at(-1)).removeAlpha().raw().toBuffer();let sum=0;for(let j=0;j<a.length;j++)sum+=Math.abs(a[j]-b[j]);atlas.push({...icon,referenceRegion:region.box,svgPptxPixelMAE:sum/a.length,interpretation:'Diagnostic only; never a visual-acceptance threshold.'});
 }
 const header=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cell*files.length}" height="28"><rect width="100%" height="100%" fill="white"/>${labels.map((l,i)=>`<text x="${cell*i+15}" y="21" font-family="Arial" font-size="17">${l}</text>`).join('')}</svg>`);layers.unshift({input:header,left:0,top:0});
 await sharp({create:{width:cell*files.length,height:report.icons.length*row+30,channels:3,background:'#fff'}}).composite(layers).png().toFile(path.join(target,'contact-sheet.png'));
 report.regions=atlas;report.sha256=Object.fromEntries(await Promise.all([...files,path.join(folder,'editable.svg'),path.join(folder,'figure.pptx')].map(async f=>[path.resolve(f),sha(await fs.readFile(f))])));await fs.writeFile(path.join(target,'icon-detail-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({report:target,icons:report.icons.length,passed:report.passed,errors:report.errors}));if(!report.passed)process.exitCode=2;
}
if(process.argv[1]&&path.resolve(process.argv[1])===new URL(import.meta.url).pathname)main().catch(e=>{console.error(e.message);process.exitCode=1;});
