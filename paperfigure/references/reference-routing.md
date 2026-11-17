# Choose a design route or a target reconstruction route

The image-to-native failure in the LATS trial was not caused solely by vector
rendering. A semantic auto-layout was presented alongside a generated PNG without
binding its composition; a later original recomposition was still not a faithful
reconstruction. A working local-detail workflow did not establish working automatic
new-figure layout. Keep these capabilities and evidence separate.

## Design

With no selected target, author a scientific spec and original composition.
`paperfigure.mjs build --spec FILE --out NEW_DIRECTORY` is this design route;
its automatic layout is only a draft and can fail text/routing QA. It does not
read an image, recover image coordinates, or convert a supplied PNG into SVG.
`visual.reference` may explicitly mark an image as `inspiration`, with path/hash.
Never claim reference fidelity for a substantially different composition.

Audit code semantics before generating an image. Follow actual returned values
and selected entry branches, not just argument names or familiar method diagrams.
An image-generation prompt containing a mistaken relation makes a mistaken image;
do not blame that relation solely on image generation. Source facts override images.

## Reconstruct

Once a supplied/generated PNG is selected as the output target, record
`visual.reference: {mode: "target", path: "...", sha256: "..."}` in the semantic
spec. Generic build rejects this flag and directs the caller to reconstruction.
Create `reference-contract.json` before native authoring; text-bearing scenes also
require the source-aware frozen profile in [typography.md](typography.md):

```json
{
  "version": "1.0",
  "mode": "reconstruct",
  "reference": {"path": "reference.png", "sha256": "ACTUAL_HASH", "width": 1200, "height": 700},
  "centerTolerancePx": 6,
  "sizeTolerancePx": 10,
  "regions": [{"module": "encoder", "box": [100, 180, 220, 100]}],
  "geometryChanges": [],
  "contentChanges": [{"objects": ["edge-id"], "reason": "Specific source correction", "evidence": "Pinned file:lines"}]
}
```

Every semantic module must have a source-PNG region and an actual `anchorShapeId`;
omitting that field does not opt a panel out. Pure nonvisual groups need explicit
`nonVisualGroups` entries with kind/reason. Annotation groups contain text only and
cannot be graph endpoints or boxed panels; hierarchy groups require actual children. The canvas stays fixed. An unavoidable
local geometry change must name one module and exact `expectedBox`, reason and
source evidence. Local exceptions are bounded to 10% of the smaller original side for center shift
(maximum 20 px), and 15% per dimension (maximum 30 px). Larger changes require a
new explicitly selected reference or design mode. A blanket "improve layout" or "make prettier" is not valid source evidence for the reviewer. The parser
enforces exact geometry bounds and required evidence fields, not the truth of
free-text source claims; the isolated review must assess necessity.
Keep scientific corrections, flat-color constraints and readable text rewrapping
explicit; they do not authorize moving unrelated panels or reversing their order.

Author the native scene using `png-reconstruction.md`, `layout-and-arrows.md` and
`detail-fidelity.md`, preserving the region map, then run:

```sh
node scripts/paperfigure.mjs reconstruct --scene layout-scene.json \
  --contract reference-contract.json --out NEW_DIRECTORY
uv run --with pymupdf --with numpy python scripts/render-layout.py \
  --out NEW_DIRECTORY --checks
```

This is agent-assisted native authoring, not an automatic PNG parser. Reconstruction
checks actual rendered SVG anchor geometry against the frozen PNG regions, not
just claimed scene boxes. Changed image hashes/canvas, invisible/missing anchors,
or unexplained region drift reject export. Native text/arrow QA and XML audit
remain separate. Geometric equality does not prove correct text, colors, curves,
icons, edge routing or scientific meaning; inspect actual region comparisons.

## Acceptance

The reconstruct command always starts with `deliveryReady: false`. Give the target,
contract/deviations, SVG preview and actual Office render to a fresh non-authoring
reviewer. The output-local review follows `visual-review.md`, but the required
artifact names for this route are exported by `REFERENCE_ARTIFACTS` in
`scripts/delivery-status.mjs`. With text, also review `typography-profile.json`, `typography-style-qa.json` and
`typography-qa.json` from actual Office rendering. They include the contract, geometry/layout/native
QA, and actual native PDF/PNG/render report, in addition to SVG/PPTX/preview/scene.
The review must name this exact selected PNG, not an unrelated or self-generated
comparison chosen after a redesign. Then run:

```sh
node scripts/paperfigure.mjs review-status --out NEW_DIRECTORY
```

Both routes share the status contract in [evaluation.md](evaluation.md). This
gate recognizes the reconstruction contract and verifies target hashes,
actual geometry-check freshness, native-render PPTX/PDF hashes, required reviewed
artifacts and all nine criteria. Missing, rejected or stale reviews stay unready.
Persist user rejection in that candidate's `user-feedback.json`; a scoped agent
acceptance cannot override it. Preserve rejected candidates. Agent acceptance is
not human user approval or venue certification.

Keep the original prompt/PNG, source audit, deviation list and final comparison.
If the candidate is a redesign, label it as design and do not use reconstruction
acceptance language. Bounded re-review repairs specific defects; it does not justify
unlimited polishing or another silent layout replacement.
