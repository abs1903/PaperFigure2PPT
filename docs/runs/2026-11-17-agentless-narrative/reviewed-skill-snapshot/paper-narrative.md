# Paper narrative and information selection

Use before composing a new method overview or materially redesigning one. For a
faithful reconstruction, preserve the selected target; narrative redesign requires
the user's design scope. This stage changes what the figure emphasizes, not what
the sources establish.

## Freeze the story before the layout

Save a concise `narrative-plan.json` (or an equivalent project record) containing:

- `scope`: paper/version, concept or configured implementation; intended reader,
  overview versus detail-panel role, and final publication width.
- `takeaway`: one source-supported sentence the reader should retain.
- `story`: input/problem → central transformation → output. Name the focal
  mechanism and the supporting operations; do not imply novelty without evidence.
- `informationSelection`: each relevant source mechanism or implementation detail,
  its evidence locator, placement (`main`, `internal`, `detail`, or `record-only`),
  reason, and representation. Map grouped details to the owning figure block.
  Every essential condition, model role, feedback/state boundary, and output
  interpretation must remain represented or be explicitly outside the scope.
- `visualEvidence`: what changes visibly across the stages (for example a shrinking
  search space, different context representations, or candidate selection). Use
  source-derived fragments where helpful. Label invented examples as illustrative
  in the companion record; never suggest an executed or successful case.
- `alternatives`: two genuinely different compositions and why the selected one
  best explains the takeaway. Specify relative prominence, reading order and a
  figure-specific text budget rather than a fixed universal layout or ratio.
- `review`: independent narrative/source review locator and resolved uncertainties.

Retain the full source audit separately. Derive a figure-level spec for the chosen
scope, tracing its abstractions to that audit. Do not remove edges from a frozen
spec just to make an image easier: a scope/abstraction change creates a revised
spec and requires renewed source review. The communication brief must cover every
node and edge of that figure spec. Internally grouped operations still need visible
meaning; important dependencies cannot disappear behind a generic box.

Code quirks, error branches, AST details or tie-breaking often belong in a detail
panel or companion record when explaining the paper concept. They become main
content when those operations are the question being explained. Compression must
not imply guaranteed success, identical paper/code behavior, or model inference
where the source uses deterministic computation. Keep exact limitations in the
record when they do not belong on the canvas.

## Review the abstraction and then the actual image

Give an isolated reviewer raw sources, the declared scope, narrative plan, spec
and user constraints without the creator's preferred verdict. Before generation,
ask whether the selected story is source-supported and omissions preserve meaning.
For an image review, have it open actual pixels at native and intended paper
width, and record narrative effectiveness separately from scientific fidelity:

1. Can the reader trace the central transformation from input to output?
2. Does visual emphasis match the mechanism being explained?
3. Do code/context/state depictions show informative changes rather than filler?
4. Are model-driven versus deterministic roles distinguishable where relevant?
5. Are local detail and edge density appropriate to the overview's reading task?

For comparison tasks, open the actual author figure and compare both the strengths
and weaknesses at comparable width. Account for scope differences. Cleaner style,
more detail, or an agent's acceptance does not establish superiority. If the source
figure is embargoed, keep it closed until the agreed post-freeze comparison and
record unblinding separately.

An image can pass scientific review and fail narrative review. In that case retain
it as a candidate, repair the owning plan/brief, and follow the bounded image-edit
loop. Record what actually improved and what remains weaker. Native/editable or
Office delivery remains a separate downstream gate.
