#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT} from './spec.mjs';

const args=process.argv.slice(2);
if(args.length>1){console.error('Usage: node scripts/install.mjs [NEW_DESTINATION]');process.exit(1);}
const source=path.resolve(fileURLToPath(ROOT)),destination=path.resolve(args[0]??path.join(process.env.CODEX_HOME??path.join(os.homedir(),'.codex'),'skills','paperfigure'));
try{
  if(destination.startsWith(source+path.sep))throw new Error('Install destination must be outside the source skill');
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.mkdir(destination); // Refuse to overwrite any existing installation.
  for(const name of await fs.readdir(source)){
    if(['node_modules','output'].includes(name))continue;
    await fs.cp(path.join(source,name),path.join(destination,name),{recursive:true,force:false,errorOnExist:true,filter:p=>!p.split(path.sep).some(x=>['node_modules','output'].includes(x))});
  }
  console.log(`Installed skill files at ${destination}\nInstall dependencies: npm --prefix "${destination}" ci\nThen start a new Codex chat and invoke $paperfigure.`);
}catch(e){console.error(e.message);process.exitCode=1;}
