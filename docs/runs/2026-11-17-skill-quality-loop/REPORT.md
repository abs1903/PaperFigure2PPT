# Three quality improvements: implementation and pilot evidence

The single `paperfigure` skill now supports reader-task evidence, a shared visual
contract for ImageGen/native authoring, and an explicit actual-edit protocol.
This run used existing cases; no new ImageGen call, paid API or model experiment
was performed. Source figures and prior acceptance records remain unchanged.

| Check | Observed result | Qualification |
| --- | --- | --- |
| CLIP reader tasks | 3/4 correct; one critical unclear answer | Learning versus encoder reuse is not fully recovered; communication fails |
| MAE reader tasks | 4/4 correct | Diagnostic agent reading, not human evaluation |
| Agentless reader tasks | 4/4 correct | Diagnostic agent reading, not human evaluation |
| Shared design/native bridge | 16 modules, 30 text lines, 56 paths, 13 routes checked | Retrospective capture of an accepted figure, not proof it guided its earlier ImageGen generation |
| Code-regeneration edits | 3/3 structural, actual LibreOffice and independent visual checks pass | Not Microsoft PowerPoint application editing |
| Microsoft PowerPoint edits | 0/3 usable outputs; later fixed/control opens also fail | Native application editing remains unverified |
| Final software regression | 131/131 pass | Both existing routes and new quality checks |

## Executable changes

- `scripts/reader-test.mjs` creates an allowlisted public image/question handoff,
  checks complete answer denominators and attributed grades, and rejects stale
  evidence. A critical ambiguity fails communication acceptance. Both delivery
  routes honor an attached `reader-test-binding.json` in their review stage.
- `scripts/visual-contract.mjs` defines shared typography, paint, ownership,
  geometry and connector bindings. The prompt compiler consumes it; reconstruction
  checks complete coverage before export; QA and delivery recheck freshness.
- `references/quality-loop.md` defines actual editing tasks and application versus
  code-regeneration qualifications. The entrypoint adds only a compact route.

`forward-review.md/json` records a separate non-authoring forward test and visual
inspection of all three edited Office renders. The bridge's independent review
accepts reference fidelity, with `deliveryReady:true` for that narrow scope. It
does not override the failed CLIP reader task or qualify PowerPoint interaction.

## Export defects found by the editing trial

The initial PowerPoint trial opened repaired copies but produced no usable edited
output. Inspection found three concrete file defects: an untyped JSON package
part, `xml:space` on DrawingML `a:t`, and presentation children out of schema order.
`scripts/pptx-package.mjs` fixes these when emitting either pipeline and checks the
known constructs during native/design audits.

[Official ECMA-376 Part 4 schemas](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
were used to validate `slide1.xml` and `presentation.xml` in the repaired candidate;
both pass. This was not full-package XSD validation. Content-type coverage is a
separate internal package check. See `powerpoint/ecma-xsd-qa.json`.

Subsequent PowerPoint 16.115 application-script opens fail with `-9074` for both
the corrected native export and an unmodified minimal PptxGenJS control. A bounded
LaunchServices probe also created no owned presentation. This leaves a shared
application/open-environment blocker; it does not prove the static fixes solve
every PowerPoint compatibility issue. All affected editing tasks remain failed
or unverified, with 0/3 usable application-edit outputs. No further unchanged
retries were run; the two pre-existing user presentations remain open and intact.

## Records and reproduction limits

- `reader/`: raw/frozen image-only answers, normalized records, private rubrics,
  separate grading and executable reports. CLI handoff records were serialized
  after the actual minimal host handoffs; they are not claimed as upstream CLI
  executions for this retrospective cohort. The independent forward trial did
  execute a fresh CLI handoff.
- `bridge/`: compiled prompt, complete shared contract, full native reconstruction
  and actual Office checks. The contract is a retrospective capture; this trial
  proves plumbing and drift detection, not reduced information loss in a new
  ImageGen generation. No aesthetic improvement percentage is inferred.
- `scene-edits/`: three functional edits with real exported files and LibreOffice
  checks. The added branch is an editing fixture, not a new CLIP mechanism claim.
- `powerpoint/`: original failure, type-only probe, schema-fixed candidate,
  unchanged library control, scripts and final environment findings. Raw app
  inventories containing unrelated document names stay local and ignored;
  `application-open-errors.txt` retains the relevant error output for publication.
- `initial-regression-failure.txt`: initial golden-byte failures after format
  repair. Historical files retain their exact hashes; updated tests permit only
  the three explicit XML/package corrections, compare every other part exactly,
  and still require deterministic emission. `final-regression.txt` has 131 passes.

Skill validation and local discovery pass; exactly one `paperfigure` skill remains.
The new modules require only existing dependencies and packaged references.
The initial scene-edit harness run failed before any export because its parent
output directory was missing; `scene-edit-results-v1-rejected.json` retains all
three failed attempts. After fixing the harness, the same three assigned tasks
were rerun successfully; these are attempts on three tasks, not six distinct tasks.
The README now links the format-repaired CLIP export and exposes the reader
ambiguity. Its SVG and actual Office PNG hashes exactly match the prior accepted
render; no image/artifact replacement was used to conceal a visual change.

## Reader understanding

Three fresh-context agents received only neutral image paths, reading constraints
and public questions. They saved observations before private rubrics/source handoff.
The raw observations are retained in `reader/`; normalization changes field layout,
not answer prose, and records raw hashes. A separate source-informed assessor wrote
the grading. `reader/grading.md`, the `*-grading.json` and `*-report.json` files
preserve actual judgments and all assigned questions.

The first host handoffs preceded these CLI-format records; the pilot does not
pretend the CLI generated those earlier handoffs. The independent forward test
subsequently exercised the actual handoff command and found no answer/rubric leakage.
Context isolation and absent model familiarity cannot be proven by file hashes.

The critical CLIP finding is q3: the reader identifies reuse but does not conclude
which components learn during pretraining. The saved q1 answer also notes that the
training text looks like short labels, without establishing unrestricted captions.
The source-informed assessor graded q1 correct and q3 unclear; those judgments are
retained rather than replaced by the author's preferred interpretation. A fidelity
acceptance of this figure does not clear its reader-task failure.

The executable reader report checks evidence freshness and complete denominators.
An output-local `reader-test-binding.json` attaches it to either delivery route;
critical failure or missing/stale evidence prevents the existing review stage
from passing. Legacy artifacts without that binding retain their narrower scope.

## Shared design and compatibility-only reconstruction

`visual-contract.mjs` compiles typed font/color/label/relation roles into the
ImageGen prompt and audits the same values in a native scene. Partial contracts
allow free exploratory geometry; complete contracts cover every actual native
module, label, path and edge before reconstruction exports. `qa` and the delivery
gate reject incomplete, changed or stale contract evidence. Existing unbound
prompts remain byte-compatible.

`bridge/` applies the contract retrospectively to accepted CLIP. Its SVG and actual
LibreOffice preview are byte-identical to the earlier accepted render. Its PPTX
contains the format fixes below. A fresh non-authoring reviewer accepted
`bridge/output/` as faithful reconstruction with `deliveryReady: true`; this is
not a new narrative acceptance or proof of reduced human authoring time.

## Actual edits and the native application limitation

`run-scene-edits.mjs` performs three independent changes on copies: a longer label
with explicit reflow; a module move plus reroute; and a native branch addition.
The branch is an editing fixture, not a new CLIP scientific claim. The generated
objects, actual LibreOffice renders and independent visual inspection pass for all
three. See `scene-edit-results.json`, `scene-edit-office-results.json` and the
independent forward review. An initial runner setup failure is retained separately.

Microsoft PowerPoint 16.115 initially opened owned copies as repaired documents;
the save/export trial produced no usable output. Tasks 2 and 3 were left unverified
after the shared blocker. Package/schema fixes were then tested with fresh copies;
both corrected export and a minimal unmodified-library control fail at the same
AppleScript open call with error `-9074`. A LaunchServices probe also produced no
owned presentation. The final open-presentation count remains the two pre-existing
user documents; owned test documents were closed. No user document was edited.
Application-script elapsed time is not human editing time.

Two XML parts now pass the official [ECMA-376 Part 4](https://ecma-international.org/publications-and-standards/standards/ecma-376/)
Transitional schema. The native emitter no longer puts `xml:space` on DrawingML
text, orders the presentation's notes-master list correctly, and declares the
embedded JSON part's content type. Both export routes share this fix and the
package check. Schema validation is not proof of application compatibility;
the PowerPoint trial remains unverified. See `powerpoint/ecma-xsd-qa.json` and
`powerpoint/application-open-errors.txt`. Raw app-window/presentation-list logs
remain local to avoid publishing unrelated document identifiers.

## Verification and independent forward test

`final-regression.txt` records 131 passing tests. The first broad batch's two
failures are retained in `initial-regression-failure.txt`: old goldens demanded
identical emitted package bytes. The updated regression keeps every archived
file hash frozen, permits only the three specified format deltas, compares every
other ZIP part exactly and checks deterministic regeneration. It does not accept
arbitrary drawing or typography drift.

The skill creator validator passes; dependency/Chromium self-check passes; skill
discovery still finds exactly one `paperfigure` skill. `forward-review.md/json`
records independent CLI execution, actual image inspection and resolved findings.
The README links the compatibility-only PPTX and discloses the reader ambiguity.
No comparative claim about new ImageGen quality or human editing cost is made.

The application/control open failures do not fully localize an environmental cause; they leave native application editing unverified even though the two checked XML parts now validate. Binary PDF/PPTX attributes keep artifact diffs meaningful.
