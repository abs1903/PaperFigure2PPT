# Independent review: native reconstruction of LLaVA study C

## Verdict

**Accepted for the concrete native reconstruction review, within the architecture-only
scope.** The editable output preserves the user-accepted C layout and its restrained
finish while making the requested source-safe corrections. This is not a top-venue
quality certification, a human/user approval, or a test of interactive Microsoft
PowerPoint editing.

I independently inspected these actual rasters:

- `examples/llava-paper/design-studies/c.png` (visual reference)
- `examples/llava-paper/output/preview.png`
- `examples/llava-paper/output/figure.png`
- `examples/llava-paper/output/figure.pdf`, rasterized for inspection as
  `/tmp/paperfigure-research/llava-pdf-font-fix.png`
- `examples/llava-paper/output/rendered-pptx/figure.png` (LibreOffice render)

The companion `output/visual-review.json` records the exact inspected artifact and
reference hashes.

## Visual-fidelity assessment

The native result keeps the essential visual language of C rather than flattening it
into a generic flowchart:

- The upper visual lane and lower instruction lane retain their clean, separate entry
  paths into a compact central Vicuna region. Neither spacing nor routing recreates
  the earlier rejected end-panel layout.
- The image crop, restrained navy/teal/amber palette, softly graded module fills, thin
  dark connectors, document endpoint, and quiet white gutters closely match C's
  finish. The image remains an illustrative input rather than a dominant panel.
- Replacing C's pseudo-layer bars with the LM-local “Autoregressive decoding” and
  conditional notation creates a more honest, less decorative core without leaving a
  visually empty container.
- Typography remains clear and proportionate at the native preview and Office render.
  The QA warning for the Greek `φ` is a metric-coverage warning, not an observed
  glyph failure: `f_φ` is legible and correctly positioned in both inspected rasters.
- The Office render preserves composition, gradients, crop, label hierarchy, arrows,
  and response endpoint. It does not exhibit an appearance regression versus the
  native preview.

## PDF font-fix follow-up

The prior SVG-to-PDF fallback defect is resolved in the currently inspected PDF. Its
rendered raster shows the same formulas, italics, subscripts, and Greek `φ` as the
native preview: `H_v = W Z_v`, `f_φ`, and `p(X_a | H_v, H_q)` are all present and
legible. `pdftotext` also extracts `fφ`, but the decision here is based on the visual
inspection, not text extraction alone. The SVG changed only font-weight notation and
the specification/native geometry remain unchanged; no material PDF-specific visual
regression was observed.

## Scientific assessment

| Item | Assessment |
| --- | --- |
| Image -> frozen CLIP ViT-L/14 -> `Z_v` | Correct and source-supported. |
| Learned linear `W`, `H_v = W Z_v` | Correct; the added “Learned linear” label repairs the earlier ambiguity. |
| `X_q -> H_q` and separate `H_v`/`H_q` routes to Vicuna | Correct architecture-only abstraction. It avoids an unsupported Text Embedding module, fusion module, or fixed serialization. |
| “Autoregressive decoding” and language-response endpoint | Source-supported and clearer than the reference study's unlabeled document. |
| `p(X_a | H_v, H_q)` | Acceptable as an explicitly representation-level shorthand for the sourced conditioning relation. It is not the paper's literal Equation 3, which uses image/instruction notation; it must not be described as a verbatim transcription. |
| Stage-dependent frozen/trainable schedule | Intentionally omitted under the revised architecture-only scope and retained in `METHOD.md`; no static status is incorrectly assigned to Vicuna. |

No Q-Former, MLP projector, cross-attention adapter, fixed layer/depth claim, or
fixed token count is shown. The token motifs are labelled representations with
ellipses and are documented as non-quantitative.

## Editability and delivery limits

Mechanical QA passes with 79 native shapes, 11 native connector segments, 19 native
text boxes, and one picture object. The picture is the illustrative cat input only;
the figure is not a full-canvas bitmap. The standard limitation remains: connector
segments are native but not automatically attached, so a user who moves modules must
adjust routes manually.

This acceptance is deliberately narrower than a venue-level verdict. The supplied
LibreOffice render, PDF raster, and route check pass, but Microsoft PowerPoint
interaction and rendering are not independently tested. The retained design reference
is a visual study rather than an authority for scientific facts.
