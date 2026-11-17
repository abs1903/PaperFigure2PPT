import {finalizePptxPackage} from './pptx-package.mjs';
import fs from 'node:fs/promises';
import {createWriteStream,readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import sharp from 'sharp';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import {ROOT} from './spec.mjs';

export const esc = s => String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const color = s => s.replace('#','');
const round = n => Math.round(n*1000)/1000;
const pdfFonts=new Map();
export function resolvePdfFont(family,bold=false,italic=false){
  const primary=family.split(',')[0].replace(/["']/g,'').trim(),key=`${primary}:${bold}:${italic}`;
  if(pdfFonts.has(key))return pdfFonts.get(key);
  const style=bold?(italic?'Bold Italic':'Bold'):(italic?'Italic':'Regular');
  const match=spawnSync('fc-match',['-f','%{file}',`${primary}:style=${style}`],{encoding:'utf8',timeout:2000});
  const candidate=match.status===0?match.stdout.trim():'';
  const mac=path.join('/System/Library/Fonts/Supplemental',primary+(bold?' Bold':'')+(italic?' Italic':'')+'.ttf');
  let font;
  if(candidate&&existsSync(candidate))font=candidate;
  else if(existsSync(mac))font=mac;
  else if(/times|serif/i.test(primary)&&!/sans/i.test(primary))font=bold?(italic?'Times-BoldItalic':'Times-Bold'):(italic?'Times-Italic':'Times-Roman');
  else font=bold?(italic?'Helvetica-BoldOblique':'Helvetica-Bold'):(italic?'Helvetica-Oblique':'Helvetica');
  pdfFonts.set(key,font);return font;
}
const gradientId=id=>`gradient-${id.replace(/:/g,'-')}`;
const fillFor=(o,id)=>o.gradient?`url(#${gradientId(id)})`:o.fill;
function svgRuns(t){
  if(!t.runs)return esc(t.text);
  return t.runs.map(r=>`<tspan${r.subscript?` baseline-shift="sub" font-size="${t.fontSize*.65}"`:''}${r.italic?' font-style="italic"':''}>${esc(r.text)}</tspan>`).join('');
}
export function toSVG(scene) {
  const {width,height,theme}=scene;
  const p=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" lang="en"><title>${esc(scene.title)}</title><metadata>${esc(JSON.stringify({specHash:scene.specHash,semanticHash:scene.semanticHash}))}</metadata><rect width="100%" height="100%" fill="${theme.background}"/>`];
  p.push(`<defs>${[...new Set(scene.edges.map(e=>e.stroke))].map((c,i)=>`<marker id="arrow${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="${c}" stroke-width="1.5"/></marker>`).join('')}</defs>`);
  const colors=[...new Set(scene.edges.map(e=>e.stroke))];
  p.push(`<defs>${[...scene.nodes.map(n=>({...n,id:`node:${n.id}`})),...scene.decorations].filter(o=>o.gradient).map(o=>`<linearGradient id="${gradientId(o.id)}" x1="0%" y1="0%" x2="${o.gradient.direction==='horizontal'?'100%':'0%'}" y2="${o.gradient.direction==='horizontal'?'0%':'100%'}"><stop offset="0%" stop-color="${o.gradient.from}"/><stop offset="100%" stop-color="${o.gradient.to}"/></linearGradient>`).join('')}</defs>`);
  for(const g of scene.groups)p.push(`<rect id="group:${g.id}" x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="${g.radius}" fill="${g.fill}" stroke="${g.stroke}" stroke-width="${g.strokeWidth}" ${g.dashed?'stroke-dasharray="8 5"':''}/>`);
  for(const e of scene.edges)p.push(`<path id="edge:${e.id}" data-from="${e.from}" data-to="${e.to}" d="${e.points.map((p,i)=>`${i?'L':'M'} ${p.join(' ')}`).join(' ')}" fill="none" stroke="${e.stroke}" stroke-width="${e.strokeWidth}" ${e.dashed?'stroke-dasharray="8 5"':''} marker-end="url(#arrow${colors.indexOf(e.stroke)})"/>`);
  for(const n of scene.nodes)p.push(`<rect id="node:${n.id}" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${n.radius}" fill="${fillFor(n,`node:${n.id}`)}" stroke="${n.stroke}" stroke-width="${n.strokeWidth}"/>`);
  for(const a of scene.assets){const bytes=readFileSync(new URL(a.path,ROOT)),mime=a.path.endsWith('.svg')?'image/svg+xml':a.path.endsWith('.png')?'image/png':'image/jpeg',src=`data:${mime};base64,${bytes.toString('base64')}`;if(a.crop){const c=a.crop;p.push(`<svg id="viewport:${a.id}" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" viewBox="${c.x} ${c.y} ${c.w} ${c.h}" preserveAspectRatio="none"><image id="${a.id}" width="${c.sourceWidth}" height="${c.sourceHeight}" href="${src}"/></svg>`);}else p.push(`<image id="${a.id}" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" preserveAspectRatio="none" href="${src}"/>`);}
  for(const d of scene.decorations){
    const common=`id="${d.id}" fill="${fillFor(d,d.id)}" stroke="${d.stroke}" stroke-width="${d.strokeWidth??1.8}"`;
    if(d.type==='line')p.push(`<line ${common} x1="${d.x}" y1="${d.y}" x2="${d.x+d.w}" y2="${d.y+d.h}"/>`);
    else if(d.type==='ellipse')p.push(`<ellipse ${common} cx="${d.x+d.w/2}" cy="${d.y+d.h/2}" rx="${d.w/2}" ry="${d.h/2}"/>`);
    else p.push(`<rect ${common} x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="${d.radius??0}"/>`);
  }
  for(const t of scene.texts){
    if(t.background)p.push(`<rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="${t.background}"/>`);
    p.push(`<text id="${t.id}" x="${round(t.align==='center'?t.x+t.w/2:t.x)}" y="${round(t.y+t.fontSize*.92)}" font-family="${esc(t.fontFamily)}, Helvetica, sans-serif" font-size="${t.fontSize}" font-weight="${t.bold?'bold':'normal'}" ${t.italic?'font-style="italic"':''} fill="${t.color}" text-anchor="${t.align==='center'?'middle':'start'}">${svgRuns(t)}</text>`);
  }
  return p.join('\n')+'\n</svg>\n';
}

// Store each orthogonal route as a native group of straight OOXML connectors.
// This avoids custom-connector reinterpretation by LibreOffice. Endpoints are
// deliberately unbound: automatic attachment to custom sites changed the render.
export function connectorXML(edge,id,nextId) {
  const E=v=>Math.round(v*9525),xs=edge.points.map(p=>p[0]),ys=edge.points.map(p=>p[1]);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(1,E(Math.max(...xs)-x)),h=Math.max(1,E(Math.max(...ys)-y));
  const segments=[];
  for(let i=1;i<edge.points.length;i++){
    const a=edge.points[i-1],b=edge.points[i],ox=E(Math.min(a[0],b[0])),oy=E(Math.min(a[1],b[1])),cx=Math.max(1,E(Math.abs(a[0]-b[0]))),cy=Math.max(1,E(Math.abs(a[1]-b[1])));
    segments.push(`<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${nextId()}" name="edge:${edge.id}:segment:${i-1}" descr="${esc(`${edge.from} -> ${edge.to}; ${edge.kind}; ${edge.phase}`)}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm${a[0]>b[0]?' flipH="1"':''}${a[1]>b[1]?' flipV="1"':''}><a:off x="${ox}" y="${oy}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="${Math.round(edge.strokeWidth*9525)}"><a:solidFill><a:srgbClr val="${color(edge.stroke)}"/></a:solidFill>${edge.dashed?'<a:custDash><a:ds d="${Math.round(800000/edge.strokeWidth)}" sp="${Math.round(500000/edge.strokeWidth)}"/></a:custDash>':''}<a:headEnd type="none"/><a:tailEnd type="${i===edge.points.length-1?'arrow':'none'}" w="lg" len="lg"/></a:ln></p:spPr></p:cxnSp>`);
  }
  return `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="${id}" name="edge:${edge.id}"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="${E(x)}" y="${E(y)}"/><a:ext cx="${w}" cy="${h}"/><a:chOff x="${E(x)}" y="${E(y)}"/><a:chExt cx="${w}" cy="${h}"/></a:xfrm></p:grpSpPr>${segments.join('')}</p:grpSp>`;
}

export async function toPPTX(scene,spec) {
  const pptx=new PptxGenJS();
  pptx.defineLayout({name:'FIGURE',width:scene.width/96,height:scene.height/96});pptx.layout='FIGURE';
  pptx.author='PaperFigure';pptx.subject='Editable architecture figure';pptx.title=spec.title;
  pptx.lang='en-US';pptx.theme={headFontFace:'Arial',bodyFontFace:'Arial',lang:'en-US'};
  // Keep package metadata stable. Container ZIP timestamps are normalized below.
  pptx.revision='1';
  const slide=pptx.addSlide();slide.background={color:color(scene.theme.background)};
  const pos=b=>({x:b.x/96,y:b.y/96,w:b.w/96,h:b.h/96});
  const paint=c=>c==='none'?{color:'FFFFFF',transparency:100}:{color:color(c)};
  for(const g of scene.groups)slide.addShape(g.radius?pptx.ShapeType.roundRect:pptx.ShapeType.rect,{...pos(g),rectRadius:g.radius/96,fill:paint(g.fill),line:{...paint(g.stroke),width:g.strokeWidth*.75,...(g.dashed?{dashType:'dash'}:{})},objectName:`group:${g.id}`});
  for(const e of scene.edges)slide.addShape(pptx.ShapeType.line,{x:0,y:0,w:1,h:1,line:{color:color(e.stroke)},objectName:`edge:${e.id}`});
  for(const n of scene.nodes)slide.addShape(n.radius?pptx.ShapeType.roundRect:pptx.ShapeType.rect,{...pos(n),rectRadius:n.radius/96,fill:paint(n.fill),line:{...paint(n.stroke),width:n.strokeWidth*.75},objectName:`node:${n.id}`});
  for(const a of scene.assets)slide.addImage({path:new URL(a.path,ROOT).pathname,...pos(a),objectName:a.id,altText:a.purpose});
  for(const d of scene.decorations)slide.addShape(d.type==='rect'&&d.radius?pptx.ShapeType.roundRect:pptx.ShapeType[d.type],{x:Math.min(d.x,d.x+d.w)/96,y:Math.min(d.y,d.y+d.h)/96,w:Math.abs(d.w)/96,h:Math.abs(d.h)/96,rectRadius:(d.radius??0)/96,flipH:d.w<0,flipV:d.h<0,fill:paint(d.fill),line:{...paint(d.stroke),width:(d.strokeWidth??1.8)*.75},objectName:d.id});
  for(const t of scene.texts)slide.addText(t.runs?t.runs.map(r=>({text:r.text,options:{subscript:r.subscript??false,italic:r.italic??t.italic??false}})):t.text,{...pos(t),fontFace:t.fontFamily,fontSize:t.fontSize*.75,bold:t.bold,italic:t.italic??false,color:color(t.color),align:t.align,valign:'mid',margin:0,breakLine:false,paraSpaceAfterPt:0,wrap:false,...(t.background?{fill:{color:color(t.background)}}:{}),objectName:t.id});
  slide.addNotes(`Semantic evidence is retained in the accompanying spec.json. Scope: ${spec.claims.scope}\nAssumptions: ${spec.assumptions.join('; ')||'None stated.'}`);
  const zip=await JSZip.loadAsync(await pptx.write({outputType:'nodebuffer'}));
  let xml=await zip.file('ppt/slides/slide1.xml').async('string');
  const nodeIds={};
  for(const m of xml.matchAll(/<p:cNvPr\b[^>]*id="(\d+)"[^>]*name="node:([^"<>]+)"[^>]*\/?\s*>/g))nodeIds[m[2]]=m[1];
  if(Object.keys(nodeIds).length!==scene.nodes.length)throw new Error('Cannot locate node shape IDs in PPTX');
  let objectId=Math.max(...[...xml.matchAll(/<p:cNvPr\b[^>]*id="(\d+)"/g)].map(m=>Number(m[1])));
  for(const edge of scene.edges){
    let found=false;
    xml=xml.replace(/<p:sp>.*?<\/p:sp>/gs,block=>{
      if(!block.includes(`name="edge:${edge.id}"`))return block;
      found=true;const id=block.match(/<p:cNvPr\b[^>]*id="(\d+)"/)[1];
      return connectorXML(edge,id,()=>++objectId);
    });
    if(!found)throw new Error(`Missing connector placeholder ${edge.id}`);
  }
  const shaded=new Map([...scene.nodes.map(n=>[`node:${n.id}`,n]),...scene.decorations.map(d=>[d.id,d])].filter(([_id,o])=>o.gradient));
  xml=xml.replace(/<p:sp>.*?<\/p:sp>/gs,block=>{const name=block.match(/<p:cNvPr\b[^>]*name="([^"]+)"/)?.[1],g=shaded.get(name)?.gradient;if(!g)return block;const grad=`<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="${color(g.from)}"/></a:gs><a:gs pos="100000"><a:srgbClr val="${color(g.to)}"/></a:gs></a:gsLst><a:lin ang="${g.direction==='horizontal'?0:5400000}" scaled="1"/></a:gradFill>`;return block.replace(/(<p:spPr>.*?)<a:solidFill>.*?<\/a:solidFill>/s,(_m,prefix)=>prefix+grad);});
  xml=xml.replace(/<p:pic>.*?<\/p:pic>/gs,block=>{const name=block.match(/<p:cNvPr\b[^>]*name="([^"]+)"/)?.[1],c=scene.assets.find(a=>a.id===name)?.crop;if(!c)return block;const rect=`<a:srcRect l="${Math.round(c.x/c.sourceWidth*100000)}" t="${Math.round(c.y/c.sourceHeight*100000)}" r="${Math.round((c.sourceWidth-c.x-c.w)/c.sourceWidth*100000)}" b="${Math.round((c.sourceHeight-c.y-c.h)/c.sourceHeight*100000)}"/>`;return /<a:srcRect/.test(block)?block.replace(/<a:srcRect[^>]*\/>/,rect):block.replace('<a:stretch>',rect+'<a:stretch>');});
  zip.file('ppt/slides/slide1.xml',xml);
  zip.file('paperfigure/spec.json',JSON.stringify(spec,null,2));
  zip.file('paperfigure/scene.json',JSON.stringify(scene,null,2));
  await finalizePptxPackage(zip);

  // Generated document metadata must not break byte reproducibility.
  let core=await zip.file('docProps/core.xml').async('string');
  core=core.replace(/<dcterms:(created|modified)[^>]*>.*?<\/dcterms:\1>/g,(_m,k)=>`<dcterms:${k} xsi:type="dcterms:W3CDTF">2000-01-01T00:00:00Z</dcterms:${k}>`);
  zip.file('docProps/core.xml',core);
  zip.forEach((_p,file)=>{file.date=new Date('2000-01-01T00:00:00Z');});
  return zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});
}

export function toDrawio(scene) {
  const cells=['<mxCell id="0"/>','<mxCell id="1" parent="0"/>'];
  for(const g of scene.groups)cells.push(`<mxCell id="group:${g.id}" value="" style="rounded=${g.radius?1:0};html=1;fillColor=${g.fill};strokeColor=${g.stroke};strokeWidth=${g.strokeWidth};${g.dashed?'dashed=1;':''}" vertex="1" parent="1"><mxGeometry x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" as="geometry"/></mxCell>`);
  for(const n of scene.nodes)cells.push(`<mxCell id="node:${n.id}" value="" style="rounded=${n.radius?1:0};arcSize=${n.radius};html=1;fillColor=${n.fill};strokeColor=${n.stroke};strokeWidth=${n.strokeWidth};" vertex="1" parent="1"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>`);
  for(const a of scene.assets){const mime=a.path.endsWith('.svg')?'image/svg+xml':a.path.endsWith('.png')?'image/png':'image/jpeg',data=readFileSync(new URL(a.path,ROOT)).toString('base64');cells.push(`<mxCell id="${a.id}" value="" style="shape=image;html=1;imageAspect=0;image=data:${mime},${data};" vertex="1" parent="1"><mxGeometry x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" as="geometry"/></mxCell>`);}
  for(const d of scene.decorations)cells.push(`<mxCell id="${d.id}" value="" style="shape=${d.type==='rect'?'rectangle':d.type};html=1;fillColor=${d.fill};strokeColor=${d.stroke};strokeWidth=1.8;${d.h<0?'flipV=1;':''}${d.w<0?'flipH=1;':''}" vertex="1" parent="1"><mxGeometry x="${Math.min(d.x,d.x+d.w)}" y="${Math.min(d.y,d.y+d.h)}" width="${Math.max(.1,Math.abs(d.w))}" height="${Math.max(.1,Math.abs(d.h))}" as="geometry"/></mxCell>`);
  for(const e of scene.edges){const uv=(side,f)=>({left:[0,f],right:[1,f],top:[f,0],bottom:[f,1]}[side]),start=uv(e.fromPort,e.fromFraction),end=uv(e.toPort,e.toFraction);cells.push(`<mxCell id="edge:${e.id}" value="" style="html=1;endArrow=block;strokeColor=${e.stroke};strokeWidth=${e.strokeWidth};exitX=${start[0]};exitY=${start[1]};entryX=${end[0]};entryY=${end[1]};${e.dashed?'dashed=1;':''}" edge="1" source="node:${e.from}" target="node:${e.to}" parent="1"><mxGeometry relative="1" as="geometry"><Array as="points">${e.points.slice(1,-1).map(p=>`<mxPoint x="${p[0]}" y="${p[1]}"/>`).join('')}</Array></mxGeometry></mxCell>`);}
  for(const t of scene.texts)cells.push(`<mxCell id="${t.id}" value="${esc(t.text)}" style="text;html=1;whiteSpace=wrap;align=${t.align};verticalAlign=middle;spacing=0;fontFamily=${t.fontFamily};fontSize=${t.fontSize};fontStyle=${t.bold?1:0};fontColor=${t.color};${t.background?`fillColor=${t.background};`:''}" vertex="1" parent="1"><mxGeometry x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" as="geometry"/></mxCell>`);
  return `<mxfile><diagram name="Architecture"><mxGraphModel adaptiveColors="auto" pageWidth="${scene.width}" pageHeight="${scene.height}"><root>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
}

export async function writeArtifacts(dir,scene,spec) {
  await fs.mkdir(dir,{recursive:true});
  const svg=toSVG(scene),pptx=await toPPTX(scene,spec);
  await fs.writeFile(path.join(dir,'figure.svg'),svg);
  await fs.writeFile(path.join(dir,'figure.pptx'),pptx);
  await fs.writeFile(path.join(dir,'figure.drawio'),toDrawio(scene));
  await fs.writeFile(path.join(dir,'spec.json'),JSON.stringify(spec,null,2)+'\n');
  await fs.writeFile(path.join(dir,'scene.json'),JSON.stringify(scene,null,2)+'\n');
  await sharp(Buffer.from(svg),{density:192}).png().toFile(path.join(dir,'figure.png'));
  await sharp(Buffer.from(svg)).resize({width:Math.min(1440,scene.width)}).png().toFile(path.join(dir,'preview.png'));
  for(const t of scene.texts)if(/[^\x20-\x7e\u00a0-\u00ff]/.test(t.text)&&!existsSync(resolvePdfFont(t.fontFamily,t.bold,t.italic)))throw new Error(`Unicode PDF text needs an installed font file: ${t.fontFamily}; install fontconfig/system fonts rather than silently dropping glyphs`);
  await new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:[scene.width*.75,scene.height*.75],margin:0,info:{Title:spec.title,Author:'PaperFigure',CreationDate:new Date('2000-01-01Z'),ModDate:new Date('2000-01-01Z')}});
    const out=createWriteStream(path.join(dir,'figure.pdf'));out.on('finish',resolve);out.on('error',reject);doc.on('error',reject);doc.pipe(out);
    SVGtoPDF(doc,svg,0,0,{width:scene.width*.75,height:scene.height*.75,assumePt:false,fontCallback:(family,bold,italic)=>resolvePdfFont(family,bold,italic)});doc.end();
  });
}
