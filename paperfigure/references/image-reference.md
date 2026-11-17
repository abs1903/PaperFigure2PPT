# Image generation: communication brief, then controlled edits

Read this for a new visual study or an imagegen quality complaint. Generation is
host-assisted, not a provider call in the offline CLI. Prefer the built-in image
tool within user scope; no paid external fallback without explicit permission.
An image model proposes appearance; it never supplies scientific evidence.

## ImageGen-first route

When the user requests this route or asks to improve a generated design before
SVG/PPTX, keep the native renderer downstream of image-stage acceptance:

`raw code/method → source audit → reviewed narrative/abstraction → figure spec and communication brief → ImageGen PNG →
isolated pixel review → attached-candidate edits/re-review → frozen target PNG →
source-aware native reconstruction → actual Office render → independent native review`.

For a local appearance edit of an already selected composition, reuse the reviewed
plan/spec and delta-edit workflow. Do not require a legacy-plan migration, new
composition search or invented contribution claims just to change a color or font.

For new overviews, a fresh image-only reviewer first sees actual pixels and minimal
reading constraints, not the source/brief/expected takeaway. Save its independent
account before a source-informed pass; see
[visual-review.md](visual-review.md#image-only-first-reading). The latter records
scientific correctness, composition, typography and native-rebuilding feasibility
separately. A visually weak image stays at the image stage even when its graph is
correct. Save the actual image and prompt hashes with each verdict. Never grant
PPTX/Office or final-delivery acceptance to a raster candidate.

For appearance failures, revise the best image using the host tool's actual image
attachment mechanism. Preserve scientific invariants and edit one defect class per
round. If the spec/brief is wrong, repair it and renew affected source review.
If pixels violate already-reviewed semantics, repair the image against that frozen
plan; do not change correct science or repeat an unchanged source audit merely to
accommodate the image. Keep rejected images and regressions. If the bounded edit loop
ends without acceptance, deliver a clearly labeled design candidate and findings;
do not hide the failure by starting native export or converting another layout.

After image-stage acceptance, inspect a small native sample of text, the recurring
icon and busiest junction. If feasible, freeze the exact accepted image and enter
reference-bound reconstruction. A material visual change needed for feasibility
belongs back in the ImageGen edit/re-review loop, not a silent SVG redesign.

## Compare and choose the communication level

For paper comparison, open the actual author overview and detailed method figure,
not just captions. Record PDF URL/hash, page, figure number and what each explains.
Distinguish the paper method from a pinned implementation: code quirks are not
automatically paper mechanisms. Review disagreements rather than copying edges.
Figure-hidden experiments require explicit intent; normal design may study author
visual grammar. Do not claim blindness after inspecting it.

Compare focal mechanism, reading order, competing visual regions, operational vs
static representation, text density, long returns, color roles and final-size
typography. Extract principles, not artwork/layout. Record source/license info;
do not bundle third-party illustrations without reuse permission.

## Author a communication brief before a prompt

First follow [paper-narrative.md](paper-narrative.md): choose the communication
scope, map contribution claims to visual emphasis, record detail placement, and
review the figure-level abstraction. A readable step sequence alone does not pass
the narrative stage for a contribution-oriented method overview. Freeze
the resulting source-reviewed figure spec, then write a version `1.1`
`design-brief.json` with the binding contract in
[paper-narrative.md](paper-narrative.md#bind-the-plan-to-a-version-11-brief). Keep
the narrative plan and its independent review beside the brief and include their
locators in the handoff; the prompt compiler checks graph coverage, not storytelling.

- `version: "1.1"`, `semanticSHA256`: `digest(semanticSnapshot(spec))` from
  `scripts/spec.mjs`. `scope` names paper/concept vs pinned implementation.
- `narrative: {path, sha256}` binds the parsed plan; `compositionId` chooses its
  composition. The compiler emits the plan's takeaway and contribution hierarchy.
  `sourceReview`: actual independent source
  report locator. A locator is not an automated review pass.
- The selected plan alternative supplies `composition` (prominence, alignment,
  reading route, aspect ratio) and `mechanism` (visible operation). A big tree beside
  a flowchart is insufficient if the tree itself explains nothing.
- `blocks`: `{id,label,nodes:[semantic IDs],representation}`. Several code
  entities may share one coherent visual mechanism. One semantic entity does not
  require one equal-sized card.
- `relations`: `{edge,mode:"arrow"|"internal",display}` for every spec edge.
  Internal relations must share a block and have an explicit visual encoding.
  No silently deleted edges or vague "handled inside" notes. The compiler checks
  coverage/ownership; reviewers check scientific meaning and visible realization.
- `labels`: exact visible text whitelist, `maxVisibleWords`,
  `publicationWidthIn`, `typography`: hierarchy, weight, final-size readability.
  Set a figure-specific word budget; it is not a venue rule.
- `palette`: `{color:"#RRGGBB",meaning,nodes:[IDs]}` covers each node once.
  Equivalent roles reuse colors; neutral text/borders/arrows are allowed.
- `forbidden`: source-specific false mechanisms. Keep implementation minutiae in
  the source record unless needed to interpret a path. Essential conditions stay
  visible; compression requires reviewed abstraction, not deletion.

The legacy version 1.0 draft example is `examples/lats-hotpotqa/design-study/design-brief-v2.json`;
its exact companion is `examples/lats-hotpotqa/spec-figure.json` (not `spec.json`).
It is not a validated new figure.

```bash
node scripts/paperfigure.mjs reference-prompt --spec /path/to/spec.json --brief /path/to/design-brief.json
```

This writes a prompt, never invokes a provider. Spec-only prompting is rejected:
it collapsed evidence, abstraction and art direction into a graph dump. Review
the compiled prompt before use. Validation is not scientific entailment, aesthetic
approval or proof the image model will obey it.

## Separate composition search from refinement

For an unselected new design, prepare two structurally different compositions and
two 1.1 briefs bound to the same plan and semantic spec. Generate one candidate per
direction, then compare actual pixels using the image-only first-reading accounts,
source correctness, contribution visibility and paper-width reading. Palette swaps
are not alternatives. Do not choose from descriptions alone and then spend the
whole image budget polishing one unsupported layout.

Reallocate the existing budget: default at most four image calls total, normally
two initial candidates plus up to two edits of the better candidate. A smaller
user budget wins. Already selected/approved compositions can use one direction
with `compositionException`, leaving remaining calls for purposeful edits. If only
one unselected candidate fits the available budget, record the unperformed
comparison rather than inventing a winner or silently expanding cost.

Record candidate image/hash, bound plan digest, composition ID, submitted brief,
image-only/source review locators, decision and reason in the run ledger. A preferred
candidate can still require semantic repair; it is not image-stage accepted merely
because it won the comparison. If neither explains the claim, revisit the plan
before further polish. Keep rejected directions; never fabricate unexecuted calls.

Save exact submitted prompt, input-image roles, output path/hash, source/spec/brief
hashes. Open actual generated pixels. Check incorrect/missing edges and labels
first, then composition and paper-size typography. Pretty but scientifically
wrong is rejected.

Before full reconstruction, test a representative native crop of the smallest
text, recurring icon and busiest junction. If reproduction needs raster text,
whole-image insertion or unreliable effects, revise the reference first.
Feasibility does not permit silently simplifying an approved design.

## Controlled multi-round edits

Use only the calls remaining after composition search (normally at most two edits).
For an already selected composition, at most three edits fit the default four-call
budget. Reassess after two edits fail to improve the same defect. This is a host workflow, not an automatic
optimizer. A number of rounds cannot guarantee paper quality.

1. Inspect the best candidate. Record its path/hash, observed defect and region.
2. Pick one defect class: composition, typography, arrows, palette, or local motif.
   List concrete operations and invariants. A coordinated composition/routing
   change is not permission to rewrite labels or topology.
3. Attach the best candidate as an actual image input. Inspect local inputs first.
   Saying "the previous image" without attaching it is not controlled editing.
   Use the tool's supported reference/edit mechanism; do not invent seed, mask or
   input-fidelity controls. If reference editing is unavailable, disclose a fresh
   generation and its drift risk.
4. Send a short delta prompt with repeated invariants, not the entire Method or
   an accumulating critique list. Renew source review when source interpretation
   changes, not when the image alone violates the unchanged reviewed graph.
5. Compare parent/child side by side, defect crops and paper-size views. Recheck
   exact text, relations, color roles and unchanged regions. Reject regressions;
   continue from the best image, not automatically the newest.

Repeated font microfitting or nonuniform raster tint is not automatically a reason
for another whole-image call. After semantic/image acceptance, record source-matched
native font/fill approximations in the reconstruction contract where appropriate.
Wrong scientific arrows still block image-stage promotion; this change does not
introduce a partially correct PNG acceptance path or weaken the native/Office gate.

Delta prompt:

```text
Input Image 1: candidate to edit; preserve its scientific structure.
Change only: <one defect class, concrete region and operations>.
Keep: <outside geometry, exact labels, edge directions, semantic colors,
hierarchy, no title/footer, flat solid fills>.
Success test: <observable improvement at intended paper width>.
Do not add modules, duplicate labels, decorations or new stages.
```

Keep `rounds.json` entries: `parentImageSHA256`, submitted `promptPath`,
actual `inputImages` (path/hash/role), `outputImage` (path/hash), `defect`,
`changes`, `invariants`, `observations`, `decision` (keep/reject/unverified),
and reason. Never imply unexecuted calls. Static prompt revision is not evidence
of visual improvement. Do not invent unavailable model versions or seeds.

## Review pixels before freezing them

Obtain isolated image-stage review before native rebuilding. For new overviews,
first save the image-only account before sharing the brief/spec/source audit; then
provide them for the factual pass, together with actual pixels, constraints and
publication width. The reviewer reports scientific/design findings separately,
with its own accept/revise/unverified verdict. Critical semantic, reading-order,
typographic or routing defects block promotion. User rejection takes precedence.
No editability or Office parity pass can be claimed at the raster stage.
Retain exact inspected image/hash/report. This is not venue certification.

Only then select the exact PNG and switch to
[reference-routing.md](reference-routing.md) and
[png-reconstruction.md](png-reconstruction.md). Freeze typography, regions and
deviations. Compare PNG → SVG → actual Office render; do not return to generic
auto-layout. Final independent native review is still required.

Without imagegen, agent-authored native composition remains available.
The local `candidates` command yields palettes, not aesthetic search. Old gradient
studies and rejected LATS images remain history/failure evidence, not templates.

To assess future prompt changes, use a fixed small cohort of different paper
mechanisms with matched source scope and total image-call budgets. Compare actual
contribution interpretation, scientific relation errors, edit-introduced regressions
and native reconstruction effort. Report all attempts and user rejections; multiple
revisions of one paper are not independent papers. A shorter prompt or structural
test pass is not evidence of higher image quality without such an executed comparison.
