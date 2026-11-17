// Evidence bookkeeping for a reader task; scientific grading remains attributed judgment.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
export const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const text=(v,name)=>{if(typeof v!=='string'||!v.trim())throw Error(`Missing ${name}`);};
function unique(items,name){if(!Array.isArray(items)||!items.length)throw Error(`Missing ${name}`);const ids=new Set();for(const x of items){text(x.id,`${name} id`);if(ids.has(x.id))throw Error(`Duplicate ${name} id: ${x.id}`);ids.add(x.id);}return ids;}
export function readerHandoff(questions,image){
 if(questions.version!=='1.0')throw Error('Reader questions require version 1.0');
 unique(questions.questions,'questions');text(questions.audience,'audience');
 if(!Number.isFinite(questions.publicationWidthIn)||questions.publicationWidthIn<=0)throw Error('Positive publication width required');
 if(!/^[a-f0-9]{64}$/.test(image.sha256))throw Error('Image SHA-256 required');
 // Explicit allowlist: never forward expected answers, source paths or a private rubric.
 return {version:'1.0',image:{path:image.path,sha256:image.sha256},audience:questions.audience,publicationWidthIn:questions.publicationWidthIn,
  questions:questions.questions.map(q=>{text(q.prompt,'question prompt');return {id:q.id,prompt:q.prompt};}),
  instructions:'Inspect only the supplied image. Answer each question with visible evidence and uncertainty; distinguish prior familiarity from pixel evidence. Save this observation before opening sources, expected answers or prior reviews. This is qualitative agent reading, not a timed human study.'};
}
export function assessReaderTest(handoff,observation,rubric,grading,{observationSHA256,rubricSHA256}={}){
 const ids=unique(handoff.questions,'questions');unique(observation.answers,'answers');unique(rubric.questions,'rubric');unique(grading.answers,'grades');
 const errors=[];
 if(!rubric.questions.some(q=>q.critical===true))errors.push('At least one critical reader task required');
 if(observation.image?.sha256!==handoff.image.sha256)errors.push('Observation refers to a different image');
 if(!['independent-agent','human'].includes(observation.reviewer?.kind)||!observation.reviewer?.name)errors.push('Reader attribution missing');
 if(!observation.isolation||!observation.priorFamiliarity)errors.push('Reader isolation/familiarity declaration missing');
 if(!['independent-agent','human'].includes(grading.grader?.kind)||!grading.grader?.name)errors.push('Grader attribution missing');
 if(!observationSHA256||grading.observationSHA256!==observationSHA256)errors.push('Grading is stale for this observation');
 if(!rubricSHA256||grading.rubricSHA256!==rubricSHA256)errors.push('Grading is stale for this rubric');
 for(const [name,items] of [['answers',observation.answers],['rubric',rubric.questions],['grades',grading.answers]])if(items.length!==ids.size||items.some(q=>!ids.has(q.id)))errors.push(`Incomplete or foreign ${name}`);
 const outcomes=[];
 for(const q of handoff.questions){
  const a=observation.answers.find(x=>x.id===q.id),r=rubric.questions.find(x=>x.id===q.id),g=grading.answers.find(x=>x.id===q.id);
  if(!a||!r||!g)continue;
  if(!a.answer?.trim()||!a.visibleEvidence?.trim()||typeof a.uncertainty!=='string')errors.push(`Incomplete reader evidence: ${q.id}`);
  if(typeof r.critical!=='boolean'||!r.expected?.trim()||!Array.isArray(r.sourceEvidence)||!r.sourceEvidence.length||r.sourceEvidence.some(e=>typeof e!=='string'||!e.trim()))errors.push(`Incomplete source rubric: ${q.id}`);
  if(!['correct','misread','unclear','unverified'].includes(g.status)||!g.reason?.trim())errors.push(`Incomplete judgment: ${q.id}`);
  outcomes.push({id:q.id,critical:r.critical,status:g.status,reason:g.reason});
 }
 const failed=outcomes.some(q=>q.critical&&['misread','unclear'].includes(q.status));
 const unknown=outcomes.some(q=>q.critical&&q.status==='unverified');
 const status=failed?'fail':errors.length||unknown?'unverified':'pass';
 return {version:'1.0',status,communicationReady:status==='pass',image:handoff.image,reader:observation.reviewer,grader:grading.grader,
  counts:{questions:ids.size,answered:observation.answers.length,correct:outcomes.filter(q=>q.status==='correct').length,criticalFailures:outcomes.filter(q=>q.critical&&['misread','unclear'].includes(q.status)).length},outcomes,errors,
  bindings:{observationSHA256,rubricSHA256},scope:'Source-informed judgments of saved image-only answers. Hashes do not prove isolation, entailment, human comprehension speed or aesthetic superiority.'};
}
export async function checkReaderEvidence(binding,baseDir,imageSHA256){
 if(!binding?.path||!/^[a-f0-9]{64}$/.test(binding.sha256??''))throw Error('Reader report requires path and raw-file SHA-256');
 const file=path.resolve(baseDir,binding.path),bytes=await fs.readFile(file),report=JSON.parse(bytes),errors=[],inputs={};
 if(sha256(bytes)!==binding.sha256)errors.push('Reader report changed');
 if(report.image?.sha256!==imageSHA256)errors.push('Reader report inspected a different target');
 for(const key of ['handoff','observation','rubric','grading']){
  const e=report.evidence?.[key];
  if(!e?.path){errors.push(`Reader ${key} missing or changed`);continue;}
  const data=await fs.readFile(path.resolve(path.dirname(file),e.path));inputs[key]={value:JSON.parse(data),sha256:sha256(data),path:path.resolve(path.dirname(file),e.path)};
  if(inputs[key].sha256!==e.sha256)errors.push(`Reader ${key} missing or changed`);
 }
 if(Object.keys(inputs).length===4){
  const current=assessReaderTest(inputs.handoff.value,inputs.observation.value,inputs.rubric.value,inputs.grading.value,{observationSHA256:inputs.observation.sha256,rubricSHA256:inputs.rubric.sha256});
  if(current.status!==report.status||JSON.stringify(current.outcomes)!==JSON.stringify(report.outcomes))errors.push('Reader report contradicts its evidence');
  const h=inputs.handoff.value;if(sha256(await fs.readFile(path.resolve(path.dirname(inputs.handoff.path),h.image.path)))!==imageSHA256)errors.push('Reader handoff image changed');
 }
 if(report.status!=='pass'||report.communicationReady!==true)errors.push('Critical reader tasks are not passed');
 return {passed:!errors.length,errors,report};
}
async function main(){
 const [mode,...args]=process.argv.slice(2),o={};for(let i=0;i<args.length;i+=2){if(!args[i].startsWith('--')||!args[i+1])throw Error('Expected --key value');o[args[i].slice(2)]=args[i+1];}
 const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
 if(mode==='handoff'){
  const bytes=await fs.readFile(o.image),q=await read(o.questions);const h=readerHandoff(q,{path:'image.png',sha256:sha256(bytes)});
  await fs.mkdir(o.out);await fs.writeFile(path.join(o.out,'image.png'),bytes);await fs.writeFile(path.join(o.out,'handoff.json'),JSON.stringify(h,null,2)+'\n');
  console.log(JSON.stringify({out:o.out,imageSHA256:h.image.sha256,questions:h.questions.length}));
 }else if(mode==='check'){
  const h=await read(o.handoff),obsBytes=await fs.readFile(o.observation),rubricBytes=await fs.readFile(o.rubric);
  const report=assessReaderTest(h,JSON.parse(obsBytes),JSON.parse(rubricBytes),await read(o.grading),{observationSHA256:sha256(obsBytes),rubricSHA256:sha256(rubricBytes)});
  report.evidence={};for(const key of ['handoff','observation','rubric','grading'])report.evidence[key]={path:path.relative(path.dirname(path.resolve(o.out)),path.resolve(o[key])),sha256:sha256(await fs.readFile(o[key]))};
  if(sha256(await fs.readFile(path.resolve(path.dirname(o.handoff),h.image.path)))!==h.image.sha256){report.errors.push('Handoff image changed');report.status='unverified';report.communicationReady=false;}
  await fs.writeFile(o.out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.communicationReady)process.exitCode=2;
 }else throw Error('Use handoff --image PNG --questions JSON --out NEW_DIR; or check --handoff JSON --observation JSON --rubric JSON --grading JSON --out REPORT');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
