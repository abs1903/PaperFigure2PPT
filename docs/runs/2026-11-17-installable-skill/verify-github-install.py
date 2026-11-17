import subprocess,tempfile,pathlib,json,time,re,hashlib
repo=pathlib.Path(__file__).resolve().parents[3];record=repo/'docs/runs/2026-11-17-installable-skill';sandbox=pathlib.Path(tempfile.mkdtemp(prefix='paperfigure-github-install-'));steps=[]
commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
def run(name,args,expected=0,timeout=180):
 t=time.monotonic();r=subprocess.run(args,cwd=sandbox,capture_output=True,text=True,timeout=timeout);clean=re.sub(r'\x1b\[[0-9;]*[A-Za-z]','',r.stdout+r.stderr);(record/(name+'.txt')).write_text(clean.rstrip()+'\n');s={'step':name,'exitCode':r.returncode,'expectedExitCode':expected,'elapsedSeconds':round(time.monotonic()-t,2)};steps.append(s);print(json.dumps(s),flush=True)
 if r.returncode!=expected:raise RuntimeError(name+' failed: '+clean[-2000:])
 return r
try:
 run('github-cli-install',['npx','--yes','skills@1.9.0','add','abs1903/PaperFigure2PPT','--skill','paperfigure','--agent','codex','--copy','--yes'])
 matches=[p.parent for p in (sandbox/'.agents').rglob('SKILL.md') if 'node_modules'not in p.parts];assert len(matches)==1,matches;skill=matches[0];assert not(skill/'node_modules').exists()
 names=['SKILL.md','package.json','package-lock.json','scripts/bootstrap.mjs','scripts/paperfigure.mjs','scripts/layout-inspect.mjs','references/installation.md','assets/visual-styles.json','assets/styles/provenance.json'];identity={}
 for n in names:
  a=hashlib.sha256((repo/'paperfigure'/n).read_bytes()).hexdigest();z=hashlib.sha256((skill/n).read_bytes()).hexdigest();assert a==z,n;identity[n]=a
 run('github-cold-check',['node',str(skill/'scripts/bootstrap.mjs'),'--check'],expected=1)
 run('github-first-bootstrap',['node',str(skill/'scripts/bootstrap.mjs')])
 run('github-ready-check',['node',str(skill/'scripts/bootstrap.mjs'),'--check'])
 out=sandbox/'native-smoke';run('github-native-export',['node',str(skill/'scripts/paperfigure.mjs'),'build','--spec',str(skill/'examples/physical-vln/spec.json'),'--out',str(out)],timeout=90);assert json.loads((out/'qa.json').read_text())['passed'];assert(out/'figure.pptx').is_file() and(out/'figure.svg').is_file()
 result={'passed':True,'source':'abs1903/PaperFigure2PPT','ref':'main','publishedCommit':commit,'skillsCLI':'1.9.0','privateAuthentication':'Existing Git/GitHub CLI credentials; no credential copied into arguments or logs.','installedSkillDirectory':str(skill),'isolatedProject':str(sandbox),'copiedSkillFileHashes':identity,'steps':steps,'nativeExportMechanicalQA':'pass','globalSkillDirectoryModified':False,'scope':'Actual remote GitHub project-local install with a fresh dependency directory on the existing macOS host; no clean OS or publication-ready figure claim.'}
except Exception as e:result={'passed':False,'error':str(e),'source':'abs1903/PaperFigure2PPT','publishedCommit':commit,'isolatedProject':str(sandbox),'steps':steps}
(record/'github-install-report.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
if not result['passed']:raise SystemExit(1)
