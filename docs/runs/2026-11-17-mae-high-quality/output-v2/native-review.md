# Independent native B2 review

## Verdict: ACCEPT

This is an isolated fidelity/editability review of the frozen B2 target, not a
benchmark, training, reconstruction-quality, or downstream-use claim. I wrote
`../native-reference-inspection.md` before opening `output-v2`; I did not author
or modify the scene, SVG, PPTX, contracts, or QA evidence.

## What I inspected

- `../selected-reference.png` (1774 x 887, SHA-256
  `0ea262af8cb3968d0c83ba05733cb27cb8469119227b83efa8a6b5b04d1e8766`)
- `editable.svg` and `preview.png`
- `native-render/preview.png` and `native-render/figure.pdf`, produced through
  the actual LibreOffice -> PDF -> MuPDF path
- `reference-svg-office-triptych.png` at full scale; target, SVG, and Office
  672 x 336 exports independently
- source implementation `source/models_mae.py:123-220`, the frozen target's
  reference geometry/transcript/contract, mechanical/layout/native/type/render
  QA, `pptx-object-map.json`, and slide XML.

## Fidelity findings

The target's horizontal sparse-to-full structure is retained. All independent
reference counts and routes match: 4 of 16 visible before Encoder; four encoded
tokens; a single learned mask token copied x12 only after Encoder; restored blue
cells at r1c1/r1c4/r3c2/r4c4; full 4 x 4 decoder/prediction grids; and an
identical-position white/unscored selector with the other 12 cells gold/scored.
The lower band remains supervision-only: target and prediction insets feed
masked-patch MSE, while the dashed binary-mask route feeds the selector. This is
consistent with the implementation's post-encoder restoration and masked-only
loss (`models_mae.py:172-214`).

All 25 text lines were preserved as actual native text, including the compact
lower labels. At 672 px, reference, SVG, and actual Office outputs preserve
readability, line breaks, arrowheads, dashes, token positions, and loss scope.
The permitted deviations are present and bounded: solid source-color fills
replace mild target shading; Arial Bold approximates the unknown raster face;
mountain microcontours differ slightly. I found no unauthorized layout, label,
count, route, title/footer, or scientific-content change.

## Native/editability findings

The SVG contains native `<text>` and no `<image>` or `<foreignObject>` content.
The PPTX slide XML independently contains 198 native shapes, 20 connector
segments, 25 literal `a:t` nodes, and zero `p:pic`/`a:blip` image media. The
object map and native audit crosswalk those to 21 native text boxes covering 25
labels, 147 native shapes, and zero pictures/media. The actual LibreOffice
render visually preserves the SVG structure.

Interactive Microsoft PowerPoint behavior was not tested, so this does not
claim that arbitrary user edits will automatically reroute complex connectors.
That limitation does not invalidate native construction or the inspected render.

## Separate, non-gating comparison with author Figure 1

I directly opened `source/author-figure-1-highres.png` and the same-width
`../author-versus-office.png`. The original is stronger as a compact paper
overview: its sparse/full token columns, oversized encoder/smaller decoder, and
flamingo crop convey the core asymmetry with unusually little text and faster
visual scan. Its photographic patch content also makes the reconstruction task
immediately concrete.

This B2 reconstruction is stronger as a self-contained explanatory variant:
it makes the 4/16 selection, post-encoder shared-mask insertion, reorder, and
masked-only objective explicit and countable. That clarity costs attention: the
two metadata paths and the lower loss inset make the B2 composition denser at
paper width, and its schematic landscape has less visual identity than the
author's photographic crop. This is not a superiority score and does not change
the reconstruction-fidelity acceptance; it is a role trade-off. For a single
minimal main-paper overview I would prefer the original's economy; for teaching
or documenting loss scope, B2 is the more complete figure.

`visual-review.json` and `reconstruction-review.json` bind this verdict to the
exact artifacts and their hashes.
