import subprocess,tempfile,pathlib,json,time,re,os,zipfile
import shutil
repo=pathlib.Path(__file__).resolve().parents[3];record=repo/'docs/runs/2026-11-17-installable-skill';sandbox=pathlib.Path(tempfile.mkdtemp(prefix='paperfigure-install-'));(record/'sandbox.json').write_text(json.dumps({'path':str(sandbox),'scope':'Project-local CLI installation only; no global skill directory modified.'},indent=2)+'\n');steps=[]
def run(name,args,cwd=sandbox,expected=0,timeout=150,input=None,env=None):
 t=time.monotonic();r=subprocess.run(args,cwd=cwd,env=env,capture_output=True,text=True,input=input,timeout=timeout);clean=re.sub(r'\x1b\[[0-9;]*[A-Za-z]','',r.stdout+r.stderr);(record/(name+'.txt')).write_text(clean);s={'step':name,'exitCode':r.returncode,'expectedExitCode':expected,'elapsedSeconds':round(time.monotonic()-t,2)};steps.append(s);print(json.dumps(s),flush=True)
 if r.returncode!=expected:raise RuntimeError(name+' failed: '+clean[-1800:])
 return r
try:
 clean=sandbox/'source-repo';clean.mkdir()
 names=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z','--','paperfigure'],cwd=repo).decode().split('\0')
 for name in sorted(set(n for n in names if n)):
  target=clean/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(repo/name,target)
 run('local-cli-install',['npx','--yes','skills@1.9.0','add',str(clean),'--skill','paperfigure','--agent','codex','--copy','--yes'])
 matches=[p.parent for p in (sandbox/'.agents').rglob('SKILL.md') if 'node_modules'not in p.parts];assert len(matches)==1,matches;skill=matches[0];assert not(skill/'node_modules').exists(),'CLI must not copy development dependencies'
 run('cold-bootstrap-check',['node',str(skill/'scripts/bootstrap.mjs'),'--check'],expected=1)
 run('first-bootstrap',['node',str(skill/'scripts/bootstrap.mjs')],timeout=180)
 run('ready-bootstrap-check',['node',str(skill/'scripts/bootstrap.mjs'),'--check'])
 for f in ['references/installation.md','assets/visual-styles.json','assets/palette-families.json','assets/styles/clip-soft-dual.png']:assert (skill/f).is_file(),f
 run('installed-cli-help',['node',str(skill/'scripts/paperfigure.mjs'),'help'])
 out=sandbox/'design-output';run('installed-native-export',['node',str(skill/'scripts/paperfigure.mjs'),'build','--spec',str(skill/'examples/physical-vln/spec.json'),'--out',str(out)],timeout=120)
 for f in ['figure.pptx','figure.svg','figure.pdf','preview.png','qa.json']:assert(out/f).is_file(),f
 qa=json.loads((out/'qa.json').read_text());assert qa['passed']
 with zipfile.ZipFile(out/'figure.pptx')as z:xml=z.read('ppt/slides/slide1.xml').decode();assert '<p:sp>'in xml or '<p:sp 'in xml
 env=dict(os.environ);env['PAPERFIGURE_PLAYWRIGHT']=str(skill/'node_modules/playwright/index.mjs')
 js='''const {browserRuntime}=await import(MODULE_URL);const rt=await browserRuntime();const browser=await rt.chromium.launch({headless:true,executablePath:rt.executablePath});try{const p=await browser.newPage();await p.setContent('<svg xmlns="http://www.w3.org/2000/svg"><text id="probe" x="10" y="35" font-size="24">PaperFigure install</text></svg>');const box=await p.evaluate(()=>{const b=document.getElementById('probe').getBBox();return {width:b.width,height:b.height}});if(box.width<30||box.height<5)throw Error('Missing actual browser text bounds');console.log(JSON.stringify({playwrightEntry:process.env.PAPERFIGURE_PLAYWRIGHT,chromium:rt.executablePath,measuredText:box,scope:'Installed Playwright module with an available host browser; no repository node_modules used.'}));}finally{await browser.close()}'''.replace('MODULE_URL',json.dumps((skill/'scripts/layout-inspect.mjs').as_uri()))
 run('installed-browser-measurement',['node','--input-type=module','-'],input=js,env=env,timeout=60)
 result={'passed':True,'skillsCLI':'1.9.0','skillDirectory':str(skill),'isolatedProject':str(sandbox),'steps':steps,'freshNodeDependencies':True,'nodePackagesFromInstalledSkill':True,'nativeExportQA':'pass','actualBrowserMeasurement':'pass','globalSkillInstall':'not performed','figureDeliveryReady':'not asserted; smoke artifact is unreviewed','environmentScope':'Fresh skill directory on the current macOS host; existing fonts and browser reused, not a clean OS image.'}
except Exception as e:result={'passed':False,'error':str(e),'isolatedProject':str(sandbox),'steps':steps}
(record/'local-install-report.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
if not result['passed']:raise SystemExit(1)
