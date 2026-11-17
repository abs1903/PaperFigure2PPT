#!/usr/bin/env node
// First-use setup must run before any module that imports npm dependencies.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const flags = new Set(process.argv.slice(2));
const require = createRequire(new URL('../package.json', import.meta.url));
const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'));

async function dependencies() {
  const problems = [];
  for (const [name, expected] of Object.entries(pkg.dependencies)) {
    try {
      const installed = JSON.parse(await fs.readFile(path.join(root, 'node_modules', name, 'package.json'), 'utf8'));
      if (installed.version !== expected) throw new Error(`expected ${expected}, found ${installed.version}`);
      const entry = require.resolve(name);
      if (!entry.startsWith(path.join(root, 'node_modules') + path.sep)) throw new Error('resolved outside this skill');
      await import(pathToFileURL(entry).href);
    } catch (error) {
      problems.push({name, reason: error.message});
    }
  }
  return problems;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root, stdio: 'inherit', timeout: 180000,
    shell: process.platform === 'win32' && command.endsWith('.cmd'),
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
}

async function browser() {
  try {
    const {browserRuntime} = await import('./layout-inspect.mjs');
    const runtime = await browserRuntime();
    return {available: true, executablePath: runtime.executablePath};
  } catch (error) {
    return {available: false, reason: error.message};
  }
}

try {
  for (const flag of flags) {
    if (!['--check', '--with-chromium'].includes(flag)) throw new Error(`Unknown option: ${flag}`);
  }
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('PaperFigure requires Node.js 20 or later');
  let problems = await dependencies();
  if (problems.length && !flags.has('--check')) {
    run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--no-audit', '--no-fund']);
    problems = await dependencies();
  }
  let chromium = problems.length ? {available: false, reason: 'Node dependencies are not ready'} : await browser();
  if (!chromium.available && !problems.length && flags.has('--with-chromium') && !flags.has('--check')) {
    run(process.execPath, [path.join(root, 'node_modules/playwright/cli.js'), 'install', 'chromium']);
    chromium = await browser();
  }
  console.log(JSON.stringify({
    skill: 'paperfigure', root, node: process.version,
    nodeDependenciesReady: problems.length === 0, problems, chromium,
    scope: 'Local runtime setup only; Office rendering and independent figure review remain separate.',
  }, null, 2));
  if (problems.length || (flags.has('--with-chromium') && !chromium.available)) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
