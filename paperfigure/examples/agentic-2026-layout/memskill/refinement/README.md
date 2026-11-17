# MemSkill detail refinement

Source: original authors' [MemSkill, arXiv 2602.02474v1](https://arxiv.org/abs/2602.02474v1),
Figure 2, page 4, CC BY 4.0. The frozen PDF/PNG, exact crop and attribution/license
record remain in `../source/provenance.json`. External paper captions are excluded.
This is an editable source-guided reconstruction, not a newly proposed method.

The verified reconstruction is `../output-v13/`; independent review records are in repository
`docs/MEMSKILL_REFINEMENT_REVIEW_V13.md`. Check its verdict before accepting the
candidate. `verification-final.json` contains only mechanical acceptance.

## Changes

- Twenty-three non-text icons in seven families: six speech bubbles, six compasses,
  six trace strips, one compound memory bank, two frozen snowflakes, one trainable
  flame and one optimization-loop symbol. Each is an independent native group.
- The six strips preserve all nine positions, including intentional blanks and the
  source circle/square/diamond sequence. Each divider and glyph is editable.
- Memory Bank retains its cylinder, bridge and five memory slots; the reset
  indicator now connects to the visible bridge top rather than empty space above
  a rounded corner. Target module and semantic relationship remain unchanged.
- Sequence formulas have consistent base/subscript size and baseline and are
  centered within their cells. Current-span math and Input/Memory/Update labels
  are centered within their existing regions/shafts. All 238 text fragments retain
  their literal content and owners. Existing twelve centered text blocks remain.
- Closed SVG heads use the shared clean-tip/native-sizing option; native arrow
  properties and every other edge object remain unchanged.
- Source skill/failure card stacking is preserved with the existing exact,
  geometry/source-hash-bound occlusion exceptions. Original fonts and meaningful
  palette are retained; gradient transfer backgrounds stay user-authorized solids.

`icons.mjs` authors source-guided coherent curves, not traced word outlines or a
full-image shell. `refine.mjs` reuses the prior accepted layout and checks topology
and semantic hashes. `verify.mjs` checks all text, non-target primitives, formula
metrics, actual token positions, original source hash and byte regeneration; it
creates source/SVG/native comparisons and a dedicated readable wide token sheet.

## Reproduce

From `paperfigure/`, using the existing Node dependencies and isolated browser
runtime described in the parent example README:

```sh
node examples/agentic-2026-layout/memskill/refinement/refine.mjs NEW_OUTPUT
uv run --with pymupdf --with numpy python scripts/render-layout.py --out examples/agentic-2026-layout/memskill/NEW_OUTPUT --checks
node scripts/icon-detail-check.mjs --out examples/agentic-2026-layout/memskill/NEW_OUTPUT --reference examples/agentic-2026-layout/memskill/source/reference.png --regions examples/agentic-2026-layout/memskill/NEW_OUTPUT/icon-regions.json --previous examples/agentic-2026-layout/memskill/output-v12/preview.png --report examples/agentic-2026-layout/memskill/NEW_OUTPUT/icon-detail
node examples/agentic-2026-layout/memskill/refinement/verify.mjs NEW_OUTPUT
```

Use fresh directories; scripts refuse overwrites. No paid API is used. Earlier
accepted outputs are preserved. No shared renderer code changes are required by
this paper-specific refinement.

## Output evidence and limits

`editable.svg`, `preview.png`, `figure.pptx`, `layout-scene.json`, native object map,
change log, region list, measured QA and actual Office rendering are delivered.
`icon-detail/contact-sheet.png` shows original/previous/SVG/actual native PPTX.
`token-strip-comparison.png` keeps narrow nine-cell sequences legible; a square
contact sheet alone downsamples them too much. Compare all blank positions as well
as visible symbols. Full comparisons are `comparison-original-svg.png` and
`comparison-svg-pptx.png`.

Smooth shapes are manual source-guided approximations; source raster anti-aliasing,
exact icon proportions and original math typefaces are not recovered perfectly.
Actual native rendering uses LibreOffice -> PDF -> MuPDF, not an interactive
Microsoft PowerPoint editing session. Whole-figure layout/semantic preservation,
mechanical checks, and isolated visual acceptance are separate evidence dimensions.
