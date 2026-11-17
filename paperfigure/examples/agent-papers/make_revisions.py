"""Apply explicit reviewer-requested corrections without replacing frozen candidates."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
b=root/'react-hotpotqa';s=json.loads((b/'spec.json').read_text())
s['layout']['nodes']['lm']['h']=270
s['layout']['edges']['e2']['toFraction']=120/270
s['layout']['edges']['e3']['fromFraction']=120/270
for n in s['nodes']:
 if n['id']=='lm':n['evidence'].append(dict(source='loop',quote='for i in range(1, 8):'))
 if n['id']=='answer':
  n['detail']='Finish or forced empty'
  n['evidence'].append(dict(source='loop',quote='obs, r, done, info = step(env, "finish[]")'))
s['visual']['artwork'].append(dict(id='step-cap',owner='lm',type='text',x=675,y=444,w=380,h=44,text='Up to 7 steps',fontSize=32,fontFamily='Times New Roman',fill='#15354A',purpose='Exact loop bound from for i in range(1, 8); local condition, not a footer.'))
s['assumptions'].append('Independent audit revision: show exact seven-step bound locally and forced-empty Finish in output detail. No author figure had been visually viewed when this correction was authored.')
(b/'spec-reviewed.json').write_text(json.dumps(s,indent=2)+'\n')
print('react-hotpotqa: explicit bounded interaction and forced-empty exit')
b=root/'voyager-agent';s=json.loads((b/'spec.json').read_text())
for n in s['nodes']:
 if n['id']=='curriculum':
  n['detail']='Latest events + history'
  n['evidence'].append(dict(source='orchestrator',quote='events=self.last_events,'))
s['assumptions']=[a.replace('local State + task history text','local Latest events + history text') for a in s['assumptions']]
s['assumptions'].append('Independent review revision names latest events explicitly at the curriculum interface; this wording correction was made after parent inspected author Figure 2. The original frozen candidate is retained.')
(b/'spec-reviewed.json').write_text(json.dumps(s,indent=2)+'\n')
print('voyager-agent: explicit latest-event curriculum conditioning')
