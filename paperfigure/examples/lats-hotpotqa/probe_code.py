"""Offline probes of extracted upstream definitions, never import the agent.
All model/environment callbacks are local stubs; no API or network execution.
"""
from pathlib import Path
from types import SimpleNamespace
from functools import partial
import ast,math,json
R=Path(__file__).resolve().parent;source=R/'source/official/hotpot';ns={'np':SimpleNamespace(sqrt=math.sqrt,log=math.log),'logging':SimpleNamespace(info=lambda *a:None,basicConfig=lambda **k:None,INFO=20),'partial':partial};results=[]
def extract(file,names,inside=None):
 tree=ast.parse((source/file).read_text());body=tree.body
 if inside:body=next(n for n in body if isinstance(n,ast.ClassDef) and n.name==inside).body
 for n in body:
  if isinstance(n,(ast.FunctionDef,ast.ClassDef)) and n.name in names:
   if isinstance(n,ast.FunctionDef):n.decorator_list=[]
   exec(compile(ast.Module(body=[n],type_ignores=[]),str(source/file),'exec'),ns)
def check(name,f):
 f();results.append({'test':name,'passed':True})
extract('lats.py',{'Node','node_trajectory_to_text','collect_trajectory','collect_all_nodes','get_unique_trajectories','get_samples','generate_new_states','rollout','backpropagate','lats_search'})
extract('hotpotqa.py',{'value_prompt_wrap'},inside='HotPotQATask')
N=ns['Node'];ns.update(gpt=lambda *a,**k:['stub'],failed_trajectories=[],reflection_map=[])
ns.update(value_prompt_reasoning_feedback='FEEDBACK:{trajectories}:{input}',value_prompt_reasoning_feedback_short='FEEDBACK_SHORT:{input}',value_prompt_feedback='FEEDBACK2:{input}',value_prompt_reasoning='BASE:{input}',max_token_length=4000,get_token_length=len)
def critic_overwrite():
 p=ns['value_prompt_wrap']('Question: Q','child', ['failed'],[{'reflection':'DO_NOT_IGNORE'}]);assert p.startswith('BASE:') and 'DO_NOT_IGNORE' not in p
check('value prompt discards passed reflection feedback',critic_overwrite)
def backup():
 root=N(None,'Q');child=N(None,'Q',root);child.is_terminal=True;child.reward=0;ns['backpropagate'](child,.6);assert child.value==-1 and root.value==.6 and (root.visits,child.visits)==(1,1)
check('backup changes visits/value, not neural weights',backup)
def reflection_guard(count,expected):
 calls=[];ns['failed_trajectories']=[{'final_answer':str(i),'trajectory':''} for i in range(count)];ns['reflection_map']=[]
 task=SimpleNamespace(generate_self_reflection=lambda z,x:calls.append(z) or [{'reflection':'r'}]*len(z),cot_prompt_wrap=lambda x,y,r:'p')
 ns['get_samples'](task,'Q','',1,'cot',None);assert bool(calls)==expected
check('reflection guard zero failures',lambda:reflection_guard(0,False));check('reflection guard one distinct failure',lambda:reflection_guard(1,True));check('reflection guard four distinct failures',lambda:reflection_guard(4,False))
saved_samples=ns['get_samples']
def shared_execution():
 calls=[];env=SimpleNamespace();ns['env']=env;ns['get_samples']=lambda *a,**k:['Thought 1: a\nAction: Search[A]','Thought 1: b\nAction: Lookup[key]'];ns['step']=lambda e,a:(calls.append((id(e),a)) or f'obs{len(calls)}',0,False,{})
 children=ns['generate_new_states'](N(None,'Q'),SimpleNamespace(prompt_sample='cot'),None,2);assert len(children)==2 and len(set(c[0] for c in calls))==1 and children[0].state['observation']=='obs1' and children[1].state['observation']=='obs2'
ns['generate_prompt']=lambda n:'Q';check('sibling candidates step one shared environment object',shared_execution);ns['get_samples']=saved_samples
saved_gen=ns['generate_new_states']
def rollout_absolute():
 calls=[];node=N(None,'Q');node.depth=4;ns['generate_new_states']=lambda *a:calls.append(a) or []
 value,end=ns['rollout'](node,SimpleNamespace(),None,0,max_depth=4);assert not calls and end is node and value==0
check('rollout horizon is absolute depth, not four extra steps',rollout_absolute)
def first_terminal():
 node=N(None,'Q');node.depth=1;wrong=N(None,'Q',node);wrong.is_terminal=True;wrong.reward=0;right=N(None,'Q',node);right.is_terminal=True;right.reward=1;ns['generate_new_states']=lambda *a:[wrong,right]
 value,end=ns['rollout'](node,SimpleNamespace(),None,0,max_depth=4);assert value==0 and end is wrong
check('rollout returns first terminal even when a later terminal succeeds',first_terminal);ns['generate_new_states']=saved_gen
def reset_lifetime():
 ns['reflection_map']=['old'];ns['failed_trajectories']=['old'];ns['env']=SimpleNamespace(reset=lambda **k:'Question: Q');ns['lats_search'](SimpleNamespace(backend='stub',temperature=0,log='unused'),None,0,iterations=0,to_print=False);assert ns['reflection_map']==[] and ns['failed_trajectories']==[]
check('entry resets failed traces and reflections per question',reset_lifetime)
report={'passed':True,'tests':results,'count':len(results),'scope':'Extracted original function definitions with stubbed model/environment callbacks; no upstream module import, models, API, live Wikipedia or task performance test.'};target=R/'offline-probes.json';target.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'passed':True,'tests':len(results),'report':str(target)}))
