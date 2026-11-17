# Independent source/narrative review — Agentless

## Verdict: revise

The paper-v1 conceptual scope is appropriate and its two-phase story is mostly
faithful, but source-level corrections are needed before generation. This review
does not assess pixels, the author figure, native/Office artifacts, or delivery.

## Isolation and evidence boundary

- Reviewer: `/root/agentless_narrative_review` (independent-agent task identity).
- Isolation: `fork_turns:none`, as declared in the delegated task. I opened only
  the raw-source extract, current spec/narrative/brief, and applicable skill
  instructions; I did not open author figures, generated images, earlier reports,
  or the root conversation.
- Evidence is limited to supplied paper text (PDF pp. 3–5). No model/code/API was
  run. The paper itself beyond this extract is not verified here.

## Required corrections

1. **Restore source-code → repository-tree preprocessing.** The paper inputs the
   issue and existing project codebase, then first turns the codebase into the
   tree-like repository structure before file localization (raw lines 3–8).
   The spec starts at `Repository structure` as an input. Add project codebase and
   a deterministic conversion, visibly or inside a clearly labeled first block;
   do not make that conversion an LLM action.

2. **Separate selected files from their skeletons.** The LLM selects/ranks top-N
   suspicious files (raw lines 45–47), then skeletons of selected files are built
   and supplied to the next LLM call (raw lines 76–80). The current combined
   `Top-N files and skeletons` node can imply the LLM emitted skeletons. Split the
   semantics or make the deterministic retrieval/formatting internal and explicit.

3. **Make Search/Replace visible.** Repair samples Search/Replace edits with a
   search and replacement part, not unspecified generic patches (raw lines
   140–149). Label the candidate sheets `Search/Replace diffs` or show a compact
   search/replacement pair. Do not imply whole-file regeneration.

4. **Do not claim third-stage issue conditioning without a citation.** The extract
   explicitly pairs issue text with repository structure for file selection (raw
   lines 45–47) and with snippets for patch generation (raw lines 19–20). For
   edit-location selection it names code from related elements but does not state
   that the issue is supplied again (raw lines 81–85). Thus `issue-locations` and
   the third `LLM + issue` badge need direct extra-source evidence or removal/
   qualification.

## Design-brief-specific assessment

The brief’s `LLM + issue` pills are visually clearer than a long issue bus: saying
they bind the *same* issue makes the intended shared condition readable. They are
scientifically safe for the first, second, and patch-generation calls only to the
extent source support is supplied: the first and generation calls are explicit;
the second call’s “fix the provided issue” supports the interpretation but is less
direct; the third has the unsupported gap above. Repeated pills alone cannot turn
an unsupported edge into evidence. If retained, use a single neutral `Issue report`
source plus locally placed `LLM (issue-conditioned)` labels only on supported calls.

The intended progression **skeleton → selected code → context** is conceptually
good: it correctly says the LLM selects locations while context padding is
deterministic, and it preserves surrounding lines (raw lines 81–85, 110–139).
However, it currently hides the preceding selected-file result and fails to show
that skeletons are retrieved/formatted from selected original files. After fixing
that boundary, the selected-code panel must represent code *from selected related
elements*, while the final context panel must visibly distinguish the selected
editing interval from its deterministic surrounding padding. It should not turn
the selected function body itself into the context window.

The filter/rank block is faithful: syntax and regression-test filtering precedes
normalization and highest-frequency/majority selection (raw lines 150–163). Its
“deterministic” label is a reasonable visual shorthand, but not a formal guarantee
of correctness. The no-autonomous-loop and no-success-claim constraints are also
supported (raw lines 164–173).

## Per-check outcomes

| Check | Outcome |
| --- | --- |
| Paper-v1 scope separated from later implementation | pass |
| Localization then repair | pass |
| Project-codebase → repository-tree transform | fail |
| Selected-file result distinct from skeleton retrieval | fail |
| Related-elements → selected-code → padded-context meaning | revise |
| Supported issue conditioning | fail |
| Search/Replace repair format | fail |
| Filter then normalize/frequency-select | pass |
| No autonomy, success, or benchmark claim | pass |
| Pixel/typography/composition review | unverified (no image opened) |
| Author-figure comparison | unverified / intentionally deferred |
| Native/Office/editability/delivery | unverified / out of scope |

## Minimal corrected source chain

`Issue report + project codebase → build repository tree → LLM selects top-N files
→ build selected-file skeletons → LLM selects related code elements → retrieve their
full code → LLM selects edit locations → build padded context windows → LLM samples
Search/Replace diffs → syntax/regression filter → normalize + majority vote →
selected patch.`

Only show issue conditioning where the frozen source supports it.

## Inspected identities

| File | SHA-256 |
| --- | --- |
| `paper-method-source.txt` | `b0a9c15af53234d86bae255aca4dbc0751122ddf4ce845eda1d2eb97255a5622` |
| `source-normalized.txt` | `333e59b375703a0bbff6a96a1a03f3a310edd8e218ab911a3e206b5849072ca3` |
| `spec.json` | `b2a9933edb42064c4dea16a958a278786f3b397197cb7a0cf7426c713c4f078b` |
| `narrative-plan.json` | `afe5ba013dee727e6801e4000715c9278c19f2d990ab0540ddea9c74d33352df` |
| `design-brief.json` | `e7f06e7d6179c1c006dc181afd0f72014016b130b730a38c611655ad520126b3` |
| `paper-narrative.md` | `24e9753b6810f4afb7353ac3a474eea840ce7df1935fe721aad90ec869608e9b` |
| `image-reference.md` | `2fd7370de12a1edb12865edc9f3290716b9d5999be387149bfe4453eb5d2a5fc` |
| `visual-review.md` | `9199cb5d65ab9a525ec5d61a0083d56ca381f73b0b20e651370ea6a26a18991e` |

