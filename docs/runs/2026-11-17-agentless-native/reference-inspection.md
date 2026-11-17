# Frozen reference inspection — Agentless native reconstruction

## Binding reference

- Target: `../2026-11-17-agentless-contribution/selected-reference.png`
- SHA-256: `8e42486349ee50cb69b29b9708c3347ad601252ef878e19b8ea1ac102db7fcfb`
- Canvas: 1637 × 960 px, opaque white background.
- Inspection basis: direct visual inspection of the target pixels on 2026-11-17.
- Scope: inventory and review criteria only. This report makes no claim about
  scientific correctness, font identity, or actual PowerPoint editability.

## First-reading composition

The figure reads as **Fixed localization + repair**, explicitly constrained by
**No autonomous planning**. A large, slightly tapered left funnel shows four
successive localization views, then hands an extracted context to the right
search/replace panel. Candidate patches flow to a compact bottom validation and
selection strip. The horizontal/vertical arrow routing is an important part of
the reading order; this is not a uniform grid of cards.

## Region ledger (reference pixels, approximate)

| ID | Region `[x,y,w,h]` | Visible contents / required fidelity |
| --- | --- | --- |
| `top-architecture-brace` | `[126,8,1470,82]` | Black squared U-shaped brace behind and around the two top labels; thin heavy stroke, square corners. Preserve its visible segments and layering. |
| `top-fixed-localization` | `[334,8,637,69]` | White rounded rectangle, black outline; bold centered text `Fixed localization + repair`. |
| `top-no-autonomy` | `[1002,14,422,53]` | White rounded rectangle, slate-gray outline; bold centered text `No autonomous planning`. |
| `localization-funnel` | `[94,116,806,839]` | Four-level, blue-gray translucent tapered container with dark navy outline and rounded shoulders/corners. Width narrows from roughly 806 px to 524 px; do not replace by a rectangle/card. |
| `funnel-title` | `[260,129,504,41]` | Bold centered `Hierarchical localization`. |
| `repo-stage` | `[179,191,589,180]` | `Code repository` above a three-sheet document icon; `Build tree` arrow to `Repository tree`, folder/tree illustration, visible labels `…`, `django/`, `…`, `fields.py`, `…`. Folder icon and blue selected-file pill must remain detailed native geometry, not text substitutes. |
| `file-stage` | `[180,419,594,116]` | Blue `LLM` badge; `Selected files`; selected `fields.py` rounded box; `Build skeletons` arrow; `Skeletons`; code box showing `UUIDField(…)` and blue-highlighted `to_python(…)`. |
| `element-stage` | `[175,584,612,117]` | Blue `LLM` badge; `Selected element`; blue outlined `to_python`; `Read code` arrow; `Selected code`; code box with `…`, `def to_python(self, …):`, `…`. |
| `location-stage` | `[237,721,546,232]` | Blue `LLM` badge; `Edit locations`; downward arrow to `Context window`; `Context padding` arrow into a code-window illustration. Include its top gray chrome, ellipsis and yellow selected row. |
| `issue-left-to-funnel` | `[4,385,211,278]` | White outlined `Issue report` source box at bottom-left. One arrow feeds the first LLM from the left and another turns upward to it; retain both routes and their dark navy arrowheads. |
| `funnel-to-search` | `[663,385,282,506]` | Main thick dark-navy connector: exits left context window, runs right then up, enters the right panel's context window. It passes behind/around other content; retain its bends, ports, and arrowhead. |
| `search-replace-panel` | `[914,141,718,587]` | Large white rounded rectangle with black outline, title `Localized Search/Replace`. Do not introduce a generic panel-grid restyle. |
| `right-context-window` | `[945,307,245,180]` | `Context window` label and code-window illustration with three gray code lines, one yellow highlighted line, and `…` markers. |
| `search-card` | `[1297,242,315,97]` | Light-gray outlined rounded card, title `SEARCH`, a red minus sign and red ellipsis on a pale red band. |
| `replace-card` | `[1297,350,315,96]` | Light-gray outlined rounded card, title `REPLACE`, a green plus sign and teal ellipsis on pale green/cyan band. |
| `context-to-search-replace` | `[1178,285,124,157]` | Fine slate-gray branching paths from highlighted context line to SEARCH and REPLACE bands. They use no arrowheads; preserve their exact joining/attachment logic. |
| `issue-right` | `[891,584,95,67]` | Smaller white outlined `Issue report` box leading to the right-side LLM. |
| `right-llm` | `[1034,595,101,49]` | Blue rounded `LLM` badge, with left incoming and right outgoing dark-navy arrows. |
| `candidate-patches` | `[1318,498,277,208]` | Bold `Candidate patches` heading and three vertically offset, overlapping patch/code cards. Back/middle cards use dark teal outlines with pale green insert/highlight; front card contains gray code line, green highlighted `+ …` line, and ellipses. Preserve layering and overlap. |
| `validation-strip` | `[906,774,731,174]` | White rounded rectangle, dark navy outline, with three left-to-right blocks. Vertical arrow from search/replace panel enters above it. |
| `syntax-regression` | `[926,823,168,78]` | Light gray-blue rounded box, bold two-line `Syntax +` / `regression`. |
| `normalize-frequency` | `[1165,823,186,78]` | Light gray-blue rounded box, bold two-line `Normalize +` / `frequency`. |
| `selected-patch` | `[1414,789,209,142]` | Dark-teal outlined rounded container, heading `Selected patch`, inner pale card and code fragment `…`, green `+ …`, `…`. |
| `validation-connectors` | `[1097,855,318,12]` | Two dark-navy horizontal arrows between validation blocks; use consistently sized arrowheads and preserve open white spacing around them. |

## Text transcript and typography observations

All visible labels below should remain native text in SVG and in PPTX text boxes;
the ellipses are visible text marks, not optional decoration.

`Fixed localization + repair`; `No autonomous planning`; `Hierarchical
localization`; `Code repository`; `Repository tree`; `Build tree`; `django/`;
`fields.py`; `Selected files`; `Build skeletons`; `Skeletons`; `UUIDField(…)`;
`to_python(…)`; `Selected element`; `to_python`; `Read code`; `Selected code`;
`def to_python(self, …):`; `Edit locations`; `Context window`; `Context padding`;
`Issue report` (twice); `LLM` (three left, one right); `Localized
Search/Replace`; `SEARCH`; `REPLACE`; `Candidate patches`; `Syntax +`;
`regression`; `Normalize +`; `frequency`; `Selected patch`; plus the repeated
visible `…`, `−`, and `+` marks in code/tree examples.

The target appears to use a heavy, rounded sans display face for headings and a
clean sans/monospace-like treatment for code. This is pixel-derived only: font
family is **unverified** and must be recorded as `image-approximation` in the
frozen typography profile. Critical typographic details are the large black
hierarchy headings, centered two-line module labels, blue selection treatment
for `fields.py`/`to_python`, and code-line baseline/indent spacing.

## Palette, strokes, and geometry observations

- Background is white. Main outlines/connectors are nearly black or deep navy;
  secondary SEARCH/REPLACE branch lines are slate gray.
- Localization stages use pale blue-gray alternating horizontal bands. The right
  search/replace and bottom validation panels remain almost white.
- Semantic accents: saturated royal blue for LLM badges and selected code;
  yellow for context highlight; red for removal/search; green/teal for additions
  and patch cards. Preserve these meanings and their localized use.
- Outlined boxes are mostly rounded with consistent dark strokes. The left funnel
  alone has its distinctive tapered silhouette; title frames are separate.
- Main workflow arrows are dark navy, medium-heavy, orthogonal, and headed.
  Secondary edit-branch lines are thin gray and unheaded. Do not collapse these
  two edge types.
- The paper-width rendering must retain legibility of the code snippets and
  the visual distinction between selected blue, selected yellow, red minus, and
  green plus rows.

## Native reconstruction acceptance checklist

1. Bind every review to this exact PNG hash and fixed 1637 × 960 canvas.
2. Preserve the tapered four-stage funnel, top brace/labels, stacked patch cards,
   and bottom validation strip. They are defining composition, not decoration.
3. Use separate semantic SVG groups and native PPTX objects for every module,
   connector, label, icon, and repeated patch card. No full-image SVG/PNG overlay,
   outline text, or single-picture slide shortcut.
4. Require an inventory and a PPTX object crosswalk: native `a:t` text for all
   transcript labels, native shapes for panels/badges/code windows, `p:cxnSp`
   connector evidence for each directed workflow edge, and disclosed exceptions.
5. Inspect exported SVG preview, independent LibreOffice PPTX raster, and PDF
   raster against this target at full size and paper width. Compare branch routes,
   arrowheads, selected-row placement, text baselines/wrapping, icon contours,
   overlaps, and z-order; pixel diagnostics alone cannot accept fidelity.
6. `officeRender` can pass only for the actual LibreOffice evidence supplied.
   Microsoft PowerPoint visual fidelity and interactive manual-edit cost remain
   unverified unless separately demonstrated by a person in PowerPoint.
7. Any missing/stale geometry, typography, object-map/XML-audit, native-render,
   or hash evidence remains `unverified`; do not infer it from an SVG or
   library-level object count.

## Initial review state

No native export, Office render, inventory, object map, XML audit, typography
profile, or layout contract was available at this inspection. Accordingly no
nine-criterion verdict has been assigned and this is not a visual acceptance.
