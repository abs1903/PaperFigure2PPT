# PaperFigure end-to-end replay and visual-quality check

Date: 2026-11-16. Scope: replay one existing design case and one existing
reference reconstruction using the current single skill, actual Office rendering,
and fresh independent source/visual review. No image generation, model inference,
paid API, simulator execution or new scientific experiment was performed.

## Final result

Both final candidates have `deliveryReady: true` after actual Office rendering
and fresh independent review. The original Voyager candidate remains rejected;
its mechanical/render passes do not override the failed review.

| Candidate | Mechanical | Actual render | Independent review | Final gate |
| --- | --- | --- | --- | --- |
| Voyager v1 | pass | pass | revise: typography/composition | unready, exit 2 |
| Voyager v3 | pass | pass | accept: readable method figure | ready, exit 0 |
| AgeMem reconstruction v2 | pass | pass | accept: faithful reference reconstruction | ready, exit 0 |

- Voyager: [editable PPTX](design/output-v3/figure.pptx),
  [actual Office raster](design/output-v3/rendered-pptx/figure.png),
  [vector PDF](design/output-v3/figure.pdf),
  [independent re-review](design/visual-review-v3.md),
  [delivery state](design/output-v3/delivery.json).
- AgeMem: [editable PPTX](reconstruct/output-v2/figure.pptx),
  [actual Office raster](reconstruct/output-v2/native-render/preview.png),
  [Office-rendered PDF](reconstruct/output-v2/native-render/figure.pdf),
  [delivery state](reconstruct/output-v2/delivery.json).
- [Machine-readable results](summary.json) retain all final stage states and
  the rejected baseline. The v3 inventory is 74 native shapes, 16 connector
  segments, 33 text boxes and zero pictures. The v3 review calls it adequate
  and readable, not aesthetically superior to the author figure.

## What this run tests

- Design: pinned Voyager automatic `learn()` overview, starting from
  `paperfigure/examples/voyager-agent/refinement/spec-final.json`.
- Reconstruction: AgeMem Figure 1(c), exact retained source PNG and PDF-vector/icon
  inventory, starting from `agemem/output-v15/layout-scene.json` and the frozen
  source-aware typography profile. Original authors retain copyright; source
  provenance records CC BY 4.0.
- Actual Office means isolated LibreOffice conversion followed by PDF raster/text
  inspection, not Microsoft PowerPoint GUI interaction.

These are two selected, previously authored cases. This is a reproduction and
repair exercise, not a held-out benchmark of automatic design from arbitrary code.

## Source and review evidence

Each reviewer started in a fresh context, audited raw sources first, then received
actual candidate paths. Neither authored the candidate it reviewed. Reviews are
attributed and bound to exact artifact/reference hashes. Source and visual
conclusions remain separate. Historical review verdicts were not reused.

- [Voyager source audit](design/source-audit.md),
  [initial visual rejection](design/visual-review-v1.md),
  [source-bound readability revision](design/revision-v3.md).
- [AgeMem source audit](reconstruct/source-audit.md),
  [actual native-render visual review](reconstruct/visual-review-v2.md).
- [Before/after actual Office rasters](voyager-revision-comparison.png).

## Retained failures and fixes

AgeMem's first attempt stopped before export because the reference checker
identified nested icon groups as semantic module owners. The native scene already
used independently editable icon groups, so this was a real integration defect.
`reference-layout.mjs` now walks to the nearest ancestor whose ID is an actual
scene module. A grouped-icon regression verifies both successful binding and
rejection of a genuinely wrong module owner. No reference tolerance was raised.
The failed attempt is retained in `reconstruct/execution-v1.log`.

The rerun input changes only anchor metadata: bind the canvas background to its
visible source shape and replace three removed pre-refinement icon IDs with their
existing visible icon group IDs. Frozen source-vector/icon boxes define the
contract regions; they are not estimated from the new output. Primitives, labels,
edges, operations and exceptions are unchanged. The original accepted AgeMem and
MemSkill artifacts remain byte-identical; see [preservation check](preservation-check.json).

Voyager v1 passed export/Office checks but was independently rejected for visual
quality: about 7.1-pt minimum text at seven inches and dense secondary annotations.
The first enlarged-font candidate v2 failed mechanical text-fitting checks; its
spec, output and QA errors remain intact. V3 fits the enlarged labels, removes
repeated labels and excessive borders, and uses an exact single-line released
skill excerpt. All seven nodes, twelve relations, source evidence, claims, phases
and state assumptions are retained. Only presentation labels are removed/shortened;
no scientific relation is invented or dropped. The minimum text is 8.6625 pt.

## Mechanical and actual rendering evidence

Voyager v1 has zero pictures, 82 native shapes, 16 native connector segments and
39 text boxes. V3 also uses zero pictures, with the revised object inventory in
`design/output-v3/qa.json`. Actual Office routing and vector-PDF text checks passed.
AgeMem has 224/224 native content objects, no pictures/media, 28 text boxes covering
34 SVG labels, and 12 semantic connector segments. Its actual Office rendering,
source-bound typography attributes and observed Arial/Comic Sans MS/Times New Roman
font coverage passed. Native representation does not measure human editing effort.

The grouped-anchor reference suite passed 8/8 tests; both output-validation
integration tests passed 2/2 after the fix. `git diff --check` passed. These checks
are separate from the independent visual verdicts.

## Interpretation of code-generated quality

The actual files demonstrate that native code export supports complex editable
geometry, text and icons with faithful static Office rendering. They do not show
that automatic layout is sufficient. The starting Voyager spec explicitly places
all seven nodes, all twelve routes and 59 artwork elements. The AgeMem scene
inherits a paper-author composition, source PDF geometry, selected fonts and
source-guided icon redraws. Both rely on authored design decisions.

The original Voyager Figure 2 uses concrete Minecraft tasks/world observations
and skill icons to communicate progression. The tested overview emphasizes the
implementation's refinement and state flow. It has a different scope; readability
repair does not establish superiority over the author's communication design.
The independent reviews discuss these trade-offs explicitly.

At its original 2.0736-inch crop width, AgeMem's target already has very small
fine print; the native reconstruction retains that limitation. A fidelity pass
therefore does not establish improved publication readability or original-design
quality. A limited agent acceptance is not user approval or venue certification.
