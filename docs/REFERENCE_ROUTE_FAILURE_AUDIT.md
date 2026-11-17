# Reference-route failure audit

Date: 2026-11-16  
Scope: routing of an image reference through PaperFigure, with the LATS HotPotQA
example as the concrete reproduction. This is an audit only: no figure, source, or
runtime code was changed.

## Outcome

The current instructions describe a fidelity-first PNG reconstruction route, but
the executable route does not bind an output to that route. Consequently an agent
can produce a mechanically clean, editable, source-grounded *new composition*
and present it beside a reference without there being a machine-enforced reason to
call it a failed reconstruction. The LATS `output-v1` is such a composition. It
is not evidence that the PNG-to-SVG workflow reconstructed
`design-study/initial.png`.

This is not a conclusion that a generic automatic layout is the right output:
`baseline-output` is precisely the generic layout fallback and its saved QA is
failed. Nor is it a claim that the LATS source semantics are wrong. The issue is
target binding and acceptance, not the availability of vector primitives or
semantic evidence.

The user's rejection remains `revise`. No existing local QA, editability ratio,
or future agent review may override it.

## Evidence and route identity

| Artifact | Observed route | Status it can support |
| --- | --- | --- |
| `design-study/initial.png` | 1752 x 897 generated visual proposal; SHA-256 `fc12b3fc8bd7a3f54088ad4e5feabb33e1fabec2f42d37062ab7a249e741648e` | Possible visual target only after an explicit target decision. |
| `baseline-output/figure.png` | Standard `paperfigure.mjs build` result from a spec with `layout.nodes: {}`; the renderer's `autoBoxes` ranks semantic nodes and routes a generic graph. | A failed generic design candidate, not a reconstruction. Saved `qa.json` has `passed: false`, including text overflow/overlap and routing errors. |
| `output-v1/preview.png` | Custom `examples/lats-hotpotqa/build.mjs` scene with manually chosen boxes, a new tree drawing, a large textual rollout panel, and new routed callouts. | An agent-authored design/recomposition candidate, not fidelity evidence. |

The contract itself makes this distinction explicit: its `designStudy` says the
PNG is a generated proposal with source-required deviations and is “Not claimed
as pixel-faithful reconstruction.” Its `authorFigureHiddenUntilNativeFreeze`
flag is a convention only; no CLI command consumes it.

The visual comparison confirms the classification. The PNG has a compact
left-side tree with inset state strips; a contained dashed rollout subgraph with
four miniature modules; a top feedback frame; and a bottom return path. V1
replaces those with a much taller tree, no inset strips, a large prose rollout
card, different row placement for the reflection route, and long outer return
loops. These can be defensible design choices, but they are material composition
changes. The baseline, meanwhile, loses the tree/rollout visual hierarchy almost
entirely and visibly collides labels and routes.

## What the instructions already get right

The written contracts are materially stronger than the integration:

- `SKILL.md` says a selected PNG target must use `png-reconstruction.md`, must
  preserve composition/details, and must not be silently treated as inspiration.
- `png-reconstruction.md` requires a frozen PNG hash and dimensions, a complete
  ledger with source regions/counts, native SVG groups/text, a rendered comparison,
  a PPTX object crosswalk and independently rendered PPTX, then a separate
  fidelity/editability review.
- `reconstruction-check.mjs` correctly treats its result as diagnostic rather
  than visual acceptance. It checks an inventory-bound PNG hash, native text,
  ownership, vector IDs and aspect ratio; it writes comparisons but leaves
  `visualAcceptance: "unreviewed"` and `deliveryReady: false`.
- `visual-review.mjs` correctly preserves an explicit `user-feedback.json`
  rejection and refuses to let an agent acceptance override it.
- The LATS native checks work within their own scope: V1 has 40 SVG texts, 17
  edges and no geometry collisions in `layout-qa.json`; `native-audit.json`
  reports 89/89 native content objects and zero pictures. Both reports explicitly
  disclaim visual fidelity.

Those are useful reject gates. They do not establish that the target reference
was selected, transcribed, retained through authoring, compared, or accepted.

## Actual gaps

### 1. No executable target-mode binding (primary failure)

`paperfigure.mjs build` takes only `--spec` and `--out`. It always calls the
shared-spec `buildScene(spec)` route; it has no `--mode reconstruction`, no
`--reference`, no inventory input, and no target hash. A source can be marked
`reference-image` in `figure.schema.json`, but the schema makes it an ordinary
source record; it has no reconstruction contract, expected region ledger, target
selection, or required reconstruction output.

That means route selection exists only in prose. A generic renderer and a
custom authoring script are both able to emit an output that has no durable
machine-readable answer to “which PNG did this reconstruct?”

### 2. The production LATS custom path bypasses the reconstruction contract

`examples/lats-hotpotqa/build.mjs` reads `spec.json`, but creates a separate
`layout-scene` directly and saves `editable.svg`/PPTX/preview through
`saveEditableFigure`. It neither reads `design-study/initial.png` nor accepts a
reference argument. It does not create:

- `inventory.json` bound to the PNG SHA-256 and its object/region counts;
- `reconstruction-check` preview, overlay, difference, side-by-side report;
- a reconstruction contract/authorized-deviation list tied to the target;
- a `pptx-object-map` plus a *rendered* PPTX comparison (the map exists, the
  independent render and comparison do not); or
- an attributed `reconstruction-review.json` with separate fidelity, SVG, and
  PPTX verdicts.

V1 therefore cannot legitimately enter the fidelity delivery path. It has
neither the required inputs nor the required evidence. Its output directory also
does not use the shared renderer's `manifest.json`, `qa.json`, `figure.svg`, or
`delivery.json`, so `review-status` is not an integration gate for this path.

### 3. The generic CLI actively falls back to semantic auto-layout

When not every `layout.nodes` entry is supplied, `layout.mjs` calls `autoBoxes`.
That function only considers the semantic graph rank, graph direction, and
available canvas. It cannot preserve the reference's visual grouping, relative
proportions, inset rollout contents, or icon geometry. The LATS spec deliberately
has an empty node-layout map, so the baseline necessarily takes this fallback.

This behavior is appropriate for a new-method draft and should remain available.
It must be impossible to confuse it with a reconstruction once a PNG has been
selected as target.

### 4. Layout/artwork capability is not a reconstruction acceptance contract

The schema offers explicit node boxes, edge vias, `visual.appearances`, and
`visual.artwork`; the direct layout exporter can preserve grouped native vectors.
These capabilities are sufficient building blocks for careful reconstruction but
are optional and unconstrained. Nothing compares their object placement/counts
against a reference, and the shared SVG exporter does not automatically emit the
PNG-reconstruction inventory ownership model.

Thus “uses explicit positions” and “uses editable SVG/PPTX” are not proxies for
target fidelity. V1 demonstrates exactly that distinction.

### 5. Acceptance paths are parallel, not joined

`reconstruction-check.mjs` is intentionally a strict-native diagnostic. The
shared `review-status` gate expects a different artifact set (`spec.json`,
`figure.svg`, `figure.pptx`, PDF, PNG, rendered PPTX) and a
`visual-review.json`; the PNG guide explicitly says directly authored SVG/PPTX
needs its own attributed reconstruction review and cannot inherit that gate.

There is no command that validates a reconstruction package end-to-end or that
prevents an arbitrary `output-v1` from being described externally as the result
of the reconstruction route. The correct checkers exist, but they do not own a
common delivery decision.

### 6. Semantic-source corrections need an explicit visual-deviation record

The LATS design contract says source facts override generated-image mistakes.
That is correct. But the current value is a narrative `designStudy` field, not a
target-specific list of *which* source-required changes alter *which* reference
regions and whether all other geometry remains frozen. It makes a large
recomposition indistinguishable from a bounded correction when reading artifacts
after the fact.

### 7. The stated user rejection is not persisted in the LATS candidate

The shared visual gate would honor `user-feedback.json` when it exists, but the
LATS V1 directory contains no such file and does not invoke that gate. The
rejection supplied for this audit is therefore authoritative for current work but
not durably attached to the candidate. A subsequent agent could see passing
layout/native audits and miss the rejection. The reconstruction-status contract
must consume the same feedback file (or an equivalently immutable, hash-bound
feedback record) and a LATS candidate under review must receive it before any
review status is evaluated.

## Smallest maintainable hardening

Do not refactor the renderer or remove the new-design route. Add one narrow,
explicit reconstruction package contract and gate at the CLI boundary:

1. Add `--mode design|reconstruct` to the public build/review entry point
   (default `design` for backward compatibility). `reconstruct` requires a
   `--reference PNG` and `--inventory JSON`; it records their SHA-256 values and
   the target path in a generated `reconstruction-manifest.json`. It must reject
   missing inputs, hash/dimension mismatch, auto-layout (`layout.nodes` not
   complete) and lack of an explicit reconstruction authoring source. A direct
   SVG authoring source remains allowed; the requirement is evidence binding,
   not forcing it through `buildScene`.

2. Add a small `reconstruction-status` command rather than overloading the
   shared-spec `review-status`. It should require the reconstruction manifest,
   successful `reconstruction-check` report, SVG/preview/PPTX/object-map/native
   audit, independent PPTX render, and `reconstruction-review.json` with fresh
   hashes and three separate verdicts. It should emit `delivery.json` with
   `deliveryReady: false` unless all are present and accepted. If a user rejection
   file says `revise`, it must always remain false.

3. Make the example route explicit. Either label the current LATS V1 as
   `mode: design`/“source-grounded recomposition; not a reconstruction”, or create
   a separate `reconstruction-v1` package that actually starts from the frozen
   PNG and inventory. Do not rename the current directory to imply an accepted
   PNG conversion. The generic baseline should likewise stay a failed regression
   fixture, not a candidate reference reconstruction.

4. Require a compact `authorizedDeviations` array in reconstruction manifests:
   reference region/object IDs, source citation, precise visual/semantic change,
   and reviewer disposition. This retains the needed source-correction authority
   without opening an unbounded redesign escape hatch.

5. Persist the current user verdict in the candidate package and have both status
   gates read it. A `revise` verdict is terminal for that candidate revision; a
   later artifact needs a new hash-bound review rather than inheriting clearance.

This is a targeted integration change: existing `reconstruction-check`, native
audits, render checks, and isolated review record formats can be reused. It does
not require automatic PNG vectorization or a new general layout engine.

## Focused regression plan

Acceptance criterion: an artifact may be called a reconstruction only if its
selected reference and its native/fidelity evidence are bound and current;
otherwise it is delivered as a design candidate and cannot receive a ready
reconstruction delivery status.

1. **Mode-negative tests (fast, < 5 seconds):** assert that `--mode reconstruct`
   rejects no reference, no inventory, a changed PNG hash/dimensions, incomplete
   explicit node layout, and a no-reference auto-layout spec. Confirm that
   `--mode design` still permits the present generic workflow.
2. **Existing compliant fixture (fast, < 15 seconds):** use the frozen Voyager
   reconstruction example to run the new package/status validation. It should
   pass only when its existing inventory/check/review/render hashes are current.
3. **LATS classification fixture (fast, < 10 seconds):** verify that
   `output-v1` cannot pass reconstruction status because it lacks the PNG-bound
   ledger, comparison report, PPTX render, and attributed reconstruction review.
   It may pass its existing native/layout checks, which is the desired distinction.
4. **User-rejection regression (fast, < 5 seconds):** add a valid-looking
   reconstruction record plus `user-feedback.json: {"verdict":"revise"}` and
   assert that status remains non-ready. This must test the reconstruction gate,
   not only the shared renderer's review gate.
5. **One end-to-end authored reconstruction (bounded manual review):** rebuild
   only the LATS PNG with an inventory and explicit source-required deviations;
   run the PNG checker, render the PPTX, review reference fidelity independently
   at source crops and publication size, and preserve the reviewer’s actual
   verdict. The test passes only if the reviewer accepts; a clean structural report
   is not a substitute.

## Current disposition

- `baseline-output`: rejected regression/failure evidence; its saved mechanical
  QA is failed.
- `output-v1`: native, source-grounded design candidate with unreviewed visual
  acceptance; not a reference reconstruction package.
- PNG-to-native LATS reconstruction: unverified and not ready. The current user
  rejection must remain attached to the candidate under discussion.

