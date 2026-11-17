# BLIP-2: code-first figure versus author Figure 3

## Result and comparison scope

A real new-paper example now produces native SVG/PPTX/PDF/PNG/Draw.io from the
pinned Salesforce LAVIS `pretrain_opt2.7b` generation route. The first semantic
inventory and native figure were frozen before visually inspecting the author's
figure. Source excerpts, commit hashes and intermediate failures are retained.
This is one source-audited case, not evidence of general top-venue design quality.

Primary sources:

- [Paper and publication record](https://proceedings.mlr.press/v202/li23q.html),
  Li, Li, Savarese and Hoi, ICML 2023, pp. 19730–19742.
- [Author Figure 3, top branch, PDF page 4](https://proceedings.mlr.press/v202/li23q/li23q.pdf#page=4).
- [Official pinned OPT implementation](https://github.com/salesforce/LAVIS/blob/05cb670f47296522e24e7727e366b4a997d28582/lavis/models/blip2_models/blip2_opt.py).

Our target is configured **caption generation**. The author's Figure 3 explains
second-stage **generative pretraining**, with decoder and encoder-decoder branches.
Only its top decoder branch is closely comparable. Excluding FLAN-T5 and first-stage
objectives is scope selection, not recovery of every part of BLIP-2.

## Observed differences

| Aspect | Author Figure 3 top | Current PaperFigure case | Assessment |
| --- | --- | --- | --- |
| Main route | Encoder → Q-Former → FC → decoder | EVA-CLIP-G → separate LayerNorm → Q-Former → opt_proj → explicit concat → OPT-2.7B | Same broad bridge; ours exposes implementation interfaces. |
| Queries | Learned query strip and output representations | 32 learned queries; query-to-image attention label | Exact count and query-only inference path come from code/config. |
| Text | Training/generation framework abstraction | Optional prompt, tokenization/OPT embeddings, empty default | Additional configured inference detail, not an omission/error in author figure. |
| Prefix | Projected representations enter decoder as soft prefix | Ordered visual-prefix and prompt regions in a parameter-free concat node | More explicit order, at the cost of space and another junction. |
| Frozen state | Strong blue backbones and snowflakes | Blue frozen modules; gold source-default trainable modules; neutral activations/operations | Colors have declared meaning and are consistent across module classes. |
| Composition | Compact, roughly one-row decoder story | Wider two-lane input story plus concat under decoder | Author is more compact; ours spends area on implementation detail. |
| Graphic grammar | Distinct encoder silhouette, small token strips, thin decoder bar | Soft gradients, serif type, mostly rounded modules | Ours has a quieter unified finish, but weaker shape differentiation and a generic document endpoint. This is subjective, not a superiority claim. |
| Output specificity | Illustrated input/output example | Illustrative input photo and generic decoded-caption endpoint | Ours avoids inventing a model result but loses the concrete task demonstration. |
| Editable source | Not evaluated; published PDF alone is insufficient | Measured native text/shapes/connector segments | This establishes our artifact editability only; no claim about authors' authoring files. |

The local comparison sheet normalizes both diagrams to the same horizontal width.
It is not equal information density, font size, diagram area, or experimental scope.
No numeric aesthetic ranking is inferred from this sheet.

## What independent review changed

1. Initial `output/` passed mechanical checks but was rejected by the isolated
   reviewer: both inputs entered the outer OPT box without visibly mapping into
   its internal ordered prefix strip. The final source represents actual `torch.cat`
   as a separate parameter-free concatenation node, with explicit incoming/output
   routes. This is a communication repair, not a newly invented model component.
2. Direct PDF inspection found that `svg-to-pdfkit` interpreted SVG
   `orient="auto-start-reverse"` incorrectly for a downward end arrowhead. A tiny
   standalone reproduction confirmed it. Exporter now uses supported `orient="auto"`
   (all markers are end markers). A raster regression tests both downward-head wings;
   route coverage alone had missed this real defect.
3. User required scientifically meaningful colors. The final palette removes teal
   decoration and the unique Q-Former highlight. Q-Former, LayerNorm and linear
   projection now share the trainable category; both frozen backbones and the OPT
   embedding table share blue. Input/output and parameter-free operations are neutral;
   activation motifs are neutral regardless of modality. Photo colors are input data.

The first native figure remains hash-frozen. The concat and color revisions occurred
**after** author inspection. Neither the final complete specification nor this run
is represented as an entirely blind held-out reconstruction. Text search snippets
and prior model knowledge were never controlled.

## Verification

- `docs/test-results-blip2.txt`: **42/42 tests passed**, zero skipped, about 5.9 s,
  under a 30 s test-batch budget. Includes actual PDF raster arrowhead regression.
- `verify_case.py`: **5 retained source files and 8 frozen artifacts** match hashes;
  final concat topology and declared category colors pass consistency assertions.
- Final mechanical QA: **11 semantic nodes, 10 logical edges**, zero errors.
  One honest warning remains: analytic text bounds use Helvetica metrics, while
  serif appearance was checked by independent rendering.
- Native inventory: **79 shapes including 24 text boxes, 15 connector segments,
  one independent input-photo crop**. Native-object ratio **98.95%** is a count,
  not an area-weighted ratio or proof of scientific correctness. The architecture
  itself is native, not a full-figure bitmap.
- Independent LibreOffice and source-PDF renders: route checks pass; PDF label
  extraction is complete. The post-fix query arrowhead is additionally raster-tested.
- Source-semantic and visual findings are attributed in `BLIP2_CODE_AUDIT.md`,
  `BLIP2_NATIVE_REVIEW.md` and `BLIP2_FINAL_REVIEW.md`. Mechanical QA never substitutes
  for their verdict or user acceptance.

The secondary Draw.io exporter does not preserve the input-photo crop viewport;
its visual appearance is not accepted as equivalent. The reviewed deliverables
are PPTX/SVG/PDF/PNG.

No model weights, training, optimizer updates or actual caption generation ran.
Trainability is from constructor/config defaults, including the separately created
LayerNorm, not a measured parameter update. Interactive Microsoft PowerPoint edits
and human editing time were not measured. Connector endpoints do not auto-follow
moved modules; routes require manual adjustment after repositioning.

## Provenance and next design lesson

Selected source files retain Salesforce BSD-3-Clause notices and `LICENSE.txt`.
The project's MIT license does not relicense those files. Author figure reuse
rights were not established, so no author image/PDF is bundled with the skill.
The user-requested local crop/contact sheet stays in ignored `dist/`, with attribution;
only source links and original pattern descriptions enter the example library.
The generated input cat is illustrative, not an author evaluation sample.

This case suggests a useful next improvement: decide the reader's target question
before exposing code detail. A compact method overview can suppress implementation
interfaces, while a source reconstruction must name them precisely. Both modes need
an explicit semantic contract; neither should be made prettier by silently changing
its input routes or coloring each box differently.
