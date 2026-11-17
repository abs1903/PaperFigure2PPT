# Small-detail fidelity and SVG/PPTX consistency

Read when small icons, outlines, holes, arrow tips or cross-format appearance look
wrong. Use with `png-reconstruction.md` and `layout-and-arrows.md`; this is a
focused repair pass, not permission to redesign the reference.

## Diagnose at two scales before adding detail

Inspect the whole figure at its intended paper size, then enlarged crops of each
problem region. Build a source-bound inventory of icon families, instances, owners
and original `[x,y,width,height]` regions. Distinguish missing identifying parts
from raster anti-aliasing, font differences and deliberate user-authorized changes.
Repeated instances must retain one consistent family geometry at their existing
positions/scales. Do not turn paper-specific icon motifs into a universal style.

Prefer original vector/text evidence from an available source PDF. Inspect its
actual raster crop too: extraction can omit zero-area strokes, soft masks or
inline images. Automatic color-contour recovery is a candidate, not final artwork.
Disconnected outlines, eroded checks, noisy faces or broken database rims require
repair even if their global pixel-error score is low. More quantization colors or
thousands of tiny paths do not establish fidelity or practical editability.

## Repair the owning vector source

For small illustrated icons, recover a compact set of source-guided curves and
shapes with stable part IDs. Preserve silhouette, characteristic components,
relative size, original palette, interior holes and intended transparent areas.
Check rounded rectangles geometrically: putting both Bezier controls at a corner
can leave a nominally rounded head visually square. Restore readable continuous
outlines rather than keeping contour noise. Report manual approximation honestly.

Author each repeated family once, then instantiate independent editable parts at
the source regions. Give every icon its own SVG group and native PPTX group inside
its module, so a user can select/move the icon or edit a part. Keep actual glyphs
(such as a question mark) as native text. Never trace words into paths or replace
an entire icon/figure with an embedded raster to improve a comparison score.

The layout exporter supports opt-in `groupIcons: true` with `primitive.icon` IDs.
Grouping rejects colliding IDs, cross-module ownership and interleaved paint order;
it must not silently reorder foreground/background content. Default legacy output
is unchanged. Independent part IDs retain the same native source data in both
formats; physical group ownership is recorded in `pptx-object-map.json`.

Check stroke width, line cap/join, fill/opacity, winding and compound-path holes in
both rendering engines. A filled disk over a hole may look correct on white and
fail on a colored module. Confirm the actual interior, not just a bounding box.
Wide SVG round-capped shafts can protrude through pointed marker tips; compare the
whole tip with native Office rendering. `cleanArrowTips: true` masks only the shaft
under closed SVG heads while retaining the logical route and visible head. It
currently requires explicit polyline terminal tangents. Test this on the intended
renderer rather than assuming marker/native-head equivalence.

## Make a local comparison and inspect actual Office output

First run measured layout QA, the native XML audit, and independent PPTX rendering
as described in `layout-and-arrows.md`. Then create a source-region contact sheet:

```sh
node scripts/icon-detail-check.mjs \
  --out OUTPUT \
  --reference ORIGINAL.png \
  --regions SOURCE_REGIONS.json \
  --previous PREVIOUS_PREVIEW.png \
  --report NEW_DETAIL_DIRECTORY
```

`SOURCE_REGIONS.json` contains an `icons` array with stable `id` and original `box`.
The command uses `OUTPUT/layout-scene.json`, `pptx-object-map.json`, `figure.pptx`,
`preview.png` and the actual `native-render/preview.png`. It writes a four-column
original/previous/SVG/native-PPTX contact sheet and `icon-detail-qa.json`.
It checks actual native part geometry, fill/stroke/opacity, explicit line caps,
text coverage and physical grouping. Native curve controls and shape extents are
compared in slide coordinates, not merely counted from a manifest.

Pixel differences are diagnostics without an acceptance threshold. Geometry/style
checks do not establish source identity, legibility or correct holes. Reopen every
icon family at enlarged scale and at final paper size, and check repeated instances
for consistency. Finally inspect the entire diagram for unintended changes to
labels, connectors, spacing, colors and clipping. Record permitted changes and
verify graph endpoints and non-icon primitives against the prior accepted scene.

## Isolated acceptance and bounded iteration

Give a fresh non-authoring reviewer the original PNG, previous candidate, new SVG
render, independently rendered PPTX, region sheet and machine evidence. Request
separate source-fidelity and SVG/PPTX-consistency findings, with concrete region/part
IDs. Do not provide a desired verdict. The author repairs specific failures in a
new output directory; the reviewer reopens that exact revision and records hashes.

Stop when the requested defects and required checks pass. Deliver the vector/PPTX,
preview, region comparison and unresolved differences. State which engines were
actually tested. Native object ratios, agent acceptance and static LibreOffice
rendering are not proof of interactive Microsoft PowerPoint behavior or a venue's
publication-quality approval.

Worked example: `examples/agentic-2026-layout/agemem/icon-refinement/` repairs twelve
instances in eight families. Its source code, original source regions, rejected
candidate review, final review and native detail checks remain reproducible.

For narrow symbol strips, inspect enlarged crops at their original aspect ratio; a square contact sheet may hide glyph or blank-position errors. See `examples/agentic-2026-layout/memskill/refinement/` for six nine-cell strips, native compound-icon anchors and measured formula alignment.
