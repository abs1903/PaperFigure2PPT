import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import path from 'node:path';
import {readJSON, digest} from '../scripts/spec.mjs';
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

function narrativeFixture() {
  const evidence = structuredClone(spec.nodes.find(n => n.id === 'tree').evidence);
  const plan = {
    version: 'draft-1', scope: brief.scope,
    takeaway: 'Search alternative tool trajectories with bounded expansion and backup.',
    contributionHierarchy: [
      {id: 'search-design', claim: 'Search alternative trajectories', kind: 'Source-grounded design combination', placement: 'main',
        evidence, blocks: ['search'], visualCue: 'Branching alternatives and ancestor backup', prominence: 'Dominant focal region'},
      {id: 'other-settings', claim: 'Other implementation entry branches', kind: 'Outside the selected code path', placement: 'outside',
        evidence, blocks: [], visualCue: 'Retain only in accompanying source record', prominence: 'Not drawn'}
    ],
    alternatives: [
      {id: 'branches', composition: 'One dominant branching tree with a subordinate reflection ribbon.', mechanism: 'Local selection, expansion and ancestor backup on the same tree.'},
      {id: 'nested-focus', composition: 'Nested search-state views with a compact shared-tools region.', mechanism: 'Enlarged local expansion and backup inside the shared search state.'}
    ]
  };
  const b = clone(); b.version = '1.1';
  for (const key of ['message', 'composition', 'mechanism']) delete b[key];
  b.narrative = {path: 'plans/narrative.json', sha256: digest(plan)};
  b.compositionId = 'branches';
  return {b, plan};
}

test('v1.1 compiles bound contribution hierarchy and only the selected composition', () => {
  const {b, plan} = narrativeFixture();
  const first = designPrompt(spec, b, plan);
  assert.match(first, /Focal design: Search alternative trajectories/);
  assert.ok(first.includes(plan.contributionHierarchy[0].visualCue));
  assert.ok(first.includes(plan.contributionHierarchy[0].kind));
  assert.match(first, /Outside figure scope; do not depict: Other implementation entry branches/);
  assert.ok(first.includes(plan.alternatives[0].composition));
  assert.ok(!first.includes(plan.alternatives[1].composition));
  assert.ok(!first.includes('Owners:'));
  assert.ok(!first.includes('search:tree'));
  b.compositionId = 'nested-focus';
  const second = designPrompt(spec, b, plan);
  assert.ok(second.includes(plan.alternatives[1].composition));
  assert.ok(!second.includes(plan.alternatives[0].composition));
  assert.ok(second.includes(plan.takeaway));
});

test('v1.1 cannot omit, silently mutate or contradict its narrative plan', () => {
  const {b, plan} = narrativeFixture();
  assert.throws(() => designPrompt(spec, b), /bound narrative plan/);
  const changed = structuredClone(plan); changed.contributionHierarchy[0].visualCue = 'Different visual explanation';
  assert.throws(() => designPrompt(spec, b, changed), /Narrative plan is stale/);
  b.message = 'A different contribution';
  assert.throws(() => designPrompt(spec, b, plan), /Contradictory message/);
  delete b.message; b.composition = 'A different layout';
  assert.throws(() => designPrompt(spec, b, plan), /Contradictory composition/);
  delete b.composition; b.narrative.sha256 = 'not-a-hash';
  assert.throws(() => designPrompt(spec, b, plan), /SHA-256/);
});

test('v1.1 checks contribution evidence, visible ownership and focal/support boundaries', () => {
  const reject = (mutate, pattern) => {
    const {b, plan} = narrativeFixture(); mutate(plan); b.narrative.sha256 = digest(plan);
    assert.throws(() => designPrompt(spec, b, plan), pattern);
  };
  reject(p => { p.contributionHierarchy[0].blocks = ['invented']; }, /Unknown or repeated contribution block/);
  reject(p => { p.contributionHierarchy[0].evidence[0].quote = 'A claim absent from the source'; }, /evidence not found/);
  reject(p => { p.contributionHierarchy[0].evidence = []; }, /needs source evidence/);
  reject(p => { p.contributionHierarchy[0].visualCue = ''; }, /visualCue/);
  reject(p => { p.contributionHierarchy[1].blocks = ['search']; }, /placement disagrees/);
  reject(p => { p.contributionHierarchy[0].placement = 'support'; }, /at least one main/);
  reject(p => { p.contributionHierarchy[1].id = p.contributionHierarchy[0].id; }, /IDs.*unique/);
});

test('v1.1 requires a real composition selection or an explicit single-composition exception', () => {
  const {b, plan} = narrativeFixture(); b.compositionId = 'missing';
  assert.throws(() => designPrompt(spec, b, plan), /compositionId/);
  b.compositionId = 'branches'; plan.alternatives = [plan.alternatives[0]]; b.narrative.sha256 = digest(plan);
  assert.throws(() => designPrompt(spec, b, plan), /compositionException/);
  plan.compositionException = 'User supplied and selected this exact composition'; b.narrative.sha256 = digest(plan);
  assert.doesNotThrow(() => designPrompt(spec, b, plan));
  plan.alternatives.push({...plan.alternatives[0], id: 'duplicate-layout'}); b.narrative.sha256 = digest(plan);
  assert.throws(() => designPrompt(spec, b, plan), /literal duplicates/);
});

test('v1.1 CLI resolves the plan relative to the brief and rejects a stale on-disk plan', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'paperfigure-narrative-test-'));
  try {
    const {b, plan} = narrativeFixture(); fs.mkdirSync(path.join(tmp, 'plans'));
    const bp = path.join(tmp, 'brief.json'), pp = path.join(tmp, 'plans/narrative.json');
    fs.writeFileSync(bp, JSON.stringify(b)); fs.writeFileSync(pp, JSON.stringify(plan, null, 2));
    const args = [fileURLToPath(new URL('scripts/paperfigure.mjs', root)), 'reference-prompt', '--spec', fileURLToPath(new URL('examples/lats-hotpotqa/spec-figure.json', root)), '--brief', bp];
    const result = spawnSync(process.execPath, args, {encoding: 'utf8', cwd: os.tmpdir()});
    assert.equal(result.status, 0, result.stderr); assert.equal(result.stdout, designPrompt(spec, b, plan));
    plan.takeaway = 'Changed without rebinding'; fs.writeFileSync(pp, JSON.stringify(plan));
    const stale = spawnSync(process.execPath, args, {encoding: 'utf8', cwd: os.tmpdir()});
    assert.equal(stale.status, 1); assert.match(stale.stderr, /Narrative plan is stale/);
  } finally { fs.rmSync(tmp, {recursive: true, force: true}); }
});
