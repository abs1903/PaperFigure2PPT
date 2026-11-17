# PNG to native editable SVG: fidelity-first reconstruction

Use when a user supplies an architecture PNG and asks to reconstruct, trace or
convert it into editable SVG/PPTX. This is a separate mode from designing a new
method overview. Codex performs image interpretation and native authoring; the
CLI does not contain an automatic PNG parser, OCR engine or image vectorizer.

## Contract and precedence

The supplied PNG is the visual authority. Preserve canvas/aspect ratio, placement,
relative sizes, colors, font appearance, line weights, dashes, arrowheads, icons,
local labels and fine details as closely as the evidence permits. Do not optimize
its layout, simplify it to generic cards, replace its illustrations or silently
change its design. Aesthetic assessment and reference fidelity are separate verdicts;
an imperfect reference is not permission to redesign it.

The new-design defaults (solid colors, no title/footer, English labels, preferred
fonts) do not silently override a supplied reference. Keep its existing labels and
visible elements unless the user requests changes. If the user also requests a
specific change, record it as an explicit exception, preserve the rest, and review
against the reference plus that exception. Generated references use this workflow
once selected as the reconstruction target; do not demote them to loose inspiration
while claiming faithful reconstruction.

Visible relations are evidence of what the image depicts, not proof of scientific
truth. Flag suspected scientific issues separately; do not invent hidden modules or
correct arrows without authorization. Publication suitability is a review goal,
not a guaranteed venue certification or a consequence of matching pixels.

## 1. Inspect and freeze the reference

Open the actual PNG at full view and in relevant crops. Retain the original file,
its hash, dimensions and transparency. Record the chosen target, user constraints
and allowed changes in a reconstruction contract before authoring. Never replace
the reference with a newly generated proposal during reconstruction.

Create a mandatory reference transcript and object ledger: every visible label,
module, arrow/arrowhead and icon has a stable ID, semantic owner, and original-PNG
region `[x, y, width, height]`. Record expected module/edge/icon/label counts from
the image before tracing. Maintain a region-by-region discrepancy checklist;
counts and roles are independently compared to the original, not self-certified.

Inventory the visible objects and relationships:

- Exact label strings, line breaks, positions, approximate font family/style/size,
  alignment, subscripts/superscripts and confidence of transcription.
- Module/group boxes, nested hierarchy, corners, strokes and fill samples.
- Each directed edge, bends, junctions, arrowhead geometry, line pattern and labels.
- Icons/illustrations, their internal paths and ownership, clipping and stacking.

Use original PNG coordinates as the initial SVG `viewBox`. Record uncertain text,
unknown fonts and unrecoverable details; do not substitute plausible labels or
claim the original font was identified from pixels alone. If essential text cannot
be read reliably, request that missing information rather than inventing it.

## 2. Author native, semantically grouped SVG

Use independently editable primitives, not a traced full-image shell:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
  <g id="module-encoder" data-role="module">
    <rect id="encoder-box" x="100" y="180" width="220" height="100"/>
    <text id="encoder-label" x="210" y="235" text-anchor="middle">Encoder</text>
  </g>
  <g id="edge-encoder-projector" data-role="edge">
    <path id="encoder-projector-route" d="M 320 230 H 420" fill="none"/>
  </g>
</svg>
```

Give modules, edges and icons stable `<g id>` owners. Keep labels as real `<text>`
with `<tspan>`/native baseline shifts where needed. Draw modules using shapes;
draw connectors and icons with independent vector paths/shapes. Preserve z-order,
clipping, transforms and nested semantic groups. Paths are valid for geometry and
icons, **never as a replacement for label glyphs**.

Forbidden: embedding the complete PNG as `<image>`, splitting it into a raster
mosaic, hiding a screenshot behind superficial vectors, outlining words into paths,
or rasterizing text to make matching easier. Default to an entirely native SVG.
If a genuine photographic subimage cannot be recovered as vectors, disclose it as
an unresolved exception and seek an explicit user choice; do not report a partially
raster deliverable as an entirely native reconstruction. The strict native checker
intentionally rejects every `<image>`, including an authorized photograph exception.
Such a mixed deliverable needs a separate exception review and remains outside a
strict-native pass; no exception field silently bypasses this checker.

Maintain an object inventory used for both SVG and PPTX. A direct SVG authoring
path is allowed when the existing Figure Specification renderer cannot reproduce
the reference. Do not force the reference into automatic layout or scale/typography
limits that change its appearance. Existing `export.mjs` emits flat SVG primitives;
it is not an arbitrary-SVG importer and does not itself create semantic `<g>` owners.
A reconstruction must author those groups explicitly or add a verified exporter
extension; do not claim the existing renderer already satisfies this requirement.

## 3. Render and compare, then repair the owning elements

After each meaningful revision, render the SVG at the source PNG's dimensions.
Compare full views and enlarged regions: canvas/proportions, module geometry,
spacing/alignment, text content/font/baselines, stroke/arrowheads, icon detail,
clipping, overlap and stacking. Make a discrepancy list with object/region IDs,
observed differences and corrections. Repair SVG/object-inventory source, not the
rendered PNG. Retain materially different candidates and unresolved limitations.

A diagnostic command is available (run from the installed skill folder):

```bash
node scripts/reconstruction-check.mjs \
  --reference /path/to/original.png \
  --svg /path/to/figure.svg \
  --inventory /path/to/inventory.json \
  --out /path/to/new-comparison-directory
```

The versioned inventory binds the actual reference PNG and enumerates expected
visible text, separate module/edge/icon groups and individual vector elements.
`container` is allowed for hierarchy but is not a substitute for component groups.
Roles are closed: `module`, `edge`, `icon`, `container`; vector kinds are `shape`,
`connector`, `icon-part`, `decoration`. Populate actual hashes and regions:

```json
{
  "version": "1.0",
  "reference": {"width": 1200, "height": 600, "sha256": "<actual PNG SHA-256>"},
  "expectedCounts": {"modules": 1, "edges": 1, "icons": 0, "labels": 1},
  "labels": [{"id": "encoder-label", "text": "Encoder",
              "owner": "module-encoder", "referenceRegion": [100, 200, 220, 40]}],
  "groups": [{"id": "module-encoder", "role": "module",
              "referenceRegion": [100, 180, 220, 100]},
             {"id": "edge-encoder-projector", "role": "edge",
              "referenceRegion": [320, 228, 100, 4]}],
  "objects": [{"id": "encoder-box", "kind": "shape", "owner": "module-encoder",
               "referenceRegion": [100, 180, 220, 100]},
              {"id": "encoder-projector-route", "kind": "connector",
               "owner": "edge-encoder-projector", "referenceRegion": [320, 228, 100, 4]}],
  "backgroundIds": []
}
```

Declared labels must be direct rendered text, outside definitions, not zero-opacity,
zero-size or hidden, and inside their declared owner. All drawable vectors need ledger
entries and component ownership; arrows use edge groups and icons icon groups.
Use explicit attributes/inline presentation for this strict checker; global stylesheets
are marked unsupported because their visibility effects are not resolved here.
Known hidden-text cases (including zero scale/singular matrices and zero textLength)
are rejected; this remains a limited structural visibility audit, not proof of
painted glyph visibility. Clipping, masks, transforms, tiny/off-canvas
glyphs and semantically false inventories still need actual-image/manual review;
this checker does not prove that every declared label really depicts the original.
A single catch-all layer is not a faithful semantic inventory even if someone falsely
calls it a module. The independent reviewer must compare its regions/counts to PNG.

The command emits a rendered `preview.png`, `overlay.png`, amplified
`difference.png`, `side-by-side.png` (original left, reconstruction right), and
`report.json`. Structurally rejected inputs produce the report only; repair them
before rendering the comparison. It checks the bound reference hash, declared visible native `<text>`, semantic
`<g>` and vector ledger, counts, IDs and ownership, flags raster/foreign-object content and canvas mismatch, and
records pixel/alpha diagnostics. It does not perform OCR, identify outlined text,
prove that the inventory is complete or establish aesthetic fidelity. A malicious
or incomplete inventory cannot be made truthful by a checker. Manual inspection
must verify that all visible original labels are accounted for as native text.

Pixel error is diagnostic: blank backgrounds, anti-aliasing and font rasterization
can distort it. Never adopt a universal similarity threshold or infer visual
acceptance from a low error. Preserve transparency; the visual comparison composites
on white and reports alpha error separately. Unsupported rendering remains a failed
or unverified check, never permission to flatten the figure.

## 4. Reconstruct and inspect editable PPTX

Build PPTX from the same object inventory/coordinates: labels as native text boxes,
modules as shapes, edges as connectors, icons as grouped native geometry where
feasible. Do not insert the complete SVG or PNG as one picture and call the slide
editable. Complex independent SVG icons are a disclosed lower-editability fallback;
never use them to replace native text/modules/edges.

This part is **agent-assisted authoring and manual/XML verification**, not a
capability implemented by `reconstruction-check.mjs`. If native PPTX authoring or
independent rendering is unavailable, deliver only the verified SVG/PNG and mark
PPTX missing or candidate; do not assert completion of that output.

Require a `pptx-object-map.json` crosswalk for each source ledger ID: actual
PowerPoint `objectName`, native XML type, owner/group, covered segments and any
explicit exception. Text maps to `p:sp` text boxes with literal `a:t`; module shapes
to native shapes; connectors to `p:cxnSp` (possibly multiple route segments); groups
to native groups where supported. Record per-label content/font/bounds and per-edge
geometry/arrowhead comparison. The shared inventory drives authoring and this map,
not an import-as-one-picture operation. Inspect the actual ZIP/XML and save counts,
missing IDs and limitations as `pptx-native-audit.json`; zero evidence is unverified.

Inspect the actual PPTX XML for text/shapes/connectors versus pictures. Render it
independently and compare against both the original PNG and SVG preview. Explain
font substitution, unsupported effects, connector attachment limits and any partial
raster/SVG-icon exceptions. If equivalent appearance and editability cannot both
be retained, report the specific tradeoff and preserve the more faithful SVG;
do not silently degrade either output or promise automatic arbitrary SVG→PPTX.

## 5. Isolated fidelity review and delivery

Give a fresh isolated reviewer the original PNG, explicit allowed deviations,
SVG/object inventory, render/overlay/difference files and independent PPTX preview.
Do not give the creator's desired verdict. Ask it to assess reference fidelity and
native editability separately; a cleaner redesign that loses the source composition
must be returned for revision. Reopen revised artifacts after fixes. Record hashes,
concrete differences and unresolved elements in `reconstruction-review.json`.
That record must contain separate `referenceFidelity`, `svgNativeEditability`, and
`pptxNativeEditability` verdicts (`pass`/`revise`/`unverified`), plus reviewer/isolation
identity, exact reference/ledger/SVG/preview/PPTX/PPTX-render/object-map/audit hashes,
region-checklist findings, authorized deviations and unresolved exceptions. Omit
no missing-output status: SVG success cannot imply PPTX native-editability success.
PPTX acceptance requires the object-map/XML evidence and independent rendered
comparison; if those are missing its verdict remains unverified. No record format
or a checker's diagnostic result proves actual inspection; retain review evidence.

For a reference-bound `layout-scene.json`, the shared `review-status` gate uses
its reconstruction evidence adapter; see [evaluation.md](evaluation.md) and
[reference-routing.md](reference-routing.md). A directly authored SVG/PPTX outside
that scene contract still needs the attributed reconstruction review above; it
cannot inherit readiness by copying manifests. The diagnostic checker alone leaves
visual acceptance unreviewed. User rejection always takes precedence.

Deliver `figure.svg`, `preview.png`, the most-native feasible `figure.pptx`, the
object inventory/generation source, comparison previews, and a concise limitations
report. State what is faithfully recovered, approximate or unverified (especially
fonts, unreadable text, complex artwork and native PPTX equivalence). If no PNG has
yet been supplied, add/configure the workflow but do not claim an actual image has
been reconstructed or validated.

## Worked reconstruction case

For a complete source-registered example, load
[`examples/voyager-imagegen-reconstruction/README.md`](../examples/voyager-imagegen-reconstruction/README.md).
It preserves an imagegen layout with explicit solid-fill permission, native text,
source-derived non-text icon contours, segmented native connectors, independent
PPTX rendering, an object crosswalk and isolated source-fidelity review. Its
coordinates and crop list are specific to that frozen PNG, not a generic automatic
vectorizer. Read the case limitations and latest review before reusing its authoring
pattern; native representation alone is not source-fidelity acceptance.

## Alignment and connector editing

When the task involves overflow, centering, routing or arrow properties, also read
[layout-and-arrows.md](layout-and-arrows.md). It defines actual ink-bound measurement,
source-preserving collision repair, native centered text blocks, attachment ports,
editable head/tail/dash/stroke properties, and editing/re-render tests. Distinguish
intentional source stacking from an unresolved collision and verify PPTX separately.

For broken small-icon contours, repeated motifs, holes, stroke/marker tips and local cross-format defects, load [detail-fidelity.md](detail-fidelity.md) for source-region comparison, native icon grouping and isolated re-review.
