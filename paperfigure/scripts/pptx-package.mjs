// ECMA-376 package/markup repairs for injected native content.
// These checks complement rendering; well-formed XML can still be invalid OOXML.
import {XMLParser} from 'fast-xml-parser';
const list=x=>x===undefined?[]:Array.isArray(x)?x:[x];
export async function finalizePptxPackage(zip){
 const file='[Content_Types].xml';let types=await zip.file(file).async('string');
 if(Object.keys(zip.files).some(p=>p.endsWith('.json'))&&!/Extension="json"/.test(types))types=types.replace('</Types>','<Default Extension="json" ContentType="application/json"/></Types>');
 zip.file(file,types);
 for(const name of Object.keys(zip.files).filter(p=>/^ppt\/slides\/slide\d+\.xml$/.test(p))){
  const xml=await zip.file(name).async('string');zip.file(name,xml.replace(/<a:t\b([^>]*)>/g,(_m,a)=>'<a:t'+a.replace(/\s+xml:space="[^"]*"/g,'')+'>'));
 }
 const p='ppt/presentation.xml';let xml=await zip.file(p).async('string');
 const notes=xml.match(/<p:notesMasterIdLst\b[^>]*>.*?<\/p:notesMasterIdLst>/s)?.[0];
 if(notes){xml=xml.replace(notes,'');xml=xml.replace(/<p:(handoutMasterIdLst|sldIdLst|sldSz|notesSz)\b/,m=>notes+m);}
 zip.file(p,xml);
}
export async function auditPptxPackage(zip){
 const errors=[],parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:''});
 const types=parser.parse(await zip.file('[Content_Types].xml').async('string')).Types;
 const defaults=new Map(list(types.Default).map(x=>[x.Extension.toLowerCase(),x.ContentType]));
 const overrides=new Set(list(types.Override).map(x=>x.PartName.replace(/^\//,'')));
 for(const [name,entry] of Object.entries(zip.files))if(!entry.dir&&name!=='[Content_Types].xml'&&!overrides.has(name)&&!defaults.has(name.split('.').at(-1).toLowerCase()))errors.push({code:'untyped-package-part',part:name});
 for(const name of Object.keys(zip.files).filter(p=>/^ppt\/slides\/slide\d+\.xml$/.test(p)))if(/<a:t\b[^>]*\bxml:space=/.test(await zip.file(name).async('string')))errors.push({code:'invalid-drawingml-text-attribute',part:name});
 const xml=await zip.file('ppt/presentation.xml').async('string'),n=xml.indexOf('<p:notesMasterIdLst'),s=xml.indexOf('<p:sldIdLst');
 if(n>=0&&s>=0&&n>s)errors.push({code:'presentation-child-order',part:'ppt/presentation.xml'});
 return {passed:!errors.length,errors,scope:'Content-type coverage and known schema-invalid DrawingML/presentation constructs; not a complete ECMA schema validator or application edit test.'};
}
