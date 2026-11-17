"""One source-bound readability revision; no model/image/API calls."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[4]
base=root/'paperfigure/examples/voyager-agent/refinement/spec-final.json'
s=json.loads(base.read_text())
s['visual']['typography'].update(moduleSize=48,detailSize=44,annotationSize=44)
for node in s['layout']['nodes'].values():node['fontSize']=48
s['layout']['nodes']['world']['w']=500
s['visual']['appearances']['nodes']['world']['label']['w']=456
s['layout']['nodes']['state']['h']=240
s['layout']['edges']['latest']['toFraction']=135/240
s['layout']['edges']['execute']['toFraction']=118/500
s['layout']['edges']['runtime-context']['fromFraction']=322/500
s['visual']['appearances']['groups']['refinement-loop'].update(stroke='none',fill='#FBFCFD')
s['visual']['appearances']['nodes']['feedback']['stroke']='none'
# Retain every relation and source quote; remove only repeated presentation labels.
for e in s['edges']:
 if e['id'] in ['query','latest','outcome']:e['label']=''
s['layout']['edges']['retrieved-code']['label']={'x':1738,'y':318}
s['layout']['edges']['refine']['label']={'x':1418,'y':481}
remove={'code-1','code-3','action-type','skill-back-1','skill-back-2'}
art=[]
for p in s['visual']['artwork']:
 if p['id'] in remove:continue
 if p['type']=='text':p.update(fontSize=44,h=59.4)
 ident=p['id']
 if ident=='code-0':p.update(text='craftWoodenPickaxe.js (excerpt)',y=290)
 if ident=='code-2':p.update(text='await craftCraftingTable(bot);',y=375)
 if ident=='world-header':p['w']=497
 if ident=='world-head-rule':p['w']=500
 if ident in ['execute','all-code','primitives']:p.update(x=1010,w=286)
 if ident=='all-code':p['text']='All saved skills'
 if ident=='state-history':p['y']=860
 if ident=='skill-front':p.update(h=420,stroke='none',fill='#F5FAF7')
 if ident.startswith('skill-name-') or ident.startswith('skill-desc-'):
  p.update(x=2008,w=460)
  i=int(ident[-1]);p['y']=(365+130*i) if ident.startswith('skill-name-') else (425+130*i)
 if ident=='skill-separator-0':p.update(x=2008,y=488,w=460)
 if ident=='skill-separator-1':p.update(x=2008,y=618,w=460)
 if ident=='query-initial':p.update(text='Query: task context',y=790)
 if ident=='query-refine':p.update(text='Refine: + chat summary',y=850)
 if ident=='register-label':p.update(text='Store reusable skill',y=930)
 if ident=='critic-output':p.update(text='Critique: refine',y=852)
 if ident=='eligible-port':p.update(y=916)
 if ident=='feedback-payload':p.update(text='Events + critique; bounded retries',x=1040,w=710,y=604)
 if ident=='task-context':p['fontSize']=44
 if ident=='task-example':p.update(x=98,w=412)
 art.append(p)
s['visual']['artwork']=art
# No mechanism, graph endpoint/kind, phase, source, state claim or evidence changed.
old=json.loads(base.read_text())
for key in ['sources','claims','nodes','groups','assumptions']:assert old[key]==s[key],key
for before,after in zip(old['edges'],s['edges']):
 assert {k:v for k,v in before.items() if k!='label'}=={k:v for k,v in after.items() if k!='label'}
Path(__file__).with_name('spec-v2.json').write_text(json.dumps(s,indent=2)+'\n')
