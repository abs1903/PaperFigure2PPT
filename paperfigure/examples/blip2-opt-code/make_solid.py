"""Remove appearance gradients, retaining the reviewed scientific specification."""
from pathlib import Path
import json
b=Path(__file__).resolve().parent
s=json.loads((b/'spec-reviewed.json').read_text())
def solid(x):
 if isinstance(x,dict):
  x.pop('gradient',None)
  for v in x.values():solid(v)
 elif isinstance(x,list):
  for v in x:solid(v)
solid(s)
s['assumptions'].append('User-requested solid fills only: all gradients removed; scientific colors unchanged.')
(b/'spec-solid.json').write_text(json.dumps(s,indent=2)+'\n')
