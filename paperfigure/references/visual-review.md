# Independent visual reconstruction review

For faithful PNG reconstruction, use the distinct inventory/fidelity review in
[png-reconstruction.md](png-reconstruction.md). Its source-of-truth and acceptance
contract differ from new method design; an attractive redesign can still fail fidelity.

## Required isolated-review loop

This is a host-agent workflow. `review-status` checks recorded evidence; it does
not launch an agent, inspect images or establish reviewer independence itself.
For new ImageGen overviews, also perform the image-only first reading below in a
fresh context before the source-informed pixel handoff. The earlier source auditor
already knows the intended meaning and cannot supply that first-reading account.

1. **Prepare a neutral handoff.** Retain the source method or pinned code and
   locators, spec, design/palette contract, output paths, intended publication
   width and the user's actual constraints. For new source interpretations,
   obtain an independent semantic pass before polishing the diagram. Give the
   first reviewer fresh context: use `fork_turns: "none"` or the host equivalent.
   Do not copy the creator's conversation, praise, proposed verdict, suspected
   defects or prior review conclusions into the initial task. Raw sources and
   explicit scope/constraints are evidence, not a desired answer.
2. **Audit scientific meaning.** The reviewer traces inputs/outputs, every
   depicted module/edge, state lifetime, training/inference scope, stopping and
   failure conditions, novelty and deliberate omissions. It records supporting
   source paths/lines and unresolved claims in an attributed source-audit report.
   Existing independent source audits can be reused for an appearance-only change;
   reopen affected source claims when the scientific specification changes.
3. **Inspect actual exports.** After mechanical QA, the reviewer directly opens
   `figure.png`, `rendered-pptx/figure.png` and `rendered-pdf/figure.png`, together
   with the actual reference (when supplied), spec and design contract. Inspect
   final-size readability, routes/arrowheads, meaning of each color, solid fills,
   hierarchy, title/footer absence and editable-object evidence. Font names,
   XML checks, path coverage and high native ratios cannot replace seeing the
   rendered files. Missing independent renders remain unverified.
4. **Record concrete findings.** Write an attributed report plus output-local
   `visual-review.json` in the format below. Each problem identifies the relevant
   object or image region, evidence, effect on readers, and required correction.
   Use `accept`, `revise` or `unverified` as the overall verdict, with per-check
   `pass`, `fail` or `unverified`. Required artifact/reference hashes must come
   from inspected files. Do not populate pass values on the reviewer's behalf.
   Record the context-isolation method in the report; hashes establish file
   identity, not that an agent truly inspected them or had no prior knowledge.
5. **Fix, retain, re-review.** The creator repairs the owning spec/layout and
   regenerates into a new directory, preserving rejected artifacts/reports.
   The reviewer does not modify the figure it accepts. A follow-up may reuse
   the isolated reviewer and provide its own findings, the revision delta and
   the new files. It must reopen the revised images and recheck affected source
   claims and cross-format appearance; a description of the fix is insufficient.
   Stop when required checks pass. After three unproductive correction rounds,
   reassess and report unresolved issues as a candidate rather than inventing
   approval or endlessly making cosmetic changes.
6. **Check delivery.** Run `review-status` on the final output. Rejected,
   incomplete or stale records, failed mechanical/render checks and user rejection
   keep delivery unready. Any change to an inspected required artifact invalidates
   that review. If the host cannot delegate or the user disallows it, retain
   `unreviewed`, state what is missing, and provide the artifacts as a candidate.

A design contract names the reference identity/hash, transferable geometry,
spacing, typography, palette meanings and permitted deviations. Scientific facts
and explicit user changes override a generated visual reference. An appearance-only
revision preserves scientific claims; substantive corrections require new source
support and renewed source review. Author-figure comparison is a separate scoped
assessment after the review when doing a figure-hidden experiment; do not call an
ordinary source-informed review fully blind.

## Image-only first reading

Use for new contribution-oriented overviews or substantial narrative redesigns.
Faithful native reconstruction of an already selected image still needs isolated
fidelity review, but does not require another unprimed contribution test.

1. Start a fresh non-authoring reviewer with only candidate image paths, intended
   publication width and minimal task constraints. Do not provide the source paper,
   spec, brief, contribution plan, expected takeaway, creator critique or previous
   verdict. Use `fork_turns: "none"` or equivalent; the source auditor or an agent
   that already read the brief is not fresh for this purpose.
2. Ask what claim the image appears to emphasize, which visible regions/mechanisms
   support that reading, what looks primary versus routine support, and what is
   ambiguous/unreadable. It may inspect both candidates without seeing their plans,
   writing an account for each. Record the actually opened image/hash, prior
   exposure/familiarity and limitations in `first-reading.json` or an equivalent
   attributed report. This is qualitative interpretation, not novelty verification,
   timed human performance or evidence that pretraining knowledge was excluded.
3. Save that account before revealing the expected answer. Then provide the bound
   plan/brief and sources to that reviewer, or use a separate factual reviewer.
   Compare the independent account to the supported claim and audit all relations.
   If the account recovers only generic steps, or a different central mechanism,
   revise the composition even when a source-informed reader can explain it.
4. Keep interpretation and scientific findings separate. Reference the first-reading
   report in the final image-stage review and candidate-selection ledger. A report
   locator/hash does not prove isolation, actual inspection or correct meaning.
   If fresh review is unavailable, mark first reading unverified; do not retrofit
   the old source-informed review or substitute creator self-approval.

Initial task template (fill actual paths; no expected answer):

```text
Independently interpret these paper-figure candidates from pixels alone.
Images: <actual paths>. Intended publication width: <width>.
Before reading any source, brief, plan or earlier review, open each image and
describe its apparent main claim, the visible mechanism supporting it, the primary
versus supporting regions, and ambiguous or unreadable content. Record exact
inspected hashes, your prior familiarity/exposure and limitations in <report>.
Do not verify scientific novelty or correctness without sources. Do not edit images.
Save your account before requesting or opening the source-informed handoff.
```

## Visual quality is a separate decision

For new overviews and material redesigns, review the narrative plan using
[paper-narrative.md](paper-narrative.md) before image generation, then test its
actual realization in the pixels. Use the fresh image-only account above rather
than asking the already-informed source reviewer to reconstruct a first impression.
This is a reviewer observation, not a measured reader-study result.
Assess prominence of the main mechanism, visible transformation of information,
model versus deterministic roles where relevant, and supporting-detail placement.
For contribution-oriented overviews, identify which design distinction is visible
and how the geometry communicates it. Correct step order and clean typography do
not compensate for a generic workflow that hides the paper's contribution.
If these fail, set design/overall to `revise` even when every depicted edge is true.

Record scientific and design findings separately in the report. A source pass,
correct rendering, high native-object ratio or close match to an ordinary reference
does not establish a successful paper figure. If semantic fidelity passes but design
fails, set the overall verdict to `revise` and fail the relevant composition,
typography or modality-identity checks rather than averaging the result into accept.

Check the figure's intended communication claim: can a reader locate the key
mechanism and distinguish it from support machinery without first reading the
source code? Look for a meaningful focal region, reading order, selective detail,
and clear state/time boundaries. Similar rectangles are legitimate when their
roles are similar, but a uniform card grid should be revised when it conceals the
mechanism or gives all components equal visual weight. Concrete code, memory,
retrieval or environment examples can make mechanisms tangible when source-supported;
empty token bars, decorative icons and invented examples cannot repair weak meaning.

Compare to the actual author/reference figure when the task includes comparison,
accounting for differences in scope. Name concrete visual strengths and weaknesses;
do not infer superiority from extra implementation detail or cleaner export. If
only technical compliance has been assessed, say so and leave design unverified.
Human aesthetic judgment is not replaced by an agent pass; user feedback that the
figure is not good enough requires revisiting the design brief and reviewer bar.

## Neutral reviewer tasks

Replace placeholders with real paths and the user's stated constraints. These
are task templates, not fabricated review records.

**Initial source pass (fresh context):**

```text
Independently audit the method interpretation for this research figure.
Source: <method or pinned source paths and locators>.
Intended scope: <specific branch/task and exclusions>.
User constraints: <verbatim relevant constraints>.
Spec, if available: <spec path>.
Trace scientific relations, conditions, state lifetime and unsupported omissions.
Do not run model code or external services. Do not edit the diagram.
Write <source-audit report path> with source evidence and uncertainties.
Do not infer correctness from the creator's labels or from familiar model names.
```

**Actual export pass (same isolated reviewer or a fresh one):**

```text
Independently review these actual architecture-figure artifacts.
Source: <raw method/code paths>; source audit: <independent report, if available>.
Spec/design contract: <paths>. Reference: <path or explicitly absent>.
PNG: <path>; independent PPTX raster: <path>; PDF raster: <path>.
User constraints: <relevant constraints>. Intended publication width: <width>.
Open the images; check scientific fidelity, semantic solid colors, layout, text,
arrowheads, absence of title/footer, editability evidence and cross-format parity.
Do not alter the figure. Report concrete issues with locations and evidence.
Write <review report> and <output>/visual-review.json using this reference's
nine criteria and actual required-file hashes. Give your own verdict; acceptance
is not required. Missing evidence must remain unverified.
```

For a re-review, add the reviewer's prior findings, a concise factual change list
and the new paths. Do not ask it to confirm that the fix worked. If no design image
exists, compare to an explicit design contract and disclose this scope; do not
invent an image reference or claim reference-image fidelity. The current gate
requires a hash-bound reference path, so keep it unready until that evidence is
available rather than silently satisfying it with an unrelated image.

## Review record and gate

The output-local `visual-review.json` has this shape:

```json
{
  "reviewer": {"kind": "independent-agent", "name": "reviewer task identity"},
  "verdict": "accept",
  "checks": {
    "referenceComparison": "pass",
    "semanticFidelity": "pass",
    "composition": "pass",
    "modalityIdentity": "pass",
    "typography": "pass",
    "phaseClarity": "pass",
    "editability": "pass",
    "noTitleOrFooter": "pass",
    "officeRender": "pass"
  },
  "reference": {"path": "relative/path/from/output/to/reference.png", "sha256": "actual hash"},
  "artifacts": {
    "spec.json": "actual hash",
    "figure.svg": "actual hash",
    "figure.pptx": "actual hash",
    "figure.pdf": "actual hash",
    "figure.png": "actual hash",
    "rendered-pptx/figure.png": "actual hash"
  },
  "notes": ["Observed evidence, safe deviations and unresolved limitations"]
}
```

Use `revise` and `fail`/`unverified` honestly. The example describes the record
format, not a default approval. Do not fill it with pass values on the reviewer's
behalf. The validation gate can verify attribution fields and matching files, not
whether a person/agent genuinely inspected them. Independence remains a workflow
requirement, never a cryptographic claim.

`review-status` writes `delivery.json` and exits 2 unless the review accepts every
criterion, hashes match, mechanical QA passes, and independent rendering succeeds.
Any change to an inspected artifact invalidates the review. Image similarity is
not the acceptance metric; the reviewer must explain meaningful differences.

Persist user rejection in output-local `user-feedback.json` with
`{"verdict":"revise"}`. A scoped agent acceptance cannot override it. Historical
case lessons and accepted-fixture limits are in [case-guide.md](case-guide.md).

For the reference-bound native layout route, see [reference-routing.md](reference-routing.md).
`review-status` uses its target-specific artifact inventory and verifies the selected
PNG, reference-geometry freshness and actual Office-render hashes. The legacy
`figure.svg` route's record must not be silently substituted for this route.
