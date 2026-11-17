# Evaluation: automated evidence and human review

Report six dimensions separately; do not average them into a misleading single
publication-readiness score.

For executable reader evidence, shared design bindings and actual application
edit tasks, use [quality-loop.md](quality-loop.md). Critical reader ambiguity can
fail a new design despite correct arrows and faithful export. A passing Office
render does not qualify native PowerPoint editing or a normal open/save round-trip.

| Dimension | Automated evidence | Human assessment |
| --- | --- | --- |
| Semantic fidelity | Schema, known endpoints, phase compatibility, group hierarchy, source-quote presence, exact exported node/edge/text inventory | Compare each assertion, arrow and omission with Method/code; quotes are not entailment |
| Visual quality | No proxy declared to prove aesthetics | Readability at final width, hierarchy, emphasis on contribution, visual density and venue suitability, 1–5 anchored ratings |
| Editability | Native PPTX shapes/connectors/text vs pictures; connector groups and paths | Edit label, move module and adjust route in PowerPoint; verify reflow; connectors require manual route adjustment |
| Layout quality | Bounds, node/text/glyph overlap, width/height estimates, route occlusion, proper crossings/shared segments, print size | Ambiguous joins, balances and intended grouping; warning decisions documented |
| Reproducibility | Retained spec, scene, lockfile and hashes; exact SVG/PPTX regeneration tests | A second person reproduces and changes the graph |
| Human editing cost | No fabricated score | Time and actions for rename, font change, move, new branch; record failures and tool version |

Automatic checks inspect real SVG and PPTX XML, not only the embedded manifest.
Text is compared literally; node boxes and connector paths/sites are compared to
the shared scene. Module glyphs remain native primitives. Full font shaping,
semantic entailment, aesthetics, and actual mouse-based editing effort are not
automated. The design renderer has verified ASCII/Latin Arial/Helvetica coverage; reference
reconstruction additionally uses source-aware frozen typography and actual-font
checks described in [typography.md](typography.md).

Independent PowerPoint rendering uses LibreOffice in an isolated profile. Its
PNG, side-by-side and difference image are stored under `rendered-pptx/`. Per-edge route ink coverage is a geometric gate (3px tolerance, at least 90% of
visible samples per edge). MAE and dark-pixel IoU are appearance diagnostics, not
aesthetic or semantic scores.
Rasterization/font metrics differ; inspect apparent differences explicitly.
Microsoft PowerPoint itself is a separate unverified rendering/editing target
until a human opens and edits the file there.

Suggested human task protocol: give a researcher the source description and blind
the producer identity; ask them to enumerate scientific errors, then rate visual
clarity, then perform three edits. Keep time, successful tasks / all assigned
tasks, and raw comments. The three included examples are software regression
fixtures, not an independent human evaluation or proof of top-venue quality.

## Shared validation and delivery contract

Both routes use `scripts/delivery-status.mjs`. Its route adapters preserve their
own evidence requirements; the shared policy checks reviewer identity, all nine
criteria, inspected artifact/reference hashes and user rejection. Compatibility
exports remain in `visual-review.mjs` and `reference-layout.mjs`.

| Stage | Design evidence | Reconstruction evidence |
| --- | --- | --- |
| `mechanical` | `qa.json`: semantic/layout/export QA | Reference geometry and contract freshness, measured layout, native audit, frozen typography and actual-font QA when text exists |
| `render` | Office route check and PDF render/text check | Actual native Office render with current PPTX/PDF hashes |
| `review` | Attributed nine-criterion review, design artifact hashes and declared reference | Same review policy, target-specific artifacts and exact selected PNG |

`build`, `reconstruct`, `qa` and `review-status` expose the same status fields and
write output-local `delivery.json`:

```json
{
  "version": "1.0",
  "mode": "design",
  "mechanicalPassed": true,
  "validation": {
    "mechanical": {"status": "pass", "reasons": []},
    "render": {"status": "unverified", "reasons": ["Independent Office/PDF verification missing"]},
    "review": {"status": "unverified", "reasons": ["No readable independent visual-review record"]}
  },
  "deliveryReady": false,
  "visualAcceptance": "unreviewed",
  "reasons": ["Independent Office/PDF verification missing", "No readable independent visual-review record"]
}
```

Stage status is `pass`, `fail` or `unverified`; an observed failure takes precedence
when a stage also lacks evidence. `visualAcceptance` describes the review stage:
`independently-accepted`, `needs-revision` or `unreviewed`. Review acceptance can
coexist with failed mechanical/render evidence; only `deliveryReady` combines all
three. This replaces the older route-dependent acceptance strings. Existing review
records and artifact inventories remain supported; frozen fixtures are unchanged.

`qa` refreshes mechanical reports for either route, preserves unchanged report
bytes and updates delivery status. It does not regenerate exports, run Office,
launch a reviewer or grant acceptance. Refresh reports before review; changed
reports covered by the review require re-review. `qa` exits 2 unless mechanical
validation passes. `review-status` reads evidence without rerunning checks and
exits 2 unless all stages pass. Invalid inputs/tool execution errors exit 1.
Generation commands retain exit 2 for their detected generation QA failures;
missing later render/review evidence leaves their delivery unready.

Run the route's independent rendering before final review:

```sh
# Design route
node scripts/render-check.mjs OUTPUT
# Reconstruction route (Playwright/Chromium needed for measured SVG QA)
uv run --with pymupdf --with numpy python scripts/render-layout.py --out OUTPUT --checks
# Text-bearing reconstruction: verify frozen styles and observed Office fonts
node scripts/typography-profile.mjs --out OUTPUT \
  --profile OUTPUT/typography-profile.json --report OUTPUT/typography-qa.json
# Both routes
node scripts/paperfigure.mjs qa --out OUTPUT
node scripts/paperfigure.mjs review-status --out OUTPUT
```

Node dependencies alone do not supply Chromium, LibreOffice, Poppler, Python
packages or system fonts. Missing tools remain unverified/errors, never inferred
passes. `render-check.mjs` limits Office to 45 seconds and each rasterization to
20 seconds; `render-layout.py` limits each Office invocation to 60 seconds.
