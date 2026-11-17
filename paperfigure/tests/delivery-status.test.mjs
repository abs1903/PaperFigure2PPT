import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {digest} from '../scripts/spec.mjs';
import {deliveryStatus,REVIEW_CHECKS,REVIEW_ARTIFACTS,REFERENCE_ARTIFACTS,fileHash} from '../scripts/delivery-status.mjs';
import {visualReviewStatus} from '../scripts/visual-review.mjs';
import {referenceDeliveryStatus} from '../scripts/reference-layout.mjs';

// Synthetic policy fixtures only: these records are not actual figure acceptance.
async function fixture(t,mode){
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-delivery-policy-'));
  t.after(()=>fs.rm(dir,{recursive:true,force:true}));
  const write=async(name,value)=>{
    const file=path.join(dir,name);await fs.mkdir(path.dirname(file),{recursive:true});
    await fs.writeFile(file,JSON.stringify(value));
  };
  const artifacts=mode==='design'?REVIEW_ARTIFACTS:REFERENCE_ARTIFACTS;
  for(const name of artifacts)await write(name,{synthetic:true});
  await write('reference.png',{syntheticReference:true});
  const reference={path:'reference.png',sha256:await fileHash(path.join(dir,'reference.png'))};
  if(mode==='design'){
    await write('qa.json',{passed:true});
    await write('rendered-pptx/render-report.json',{routeAlignmentPassed:true,pdfCheck:{rendered:true,routeAlignmentPassed:true,textComplete:true}});
  }else{
    const scene={labels:[]},contract={version:'1.0',mode,reference};
    await write('layout-scene.json',scene);await write('reference-contract.json',contract);
    await write('reference-layout-qa.json',{passed:true,contractSHA256:digest(contract),sceneSHA256:digest(scene),svgSHA256:await fileHash(path.join(dir,'editable.svg'))});
    await write('layout-qa.json',{qa:{passed:true}});await write('native-audit.json',{passed:true});
    await write('native-render/render-qa.json',{passed:true,pptxSHA256:await fileHash(path.join(dir,'figure.pptx')),pdfSHA256:await fileHash(path.join(dir,'native-render/figure.pdf'))});
  }
  const hashes={};for(const name of artifacts)hashes[name]=await fileHash(path.join(dir,name));
  const record={reviewer:{kind:'independent-agent',name:'Synthetic policy fixture only'},verdict:'accept',checks:Object.fromEntries(REVIEW_CHECKS.map(k=>[k,'pass'])),reference,artifacts:hashes};
  await write('visual-review.json',record);
  return {dir,write,record};
}

for(const mode of ['design','reconstruct']){
  test(`${mode}: shared contract and compatibility entrypoints agree`,async t=>{
    const {dir}=await fixture(t,mode),status=await deliveryStatus(dir);
    assert.equal(status.version,'1.0');assert.equal(status.mode,mode);
    assert.equal(status.deliveryReady,true);assert.equal(status.visualAcceptance,'independently-accepted');
    assert.equal(status.mechanicalPassed,true);
    assert.deepEqual(Object.values(status.validation).map(s=>s.status),['pass','pass','pass']);
    assert.deepEqual(await visualReviewStatus(dir),status);
    if(mode==='reconstruct')assert.deepEqual(await referenceDeliveryStatus(dir),status);
  });
  test(`${mode}: absent or invalid review cannot hide mechanical/render evidence`,async t=>{
    const {dir,write}=await fixture(t,mode);
    for(const record of [null,[]]){
      await write('visual-review.json',record);const status=await deliveryStatus(dir);
      assert.equal(status.deliveryReady,false);assert.equal(status.visualAcceptance,'unreviewed');
      assert.equal(status.validation.mechanical.status,'pass');assert.equal(status.validation.render.status,'pass');
    }
    await fs.unlink(path.join(dir,'visual-review.json'));
    assert.equal((await deliveryStatus(dir)).validation.review.status,'unverified');
  });
  test(`${mode}: missing renders and mechanical failures remain separate from review acceptance`,async t=>{
    const {dir,write}=await fixture(t,mode);
    await fs.unlink(path.join(dir,mode==='design'?'rendered-pptx/render-report.json':'native-render/render-qa.json'));
    const missing=await deliveryStatus(dir);assert.equal(missing.deliveryReady,false);assert.equal(missing.validation.render.status,'unverified');
    await write(mode==='design'?'qa.json':'layout-qa.json',mode==='design'?{passed:false}:{qa:{passed:false}});
    const failed=await deliveryStatus(dir);assert.equal(failed.validation.mechanical.status,'fail');assert.equal(failed.mechanicalPassed,false);
  });
  test(`${mode}: user rejection, stale artifacts and review criteria block acceptance`,async t=>{
    const {dir,write,record}=await fixture(t,mode);
    await write('user-feedback.json',{verdict:'revise'});
    let status=await deliveryStatus(dir);assert.equal(status.visualAcceptance,'needs-revision');assert.equal(status.deliveryReady,false);
    await fs.unlink(path.join(dir,'user-feedback.json'));
    record.checks.composition='fail';await write('visual-review.json',record);
    assert.equal((await deliveryStatus(dir)).validation.review.status,'fail');
    record.checks.composition='pass';await write('visual-review.json',record);
    await fs.appendFile(path.join(dir,'figure.pptx'),'changed');
    status=await deliveryStatus(dir);assert.equal(status.deliveryReady,false);assert.ok(status.reasons.some(r=>r.includes('Stale or missing artifact review: figure.pptx')));
    if(mode==='reconstruct')assert.equal(status.validation.render.status,'fail');
  });
  test(`${mode}: CLI persists the shared status and rejects missing acceptance`,async t=>{
    const {dir}=await fixture(t,mode),cli=new URL('../scripts/paperfigure.mjs',import.meta.url).pathname;
    let result=spawnSync(process.execPath,[cli,'review-status','--out',dir],{encoding:'utf8',timeout:10000});
    assert.equal(result.status,0,result.stderr);
    assert.deepEqual(JSON.parse(result.stdout),JSON.parse(await fs.readFile(path.join(dir,'delivery.json'))));
    await fs.unlink(path.join(dir,'visual-review.json'));
    result=spawnSync(process.execPath,[cli,'review-status','--out',dir],{encoding:'utf8',timeout:10000});
    assert.equal(result.status,2);assert.equal(JSON.parse(result.stdout).visualAcceptance,'unreviewed');
  });
}

test('reconstruction mode survives a missing contract and requires typography for text',async t=>{
  const {dir,write}=await fixture(t,'reconstruct');
  await write('layout-scene.json',{labels:[{id:'native-label'}]});
  let status=await deliveryStatus(dir);assert.equal(status.mechanicalPassed,false);
  assert.ok(status.reasons.includes('Frozen typography profile missing'));
  await fs.unlink(path.join(dir,'reference-contract.json'));
  status=await deliveryStatus(dir);assert.equal(status.mode,'reconstruct');assert.equal(status.deliveryReady,false);
});
