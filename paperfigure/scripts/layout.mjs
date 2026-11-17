import PDFDocument from 'pdfkit';
import {assertSpec, readJSON, ROOT, digest, semanticSnapshot} from './spec.mjs';

const fonts = new PDFDocument({autoFirstPage:false});
export function textWidth(text, size, bold=false) {
  return fonts.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).widthOfString(text);
}
export function wrap(text, width, size, bold=false) {
  const lines=[];
  for (const paragraph of text.split('\n')) {
    let line='';
    for (const word of paragraph.split(/\s+/)) {
      const next=line ? `${line} ${word}` : word;
      if (line && textWidth(next,size,bold)>width) {lines.push(line);line=word;} else line=next;
    }
    lines.push(line);
  }
  return lines;
}
export const overlaps = (a,b,pad=0) => a.x < b.x+b.w+pad && a.x+a.w+pad > b.x && a.y < b.y+b.h+pad && a.y+a.h+pad > b.y;
export const inside = (p,b,pad=0) => p[0]>b.x-pad+0.01 && p[0]<b.x+b.w+pad-0.01 && p[1]>b.y-pad+0.01 && p[1]<b.y+b.h+pad-0.01;
export function segmentHits(a,b,box,pad=0) {
  const r={x:box.x-pad,y:box.y-pad,w:box.w+pad*2,h:box.h+pad*2};
  if (a[0]===b[0]) return a[0]>r.x+.01 && a[0]<r.x+r.w-.01 && Math.max(a[1],b[1])>r.y+.01 && Math.min(a[1],b[1])<r.y+r.h-.01;
  if (a[1]===b[1]) return a[1]>r.y+.01 && a[1]<r.y+r.h-.01 && Math.max(a[0],b[0])>r.x+.01 && Math.min(a[0],b[0])<r.x+r.w-.01;
  // Conservative sampled check for deliberately supplied diagonal routes.
  for(let t=0;t<=1;t+=.01) if(inside([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],r)) return true;
  return false;
}
export function port(b,p,f=.5) {
  return {left:[b.x,b.y+b.h*f],right:[b.x+b.w,b.y+b.h*f],top:[b.x+b.w*f,b.y],bottom:[b.x+b.w*f,b.y+b.h]}[p];
}
const steps={left:[-20,0],right:[20,0],top:[0,-20],bottom:[0,20]};
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const length=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function simplify(points) {
  const out=[];
  for (const p of points) {
    if(out.length && length(out.at(-1),p)<.01)continue;
    while(out.length>1) {
      const a=out.at(-2),b=out.at(-1);
      if((a[0]===b[0]&&b[0]===p[0] || a[1]===b[1]&&b[1]===p[1]) && length(a,p)>=length(a,b))out.pop();else break;
    }
    out.push(p);
  }
  return out;
}

// Sparse orthogonal visibility graph. Obstacles are inflated; axis-aligned moves
// are selected by Dijkstra with a bend penalty. No semantic edge is ever added.
function route(a,b,obstacles,canvas) {
  if(length(a,b)===0)return [a];
  const xs=[a[0],b[0],24,canvas.width-24],ys=[a[1],b[1],132,canvas.height-100];
  for(const o of obstacles){xs.push(o.x-16,o.x+o.w+16);ys.push(o.y-16,o.y+o.h+16);}
  const xx=[...new Set(xs)].filter(x=>x>=20&&x<=canvas.width-20).sort((a,b)=>a-b);
  const yy=[...new Set(ys)].filter(y=>y>=120&&y<=canvas.height-90).sort((a,b)=>a-b);
  const pts=[],keys=new Map();
  for(const x of xx)for(const y of yy){const p=[x,y];if(!obstacles.some(o=>inside(p,o,10))){keys.set(`${x},${y}`,pts.length);pts.push(p);}}
  const start=keys.get(a.join(',')),end=keys.get(b.join(','));
  if(start===undefined||end===undefined)throw new Error('Port blocked by neighboring node; increase spacing');
  const adj=pts.map(()=>[]);
  for(const axis of [0,1]) {
    const lines=new Map();
    pts.forEach((p,i)=>{const k=p[1-axis];if(!lines.has(k))lines.set(k,[]);lines.get(k).push(i);});
    for(const list of lines.values()){
      list.sort((i,j)=>pts[i][axis]-pts[j][axis]);
      for(let k=1;k<list.length;k++){
        const i=list[k-1],j=list[k];
        if(!obstacles.some(o=>segmentHits(pts[i],pts[j],o,10))){adj[i].push([j,axis]);adj[j].push([i,axis]);}
      }
    }
  }
  const q=[{i:start,axis:-1,cost:0,key:`${start}:-1`}],dist=new Map([[`${start}:-1`,0]]),prev=new Map();
  let finish;
  while(q.length){
    q.sort((a,b)=>a.cost-b.cost);const cur=q.shift();
    if(cur.cost!==dist.get(cur.key))continue;
    if(cur.i===end){finish=cur.key;break;}
    for(const [i,axis] of adj[cur.i]){
      const cost=cur.cost+length(pts[cur.i],pts[i])+(cur.axis!==axis&&cur.axis!==-1?24:0),key=`${i}:${axis}`;
      if(cost<(dist.get(key)??Infinity)){dist.set(key,cost);prev.set(key,cur.key);q.push({i,axis,cost,key});}
    }
  }
  if(!finish)throw new Error('Cannot route edge; provide layout.edges.via or increase canvas');
  const result=[];
  for(let k=finish;k;k=prev.get(k)) result.unshift(pts[Number(k.split(':')[0])]);
  return simplify(result);
}

function autoBoxes(s) {
  const rank=new Map(s.nodes.map(n=>[n.id,0]));
  for(let i=0;i<s.nodes.length;i++)for(const e of s.edges.filter(e=>e.kind!=='feedback'))rank.set(e.to,Math.max(rank.get(e.to),rank.get(e.from)+1));
  const max=Math.max(...rank.values()),horizontal=s.layout.direction==='LR';
  const {width:W,height:H}=s.layout.canvas, boxes={};
  const lanes=new Map();
  for(const n of s.nodes){const r=rank.get(n.id);if(!lanes.has(r))lanes.set(r,[]);lanes.get(r).push(n);}
  for(const [r,ns] of lanes)for(let j=0;j<ns.length;j++){
    const usable=horizontal?W-96:H-256, step=usable/(max+1), cross=horizontal?H-260:W-96;
    const w=horizontal?Math.min(210,step-44):Math.min(220,cross/ns.length-36),h=horizontal?Math.min(110,cross/ns.length-44):Math.min(100,step-40);
    if(w<130||h<76)throw new Error('Automatic layout too dense; use an explicit layout or split into panels');
    boxes[ns[j].id]=horizontal?{x:48+r*step+(step-w)/2,y:160+(j+.5)*cross/ns.length-h/2,w,h}:{x:48+(j+.5)*cross/ns.length-w/2,y:144+r*step+(step-h)/2,w,h};
  }
  return boxes;
}

export function buildScene(spec) {
  const s=assertSpec(spec),themes=readJSON(new URL('assets/themes.json',ROOT)),theme=themes[s.visual.theme];
  const typography={fontFamily:'Arial',moduleSize:24,detailSize:20,annotationSize:20,titleSize:30,moduleBold:true,...s.visual.typography};
  const {width,height}=s.layout.canvas;
  const hasAll=s.nodes.every(n=>s.layout.nodes?.[n.id]);
  const boxes={...(hasAll?{}:autoBoxes(s)),...s.layout.nodes};
  const nodes=s.nodes.map(n=>{
    const box=boxes[n.id],size=box.fontSize??typography.moduleSize,style=theme.roles[n.status==='proposed'?'proposed':n.role];
    const appearance=s.visual.appearances?.nodes?.[n.id]??{};
    const glyph=s.visual.nodeGlyphs?.[n.id];
    const labelLines=appearance.hideLabel?[]:wrap(n.label,(appearance.label?.w??box.w-28),size,appearance.label?.bold??typography.moduleBold),detailLines=n.detail&&!appearance.hideDetail?wrap(n.detail,appearance.detail?.w??box.w-28,typography.detailSize):[];
    const totalH=labelLines.length*size*1.18+(detailLines.length?8+detailLines.length*typography.detailSize*1.18:0);
    const texts=[];let y=glyph==='stack'?box.y+22:glyph?box.y+box.h-totalH-14:box.y+(box.h-totalH)/2;
    for(const [lines,fontSize,isLabel,color] of [[labelLines,size,true,theme.ink],[detailLines,typography.detailSize,false,theme.muted]]){
      if(!isLabel&&lines.length)y+=8;
      const cfg=isLabel?appearance.label:appearance.detail;
      lines.forEach((text,i)=>{texts.push({id:`text:${n.id}:${isLabel?'label':'detail'}:${i}`,text,x:cfg?box.x+cfg.x:box.x+14,y:cfg?box.y+cfg.y+i*fontSize*1.18:y,w:cfg?.w??box.w-28,h:fontSize*1.18,fontSize,bold:cfg?.bold??(isLabel&&typography.moduleBold),color,align:cfg?.align??'center',fontFamily:cfg?.fontFamily,italic:cfg?.italic});y+=fontSize*1.18;});
    }
    return {...n,...box,fill:appearance.fill??style[0],gradient:appearance.gradient,stroke:appearance.stroke??style[1],radius:appearance.radius??8,strokeWidth:appearance.strokeWidth??(n.status==='proposed'?2.8:1.8),texts,glyph};
  });
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const edges=s.edges.map(e=>{
    const a=byId.get(e.from),b=byId.get(e.to),cfg=s.layout.edges?.[e.id]??{};
    const dx=b.x+b.w/2-a.x-a.w/2,dy=b.y+b.h/2-a.y-a.h/2;
    const fromPort=cfg.fromPort??(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'bottom':'top'));
    const toPort=cfg.toPort??({right:'left',left:'right',top:'bottom',bottom:'top'}[fromPort]);
    const fromFraction=cfg.fromFraction??.5,toFraction=cfg.toFraction??.5;
    const start=port(a,fromPort,fromFraction),end=port(b,toPort,toFraction);
    const first=add(start,steps[fromPort]),last=add(end,steps[toPort]);
    const points=simplify(cfg.via?[start,...cfg.via,end]:[start,...route(first,last,nodes,s.layout.canvas),end]);
    let label=null;
    if(e.label){
      let longest=[points[0],points[1]];
      for(let i=1;i<points.length;i++)if(length(points[i-1],points[i])>length(...longest))longest=[points[i-1],points[i]];
      const w=textWidth(e.label,typography.annotationSize)+16;
      const x=cfg.label?.x??((longest[0][0]+longest[1][0])/2-w/2),y=cfg.label?.y??((longest[0][1]+longest[1][1])/2-30);
      label={id:`edge-label:${e.id}`,text:e.label,x,y,w,h:typography.annotationSize*1.3,fontSize:typography.annotationSize,bold:false,color:theme.muted,align:'center',background:theme.background};
    }
    const appearance=s.visual.appearances?.edges?.[e.id]??{};
    if(label&&appearance.labelBackground===false)delete label.background;
    return {...e,points,fromPort,toPort,fromFraction,toFraction,label,stroke:appearance.stroke??(e.status==='proposed'?theme.roles.proposed[1]:theme.line),strokeWidth:appearance.strokeWidth??2.5,dashed:e.kind!=='data'||e.phase==='train'};
  });
  const groups=s.groups.map(g=>{
    const children=g.members.map(id=>byId.get(id));
    const headerSpace=Math.max(52,typography.annotationSize*1.3+24);
    const x=Math.min(...children.map(n=>n.x))-22,y=Math.min(...children.map(n=>n.y))-headerSpace;
    return {...g,x,y,w:Math.max(...children.map(n=>n.x+n.w))-x+22,h:Math.max(...children.map(n=>n.y+n.h))-y+22,fill:'#FAFBFD',stroke:'#CCD6DF',radius:10,strokeWidth:1.5,...s.visual.appearances?.groups?.[g.id]};
  }).sort((a,b)=>b.w*b.h-a.w*a.h);
  const texts=[];
  if(s.visual.showTitle)texts.push({id:'title',text:s.title,x:44,y:30,w:width-88,h:typography.titleSize*1.3,fontSize:typography.titleSize,bold:true,color:theme.ink,align:'left'});
  if(s.visual.showSubtitle&&s.subtitle)texts.push({id:'subtitle',text:s.subtitle,x:44,y:s.visual.showTitle?80:30,w:width-88,h:typography.annotationSize*1.3,fontSize:typography.annotationSize,bold:false,color:theme.muted,align:'left'});
  groups.forEach(g=>texts.push({id:`group-label:${g.id}`,text:g.label,x:g.x+14,y:g.y+12,w:g.w-28,h:typography.annotationSize*1.3,fontSize:typography.annotationSize,bold:true,color:theme.muted,align:'left'}));
  nodes.forEach(n=>texts.push(...n.texts));edges.forEach(e=>{if(e.label)texts.push(e.label);});
  const legend=[];
  if(s.edges.some(e=>e.kind==='data'))legend.push('Solid: data flow');
  if(s.edges.some(e=>e.kind==='control'))legend.push('Dashed: control');
  if(s.edges.some(e=>e.kind==='feedback'))legend.push('Dashed: temporal feedback');
  if(s.edges.some(e=>e.phase==='train'))legend.push('Dashed: training-only (labeled)');
  if(s.nodes.some(n=>n.status==='proposed'))legend.push('Teal outline: stated contribution');
  if(s.visual.showLegend)texts.push({id:'legend',text:legend.join('   |   '),x:44,y:height-54,w:width-88,h:typography.annotationSize*1.3,fontSize:typography.annotationSize,bold:false,color:theme.muted,align:'left'});
  const decorations=[];
  const assets=[];
  const shape=(n,type,x,y,w,h,fill,stroke,extra={})=>decorations.push({id:`glyph:${n.id}:${decorations.length}`,type,x,y,w,h,fill,stroke,...extra});
  for(const n of nodes){
    const x=n.x+24,w=n.w-48;
    if(n.glyph==='stack'){
      const top=Math.max(...n.texts.map(t=>t.y+t.h))+24,h=(n.y+n.h-top-62)/2;
      for(let i=0;i<2;i++){
        const y=top+i*(h+36);
        shape(n,'rect',x,y,w,h,'#FFFFFF',n.stroke,{radius:2});
        texts.push({id:`glyph-text:${n.id}:${i}`,owner:n.id,text:n.detail?.includes('Decoder')?'Decoder block':'Model block',x,y:y+(h-typography.detailSize*1.18)/2,w,h:typography.detailSize*1.18,fontSize:typography.detailSize,bold:false,color:theme.muted,align:'center'});
      }
      texts.push({id:`glyph-text:${n.id}:ellipsis`,owner:n.id,text:'...',x,y:top+h+3,w,h:typography.detailSize*1.18,fontSize:typography.detailSize,bold:true,color:theme.muted,align:'center'});
    }else if(n.glyph==='image'){
      const y=n.y+16,h=n.texts[0].y-y-14;
      shape(n,'rect',x,y,w,h,'#E9F2F7','#9FB6C7',{radius:2});
      shape(n,'rect',x,y+h*.67,w,h*.33,'#CEE1D6','none');
      shape(n,'ellipse',x+w*.68,y+h*.15,Math.min(18,h*.22),Math.min(18,h*.22),'#D1B877','none');
      shape(n,'line',x+8,y+h*.68,w*.32,-h*.3,'none','#6A9789');
      shape(n,'line',x+8+w*.32,y+h*.38,w*.30,h*.30,'none','#6A9789');
    }else if(n.glyph==='memory'){
      const top=n.y+18,h=Math.max(8,(n.texts[0].y-top-20)/3);
      for(let i=0;i<3;i++)shape(n,'rect',x,top+i*(h+4),w,h,'#FFFFFF',n.stroke,{radius:2});
    }else if(n.glyph==='tools'){
      const y=n.y+20,h=n.texts[0].y-y-12,unit=Math.min(h,46);
      shape(n,'ellipse',n.x+n.w*.28,y,unit*.65,unit*.65,'none',n.stroke);
      shape(n,'line',n.x+n.w*.28+unit*.52,y+unit*.52,unit*.3,unit*.3,'none',n.stroke);
      shape(n,'rect',n.x+n.w*.60,y,unit,unit*.8,'#FFFFFF',n.stroke,{radius:2});
      shape(n,'line',n.x+n.w*.60+8,y+10,7,7,'none',n.stroke);
      shape(n,'line',n.x+n.w*.60+15,y+17,-7,7,'none',n.stroke);
    }
  }
  for(const art of s.visual.artwork??[]) {
    const id=`art:${art.id}`;
    if(art.type==='text')texts.push({id,owner:art.owner,text:art.text,runs:art.runs,x:art.x,y:art.y,w:art.w,h:art.h,fontSize:art.fontSize??typography.detailSize,bold:art.bold??false,color:art.fill??theme.ink,align:art.align??'center',fontFamily:art.fontFamily,italic:art.italic});
    else if(art.type==='asset')assets.push({...art,id,path:art.asset});
    else decorations.push({...art,id,fill:art.fill??'none',stroke:art.stroke??theme.line});
  }
  texts.forEach(t=>{t.fontFamily??=typography.fontFamily;});
  return {width,height,theme,nodes,edges,groups,texts,decorations,assets,title:s.title,typography,specHash:digest(s),semanticHash:digest(semanticSnapshot(s)),publicationWidthIn:s.visual.publicationWidthIn,minTextPt:s.visual.minTextPt};
}
