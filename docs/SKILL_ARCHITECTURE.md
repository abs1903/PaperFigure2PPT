# Single-skill architecture and delivery policy

PaperFigure keeps one skill with two authoring routes. The entrypoint contains
routing and shared invariants; detailed design instructions live in
`paperfigure/references/design-workflow.md`, and case selection/history lives in
`paperfigure/references/case-guide.md`. Existing typography, routing and visual
review references remain conditional resources.

## Responsibilities

- `SKILL.md`: select design, reconstruction or revision; retain shared constraints.
- `references/`: method-specific procedures, schemas, examples and limitations.
- Design: `spec.mjs` -> `layout.mjs` -> `export.mjs` -> `qa.mjs`.
- Reconstruction: frozen reference contract and authored layout scene ->
  `layout-export.mjs`, measured layout/native/reference/typography checks.
- `output-validation.mjs`: refresh route-specific mechanical evidence and persist
  output-local delivery state without regenerating the figure.
- `delivery-status.mjs`: evaluate mechanical, render and review stages using shared
  reviewer identity, nine criteria, artifact/reference hashes and user rejection.

The two scene models and exporters remain separate. They have different goals:
original composition versus fidelity to a selected reference. This change unifies
acceptance policy and observable status rather than forcing one scene model.
Existing imports from `visual-review.mjs` and `reference-layout.mjs` remain valid.

## Observable behavior

`build`, `reconstruct`, `qa` and `review-status` report version 1.0 delivery status
with `mode`, `mechanicalPassed`, `validation`, `visualAcceptance`, `deliveryReady`
and reasons. Stages use `pass`, `fail` or `unverified`. Visual acceptance describes
the review stage; readiness requires every stage to pass. See
`paperfigure/references/evaluation.md` for commands, fields and exit codes.

`qa` now handles both routes and refreshes mechanical reports from actual exports.
Unchanged reports retain their exact bytes to avoid invalidating existing reviews.
`review-status` reads evidence without rerunning renderers or reviewers. Previous
route-specific visual-acceptance strings are normalized; existing review records
and frozen accepted example artifacts are preserved.

## Verification

116 distinct tests passed in bounded batches: 54 existing renderer/reference
checks, 60 delivery-policy/design/geometry/native/browser/reconstruction/typography
checks, and 2 output-validation integration checks. The 13 new tests cover shared
status and CLI persistence, missing/invalid reviews, user rejection, stale files,
separate stage failures, missing typography/contract, no-op report preservation,
and revalidation of tampered SVG/PPTX output. Policy acceptance fixtures are
explicitly synthetic and do not represent real visual reviews.

Skill validation, Markdown reference-link checks and `git diff --check` passed.
Actual Chromium measurement ran; no new paper figure, Office render or independent
visual acceptance was created by this refactor. Existing typography regression
checks confirmed frozen AgeMem/MemSkill artifacts remain unchanged.
