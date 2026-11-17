import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from '../../../paperfigure/node_modules/sharp/lib/index.js';
const root=path.dirname(new URL(import.meta.url).pathname),out=path.join(root,'output-v2');
const items=[
 ['original','Previous accepted Office render',path.join(root,'../2026-11-17-color-study/clip-soft-dual/native-render/preview.png')],
 ['reference','Refined ImageGen reference',path.join(root,'selected-reference.png')],
 ['svg','Native SVG reconstruction',path.join(out,'preview.png')],
 ['office','Actual LibreOffice PPTX render',path.join(out,'native-render/preview.png')],
];
const bytes={},evidence=[];
for(const [id,label,file] of items){
 const data=await fs.readFile(file),meta=await sharp(data).metadata();
 await sharp(data).resize({width:672}).png().toFile(path.join(root,`${id}-paper-width.png`));
 bytes[id]=await sharp(data).resize({width:805,height:489}).png().toBuffer();
 evidence.push({id,label,path:path.relative(root,file),sha256:crypto.createHash('sha256').update(data).digest('hex'),width:meta.width,height:meta.height});
}
async function strip(ids,file){
 const composites=[];
 for(const [i,id] of ids.entries()){
  const label=items.find(x=>x[0]===id)[1];
  const header=Buffer.from(`<svg width="805" height="42"><rect width="805" height="42" fill="#f4f5f3"/><text x="18" y="28" font-family="Arial" font-size="19" fill="#273540">${label}</text></svg>`);
  composites.push({input:header,left:i*805,top:0},{input:bytes[id],left:i*805,top:42});
 }
 await sharp({create:{width:805*ids.length,height:531,channels:3,background:'#fff'}}).composite(composites).png().toFile(path.join(root,file));
}
await strip(['original','reference','office'],'comparison-original-imagegen-office.png');
await strip(['reference','svg','office'],'comparison-reference-svg-office.png');
await fs.writeFile(path.join(root,'comparison-provenance.json'),JSON.stringify({scope:'Diagnostic resizing/contact sheets of unchanged actual artifacts; not a new generated design or an image-similarity acceptance score.',evidence},null,2)+'\n');
