# ImageGen skill optimization: contribution binding and candidate review

Date: 2026-11-17. Scope: upgrade the existing single PaperFigure skill and offline prompt compiler. No image generation, model/API calls, new paper benchmark or native rerender was performed in this task.

## Implemented changes

1. **Contribution-bound prompt contract.** New version 1.1 briefs bind a narrative-plan path and parsed-object SHA-256, and select a composition ID. The compiler reads the actual plan, validates its digest, checks claim evidence against named spec sources, validates focal/support/outside placement and visual block ownership, and emits the contribution hierarchy directly. The takeaway and composition/mechanism come from the plan; contradictory duplicate brief fields fail. Missing/stale 1.1 plans cannot silently fall back to 1.0. Complete node/edge/palette coverage checks remain active.
2. **Two composition candidates within the existing budget.** Skill guidance defaults to two initial directions plus up to two edits within four total image calls. It records actual candidate identity, plan/composition, image-only and factual review, decision and reason. An already selected/approved layout or explicit constraint can use a documented single-composition exception. Literal duplicate alternatives fail structural validation; whether two layouts are meaningfully different remains a review judgment.
3. **Image-only first reading before factual review.** A fresh non-authoring reader gets actual images and minimal reading constraints before the source, brief or intended takeaway. Its apparent-claim/mechanism account is saved first, then compared with the source-supported claim. The earlier source auditor cannot reconstruct this evidence after learning the answer. Source-informed fidelity review of an already selected native target remains a separate task.
4. **Focused supporting guidance.** New prompts omit internal node-owner IDs while retaining all required directed relations. Local mechanism/contribution captions are explicitly allowed. Source/brief mistakes require renewed affected source review; raster violations of unchanged correct semantics require image repair, not pointless repetition of the source audit. Font microfitting and subtle raster tint can use declared source-matched native approximations after image acceptance. Incorrect scientific arrows still block promotion, and native/Office delivery gates are unchanged.
5. **Evaluation boundary.** Guidance calls for a small fixed paper cohort and matched image-call budgets before claiming quality/efficiency gains. Multiple revisions of one paper are not independent paper samples. This task implements the software/workflow requirements; it does not supply those new image experiments or a quality improvement claim.

## Contract and compatibility

`reference-prompt --spec FILE --brief FILE` keeps its CLI shape. For 1.1 it resolves `narrative.path` relative to the brief, reads that plan, and validates `digest(parsedPlan)` before compiling. This digest uses the existing `digest()` helper (`JSON.stringify`), not pretty-printed raw bytes. Formatting-only whitespace does not invalidate it; content/key-order changes do.

The plan's `contributionHierarchy` entries have stable IDs, explicit novelty/combination status, placement, source quotes, visual owners/cues and prominence. Its alternatives carry composition IDs, composition descriptions and mechanism depictions. A nonempty `compositionException` is required if only one is supplied. Quotes establish presence, not scientific entailment. The compiler does not read images, certify review independence or confer visual acceptance.

Version 1.0 retains its public function/CLI behavior and byte-identical prompt format. Historical briefs and accepted outputs were not migrated in place. Entry instructions remain concise and details live in references. No extra skill, provider adapter, dependency or registry was introduced.

## Executed verification

- `node --test paperfigure/tests/design-prompt.test.mjs`: **9 tests passed**, including the existing literal prompt golden and legacy CLI; bound hierarchy/selected-alternative compilation; missing/stale/contradictory plan rejection; invalid evidence/ownership/focal placement rejection; composition selection/exception; and real CLI plan loading from a different working directory.
- Existing LATS and accepted Agentless 1.0 prompts were captured before the change and regenerated afterward: hashes match exactly. `legacy-baseline.json` and `compatibility-verification.json` retain the evidence.
- Real Agentless inputs were adapted into **two 1.1 briefs bound to the same plan/spec**: source-funnel and nested-focus. Both compiled through the library and actual CLI with identical output. This is an offline interface example, not two generated/visually reviewed candidates.
- The source-funnel demonstration is 7,878 characters versus the historical 9,916-character prompt. That change includes both new compilation and shorter authored descriptions; it is not an isolated compiler ablation, a latency measurement or proof that shorter is better. The alternate is 7,958 characters.
- Skill format validation passed; all 26 relative skill links/anchors resolved.
- All 14 artifacts covered by the previously accepted Agentless native review retain their hashes. The earlier SVG/PPTX/Office acceptance remains attached to those unchanged artifacts.

## Artifacts

- [Agentless adaptation script](prepare-agentless.mjs), [bound plan](agentless-inputs/narrative-plan.json).
- [Source-funnel brief](agentless-inputs/brief-source-funnel.json), [nested-focus brief](agentless-inputs/brief-nested-focus.json).
- [Source-funnel prompt](prompt-source-funnel.txt), [nested-focus prompt](prompt-nested-focus.txt), [compilation record](agentless-compilation.json).
- [Test output](design-prompt-tests.log), [compatibility verification](compatibility-verification.json).
- `before/` and `before-manifest.json` preserve the exact pre-change code/instructions and prompt outputs, including reference versions used by earlier source reviews.

Actual new image calls: **0**. Actual new image-only reading or visual candidate selection: **unperformed**. These are future-run protocol requirements, not evidence fabricated from the offline compiler checks.
