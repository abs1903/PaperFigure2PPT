import {assertSpec, digest, semanticSnapshot} from './spec.mjs';

const requiredText = (v, label) => {
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Design brief requires ${label}`);
};

// This validates coverage, not whether the visual abstraction is scientifically true.
export function assertDesignBrief(spec, brief) {
  assertSpec(spec);
  if (brief.version !== '1.0') throw new Error('Design brief version must be 1.0');
  if (brief.semanticSHA256 !== digest(semanticSnapshot(spec))) throw new Error('Design brief semantic snapshot is stale');
  for (const field of ['message', 'scope', 'sourceReview', 'composition', 'mechanism', 'typography']) requiredText(brief[field], field);
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
  return brief;
}

export function designPrompt(spec, brief) {
  assertDesignBrief(spec, brief);
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
