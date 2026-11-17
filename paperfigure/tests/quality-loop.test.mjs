import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import JSZip from 'jszip';
import {readerHandoff,assessReaderTest,checkReaderEvidence,sha256} from '../scripts/reader-test.mjs';
import {assertVisualContract,auditVisualContract,loadVisualContract} from '../scripts/visual-contract.mjs';
import {digest,readJSON} from '../scripts/spec.mjs';
import {designPrompt} from '../scripts/design-prompt.mjs';
import {toNativePPTX} from '../scripts/layout-export.mjs';
import {auditPptxPackage,finalizePptxPackage} from '../scripts/pptx-package.mjs';
import {deliveryStatus} from '../scripts/delivery-status.mjs';

const hash='a'.repeat(64),other='b'.repeat(64);
function readerFixture(){
 const handoff=readerHandoff({version:'1.0',audience:'Researcher',publicationWidthIn:7,questions:[{id:'q',prompt:'What enters the model?',expected:'PRIVATE'}],rubric:'PRIVATE'}, {path:'image.png',sha256:hash});
 const observation={reviewer:{kind:'independent-agent',name:'reader'},isolation:'Image-only',priorFamiliarity:'Declared',image:{sha256:hash},answers:[{id:'q',answer:'Only visible inputs',visibleEvidence:'One input arrow',uncertainty:''}]};
 const rubric={questions:[{id:'q',critical:true,expected:'Visible inputs only',sourceEvidence:['method:1-3']}]};
 const grading={grader:{kind:'independent-agent',name:'assessor'},observationSHA256:hash,rubricSHA256:other,answers:[{id:'q',status:'correct',reason:'Recovers input scope'}]};
 return {handoff,observation,rubric,grading,binding:{observationSHA256:hash,rubricSHA256:other}};
}
test('reader handoff does not disclose a private answer or rubric',()=>{
 const {handoff}=readerFixture();assert.ok(!JSON.stringify(handoff).includes('PRIVATE'));assert.deepEqual(handoff.questions,[{id:'q',prompt:'What enters the model?'}]);
});
test('critical ambiguity blocks communication acceptance; unknown remains unknown',()=>{
 const f=readerFixture();assert.equal(assessReaderTest(f.handoff,f.observation,f.rubric,f.grading,f.binding).status,'pass');
 for(const [value,expected] of [['unclear','fail'],['misread','fail'],['unverified','unverified']]){f.grading.answers[0].status=value;assert.equal(assessReaderTest(f.handoff,f.observation,f.rubric,f.grading,f.binding).status,expected);}
});
test('stale images, stale grades, omitted questions and no critical question cannot pass',()=>{
 for(const mutate of [f=>{f.observation.image.sha256=other;},f=>{f.grading.observationSHA256=other;},f=>{f.grading.answers.push({id:'foreign',status:'correct',reason:'x'});},f=>{f.rubric.questions[0].critical=false;}]){
  const f=readerFixture();mutate(f);assert.equal(assessReaderTest(f.handoff,f.observation,f.rubric,f.grading,f.binding).communicationReady,false);
 }
});
function scene(){return {version:'1.0',width:300,height:120,modules:[{id:'a',box:[20,20,80,60]},{id:'b',box:[200,20,80,60]}],
 primitives:[{id:'frame',owner:'a',type:'path',seq:0,box:[20,20,80,60],commands:[['M',20,20],['L',100,20],['L',100,80],['L',20,80],['Z']],fill:'#EAF0F6',stroke:'#4F7391',width:2},
 {id:'label',owner:'a',type:'text',seq:1,text:'Encoder',font:'Arial',size:20,bold:false,fill:'#273540',box:[25,35,70,25],positions:[[25,55]]}],labels:[{id:'label',owner:'a'}],
 edges:[{id:'ab',from:{module:'a',side:'right'},to:{module:'b',side:'left'},points:[[100,50],[200,50]],stroke:'#4F7391',width:2,startArrow:'none',endArrow:'triangle'}]};}
function contract(){return {version:'1.0',coverage:'complete',canvas:{width:300,height:120,publicationWidthIn:7},typography:{body:{font:'Arial',size:20,bold:false}},colors:{ink:{value:'#273540',meaning:'Text'},image:{value:'#4F7391',meaning:'Image role'},pale:{value:'#EAF0F6',meaning:'Image surface'}},
 modules:[{id:'a',box:[20,20,80,60]},{id:'b',box:[200,20,80,60]}],labels:[{id:'label',owner:'a',text:'Encoder',typography:'body',color:'ink'}],shapes:[{id:'frame',owner:'a',fill:'pale',stroke:'image'}],edges:[{id:'ab',from:{module:'a'},to:{module:'b'},color:'image',endArrow:'triangle'}]};}
test('shared visual values detect geometry, typography, paint, labels and direction drift',()=>{
 const c=contract();assert.equal(auditVisualContract(scene(),c).passed,true);
 for(const mutate of [s=>{s.width+=100;},s=>{s.primitives[1].font='Helvetica';},s=>{s.primitives[0].fill='#FF0000';},s=>{s.primitives[1].text='Other';},s=>{s.edges[0].to.module='a';},s=>{s.modules[0].box[0]+=30;},s=>{s.primitives.push({...s.primitives[0],id:'unbound'});}]){const s=scene();mutate(s);assert.equal(auditVisualContract(s,c).passed,false);}
 assert.throws(()=>assertVisualContract({...c,geometryTolerancePx:500}),/tolerance/);
});
test('contract identity tolerates JSON formatting but rejects changed values',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-contract-'));
 try{const c=contract(),binding={path:'contract.json',sha256:digest(c)};await fs.writeFile(path.join(dir,binding.path),JSON.stringify(c,null,2));assert.deepEqual((await loadVisualContract(binding,dir)).contract,c);c.typography.body.size=23;await fs.writeFile(path.join(dir,binding.path),JSON.stringify(c));await assert.rejects(loadVisualContract(binding,dir),/changed/);}finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('prompt uses the same design roles and rejects a changed bound contract',()=>{
 const spec=readJSON(new URL('../examples/lats-hotpotqa/spec-figure.json',import.meta.url));
 const brief=structuredClone(readJSON(new URL('../examples/lats-hotpotqa/design-study/design-brief-v2.json',import.meta.url))),c=contract();
 c.canvas.publicationWidthIn=brief.publicationWidthIn;brief.visualContract={path:'visual.json',sha256:digest(c)};
 assert.ok(designPrompt(spec,brief,undefined,c).includes('Arial, 20px, regular'));
 c.colors.image.value='#000000';assert.throws(()=>designPrompt(spec,brief,undefined,c),/stale/);
});
test('native package declares JSON and avoids schema-invalid DrawingML text/order',async()=>{
 const p=await toNativePPTX(scene()),z=await JSZip.loadAsync(p.bytes);assert.equal((await auditPptxPackage(z)).passed,true);
 let t=await z.file('[Content_Types].xml').async('string');z.file('[Content_Types].xml',t.replace(/<Default Extension="json"[^>]*\/>/,''));
 z.file('ppt/slides/slide1.xml',(await z.file('ppt/slides/slide1.xml').async('string')).replace('<a:t>','<a:t xml:space="preserve">'));
 const bad=await auditPptxPackage(z);assert.ok(bad.errors.some(e=>e.code==='untyped-package-part'));assert.ok(bad.errors.some(e=>e.code==='invalid-drawingml-text-attribute'));
 await finalizePptxPackage(z);assert.equal((await auditPptxPackage(z)).passed,true);
});

test('bound reader evidence is recomputed and rejects a modified saved observation',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-reader-evidence-'));
 try{
  const f=readerFixture(),image=Buffer.from('Synthetic identity fixture'),imageHash=sha256(image);f.handoff.image.sha256=imageHash;f.observation.image.sha256=imageHash;
  await fs.writeFile(path.join(dir,'image.png'),image);
  const write=async(name,x)=>{const bytes=Buffer.from(JSON.stringify(x));await fs.writeFile(path.join(dir,name+'.json'),bytes);return {path:name+'.json',sha256:sha256(bytes)};};
  const h=await write('handoff',f.handoff),a=await write('observation',f.observation),r=await write('rubric',f.rubric);
  f.grading.observationSHA256=a.sha256;f.grading.rubricSHA256=r.sha256;const g=await write('grading',f.grading);
  const report=assessReaderTest(f.handoff,f.observation,f.rubric,f.grading,{observationSHA256:a.sha256,rubricSHA256:r.sha256});report.evidence={handoff:h,observation:a,rubric:r,grading:g};
  const binding=await write('report',report);assert.equal((await checkReaderEvidence(binding,dir,imageHash)).passed,true);
  f.observation.answers[0].answer='Changed later';await write('observation',f.observation);assert.equal((await checkReaderEvidence(binding,dir,imageHash)).passed,false);
  f.observation.answers[0].answer='Only visible inputs';await write('observation',f.observation);await fs.writeFile(path.join(dir,'image.png'),'Changed image');assert.equal((await checkReaderEvidence(binding,dir,imageHash)).passed,false);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('both delivery routes retain a failed/missing bound reader test as unverified',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-reader-gate-'));
 try{
  await fs.writeFile(path.join(dir,'reader-test-binding.json'),JSON.stringify({path:'missing-report.json',sha256:hash}));
  for(const mode of ['design','reconstruct']){const q=await deliveryStatus(dir,undefined,{mode});assert.equal(q.deliveryReady,false);assert.ok(q.validation.review.reasons.some(x=>x.includes('Reader evidence unavailable')));}
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
