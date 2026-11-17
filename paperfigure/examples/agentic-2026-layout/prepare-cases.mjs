import fs from 'node:fs/promises';import path from 'node:path';
import {saveEditableFigure} from '../../scripts/layout-export.mjs';
const root=path.dirname(new URL(import.meta.url).pathname);
for(const name of ['agemem','memskill']){
 const dir=path.join(root,name),s=JSON.parse(await fs.readFile(path.join(dir,'source-primitives.json')));
 const scene={version:'1.0',title:name,width:Math.ceil(s.width),height:Math.ceil(s.height),source:s.source,modules:[{id:'source-context',box:[0,0,Math.ceil(s.width),Math.ceil(s.height)],container:true,routingObstacle:false}],primitives:s.primitives.map(o=>({...o,owner:'source-context'})),labels:s.primitives.filter(o=>o.type==='text').map(o=>({id:o.id,owner:'source-context'})),edges:[],exceptions:[]};
 await saveEditableFigure(scene,path.join(dir,'recovered-source'));
 await fs.writeFile(path.join(dir,'source-text-ledger.txt'),s.primitives.filter(o=>o.type==='text').map(o=>`${o.id}\t${o.box.map(v=>v.toFixed(1)).join(',')}\t${o.text}`).join('\n')+'\n');
 console.log(name,scene.primitives.length);
}
