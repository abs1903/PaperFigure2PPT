import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readJSON} from '../scripts/spec.mjs';
import {assertDesignBrief, designPrompt} from '../scripts/design-prompt.mjs';

const root = new URL('../', import.meta.url);
const spec = readJSON(new URL('examples/lats-hotpotqa/spec-figure.json', root));
const brief = readJSON(new URL('examples/lats-hotpotqa/design-study/design-brief-v2.json', root));
const clone = () => structuredClone(brief);

test('communication prompt covers the corrected graph without demanding a card for every entity', () => {
  const prompt = designPrompt(spec, brief);
  assert.equal(prompt, readJSONText('examples/lats-hotpotqa/design-study/prompt-v2-draft.txt'));
  assert.ok(brief.blocks.length < spec.nodes.length);
  for (const e of spec.edges) assert.ok(prompt.includes(`:${e.from} -> `) && prompt.includes(`:${e.to}:`));
  assert.match(prompt, /reflection-to-value feedback/);
  assert.match(prompt, /Exact visible text whitelist/);
  assert.match(prompt, /not measured executions/);
});

import fs from 'node:fs';
const readJSONText = p => fs.readFileSync(new URL(p, root), 'utf8');

test('stale semantics and omitted or invented owners/edges fail before prompting', () => {
  let b = clone(); b.semanticSHA256 = 'old';
  assert.throws(() => assertDesignBrief(spec, b), /stale/);
  b = clone(); b.blocks[0].nodes = ['invented'];
  assert.throws(() => assertDesignBrief(spec, b), /Unknown/);
  b = clone(); b.relations.pop();
  assert.throws(() => assertDesignBrief(spec, b), /Unrepresented semantic edge/);
  b = clone(); b.blocks[1].nodes.pop();
  assert.throws(() => assertDesignBrief(spec, b), /Unrepresented semantic node/);
});

test('compression cannot hide cross-block relations; palette and exact-label budgets are checked', () => {
  let b = clone(); b.relations.find(r => r.edge === 'policy-feedback').mode = 'internal';
  assert.throws(() => assertDesignBrief(spec, b), /Cross-block/);
  b = clone(); b.maxVisibleWords = 3;
  assert.throws(() => assertDesignBrief(spec, b), /budget/);
  b = clone(); b.palette[0].nodes.push('tools');
  assert.throws(() => assertDesignBrief(spec, b), /repeated palette/);
  b = clone(); b.labels.push(b.labels[0]);
  assert.throws(() => assertDesignBrief(spec, b), /Unique/);
});

test('CLI refuses graph-dump prompting and emits the reviewed-brief prompt without provider calls', () => {
  const cli = fileURLToPath(new URL('scripts/paperfigure.mjs', root));
  const args = [cli, 'reference-prompt', '--spec', fileURLToPath(new URL('examples/lats-hotpotqa/spec-figure.json', root))];
  const missing = spawnSync(process.execPath, args, {encoding: 'utf8'});
  assert.equal(missing.status, 1); assert.match(missing.stderr, /--brief/);
  const result = spawnSync(process.execPath, [...args, '--brief', fileURLToPath(new URL('examples/lats-hotpotqa/design-study/design-brief-v2.json', root))], {encoding: 'utf8'});
  assert.equal(result.status, 0); assert.equal(result.stdout, designPrompt(spec, brief));
});
