# Reader understanding, shared design, and actual edits

Use for a new overview, material narrative redesign or explicit quality assessment.
For faithful appearance-only work, reuse unaffected evidence and disclose its scope.
Keep the existing mechanical/render/review stages. Fidelity does not establish
reader understanding or convenient editing.

## Reader tasks

Choose questions tied to the target reader's job: recover the central mechanism,
distinguish important roles/phases, and identify a tempting misunderstanding.
Put questions in a public record and expected answers/source evidence in a private
rubric. Mark essential distinctions critical. Avoid questions that reveal answers.

Public `reader-questions.json`:

```json
{"version":"1.0","audience":"ML researcher unfamiliar with this figure","publicationWidthIn":7,
 "questions":[{"id":"scope","prompt":"What changes between the two regions?"}]}
```

The private rubric has `questions:[{id,critical,expected,sourceEvidence}]`. Source
locators support expected interpretations; do not demand out-of-scope detail.

```sh
node scripts/reader-test.mjs handoff --image candidate.png \
  --questions reader-questions.json --out NEW_READER_FOLDER
```

Give a fresh non-authoring agent only that folder and minimal reading constraints.
It opens pixels at publication width and saves an observation with
`reviewer:{kind,name}`, `isolation`, `priorFamiliarity`, inspected `image`
path/hash and `answers:[{id,answer,visibleEvidence,uncertainty}]`. Freeze the
observation before disclosing rubric, sources, brief or earlier verdicts. Context
isolation does not remove prior model familiarity; record that limitation.

A source-informed assessor grades saved answers `correct`, `misread`, `unclear`
or `unverified`, with reasons. Save `grader:{kind,name}`, `observationSHA256`
and `rubricSHA256` (raw file hashes), with `answers:[{id,status,reason}]`.

```sh
node scripts/reader-test.mjs check --handoff NEW_READER_FOLDER/handoff.json \
  --observation observation.json --rubric reader-rubric.json \
  --grading reader-grading.json --out reader-report.json
```

The command checks complete denominators, identities and recorded judgments; it
does not grade science or prove isolation. Critical misreads/ambiguities require
revision of the owning narrative/representation before new-design acceptance.
Save failures even when the figure passed source/fidelity review. Agent reading
is diagnostic evidence, not human comprehension speed or an aesthetic ranking.

For new designs, save an output-local `reader-test-binding.json` containing
`{path,sha256}` for the reader report (raw file hash). Both routes check this
binding in the existing review stage: design compares to `figure.png`, while
reference reconstruction compares to its frozen target PNG, with final native
fidelity reviewed separately. Missing/changed evidence or critical task failures
keep the review unready. The independent reviewer hashes the binding and report
alongside the route's other artifacts. Legacy outputs without a binding retain
their narrower historical qualification; do not retrofit accepted history.


If training/use regions repeat similar text chips, test whether readers distinguish
supervision from class descriptions and learning from parameter reuse. Fix missing
visual evidence when that distinction matters; do not impose a universal badge.

## Shared design values

Use `visual-contract.json` for values shared by ImageGen and native authoring:
typography roles, color roles with meanings, label identities, ownership and
endpoint relationships. Raster pixels and source semantics remain additional
authorities; the contract does not prove ImageGen compliance.

During exploration use `coverage:"partial"`: fonts/colors/roles may be fixed while
coordinates remain free. After choosing an image, inspect it and create a versioned
`coverage:"complete"` contract with native module/label/path/edge bindings and
relevant geometry. Preserve the pre-image contract and explain approved changes.
Do not extract a contract from finished native output and claim it guided generation.

The JSON has `version:"1.0"`, `canvas:{publicationWidthIn,width?,height?}`,
`typography:{role:{font,size,bold}}`, `colors:{role:{value,meaning}}` and arrays:

- `modules`: `{id,box?}`;
- `labels`: `{id,owner,text,typography,color,box?}`;
- `shapes`: `{id,owner,fill?,stroke?,width?,box?}`; paints name color roles;
- `edges`: `{id,from:{module,side?,offset?},to:{module,side?,offset?},color,width?,dashed?,endArrow?}`.

Sizes are source-canvas pixels. Omit speculative coordinates during exploration.
Read role values when measuring text and building paths; changing fonts after
glyph positioning requires refitting. Reuse existing primitives and actual cases;
add a reusable mechanism component only after demonstrated reuse.

Bind this file in a version-1.1 brief as
`visualContract:{path,sha256:digest(parsedContract)}`. `reference-prompt` resolves
it relative to the brief and compiles the same roles. The reconstruction contract
uses the same binding convention. `reconstruct` requires complete native coverage,
checks it before export, copies it and writes `visual-contract-qa.json`. `qa`
refreshes that report; `review-status` checks it and requires independent review
hashes for both added artifacts. Existing typography/Office checks still apply.
Legacy prompts without this field remain byte-compatible.

## Actual edit tasks

On copies, test edits a researcher expects: replace a label with a longer one,
move a module and restore its incident routes, and add a branch or another
figure-relevant task. Keep all assigned tasks in the denominator.

Record application/version, method (`application-script`, `manual-ui` or
`code-regeneration`), input/output hashes, elapsed time, save/reopen result,
before/after renders and structural/visual findings. Application-script wall time
is not human editing time. Native object counts do not establish task success.
Repair prompts, failed saves and changed/detached connectors are failures or
unverified evidence, never passes inferred from a successful API operation.

PowerPoint and LibreOffice are separate targets. Before task editing, require a
normal open/save/reopen on a disposable copy. If a shared application blocker is
established, stop dependent tasks and retain their unverified denominator. Inspect
the package/markup and reproduce a focused correction before retrying. The local
package checker covers known content-type/markup defects, not the complete ECMA
schema or all PowerPoint versions. Never modify a user's unrelated documents.

If the target application cannot open/save even a minimal unmodified-library
control, stop that application batch and record the shared blocker. Keep package
schema validation, programmatic scene editing, and application editing as separate
results. A schema-valid or LibreOffice-rendered file does not establish that the
application interaction succeeded.
