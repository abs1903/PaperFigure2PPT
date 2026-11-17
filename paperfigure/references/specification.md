# Figure specification

The full JSON Schema is [figure.schema.json](figure.schema.json). JSON is the MVP
input format. Do not describe YAML ingestion as implemented.

- `sources`: retained evidence text plus a URL/file/commit locator.
- `claims`: communication summary, innovation and baseline (nullable), scope.
- `nodes`: stable ID, label, optional detail, semantic role, novelty status,
  train/inference/both phase, exact source quotations.
- `edges`: stable ID, source and target node, optional local label, data/control/
  feedback kind, phase, novelty status and evidence. Non-feedback edges form a DAG.
- `groups`: node memberships and optional parent group. A child membership must be
  a subset of its parent's membership. No cycles or self-loops are silently repaired.
- `assumptions`: retained uncertainties, never drawn as undocumented facts.
- `layout`: canvas, LR/TB preference, optional per-node boxes, optional edge ports,
  port fractions, waypoints and label positions. Geometry never adds an edge.
- `visual`: theme, publication width and minimum text size, optional typography,
  illustrative node glyphs and opt-in title/subtitle/legend switches.

Reference-driven designs can additionally supply `visual.appearances` overrides for
individual nodes/groups/edges and `visual.artwork` for owned illustrative primitives.
Artwork can be native rectangles, ellipses, lines or text, or one independently
declared complex asset. It must name an existing semantic owner and state its
non-quantitative purpose; it cannot add scientific nodes/edges. Mark intentional
node-owned header rectangles `textBackground: true`; they render behind native text.
Text positions are relative to the owning node; artwork positions are canvas-local.
Assets must live under `assets/`, fit their owner, and are checked against embedded
SVG/PPTX bytes. An entire architecture image is not an allowed replacement.

Nodes and artwork can declare a two-stop `gradient` (`from`, `to`, `direction`),
which remains a native DrawingML gradient rather than a raster fill. Owned text can
select a font/italic style and native rich `runs` with subscript flags. Its literal
`text` must equal the joined runs. Crop viewports (`crop.x/y/w/h/sourceWidth/
sourceHeight`) display an independent part of an image through SVG viewBox and
PowerPoint source cropping; they do not flatten the architecture into a picture.
The retained source bitmap may contain the full design study, but only its photo
crop is visible, and all architecture components are reconstructed separately.

PDF exports resolve and embed installed fonts via fontconfig or macOS supplemental
fonts. This avoids silently replacing serif math or losing Greek glyphs. Unicode
PDF labels require an actual usable font file; a missing font is an export error,
not permission to deliver incomplete labels. Font choice can affect cross-machine
rendering even when the specification and native geometry are unchanged.

Port fractions are measured top-to-bottom on left/right and left-to-right on
top/bottom. Use distinct fractions to separate parallel outgoing and incoming
routes. Explicit routes
must actually meet their endpoints; all routes are checked for node occlusion.

Example typography configuration:

```json
{
  "theme": "paper",
  "publicationWidthIn": 7,
  "minTextPt": 7,
  "showTitle": false,
  "showSubtitle": false,
  "showLegend": false,
  "typography": {
    "fontFamily": "Arial",
    "moduleSize": 26,
    "detailSize": 23,
    "annotationSize": 23
  }
}
```

An evidence quote's textual presence is validated; its scientific entailment is
not. Group memberships, glyphs, labels and novelty claims still need source review.
Helvetica-based width estimates are portable and conservative but are not a font
shaping engine. For another font or non-Latin labels, inspect an independent render;
the checker reports the limitation. Fonts must be installed on the editing machine.

`spec.json` is the retained source; `scene.json` is resolved geometry and text.
`manifest.json` records source/semantic/generator hashes and artifact hashes.
SVG and PPTX use the same scene. Each PPTX route is a named native group of
straight `p:cxnSp` connector segments. Only the last segment has an arrowhead.
A prior attached custom-path approach rendered incorrectly in LibreOffice and
was removed. Delivered routes are deliberately not auto-attached to modules;
moving a module requires route adjustment. Native text boxes are separate from
the module shapes.
