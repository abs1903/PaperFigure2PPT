import fs from 'node:fs/promises';import path from 'node:path';
import {saveEditableFigure} from '../../../../scripts/layout-export.mjs';
import {inspectLayout} from '../../../../scripts/layout-inspect.mjs';
import {auditNativeLayout} from '../../../../scripts/layout-native-audit.mjs';
import {topologyHash} from '../../../../scripts/figure-geometry.mjs';
import {refineIcon,ICON_FAMILIES} from './icons.mjs';
const dir=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..'),revision=process.argv[2]??'output-v13';
const original=JSON.parse(await fs.readFile(path.join(dir,'output-v12/layout-scene.json'))),scene=structuredClone(original),raw=JSON.parse(await fs.readFile(path.join(dir,'source-primitives.json'))),changes=[];
scene.groupIcons=true;scene.cleanArrowTips=true;
for(const icon of raw.icons.filter(i=>ICON_FAMILIES[Number(i.id.split('-')[1])])){const old=scene.primitives.filter(p=>p.icon===icon.id);if(!old.length)throw Error(`Missing source icon ${icon.id}`);const refined=refineIcon(icon,old);scene.primitives=scene.primitives.filter(p=>p.icon!==icon.id).concat(refined);changes.push({icon:icon.id,family:ICON_FAMILIES[Number(icon.id.split('-')[1])],sourceRegion:icon.box,owner:old[0].owner,previousParts:old.length,nativeParts:refined.length,change:'Source-guided smooth paths replace fragmented automatic color contours. No raster, gradients, or outlined words.'});}
scene.primitives.sort((a,b)=>a.seq-b.seq);scene.labels=scene.primitives.filter(p=>p.type==='text').map(p=>original.labels.find(l=>l.id===p.id)??{id:p.id,owner:p.owner});
if(topologyHash(scene)!==topologyHash(original))throw Error('Icon refinement changed the architecture');
for(const o of original.primitives.filter(p=>!p.icon)){if(JSON.stringify(o)!==JSON.stringify(scene.primitives.find(p=>p.id===o.id)))throw Error(`Unexpected non-icon change ${o.id}`);}
scene.layoutChanges.push('SVG closed arrowheads match native sizing; mask only the shaft under each head to prevent broad round caps protruding through pointed tips. Logical endpoints, style and topology unchanged.');
scene.layoutChanges.push('Refined 12 icon instances in eight source-backed families with smooth native vector parts; grouped independently in SVG/PPTX. Question-mark glyph remains editable text. Module/edge/layout/wording unchanged.');
const out=path.join(dir,revision);await saveEditableFigure(scene,out);const qa=await inspectLayout(await fs.readFile(path.join(out,'editable.svg'),'utf8'),scene),audit=await auditNativeLayout(scene,await fs.readFile(path.join(out,'figure.pptx')),JSON.parse(await fs.readFile(path.join(out,'pptx-object-map.json'))));
await fs.writeFile(path.join(out,'layout-qa.json'),JSON.stringify(qa,null,2));await fs.writeFile(path.join(out,'native-audit.json'),JSON.stringify(audit,null,2));await fs.writeFile(path.join(out,'icon-changes.json'),JSON.stringify(changes,null,2));console.log(JSON.stringify({out,icons:changes.length,qa:qa.qa.passed,errors:qa.qa.errors,native:audit.passed,nativeErrors:audit.errors}));if(!qa.qa.passed||!audit.passed)process.exitCode=2;
