# Measured text layout, editable connectors, and collision repair

Read this workflow for reconstruction or revision requests involving alignment,
text overflow, routing, or arrow properties. It supplements `png-reconstruction.md`;
it does not authorize a new composition. Native editability and visual fidelity
remain separate acceptance dimensions.

## 1. Freeze source and permitted changes

Keep the source PNG unchanged and hash it. For a paper figure, record the paper
version, page, selected panel, crop coordinates, rasterization scale, source PDF
hash, and license. Keep a separately downloaded HTML figure's hash separate from
that of a PDF-derived crop. Avoid titles/captions added outside the actual figure.

Create a `layout-scene.json` contract: modules/hierarchy, independent source text
IDs, primitives, logical directed edges, edge operations, and explicit layout
constraints. `layout-constraints.schema.json` describes this editable contract.
Scientific IDs/relations must survive layout repair. An operation printed on an
arrow (for example Segmenter) must be recorded even when it has no box. A new box
would change the reference. Resolve ambiguous training arrows against the paper;
a reward for a trainable controller must not accidentally target a frozen executor.

## 2. Assign text roles and actual containers

For each label, record its owner and permitted text region. Center short module
labels with **each line horizontally centered** and the **multiline block
vertically centered** within a padded text region. Use `centerTextIds`, `textBox`, and `minPadding`; an icon may occupy a
separate part of a header. Do not center each line across an unrelated entire panel.

Keep code, lists, equations, and source-aligned prose in their appropriate alignment;
record the reason. A caption belonging to a compound icon may sit outside the
icon silhouette while remaining inside its logical module. Do not treat that as
unexplained overflow. Preserve all words and hard line breaks unless rewrapping
is necessary and explicitly recorded.

Measure actual glyph ink using the rendering engine and font, not a character-count
estimate or a nominal textbox. `layout-inspect.mjs` combines Chromium canvas
`actualBoundingBox*` glyph metrics with SVG character positions and transforms.
It retains SVG `getBBox()` line boxes separately: line boxes can overlap even
when visible glyphs do not. Also check positioned text advance before native export: ink may fit while the
PowerPoint paragraph unexpectedly wraps. Use a measured wrap guard. Neither a successful font lookup nor a structural check
proves identical typeface rendering across SVG and PowerPoint.

Repair in this order: fix the assigned region/alignment; wrap at measured word
boundaries; restore consistent line spacing; adjust padding/nearby space; apply a
small explicit font reduction above the readable floor. Do not delete words,
clip text, stretch glyphs arbitrarily, or silently shrink labels until a check passes.
If the readable floor cannot fit, stop that repair and enlarge the box or choose
an explicitly reviewed layout change. `wrapText` rejects an oversized single token.

## 3. Define arrow properties and edge anchors

Each logical edge records `from`/`to` module, side, fraction or an explicit offset
on a compound silhouette; path points; stroke color/width; dashed/solid style;
start/end arrow type; arrow size; line cap; explicit dash/gap lengths; and meaning/phase when relevant. Arrow types:
`none`, `triangle`, `stealth`, `open`, `diamond`, `oval`. SVG markers and native
DrawingML arrowheads must agree with these properties. Labels are separate text.

An offset anchor needs a source-based reason and inspection against the visible
silhouette; a bounding rectangle's interior is not automatically a valid port.
Connectors must end on the intended module, with the tip at its boundary, rather
than on its text or on a nearby container that hides an omitted scientific relation.

Preserve source routes when clear. For requested repairs, use a straight edge,
orthogonal route, or an explicitly measured curve. `routeOrthogonal` uses a sparse
visibility graph with clearance, turn, and crossing costs; it fails if no corridor
exists. It never routes a straight line through an obstacle as a fallback. Avoid
unnecessary turns and shared overlapping shafts. Recompute routes when modules,
labels, or font sizes change. Hash topology before/after reflow and refuse any
unrequested relation change.

### PowerPoint editability boundary

Use actual `p:cxnSp` connectors with native stroke/dash/head/tail properties. Keep
source arrows separate from module artwork. A polyline may use a semantic group
of native connector segments; the terminal segment carries the arrowhead.

The tested exporter uses tiny **transparent native port helpers** grouped with each
module to attach `a:stCxn`/`a:endCxn` reliably. They are auxiliary connection handles,
not figure artwork or hidden text. List their IDs, owners, positions and count,
and exclude them from content/editability denominators. This avoids office engines
reinterpreting custom freeform connection sites and moving arrows to corners.

Move a module as its logical group. Endpoint binding does not prove automatic
rerouting of every intermediate segment. Reflow the scene or manually edit handles
after a complex move, then re-render and inspect. Do not promise interactive
PowerPoint behavior that was only checked through LibreOffice. Current native
export supports polyline connector routes; SVG curve measurement is available,
but faithful native bound-curve reconstruction is not implemented. Do not silently
flatten an unreviewed curve.

For centered labels, emit native text blocks with paragraph centering, vertical
middle anchoring and editable wrapping. A visually centered left-aligned textbox
that drifts when its wording changes is insufficient. Map the native block back
to every independent SVG text ID it covers. Source-aligned paragraphs stay native
text with their documented alignment.

## 4. Detect collisions and repair explicitly

Run measured layout QA after every relevant repair:

```sh
node scripts/layout-inspect.mjs --svg editable.svg --scene layout-scene.json --out NEW-layout-qa.json
```

Check text overflow/centering, text intersections, module overlap, edge/text and
edge/module collisions, detached/missing anchors, crossing/overlapping routes,
minimum margins, and layer order. Curves require measured geometry; missing SVG
paths must fail rather than being replaced by claimed manifest coordinates.

Preserve intentional source stacks and occlusion, such as overlapping skill cards,
with specific source-based owner-pair exceptions for module stacking. Label
occlusion needs an exact text/shape pair, a geometry fingerprint, and the frozen
source PNG SHA-256; all are mandatory. Changing relative geometry or typography
invalidates the exception. Joint translation preserves it. Report approved overlaps
separately from unresolved defects. Do not globally disable a collision class or
add blanket exceptions merely to make a report green. The source still needs
visual review: a bbox can include white space, and stroke/marker/clip effects need
inspection as well as geometry.

`layout-reflow.mjs` fits declared centered blocks and can move modules and reroute
incident edges while checking scientific topology:

```sh
node scripts/layout-reflow.mjs --scene layout-scene.json --out NEW_OUTPUT --move retriever:12:0
```

Edit font/label-region and arrow properties in the scene before regenerating;
primitives retain native text and vector data. `figure-geometry.mjs` supplies the
pure geometric checks and the router. Reflow is bounded to three text-fitting
passes by default; unresolved defects remain failures rather than false success.

## 5. Independently render both deliverables

Render SVG to `preview.png` and compare with the frozen reference, using overlays,
region crops and side-by-side views. Keep an explicit list of layout changes and
unresolved differences. A pixel similarity statistic is diagnostic, not fidelity.

Inspect actual PPTX XML: native text, real connectors, expected styles, endpoint
IDs/port positions, semantic ownership and no raster replacement. Render the PPTX
independently and inspect its actual text bounds and line positions. Font fallback,
wrapping and custom-site interpretation can change the result even when SVG QA
passes. `render-layout.py --out OUTPUT --checks` independently renders the full
PPTX, isolated centered-text blocks, and isolated connectors, checking actual ink,
line counts and route coverage. It needs LibreOffice plus Python PyMuPDF/NumPy
(`uv run --with pymupdf --with numpy python scripts/render-layout.py ...`).
Fonts are resolved in a conversion-process-only configuration; no global changes.
Use a fresh isolated reviewer for source fidelity and visible layout;
provide original PNG, both renders, change list, QA reports and native evidence.

Runtime: Node dependencies from this skill; measured QA additionally requires
Playwright and an isolated Chromium executable. Codex's bundled runtime and a
system Chrome installation are discovered automatically. Otherwise install
`playwright` plus Chromium, or set `PAPERFIGURE_PLAYWRIGHT` / `PAPERFIGURE_CHROMIUM`.
Run `npm test` for the default regression suite, including real browser layout
tests; `npm run test:unit` alone is intentionally narrower.
No active browser session is connected to or restarted. Missing browser measurement
is **unverified**, never a successful estimate.

## 6. Verify actual editing and deliver

Include negative tests that enlarge/displace text, detach an endpoint or route
through a module, and ensure the checker catches them. Then repair/re-render at
unchanged topology. Test a module move and an arrow stroke/dash/head change in a
new output directory; inspect native XML and the rendered result. For example:

```sh
node scripts/layout-reflow.mjs --scene layout-scene.json --out EDIT_TEST \
  --move query:12:0 \
  --edge-style 'query-input={"width":3,"dashed":true,"dashPattern":[10,6],"endArrow":"stealth","arrowSize":"med","lineCap":"square"}'
```

`--font-family Arial --font-scale 1.05` adjusts declared centered label blocks;
other source text remains independently editable in SVG/PPTX. These flags do not
promise to repair arbitrary paragraph edits automatically. These tests
exercise editability rather than mirroring the renderer.

Deliver `editable.svg`, `preview.png`, native `figure.pptx`, scene/generation source,
reference comparison, measured QA, native audit, and an isolated review. Report
coverage and denominators: constrained blocks, checked labels/edges, native text,
connectors, auxiliary ports, intentional source exceptions, remaining defects,
fonts, and verified rendering engines. Do not equate zero mechanical errors with
conference-level visual quality or exact font recovery.

Worked tests: [2026 agentic paper cases](../examples/agentic-2026-layout/README.md).

For local icon/stroke/closed-tip defects and enlarged source/SVG/native-PPTX comparisons, use [detail-fidelity.md](detail-fidelity.md).

Freeze source-specific typography and verify actual native fonts using [typography.md](typography.md); a font-name request alone does not establish recovery.
