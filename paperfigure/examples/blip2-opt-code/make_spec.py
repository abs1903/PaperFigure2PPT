"""Regenerate the code-evidenced BLIP-2 OPT figure specification (stdlib only)."""
from pathlib import Path
import json, shutil, math
base=Path(__file__).resolve().parent
code=(base/'source/lavis/models/blip2_models/blip2_opt.py').read_text()
common=(base/'source/lavis/models/blip2_models/blip2.py').read_text()
config=(base/'source/lavis/configs/models/blip2/blip2_pretrain_opt2.7b.yaml').read_text()
commit='05cb670f47296522e24e7727e366b4a997d28582'
sources=[dict(id=k,kind='code',locator=f'https://github.com/salesforce/LAVIS/blob/{commit}/{p}',text=t) for k,p,t in [('opt','lavis/models/blip2_models/blip2_opt.py',code),('base','lavis/models/blip2_models/blip2.py',common),('config','lavis/configs/models/blip2/blip2_pretrain_opt2.7b.yaml',config)]]
def ev(quote,source='opt'):return [dict(source=source,quote=quote)]
evidence={
'image':ev('image = samples["image"]'), 'vision':ev('image_embeds = self.ln_vision(self.visual_encoder(image))'),
'norm':ev('image_embeds = self.ln_vision(self.visual_encoder(image))'),
'queries':ev('num_query_token: 32','config'),
'qformer':ev('query_embeds=query_tokens,\n                encoder_hidden_states=image_embeds,'),
'projection':ev('inputs_opt = self.opt_proj(query_output.last_hidden_state)'),
'prompt':ev('prompt: ""','config'),
'embeddings':ev('inputs_embeds = self.opt_model.get_input_embeddings()(opt_tokens.input_ids)'),
'opt':ev('inputs_embeds = torch.cat([inputs_opt,inputs_embeds],dim=1)'),
'caption':ev('outputs, skip_special_tokens=True')}
labels={'image':('Image','','input'),'vision':('EVA-CLIP-G\nViT encoder','(frozen)','encoder'),'norm':('Layer\nNorm','learned affine','core'),'queries':('32 Learned Queries','','input'),'qformer':('Q-Former','Query-to-image attention','core'),'projection':('opt_proj','Learned linear','core'),'prompt':('Optional prompt','empty by default','input'),'embeddings':('Tokenize + embed','Frozen OPT table','encoder'),'opt':('OPT-2.7B\nLanguage Model','(frozen)','core'),'caption':('Decoded\ncaption','','output')}
nodes=[dict(id=k,label=l,detail=d,role=r,status='neutral',phase='inference',evidence=evidence[k]) for k,(l,d,r) in labels.items()]
pairs=json.loads((base/'semantic-freeze.json').read_text())['edges']
edges=[dict(id=f'e{i+1}',**{'from':a,'to':b},label='',kind='data',status='neutral',phase='inference',evidence=evidence[b]) for i,(a,b) in enumerate(pairs)]
boxes={'image':[30,290,200,180],'vision':[280,285,250,190],'norm':[580,305,180,150],'queries':[810,65,340,130],'qformer':[810,280,340,200],'projection':[1205,310,185,140],'prompt':[30,655,420,115],'embeddings':[620,645,380,135],'opt':[1500,260,520,370],'caption':[2090,355,120,150]}
navy='#0C3150'; teal='#168F8B'; blue='#44748D'; amber='#BD811B'
def grad(a,b):return {'from':a,'to':b,'direction':'vertical'}
def pos(x,y,w,bold=False,**kw):return dict(x=x,y=y,w=w,align='center',bold=bold,**kw)
def style(fill,stroke,radius=18,**kw):return dict(fill=fill,gradient=grad('#FFFFFF',fill),stroke=stroke,radius=radius,strokeWidth=2.2,**kw)
styles={
'image':dict(fill='none',stroke='none',hideLabel=True),
'vision':style('#DDE8EF',blue,label=pos(10,44,230,True),detail=pos(10,140,230)),
'norm':style('#E2F4EB',teal,label=pos(8,14,164),hideDetail=True),
'queries':dict(fill='none',stroke='none',label=pos(0,8,340,italic=True)),
'qformer':style('#F7DFAC',amber,label=pos(12,40,316,True),detail=pos(10,112,320,italic=True)),
'projection':style('#E1F3E9',teal,label=pos(8,18,169,italic=True),hideDetail=True),
'prompt':style('#F1F7F3',teal,label=pos(80,14,328,True),detail=pos(80,61,328)),
'embeddings':style('#E0EBF1',blue,label=pos(10,24,360,True),detail=pos(10,78,360)),
'opt':style('#DDE8EF',blue,radius=26,label=pos(20,23,480,True),detail=pos(20,116,480)),
'caption':dict(fill='#FFFFFF',stroke=teal,radius=15,strokeWidth=2.2,hideLabel=True)}
art=[]
def a(id,owner,type,x,y,w,h,**kw):art.append(dict(id=id,owner=owner,type=type,x=x,y=y,w=w,h=h,purpose='Code-supported notation; token glyphs with ellipses are schematic, not literal counts.',**kw))
def rect(id,owner,x,y,w,h,fill,stroke='none',radius=0,gradient=None):
 kw=dict(fill=fill,stroke=stroke,radius=radius,strokeWidth=1.7)
 if gradient:kw['gradient']=gradient
 a(id,owner,'rect',x,y,w,h,**kw)
def line(id,owner,x,y,w,h,stroke=navy,width=2):a(id,owner,'line',x,y,w,h,stroke=stroke,fill='none',strokeWidth=width)
def txt(id,owner,text,x,y,w,size=32,italic=False,bold=False):a(id,owner,'text',x,y,w,size*1.35,text=text,fontSize=size,fontFamily='Times New Roman',italic=italic,bold=bold,fill=navy)
def tokens(id,owner,x,y,color,w=210,h=55):
 for i in range(6):
  xx=x+i*26+(42 if i>=3 else 0)
  rect(f'{id}-{i}',owner,xx,y,20,h,color,radius=7,gradient=grad('#CAEEEB' if color==teal else '#D7EAF7',color))
 for i in range(3):a(f'{id}-dot-{i}',owner,'ellipse',x+83+i*11,y+h/2,5,5,fill=color,stroke='none')
a('image-photo','image','asset',30,290,200,180,asset='assets/illustrations/llava-c-source.png',crop=dict(x=80,y=200,w=206,h=186,sourceWidth=2120,sourceHeight=742))
tokens('queries','queries',875,127,teal)
txt('norm-affine','norm','affine',596,409,148)
txt('linear-detail','projection','linear',1220,393,155)
# Literal prefix ordering is an internal OPT input interface, not an invented learned module.
rect('opt-input-strip','opt',1520,440,480,118,'#FBFDFE',blue,20)
tokens('prefix','opt',1545,454,teal,h=38)
tokens('prompt-emb','opt',1783,454,'#8CBFE0',h=38)
line('concat-divider','opt',1760,453,0,85,blue,2)
txt('prefix-label','opt','Visual (32)',1532,505,220)
txt('prompt-label','opt','Prompt',1770,505,230)
txt('decode-mode','opt','Autoregressive generation',1525,576,470,italic=True)
# Photo, chat and document are endpoint motifs; all text and geometry stay native.
rect('chat','prompt',51,682,44,35,'#FFFFFF',teal,5)
for i in range(3):a(f'chat-dot-{i}','prompt','ellipse',59+i*11,694,5,5,fill=teal,stroke='none')
line('chat-tail','prompt',60,717,-7,12,teal)
rect('fold-mask','caption',2178,355,32,32,'#FFFFFF')
line('fold','caption',2178,355,32,32,teal);line('fold-bottom','caption',2178,387,32,0,teal);line('fold-left','caption',2178,355,0,32,teal)
for i,w in enumerate([85,85,71,52]):rect(f'caption-line-{i}','caption',2107,403+i*22,w,7,'#9DBFD0',radius=3)
txt('caption-label-1','caption','Decoded',2070,525,160)
txt('caption-label-2','caption','caption',2070,572,160)
# Freeze marks are small native line glyphs, not raster icons.
for owner,cx,cy in [('vision',405,310)]:
 for i in range(3):
  t=i*math.pi/3;dx=12*math.cos(t);dy=12*math.sin(t)
  line(f'freeze-{owner}-{i}',owner,cx-dx,cy-dy,2*dx,2*dy,'#1685A4',2)
layouts={k:dict(zip(['x','y','w','h'],v)) for k,v in boxes.items()}
layouts['qformer']['fontSize']=43
layouts['vision']['fontSize']=32
routes={f'e{i+1}':dict(fromPort='right',toPort='left') for i in range(len(edges))}
routes['e4']=dict(fromPort='bottom',toPort='top')
routes['e6']=dict(fromPort='right',toPort='left',toFraction=120/370)
routes['e7']=dict(fromPort='right',toPort='left',fromFraction=57.5/115,toFraction=67.5/135)
routes['e8']=dict(fromPort='right',toPort='left',toFraction=300/370,via=[[1440,712.5],[1440,560]])
routes['e9']=dict(fromPort='right',toPort='left',fromFraction=170/370)
s=dict(version='1.0',title='BLIP-2 OPT generation: code reconstruction',subtitle='Official LAVIS source, OPT generation branch',sources=sources,claims=dict(summary='32 learned queries extract image-conditioned representations; projected visual prefixes condition a frozen OPT causal LM.',innovation='The Q-Former bridges a frozen vision encoder and frozen language model; this diagram represents the released OPT generation path, not all BLIP-2 stages.',baseline='Pretrained EVA-CLIP-G and OPT-2.7B.',scope='LAVIS pretrain_opt2.7b generate() only. Source-level topology and freezing; no weight or training execution.'),assumptions=['The optional prompt defaults to an empty string; tokenizer special tokens may remain even for empty text.','Query and embedding icons are symbolic with ellipses, not exact glyph counts.','LayerNorm affine, query/Q-Former/projection trainability follows source defaults, not an observed optimizer run.','The illustrative cat is an independent generated asset, not a paper evaluation example.','Imagegen supplies only styling; the frozen node and edge inventory is authoritative.'],nodes=nodes,edges=edges,groups=[],layout=dict(canvas=dict(width=2240,height=850),direction='LR',nodes=layouts,edges=routes),visual=dict(theme='paper',publicationWidthIn=7,minTextPt=7,showTitle=False,showSubtitle=False,showLegend=False,typography=dict(fontFamily='Times New Roman',moduleSize=36,detailSize=32,annotationSize=32,moduleBold=False),nodeGlyphs={},appearances=dict(nodes=styles,edges={e['id']:dict(stroke=navy,strokeWidth=2.8,labelBackground=False) for e in edges}),artwork=art))
(base/'spec.json').write_text(json.dumps(s,indent=2)+'\n')
