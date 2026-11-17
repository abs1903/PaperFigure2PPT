"""Check retained evidence, frozen baseline and semantic palette (no model execution)."""
from pathlib import Path
import json,hashlib
b=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
m=json.loads((b/'source-manifest.json').read_text())
for p,h in m['files'].items():assert sha(b/'source'/p)==h,p
f=json.loads((b/'initial-figure-freeze.json').read_text())
for p,h in f['artifacts'].items():assert sha(b/p)==h,p
s=json.loads((b/'spec-reviewed.json').read_text())
palette=json.loads((b/'palette-contract.json').read_text())
for cat in palette['categories'].values():
 for n in cat['nodes']:
  st=s['visual']['appearances']['nodes'][n]
  assert st['fill']==cat['fill'] and st['stroke']==cat['stroke'],n
for a in s['visual']['artwork']:
 if a['type']=='rect' and a['id'].startswith(tuple(palette['activationGlyphs']['prefixes'])):assert a['fill']==palette['activationGlyphs']['fill'],a['id']
assert len(s['nodes'])==11 and len(s['edges'])==10
edges={(e['from'],e['to']) for e in s['edges']}
assert ('projection','concat') in edges and ('embeddings','concat') in edges and ('concat','opt') in edges
assert all(not(e['from'] in ['prompt','embeddings'] and e['to']=='qformer') for e in s['edges'])
assert not any(s['visual'][k] for k in ['showTitle','showSubtitle','showLegend'])
print(json.dumps(dict(sourceFilesVerified=len(m['files']),frozenArtifactsVerified=len(f['artifacts']),semanticPalette='pass',scope='Source, frozen artifacts and declared palette only; visual/semantic entailment needs independent review.')))
