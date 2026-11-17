import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from './paperfigure.mjs';
import {readJSON,ROOT} from './spec.mjs';

for(const name of ['llava-paper','tool-memory-agent','physical-vln']) {
  const base=new URL(`examples/${name}/`,ROOT),out=fileURLToPath(new URL('output/',base));
  const r=await build(readJSON(new URL('spec.json',base)),out,{force:fs.existsSync(new URL('output/manifest.json',base))});
  console.log(JSON.stringify({example:name,passed:r.qa.passed,errors:r.qa.errors,warnings:r.qa.warnings}));
  if(!r.qa.passed)process.exitCode=2;
}
