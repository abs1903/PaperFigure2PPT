# Independent source/narrative re-review — Agentless v2

## Verdict: revise (one narrow paper-v1 wording correction)

The revised source chain resolves the prior blocking gaps: it now separates
codebase-to-tree construction, selected-file-to-skeleton construction, and
selected-element-to-retrieved-code; it removes the unsupported issue-to-edit-location
edge; and it identifies repair candidates as Search/Replace edits. The remaining
correction is to avoid claiming that majority voting selects an **original** or
“associated” candidate rather than the normalized patch representation. The supplied
paper text establishes normalization and selection of the highest-occurrence patch,
but not that the submitted artifact must be an untouched original candidate.

After replacing `original candidate` / `associated candidate` with neutral
`selected representative patch` (and removing the corresponding prohibition), the
source/narrative abstraction can pass for the declared paper-v1 overview. This is
not pixel, author-reference, native, Office, or delivery acceptance.

## Review boundary

- Reviewer: `/root/agentless_narrative_review`; delegated with `fork_turns:none`.
- Re-opened: current `paper-method-source.txt`, `source-normalized.txt`,
  `spec.json`, `narrative-plan.json`, and `design-brief.json`, plus applicable
  PaperFigure instructions.
- Not opened: author figure, generated graphics, prior review reports, root
  conversation, and later pinned implementation sources. No code/model/API ran.
- Source boundary: supplied arXiv:2407.01489v1 extract, PDF pp. 3–5 only.

## Resolution of prior findings

| Prior concern | v2 outcome | Evidence |
| --- | --- | --- |
| Codebase to repository tree missing | pass | `codebase-tree`; brief lines 21–27; raw lines 3–8, 36–45 |
| Top-N selection conflated with skeletons | pass | distinct `files` and `skeletons`, `files-skeletons`; brief lines 30–36; raw lines 45–47, 76–80 |
| Related elements conflated with retrieved code | pass | distinct `elements` and `element-code`, `elements-code`; brief lines 39–45; raw lines 81–85 |
| Search/Replace semantics omitted | pass | `samples` is `Search/Replace candidates`; brief lines 57–62; raw lines 140–149 |
| Issue edge at final localization unsupported | pass | `issue-locations` removed; final transition is LLM-only; brief lines 18, 109–112; raw lines 81–85 |

## Current required correction

**R1 — Do not assert output is an original/associated candidate (required).**

The paper says to normalize each remaining patch, then choose the one with the
highest number of occurrences; it details AST parse/unparse and a canonical diff
for that normalization (raw lines 156–163). It does not state whether the final
submission is an untouched pre-normalization sample, a normalized representative,
or another equivalent application form. In contrast, the brief says it “picks one
original candidate diff” (line 10), makes Step 7 “one candidate diff … selected
from the input set” (line 79), and forbids selecting “newly normalized code instead
of an associated candidate” (line 236). Those statements add a later-implementation
style distinction that the declared paper-v1 evidence does not establish.

**Correction:** show/label a neutral `selected patch` or `selected representative
Search/Replace patch`; retain `normalize + frequency` before selection. Do not show
the selection as choosing a pristine sheet from the candidate fan, and do not claim
the normalized form is excluded.

## Cross-record consistency

- The four depicted LLM calls are now internally consistent: file selection,
  related-element selection, edit-location selection, and patch generation.
  `LLM + issue` appears only on the first two and generation; the third is `LLM`.
  This matches the stated paper-prose boundary. The repeated badges are a clear
  visual encoding of a shared issue condition for the supported calls, without a
  spaghetti bus.
- Skeleton → selected code → padded context is now appropriately distinguished:
  selected files deterministically yield skeletons, selected elements deterministically
  yield their code, then LLM-selected edit locations deterministically yield context
  windows with surrounding lines. It does not imply LLM-generated source code or a
  fifth model stage.
- `Related code elements` remains broad enough to cover the source’s classes,
  functions, and variables; class/function snippets are disclosed as Figure 2
  illustration rather than a real repair case.
- Historical pinned-code items remain record-only exclusions. They should not be
  used to resolve the paper-v1 output-form ambiguity above.

## Per-check outcomes

| Check | Outcome |
| --- | --- |
| Paper-v1 scope distinct from later implementation | pass |
| Two phases and three-level localization | pass |
| Deterministic codebase/tree, skeleton, retrieval, context operations | pass |
| Supported issue conditioning / LLM roles | pass |
| Search/Replace generation | pass |
| Filter before normalization/frequency selection | pass |
| Final patch form does not exceed source evidence | fail (R1) |
| No autonomy, success, benchmark, or agent-loop claim | pass |
| Pixels, narrative realization, typography, and routing | unverified |
| Author-figure comparison | unverified / intentionally deferred |
| Native editability, Office render, and delivery | unverified / out of scope |

## Current file identities

| File | SHA-256 |
| --- | --- |
| `paper-method-source.txt` | `b0a9c15af53234d86bae255aca4dbc0751122ddf4ce845eda1d2eb97255a5622` |
| `source-normalized.txt` | `333e59b375703a0bbff6a96a1a03f3a310edd8e218ab911a3e206b5849072ca3` |
| `spec.json` | `8934770d23ae48b3bd353bc787119d3e50aa2210d2d8044afc09753480ea2a96` |
| `narrative-plan.json` | `854d955dd1de48cd769f2e9015bcb978c29547af3507ad45d71a3a1cccda2558` |
| `design-brief.json` | `2265eeaff4337641aec5ff54aac93d55cc3de672e3c0447dc12a19b039c77303` |
| `paper-narrative.md` | `24e9753b6810f4afb7353ac3a474eea840ce7df1935fe721aad90ec869608e9b` |
| `image-reference.md` | `2fd7370de12a1edb12865edc9f3290716b9d5999be387149bfe4453eb5d2a5fc` |
| `visual-review.md` | `9199cb5d65ab9a525ec5d61a0083d56ca381f73b0b20e651370ea6a26a18991e` |

