# Reference-route hardening review

Date: 2026-11-16  
Scope: independent code/workflow review of the new target-reconstruction route.
No figure was authored or accepted in this review.

## Verdict

**Revise before treating the hardening as sufficient to prevent the original
generic-layout/recomposition regression.**

The new route fixes important integration failures:

- A semantic spec that marks `visual.reference.mode: "target"` is rejected by
  generic `build`; `build --mode reconstruct` is also rejected with direction to
  the new command.
- `reconstruct` freezes the PNG hash/dimensions, requires a scene and contract,
  compares actual Chromium-measured SVG anchor geometry rather than trusting
  scene coordinates, and begins unready.
- The status dispatcher selects the contract-specific gate when a reference
  contract exists. It checks the selected PNG versus the review reference,
  freshness of SVG/scene/contract geometry evidence, actual PPTX/PDF hashes,
  native/layout evidence, all reviewed artifacts, and a persisted `revise`
  verdict.
- The multiline-centering correction is real: the new browser test verifies each
  line, not only the union of lines.

However, the geometry ledger remains voluntarily partial and its exceptions are
not actually bounded locally. An author can preserve the new checks while moving
or redesigning exactly the content they omit or override. This directly weakens
the stated purpose of binding a selected PNG before native authoring.

This review does **not** infer reference fidelity from a geometry pass, hashes,
or native-object counts. Those are correctly limited to structural/binding
evidence; actual visual fidelity still requires the required isolated review.

## Checks run

`npm test -- --test-name-pattern='reference|multiline'` completed successfully:
92 tests passed, 0 failed, in about 13 seconds. This includes target hash/canvas,
actual-rendered SVG drift, hidden anchors, generic-build rejection, user rejection,
and per-line centering tests.

I also ran `review-status` on the preliminary
`examples/lats-hotpotqa/output-target-v1`. It exited 2 and left the candidate
unready. The reported reasons were missing isolated fidelity review, no review of
the selected PNG, failed/incomplete measured/native evidence, and missing actual
Office render evidence. That is the expected disposition for this preliminary
candidate and must remain so until the later target candidate has all evidence.

## Blocking findings

### B1. Contract regions need not cover all visible reference-bound modules

`checkReferenceLayout` requires only a nonempty `contract.regions` array. It
checks each declared region, but never requires that every scene module with an
`anchorShapeId` appears exactly once in that array. The routing reference says
“Every major module” must be recorded, but that is prose only.

An author can therefore bind one stable anchor, omit a moved panel and any newly
added panel from the ledger, then receive `passed: true`. This is a direct route
around the target-composition protection. The present LATS contract happens to
enumerate its 12 semantic modules, but the generic mechanism does not enforce the
property.

**Minimal fix:** in `checkReferenceLayout`, compute the set of scene modules with
`anchorShapeId`; require exact equality with the set of contract region module
IDs. Keep non-reference annotation containers anchorless. If a real exception is
needed, make it an explicit, separately reviewed `nonReferenceModule` record with
reason/evidence, not silent absence from `regions`.

**Regression:** add an anchor-bearing second module to the fixture, leave it out
of `regions`, and assert rejection. Add a duplicate/unknown region assertion too.

### B2. `geometryChanges.expectedBox` is arbitrary, not a bounded local exception

The validator checks that a geometry change supplies a known module, free-text
`reason`/`evidence`, and a finite four-number `expectedBox`. It does not constrain
the replacement box relative to the frozen region. Thus a change can move, resize,
or reorder every declared module by an arbitrary distance while all measurements
pass against their replacement boxes. The test named “unbounded … exception” only
tests a malformed exception *without* `expectedBox`; it does not test a valid but
arbitrarily distant expected box.

The routing documentation's example claim that “make prettier” is invalid is
also not implemented: that exact string is accepted when an `expectedBox` is
present. The LATS contract uses no geometry changes, so it does not expose this
hole yet.

**Minimal fix:** validate each change against its original `region.box`: cap
center displacement and width/height deltas at small, named bounds (for example,
the existing maximum tolerance range or contract-level bounded maxima); reject
changes that leave the reference canvas or change ordering relative to an
unaffected peer. Require a source locator-shaped evidence record rather than any
nonempty string. Do not allow `geometryChanges` for every reference module in one
revision without an explicit user-authorized full-redesign mode, which must not
claim reconstruction.

**Regression:** a one-module fixture with `expectedBox: [1000, 1000, 50, 40]`
should reject even though the SVG anchor is at that replacement box. Also test a
valid small local shift and an arbitrary `reason: "make prettier"` rejection.

## Important non-blocking follow-up

`contentChanges` is retained but not structurally validated or used by either
geometry/status check. In particular, the LATS contract permits `objects: ["all"]`.
That can be legitimate documentation of a global flat-fill/reflow policy, but it
is too broad to be an auditable exception record. Before review, split it into
bounded object IDs/regions or explicitly label it a global visual policy that does
not waive geometry, label, edge, icon, or isolated-review obligations.

## Evidence that should remain unchanged

- The preliminary LATS target package must stay `deliveryReady: false`; neither
  this review nor a green geometry check accepts it.
- `user-feedback.json` with `verdict: "revise"` must remain terminal in the
  target-specific status gate.
- Geometry, native editability, and render hashes must continue to be described
  as necessary binding evidence, not visual-quality/fidelity proof.

## Re-review gate

Re-review after B1/B2 have focused negative tests and pass. Then inspect the
forthcoming LATS target candidate only with its actual PNG, SVG/PPTX/PDF renders,
comparison crops, deviations, and fresh independent review record. A passing
reference-layout report alone is insufficient.
