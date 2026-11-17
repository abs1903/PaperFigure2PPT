# CLIP — current-skill README showcase

## Deliverable

**Final state: `deliveryReady: true`; mechanical, actual-render and independent-review stages all pass.**

A new author-informed CLIP overview was designed using the current `paperfigure` skill for the repository's refreshed Examples gallery. The selected ImageGen design is faithfully reconstructed as native editable SVG/PPTX; the README displays the actual LibreOffice PPTX render, not an image mockup presented as editable content.

- [PPTX](output-v2/figure.pptx), [SVG](output-v2/editable.svg), [actual Office PDF](output-v2/native-render/figure.pdf), [Office preview](output-v2/native-render/preview.png)
- [Frozen ImageGen reference](selected-reference.png), [target/SVG/Office comparison](output-v2/reference-svg-office-triptych.png)
- [Semantic spec](spec.json), [contribution plan](narrative-plan.json), [native authoring source](author-scene.mjs)
- [Independent source audit](source-audit.md), [source/plan review](source-plan-review.md), [pixel-only first reading](first-reading.md), [rereading](rereading-c.md), [selected raster review](image-review-b2.md)
- [Native inspection](native-reference-inspection.md), [final native review](output-v2/native-review.md), [native fidelity verdict](output-v2/reconstruction-review.json), [shared delivery state](output-v2/delivery.json)

The authoritative final state is `output-v2/delivery.json`, with mechanical, actual-render and independent-review stages recorded separately. No source, raster or XML pass alone implies final delivery acceptance.

## Source and narrative

Paper: *Learning Transferable Visual Models From Natural Language Supervision*, ICML 2021. Official implementation: `openai/CLIP` at `d05afc436d78f1c48dc0dbf8e5980a9d471f35f6`. Paper Figure 1 was opened before design; this is not figure-hidden. Figure 3 supplies the symmetric training objective, while the released `model.py` corroborates normalized scaled-cosine logits and their transpose, not a training loss loop.

The visual argument is paired cross-modal alignment followed by language-defined zero-shot classification. The large 3×3 matrix highlights three true-pair diagonal targets and six off-diagonal comparisons. The two retrieval directions and symmetric loss remain local explanations. A separate lower region reuses the learned encoders: a query image and template/class descriptions become normalized representations for nearest-label comparison, with no target-specific fitting, inference loss or new classifier head.

The boat, bird and cup are original schematic glyphs. Three training pairs and three candidate labels are a teaching example, not an executed batch, measured similarities, benchmark or correct prediction. No model, training or inference was run. Projection, normalization and learned logit scale are internal; no fixed ×100 claim is made. Prompt ensembling, exact backbones, optimization and dataset-scale results are outside this overview.

## Actual image loop

**Three ImageGen calls used, within a four-call limit:** two initial compositions and one actual attached-image edit. Candidate A is side-by-side with a matrix bridge; B is stacked pre-training/zero-shot transfer. The same reviewed semantic spec and contribution plan bind both version-1.1 briefs.

A fresh reviewer received only neutral candidate paths and 672px diagnostics. Its pixel-only account was saved and hash-frozen before the factual review. It recovered dual-encoder contrastive alignment and zero-shot text matching from both, while noting dense secondary annotations.

The creator's scientific-region inspection preferred B but found a teal model-reuse link originating at the matrix, ambiguous class-text input direction, and invalid template instances `{boat}/{bird}/{cup}`. One attached edit produced B2: teal reuse begins at the upper Text encoder, class text points into its lower counterpart, and one literal `a photo of a {label}` template sits above three class chips. Root initiated this focused edit while the separate initial factual review was running; first reading was already frozen. The independent reviewer subsequently recorded both initial findings and its own B2 acceptance. A separate source-blind rereading of B2 is retained.

Mild raster gradients were nonblocking in the independent raster review; solid native fills are an explicit approximation, not another claimed ImageGen iteration. The fourth call was not needed.

## Native verification and retained failures

Native artwork, labels, modules and connectors are individually editable. Exact counts in `output-v2/native-audit.json`: **26 native text boxes covering 30 SVG text lines; 42 native shapes; 23 semantic connector segments; 5 line-art connectors; zero pictures/media.** Transparent endpoint helpers and semantic groups are excluded from the content denominator.

Native source-v1 retained a stem across the upper Normalized embeddings annotation; source-v2 places the visible output fork below that label, preserving the target's gap. The first full export, `output-v1`, flagged two dashed reuse routes crossing the phase separator as edge-through-module collisions. B2 intentionally carries those links across the graphic train/use divider. Source-v3/output-v2 retains the same visible routes and records only the two exact owner-pair source-bound exceptions. The isolated native reviewer separately judges this justification; no checker or global threshold changed.

A small native glyph/type sample was rendered through LibreOffice and opened before accepting the full export. Full verification is **LibreOffice → PDF → MuPDF**, measured layout, frozen PNG anchors, native XML/object map, typography styles, requested/rendered Arial coverage, centered block line counts and actual route coverage. These checks pass for output-v2; final fidelity/editability review is separately recorded. No core skill code or unrelated test suite was changed or run for this case.

Earlier source-plan review rejected text-only evidence on the image-encoder reuse edge. Both reuse edges now cite the paper's broader Section 2.5 transfer statement; rejected proposal and review remain in `source-plan-v1-rejected/`. Column-aware extraction for pages 1–5 was appended to the raw layout text to preserve that statement without interleaved columns. The official PDF and model bytes were unchanged. Plan source-validation initially rejected both-phase edges on phase-specific nodes; the corrected model-weight nodes span phases and inference reuse edges remain distinct from train-only data/loss. All emitted bindings were renewed before generation.

## Limits

Exact raster font identity is unknown; measured Arial regular/bold approximates the observed roles. Gradients become source-matched solid fills; small boat/bird/cup contours, antialiasing and elbow roundness are approximate. Major silhouettes, composition, labels and scientific routes are preserved for review. Native orthogonal routes may need manual adjustment after grouped modules move. Interactive Microsoft PowerPoint editing and Microsoft PowerPoint rendering were not tested.

This is an agent-assisted source → ImageGen → manual native reconstruction case, not automatic arbitrary-code figure generation. An independent acceptance is scoped fidelity and communication review, not venue certification, a human reader study or superiority over author Figure 1.

Sources: [official paper](https://proceedings.mlr.press/v139/radford21a/radford21a.pdf), [pinned released model](https://github.com/openai/CLIP/blob/d05afc436d78f1c48dc0dbf8e5980a9d471f35f6/clip/model.py). Source bytes, licensing and hashes are recorded under `source/`. The paper's author artwork is not used in the README showcase; all displayed glyphs are newly authored schematic geometry.
