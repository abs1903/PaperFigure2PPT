# AgeMem small-icon refinement

Source: original authors' [Agentic Memory, arXiv 2601.01885v1](https://arxiv.org/abs/2601.01885v1),
Figure 1(c), page 2, CC BY 4.0. Frozen crop/PDF coordinates, source hashes and
attribution/license evidence remain in `../source/provenance.json`.

`icons.mjs` manually recovers eight source icon families as smooth curves/shapes:
session scroll, query head, robot, crossed tools, maintenance gear/wrench,
document/tray, database and check. Twelve instances retain their original regions,
logical owners and repeated family identity. Each is an independent native group
with editable parts; the query question mark is native text, never an outline.

The old ten-color contours had disconnected strokes and eroded shapes. This
revision replaces those local approximations rather than tracing a full bitmap.
Fine source anti-aliasing and exact icon artwork remain approximate; this is a
source-guided redraw, not recovery of original authors' icon design source files.
No modules, scientific edges, non-icon primitives or original labels are changed.
A separate SVG stroke-under-marker repair prevents round shaft ends protruding
through closed arrow tips and matches the native Office head sizing.

Current verified files are in `../output-v15/`. Earlier `output-v13/` contains the
first isolated-review candidate; its robot corner shape was rejected and repaired.
`output-v14/` is a mechanical intermediate. Previous `output-v12/` remains intact.

From the `paperfigure/` directory:

```sh
node examples/agentic-2026-layout/agemem/icon-refinement/refine.mjs NEW_OUTPUT
uv run --with pymupdf --with numpy python scripts/render-layout.py --out examples/agentic-2026-layout/agemem/NEW_OUTPUT --checks
node scripts/icon-detail-check.mjs --out examples/agentic-2026-layout/agemem/NEW_OUTPUT --reference examples/agentic-2026-layout/agemem/source/reference.png --regions examples/agentic-2026-layout/agemem/source-primitives.json --previous examples/agentic-2026-layout/agemem/output-v12/preview.png --report examples/agentic-2026-layout/agemem/NEW_OUTPUT/icon-detail-r2
node examples/agentic-2026-layout/agemem/icon-refinement/verify.mjs NEW_OUTPUT
npm test
```

Choose a new output/report directory; scripts refuse overwrites. Node dependencies,
isolated Chromium/Playwright and LibreOffice/PyMuPDF/NumPy requirements are documented
in the parent example README. No image-generation API or paid service is required.

`icon-detail-r2/contact-sheet.png` shows original, previous, new SVG and actual
native PPTX for all twelve instances. `icon-detail-qa.json` verifies actual native
curve controls/extents, color, opacity, line width/caps, grouping and text coverage.
The initial `icon-detail/` checker result is retained as diagnostic evidence: it
incorrectly required shape fills for line-only connectors. The checker now treats
such connectors as unfilled line geometry; a regression test covers this case.

`verification-final.json` binds artifact hashes and verifies unchanged architecture,
non-icon primitives and byte-identical SVG/PPTX regeneration. Mechanical evidence
is separate from the isolated review under repository `docs/`. Microsoft PowerPoint
interactive dragging remains untested; actual native rendering uses LibreOffice.
