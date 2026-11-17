#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {build} from './paperfigure.mjs';
import {readJSON,ROOT,assertSpec} from './spec.mjs';
const cases=[['react-hotpotqa','spec-reviewed.json'],['reflexion-hotpotqa','spec.json'],['voyager-agent','refinement/spec-final.json']];
try{
  if(process.argv.length>3)throw new Error('Usage: node scripts/agent-examples.mjs [NEW_OUTPUT_ROOT]');
  const root=process.argv[2]?path.resolve(process.argv[2]):await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-agent-examples-'));let names=[];
  try{names=await fs.readdir(root);}catch(e){if(e.code!=='ENOENT')throw e;}
  if(names.length)throw new Error('Use a new or empty output root; existing results are never overwritten');
  const specs=cases.map(([name,file])=>[name,assertSpec(readJSON(new URL(`examples/${name}/${file}`,ROOT)))]);
  for(const [name,spec] of specs){
    const r=await build(spec,path.join(root,name));console.log(JSON.stringify({example:name,out:r.dir,mechanicalPassed:r.qa.passed,errors:r.qa.errors.length}));
    if(!r.qa.passed)process.exitCode=2;
  }
}catch(e){console.error(e.message);process.exitCode=1;}
