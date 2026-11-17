"""Resolve the isolated visual review with an explicit refinement loop and registration port."""
from pathlib import Path
import json
B=Path(__file__).resolve().parent
s=json.loads((B/'output-v4/spec.json').read_text())
INK='#14344B';BLUE='#E8F0F7';GREEN='#E8F3EF';GRAY='#839099';NEUTRAL='#F7F9FA'
newboxes={'curriculum':(60,260,480,300),'action':(850,180,880,300),'world':(820,710,460,250),'critic':(1410,760,360,220),'skills':(1960,220,550,810),'state':(60,700,480,210)}
oldboxes={k:dict(v) for k,v in s['layout']['nodes'].items()}
for id,v in newboxes.items():s['layout']['nodes'][id].update(dict(zip(['x','y','w','h'],v)))
art=[]
remove={'latest','history','curriculum-context-rule','code-rule','retry-limit'}
for a in s['visual']['artwork']:
 if a['id'] in remove:continue
 n=a['owner'];old=oldboxes[n];new=s['layout']['nodes'][n];a['x']+=new['x']-old['x'];a['y']+=new['y']-old['y'];art.append(a)
s['visual']['artwork']=art
byart={a['id']:a for a in art}
def patch(id,**kw):byart[id].update(kw)
def text(id,owner,t,x,y,w,size=36,bold=False,font='Times New Roman',italic=False):
 a=dict(id=id,owner=owner,type='text',x=x,y=y,w=w,h=size*1.35,text=t,fontSize=size,fontFamily=font,fill=INK,bold=bold,italic=italic,purpose='Source-supported local operation or condition; native editable text.')
 art.append(a);byart[id]=a
styles=s['visual']['appearances']['nodes']
for id in newboxes:
 x,y,w,h=newboxes[id];style=styles[id]
 style['label']['w']=w-44
 if id in ['curriculum','state','skills']:style['stroke']='none'
 headerH={'curriculum':130,'action':75,'world':76,'critic':74,'skills':80,'state':66}[id]
 patch(id+'-header',x=x+1.5,y=y+1.5,w=w-3,h=headerH)
 patch(id+'-head-rule',x=x,y=y+headerH,w=w)
styles['action']['label'].update(y=14,w=550)
s['layout']['nodes']['action']['fontSize']=44
styles['skills']['label']['y']=16;s['layout']['nodes']['skills']['fontSize']=44
styles['state']['label']['y']=14;s['layout']['nodes']['state']['fontSize']=36
styles['world']['label']['y']=17;s['layout']['nodes']['world']['fontSize']=40
styles['critic']['label']['y']=17;s['layout']['nodes']['critic']['fontSize']=40
for n in s['nodes']:
 if n['id']=='world':n['label']='Execute program'
 if n['id']=='critic':n['label']='Verify task'
patch('task-context',x=86,y=410,w=428,fontSize=38,h=51.3)
patch('task-slip',x=86,y=470,w=428,h=70)
patch('task-example',x=106,y=485,w=388,fontSize=36,h=48.6)
patch('action-type',x=1530,y=198,w=170)
for i in range(4):patch('code-'+str(i),x=890,y=267+i*50,w=800)
patch('code-0',text='craftWoodenPickaxe.js  (excerpt)',fontFamily='Times New Roman',italic=True)
patch('execute',x=1018,y=801,w=240,text='Minecraft')
patch('all-code',x=1018,y=853,w=240)
patch('primitives',x=1018,y=905,w=240)
patch('critic-output',x=1430,y=860,w=320,text='Critique: refine')
text('eligible-port','critic','Eligible success',1430,920,320)
patch('state-events',x=86,y=790,w=428)
patch('state-history',x=86,y=842,w=428,text='Task history')
# Collection gets no heavy enclosing card; state header and stacked native records carry identity.
for id,a in byart.items():
 if a['owner']=='skills' and id not in ['skills-header','skills-head-rule'] and not id.startswith('query-'):a['y']-=22
patch('query-initial',x=1996,y=735,w=480)
patch('query-refine',x=1996,y=787,w=480)
art.append(dict(id='register-port',owner='skills',type='rect',x=1961.5,y=920,w=547,h=69,fill=GREEN,stroke='#507E71',strokeWidth=1.5,radius=9,textBackground=True,purpose='Source-supported add_new_skill registration interface, not a new learned module.'))
text('register-label','skills','Register reusable skill',1980,938,510,36,bold=True)
# Explicit parameter-free prompt assembly joins runtime events and critic feedback.
q='human_message = self.action_agent.render_human_message(\n                events=events,'
assert q in next(x['text'] for x in s['sources'] if x['id']=='orchestrator')
ev=[dict(source='orchestrator',quote=q),dict(source='orchestrator',quote='critique=critique,')]
s['nodes'].append(dict(id='feedback',label='Refine prompt',detail='',role='neutral',status='neutral',phase='inference',evidence=ev))
s['layout']['nodes']['feedback']=dict(x=1020,y=540,w=750,h=125,fontSize=40)
styles['feedback']=dict(fill='#FFFFFF',stroke=GRAY,radius=10,strokeWidth=1.8,label=dict(x=20,y=12,w=710,align='left',bold=True))
text('feedback-payload','feedback','Events + critique; bounded retries',1040,605,710,36)
s['groups']=[dict(id='refinement-loop',label='Iterative code refinement',members=['action','world','critic','feedback'])]
s['visual']['appearances']['groups']={'refinement-loop':dict(fill='#FBFCFD',stroke='#D1DBE3',radius=18,strokeWidth=1.4)}
edges=[e for e in s['edges'] if e['id'] not in ['runtime-feedback','critique']]
for id,fr,to,kind in [('runtime-context','world','feedback','data'),('critic-context','critic','feedback','feedback'),('refine','feedback','action','feedback')]:
 edges.append(dict(id=id,**{'from':fr,'to':to},label='',kind=kind,status='neutral',phase='inference',evidence=ev))
for e in edges:
 e['label']=''
 if e['id']=='task':e['label']='Task + context'
 if e['id']=='retrieved-code':e['label']='Top-k code'
 if e['id']=='query':e['label']='Query'
 if e['id']=='latest':e['label']='Events'
 if e['id']=='outcome':e['label']='Task outcome'
s['edges']=edges
s['layout']['edges']={
 'task':dict(fromPort='right',fromFraction=.8,toPort='left',toFraction=200/300,via=[[650,500],[650,380]],label=dict(x=585,y=320)),
 'execute':dict(fromPort='bottom',fromFraction=.10,toPort='top',toFraction=118/460),
 'verify':dict(fromPort='right',fromFraction=.5,toPort='left',toFraction=75/220),
 'runtime-context':dict(fromPort='top',fromFraction=.7,toPort='bottom',toFraction=122/750),
 'critic-context':dict(fromPort='top',toPort='bottom',toFraction=.76),
 'refine':dict(fromPort='top',toPort='bottom',toFraction=545/880),
 'success':dict(fromPort='right',fromFraction=185/220,toPort='left',toFraction=725/810),
 'retrieved-code':dict(fromPort='left',fromFraction=160/810,toPort='right',toFraction=200/300,label=dict(x=1740,y=320)),
 'query':dict(fromPort='right',fromFraction=260/300,toPort='left',toFraction=220/810,label=dict(x=1790,y=385)),
 'latest':dict(fromPort='left',toPort='right',toFraction=135/210,label=dict(x=615,y=780)),
 'outcome':dict(fromPort='bottom',toPort='bottom',via=[[1590,1040],[300,1040]],label=dict(x=1060,y=981)),
 'next-task':dict(fromPort='top',toPort='bottom')}
# Consistent heavier route weight identifies the primary refinement cycle; side updates are quieter.
primary={'execute','verify','critic-context','refine'}
s['visual']['appearances']['edges']={e['id']:dict(stroke=INK,strokeWidth=4.2 if e['id'] in primary else 2.2,labelBackground=False) for e in edges}
s['layout']['canvas']=dict(width=2560,height=1100)
s['assumptions'] += ['Visual re-review v5: Refine prompt is an explicit parameter-free grouping of the existing render_human_message feedback assembly; it is not an extra LLM. Runtime events and critic feedback join there before the next model call.','A local registration port denotes existing add_new_skill and makes its eligible-success condition visible at the critic output.','The code panel explicitly labels its released conditional-call excerpt, rather than implying a complete generated program.','Line weight separates the primary within-task refinement cycle from secondary state/query/update routes; dashed paths retain their control/temporal meaning.']
(B/'spec-v5.json').write_text(json.dumps(s,indent=2)+'\n')
print('Wrote v5:',len(s['nodes']),'nodes;',len(edges),'edges; central group + prompt interface')
