"""Source-supported editorial revision; no API/model/environment execution."""
from pathlib import Path
import json,hashlib,shutil
B=Path(__file__).resolve().parent;case=B.parent
old=json.loads((case/'spec-reviewed.json').read_text())
sources=old['sources'][:]
for id,p in [('curriculum-src','voyager/agents/curriculum.py'),('action-src','voyager/agents/action.py')]:
 sources.append(dict(id=id,kind='code',locator=f"https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/{p}",text=(case/'source'/p).read_text()))
# Released examples provide real skill names and a genuine compositional call.
for name in ['mineWoodLog','craftCraftingTable','craftWoodenPickaxe']:
 for kind,ext in [('code','js'),('description','txt')]:
  path=f'skill_library/trial1/skill/{kind}/{name}.{ext}'
  sources.append(dict(id=name+'-'+kind,kind='code',locator='https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/'+path,text=(B/'source'/path).read_text()))
INK='#14344B';MUTED='#566A77';BLUE='#E8F0F7';BORDER='#587A96';GREEN='#E8F3EF';G_BORDER='#507E71';GRAY='#839099';WHITE='#FFFFFF';NEUTRAL='#F7F9FA'
nodes=[];edges=[];boxes={};styles={};routes={};art=[]
def evidence(src,q):
 assert q in next(x['text'] for x in sources if x['id']==src),(src,q)
 return [dict(source=src,quote=q)]
def node(id,label,role,box,src,q,stroke,header,headerH=100,size=44):
 nodes.append(dict(id=id,label=label,detail='',role=role,status='neutral',phase='inference',evidence=evidence(src,q)))
 x,y,w,h=box;boxes[id]=dict(x=x,y=y,w=w,h=h,fontSize=size)
 styles[id]=dict(fill=WHITE,stroke=stroke,radius=17,strokeWidth=2.2,label=dict(x=22,y=20,w=w-44,align='left',bold=True))
 rect(id+'-header',id,x+1.5,y+1.5,w-3,headerH,header,stroke='none',radius=14,background=True)
 line(id+'-head-rule',id,x,y+headerH,w,0,stroke,1.4)
def a(id,owner,type,x,y,w,h,**kw):art.append(dict(id=id,owner=owner,type=type,x=x,y=y,w=w,h=h,purpose='Source-supported operation, stored field, input example or non-quantitative environment illustration.',**kw))
def rect(id,owner,x,y,w,h,fill,stroke='none',radius=0,background=False):a(id,owner,'rect',x,y,w,h,fill=fill,stroke=stroke,strokeWidth=1.5,radius=radius,textBackground=background)
def line(id,owner,x,y,w,h,color=GRAY,width=1.5):a(id,owner,'line',x,y,w,h,stroke=color,fill='none',strokeWidth=width)
def text(id,owner,t,x,y,w,size=36,bold=False,italic=False,font='Times New Roman',align='left',fill=INK):a(id,owner,'text',x,y,w,size*1.35,text=t,fontSize=size,fontFamily=font,bold=bold,italic=italic,align=align,fill=fill)
def edge(id,fr,to,src,q,label='',kind='data',fp='right',tp='left',ff=.5,tf=.5,via=None,lp=None):
 edges.append(dict(id=id,**{'from':fr,'to':to},label=label,kind=kind,status='neutral',phase='inference',evidence=evidence(src,q)))
 routes[id]=dict(fromPort=fp,toPort=tp,fromFraction=ff,toFraction=tf)
 if via:routes[id]['via']=via
 if lp:routes[id]['label']=dict(x=lp[0],y=lp[1])
node('curriculum','Automatic\ncurriculum','core',[60,190,470,500],'orchestrator','task, context = self.curriculum_agent.propose_next_task(',BORDER,BLUE,headerH=130,size=43)
text('latest','curriculum','Latest observations',86,340,418,38)
text('history','curriculum','Completed / failed tasks',86,397,418,36)
line('curriculum-context-rule','curriculum',86,464,418,0)
text('task-context','curriculum','Example task',86,489,418,38,bold=True)
rect('task-slip','curriculum',86,548,418,103,NEUTRAL,GRAY,8,True)
text('task-example','curriculum','Craft wooden pickaxe',106,578,378,36,italic=True)
node('action','Program generation','core',[700,160,1000,440],'orchestrator','ai_message = self.action_agent.llm(self.messages)',BORDER,BLUE,headerH=105,size=48)
styles['action']['label']['w']=700
text('action-type','action','Action LM',1455,194,215,36,align='right')
for i,t in enumerate(['craftWoodenPickaxe(bot)', 'if (craftingTableCount === 0) {','  await craftCraftingTable(bot);','}']):text('code-'+str(i),'action',t,745,300+i*52,910,36,font='Courier New')
line('code-rule','action',730,514,940,0)
text('retry-limit','action','Refine until success or retry cap',745,538,910,36,italic=True)
node('world','Minecraft','environment',[760,715,460,260],'orchestrator','events = self.env.step(',GRAY,NEUTRAL,headerH=76,size=42)
text('execute','world','Execute JS',958,806,240,36,bold=True)
text('all-code','world','All saved code',958,858,240,36)
text('primitives','world','+ primitives',958,910,240,36)
# Original monochrome pixel vignette: environment cue, not a claimed execution screenshot.
for i in range(6):rect('ground-'+str(i),'world',782+i*24,925,24,14,'#D8DEE2',GRAY)
rect('tree-trunk','world',879,861,20,64,'#C0C9CF',GRAY)
rect('tree-crown-top','world',860,812,58,22,'#D8DEE2',GRAY)
rect('tree-crown','world',848,834,82,28,'#D8DEE2',GRAY)
rect('avatar-head','world',797,859,18,18,'#B3BEC6',GRAY)
rect('avatar-body','world',793,879,22,29,'#D0D7DC',GRAY)
line('avatar-leg-1','world',799,908,-8,17,GRAY,3)
line('avatar-leg-2','world',808,908,10,17,GRAY,3)
line('avatar-arm','world',814,884,20,-11,GRAY,3)
line('pick-handle','world',829,886,16,-25,GRAY,3)
line('pick-head','world',835,858,22,12,GRAY,3)
node('critic','Critic','core',[1370,740,360,180],'orchestrator','success, critique = self.critic_agent.check_task_success(',BORDER,BLUE,headerH=74,size=44)
text('critic-output','critic','Success + critique',1390,842,320,36)
node('skills','Skill library','memory',[1900,170,590,640],'skills','self.skills[program_name] = {',G_BORDER,GREEN,headerH=104,size=47)
# Three concrete author-released skills; no invented function results or fixed library size.
rect('skill-back-1','skills',1960,294,484,375,WHITE,G_BORDER,8,True)
rect('skill-back-2','skills',1948,306,484,375,WHITE,G_BORDER,8,True)
rect('skill-front','skills',1936,318,484,375,WHITE,G_BORDER,8,True)
for i,(name,description) in enumerate([('mineWoodLog','Mine a wood log'),('craftCraftingTable','Craft a crafting table'),('craftWoodenPickaxe','Craft a wooden pickaxe')]):
 y=337+i*114
 text('skill-name-'+str(i),'skills',name,1962,y,432,36,font='Courier New')
 text('skill-desc-'+str(i),'skills',description,1962,y+52,432,36,italic=True)
 if i<2:line('skill-separator-'+str(i),'skills',1962,y+105,432,0,G_BORDER)
text('query-initial','skills','Initial: context',1936,702,510,36)
text('query-refine','skills','Refine: + filtered chat',1936,754,510,36)
node('state','Exploration state','memory',[60,810,470,210],'orchestrator','self.last_events = copy.deepcopy(events)',G_BORDER,GREEN,headerH=74,size=40)
text('state-events','state','Latest events',86,905,418,36)
text('state-history','state','Completed / failed tasks',86,960,418,36)
edge('task','curriculum','action','orchestrator','task=task,\n                    context=context,',ff=.8,tf=270/440,via=[[610,590],[610,430]])
edge('execute','action','world','orchestrator','code = parsed_result["program_code"] + "\\n" + parsed_result["exec_code"]',label='Execute',kind='control',fp='bottom',tp='top',ff=.29,lp=[1030,643])
edge('verify','world','critic','orchestrator','success, critique = self.critic_agent.check_task_success(\n                events=events,',label='Events',tf=.25,ff=70/260,lp=[1240,721])
edge('runtime-feedback','world','action','orchestrator','events=events,\n                code=parsed_result["program_code"],',label='Runtime feedback',kind='feedback',fp='top',tp='bottom',ff=.22,tf=.10,via=[[861.2,640],[800,640]],lp=[540,650])
edge('critique','critic','action','orchestrator','critique=critique,',label='Critique / refine',kind='feedback',fp='top',tp='bottom',tf=.85,lp=[1250,627])
edge('success','critic','skills','orchestrator','if info["success"]:\n                self.skill_manager.add_new_skill(info)',label='Eligible success',kind='feedback',tf=420/640,via=[[1815,830],[1815,590]],lp=[1735,855])
edge('retrieved-code','skills','action','orchestrator','system_message = self.action_agent.render_system_message(skills=skills)',label='Top-k code',fp='left',ff=260/640,tp='right',tf=270/440,lp=[1704,370])
edge('query','action','skills','orchestrator','+ self.action_agent.summarize_chatlog(events)',label='Query',kind='feedback',ff=365/440,tf=355/640,lp=[1744,465])
edge('latest','world','state','orchestrator','self.last_events = copy.deepcopy(events)',label='Events',kind='feedback',fp='left',tp='right',ff=120/260,tf=25/210,lp=[580,775])
edge('outcome','critic','state','orchestrator','self.curriculum_agent.update_exploration_progress(info)',label='Task outcome',kind='feedback',fp='bottom',tp='bottom',via=[[1550,1040],[295,1040]],lp=[1050,978])
edge('next-task','state','curriculum','orchestrator','events=self.last_events,',label='State context',kind='feedback',fp='top',tp='bottom',lp=[345,724])
s=dict(version='1.0',title='Voyager: iterative code refinement and reusable skills',subtitle='Source-supported editorial architecture revision; no runtime experiment.',sources=sources,claims=dict(summary='Automatic curriculum and verified reusable code support iterative embodied exploration.',innovation='The figure emphasizes code refinement and skill reuse as the paper mechanism; it does not claim new scientific results.',baseline=None,scope='Official automatic learn() loop. Exploration state is an explicit grouping of last_events and completed/failed task records; common task arguments and the full runtime-program dependency are locally named rather than all wired.'),assumptions=['Flat fills only. Header tint encodes module class: blue LM computation, green retained state, gray external execution. Body surfaces are white; gray vignette tones depict only illustrative terrain structure.','The program panel shows a verbatim conditional-call excerpt from the released craftWoodenPickaxe implementation, not a fresh generated or executed program. Omitted lines are not a complete executable program.','The task slip is an explicitly marked example matching released craftWoodenPickaxe behavior, not a claim about the task selected in a fresh run.','The library lists three concrete author-released skill code/description examples; it does not assert the full library size or that these three were the actual retrieved set in a measured run.','Environment dependency on all saved programs and fixed primitives is named in the runtime panel; that separate library-to-runtime wire is omitted for reading clarity.','Eligible-success registration still excludes deposit-useless-items tasks; both source and notes retain that implementation condition.','Initial context retrieval and refinement context-plus-filtered-chat retrieval are named locally at the library query interface; a separate curriculum-to-library wire is omitted.', 'A single exploration-state interface groups latest events and task outcome history; this is retained Python state, not an extra language model or a new learning algorithm.'],nodes=nodes,edges=edges,groups=[],layout=dict(canvas=dict(width=2560,height=1080),direction='LR',nodes=boxes,edges=routes),visual=dict(theme='paper',publicationWidthIn=7,minTextPt=7,showTitle=False,showSubtitle=False,showLegend=False,typography=dict(fontFamily='Times New Roman',moduleSize=44,detailSize=36,annotationSize=36,moduleBold=True),nodeGlyphs={},appearances=dict(nodes=styles,edges={e['id']:dict(stroke=INK,strokeWidth=2.8,labelBackground=False) for e in edges}),artwork=art))
for n in s['nodes']:
 if n['id']=='curriculum':n['evidence']+=evidence('craftWoodenPickaxe-description','The function crafts a wooden pickaxe')
 if n['id']=='action':n['evidence']+=evidence('craftWoodenPickaxe-code','if (craftingTableCount === 0) {\n    await craftCraftingTable(bot);\n  }')
 if n['id']=='skills':
  for name in ['mineWoodLog','craftCraftingTable','craftWoodenPickaxe']:n['evidence']+=evidence(name+'-code','async function '+name+'(bot)')
# Remove unused upper wire space while retaining the native shared coordinate system.
for box in s['layout']['nodes'].values():box['y']-=80
for item in s['visual']['artwork']:item['y']-=80
for route in s['layout']['edges'].values():
 if 'via' in route:route['via']=[[x,y-80] for x,y in route['via']]
 if 'label' in route:route['label']['y']-=80
s['layout']['canvas']['height']-=80
(B/'spec.json').write_text(json.dumps(s,indent=2)+'\n')
print('Wrote',len(nodes),'nodes',len(edges),'edges',len(art),'native artwork primitives')
