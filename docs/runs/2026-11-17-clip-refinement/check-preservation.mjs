import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.dirname(new URL(import.meta.url).pathname);
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const old=await read(path.join(root,'../2026-11-17-clip-showcase/output-v2/layout-scene.json'));
const next=await read(path.join(root,'output-v2/layout-scene.json'));
const labelLiterals=s=>s.primitives.filter(p=>p.type==='text').map(p=>p.text).sort();
const relations=s=>s.edges.map(e=>({id:e.id,from:e.from.module,to:e.to.module,endArrow:e.endArrow,dashed:e.dashed??false})).sort((a,b)=>a.id.localeCompare(b.id));
const ledger=await read(path.join(root,'generation-ledger.json'));
const bindings=[];
for(const [file,expected] of Object.entries(ledger.bindings)){
 const bytes=await fs.readFile(path.resolve(root,'../../..',file));
 bindings.push({path:file,unchanged:crypto.createHash('sha256').update(bytes).digest('hex')===expected});
}
const result={
 passed:JSON.stringify(labelLiterals(old))===JSON.stringify(labelLiterals(next))&&JSON.stringify(relations(old))===JSON.stringify(relations(next))&&bindings.every(x=>x.unchanged),
 exactVisibleTextMultisetPreserved:JSON.stringify(labelLiterals(old))===JSON.stringify(labelLiterals(next)),
 semanticRouteOwnersArrowheadsAndReusePreserved:JSON.stringify(relations(old))===JSON.stringify(relations(next)),
 counts:{oldTextLines:labelLiterals(old).length,newTextLines:labelLiterals(next).length,oldRoutes:old.edges.length,newRoutes:next.edges.length},
 bindings,
 scope:'Regression against the previously accepted native CLIP scene. This checks literal text, semantic route owners/direction/reuse and original source-plan file identity; it does not prove source entailment, scientific novelty, image fidelity or aesthetic quality.',
};
await fs.writeFile(path.join(root,'preservation-qa.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
if(!result.passed)process.exitCode=1;
