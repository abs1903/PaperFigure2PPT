# LATS author comparison and image-generation workflow revision

Date: 2026-11-16. This is a Skill/process revision, not a new accepted LATS figure.

## Inspected evidence

- Author paper: https://proceedings.mlr.press/v235/zhou24r.html
- PDF: https://raw.githubusercontent.com/mlresearch/v235/main/assets/zhou24r/zhou24r.pdf
- Retrieved PDF SHA256:
  `a6b84613eeeaa3beb979ac3e34cbb3575bceb7ccf6050a2c2fc677d5e3a3ab19`.
- Actually opened rendered page 1 / Figure 1 and page 5 / Figure 2. Temporary
  inspection copies only; author images are not bundled with this Skill.
- Local generated study: `examples/lats-hotpotqa/design-study/initial.png`,
  initial prompt, source correction record and current source-reviewed spec.
- Local native candidates remain rejected/unready. Prior experiment records
  saying the author figure was hidden describe the earlier intake only. This
  comparison is now source-informed, not blind; historical files stay intact.

The author PDF identifies author copyright; repository MIT licensing must not be
assumed to grant redistribution of the published paper illustrations.

## Comparison

| Aspect | Author figures | Our initial generated study | Transferable decision |
| --- | --- | --- | --- |
| Communication level | Figure 1: compact system overview; Figure 2: six operation explanations | Twelve implementation entities plus conditions and several loops in one view | Choose a takeaway and abstraction before designing |
| Mechanism | Repeated small trees explain selection, expansion, simulation and updates | A large static tree sits beside a flowchart; operations mostly live in boxes | Show operations on the tree, not merely near it |
| Reading cost | Separate views keep individual explanations compact | Perimeter return paths, duplicate rollout pipeline and detached output compete | Group by visible mechanism; shorten local returns |
| Typography | Modest local labels, consistent operation headings | Heavy headings plus dense sublabels; some text duplicates | Exact label whitelist and intentional text budget |
| Color | Limited repeated visual cues | Nominal semantic colors but generated gradients | Keep meaningful solid roles, check actual pixels |
| Scientific scope | General paper method | One pinned HotPotQA route, including implementation hazards | Compare communication fairly, never silently substitute topology |

These are observed design differences, not a score or a claim that the author
figures are ideal. Do not copy their layout/icons or force the detailed code
route into their conceptual graph. Necessary code distinctions remain supported
in the spec, with reviewed visual compression rather than deleted edges.

## Prompt and iteration failure

The initial prompt asked for polish but also mandated twelve logical entities and
many explicit paths. It did not resolve which entities should become visible
blocks, which operations should be encoded directly in the tree, or how text
competes for space. Additional aesthetic adjectives cannot make those decisions.

It also contained the now-corrected reflection-to-value relation. That was an
intake/prompt mistake, not merely image-model disobedience. The generated image
added UCT inside rollout and ignored the solid-fill request. Both scientific and
appearance defects must be checked on pixels before adopting the reference.

Only one initial LATS imagegen call is recorded. Subsequent SVG/native work is
not evidence of multi-round image editing. There is no basis to claim that the
image model's multi-round capacity has been tested and found inadequate here.
The demonstrated bottlenecks are brief/prompt quality, pre-reconstruction review
and failure to run a controlled image-edit loop.

## Implemented workflow

1. Inspect actual author overview/detail figures and distinguish their scope.
2. Freeze source-reviewed semantics, then author a communication brief: one
   takeaway, mechanism, composition, exact labels, text budget and palette roles.
3. Explicitly map every node and edge into a visual block/internal operation or
   arrow. Compiler validation forbids stale snapshots, missing edges, unknown
   owners and hidden cross-block relations; it does not prove entailment.
4. Select a structural direction before rendering. Generate pixels, inspect them,
   and test a small native-reconstruction crop before committing to a full rebuild.
5. Attach the best actual image for each targeted edit, repeat invariants, record
   parent/prompt/input/output evidence, compare regressions and roll back losers.
6. Obtain isolated image-stage review before freezing the selected PNG. Retain
   final native/export review afterward; they answer different questions.

Code: `scripts/design-prompt.mjs`; `reference-prompt` now requires `--brief`.
Instructions: `references/image-reference.md` and the linked Skill entrypoint.
Draft LATS example: `design-study/design-brief-v2.json` and
`prompt-v2-draft.txt`. It uses five visual blocks with twelve semantic owners and
all fifteen spec edges represented. It is a proposed direction, not an image
request that has already run, a selected target, or a validated aesthetic result.

## Verification and limits

Four focused prompt tests cover corrected-graph emission, byte-matched saved
prompt, stale/omitted/invented objects, cross-block hiding, label budget, palette
coverage, and CLI behavior. Full regression: **103 passed, zero failed/skipped**,
14.5 seconds, `docs/test-results-imagegen-workflow.txt`. Skill quick validation
passed, and `git diff --check` was clean. Isolated review is retained in
`docs/IMAGEGEN_WORKFLOW_REVIEW_FINAL.md` (including the reviewer's correction of
its earlier unsupported Select-in-rollout recommendation).
No new imagegen call, native redraw or paid API was executed in this revision.
The author comparison and isolated workflow review support these changes; actual
visual improvement still requires an executed, reviewed image-edit trial.
