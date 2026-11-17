import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import sharp from 'sharp';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
const root=path.dirname(new URL(import.meta.url).pathname),out=path.resolve(root,process.argv[2]??'output-v10');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const ppt=await fs.readFile(path.join(out,'figure.pptx')),svg=await fs.readFile(path.join(out,'figure.svg'));
const zip=await JSZip.loadAsync(ppt),xml=await zip.file('ppt/slides/slide1.xml').async('string'),inventory=JSON.parse(await fs.readFile(path.join(out,'inventory.json'))),map=JSON.parse(await fs.readFile(path.join(out,'pptx-object-map.json')));
assert.equal(XMLValidator.validate(xml),true);
const parser=new XMLParser({preserveOrder:true,ignoreAttributes:false,attributeNamePrefix:'',parseTagValue:false,trimValues:false});
const all=[];
const textOf=xs=>xs.map(item=>Object.entries(item).map(([k,v])=>k==='#text'?String(v):Array.isArray(v)?textOf(v):'').join('')).join('');
function walk(items,owner=null){for(const item of items)for(const [tag,children] of Object.entries(item)){if(tag===':@')continue;if(['p:sp','p:cxnSp','p:grpSp'].includes(tag)){const nv=children.find(v=>v['p:nvSpPr']||v['p:nvCxnSpPr']||v['p:nvGrpSpPr']);const list=nv?.['p:nvSpPr']??nv?.['p:nvCxnSpPr']??nv?.['p:nvGrpSpPr'];const attr=list?.find(v=>v['p:cNvPr'])?.[':@'];const name=attr?.name;all.push({name,id:Number(attr?.id),tag,owner,text:children.find(v=>v['p:txBody'])?textOf(children.find(v=>v['p:txBody'])['p:txBody']):null});if(Array.isArray(children))walk(children,tag==='p:grpSp'?name:owner);}else if(Array.isArray(children))walk(children,owner);}}
walk(parser.parse(xml));
assert.equal(all.length,map.length);assert.equal(new Set(all.map(o=>o.id)).size,all.length);
for(const m of map){const actual=all.find(o=>o.name===m.name);assert.ok(actual,`Missing ${m.name}`);assert.equal(actual.id,m.id);if(m.type==='text'){assert.equal(actual.tag,'p:sp');assert.equal(actual.text,m.text,`Text changed: ${m.name}`);}if(m.type==='connector')assert.equal(actual.tag,'p:cxnSp');if(m.owner)assert.equal(actual.owner,m.owner);}
assert.equal((xml.match(/<p:pic\b/g)??[]).length,0);assert.equal((xml.match(/<a:gradFill\b/g)??[]).length,0);assert.equal((svg.toString().match(/<image\b/g)??[]).length,0);
const labelCount=all.filter(o=>o.text!==null).length;assert.equal(labelCount,inventory.labels.length);
const structural=JSON.parse(await fs.readFile(path.join(out,'comparison/report.json')));assert.equal(structural.native.errors.length,0);
const [sa,pa]=await Promise.all(['figure.png','pptx-render/figure.png'].map(async p=>sharp(await fs.readFile(path.join(out,p))).removeAlpha().raw().toBuffer({resolveWithObject:true})));
assert.equal(sa.info.width,2061);assert.equal(pa.info.width,2061);assert.equal(sa.info.height,763);assert.equal(pa.info.height,763);
let error=0;for(let i=0;i<sa.data.length;i++)error+=Math.abs(sa.data[i]-pa.data[i]);
const report={referenceSHA256:inventory.reference.sha256,svgSHA256:hash(svg),pptxSHA256:hash(ppt),checks:{wellFormedXML:true,uniqueNativeObjectIDs:true,allNativeObjectsMapped:true,textContentPreserved:true,semanticOwnersPreserved:true,svgNativeInventory:true,sourceDimensionsPreserved:true,noRasterElements:true,noGradients:true},counts:{groups:all.filter(o=>o.tag==='p:grpSp').length,textBoxes:labelCount,connectors:all.filter(o=>o.tag==='p:cxnSp').length,shapes:all.filter(o=>o.tag==='p:sp'&&o.text===null).length,pictures:0},editability:{nativeObjects:all.filter(o=>o.tag!=='p:grpSp').length,nonGroupObjects:all.filter(o=>o.tag!=='p:grpSp').length,ratio:1,definition:'Native editable DrawingML objects / all non-group slide objects; path editability does not imply convenient fine-grained editing.'},svgPptxNormalizedRGBMAE:error/(sa.data.length*255),visualAcceptance:'requires independent source comparison',renderEngine:'LibreOffice headless -> PDF -> pdftoppm; not Microsoft PowerPoint'};
await fs.writeFile(path.join(out,'pptx-native-audit.json'),JSON.stringify(report,null,2)+'\n');
await fs.writeFile(path.join(out,'pptx-native-objects.json'),JSON.stringify(all,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
