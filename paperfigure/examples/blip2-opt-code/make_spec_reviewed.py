"""Apply independent-review corrections; retain the frozen code-first spec intact."""
from pathlib import Path
import json
b=Path(__file__).resolve().parent
s=json.loads((b/'spec.json').read_text())
evidence=[dict(source='opt',quote='inputs_embeds = torch.cat([inputs_opt,inputs_embeds],dim=1)')]
s['nodes'].append(dict(id='concat',label='Prefix concatenation',detail='',role='neutral',status='neutral',phase='inference',evidence=evidence))
s['nodes']=[dict(n,detail='Frozen, autoregressive') if n['id']=='opt' else n for n in s['nodes']]
for e in s['edges']:
 if e['id'] in ['e6','e8']:e['to']='concat';e['evidence']=evidence
s['edges'].append(dict(id='e10',**{'from':'concat','to':'opt'},label='',kind='data',status='neutral',phase='inference',evidence=evidence))
s['layout']['nodes']['opt']['h']=200
s['layout']['nodes']['concat']=dict(x=1500,y=500,w=520,h=170,fontSize=32)
s['layout']['edges']['e6']=dict(fromPort='right',toPort='left',toFraction=75/170,via=[[1440,380],[1440,575]])
s['layout']['edges']['e8']=dict(fromPort='right',toPort='bottom',toFraction=380/520,via=[[1880,712.5]])
s['layout']['edges']['e9']=dict(fromPort='right',fromFraction=.5,toPort='left',via=[[2055,360],[2055,430]])
s['layout']['edges']['e10']=dict(fromPort='top',toPort='bottom')
s['visual']['appearances']['nodes']['concat']=dict(fill='#FBFDFE',stroke='#44748D',radius=20,strokeWidth=2.2,label=dict(x=10,y=9,w=500,align='center',bold=False))
s['visual']['appearances']['edges']['e10']=dict(stroke='#0C3150',strokeWidth=2.8,labelBackground=False)
art=[]
for a in s['visual']['artwork']:
 if a['id'] in ['opt-input-strip','decode-mode']:continue
 if a['id'].startswith(('prefix','prompt-emb','concat-divider','prompt-label')):
  a['owner']='concat'
  if a['id'].startswith(('prefix-','prompt-label')) and a['type']=='text':a['y']=599
  elif a['id']=='concat-divider':a['y']=548;a['h']=85
  else:a['y']+=94
 art.append(a)
s['visual']['artwork']=art
s['claims']['scope']+=' Revision makes the source torch.cat explicit after independent review; original pre-author figure remains frozen.'
s['assumptions'].append('Prefix concatenation is a parameter-free source operation, not a learned fusion module. Left-to-right strip order is visual then text.')
# Color encodes parameter state only; activation motifs are neutral, not modality colors.
styles=s['visual']['appearances']['nodes']
for k in ['norm','qformer','projection']:
 styles[k].update(fill='#F7DFAC',gradient=dict(**{'from':'#FFF9EC','to':'#F7DFAC'},direction='vertical'),stroke='#A87519')
for k in ['vision','embeddings','opt']:
 styles[k].update(fill='#DDE8EF',gradient=dict(**{'from':'#F3F7FA','to':'#DDE8EF'},direction='vertical'),stroke='#44748D')
for k in ['prompt','caption','concat']:
 styles[k].update(fill='#FAFBFC',stroke='#73838D')
 styles[k].pop('gradient',None)
for a in s['visual']['artwork']:
 if a['type']=='asset':continue
 if a['id'].startswith('queries-'):
  if a.get('fill') not in [None,'none']:a['fill']='#C89433'
  if 'gradient' in a:a['gradient'].update({'from':'#F8DFAB','to':'#C89433'})
 elif a['type'] in ['rect','ellipse'] and a.get('fill') not in ['none','#FFFFFF']:
  a['fill']='#A8B3BC'
  if 'gradient' in a:a['gradient'].update({'from':'#DCE2E7','to':'#A8B3BC'})
 if a.get('stroke') not in [None,'none','#0C3150']:
  a['stroke']='#44748D' if a['id'].startswith('freeze-') else '#73838D'
s['assumptions'].append('Schematic colors encode source parameter state: blue=frozen modules, gold=default-trainable modules/query parameters, neutral gray=I/O, activations and parameter-free operations. Token activations are not parameters; both prefix types use neutral glyphs. Natural photo colors are input content.')
(b/'spec-reviewed.json').write_text(json.dumps(s,indent=2)+'\n')
