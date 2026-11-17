"""Make the last source-reviewed continuation guard visible on the primary return edge."""
from pathlib import Path
import json
B=Path(__file__).resolve().parent;s=json.loads((B/'spec-v5.json').read_text())
quote='if done:\n                break'
assert quote in next(x['text'] for x in s['sources'] if x['id']=='orchestrator')
for e in s['edges']:
 if e['id']=='refine':
  e['label']='If not done'
  e['evidence'].append(dict(source='orchestrator',quote=quote))
s['layout']['edges']['refine']['label']=dict(x=1435,y=486)
s['assumptions'].append('Source re-review correction: the feedback prompt may be assembled after a successful executed step, but another ActionLM call occurs only if rollout done is false (no success and retry budget remains). Highlighted feedback fields are not exhaustive prompt arguments.')
(B/'spec-final.json').write_text(json.dumps(s,indent=2)+'\n')
