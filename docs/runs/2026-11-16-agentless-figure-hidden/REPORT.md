# Agentless: author-figure-hidden ImageGen design case

Started 2026-11-16; completed 2026-11-17. The user asked for a new paper case
without looking at its authors' figures. This case stops at image design.

## Result

[The selected PNG](selected-reference.png) passed
[independent V3 image-stage review](image-review-v3.md), following one initial
generation and two actual attached-image edits. The final reference is 1816×866.
[image-stage.json](image-stage.json) and [summary.json](summary.json) preserve the
scope: **no SVG/PPTX/native sample/Office output was generated or accepted, and
complete delivery remains unready.**

This is one newly selected source-informed case, not evidence of a general success
rate or a fully unseen-to-the-model benchmark. No author-figure comparison was
performed, including after selection.

## What was and was not read

- Paper: [Agentless: Demystifying LLM-based Software Engineering Agents](https://arxiv.org/abs/2407.01489), version 2407.01489v1.
- Official repository: [OpenAutoCoder/Agentless](https://github.com/OpenAutoCoder/Agentless/tree/5ce5888b9f149beaace393957a55ea8ee46c9f71), pinned commit `5ce5888b9f149beaace393957a55ea8ee46c9f71`.
- Eight raw code/license files were fetched through the GitHub connector and
  verified against their Git blob hashes. SHA-256 and source URLs are retained
  in [source-manifest.json](source-manifest.json); the MIT license accompanies them.
- ArXiv HTML was fetched as unrendered text. Before model-visible method prose,
  the extractor removed figures, images, SVGs, tables, captions and paragraphs
  referring to figures. Image assets were never fetched. Extraction counts/hash
  are in [paper-text-extraction.json](paper-text-extraction.json).
- The initial extractor accidentally retained navigation rather than substantive
  method text. Its `-v0` files remain as failure evidence; it was corrected and
  required substantive section content before any semantic design or generation.
- README itself was not fetched/opened. Initial title/repository search returned
  only metadata and clone/title snippets, not illustrations/captions.
- The isolated reviewer was also prohibited from author figures, captions,
  README, websites, image assets, old diagrams and later unblinding.

The [protocol snapshot](figure-hidden-protocol.json) records this boundary at V2;
final call counts are in [summary.json](summary.json). This is an **in-run
figure-hidden** procedure. General pretrained model knowledge of the paper or its
figure cannot be excluded. Hashes prove input identity, not absence of prior
model knowledge or reviewer independence.

## Frozen scientific interpretation

[The source audit](source-audit.md), [initial brief review](source-brief-review.md)
and [wording amendment](source-brief-review-v2.md) preceded generation. The source
spec and [semantic freeze](semantic-freeze.json) retain thirteen nodes and
seventeen relations. No source topology was changed during the image edits.

The figure describes the paper's Localization and Repair phases, with sampling,
screening and selection internal to Repair. Its concrete route uses hierarchical
file/symbol/edit-location localization, focused repair context, candidate edits,
syntax/no-op screening, normalization, regression evidence and frequency selection.
The pinned configuration has regression enabled and reproduction disabled.

A material version distinction is retained: paper prose describes removing
regression-failing patches; this pinned implementation first keeps the minimum
recorded regression-failure cohort and can fall back to other nonempty normalized
keys if that cohort has no usable keys. No all-tests-pass or correctness guarantee
is claimed. The frequency winner returns an associated **original raw candidate
patch**, not the normalized comparison key. Early-empty/no-valid-patch paths are
limitations, not depicted as successful repair. No repair model, benchmark,
simulator or test harness was executed; patch/test motifs are schematic.

## Design and actual generation history

[Composition options](design-options.md) were written before generation. The
selected option uses repository narrowing, candidate-edit fan-out and grouped
selection convergence. It does not import a prior layout or author figure.

| Candidate | Actual input/operation | Independent result |
| --- | --- | --- |
| [V1](candidate-v1.png) | New generation, no image inputs; [submitted prompt](prompt-generate-v1.txt) from the [reviewed brief](design-brief-reviewed.json) | Revise: raw-patch association was not visible despite the final label. [Review](image-review-v1.md). |
| [V2](candidate-v2.png) | V1 actually attached; [selection-routing edit](prompt-edit-v2.txt) | Semantic distinction fixed; revise for small selection labels/details at publication width. [Review](image-review-v2.md). |
| [V3](candidate-v3.png) | V2 actually attached; [typography/detail edit](prompt-edit-v3.txt) | Accept at raster image stage only. [Review](image-review-v3.md). |

V3 enlarges semantic labels and reduces redundant miniature stroke rows/stack
copies while preserving key↔raw-diff tethers, the original-patch output route,
the two evidence streams and the conditional fallback. It was inspected both
at full resolution and in a [672-px reading diagnostic](candidate-v3-paper-width-diagnostic.png).
That diagnostic is an approximate seven-inch screen-reading check, not measured
font identity, print proof or Office verification. One pixel of canvas-width
drift (1817→1816) is retained in the actual metadata; the selected PNG was not
resampled to conceal it.

All three images came from the **built-in ImageGen** tool. Edits used actual
`referenced_image_paths` attachments, not fresh generations described as edits.
There were no external paid-provider API calls. Exact prompts, image hashes,
parent hashes, source/brief/freeze hashes and immutable `generation-record-vN.json`
files are indexed by [rounds.json](rounds.json). Rejected source wording and
rejected/superseded images/reviews remain unchanged.

## Current handoff

[selected-reference.json](selected-reference.json) freezes the exact accepted PNG.
[spec-target.json](spec-target.json) marks it as a target; generic `build` was
actually tested and refused before creating output, as recorded in
[target-route-guard.log](target-route-guard.log).

If native work is later requested, first inventory this exact image's labels,
regions, motifs and routes; fit/freeze typography; test a small native sample;
then faithfully reconstruct and obtain actual Office/full-native review. Do not
replace this design with semantic auto-layout. The present acceptance establishes
source-grounded image communication for this case; native feasibility is only a
raster-based likelihood and remains unverified by implementation.

## Verification

Source Git blobs/SHA-256, semantic/spec validation, design-brief coverage,
per-review artifact hashes, the frozen-target route guard, report links and
`git diff --check` were checked. See
[review-hash-verification.json](review-hash-verification.json). These checks do
not measure human design preference, human editing cost or publication quality.
