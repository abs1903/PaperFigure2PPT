import {auditPptxPackage} from './pptx-package.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {overlaps,segmentHits,textWidth,port} from './layout.mjs';
import {ROOT} from './spec.mjs';

const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_',parseTagValue:false,trimValues:false});
const list=v=>v===undefined?[]:Array.isArray(v)?v:[v];
const eq=(a,b,tolerance=.1)=>Math.abs(Number(a)-Number(b))<=tolerance;
const boxShape=sp=>{
  const xf=sp['p:spPr']?.['a:xfrm'];
  if(!xf)return null;
  return {x:Number(xf['a:off']['@_x'])/9525,y:Number(xf['a:off']['@_y'])/9525,w:Number(xf['a:ext']['@_cx'])/9525,h:Number(xf['a:ext']['@_cy'])/9525};
};
const nv=sp=>sp['p:nvSpPr']?.['p:cNvPr']??sp['p:nvCxnSpPr']?.['p:cNvPr'];
function descendants(o,key){if(o===null||typeof o!=='object')return [];return Object.entries(o).flatMap(([k,v])=>k===key?list(v):descendants(v,key));}
export function crossing(a,b,c,d) {
  const orient=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  return orient(a,b,c)*orient(a,b,d)<0&&orient(c,d,a)*orient(c,d,b)<0;
}

export function layoutQA(scene) {
  const errors=[],warnings=[];
  const add=(code,objects,message,severity='error')=>(severity==='error'?errors:warnings).push({code,objects,message});
  const inCanvas=b=>b.x>=0&&b.y>=0&&b.x+b.w<=scene.width+.1&&b.y+b.h<=scene.height+.1;
  for(const o of [...scene.nodes,...scene.groups,...scene.texts,...scene.assets])if(!inCanvas(o))add('out-of-bounds',[o.id],'Object extends beyond canvas');
  for(let i=0;i<scene.nodes.length;i++)for(let j=i+1;j<scene.nodes.length;j++)if(overlaps(scene.nodes[i],scene.nodes[j]))add('node-overlap',[scene.nodes[i].id,scene.nodes[j].id],'Semantic nodes overlap');
  for(const t of scene.texts){
    if(textWidth(t.text,t.fontSize,t.bold)>t.w*.98)add('text-width',[t.id],'Helvetica metric estimate exceeds text box; inspect target font');
    if(t.fontSize*1.12>t.h)add('text-height',[t.id],'Text line height exceeds box');
    const pt=t.fontSize/scene.width*scene.publicationWidthIn*72;
    if(pt+1e-6<scene.minTextPt)add('print-legibility',[t.id],`Final-size text ${pt.toFixed(2)} pt < ${scene.minTextPt} pt`);
    if(/[^\x20-\x7e\u00a0-\u00ff]/.test(t.text))add('font-coverage',[t.id],'Non-Latin glyph coverage is not verified by the metric checker','warning');
  }
  for(const n of scene.nodes)for(const t of n.texts)if(t.y<n.y+6||t.y+t.h>n.y+n.h-6)add('node-text-overflow',[n.id,t.id],'Node text exceeds inner padding');
  for(const a of scene.assets){const n=scene.nodes.find(n=>n.id===a.owner);if(!n||a.x<n.x||a.y<n.y||a.x+a.w>n.x+n.w||a.y+a.h>n.y+n.h)add('asset-owner-bounds',[a.id],'An independent illustration must fit inside its declared semantic node');}
  for(const d of scene.decorations){
    const node=scene.nodes.find(n=>d.id.startsWith(`glyph:${n.id}:`)||d.owner===n.id);
    const box={x:Math.min(d.x,d.x+d.w),y:Math.min(d.y,d.y+d.h),w:Math.abs(d.w),h:Math.abs(d.h)};
    if(!inCanvas(box)||(d.type!=='line'&&(d.w<=0||d.h<=0))||(node&&(box.x<node.x||box.y<node.y||box.x+box.w>node.x+node.w||box.y+box.h>node.y+node.h)))add('glyph-bounds',[d.id],'Illustrative glyph does not fit its canvas or node');
    for(const t of node?.texts??[])if(!d.textBackground&&overlaps(box,t))add('glyph-text-overlap',[d.id,t.id],'Undeclared glyph overlaps module text');
  }
  for(let i=0;i<scene.texts.length;i++)for(let j=i+1;j<scene.texts.length;j++)if(overlaps(scene.texts[i],scene.texts[j]))add('text-overlap',[scene.texts[i].id,scene.texts[j].id],'Text bounding boxes overlap');
  for(const t of scene.texts)for(const n of scene.nodes)if(t.owner!==n.id&&!n.texts.some(x=>x.id===t.id)&&overlaps(t,n))add('text-node-overlap',[t.id,n.id],'Unrelated label overlaps a semantic node');
  for(const e of scene.edges){
    if(e.points.length<2)add('empty-route',[e.id],'Edge has no drawable path');
    const a=scene.nodes.find(n=>n.id===e.from),b=scene.nodes.find(n=>n.id===e.to);
    if(!e.points[0].every((v,i)=>eq(v,port(a,e.fromPort,e.fromFraction)[i]))||!e.points.at(-1).every((v,i)=>eq(v,port(b,e.toPort,e.toFraction)[i])))add('edge-attachment',[e.id],'Route does not meet declared ports');
    for(const p of e.points)if(p[0]<0||p[1]<0||p[0]>scene.width||p[1]>scene.height)add('route-out-of-bounds',[e.id],'Edge leaves canvas');
    for(let i=1;i<e.points.length;i++){
      for(const n of scene.nodes)if(segmentHits(e.points[i-1],e.points[i],n,0))add('edge-node-occlusion',[e.id,n.id],'Edge passes through node interior');
      for(const t of scene.texts.filter(t=>!t.id.startsWith('text:')&&t.id!==`edge-label:${e.id}`))if(segmentHits(e.points[i-1],e.points[i],t))add('edge-text-occlusion',[e.id,t.id],'Edge passes through text box');
    }
  }
  for(let i=0;i<scene.edges.length;i++)for(let j=i+1;j<scene.edges.length;j++){
    const a=scene.edges[i],b=scene.edges[j];
    let count=0;
    let shared=0;
    for(let u=1;u<a.points.length;u++)for(let v=1;v<b.points.length;v++){
      const [p,q,r,s]=[a.points[u-1],a.points[u],b.points[v-1],b.points[v]];
      if(crossing(p,q,r,s))count++;
      for(const axis of [0,1])if(p[axis]===q[axis]&&r[axis]===s[axis]&&p[axis]===r[axis]&&Math.min(Math.max(p[1-axis],q[1-axis]),Math.max(r[1-axis],s[1-axis]))-Math.max(Math.min(p[1-axis],q[1-axis]),Math.min(r[1-axis],s[1-axis]))>3)shared++;
    }
    if(count)add('edge-crossing',[a.id,b.id],`${count} proper segment intersection(s); review ambiguity`,'warning');
    if(shared)add('edge-shared-segment',[a.id,b.id],'Distinct edges share a collinear segment; review ambiguity','warning');
  }
  const labelMax=Math.max(...scene.nodes.map(n=>n.fontSize??scene.typography.moduleSize));
  const title=scene.texts.find(t=>t.id==='title');
  if(title&&title.fontSize<=labelMax)add('hierarchy-title',['title'],'Title is not larger than module text','warning');
  if(scene.typography.fontFamily!=='Arial'&&scene.typography.fontFamily!=='Helvetica')add('font-metrics',[],'Text bounds use Helvetica estimates; independently render the selected font','warning');
  return {errors,warnings,metrics:{nodes:scene.nodes.length,edges:scene.edges.length,texts:scene.texts.length,groups:scene.groups.length,minFinalTextPt:Math.min(...scene.texts.map(t=>t.fontSize/scene.width*scene.publicationWidthIn*72))}};
}

export async function artifactQA(dir,scene) {
  const errors=[];const fail=(code,objects,message)=>errors.push({code,objects,message});
  const svgRaw=await fs.readFile(path.join(dir,'figure.svg'),'utf8');
  if(XMLValidator.validate(svgRaw)!==true)fail('invalid-svg',[],'SVG XML is not well-formed');
  const svg=parser.parse(svgRaw).svg;
  const ids=[...svgRaw.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)fail('duplicate-svg-id',[],'SVG has duplicate object IDs');
  const rects=new Map(list(svg.rect).filter(o=>o['@_id']).map(o=>[o['@_id'],o]));
  const paths=new Map(list(svg.path).map(o=>[o['@_id'],o]));
  const texts=new Map(list(svg.text).map(o=>[o['@_id'],o]));
  const images=descendants(svg,'image');
  if(images.length!==scene.assets.length)fail('svg-raster',[],'Image inventory differs from declared independent assets');
  const zip=await JSZip.loadAsync(await fs.readFile(path.join(dir,'figure.pptx')));
  errors.push(...(await auditPptxPackage(zip)).errors);
  const xml=await zip.file('ppt/slides/slide1.xml').async('string');
  const rels=parser.parse(await zip.file('ppt/slides/_rels/slide1.xml.rels').async('string')).Relationships;
  if(XMLValidator.validate(xml)!==true)fail('invalid-pptx-xml',[],'Slide XML is not well-formed');
  const slide=parser.parse(xml)['p:sld']['p:cSld']['p:spTree'];
  const shapes=descendants(slide,'p:sp'),connectors=descendants(slide,'p:cxnSp');
  const shapeMap=new Map(shapes.map(s=>[nv(s)['@_name'],s]));
  const connMap=new Map(connectors.map(s=>[nv(s)['@_name'],s]));
  const pics=descendants(slide,'p:pic');
  if(shapeMap.size!==shapes.length||connMap.size!==connectors.length)fail('duplicate-pptx-name',[],'PPTX has duplicate semantic object names');
  const contentObjects=shapes.length+connectors.length+pics.length;
  if(pics.length!==scene.assets.length)fail('rasterized-pptx',[],'PPTX contains undeclared picture objects');
  for(const asset of scene.assets){
    const pic=pics.find(p=>p['p:nvPicPr']?.['p:cNvPr']?.['@_name']===asset.id),b=pic&&boxShape(pic);
    const image=images.find(p=>p['@_id']===asset.id);
    if(!b||!image||['x','y','w','h'].some(k=>!eq(b[k],asset[k])))fail('asset-geometry',[asset.id],'Independent asset missing or moved in PPTX/SVG');
    if(pic&&image){
      const rid=pic['p:blipFill']?.['a:blip']?.['@_r:embed'],rel=list(rels.Relationship).find(r=>r['@_Id']===rid);
      const media=rel&&zip.file(path.posix.normalize('ppt/slides/'+rel['@_Target']));
      const original=await fs.readFile(new URL(asset.path,ROOT));
      const embedded=String(image['@_href']??'').split(',')[1];
      if(!media||!Buffer.from(embedded??'','base64').equals(original)||!(await media.async('nodebuffer')).equals(original))fail('asset-content',[asset.id],'Embedded illustration differs from its declared source');
      if(asset.crop){
        const c=asset.crop,rect=pic['p:blipFill']?.['a:srcRect'];
        const target={l:c.x/c.sourceWidth,t:c.y/c.sourceHeight,r:(c.sourceWidth-c.x-c.w)/c.sourceWidth,b:(c.sourceHeight-c.y-c.h)/c.sourceHeight};
        if(!rect||Object.entries(target).some(([k,v])=>!eq(rect['@_'+k],Math.round(v*100000),1)))fail('asset-crop',[asset.id],'PowerPoint picture crop differs from the source viewport');
        const viewport=descendants(svg,'svg').find(v=>v['@_id']===`viewport:${asset.id}`);
        if(viewport?.['@_viewBox']!==`${c.x} ${c.y} ${c.w} ${c.h}`)fail('asset-crop',[asset.id],'SVG picture crop differs from the source viewport');
      }
    }
    if(asset.w*asset.h>scene.width*scene.height*.25)fail('full-figure-image',[asset.id],'An illustrative asset must not replace the architecture');
  }
  const expectedSegments=scene.edges.reduce((n,e)=>n+e.points.length-1,0);
  if(connectors.length!==expectedSegments)fail('connector-count',[],`Expected ${expectedSegments} native connector segments, got ${connectors.length}`);
  for(const n of [...scene.nodes,...scene.groups]){
    const name=`${scene.nodes.includes(n)?'node':'group'}:${n.id}`,r=rects.get(name),sp=shapeMap.get(name),b=sp&&boxShape(sp);
    if(!r||!b){fail('missing-node',[name],'Node/group missing from SVG or PPTX');continue;}
    for(const [key,attr] of [['x','x'],['y','y'],['w','width'],['h','height']])if(!eq(n[key],r[`@_${attr}`])||!eq(n[key],b[key]))fail('geometry-mismatch',[name],`${key} differs between specification scene, SVG, PPTX`);
    if(n.fill && r['@_fill']!==(n.gradient?`url(#gradient-${name.replace(/:/g,'-')})`:n.fill))fail('style-mismatch',[name],'SVG fill differs from scene');
  }
  for(const t of scene.texts){
    const sv=texts.get(t.id),sp=shapeMap.get(t.id);
    if(!sv||!sp){fail('missing-text',[t.id],'Native text missing');continue;}
    const actual=descendants(sp,'a:t').map(v=>typeof v==='object'?v['#text']??'':v).join('');
    const svgText=t.runs?list(sv.tspan).map(v=>typeof v==='object'?v['#text']??'':v).join(''):sv['#text']??'';
    if(actual!==t.text||String(svgText)!==t.text)fail('text-mismatch',[t.id],`SVG/PPTX label does not match scene: ${actual}`);
    const b=boxShape(sp);
    for(const key of ['x','y','w','h'])if(!eq(b[key],t[key]))fail('text-geometry',[t.id],`PPTX text ${key} differs`);
    const size=descendants(sp,'a:rPr').find(v=>v['@_sz'])?.['@_sz'];
    if(!eq(Number(size)/100,t.fontSize*.75))fail('text-size',[t.id],'PPTX font size differs from scene');
    if(!String(sv['@_font-family']).startsWith(t.fontFamily)||!descendants(sp,'a:latin').some(v=>v['@_typeface']===t.fontFamily))fail('text-font',[t.id],'SVG/PPTX font family differs from scene');
  }
  for(const e of scene.edges){
    const sv=paths.get(`edge:${e.id}`);
    if(!sv){fail('missing-edge',[e.id],'Edge missing in SVG');continue;}
    const expected=e.points.map((p,i)=>`${i?'L':'M'} ${p.join(' ')}`).join(' ');
    if(sv['@_d']!==expected||sv['@_data-from']!==e.from||sv['@_data-to']!==e.to)fail('svg-edge-mismatch',[e.id],'SVG route or endpoints differ');
    for(let i=1;i<e.points.length;i++){
      const sp=connMap.get(`edge:${e.id}:segment:${i-1}`);
      if(!sp){fail('missing-edge',[e.id],'Native connector segment missing');continue;}
      const xf=sp['p:spPr']['a:xfrm'],box=boxShape(sp),flipH=String(xf['@_flipH'])==='1',flipV=String(xf['@_flipV'])==='1';
      const actual=[[box.x+(flipH?box.w:0),box.y+(flipV?box.h:0)],[box.x+(flipH?0:box.w),box.y+(flipV?0:box.h)]];
      const ends=[e.points[i-1],e.points[i]];
      if(actual.some((p,k)=>p.some((v,j)=>!eq(v,ends[k][j]))))fail('pptx-route-mismatch',[e.id],'Native segment endpoints differ from SVG route');
      const arrow=sp['p:spPr']['a:ln']?.['a:tailEnd']?.['@_type'];
      if(arrow!==(i===e.points.length-1?'arrow':'none'))fail('pptx-arrowhead',[e.id],'Arrowhead missing or on an intermediate segment');
    }
  }
  for(const d of scene.decorations){
    const sp=shapeMap.get(d.id),b=sp&&boxShape(sp);
    const sv=list(svg[d.type]).find(o=>o['@_id']===d.id);
    if(!b||!sv){fail('missing-glyph',[d.id],'Illustrative primitive missing from SVG/PPTX');continue;}
    const expected={x:Math.min(d.x,d.x+d.w),y:Math.min(d.y,d.y+d.h),w:Math.abs(d.w),h:Math.abs(d.h)};
    if(Object.keys(expected).some(k=>!eq(b[k],expected[k])))fail('glyph-geometry',[d.id],'PPTX primitive geometry differs');
  }
  const gradients=new Map(descendants(svg,'linearGradient').map(g=>[g['@_id'],g]));
  for(const [id,o] of [...scene.nodes.map(n=>[`node:${n.id}`,n]),...scene.decorations.map(d=>[d.id,d])].filter(([_id,o])=>o.gradient)){
    const sv=gradients.get(`gradient-${id.replace(/:/g,'-')}`),sp=shapeMap.get(id),native=sp?.['p:spPr']?.['a:gradFill'];
    const stops=sv?list(sv.stop).map(s=>s['@_stop-color']):[],colors=native?list(native['a:gsLst']?.['a:gs']).map(s=>s['a:srgbClr']?.['@_val']):[];
    if(stops.join(',')!==`${o.gradient.from},${o.gradient.to}`||colors.join(',')!==`${o.gradient.from.slice(1)},${o.gradient.to.slice(1)}`)fail('gradient-mismatch',[id],'Native and SVG gradient stops differ from the design');
  }
  const expectedNames=new Set([...scene.nodes.map(n=>`node:${n.id}`),...scene.groups.map(g=>`group:${g.id}`),...scene.edges.map(e=>`edge:${e.id}`),...scene.edges.flatMap(e=>e.points.slice(1).map((_p,i)=>`edge:${e.id}:segment:${i}`)),...scene.texts.map(t=>t.id),...scene.decorations.map(d=>d.id)]);
  for(const name of [...shapeMap.keys(),...connMap.keys()])if(!expectedNames.has(name))fail('extra-pptx-object',[name],'Unexpected object not represented in scene');
  for(const name of [...rects.keys(),...paths.keys(),...texts.keys()])if(name&&!expectedNames.has(name))fail('extra-svg-object',[name],'Unexpected object not represented in scene');
  return {errors,metrics:{nativeShapes:shapes.length,nativeConnectors:connectors.length,logicalEdges:scene.edges.length,automaticEndpointAttachment:false,nativeTextBoxes:scene.texts.length,pictures:pics.length,editableRatio:contentObjects?(shapes.length+connectors.length)/contentObjects:0},limits:['Structural and geometry parity checked. Font substitution and raster appearance require independent PPTX rendering.','Evidence quotation checks establish traceability, not scientific entailment.','Connector segments are grouped per semantic edge and are not auto-attached to modules; moving modules requires route adjustment.']};
}

export async function runQA(dir,scene) {
  const layout=layoutQA(scene),artifacts=await artifactQA(dir,scene);
  const errors=[...layout.errors,...artifacts.errors];
  return {passed:errors.length===0,deliveryReady:false,visualAcceptance:'unreviewed',errors,warnings:layout.warnings,metrics:{...layout.metrics,...artifacts.metrics},subjective:{semanticFidelity:'requires-source-review',visualQuality:'requires-independent-visual-review',humanEditingCost:'not-measured'},limits:artifacts.limits};
}
