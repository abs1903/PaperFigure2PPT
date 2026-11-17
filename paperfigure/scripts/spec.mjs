import fs from 'node:fs';
import crypto from 'node:crypto';
import Ajv from 'ajv';

export const ROOT = new URL('../', import.meta.url);
export const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
export const digest = value => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const schema = readJSON(new URL('references/figure.schema.json', ROOT));
const validate = new Ajv({allErrors: true, strict: true}).compile(schema);

export function assertSpec(spec) {
  if (!validate(spec)) throw new Error(`Schema: ${JSON.stringify(validate.errors)}`);
  const all = [...spec.nodes, ...spec.edges, ...spec.groups];
  const ids = new Set();
  for (const o of all) {
    if (ids.has(o.id)) throw new Error(`Duplicate id: ${o.id}`);
    ids.add(o.id);
  }
  const sources = new Map(spec.sources.map(s => [s.id, s]));
  if (sources.size !== spec.sources.length) throw new Error('Duplicate source id');
  const nodes = new Map(spec.nodes.map(n => [n.id, n]));
  const groups = new Map(spec.groups.map(g => [g.id, g]));
  for (const o of [...spec.nodes, ...spec.edges]) {
    for (const e of o.evidence) {
      if (!sources.get(e.source)?.text.includes(e.quote)) throw new Error(`Evidence not found in source: ${o.id}`);
    }
    if (o.status === 'proposed' && !spec.claims.innovation) throw new Error(`Proposed object needs an explicit innovation claim: ${o.id}`);
  }
  for (const e of spec.edges) {
    if (!nodes.has(e.from) || !nodes.has(e.to)) throw new Error(`Unknown edge endpoint: ${e.id}`);
    if (e.from === e.to) throw new Error(`Self loop unsupported; use explicit state nodes: ${e.id}`);
    for (const endpoint of [nodes.get(e.from), nodes.get(e.to)]) {
      if (e.phase !== 'both' && endpoint.phase !== 'both' && e.phase !== endpoint.phase)
        throw new Error(`Phase mismatch: ${e.id} / ${endpoint.id}`);
      if (e.phase === 'both' && endpoint.phase !== 'both') throw new Error(`Both-phase edge on phase-specific node: ${e.id}`);
    }
  }
  for (const g of spec.groups) {
    for (const id of g.members) if (!nodes.has(id)) throw new Error(`Unknown group member: ${id}`);
    const seen = new Set([g.id]);
    let p = g.parent;
    while (p) {
      if (seen.has(p)) throw new Error(`Group hierarchy cycle: ${g.id}`);
      seen.add(p);
      if (!groups.has(p)) throw new Error(`Unknown parent group: ${p}`);
      p = groups.get(p).parent;
    }
    if (g.parent && g.members.some(id => !groups.get(g.parent).members.includes(id)))
      throw new Error(`Child group must be contained in parent membership: ${g.id}`);
  }
  // Only feedback edges may close a cycle. Drawing a feedback edge never implies weight learning.
  const visiting = new Set(), done = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`Unmarked graph cycle at ${id}; classify temporal/control feedback explicitly`);
    if (done.has(id)) return;
    visiting.add(id);
    for (const e of spec.edges.filter(e => e.from === id && e.kind !== 'feedback')) visit(e.to);
    visiting.delete(id); done.add(id);
  }
  for (const id of nodes.keys()) visit(id);
  for (const id of Object.keys(spec.layout.nodes ?? {})) if (!nodes.has(id)) throw new Error(`Layout references unknown node: ${id}`);
  for (const id of Object.keys(spec.layout.edges ?? {})) if (!spec.edges.some(e => e.id === id)) throw new Error(`Layout references unknown edge: ${id}`);
  for (const id of Object.keys(spec.visual.nodeGlyphs ?? {})) if (!nodes.has(id)) throw new Error(`Glyph references unknown node: ${id}`);
  for (const [kind,items] of Object.entries(spec.visual.appearances??{})) {
    const known=kind==='nodes'?nodes:kind==='groups'?groups:new Map(spec.edges.map(e=>[e.id,e]));
    for(const id of Object.keys(items))if(!known.has(id))throw new Error(`Appearance references unknown ${kind}: ${id}`);
  }
  const artIds=new Set();
  for(const art of spec.visual.artwork??[]) {
    if(artIds.has(art.id))throw new Error(`Duplicate artwork id: ${art.id}`);
    artIds.add(art.id);
    if(!ids.has(art.owner))throw new Error(`Artwork owner missing: ${art.id}`);
    if(art.type==='text'&&!art.text)throw new Error(`Artwork text missing: ${art.id}`);
    if(art.runs&&art.runs.map(r=>r.text).join('')!==art.text)throw new Error(`Rich text does not match its literal content: ${art.id}`);
    if(art.crop&&(art.type!=='asset'||art.crop.x+art.crop.w>art.crop.sourceWidth||art.crop.y+art.crop.h>art.crop.sourceHeight))throw new Error(`Invalid artwork crop: ${art.id}`);
    if(art.textBackground&&(art.type!=='rect'||!nodes.has(art.owner)))throw new Error(`Text backgrounds require an owned node rectangle: ${art.id}`);
    if(art.type==='asset'&&(!art.asset||!/^assets\/[A-Za-z0-9_./-]+\.(png|jpg|jpeg|svg)$/.test(art.asset)||art.asset.split('/').includes('..')))throw new Error(`Unsafe artwork asset: ${art.id}`);
  }
  return spec;
}

export function semanticSnapshot(s) {
  return {version:s.version, sources:s.sources, claims:s.claims, nodes:s.nodes, edges:s.edges, groups:s.groups, assumptions:s.assumptions};
}
