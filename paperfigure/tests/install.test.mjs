import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const source=fileURLToPath(new URL('../',import.meta.url)),installer=path.join(source,'scripts/install.mjs');
const run=dest=>spawnSync(process.execPath,[installer,'--link',dest],{encoding:'utf8',timeout:10000});
test('development installation links the source, works through the link, and is idempotent',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-dev-link-'));
 try{
  const dest=path.join(dir,'.agents/skills/paperfigure');assert.equal(run(dest).status,0);
  assert.equal((await fs.lstat(dest)).isSymbolicLink(),true);assert.equal(await fs.realpath(dest),await fs.realpath(source));
  assert.equal(path.isAbsolute(await fs.readlink(dest)),false);assert.equal(run(dest).status,0);
  const cli=spawnSync(process.execPath,[path.join(dest,'scripts/paperfigure.mjs'),'help'],{encoding:'utf8',timeout:10000});assert.equal(cli.status,0,cli.stderr);assert.match(cli.stdout,/PaperFigure/);
  assert.ok((await fs.readFile(path.join(dest,'SKILL.md'))).equals(await fs.readFile(path.join(source,'SKILL.md'))));
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
test('development installation preserves an existing directory or another skill link',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-dev-collision-'));
 try{
  const dest=path.join(dir,'existing'),other=path.join(dir,'other');await fs.mkdir(dest);await fs.writeFile(path.join(dest,'keep.txt'),'user installation');
  assert.notEqual(run(dest).status,0);assert.equal(await fs.readFile(path.join(dest,'keep.txt'),'utf8'),'user installation');
  await fs.mkdir(other);const alias=path.join(dir,'other-link');await fs.symlink(other,alias,'dir');assert.notEqual(run(alias).status,0);assert.equal(await fs.realpath(alias),await fs.realpath(other));
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('local linking needs no installed runtime dependencies',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-cold-link-'));
 try{
  const clean=path.join(dir,'source');await fs.mkdir(path.join(clean,'scripts'),{recursive:true});await fs.copyFile(installer,path.join(clean,'scripts/install.mjs'));await fs.copyFile(path.join(source,'SKILL.md'),path.join(clean,'SKILL.md'));
  const dest=path.join(dir,'project/.agents/skills/paperfigure');const r=spawnSync(process.execPath,[path.join(clean,'scripts/install.mjs'),'--link',dest],{encoding:'utf8',timeout:10000});
  assert.equal(r.status,0,r.stderr);assert.equal(await fs.realpath(dest),await fs.realpath(clean));
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});

test('an aliased parent cannot create an installation inside its own source',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'paperfigure-recursive-link-'));
 try{
  const clean=path.join(dir,'source');await fs.mkdir(path.join(clean,'scripts'),{recursive:true});await fs.copyFile(installer,path.join(clean,'scripts/install.mjs'));await fs.copyFile(path.join(source,'SKILL.md'),path.join(clean,'SKILL.md'));
  const alias=path.join(dir,'source-alias');await fs.symlink(clean,alias,'dir');
  const name='forbidden-dev-install-'+path.basename(dir),dest=path.join(alias,name,'nested');
  const result=spawnSync(process.execPath,[path.join(clean,'scripts/install.mjs'),'--link',dest],{encoding:'utf8',timeout:10000});assert.notEqual(result.status,0);assert.match(result.stderr,/outside the source/);
  await assert.rejects(fs.lstat(path.join(clean,name)),{code:'ENOENT'});
 }finally{await fs.rm(dir,{recursive:true,force:true});}
});
