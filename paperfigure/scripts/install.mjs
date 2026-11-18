#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const raw=process.argv.slice(2),link=raw.includes('--link'),args=raw.filter(a=>a!=='--link');
if(args.length>1||args.some(a=>a.startsWith('--'))){console.error('Usage: node scripts/install.mjs [--link] [NEW_DESTINATION]');process.exit(1);}
const source=path.resolve(fileURLToPath(new URL('../',import.meta.url))),destination=path.resolve(args[0]??path.join(process.env.CODEX_HOME??path.join(os.homedir(),'.codex'),'skills','paperfigure'));
// Resolve an existing ancestor without first creating a potentially recursive
// destination. Keep the final component unresolved to inspect existing links.
async function prospectiveParent(file){
  let probe=file;const suffix=[];
  for(;;){
    try{return path.join(await fs.realpath(probe),...suffix.reverse());}
    catch(e){if(e.code!=='ENOENT')throw e;const parent=path.dirname(probe);if(parent===probe)throw e;suffix.push(path.basename(probe));probe=parent;}
  }
}
try{
  const physicalSource=await fs.realpath(source),physicalDestination=path.join(await prospectiveParent(path.dirname(destination)),path.basename(destination));
  if(physicalDestination===physicalSource||physicalDestination.startsWith(physicalSource+path.sep))throw new Error('Install destination must be outside the source skill');
  await fs.mkdir(path.dirname(destination),{recursive:true});
  if(link){
    let existing;try{existing=await fs.lstat(destination);}catch(e){if(e.code!=='ENOENT')throw e;}
    if(existing){
      if(!existing.isSymbolicLink()||await fs.realpath(destination).catch(()=>null)!==await fs.realpath(source))throw Error('Refusing to replace an existing installation: '+destination);
      console.log(`Development link already active: ${destination} -> ${source}`);
    }else{
      // macOS exposes temporary paths through /var -> /private/var. Compute the
      // relative target from physical paths, not mixed lexical/real parents.
      const parent=await fs.realpath(path.dirname(destination)),target=await fs.realpath(source);
      await fs.symlink(path.relative(parent,target),destination,'dir');
      console.log(`Linked development skill: ${destination} -> ${source}`);
    }
    console.log('Source edits are immediately visible through the link. Invoke $paperfigure on your next turn; restart Codex if it does not appear.');
  }else{
  await fs.mkdir(destination); // Refuse to overwrite any existing installation.
  for(const name of await fs.readdir(source)){
    if(['node_modules','output'].includes(name))continue;
    await fs.cp(path.join(source,name),path.join(destination,name),{recursive:true,force:false,errorOnExist:true,filter:p=>!p.split(path.sep).some(x=>['node_modules','output'].includes(x))});
  }
  console.log(`Installed skill files at ${destination}\nInstall dependencies: npm --prefix "${destination}" ci\nThen start a new Codex chat and invoke $paperfigure.`);
  }
}catch(e){console.error(e.message);process.exitCode=1;}
