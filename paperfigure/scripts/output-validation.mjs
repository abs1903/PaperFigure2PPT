// Refresh mechanical evidence without regenerating or accepting the figure.
import fs from 'node:fs/promises';
import path from 'node:path';
import {readJSON, digest} from './spec.mjs';
import {buildScene} from './layout.mjs';
import {runQA} from './qa.mjs';
import {deliveryStatus} from './delivery-status.mjs';

export async function saveDeliveryStatus(dir,recordPath){
  const status=await deliveryStatus(dir,recordPath);
  await fs.writeFile(path.join(dir,'delivery.json'),JSON.stringify(status,null,2)+'\n');
  return status;
}

export async function validateOutput(dir){
  const status=await deliveryStatus(dir);
  const reports={};
  if(status.mode==='design'){
    reports['qa.json']=await runQA(dir,buildScene(readJSON(path.join(dir,'spec.json'))));
  }else{
    const {checkReferenceLayout}=await import('./reference-layout.mjs');
    const {inspectLayout}=await import('./layout-inspect.mjs');
    const {auditNativeLayout}=await import('./layout-native-audit.mjs');
    const scene=readJSON(path.join(dir,'layout-scene.json'));
    const svg=await fs.readFile(path.join(dir,'editable.svg'),'utf8');
    const pptx=await fs.readFile(path.join(dir,'figure.pptx'));
    const map=readJSON(path.join(dir,'pptx-object-map.json'));
    const contract=readJSON(path.join(dir,'reference-contract.json'));
    reports['reference-layout-qa.json']=await checkReferenceLayout(svg,scene,contract,dir);
    reports['layout-qa.json']=await inspectLayout(svg,scene);
    reports['native-audit.json']=await auditNativeLayout(scene,pptx,map);
    if(contract.typography){
      const {auditTypography}=await import('./typography-profile.mjs');
      const profile=readJSON(path.resolve(dir,contract.typography.path));
      reports['typography-style-qa.json']=await auditTypography(scene,svg,pptx,map,profile);
    }
  }
  // Preserve byte-identical reports: a no-op validation must not stale a review.
  for(const [name,report] of Object.entries(reports)){
    let existing;try{existing=readJSON(path.join(dir,name));}catch{}
    if(existing===undefined||digest(existing)!==digest(report))await fs.writeFile(path.join(dir,name),JSON.stringify(report,null,2)+'\n');
  }
  return saveDeliveryStatus(dir);
}
