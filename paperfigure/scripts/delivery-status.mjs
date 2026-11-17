// Shared validation and delivery policy. Route-specific evidence stays explicit.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const REVIEW_CHECKS=['referenceComparison','semanticFidelity','composition','modalityIdentity','typography','phaseClarity','editability','noTitleOrFooter','officeRender'];
export const REVIEW_ARTIFACTS=['spec.json','figure.svg','figure.pptx','figure.pdf','figure.png','rendered-pptx/figure.png'];
export const REFERENCE_ARTIFACTS=['editable.svg','figure.pptx','preview.png','layout-scene.json','reference-contract.json','reference-layout-qa.json','layout-qa.json','native-audit.json','native-render/figure.pdf','native-render/preview.png','native-render/render-qa.json'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const fileHash=async p=>hash(await fs.readFile(p));

function stage(){
  return {status:'pass',reasons:[]};
}
function issue(check,reason,status='fail'){
  check.reasons.push(reason);
  if(check.status!=='fail')check.status=status;
}
async function readJSON(dir,name){return JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));}

async function designEvidence(dir,validation){
  const {mechanical,render}=validation;
  try{if(!(await readJSON(dir,'qa.json')).passed)issue(mechanical,'Mechanical QA failed');}
  catch{issue(mechanical,'Mechanical QA missing or unreadable','unverified');}
  try{
    const report=await readJSON(dir,'rendered-pptx/render-report.json');
    if(report.status==='unverified')issue(render,'Independent Office/PDF verification unverified','unverified');
    else {
      if(!report.routeAlignmentPassed)issue(render,'Independent Office route check failed');
      if(!report.pdfCheck?.rendered||!report.pdfCheck.routeAlignmentPassed||!report.pdfCheck.textComplete)issue(render,'Independent PDF render/text verification missing or failed');
    }
  }catch{issue(render,'Independent Office/PDF verification missing','unverified');}
}

async function reconstructionEvidence(dir,contract,record,validation){
  const read=f=>readJSON(dir,f);
  const mechanical=validation.mechanical;
  if(contract){
    try{
      if(contract.mode!=='reconstruct'||contract.version!=='1.0')issue(mechanical,'Invalid reconstruction contract mode/version');
      const refHash=await fileHash(path.resolve(dir,contract.reference.path));
      if(refHash!==contract.reference.sha256)issue(mechanical,'Frozen target PNG changed');
      let reviewedTarget=false;
      try{reviewedTarget=!!record?.reference?.path&&record.reference.sha256===refHash&&await fileHash(path.resolve(dir,record.reference.path))===refHash;}catch{}
      if(!reviewedTarget)issue(validation.review,'Review does not inspect the selected target PNG',record?'fail':'unverified');
      const binding=await read('reference-layout-qa.json');
      if(!binding.passed||binding.contractSHA256!==hash(JSON.stringify(contract))||
        binding.svgSHA256!==await fileHash(path.join(dir,'editable.svg'))||
        binding.sceneSHA256!==hash(JSON.stringify(await read('layout-scene.json'))))
        issue(mechanical,'Reference geometry check failed or is stale');
    }catch(e){issue(mechanical,'Reference binding unavailable: '+e.message,'unverified');}
  }
  try{
    const scene=await read('layout-scene.json');
    if(contract?.visualContract){
      const {loadVisualContract,auditVisualContract}=await import('./visual-contract.mjs');
      const c=(await loadVisualContract(contract.visualContract,dir)).contract;
      const current=auditVisualContract(scene,c),saved=await read('visual-contract-qa.json');
      if(c.coverage!=='complete'||!current.passed||hash(JSON.stringify(current))!==hash(JSON.stringify(saved)))issue(mechanical,'Shared visual contract failed, incomplete or stale');
    }
    if(scene.labels?.length&&!contract?.typography)issue(mechanical,'Frozen typography profile missing','unverified');
    if(contract?.typography){
      const profileBytes=await fs.readFile(path.resolve(dir,contract.typography.path));
      const profile=JSON.parse(profileBytes),q=await read('typography-qa.json');
      const render=await read('native-render/render-qa.json');
      if(hash(profileBytes)!==contract.typography.sha256||!q.passed||q.renderedFontCoverage!==true||
        q.profileDigest!==hash(JSON.stringify(profile))||
        q.svgSHA256!==await fileHash(path.join(dir,'editable.svg'))||
        q.pptxSHA256!==await fileHash(path.join(dir,'figure.pptx'))||
        q.renderReportDigest!==hash(JSON.stringify(render)))
        issue(mechanical,'Typography profile, actual-font verification or style comparison failed/stale');
    }
  }catch(e){issue(mechanical,'Typography/visual contract verification unavailable: '+e.message,'unverified');}

  try{
    if(!(await read('layout-qa.json')).qa?.passed||!(await read('native-audit.json')).passed)
      issue(validation.mechanical,'Measured layout/native editability failed');
  }catch{issue(validation.mechanical,'Measured layout/native evidence missing','unverified');}
  try{
    const r=await read('native-render/render-qa.json');
    if(!r.passed||r.pptxSHA256!==await fileHash(path.join(dir,'figure.pptx'))||r.pdfSHA256!==await fileHash(path.join(dir,'native-render/figure.pdf')))
      issue(validation.render,'Actual Office render failed or is stale');
  }catch{issue(validation.render,'Actual Office evidence missing','unverified');}
}

async function reviewEvidence(dir,recordPath,artifacts,check){
  let record;
  try{
    record=JSON.parse(await fs.readFile(recordPath,'utf8'));
    if(!record||typeof record!=='object'||Array.isArray(record))throw Error('Invalid review record');
  }
  catch{record=undefined;issue(check,'No readable independent visual-review record','unverified');}
  if(record){
    if(!['independent-agent','human'].includes(record.reviewer?.kind)||!record.reviewer?.name)issue(check,'Reviewer identity/kind missing');
    if(record.verdict!=='accept')issue(check,'Independent reviewer has not accepted this candidate',record.verdict==='unverified'?'unverified':'fail');
    for(const key of REVIEW_CHECKS)if(record.checks?.[key]!=='pass')issue(check,`Unpassed review criterion: ${key}`,record.checks?.[key]==='fail'?'fail':'unverified');
    for(const name of artifacts){
      try{if(record.artifacts?.[name]!==await fileHash(path.join(dir,name)))issue(check,`Stale or missing artifact review: ${name}`);}
      catch{issue(check,`Missing inspected artifact: ${name}`,'unverified');}
    }
    if(!record.reference?.path||!record.reference?.sha256)issue(check,'Reference comparison evidence missing','unverified');
    else try{if(await fileHash(path.resolve(dir,record.reference.path))!==record.reference.sha256)issue(check,'Reference changed since review');}
    catch{issue(check,'Inspected reference is missing','unverified');}
  }
  try{if((await readJSON(dir,'user-feedback.json')).verdict==='revise')issue(check,'The user rejected this candidate; scoped agent acceptance cannot override user feedback');}
  catch(e){if(e.code!=='ENOENT')issue(check,'User feedback is unreadable','unverified');}
  return record;
}

// Hashes establish file identity, not honest inspection or reviewer independence.
export async function deliveryStatus(dir,recordPath=path.join(dir,'visual-review.json'),{mode}={}){
  if(!mode){
    try{await fs.access(path.join(dir,'reference-contract.json'));mode='reconstruct';}
    catch(e){
      if(e.code!=='ENOENT')throw e;
      try{await fs.access(path.join(dir,'layout-scene.json'));mode='reconstruct';}
      catch(e){if(e.code!=='ENOENT')throw e;mode='design';}
    }
  }
  if(!['design','reconstruct'].includes(mode))throw Error('Unknown delivery mode: '+mode);
  const validation={mechanical:stage(),render:stage(),review:stage()};
  let contract;
  if(mode==='reconstruct'){
    try{contract=await readJSON(dir,'reference-contract.json');}
    catch{issue(validation.mechanical,'Frozen reference contract missing or unreadable','unverified');}
  }
  let readerBinding;
  try{readerBinding=await readJSON(dir,'reader-test-binding.json');}catch(e){if(e.code!=='ENOENT')issue(validation.review,'Unreadable reader-test binding','unverified');}
  const artifacts=mode==='design'?[...REVIEW_ARTIFACTS]:[...REFERENCE_ARTIFACTS,...(contract?.typography?['typography-profile.json','typography-style-qa.json','typography-qa.json']:[]),...(contract?.visualContract?[contract.visualContract.path,'visual-contract-qa.json']:[])];
  if(readerBinding){artifacts.push('reader-test-binding.json');if(typeof readerBinding.path==='string')artifacts.push(readerBinding.path);}
  const record=await reviewEvidence(dir,recordPath,artifacts,validation.review);
  if(readerBinding){
    try{const {checkReaderEvidence}=await import('./reader-test.mjs');const imageHash=mode==='reconstruct'?await fileHash(path.resolve(dir,contract.reference.path)):await fileHash(path.join(dir,'figure.png'));const q=await checkReaderEvidence(readerBinding,dir,imageHash);if(!q.passed)issue(validation.review,'Reader test: '+q.errors.join('; '));}
    catch(e){issue(validation.review,'Reader evidence unavailable: '+e.message,'unverified');}
  }
  if(mode==='design')await designEvidence(dir,validation);
  else await reconstructionEvidence(dir,contract,record,validation);
  const reasons=Object.values(validation).flatMap(check=>check.reasons);
  const deliveryReady=Object.values(validation).every(check=>check.status==='pass');
  return {version:'1.0',mode,mechanicalPassed:validation.mechanical.status==='pass',validation,
    deliveryReady,visualAcceptance:validation.review.status==='pass'?'independently-accepted':validation.review.status==='fail'?'needs-revision':'unreviewed',
    reviewer:record?.reviewer,reasons,
    scope:mode==='design'?'Source-grounded design and declared reference comparison; not venue certification or user approval':'Fidelity to the selected target plus declared deviations; not venue certification or user approval'};
}

export const referenceDeliveryStatus=(dir,recordPath)=>deliveryStatus(dir,recordPath,{mode:'reconstruct'});
