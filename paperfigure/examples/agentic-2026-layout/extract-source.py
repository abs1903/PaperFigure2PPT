"""Recover text and vector evidence from the papers' original PDFs.
Raster icons alone are traced to color contours; words are never traced.
Run with: uv run --with pymupdf --with opencv-python-headless --with numpy python ...
"""
from pathlib import Path
import json,math,hashlib,re
import fitz,cv2,numpy as np
ROOT=Path(__file__).resolve().parent
CASES={'agemem':(1,[375.2,70.8,524.5,267.5]),'memskill':(3,[55.44,67.0634,541.44,284.416])}
def color(c): return '#'+''.join(f'{round(max(0,min(1,x))*255):02X}' for x in c[:3]) if c is not None else 'none'
def fontname(n):
 n=re.sub(r'^[A-Z]{6}\+','',n)
 if 'Times' in n or 'NimbusRom' in n:return 'Times New Roman'
 if 'ComicSans' in n:return 'Comic Sans MS'
 if 'Arial' in n:return 'Arial'
 if 'Calibri' in n:return 'Calibri'
 if 'Cambria' in n:return 'Cambria Math'
 return n
for name,(pageNo,crop) in CASES.items():
 folder=ROOT/name;source=folder/'source';doc=fitz.open(source/'paper.pdf');page=doc[pageNo];clip=fitz.Rect(crop);scale=4
 W,H=clip.width*scale,clip.height*scale
 P=lambda p:[round((p[0]-clip.x0)*scale,4),round((p[1]-clip.y0)*scale,4)]
 B=lambda r:[round((r[0]-clip.x0)*scale,4),round((r[1]-clip.y0)*scale,4),round((r[2]-r[0])*scale,4),round((r[3]-r[1])*scale,4)]
 inside=lambda r:(fitz.Rect(r)+(-.001,-.001,.001,.001)).intersects(clip)
 primitives=[]
 for idx,d in enumerate(page.get_drawings()):
  if not inside(d['rect']):continue
  # The giant source-picture white backdrop is replaced by the canvas background.
  if not clip.contains(d['rect']) and d['rect'].width>clip.width*.98 and d['rect'].height>clip.height*.98:continue
  cmd=[];last=None
  for item in d['items']:
   k=item[0]
   if k=='l':
    a,b=P(item[1]),P(item[2]);
    if last!=a:cmd.append(['M',*a])
    cmd.append(['L',*b]);last=b
   elif k=='c':
    a,b,c,e=map(P,item[1:]);
    if last!=a:cmd.append(['M',*a])
    cmd.append(['C',*b,*c,*e]);last=e
   elif k=='re':
    r=item[1];a,b,c,e=map(P,[(r.x0,r.y0),(r.x1,r.y0),(r.x1,r.y1),(r.x0,r.y1)])
    cmd += [['M',*a],['L',*b],['L',*c],['L',*e],['Z']];last=None
   elif k=='qu':
    q=item[1];a,b,c,e=map(P,[q.ul,q.ur,q.lr,q.ll]);cmd += [['M',*a],['L',*b],['L',*c],['L',*e],['Z']];last=None
   else:raise ValueError(k)
  if d['closePath'] and last is not None:cmd.append(['Z'])
  if cmd:primitives.append({'id':f'path-{idx}','type':'path','seq':d['seqno'],'box':B(d['rect']),'commands':cmd,'fill':color(d['fill']),'stroke':color(d['color']),'width':(d['width'] or 0)*scale,'dash':d.get('dashes'),'opacity':d.get('fill_opacity') if d.get('fill_opacity') is not None else 1,'fillRule':'evenodd' if d.get('even_odd') else 'nonzero'})
 for idx,t in enumerate(page.get_texttrace()):
  if not inside(t['bbox']):continue
  chars=[c for c in t['chars'] if clip.contains(fitz.Point(c[2]))]
  if not chars:continue
  text=''.join(chr(c[0]) for c in chars)
  if '\ufffd' in text:raise ValueError(f'Unrecoverable text {name} {idx}')
  # Source glyph positions are retained; text stays editable, never outlined.
  xys=[P(c[2]) for c in chars];angle=math.degrees(math.atan2(t['dir'][1],t['dir'][0]))
  primitives.append({'id':f'text-{idx}','type':'text','seq':t['seqno'],'box':B(t['bbox']),'text':text,'positions':xys,'font':fontname(t['font']),'sourceFont':t['font'],'size':t['size']*scale,'bold':bool(t['flags']&16),'italic':bool(t['flags']&2),'fill':color(t['color']),'angle':angle})
 imageBlocks=[b for b in page.get_text('dict')['blocks'] if b['type']==1]
 images=page.get_image_info(xrefs=True);allimgs={a[0]:a[1] for a in page.get_images(full=True)}
 logs=page.get_bboxlog();imageSeq=[(i,b) for i,(kind,b) in enumerate(logs) if kind=='fill-image']
 iconEvidence=[]
 for idx,info in enumerate(images):
  if not clip.contains(fitz.Rect(info['bbox'])):continue
  xref=info['xref']
  if xref:
   pix=fitz.Pixmap(doc,xref);mask=allimgs.get(xref)
   if mask:
    if pix.alpha:pix=fitz.Pixmap(pix,0)
    pix=fitz.Pixmap(pix,fitz.Pixmap(doc,mask))
  else:
   block=min(imageBlocks,key=lambda b:sum(abs(a-c) for a,c in zip(b['bbox'],info['bbox'])))
   if sum(abs(a-c) for a,c in zip(block['bbox'],info['bbox']))>5:raise ValueError('Inline source image not matched')
   info=dict(info,bbox=block['bbox']);pix=fitz.Pixmap(block['image'])
   if block.get('mask') and not pix.alpha:pix=fitz.Pixmap(pix,fitz.Pixmap(block['mask']))
  if pix.colorspace and pix.colorspace.n!=3:pix=fitz.Pixmap(fitz.csRGB,pix)
  data=np.frombuffer(pix.samples,dtype='uint8').reshape(pix.height,pix.width,pix.n)
  alpha=data[:,:,3] if pix.n==4 else np.full(data.shape[:2],255,np.uint8)
  rgb=np.clip(data[:,:,:3].astype(float)*255/np.maximum(alpha[:,:,None],1),0,255).astype('uint8') if pix.alpha else data[:,:,:3]
  # Color quantization yields independent contour regions, not a raster mosaic.
  samples=rgb[alpha>120].reshape(-1,3).astype('float32')
  if not len(samples):continue
  cv2.setRNGSeed(0)
  k=min(10,len(np.unique(samples,axis=0)))
  _,_,selected=cv2.kmeans(samples,k,None,(cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER,30,.5),1,cv2.KMEANS_PP_CENTERS)
  selected=np.clip(np.round(selected),0,255).astype('uint8')
  dist=((rgb.astype(float)[:,:,None,:]-selected[None,None,:,:])**2).sum(3);classes=dist.argmin(2)
  bx,by,bw,bh=B(info['bbox']);cmds=[]
  match=min(imageSeq,key=lambda v:sum(abs(a-b) for a,b in zip(v[1],info['bbox']))) if imageSeq else (1000+idx,None)
  for ci,c in enumerate(selected):
   bits=((classes==ci)&(alpha>70)).astype('uint8')*255
   contours,_=cv2.findContours(bits,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE);commands=[]
   for contour in contours:
    if abs(cv2.contourArea(contour))<1:continue
    poly=cv2.approxPolyDP(contour,.35,True)[:,0,:]
    pts=[[round(bx+float(x)/pix.width*bw,4),round(by+float(y)/pix.height*bh,4)] for x,y in poly]
    if len(pts)>2:commands += [['M',*pts[0]],*([['L',*p] for p in pts[1:]]),['Z']]
   if commands:primitives.append({'id':f'icon-{idx}-tone-{ci}','type':'path','seq':match[0]+ci*.001,'box':[bx,by,bw,bh],'commands':commands,'fill':color(c/255),'stroke':color(c/255),'width':1.1*(bw/pix.width+bh/pix.height)/2,'fillRule':'evenodd','opacity':float(np.median(alpha[(classes==ci)&(alpha>70)])/255) if np.any((classes==ci)&(alpha>70)) else 1,'icon':f'icon-{idx}'})
  iconEvidence.append({'id':f'icon-{idx}','xref':xref,'sourceBBox':info['bbox'],'box':[bx,by,bw,bh],'colors':len(selected),'purpose':'Non-text source icon; manually review before native delivery'})
 primitives.sort(key=lambda p:p['seq'])
 (folder/'source-primitives.json').write_text(json.dumps({'width':W,'height':H,'primitives':primitives,'icons':iconEvidence,'source':{'page':pageNo+1,'crop':crop,'scale':scale,'license':'CC BY 4.0','version':'2601.01885v1' if name=='agemem' else '2602.02474v1'}},separators=(',',':'))+'\n')
 if (source/'reference.png').exists() and not (source/'full-html-figure.png').exists():(source/'reference.png').rename(source/'full-html-figure.png')
 page.get_pixmap(matrix=fitz.Matrix(scale,scale),clip=clip,alpha=False).save(source/'reference.png')
 print(name,'canvas',W,H,'paths',sum(o['type']=='path' for o in primitives),'text',sum(o['type']=='text' for o in primitives),'icons',len(iconEvidence))
