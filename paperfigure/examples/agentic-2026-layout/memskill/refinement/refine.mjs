import fs from 'node:fs/promises';import path from 'node:path';
import {saveEditableFigure,toEditableSVG} from '../../../../scripts/layout-export.mjs';
import {measureSVG,inspectLayout} from '../../../../scripts/layout-inspect.mjs';
import {fitCenteredBlocks,transformText} from '../../../../scripts/layout-reflow.mjs';
import {auditNativeLayout} from '../../../../scripts/layout-native-audit.mjs';
import {topologyHash,semanticHash} from '../../../../scripts/figure-geometry.mjs';
import {refineIcon,familyOf,TOKEN_SEQUENCES} from './icons.mjs';
const dir=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..'),revision=process.argv[2]??'output-v13';
const original=JSON.parse(await fs.readFile(path.join(dir,'output-v12/layout-scene.json'))),raw=JSON.parse(await fs.readFile(path.join(dir,'source-primitives.json')));let scene=structuredClone(original);const changes=[],regions=[];
scene.groupIcons=true;scene.cleanArrowTips=true;
for(const icon of raw.icons.filter(i=>familyOf(Number(i.id.split('-')[1])))){const old=scene.primitives.filter(p=>p.icon===icon.id&&!scene.removedPrimitiveIds.includes(p.id));if(!old.length)throw Error(`Source icon missing ${icon.id}`);const refined=refineIcon(icon,old);scene.primitives=scene.primitives.filter(p=>p.icon!==icon.id).concat(refined.parts);changes.push({type:'icon',id:icon.id,family:refined.family,module:old[0].owner,region:refined.region,parts:refined.parts.length,...(TOKEN_SEQUENCES[Number(icon.id.split('-')[1])]?{sourceTokenSequence:TOKEN_SEQUENCES[Number(icon.id.split('-')[1])]}:{})});regions.push({id:icon.id,box:refined.region});}
// Keep the original text ledger order; exporters sort painter order per owner.
const bank=scene.modules.find(m=>m.id==='memory-bank');if(bank.anchorShapeId&&!scene.primitives.some(p=>p.id===bank.anchorShapeId))bank.anchorShapeId='icon-6-refined-bridge-and-frame';
// The reset indicator targets the visible top bridge, not empty space above a
// rounded corner of the compound memory-bank illustration.
const reset=scene.edges.find(e=>e.id==='reset-every-trace');reset.to.offset=[136,54];reset.to.surface=[115,54,22,23];reset.to.reason='Visible top boundary of cylinder-to-bank bridge in the compound source illustration.';reset.points=[[510,460],[510,543]];changes.push({type:'arrow-anchor',id:reset.id,from:original.edges.find(e=>e.id===reset.id).points,to:reset.points,reason:reset.to.reason});
// Restore consistent base/subscript size and baseline in the three sequence cells.
for(const i of [3,4,5]){const base=scene.primitives.find(p=>p.id===`math-${i}-base`),sub=scene.primitives.find(p=>p.id===`math-${i}-sub`);for(const [p,size,baseline] of [[base,40,178],[sub,23.2,186]]){const before={size:p.size,positions:p.positions};const ratio=size/p.size;transformText(p,0,0,ratio,p.positions[0]);const dy=baseline-p.positions[0][1];transformText(p,0,dy);changes.push({type:'formula-baseline',id:p.id,before,after:{size:p.size,positions:p.positions}});}}
let measured=await measureSVG(toEditableSVG(scene),scene);
const shiftToCenter=(ids,x,kind)=>{const bs=ids.map(id=>measured.texts[id].bbox),left=Math.min(...bs.map(b=>b.x)),right=Math.max(...bs.map(b=>b.x+b.w)),dx=x-(left+right)/2;for(const id of ids)transformText(scene.primitives.find(p=>p.id===id),dx,0);changes.push({type:kind,ids,dx,targetCenterX:x});};
for(const [i,x] of [[3,839],[4,889],[5,1040]])shiftToCenter([`math-${i}-base`,`math-${i}-sub`],x,'formula-cell-center');
shiftToCenter(['math-8-base','math-8-sub'],434.5,'formula-container-center');
for(const [id,x] of [['text-11',552.5],['text-21',805.5],['text-22',805.5]])shiftToCenter([id],x,'arrow-label-center');
const fitted=await fitCenteredBlocks(scene);scene=fitted.scene;changes.push(...fitted.changes);scene.layoutChanges.push('Source-guided native redraw of 23 non-text icons, retaining all nine-cell trace symbol sequences including blanks; independent icon groups.', 'Sequence formula size/baselines and cell centering normalized; input/memory/update labels centered over their existing shafts.', 'Reset indicator extended to the visible memory-bank bridge boundary. Closed SVG arrowheads use native sizing and clipped underlying shaft tips.');
if(topologyHash(scene)!==topologyHash(original)||semanticHash(scene)!==semanticHash(original))throw Error('Refinement changed scientific topology or text/meaning');
const out=path.join(dir,revision);await saveEditableFigure(scene,out);const qa=await inspectLayout(await fs.readFile(path.join(out,'editable.svg'),'utf8'),scene),native=await auditNativeLayout(scene,await fs.readFile(path.join(out,'figure.pptx')),JSON.parse(await fs.readFile(path.join(out,'pptx-object-map.json'))));
await fs.writeFile(path.join(out,'layout-qa.json'),JSON.stringify(qa,null,2));await fs.writeFile(path.join(out,'native-audit.json'),JSON.stringify(native,null,2));await fs.writeFile(path.join(out,'refinement-changes.json'),JSON.stringify(changes,null,2));await fs.writeFile(path.join(out,'icon-regions.json'),JSON.stringify({icons:regions},null,2));console.log(JSON.stringify({out,icons:regions.length,svg:qa.qa.passed,errors:qa.qa.errors,native:native.passed,nativeErrors:native.errors}));if(!qa.qa.passed||!native.passed)process.exitCode=2;
