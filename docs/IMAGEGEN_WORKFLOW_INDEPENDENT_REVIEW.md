# Independent review: image-generation workflow for LATS / HotPotQA

## Scope and materials inspected

This is an independent review of the prompting workflow, not a reconstruction
brief for the paper's figures and not a claim that the author artwork should be
copied. I inspected `paperfigure/SKILL.md`, `references/image-reference.md`, the
LATS initial image-generation prompt, `METHOD.md`, `intake-corrections.json`,
and the generated `design-study/initial.png`. I also visually inspected the
temporary author-PDF page renders for Figure 1 and Figure 2. Those temporary
author images are not included or redistributed by this review.

The required deliverable remains a code-grounded, editable native figure with
solid meaningful colours, no visible overall title/footer/caption, and no
bundled third-party artwork.

## What the three visuals communicate

| Visual | Primary communication role | Composition | Appropriate scope |
| --- | --- | --- | --- |
| Author Figure 1 | High-level unification of LM agent, environment, memory, and tree search | Small hub-and-spoke system overview | General LATS paper claim; intentionally abstract |
| Author Figure 2 | Pedagogical inventory of six operations | Six horizontally arranged mini-diagrams | General conceptual operation sequence, rather than the exact HotPotQA code route |
| Current generated study | A single operational HotPotQA control/data-flow overview | Dominant tree plus main loop, rollout inset, feedback loop, and termination route | Potentially suitable for the frozen code path, after scientific and composition repair |

The author figures are effective at a paper-page scale because each makes one
claim with modest local detail: Figure 1 establishes the system-level idea and
Figure 2 separates operation meanings. That is not a universal aesthetic
standard, nor does it establish that their general diagrams must match the
specific repository route. The code-grounded diagram has a different and
legitimate job: distinguish question-scoped stored state, a shared WikiEnv,
the selected tree path, and conditional reflection without implying training or
per-branch environment copies.

## Findings on the current image-generation study

### Useful directions to retain

- The trajectory tree is visibly dominant and the gold path provides a clear,
  semantically meaningful focal cue.
- The main left-to-right route makes the initial execution path easy to find.
- Stored state is mostly grouped around green and LM computation around blue,
  which is close to the declared semantic palette.
- The rollout is visually framed as reuse of the main routines instead of an
  independent world model. Retain that relationship, but make it less dense.

### Scientific rejection condition

The generated image draws `Reflection context` back to both `Expand` and `LM
value`. This is not allowed for the frozen route. `intake-corrections.json` and
`METHOD.md` state that the value-prompt feedback is overwritten in the actual
code. A future native candidate must retain **Reflection context -> Expand**
only; it must not show, label, imply, or visually route feedback into `LM
value`.

The study also presents a very explicit `Shared WikiEnv -> Failed traces` path
labelled “Terminal wrong answer”. That is helpful, but the final wording should
remain narrow: terminal zero-reward traces are recorded after tool execution;
it must not suggest that every WikiEnv observation is a failed trace or that
the environment itself owns reflection.

### Visual and prompt-contract issues

- The topmost “Add new child records to tree” is a visible global heading-like
  annotation. It conflicts with the no-title/no-footer requirement and can be
  replaced by a short local edge label (for example, `new child record`) next
  to the return edge.
- Several modules use blue/green gradients and the rollout panel uses a soft
  wash. The user constraint is solid fills only. Generated colour effects must
  not be treated as a design reference for native reconstruction.
- Long perimeter connectors compete with the main reading route. In particular,
  the return-to-tree, reflection, and completion paths cross much of the canvas
  and create a circuit-board effect. This weakens the tree focal hierarchy at
  paper size.
- The full miniature pipeline inside `Value-guided rollout` repeats labels and
  arrow routing at a scale that will be fragile in an editable figure. A
  compact reuse notation is preferable: one inset with `reuses Select /
  Expand / WikiEnv / LM value`, a loop arrow, and the absolute-depth condition.
- The `Return state` route sits far below the principal story and is joined by
  a long vertical drop. It should be placed nearer the terminal decision, or
  be represented by a short, clearly bifurcated exit route.
- The `Failed traces -> Self-reflection -> Reflection context` line is clear,
  but its relation to the conditional refresh gate and question reset is
  omitted. Do not add a new module merely for decoration; express those facts
  with concise local labels or a small boundary annotation when readable.
- The tree motif is illustrative, which is appropriate only if it remains
  visibly schematic (ellipsis retained; no literal sample count or simulated
  rollout record claim). The selected path should stay gold-only, not become a
  second state colour.

## Recommended prompt and iteration safeguards

1. Freeze a semantic graph before prompting. Include object IDs, every allowed
   edge, edge direction, graph role (data/control/state), and an explicit
   forbidden-edge list. Treat a generated image as a composition proposal only,
   never as scientific evidence.

2. Put the hard exclusions in a short final prompt block, not only prose:
   `NO Reflection context -> LM value`; no learned reward model; no optimizer,
   gradient, training panel, persistent cross-question memory, cloned sibling
   environments, or independent rollout world model.

3. Separate three concepts that are easy for an image model to collapse:
   the stored tree, the shared WikiEnv, and the rollout control loop. Require
   `new child record -> Trajectory tree`, but forbid a diagram that visually
   implies environment state is duplicated per branch.

4. Make the palette a verification contract. Blue is only LM computation
   (`Expand`, `LM value`, `Self-reflection`); mint is only stored state
   (`Trajectory tree`, `Failed traces`, `Reflection context`); gray/white is
   input/control/tool/output; gold is only the selected tree path. Require
   flat solid fills, with no gradients, shadows, gloss, 3D, or decorative
   accents.

5. Ask for composition constraints rather than an author-figure imitation:
   landscape white canvas; tree largest and left/central; primary route readable
   left-to-right; reflection supporting rather than co-equal; rollout a compact
   reuse inset; no title, subtitle, footer, caption, legend, or fine print;
   short local edge labels only. Do not ask the model to reproduce Figure 1 or
   Figure 2 layouts, icons, or styling.

6. Use a bounded, purposeful image iteration budget (at most three rounds).
   Each round should name one observed defect and one targeted change, preserve
   the original prompt/image, and avoid changing the frozen semantic graph.
   Example sequence: (a) focal composition, (b) route decongestion and
   final-size legibility, (c) palette/no-title compliance.

7. Gate any selected generated reference before native authoring. The reviewer
   should check the exact image against the frozen graph and a simple table:
   required edges present; forbidden edges absent; scope/lifetime claims not
   contradicted; palette role mapping valid; no global title/footer; no
   gradients; reading order and labels legible at intended paper size. A pass
   in the image provider or a visually attractive result is not a pass.

8. Rebuild only approved composition elements as native shapes, connectors, and
   text. During reconstruction, remove malformed generated text and decorative
   colour distinctions, preserve only source-backed topology, and run separate
   scientific and visual reviews on the editable SVG/PPTX/PDF renders.

## Suggested next prompt structure

Use the existing factual inventory as the source of truth, then append four
machine-checkable blocks: **required entities and edges**, **forbidden
relations/claims**, **palette-to-object mapping**, and **composition
constraints**. End with: “This is an inspiration image only; do not add nodes or
relations. All labels must be short English placeholders that will be rebuilt as
native editable text.” This maintains the useful role of image generation while
making source review, editability, and final visual acceptance independent gates.
