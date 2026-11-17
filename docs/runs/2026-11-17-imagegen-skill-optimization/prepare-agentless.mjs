import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {digest,semanticSnapshot} from '../../../paperfigure/scripts/spec.mjs';
import {assertDesignBrief,designPrompt} from '../../../paperfigure/scripts/design-prompt.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)), old=path.resolve(base,'../2026-11-17-agentless-contribution');
const spec=JSON.parse(fs.readFileSync(path.join(old,'spec.json'))), legacy=JSON.parse(fs.readFileSync(path.join(old,'design-brief.json')));
const folder=path.join(base,'agentless-inputs');fs.mkdirSync(folder,{recursive:true});
function evidence(source,quote){if(!spec.sources.find(s=>s.id===source)?.text.includes(quote))throw Error('Missing evidence: '+quote);return {source,quote};}
const plan={
 version:'contract-demo-1',scope:spec.claims.scope,takeaway:spec.claims.summary,
 contributionHierarchy:[
  {id:'fixed-control',claim:'Fixed localization and repair with bounded LLM tasks',kind:'Central design combination; individual primitives are not claimed new',placement:'main',blocks:['localize','repair'],evidence:[evidence('paper-intro','without letting the LLM decide future actions or operate with complex tools')],visualCue:'A fixed localization/repair frame with No autonomous planning; LLM labels only on bounded selections and local editing.',prominence:'Framing claim across both focal regions'},
  {id:'hierarchical-focus',claim:'Hierarchical localization using concise source representations',kind:'Supporting design combination',placement:'main',blocks:['localize'],evidence:[evidence('paper-intro','hierarchical process to first localize the fault to specific files, then to relevant classes or functions, and finally to fine-grained edit locations')],visualCue:'Persist selected file and element identifiers across tree, skeleton, original code and selected interval; retain source context.',prominence:'Primary mechanism region'},
  {id:'local-edit',claim:'Localized Search/Replace generation',kind:'Established edit technique within the combination',placement:'main',blocks:['repair'],evidence:[evidence('paper-method','avoids generating the complete code and instead focuses on producing small edits')],visualCue:'Magnify a gold source interval into SEARCH/REPLACE while surrounding source stays unchanged; show multiple candidate edits.',prominence:'Second focal mechanism'},
  {id:'selection-support',claim:'Syntax/regression filtering and normalized frequency ranking',kind:'Established deterministic support operations',placement:'support',blocks:['select'],evidence:[evidence('paper-method','syntax errors and regression test failures'),evidence('paper-method','highest number of occurrences')],visualCue:'Small ordered filter/rank strip ending in Selected patch; no LLM marker or correctness guarantee.',prominence:'Subordinate to localization and local editing'},
  {id:'dataset-audit',claim:'Benchmark audit and SWE-bench Lite-S',kind:'Separate evaluation contribution',placement:'outside',blocks:[],evidence:[evidence('paper-intro','we construct SWE-bench Lite-S')],visualCue:'Retained in companion record, not an algorithm module.',prominence:'Not drawn'}
 ],
 alternatives:[
  {id:'source-funnel',composition:'White landscape canvas, about 1.7:1. A wide-to-narrow source funnel at left and local-edit magnification at right; compact selection strip below right. A small framing bracket carries Fixed localization + repair and No autonomous planning. No numbered card pipeline or colored background bands.',mechanism:'Narrowing geometry explains bounded source context; magnify only the selected interval to explain local edits. Four small LLM markers identify three selections and generation; deterministic operations stay subordinate.'},
  {id:'nested-focus',composition:'White landscape canvas, about 1.7:1. At left, nested source views enlarge the selected repository region from tree to skeletons to original code and edit context. At right, magnify that context into local Search/Replace edits; small selection strip below. Retain the fixed-control framing captions. No funnel, numbered equal-card pipeline or decorative background.',mechanism:'Containment and successive source zooms explain the shrinking relevant region instead of a funnel. The repeated selected identifiers bind the views. Local edit magnification preserves unchanged source and four bounded LLM roles.'}
 ],
 review:{sourceAudit:'../../2026-11-17-agentless-contribution/source-contribution-review-v2.md',status:'Offline interface example: historical source audit reused, new contracts/compositions not independently pixel-reviewed'},
 notes:['No image calls, first-reading reports or candidate-selection results exist for this new contract demonstration.']
};
fs.writeFileSync(path.join(folder,'narrative-plan.json'),JSON.stringify(plan,null,2)+'\n');
const reps={issue:'Small shared Issue report input, tapped to file/element selection and repair generation; no autonomous next-action controller.',localize:'One coherent source-focus illustration: Code repository -> Build tree -> Repository tree; LLM selects files; Build skeletons derives signatures; LLM selects elements; Read code retrieves original source; LLM selects edit locations; Context padding retains gray source around the gold interval. Preserve fields.py, UUIDField and to_python across views. Use the selected composition, not equal cards.',repair:'Focused source arrives in a Context window. An issue-conditioned LLM generates local Search/Replace edits: gold interval magnifies into red-minus SEARCH and green-plus REPLACE strips, with surrounding source unchanged. A fan shows multiple Candidate patches. Use schematic code strokes, not an invented successful bug fix.',select:'Small deterministic strip: Syntax + regression -> Normalize + frequency -> Selected patch. No LLM badge; exact output serialization and repair correctness are unspecified.'};
const relations={
 'codebase-tree':'Original repository yields a tree through deterministic Build tree.',
 'files-skeletons':'Selected files yield source-derived Skeletons via Build skeletons, not model-written source.',
 'elements-code':'Selected identifiers retrieve original source through Read code.',
 'issue-files':'Issue feeds the first, file-selection LLM.',
 'issue-elements':'The same issue feeds the element-selection LLM.',
 'issue-samples':'The same issue also feeds the local-edit generation LLM.',
 'repo-files':'Repository tree feeds LLM selection of file paths.',
 'files-elements':'Skeletons feed LLM selection of relevant elements.',
 'elements-locations':'Original selected code feeds LLM selection of edit locations; no extra direct issue edge is asserted.',
 'locations-context':'Selected interval plus surrounding original code represents deterministic context padding.',
 'context-samples':'Focused context feeds local Search/Replace generation, never a direct raw-context-to-filter bypass.',
 'samples-filter':'Generated candidate patches feed deterministic filtering.',
 'filter-rank':'Syntax/regression filtering precedes normalization/frequency ranking.',
 'rank-patch':'Ranking yields Selected patch; no serialization or correctness guarantee.'
};
const results=[];
for(const alt of plan.alternatives){
 const b=structuredClone(legacy);b.version='1.1';for(const k of ['message','composition','mechanism','narrativePlan','narrativeReview'])delete b[k];
 b.narrative={path:'narrative-plan.json',sha256:digest(plan)};b.compositionId=alt.id;b.semanticSHA256=digest(semanticSnapshot(spec));
 b.sourceReview='../../2026-11-17-agentless-contribution/source-contribution-review-v2.md';
 for(const block of b.blocks)block.representation=reps[block.id];
 for(const rel of b.relations)rel.display=relations[rel.edge];
 assertDesignBrief(spec,b,plan);
 const prompt=designPrompt(spec,b,plan);
 fs.writeFileSync(path.join(folder,'brief-'+alt.id+'.json'),JSON.stringify(b,null,2)+'\n');
 fs.writeFileSync(path.join(base,'prompt-'+alt.id+'.txt'),prompt);
 results.push({compositionId:alt.id,characters:prompt.length,narrativeDigest:b.narrative.sha256,semanticDigest:b.semanticSHA256,compiledPromptSHA256:digest(prompt)});
}
fs.writeFileSync(path.join(base,'agentless-compilation.json'),JSON.stringify({actualImageCalls:0,actualCandidateComparison:'unperformed',actualFirstReadingReview:'unperformed',results},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({id:r.compositionId,characters:r.characters}))));
