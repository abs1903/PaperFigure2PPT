# Independent visual review: VLM reference reconstruction

## Scope and verdict

This review independently inspected the following raster artifacts at normal overview
size and their side-by-side Office rendering:

- `paperfigure/examples/vlm/design-reference/imagegen-v1.png` (1983 x 793)
- `paperfigure/examples/vlm/output/preview.png` (1440 x 585)
- `paperfigure/examples/vlm/output/rendered-pptx/figure.png` (1600 x 650)

It also checked `method.md`, `spec.json`, the generated QA report, and the code that
creates the QA/render reports. It did **not** modify the generator or figure assets.

**Verdict: not acceptable as a reconstruction of the supplied design reference, nor
yet at the requested top-conference/journal visual bar.** The output is a technically
clean, readable, editable architecture *flowchart*. It retains the high-level graph,
horizontal modality flow, dominant LM region, muted palette, and a separate dashed
training branch. It does not retain the reference's compact scientific-diagram
composition, modality-specific visual language, or information density. The native
PowerPoint render is visually consistent with the preview; that confirms rendering
integrity, not reference fidelity.

## Observed visual discrepancies

| Region | Reference | Native preview / PowerPoint render | Effect |
| --- | --- | --- | --- |
| Overall composition | Tight 2.5:1 composition with an intentional upper visual path, lower text path, and a large decoder anchor. | Large rounded cards on a sparse canvas; the lower half has substantial unused white space. | Reads like a generic presentation flowchart, not an authored method figure. |
| Visual-tokenization region (left) | A dashed, lightweight enclosure contains a small illustrated input, frozen encoder, trainable projector, and a short feature grid. | A large pale rounded container holds two equally card-like modules; the image is outside it and a generic landscape glyph replaces the scene tile. | The hierarchy and visual narrative are weaker; the frozen/trainable distinction is only text. |
| Image input | A small original scene tile gives the image input immediate visual identity. | A generic landscape icon sits in a tall, oversized box whose label occupies much of the card. | This is a substantial loss of specificity and compactness. |
| Token modalities | Teal visual-token strip and lavender text-token strip are visible at their respective streams. | Streams are conveyed only by floating labels, “Visual tokens” and “Text tokens.” | The two inputs are less instantly distinguishable and the reference's modality encoding was not transferred. |
| Language-model anchor (centre-right) | Large, carefully framed decoder with a context strip and repeated internal processing motif; it clearly owns the composition. | Plain blue card with two large white “Decoder block” rectangles and an ellipsis. | The intended dominant technical centerpiece is reduced to a simple container; its visual hierarchy is much flatter. |
| Input merge and labels | Token strips lead cleanly into the same LM inlet, with a clear two-stream visual merge. | The visual label sits on a white patch over the top arrow; the text label floats well above the routed lower arrow. | Labels are readable but appear overlaid after the fact rather than integrated with the encoded streams. |
| Training branch (right/bottom) | Purple dashed branch, nearby italic “training only,” and a compact loss endpoint make the phase distinction a secondary branch. | Dashed gray route descends from the LM to a large salmon loss card; “Training only” is inside the card. | Semantically usable, but training-only is visually less branch-specific and the loss receives disproportionate visual weight. |
| Typography and geometry | Small, restrained typography, thin precise strokes, mostly squared scientific-panel geometry. | Large bold labels, broad padding, prominent rounded cards, and thick visual mass. | It conflicts with the retained prompt's explicit “not a business process flowchart or PowerPoint slide” direction. |
| Native-render parity | Not applicable. | The PowerPoint render matches the preview in composition, labels, and routing; only expected raster/font-weight differences are visible. | No material fidelity regression was observed between the preview and LibreOffice render. |

## Scientific and evidence boundaries

The final graph is materially consistent with `method.md`: image -> frozen vision
encoder -> trainable projector -> decoder-only LM -> answer; text prompt joins the
same LM; the LM also has a training-only supervised-loss route. The method does not
support a specific answer sentence, attention/FFN sublayers, a fixed decoder depth,
or exact token/layer counts.

Safe visual transfers from the reference are: a compact left-to-right/two-stream
composition; dominant LM framing; restrained blue/lavender/teal/sand palette;
lightweight group enclosure; small non-semantic image illustration; and visual versus
text token *motifs*, provided they are clearly illustrative and do not assert a count
or add an edge. A short colored strip can be used as a glyph for an already-labelled
stream rather than as an unlabelled new tensor/module.

The following require source evidence and should remain absent unless obtained:

- self-attention/FFN internals or their ordering;
- an asserted number of decoder blocks or tokens;
- the reference's example answer content;
- any implication that frozen/projector status applies beyond the stated modules;
- an optimizer/gradient path from loss or any other hidden connection.

The generated reference's visible “(a) Vision-language inference” heading is not
safe to transfer under this task's default no-title/subtitle/footer/fine-print rule.
The final correctly omits it. The reference's self-attention/FFN detail and generated
answer are also correctly rejected on scientific grounds. Those correct omissions do
not justify losing the other transferable compositional qualities.

## Review-workflow audit

The repository documentation correctly says that geometry, image similarity, and
native-object ratio do not establish visual or scientific fidelity. The implementation
does not enforce the required human visual review, however.

- `build` writes a passing `qa.json` after schema/layout/XML/object checks. Its
  `visualQuality` value is the unresolved string `requires-render-review`, so a pass
  is not a visual-quality pass.
- `render-check.mjs` is a separate command, not a build gate. It verifies that Office
  route ink coincides with the generated route and records preview-vs-LibreOffice MAE
  and foreground IoU. It never compares either result with `imagegen-v1.png`.
- Existing tests assert non-empty exports, native editability, bounds, collision,
  label geometry, and route alignment. No test requires a recorded human assessment,
  final-width visual inspection, reference-side comparison, or a fidelity decision.
- `evaluation.md` proposes a human protocol, but no review record, rating, acceptance
  checklist, or build status consumes that protocol. The current VLM output therefore
  demonstrates structural regression coverage, not completed visual acceptance.

## Prioritized acceptance criteria for a revision

### P0 — must pass before calling the figure visually accepted

1. An independent reviewer records a side-by-side inspection of the reference,
   preview, and independently rendered PPTX at the intended 7-inch publication
   width. The record explicitly evaluates hierarchy, reading order, stream identity,
   branch phase clarity, and unwanted flowchart appearance; “QA passed” alone is not
   sufficient.
2. The revision preserves the verified seven nodes and six directed edges exactly,
   with no attention/FFN, fixed-depth, token-count, answer-content, optimizer, or
   hidden decorative connection claims. The supervised-loss edge remains visibly
   dashed and unambiguously training-only.
3. It has no visible title, subtitle, footer, legend, footnote, or provenance/fine
   print. Native text remains selectable and adjustable; modules and connectors
   remain native/editable; SVG, PDF, PNG, and PPTX must be regenerated and pass the
   existing structural checks.
4. At final width, no edge label appears detached from its associated route, no route
   touches/obscures text, and the two streams have distinct but non-quantitative
   visual encodings.

### P1 — composition and top-venue quality bar

5. Replace the generic-card composition with a compact two-stream layout: image and
   visual-tokenization above, prompt below, both feeding a clearly dominant LM anchor;
   reduce the empty lower canvas area and normalize intentional gutters.
6. Use lightweight scientific-panel geometry rather than uniformly oversized rounded
   cards. The visual-tokenization enclosure should recede; the LM should be the
   unmistakable primary visual anchor without importing unsupported internal details.
7. Restore transferable, source-safe modality motifs: a small original illustrative
   input tile; short teal visual-token and lavender text-token glyph strips; and a
   restrained phase-specific supervision branch. Motifs must be native primitives,
   not rasterized portions of the reference.
8. Reduce label scale, padding, and stroke mass; use compact, consistently aligned
   typography. The answer and loss should be endpoints, not visual peers of the LM.

### P2 — make review repeatable

9. Require a checked-in or output-local `visual-review.md`/JSON record with reviewer,
   artifacts inspected, ratings/comments, known limitations, and a pass/fail decision.
   Treat missing visual review as `unreviewed`, not publication-ready.
10. When a design reference is supplied, require a reference-comparison checklist
    (composition, palette, hierarchy, spacing, and safely transferable motifs), while
    explicitly excluding pixel-level similarity as the success metric. This preserves
    scientific independence while making visual reconstruction auditable.

## Current deliverable status

- Semantic graph: source-traceable illustrative overview; visually reviewed here as
  plausible, but not a claim of a paper-specific architecture.
- Editability/export: the produced QA reports native shapes/text/connectors and all
  requested export formats; the inspected LibreOffice raster confirms no material
  preview-to-render composition break.
- Visual fidelity and venue quality: **fails this independent review** for the reasons
  above. A focused layout/style revision plus a recorded human review is required.
