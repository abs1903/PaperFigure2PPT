# Final independent re-review: LATS image-generation workflow

## Verdict

**Ready as a prompt-authoring workflow; not approved as an image or a native
figure.** The new brief/prompt route correctly binds a communication brief to
one semantic spec, requires `--brief`, and does not call an image provider. It
should not be used as a spec-only workflow.

This review inspected the additions only. No image-generation call, image edit,
or visual-improvement iteration was executed or inferred.

## Correction to the earlier independent review

The earlier suggestion that a rollout reuse inset could list `Select` was
unsupported. The official HotPotQA implementation first selects an expansion
node with UCT, evaluates children, and calls `rollout(max(node.children,
key=lambda child: child.value), ...)`. Inside `rollout`, it samples/executes
new states and advances using the highest newly evaluated value; it does **not**
run UCT selection. The review recommendation is therefore superseded:

- Depict the rollout as a dashed, value-guided continuation from the
  best-valued child, with `Absolute depth < 4`.
- Do not include `Select (UCT)` inside the rollout, or describe rollout as
  reusing Select.
- It remains valid to show compact reuse of expansion/tool/value operations,
  provided it does not imply an independent environment or retained ordinary
  tree children.

`design-brief-v2.json` and its compiled draft implement this correction through
`best-child` and the explicit forbidden item `UCT selection inside rollout`.

## Reviewed additions

### Communication brief and compiled prompt

The brief is materially stronger than the initial free-form prompt:

- It names the pinned `HotPotQA --algorithm lats --prompt_sample cot` scope and
  distinguishes it from full-paper equivalence.
- It encodes a non-card composition: dominant tree, compact tools, subordinate
  question-local reflection ribbon, and short returns.
- Every semantic node has one visual owner, every edge has a visible arrow or
  explicit within-block mechanism, and every node has one palette role.
- The corrected limits are present: reflection feeds `Expand` only; no learned
  reward/optimizer, cross-question memory, cloned WikiEnv, retained rollout
  children, unconditional success, or UCT within rollout.
- The exact-text whitelist and 85-word cap are useful safeguards against image
  models adding explanatory prose.

The semantic SHA-256 in the brief matches
`examples/lats-hotpotqa/spec-figure.json`, and compiling with that spec produces
byte-identical text to `prompt-v2-draft.txt`. It intentionally fails against
`examples/lats-hotpotqa/spec.json`, whose semantic snapshot is different. That
failure is correct staleness protection, but documentation/examples must always
identify `spec-figure.json` as the required companion for this brief.

### Design-prompt validation

`assertDesignBrief` is a useful bounded contract, not a scientific validator. It
rejects stale semantics, missing or duplicate node ownership, omitted edges,
cross-block relations falsely marked internal, palette gaps/duplicates, and
excessive or non-unique visible labels. It thereby prevents the communication
brief from silently dropping graph coverage while still allowing several
entities to share a meaningful visual mechanism.

It does not prove that a relation display accurately abstracts code, that a
model-generated image realizes the requested geometry, or that an image is
editable. The source audit, actual-pixel review, selected-reference contract,
and native SVG/PPTX review remain separate gates, as stated in the updated
workflow.

### Updated image-reference workflow

The revised workflow has sound boundaries:

- It separates author-paper comparison from pinned-code claims and calls for
  principles rather than copied artwork.
- It requires a brief before prompting, reviews the compiled prompt before use,
  and limits initial directions and later edits.
- It requires a real attached parent image for an edit, records hashes/inputs,
  and calls a revised prompt alone non-evidence.
- It directs a selected PNG to the reference-bound reconstruction path, rather
  than treating a generated image as an editable deliverable.

The no-title rule is correctly interpreted as **no overall title, subtitle,
footer, caption, or fine print**. Necessary local operation and edge labels
remain allowed. For example, a concise `Backup` label on an ancestor return or
`new child record` next to the corresponding arrow is not an overall title.
Reviewers should reject a local label only when its placement/scale turns it
into a canvas-wide heading or duplicate prose, not merely because it is text.

## Resolved documentation check

The CLI help now advertises:

```text
reference-prompt --spec FILE --brief FILE
```

This matches the enforced command contract, reference guide, skill guidance, and
dedicated CLI test. The previously reported practical discoverability blocker is
closed. No implementation change is requested by this review.

## Checks performed

- Confirmed official `lats.py` selection/rollout control flow, including the
  best-valued rollout start and no UCT in `rollout`.
- Confirmed `design-brief-v2.json` validates only with its matching
  `spec-figure.json`, and that its generated prompt equals the retained draft.
- Confirmed spec-only `reference-prompt` exits with the intended `--brief`
  error.
- Rechecked current `reference-prompt` help output; it now includes `--brief`.
- Ran the PaperFigure test suite: **103 passed, 0 failed**.

These checks verify prompt-contract behavior only. They do not accept a raster
candidate, establish final-size legibility, or approve a reconstructed figure.
