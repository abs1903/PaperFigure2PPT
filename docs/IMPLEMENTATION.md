# PaperFigure MVP implementation and verification

Date: 2026-11-15 (Asia/Shanghai). Scope: AI paper architecture / method overview.
The workspace began empty. A local Git repository was initialized; no remote,
commit, public repository, deployment or paid external API call was made.

## Review correction

The initial VLM visual design was rejected by the user and then independently
rejected in [INDEPENDENT_VISUAL_REVIEW.md](INDEPENDENT_VISUAL_REVIEW.md). The
mechanical results below remain valid for that baseline, but must not be read as
visual acceptance. A separate reference-driven revision, review gate and follow-up
independent decision are recorded in [VISUAL_REVIEW_REVISION.md](VISUAL_REVIEW_REVISION.md).

## Outcome

The self-contained skill lives in `paperfigure/`. Codex interprets the source;
the local renderer consumes the resulting evidence-backed JSON. The three retained
natural-language methods were interpreted into specs and actually rendered to SVG,
PDF, PNG and native PPTX. Draw.io source and a compact PNG preview are also included.
Examples are original illustrative system definitions, not paper reproductions.

Default figures have no title, subtitle, footer, footnote or legend. Source and
assumption records remain outside the image. Font family and global/per-module
sizes are configurable; labels remain native PowerPoint text boxes.

## Automated results

`npm test`: **34 passed, 0 failed, 0 skipped**, including all three end-to-end
fixtures, font/default controls, invalid evidence/graphs, overlaps, overflow,
route occlusion/crossings, source protection, artifact corruption, deterministic
SVG/PPTX regeneration, installation, symlinked CLI execution and library import.
Raw output: [test-results.txt](test-results.txt).

The bundled skill-creator validator reported `Skill is valid!`. Its first launches
were blocked by missing PyYAML and a broken host Python/pip platform probe. An
isolated pure-Python dependency was prepared outside the repository; no system
Python installation or generated validator was modified.

Independent clean-copy installation was exercised outside the workspace. `npm ci`
from the lockfile succeeded using the local npm cache, and the installed CLI built
the VLM example with zero QA errors/warnings. Paper and monochrome palette candidate
commands and Helvetica/global font scaling were also exercised successfully.

| Example | Semantic nodes / edges | Native shapes / connector segments | QA errors / warnings | Native object ratio | Minimum per-edge raster route coverage |
| --- | --- | --- | --- | --- | --- |
| vlm | 7 / 6 | 38 / 10 | 0 / 0 | 100% | 100% |
| tool-memory-agent | 5 / 6 | 20 / 14 | 0 / 0 | 100% | 100% |
| physical-vln | 8 / 9 | 27 / 20 | 0 / 0 | 100% | 100% |

The native-object ratio counts actual PPTX shapes and connectors versus pictures;
it is not a human editing-effort score. Connector segment counts exceed semantic
edge counts because each bend is a grouped route of native straight connectors.
No full-figure PNG is embedded in the PPTX.

## Independent rendering and a failure that changed the implementation

All three delivered PowerPoint files were independently converted by LibreOfficeDev
26.8.0.0.alpha0, rasterized by Poppler, and visually inspected alongside the SVG PNG.
See [final contact sheet](render-contact-sheet.png); left is SVG, right is PPTX.
Individual reports and difference images are inside each output's `rendered-pptx/`.

An initial custom-path connector with automatic endpoint attachments passed XML
checks but rendered at wrong attachment positions in LibreOffice. The retained
[before-fix contact sheet](qa-before-connector-fix.png) shows why structural tests
were insufficient. Whole-image MAE was small despite incorrect thin arrows.

The delivered route uses grouped native straight connector segments, canonical
flip transforms and an explicit custom dash pattern. It renders consistently in
the tested renderer. A per-edge ink-coverage gate was added, with 3px tolerance and
a fixed 90% minimum per edge. Every final example reached 100% of sampled visible
route points. A deliberately displaced raster arrow fails the metric's regression
test. This checks route alignment, not aesthetics or full mathematical equivalence.

The trade-off is explicit: connector segments are not automatically bound to module
shapes. Moving modules in PowerPoint requires adjusting the route. Automatic endpoint
attachment was not retained merely to make the editability claim sound stronger.

## Visual reference and semantic review

One built-in image-generation call produced the VLM composition reference. The
prompt, image and provenance are retained in that example's `design-reference/`.
The image is not the scientific source and is not embedded as the final diagram.
Unsupported decoder details, token ornamentation, headings and footers were not
copied. The final graph follows the retained natural-language method. Node/edge
quotes were checked by the generator, and the method/graph were reviewed during
implementation. There has been no independent researcher semantic assessment.

## Limits and unmeasured dimensions

- Scientific entailment is not proven by quotation presence; real paper/code/sketch
  intake is an agent workflow and has not been benchmarked on a held-out corpus.
- Visual quality has been inspected and revised, including user feedback. There is
  no evidence supporting a blanket claim of top-conference publication quality.
- Microsoft PowerPoint interaction and timed human editing cost are unmeasured.
  LibreOffice rendering is verified; automatic module-to-edge tracking is absent.
- Latin Arial/Helvetica is the tested font path. Other fonts and non-Latin shaping
  need independent rendering review; the width estimator uses Helvetica metrics.
- The paper-pattern corpus is intentionally unpopulated pending source/rights review.
  Phase 2 has an exercised reference/reconstruction path, not a learned visual optimizer.

The six-dimension evaluation protocol is packaged in
`paperfigure/references/evaluation.md`. Next-phase work is in [ROADMAP.md](ROADMAP.md).
