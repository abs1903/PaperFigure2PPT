"""Fit the enlarged v2 labels to their actual boxes; preserve failed v2."""
import json
from pathlib import Path
folder=Path(__file__).resolve().parent
s=json.loads((folder/'spec-v2.json').read_text())
s['layout']['nodes']['world']['h']=275
s['layout']['edges']['verify']['fromFraction']=125/275
s['layout']['edges']['latest']['fromFraction']=125/275
s['layout']['nodes']['feedback']['h']=140
s['layout']['edges']['task']['label']={'x':546,'y':320}
for e in s['edges']:
 if e['id']=='retrieved-code':e['label']='Top-k'
for p in s['visual']['artwork']:
 ident=p['id']
 if ident=='curriculum-header':p['h']=140
 if ident=='curriculum-head-rule':p['y']=400
 if ident=='state-header':p['h']=78
 if ident=='state-head-rule':p['y']=778
 if ident=='task-slip':p['h']=80
 if ident=='task-example':p['text']='Wooden pickaxe'
 if ident=='execute':p['y']=797
 if ident=='all-code':p.update(text='All skills',y=860)
 if ident=='primitives':p['y']=923
 if ident=='skill-desc-2':p['text']='Craft pickaxe'
 if ident=='feedback-payload':p['y']=612
(folder/'spec-v3.json').write_text(json.dumps(s,indent=2)+'\n')
