import {assertSpec, digest, semanticSnapshot} from './spec.mjs';

const requiredText = (v, label) => {
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Design brief requires ${label}`);
};

function assertNarrative(spec, brief, plan) {
  requiredText(brief.narrative?.path, 'narrative.path');
  if (!/^[a-f0-9]{64}$/.test(brief.narrative?.sha256 ?? '')) throw new Error('Narrative binding requires a SHA-256 digest');
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('Version 1.1 requires the bound narrative plan');
  if (digest(plan) !== brief.narrative.sha256) throw new Error('Narrative plan is stale; re-review and rebind before prompting');
  requiredText(plan.version, 'narrative version');
  requiredText(plan.takeaway, 'narrative takeaway');
  const sources = new Map(spec.sources.map(s => [s.id, s]));
  const blocks = new Set(brief.blocks.map(b => b.id));
  const claims = new Set();
  if (!Array.isArray(plan.contributionHierarchy) || !plan.contributionHierarchy.length) throw new Error('Narrative requires a contribution hierarchy');
  for (const claim of plan.contributionHierarchy) {
    if (!claim || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(claim.id ?? '') || claims.has(claim.id)) throw new Error('Contribution IDs must be stable and unique');
    claims.add(claim.id);
    for (const field of ['claim', 'kind', 'visualCue', 'prominence']) requiredText(claim[field], `contribution ${claim.id}.${field}`);
    if (!['main', 'support', 'outside'].includes(claim.placement)) throw new Error('Contribution placement must be main, support or outside');
    if (!Array.isArray(claim.blocks) || new Set(claim.blocks).size !== claim.blocks.length || claim.blocks.some(id => !blocks.has(id))) throw new Error(`Unknown or repeated contribution block: ${claim.id}`);
    if (claim.placement === 'outside' ? claim.blocks.length !== 0 : claim.blocks.length === 0) throw new Error(`Contribution placement disagrees with visual ownership: ${claim.id}`);
    if (!Array.isArray(claim.evidence) || !claim.evidence.length) throw new Error(`Contribution needs source evidence: ${claim.id}`);
    for (const evidence of claim.evidence) {
      if (!evidence || typeof evidence.quote !== 'string' || !evidence.quote.trim() || !sources.get(evidence.source)?.text.includes(evidence.quote)) throw new Error(`Contribution evidence not found in source: ${claim.id}`);
    }
  }
  if (!plan.contributionHierarchy.some(c => c.placement === 'main')) throw new Error('Narrative needs at least one main contribution');
  if (!Array.isArray(plan.alternatives) || !plan.alternatives.length) throw new Error('Narrative requires composition alternatives');
  if (plan.alternatives.length < 2) requiredText(plan.compositionException, 'compositionException for a single selected/approved composition');
  const alternatives = new Set(), descriptions = new Set();
  for (const alternative of plan.alternatives) {
    if (!alternative || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(alternative.id ?? '') || alternatives.has(alternative.id)) throw new Error('Composition IDs must be stable and unique');
    alternatives.add(alternative.id);
    for (const field of ['composition', 'mechanism']) requiredText(alternative[field], `composition ${alternative.id}.${field}`);
    const description = JSON.stringify([alternative.composition.trim(), alternative.mechanism.trim()]);
    if (descriptions.has(description)) throw new Error('Composition alternatives must not be literal duplicates');
    descriptions.add(description);
  }
  const selected = plan.alternatives.find(a => a.id === brief.compositionId);
  if (!selected) throw new Error('Brief compositionId must select a bound narrative alternative');
  for (const [field, value] of [['message', plan.takeaway], ['composition', selected.composition], ['mechanism', selected.mechanism]]) {
    if (brief[field] !== undefined && brief[field] !== value) throw new Error(`Contradictory ${field}: version 1.1 derives it from the bound narrative plan`);
  }
}

// This validates coverage, not whether the visual abstraction is scientifically true.
export function assertDesignBrief(spec, brief, narrativePlan) {
  assertSpec(spec);
  if (!['1.0', '1.1'].includes(brief.version)) throw new Error('Design brief version must be 1.0 or 1.1');
  if (brief.semanticSHA256 !== digest(semanticSnapshot(spec))) throw new Error('Design brief semantic snapshot is stale');
  const fields = brief.version === '1.0' ? ['message', 'scope', 'sourceReview', 'composition', 'mechanism', 'typography'] : ['scope', 'sourceReview', 'typography'];
  for (const field of fields) requiredText(brief[field], field);
  if (!Number.isFinite(brief.publicationWidthIn) || brief.publicationWidthIn <= 0) throw new Error('Positive publication width required');
  const blocks = new Map(), owners = new Map();
  if (!Array.isArray(brief.blocks) || !brief.blocks.length) throw new Error('Design brief requires visual blocks');
  const nodes = new Set(spec.nodes.map(n => n.id));
  for (const block of brief.blocks) {
    if (!block.id || blocks.has(block.id)) throw new Error('Duplicate or missing visual block ID');
    for (const field of ['label', 'representation']) requiredText(block[field], `block ${block.id}.${field}`);
    if (!Array.isArray(block.nodes) || !block.nodes.length) throw new Error('Visual block needs semantic owners');
    for (const id of block.nodes) {
      if (!nodes.has(id) || owners.has(id)) throw new Error(`Unknown or repeated semantic owner: ${id}`);
      owners.set(id, block.id);
    }
    blocks.set(block.id, block);
  }
  for (const id of nodes) if (!owners.has(id)) throw new Error(`Unrepresented semantic node: ${id}`);
  const relations = new Map();
  if (!Array.isArray(brief.relations)) throw new Error('Design brief requires relation representations');
  for (const relation of brief.relations) {
    const edge = spec.edges.find(e => e.id === relation.edge);
    if (!edge || relations.has(edge.id)) throw new Error(`Unknown or repeated relation: ${relation.edge}`);
    if (!['arrow', 'internal'].includes(relation.mode)) throw new Error('Relations must be arrow or internal; silently omitting edges is unsupported');
    requiredText(relation.display, `relation ${edge.id}.display`);
    if (relation.mode === 'internal' && owners.get(edge.from) !== owners.get(edge.to)) throw new Error(`Cross-block relation cannot be internal: ${edge.id}`);
    relations.set(edge.id, relation);
  }
  for (const edge of spec.edges) if (!relations.has(edge.id)) throw new Error(`Unrepresented semantic edge: ${edge.id}`);
  const colored = new Set();
  if (!Array.isArray(brief.palette) || !brief.palette.length) throw new Error('Named semantic palette required');
  for (const color of brief.palette) {
    requiredText(color.meaning, 'palette meaning');
    if (!/^#[0-9a-f]{6}$/i.test(color.color)) throw new Error('Palette needs six-digit solid colors');
    if (!Array.isArray(color.nodes) || !color.nodes.length) throw new Error('Palette needs semantic owners');
    for (const id of color.nodes) {
      if (!nodes.has(id) || colored.has(id)) throw new Error(`Unknown or repeated palette owner: ${id}`);
      colored.add(id);
    }
  }
  for (const id of nodes) if (!colored.has(id)) throw new Error(`Missing palette role: ${id}`);
  if (!Array.isArray(brief.labels) || !brief.labels.length || brief.labels.some(s => typeof s !== 'string' || !s.trim()) || new Set(brief.labels).size !== brief.labels.length) throw new Error('Unique exact visible labels required');
  const words = brief.labels.join(' ').split(/\s+/).length;
  if (!Number.isInteger(brief.maxVisibleWords) || brief.maxVisibleWords <= 0 || words > brief.maxVisibleWords) throw new Error(`Visible text budget exceeded: ${words}`);
  if (!Array.isArray(brief.forbidden) || !brief.forbidden.length || brief.forbidden.some(s => typeof s !== 'string' || !s.trim())) throw new Error('Source-specific forbidden additions required');
  if (brief.version === '1.1') assertNarrative(spec, brief, narrativePlan);
  return brief;
}

function narrativePrompt(spec, brief, plan) {
  const selected = plan.alternatives.find(a => a.id === brief.compositionId);
  const blocks = new Map(brief.blocks.map(b => [b.id, b]));
  const owners = new Map(brief.blocks.flatMap(b => b.nodes.map(n => [n, b.id])));
  return [
    'Use case: scientific-educational. Asset: paper method illustration. Art-direction metadata below is not extra canvas text.',
    `Reader takeaway: ${plan.takeaway}`,
    `Scientific scope: ${brief.scope}`,
    'Contribution hierarchy; emphasize the supported design choices without claiming every primitive is new:',
    ...plan.contributionHierarchy.map(c => c.placement === 'outside'
      ? `Outside figure scope; do not depict: ${c.claim}.`
      : `${c.placement === 'main' ? 'Focal design' : 'Supporting operation'}: ${c.claim}. Status: ${c.kind}. Visible evidence: ${c.visualCue}. Prominence: ${c.prominence}. Visual owners: ${c.blocks.map(id => blocks.get(id).label).join(', ')}.`),
    `Composition: ${selected.composition}`,
    `Visible mechanism: ${selected.mechanism}`,
    `Typography: ${brief.typography}; publication width ${brief.publicationWidthIn} inches.`,
    'Visual representations; semantic coverage is validated separately:',
    ...brief.blocks.map(b => `${b.label}: ${b.representation}`),
    'Directed relations; internal operations must remain visibly meaningful:',
    ...spec.edges.map(e => {
      const r = brief.relations.find(r => r.edge === e.id);
      const from = blocks.get(owners.get(e.from)).label, to = blocks.get(owners.get(e.to)).label;
      return r.mode === 'internal' ? `Within ${from}: ${r.display}` : `${from} -> ${to}: ${r.display}`;
    }),
    'Exact visible text whitelist:',
    ...brief.labels.map(label => JSON.stringify(label)),
    `Text budget: ${brief.maxVisibleWords} words maximum; repeat labels only when needed to show shared inputs or source linkage.`,
    'Semantic solid palette:',
    ...brief.palette.map(p => `${p.color}: ${p.meaning}`),
    'White background and flat solid fills. No overall title, footer, shadows, glow or decorative icons. Keep the requested local mechanism/contribution captions. Colors supplement labels and geometry.',
    'Do not turn every semantic node into an equal card. Keep the primary mechanism prominent, supporting checks subordinate, and arrowheads/text unobstructed. Schematic examples are not measured executions.',
    `Forbidden scientific additions: ${brief.forbidden.join('; ')}.`,
    'Generated pixels never authorize scientific changes. Return an imperfect candidate for review rather than inventing a mechanism.'
  ].join('\n') + '\n';
}

export function designPrompt(spec, brief, narrativePlan) {
  assertDesignBrief(spec, brief, narrativePlan);
  if (brief.version === '1.1') return narrativePrompt(spec, brief, narrativePlan);
  const owner = new Map(brief.blocks.flatMap(b => b.nodes.map(n => [n, b.id])));
  return [
    'Use case: scientific-educational. Asset: original AI-paper method figure, not a slide or software dependency chart.',
    `Reader takeaway: ${brief.message}`,
    `Scientific scope: ${brief.scope}`,
    `Composition: ${brief.composition}`,
    `Visible mechanism: ${brief.mechanism}`,
    `Typography and final-size test: ${brief.typography}; publication width ${brief.publicationWidthIn} inches.`,
    'Visual blocks (semantic owners are metadata, not extra boxes or printed IDs):',
    ...brief.blocks.map(b => `${b.id} / ${b.label}: ${b.representation}. Owners: ${b.nodes.join(', ')}.`),
    'Required directed relations (an internal relation needs a visible mechanism, not an unexplained enclosure):',
    ...spec.edges.map(e => {const r = brief.relations.find(r => r.edge === e.id);return `${owner.get(e.from)}:${e.from} -> ${owner.get(e.to)}:${e.to}: ${r.mode}; ${r.display}`;}),
    'Exact visible text whitelist; do not print metadata or add prose:',
    ...brief.labels.map(label => JSON.stringify(label)),
    `Text budget: ${brief.maxVisibleWords} words maximum; do not duplicate labels to fill space.`,
    'Semantic solid palette:',
    ...brief.palette.map(p => `${p.color}: ${p.meaning}; owners ${p.nodes.join(', ')}`),
    'White background; flat solid fills; no gradients, shadows, glow, glossy effects, title, subtitle, footer, footnotes, decorative icons or unrequested stage panels. Neutral black/gray text, borders and arrows are allowed. Colors do not replace labels or shape cues.',
    'Modules are not automatically one rectangle per semantic node. Follow the specified representation. Use consistent border anchors, precise arrowheads and unobstructed text. Reused schematic states are illustrative, not measured executions.',
    `Forbidden scientific additions: ${brief.forbidden.join('; ')}.`,
    'Do not invent a mechanism to make the layout easier. If the requested topology cannot be legibly drawn, retain it and return a candidate for review; generated pixels never authorize a scientific change.'
  ].join('\n') + '\n';
}
