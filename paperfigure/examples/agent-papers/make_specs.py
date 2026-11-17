"""Build three pinned, source-supported agent figure specifications (Python stdlib)."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
INK='#15354A';BLUE='#E8F0F7';BLUE_EDGE='#59778E';STATE='#E8F3EF';STATE_EDGE='#507E71';NEUTRAL='#FAFBFC';GRAY='#839099'
PALETTE={'lm':dict(fill=BLUE,stroke=BLUE_EDGE),'state':dict(fill=STATE,stroke=STATE_EDGE),'external':dict(fill=NEUTRAL,stroke=GRAY)}
class Case:
 def __init__(self,name,title,paper,scope):
  self.b=ROOT/name;self.m=json.loads((self.b/'source-manifest.json').read_text());self.sources=[];self.nodes=[];self.edges=[];self.boxes={};self.styles={};self.routes={};self.art=[];self.categories={};self.scope=scope;self.title=title;self.paper=paper
 def source(self,id,path):
  t=(self.b/'source'/path).read_text();loc=f"https://github.com/{self.m['repo']}/blob/{self.m['commit']}/{path}"
  if path=='hotpotqa_code.py':loc=f"https://github.com/{self.m['repo']}/blob/{self.m['commit']}/hotpotqa.ipynb#code-cells"
  self.sources.append(dict(id=id,kind='code',locator=loc,text=t))
 def ev(self,src,quote):
  assert quote in next(s['text'] for s in self.sources if s['id']==src),(src,quote)
  return [dict(source=src,quote=quote)]
 def node(self,id,label,detail,role,cat,box,src,quote,size=38,labelY=24,detailY=None):
  self.nodes.append(dict(id=id,label=label,detail=detail,role=role,status='neutral',phase='inference',evidence=self.ev(src,quote)))
  self.boxes[id]=dict(zip(['x','y','w','h'],box));self.boxes[id]['fontSize']=size;self.categories[id]=cat
  self.styles[id]=dict(**PALETTE[cat],radius=19,strokeWidth=2,label=dict(x=18,y=labelY,w=box[2]-36,align='center',bold=True),detail=dict(x=18,y=detailY if detailY is not None else box[3]-66,w=box[2]-36,align='center',italic=False))
 def edge(self,id,a,b,src,quote,label='',kind='data',fp='right',tp='left',ff=.5,tf=.5,via=None,lp=None):
  self.edges.append(dict(id=id,**{'from':a,'to':b},label=label,kind=kind,status='neutral',phase='inference',evidence=self.ev(src,quote)))
  r=dict(fromPort=fp,toPort=tp,fromFraction=ff,toFraction=tf)
  if via:r['via']=via
  if lp:r['label']=dict(x=lp[0],y=lp[1])
  self.routes[id]=r
 def text(self,id,owner,text,x,y,w,size=32,italic=False):self.art.append(dict(id=id,owner=owner,type='text',x=x,y=y,w=w,h=size*1.35,text=text,fontSize=size,fontFamily='Times New Roman',italic=italic,fill=INK,purpose='Source-supported local operation/state description, not a new module.'))
 def line(self,id,owner,x,y,w,h):self.art.append(dict(id=id,owner=owner,type='line',x=x,y=y,w=w,h=h,fill='none',stroke=GRAY,strokeWidth=1.4,purpose='Separate native module heading and source-supported contents; no additional scientific edge.'))
 def save(self,w=2240,h=1000,assumptions=None):
  s=dict(version='1.0',title=self.title,subtitle=self.scope,sources=self.sources,claims=dict(summary=self.title,innovation=None,baseline=None,scope=self.scope),assumptions=['A code-derived method overview, not a new method or a runtime reproduction.','Solid colors encode operation classes, not trainability: blue=language-model computation, green=retained state, gray-white=tools/runtime, parameter-free checks and I/O.','Feedback arrows indicate later steps or trials, never model gradient updates.','Layout is original; source-paper graphics are not embedded.']+(assumptions or []),nodes=self.nodes,edges=self.edges,groups=[],layout=dict(canvas=dict(width=w,height=h),direction='LR',nodes=self.boxes,edges=self.routes),visual=dict(theme='paper',publicationWidthIn=7,minTextPt=7,showTitle=False,showSubtitle=False,showLegend=False,typography=dict(fontFamily='Times New Roman',moduleSize=38,detailSize=32,annotationSize=32,moduleBold=True),nodeGlyphs={},appearances=dict(nodes=self.styles,edges={e['id']:dict(stroke=INK,strokeWidth=2.8,labelBackground=False) for e in self.edges}),artwork=self.art))
  (self.b/'spec.json').write_text(json.dumps(s,indent=2)+'\n')
  contract=dict(paper=self.paper,sourceCommit=self.m['commit'],styleReference='../blip2-opt-code/output-solid/figure.png',preserve=['White canvas; native serif labels; semantic color; controlled line weight; no titles/footer/fine print.'],deviations=['Solid fills only; no gradients.','Topology follows this agent implementation, not the VLM reference geometry.'],palette={k:dict(**v,meaning={'lm':'Language-model inference / generation','state':'Retained context or persistent memory; lifetime stated locally','external':'External execution, parameter-free checks and input/output'}[k],nodes=[n for n,c in self.categories.items() if c==k]) for k,v in PALETTE.items()})
  (self.b/'design-contract.json').write_text(json.dumps(contract,indent=2)+'\n')
  print(self.b.name,len(self.nodes),'nodes',len(self.edges),'edges')

def react():
 c=Case('react-hotpotqa','ReAct: interleaved reasoning and tool interaction','https://openreview.net/pdf?id=WE_vluYUL-X','Official HotpotQA notebook route; a bounded single-question interaction, not a learned memory system.')
 c.source('loop','hotpotqa_code.py');c.source('env','wikienv.py')
 c.node('question','Question','','input','external',[170,65,340,110],'loop','question = env.reset(idx=idx)',labelY=27)
 c.node('context','Prompt + history','Within this question','memory','state',[170,270,340,160],'loop','prompt += step_str',size=34,detailY=104)
 c.node('lm','ReAct LM','','core','lm',[650,230,430,240],'loop','thought_action = llm(prompt + f"Thought {i}:", stop=[f"\\nObservation {i}:"])',size=44)
 c.node('action','Parsed action','Tool call / Finish','neutral','external',[1210,270,330,160],'loop','thought, action = thought_action.strip().split(f"\\nAction {i}: ")',size=36,detailY=104)
 c.node('env','Wikipedia tools','Search / Lookup','tool','external',[1660,230,380,240],'env','def step(self, action):',size=38,detailY=155)
 c.node('trace','Step record','','memory','state',[680,650,730,170],'loop','step_str = f"Thought {i}: {thought}\\nAction {i}: {action}\\nObservation {i}: {obs}\\n"',size=36)
 c.node('answer','Answer','Finish terminates','output','external',[1660,650,380,135],'env','self.answer = answer',labelY=15,detailY=78)
 c.text('reason','lm','Reason about evidence',671,328,388,34,True);c.text('choose','lm','Select the next action',671,383,388,34,True);c.line('lm-divider','lm',671,308,388,0)
 c.text('trace-content','trace','Thought  /  Action  /  Observation',700,749,690,34)
 c.edge('e1','question','context','loop','prompt += question + "\\n"',fp='bottom',tp='top')
 c.edge('e2','context','lm','loop','thought_action = llm(prompt + f"Thought {i}:", stop=[f"\\nObservation {i}:"])')
 c.edge('e3','lm','action','loop','thought, action = thought_action.strip().split(f"\\nAction {i}: ")')
 c.edge('e4','action','env','loop','obs, r, done, info = step(env, action[0].lower() + action[1:])',kind='control')
 c.edge('e5','lm','trace','loop','step_str = f"Thought {i}: {thought}\\nAction {i}: {action}\\nObservation {i}: {obs}\\n"',label='Thought + action',fp='bottom',tp='top',tf=185/730,lp=[900,523])
 c.edge('e6','env','trace','loop','obs, r, done, info = step(env, action[0].lower() + action[1:])',label='Observation',fp='bottom',tp='top',ff=.25,tf=.8,via=[[1755,570],[1264,570]],lp=[1450,512])
 c.edge('e7','trace','context','loop','prompt += step_str',label='Append for next step',kind='feedback',fp='left',tp='left',via=[[100,735],[100,350]],lp=[180,674])
 c.edge('e8','env','answer','env','self.answer = answer',label='Finish[answer]',kind='control',fp='bottom',tp='top',ff=.85,tf=.85,lp=[1770,535])
 c.save(h=930,assumptions=['The notebook normally generates Thought and Action in one completion; malformed parsing can trigger a second action-only call, omitted from this overview.','The loop has seven iterations, early Finish, and a forced empty finish[] on exhaustion; this cap is documented rather than depicted as unlimited interaction.','Finish is dispatched through WikiEnv. The figure does not claim every returned answer is correct.'])

def reflexion():
 c=Case('reflexion-hotpotqa','Reflexion: textual feedback across repeated attempts','https://proceedings.neurips.cc/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html','ReactReflectAgent with REFLEXION strategy, same-question HotpotQA retries; exact-match gate, not an LLM evaluator.')
 c.source('agent','hotpotqa_runs/agents.py')
 c.node('question','Question','','input','external',[65,295,260,120],'agent','self.question = question',labelY=30)
 c.node('actor','ReAct actor','Thought + action loop','core','lm',[440,240,380,230],'agent','class ReactReflectAgent(ReactAgent):',size=40,detailY=149)
 c.node('tools','Wikipedia tools','Search / Lookup','tool','external',[990,240,350,230],'agent','self.docstore = DocstoreExplorer(docstore)',detailY=149)
 c.node('check','Exact-match check','Correct: stop','neutral','external',[1530,240,450,230],'agent','return EM(self.answer, self.key)',size=37,detailY=149)
 c.node('reflect','Self-reflection LM','Truncated prior trace','core','lm',[1530,650,450,200],'agent','return format_step(self.reflect_llm(self._build_reflection_prompt()))',size=38,detailY=128)
 c.node('memory','Reflection memory','Same-question retries','memory','state',[900,650,450,200],'agent','self.reflections += [self.prompt_reflection()]',size=38,detailY=128)
 c.text('gate-key','check','Answer vs. key',1550,329,410,32)
 c.edge('e1','question','actor','agent','question = self.question,')
 c.edge('e2','actor','tools','agent','self.docstore.search(argument)',label='Action',kind='control',lp=[850,297])
 c.edge('e3','tools','actor','agent','self.scratchpad += format_step(self.docstore.search(argument))',label='Observation',kind='feedback',fp='top',tp='top',via=[[1165,170],[630,170]],lp=[830,108])
 c.edge('e4','actor','check','agent','if (self.is_finished() or self.is_halted()) and not self.is_correct():',label='Finish / halt',fp='bottom',tp='bottom',ff=.8,tf=.25,via=[[744,540],[1642.5,540]],lp=[1090,484])
 c.edge('e5','check','reflect','agent','if (self.is_finished() or self.is_halted()) and not self.is_correct():',label='Incorrect',kind='control',fp='bottom',tp='top',ff=.75,tf=.75,lp=[1680,553])
 c.edge('e6','actor','reflect','agent','scratchpad = truncate_scratchpad(self.scratchpad, tokenizer=self.enc))',label='Prior trace',fp='bottom',tp='top',ff=.25,tf=.25,via=[[535,600],[1642.5,600]],lp=[1030,604])
 c.edge('e7','reflect','memory','agent','self.reflections += [self.prompt_reflection()]',label='Append',fp='left',tp='right',lp=[1374,691])
 c.edge('e8','memory','actor','agent','reflections = self.reflections_str,',label='Next run(): fresh attempt',kind='feedback',fp='left',tp='left',tf=170/230,via=[[370,750],[370,410]],lp=[450,688])
 c.save(h=960,assumptions=['The caller must invoke run() again; this class does not automatically retry forever.','A stopped or halted incorrect prior trial triggers reflection before the next trial reset. Correct means normalized exact match, not general semantic correctness.','The reflection list is instance-local context across attempts, not a shared vector database.','Self-reflection takes the question and truncated prior scratchpad; it does not read the entire prior reflection list. Common task conditioning is shown once rather than duplicated as every prompt input.','The actor/tool observation loop is within one attempt; the reflection-memory loop connects later attempts.'])

def voyager():
 c=Case('voyager-agent','Voyager: automatic curriculum and reusable executable skills','https://openreview.net/pdf/625b7da181479e7642abce270739da66290f0fa3.pdf','Automatic learn() mode: curriculum, iterative code execution, self-verification and success-conditioned skill registration.')
 c.source('orchestrator','voyager/voyager.py');c.source('skills','voyager/agents/skill.py');c.source('critic','voyager/agents/critic.py')
 c.node('curriculum','Automatic curriculum','State + task history','core','lm',[100,270,420,250],'orchestrator','task, context = self.curriculum_agent.propose_next_task(',detailY=174)
 c.node('action','Action agent','Generate / refine code','core','lm',[920,270,430,250],'orchestrator','ai_message = self.action_agent.llm(self.messages)',size=43,detailY=174)
 c.node('world','Minecraft runtime','Execute JS programs','environment','external',[1640,270,450,250],'orchestrator','events = self.env.step(',size=39,detailY=174)
 c.node('critic','Critic','Success + critique','core','lm',[1640,690,450,210],'orchestrator','success, critique = self.critic_agent.check_task_success(',size=42,detailY=139)
 c.node('skills','Skill library','Code + descriptions','memory','state',[860,55,550,160],'skills','self.skills[program_name] = {',size=39,detailY=98)
 c.edge('e1','curriculum','action','orchestrator','task=task,\n                    context=context,',label='Task + context',lp=[605,334])
 c.edge('e2','action','world','orchestrator','code = parsed_result["program_code"] + "\\n" + parsed_result["exec_code"]',label='JavaScript',kind='control',lp=[1390,334])
 c.edge('e3','world','critic','orchestrator','success, critique = self.critic_agent.check_task_success(\n                events=events,',label='Events + task',fp='bottom',tp='top',lp=[1910,580])
 c.edge('e4','world','action','orchestrator','events=events,\n                code=parsed_result["program_code"],',label='Runtime feedback',kind='feedback',fp='bottom',tp='bottom',ff=.15,tf=.8,via=[[1707.5,575],[1264,575]],lp=[1320,525])
 c.edge('e5','critic','action','orchestrator','critique=critique,',label='Critique',kind='feedback',fp='left',tp='bottom',tf=180/430,via=[[1490,795],[1490,625],[1100,625]],lp=[1180,643])
 c.edge('e6','critic','skills','orchestrator','if info["success"]:\n                self.skill_manager.add_new_skill(info)',label='Reusable success only',kind='feedback',fp='right',tp='top',tf=350/550,via=[[2160,795],[2160,20],[1210,20]],lp=[1720,53])
 c.edge('e7','skills','action','orchestrator','system_message = self.action_agent.render_system_message(skills=skills)',label='Code',fp='bottom',tp='top',ff=360/550,tf=300/430,lp=[1255,220])
 c.edge('e8','curriculum','skills','orchestrator','skills = self.skill_manager.retrieve_skills(query=self.context)',label='Context query',fp='top',tp='left',via=[[310,135]],lp=[480,80])
 c.edge('e9','action','skills','orchestrator','+ self.action_agent.summarize_chatlog(events)',label='Query',kind='feedback',fp='top',tp='bottom',ff=.25,tf=167.5/550,lp=[900,220])
 c.edge('e10','skills','world','orchestrator','programs=self.skill_manager.programs,',label='Saved code + primitives',fp='right',tp='top',via=[[1510,135],[1510,210],[1865,210]],lp=[1550,151])
 c.edge('e11','critic','curriculum','orchestrator','self.curriculum_agent.update_exploration_progress(info)',label='Record task outcome',kind='feedback',fp='bottom',tp='bottom',via=[[1865,965],[310,965]],lp=[550,904])
 c.save(h=1030,assumptions=['The diagram is a method overview, not an exhaustive argument graph. Latest world events also condition curriculum proposal; local State + task history text names this input while only the task-outcome update loop is routed.','Skill-library to action is retrieved top-k code; library to runtime supplies all saved programs plus fixed control primitives. These are different interfaces.','Initial retrieval uses task context; refinement retrieval uses context plus filtered chat-log prerequisite summary. Query arrow abstracts orchestrator/helper work, not an extra LLM query generator.','Only critic-success programs are eligible for skill saving; deposit-useless-items tasks are explicitly excluded by SkillManager.','Critic receives task, context, events and chest observations; inputs shared across the task are not all duplicated as separate arrows.','The next action prompt receives runtime feedback and critique; the refinement loop ends on success or retry limit. Neither world nor critic feedback implies gradient training.'])

if __name__=='__main__':
 react();reflexion();voyager()
