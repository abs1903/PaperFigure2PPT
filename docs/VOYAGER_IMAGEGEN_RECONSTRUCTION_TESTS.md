# Voyager PNG reconstruction verification

Scope: `paperfigure/examples/voyager-imagegen-reconstruction/output-v10/`.
This is native reconstruction of the frozen imagegen source, not scientific
validation of its depicted Voyager implementation or a venue-quality claim.

## Completed checks

- `node --test paperfigure/tests/reconstruction.test.mjs`: **12/12 pass**.
  These are diagnostic checker regression tests, not image-fidelity tests.
- `reconstruction-check.mjs` on the real source, SVG and inventory: **pass**,
  zero native-structure errors; original dimensions and SHA-256 match.
- `verify.mjs output-v10`: **pass**. Actual PPTX XML is well formed; all IDs unique;
  every object mapped; each native label's literal text and semantic owner retained;
  no raster pictures, embedded SVG images or gradient fills.
- PPTX independently converted using LibreOffice headless -> PDF -> Poppler PNG:
  **completed** at 2061 × 763. The source SVG and PPTX renders were opened and
  inspected. Microsoft PowerPoint itself was not used.
- Reproduction: `reproduction-check-v10/` has byte-identical SVG, inventory,
  object tree and object map. The complete PPTX file reproduces byte-for-byte after ZIP timestamps and
  creation metadata are normalized.

## Native object denominator

The actual slide has 56 groups, **69 text boxes**, **32 connector segments**,
**90 native vector shapes**, and **0 pictures**. The 14 semantic routes consist
of independent straight connectors plus vector bends and arrowheads in route
owners. Native object representation is 191/191 non-group objects. This ratio
measures representation, not aesthetic quality, source fidelity, automatic
rerouting, or fine-grained editing convenience.

## Diagnostics, not acceptance scores

- Source PNG vs rendered SVG normalized RGB MAE: **0.0610613742208049**.
- Rendered SVG vs independent PPTX normalized RGB MAE: **0.026348093377364924**.

Flat fills intentionally change many pixels. Font rasterization also differs.
Neither value is a visual-fidelity percentage or an acceptance threshold.
The reconstruction checker deliberately leaves visual acceptance unreviewed.
The isolated review is recorded separately and cannot be replaced by these checks.

## Known limits and scope

Source fonts are approximated. SVG uses native Menlo/DejaVu Sans Mono fallbacks; PPTX uses native DejaVu Sans
Mono with source-matched character spacing. Licensed font files are supplied;
this does not claim recovery of the original imagegen font. Icon contours are simplified at subpixel scale. The Minecraft
illustration preserves recognizable source silhouettes using flat gray layers;
fine texture changes remain visible. Connectors are native and grouped but
unbound to automatic attachment sites. Source code/skill text is retained as
illustration content and was not executed or independently certified as Voyager
API truth. See the case README and isolated review for remaining visual issues.

## Typography repair evidence

The earlier Courier New revision had the wrong serif family and low glyph height.
The V9 trial exposed different fallback selection in SVG and LibreOffice. V10
uses compatible installed SVG Menlo and native PPTX DejaVu Sans Mono, with all
text retained natively. Dark-pixel bounds for code line 2 in the fixed native
crop are source `[608,463,893,479]`, SVG `[609,462,893,477]`, and PPTX
`[609,464,894,479]`. These are diagnostics for glyph extent, not typeface identity
or independent visual acceptance. See `output-v10/code-metrics.json`.

## Independent review

[V10 independent review](VOYAGER_IMAGEGEN_RECONSTRUCTION_REVIEW_V10.md) passes
reference fidelity and SVG/PPTX native editability within the explicit flat-fill
permission and documented font/texture limitations. Earlier revise records remain
preserved; they are not the acceptance record for the V10 delivery.
