# AgeMem icon refinement and reusable detail-control workflow

Date: 2026-11-16. Final artifacts:
`paperfigure/examples/agentic-2026-layout/agemem/output-v15/`.
Source: frozen original authors' AgeMem arXiv 2601.01885v1 Figure 1(c), CC BY 4.0;
see the unchanged `source/provenance.json` for exact crop, PDF and PNG hashes.

## Outcome

Twelve source icon instances in eight families were refined as smooth editable
curves/shapes: session scroll, query head, robot, crossed tools, maintenance
gear/wrench, document/tray, database and check. The earlier automatic ten-color
contours had disconnected outlines and eroded fine detail. The new source-guided
redraws retain original placement, source identities and palette; they are not
replacement clip art or embedded rasters. Repeated instances share family geometry.
Each icon is a native semantic group inside its original module, with individual
editable parts. The visible question mark is a text box, not a glyph outline.

The independent first review rejected v13's overly square robot heads. V15 uses
proper quarter-circle Bezier corners for all three instances. A separate cross-
format defect was also repaired: wide SVG round caps protruded through narrowing
arrow tips. Opt-in SVG shaft masks and matched head dimensions retain logical
route endpoints/styles while producing clean pointed tips matching Office output.

## Evidence

- All original module definitions and complete edge objects are unchanged from v12.
- Every original non-icon primitive is byte-for-byte unchanged in the scene.
- Original label wording/layout is unchanged; the existing raster question-mark
  symbol has been recovered as one additional native text element.
- Measured SVG layout: pass, zero errors/unwaived warnings; 34 native text
  fragments including the restored question mark, ten logical connections.
- Actual native PPTX: 28 text boxes, 12 semantic connector segments, 38 line-art
  connectors, 146 native shapes; 224/224 native content objects. The denominator
  excludes 20 transparent auxiliary ports and semantic groups. No pictures/media.
- Twelve native icon groups, 157 independently editable icon parts, including one
  native text glyph. The icon audit reads actual control points, extents,
  fill/stroke, opacity, explicit line caps and physical group ownership from XML.
- Independent LibreOffice -> PDF -> MuPDF render: pass; five centered text blocks
  and ten route-coverage checks. Enlarged source/previous/SVG/native crops are in
  `icon-detail-r2/contact-sheet.png`. Pixel differences are diagnostic only.
- Final SVG and PPTX regenerate byte-identically from the saved scene. Existing
  AgeMem and MemSkill v12 SVG/PPTX also regenerate unchanged under default options.
- Full `npm test`: **86/86 passed, zero skipped**, about ten seconds; log:
  `docs/test-results-agemem-icons.txt`.
- New regressions cover real native icon grouping/text ownership, invalid group
  IDs/cross-module/interleaved paint order, corrupted actual path/fill data,
  line-only connector treatment, and an actual browser-pixel negative control for
  broad shaft exposure through pointed tips.
- Skill creator `quick_validate.py paperfigure`: valid. `git diff --check`: clean.
- Fresh non-authoring visual/source comparison: **PASS for all twelve icons and
  SVG/PPTX consistency**; exact inspected hashes are in
  `docs/AGEMEM_ICON_REFINEMENT_REVIEW_V15.md`. The rejected v13 review is preserved.

`output-v15/verification-final.json` binds generated/rendered evidence and unchanged
architecture. Separate `delivery.json` binds that evidence to the isolated review.

## Reusable Skill changes

The entrypoint now conditionally loads `references/detail-fidelity.md` for small
icon, hole, stroke and arrow-tip defects. It adds the following concrete controls:

1. Diagnose at intended paper size and enlarged source-bound regions; inventory
   repeated families and characteristic parts before repair.
2. Prefer original PDF vector/text evidence where available; reject broken
   automatic contours instead of treating quantization or a low global error as
   finished artwork.
3. Repair compact coherent curves with stable part IDs; preserve silhouette,
   holes/opacity, source palette and native glyph text. Group each icon natively
   and reuse one consistent family construction for repeated instances.
4. Compare original/previous/SVG/actual-PPTX crops, inspect fill rules, cap/join
   behavior and final full composition. Guard non-target primitives and topology.
5. Verify actual native geometry/styles with `scripts/icon-detail-check.mjs`,
   independently render the PPTX, and keep diagnostic similarity separate from
   acceptance.
6. Ask a fresh non-authoring reviewer to inspect exact outputs; repair concrete
   failures and re-review new files; bind review hashes before delivery.

The exporter additions are opt-in (`groupIcons`, `cleanArrowTips`), so existing
scenes and source layouts are not silently changed. Icon grouping validates IDs,
owners and paint order before grouping. Source code and reproducible commands are
in `examples/agentic-2026-layout/agemem/icon-refinement/README.md`.

## Limits

These are source-guided smooth vector approximations, not the original authors'
icon source files or pixel-identical tracing. Fine raster shading/anti-aliasing,
some proportions and the exact question-mark typeface can differ slightly. Solid
colors follow the user's constraint. Source informal font choices remain intact.
No interactive Microsoft PowerPoint dragging test was performed; static native
rendering was checked through LibreOffice. Mechanical/agent acceptance is not a
claim of venue-level publication approval.
