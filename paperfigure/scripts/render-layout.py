#!/usr/bin/env python3
"""Independent native rendering and ink/connector QA. Requires PyMuPDF + numpy.
No global font installation, external API, or existing browser/Office session.
"""
import argparse,copy,hashlib,json,math,os,shutil,subprocess,tempfile,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
import fitz,numpy as np
NS={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
for k,v in NS.items():ET.register_namespace(k,v)
P=lambda tag:'{'+NS['p']+'}'+tag
A=lambda tag:'{'+NS['a']+'}'+tag
R='{'+NS['r']+'}'
REL='http://schemas.openxmlformats.org/package/2006/relationships'
CT='http://schemas.openxmlformats.org/package/2006/content-types'
def name_of(element):
 node=element.find('.//'+P('cNvPr'));return node.get('name') if node is not None else None
def write_zip(template,out,changes):
 with zipfile.ZipFile(template) as z,zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as target:
  for item in z.infolist():target.writestr(item,changes.pop(item.filename,z.read(item.filename)))
  for name,data in changes.items():target.writestr(name,data)
def isolation_background(element):
 """Choose a matte that exposes all explicitly colored text runs unchanged."""
 colors=[tuple(int(e.get('val')[i:i+2],16) for i in (0,2,4))
         for e in element.findall('.//'+A('rPr')+'/'+A('solidFill')+'/'+A('srgbClr'))]
 colors=colors or [(0,0,0)]
 value=max((255,0,128),key=lambda bg:min(max(abs(c-bg) for c in rgb) for rgb in colors))
 return (value,value,value)
def text_ink_mask(arr,background):
 # Same 35-level contrast floor as the old white-background <220 check.
 return np.max(np.abs(arr.astype(np.int16)-np.array(background,dtype=np.int16)),axis=2)>35
def make_isolation(template,out,groups,backgrounds=None):
 """Each group becomes one slide. Actual generated native objects are copied,
 not re-authored; identity group transforms are verified before flattening text.
 """
 with zipfile.ZipFile(template) as z:
  source=ET.fromstring(z.read('ppt/slides/slide1.xml'))
  for grp in source.iter(P('grpSp')):
   xf=grp.find('./'+P('grpSpPr')+'/'+A('xfrm'))
   if xf is None:continue
   for a,b in [('off','chOff'),('ext','chExt')]:
    aa,bb=xf.find(A(a)),xf.find(A(b))
    if aa is not None and bb is not None and aa.attrib!=bb.attrib:raise ValueError('Non-identity source group transform needs explicit flattening, not assumed coordinates')
  pres=ET.fromstring(z.read('ppt/presentation.xml'));ids=pres.find(P('sldIdLst'));ids.clear()
  rel=ET.fromstring(z.read('ppt/_rels/presentation.xml.rels'))
  for e in list(rel):
   if e.get('Type','').endswith('/slide'):rel.remove(e)
  types=ET.fromstring(z.read('[Content_Types].xml'));rels=ET.fromstring(z.read('ppt/slides/_rels/slide1.xml.rels'))
  for r in list(rels):
   if r.get('Type','').endswith('/notesSlide'):rels.remove(r)
  updates={}
  for index,objects in enumerate(groups,1):
   slide=copy.deepcopy(source);tree=slide.find('.//'+P('spTree'))
   if backgrounds is not None:
    csld=slide.find(P('cSld'));old=csld.find(P('bg'))
    if old is not None:csld.remove(old)
    bg=ET.Element(P('bg'));pr=ET.SubElement(bg,P('bgPr'));fill=ET.SubElement(pr,A('solidFill'))
    ET.SubElement(fill,A('srgbClr'),{'val':''.join(f'{c:02X}' for c in backgrounds[index-1])})
    ET.SubElement(pr,A('effectLst'));csld.insert(0,bg)
   for child in list(tree):
    if child.tag not in [P('nvGrpSpPr'),P('grpSpPr')]:tree.remove(child)
   for obj in objects:tree.append(copy.deepcopy(obj))
   updates[f'ppt/slides/slide{index}.xml']=ET.tostring(slide,encoding='utf-8',xml_declaration=True)
   ET.register_namespace('',REL)
   updates[f'ppt/slides/_rels/slide{index}.xml.rels']=ET.tostring(rels,encoding='utf-8',xml_declaration=True)
   ET.SubElement(ids,P('sldId'),{'id':str(255+index),R+'id':f'figureSlide{index}'})
   ET.SubElement(rel,'{'+REL+'}Relationship',{'Id':f'figureSlide{index}','Type':NS['r']+'/slide','Target':f'slides/slide{index}.xml'})
   if index>1:ET.SubElement(types,'{'+CT+'}Override',{'PartName':f'/ppt/slides/slide{index}.xml','ContentType':'application/vnd.openxmlformats-officedocument.presentationml.slide+xml'})
  updates['ppt/presentation.xml']=ET.tostring(pres,encoding='utf-8',xml_declaration=True)
  ET.register_namespace('',REL)
  updates['ppt/_rels/presentation.xml.rels']=ET.tostring(rel,encoding='utf-8',xml_declaration=True)
  ET.register_namespace('',CT)
  updates['[Content_Types].xml']=ET.tostring(types,encoding='utf-8',xml_declaration=True)
  write_zip(template,out,updates)
def render(pptx,outdir,fontconfig):
 outdir.mkdir(exist_ok=True)
 with tempfile.TemporaryDirectory(prefix='paperfigure-office-') as profile:
  env=dict(os.environ,FONTCONFIG_FILE=str(fontconfig))
  r=subprocess.run(['soffice','-env:UserInstallation='+Path(profile).as_uri(),'--headless','--convert-to','pdf','--outdir',str(outdir),str(pptx)],env=env,capture_output=True,text=True,timeout=60)
  pdf=outdir/(pptx.stem+'.pdf')
  if r.returncode or not pdf.exists():raise RuntimeError(r.stdout+r.stderr)
 return pdf
def png(page,width,height,out):
 pix=page.get_pixmap(matrix=fitz.Matrix(width/page.rect.width,height/page.rect.height),alpha=False);pix.save(out);return np.frombuffer(pix.samples,dtype='uint8').reshape(pix.height,pix.width,pix.n)[:,:,:3]
def near(mask,p,r=2):
 x,y=round(p[0]),round(p[1]);return np.any(mask[max(0,y-r):min(mask.shape[0],y+r+1),max(0,x-r):min(mask.shape[1],x+r+1)])
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',required=True);ap.add_argument('--checks',action='store_true');ap.add_argument('--name',default='native-render');args=ap.parse_args();folder=Path(args.out).resolve();scene=json.loads((folder/'layout-scene.json').read_text());mapping=json.loads((folder/'pptx-object-map.json').read_text());target=folder/args.name;target.mkdir() # never overwrite prior verification
 fontdirs=[Path('/System/Library/Fonts/Supplemental'),Path('/System/Library/Fonts'),Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype']
 fontdirs += [Path(p) for p in os.environ.get('PAPERFIGURE_FONT_DIRS','').split(os.pathsep) if p]
 cfg=target/'process-fontconfig.xml';cfg.write_text('<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include>'+''.join('<dir>'+str(p)+'</dir>' for p in fontdirs if p.exists())+'<cachedir>/tmp/paperfigure-fontcache</cachedir></fontconfig>')
 pdf=render(folder/'figure.pptx',target,cfg);doc=fitz.open(pdf);W,H=round(scene['width']),round(scene['height']);png(doc[0],W,H,target/'preview.png')
 report={'engine':'LibreOffice -> PDF -> MuPDF','pptxSHA256':hashlib.sha256((folder/'figure.pptx').read_bytes()).hexdigest(),'pdfSHA256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'requestedFonts':sorted(set(o['font'] for o in scene['primitives'] if o['type']=='text')),'renderedFonts':sorted(set(f[3] for f in doc[0].get_fonts(full=True))),'fontScope':'Conversion-process-only fontconfig; no fonts installed globally','errors':[],'limits':['No interactive Microsoft PowerPoint editing test.','Port attachment and font appearance are verified through this independent rendering engine.']}
 if args.checks:
  with zipfile.ZipFile(folder/'figure.pptx') as z:root=ET.fromstring(z.read('ppt/slides/slide1.xml'))
  native={name_of(o):o for o in root.iter() if o.tag in [P('sp'),P('cxnSp')]}
  textblocks=[m for m in mapping if m['type']=='text-block'];single_groups=[[native[m['name']]] for m in textblocks]
  backgrounds=[isolation_background(group[0]) for group in single_groups]
  textdeck=target/'isolated-text.pptx';make_isolation(folder/'figure.pptx',textdeck,single_groups,backgrounds);textpdf=render(textdeck,target,cfg);tdoc=fitz.open(textpdf);text_checks=[]
  report['limits'].append('Text isolation uses a contrasting matte without changing text styles; composed-slide contrast/occlusion still requires visual review.')
  for index,m in enumerate(textblocks):
   page=tdoc[index];arr=png(page,W,H,target/f'text-{index+1:02}.png');ink=text_ink_mask(arr,backgrounds[index]);yy,xx=np.where(ink)
   if not len(xx):report['errors'].append({'code':'native-text-invisible','id':m['name']});continue
   bbox=[int(xx.min()),int(yy.min()),int(xx.max()-xx.min()+1),int(yy.max()-yy.min()+1)];x,y,w,h=m['bbox'];cx=bbox[0]+bbox[2]/2;cy=bbox[1]+bbox[3]/2
   lines=[line for b in page.get_text('dict')['blocks'] if b['type']==0 for line in b['lines'] if any(s['text'].strip() for s in line['spans'])]
   expected=len(m['sourceTextIds']);observed=len(lines);allowed=3
   if bbox[0]<x-allowed or bbox[1]<y-allowed or bbox[0]+bbox[2]>x+w+allowed or bbox[1]+bbox[3]>y+h+allowed:report['errors'].append({'code':'native-text-overflow','id':m['name'],'ink':bbox,'box':m['bbox']})
   if observed!=expected:report['errors'].append({'code':'native-unexpected-wrap','id':m['name'],'expectedLines':expected,'actualLines':observed})
   if abs(cx-(x+w/2))>3.5 or abs(cy-(y+h/2))>4.0:report['errors'].append({'code':'native-text-not-centered','id':m['name'],'dx':cx-(x+w/2),'dy':cy-(y+h/2)})
   text_checks.append({'id':m['name'],'ink':bbox,'container':m['bbox'],'expectedLines':expected,'actualLines':observed,'dx':cx-(x+w/2),'dy':cy-(y+h/2),'isolationMatte':backgrounds[index]})
  helpers=[native[m['name']] for m in mapping if m['type']=='port-helper'];connectors=[native[m['name']] for m in mapping if m['type']=='connector'];line_deck=target/'isolated-connectors.pptx';make_isolation(folder/'figure.pptx',line_deck,[helpers+connectors]);line_pdf=render(line_deck,target,cfg);ld=fitz.open(line_pdf);arr=png(ld[0],W,H,target/'connectors.png');mask=arr.min(2)<245;edge_checks=[]
  for edge in scene['edges']:
   points=edge['points'];total=hit=0
   for i,(a,b) in enumerate(zip(points,points[1:])):
    length=math.dist(a,b);count=max(2,math.ceil(length/5))
    for k in range(count+1):
     t=k/count;distance_from_start=t*length;distance_from_end=(1-t)*length
     if i==0 and edge.get('startArrow','none')=='open' and distance_from_start<edge['width']*6:continue
     if i==len(points)-2 and edge.get('endArrow','triangle')=='open' and distance_from_end<edge['width']*6:continue
     # Native dashed lines legitimately have white gaps; search along the shaft.
     p=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];radius=2 if not edge.get('dashed') else 6
     total+=1;hit+=int(near(mask,p,radius))
   coverage=hit/total if total else None
   if coverage is not None and coverage<.97:report['errors'].append({'code':'native-route-render-drift','id':edge['id'],'coverage':coverage,'samples':total})
   edge_checks.append({'id':edge['id'],'coverage':coverage,'samples':total,'limits':'Shaft coverage detects route drift; XML separately verifies head/tail/dash/style. Near short arrowheads coverage may be unmeasurable.'})
  report['textChecks']=text_checks;report['edgeChecks']=edge_checks
 report['passed']=not report['errors'];(target/'render-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'out':str(target),'passed':report['passed'],'errors':report['errors']}))
 if not report['passed']:raise SystemExit(2)
if __name__=='__main__':main()
