# Independent source audit — Agentless overview scope

## Scope and boundary

This audit used only the eight pinned raw files in `source-manifest.json` for
`OpenAutoCoder/Agentless` commit `5ce5888b9f149beaace393957a55ea8ee46c9f71`,
the sanitized section-2 method text for arXiv:2407.01489v1, and the prescribed
visual-review protocols. I did not open the paper PDF/HTML visually, author
figures, captions, README, project websites, image assets, prior diagrams, or
prior reviews. No model/API call, test run, or repository execution occurred.
The manifest records the same author-figure-hidden boundary; prior model
knowledge cannot be excluded. The pinned source is MIT licensed
(`source/LICENSE:1-20`).

## Defensible narrow overview

A source-supported explanatory figure has **two paper phases**, Localization and
Repair (selection stays inside Repair):

1. **Hierarchical localization:** issue description plus a pruned repository
   structure yields a ranked file shortlist; selected files are represented as
   skeletons or raw source to identify symbols (classes, functions, variables);
   selected symbols produce local code windows for final edit-location output.
2. **Repair:** localized code windows and issue text generate one greedy and then
   higher-temperature patch candidates. Parsed candidates undergo an apply,
   syntax, and no-op screen; regression evidence is then used to constrain a
   voting cohort. Canonicalized/normalized patch equivalents are frequency
   counted, returning the original patch of the chosen candidate.

Do not add a reproduction-test branch, online environment/tool loop, autonomous
planner, claimed test guarantee, or a third paper phase called “selection.”
Candidate patch and selected patch are distinct states.

## Paper claims versus pinned behavior

| Topic | Paper-method claim | Pinned implementation evidence | Figure-safe wording |
| --- | --- | --- | --- |
| Hierarchy | Files → relevant classes/functions/variables → edit locations. | Stages are controlled by `--file_level`, `--related_level`, `--fine_grain_line_level` (`localize.py:138-149,170-372,503-555`). | “Repository → candidate files → relevant symbols → edit locations.” |
| File/symbol context | Repository structure finds suspicious files; selected elements reduce context. | Python/test filtering precedes localization (`localize.py:44-49,118-128`); file prompt requests ≤5 files (`FL.py:29-49`); skeleton/raw symbol prompts request class/function/variable names (`FL.py:152-224,363-544`). | “Pruned structure → shortlist; selected-file representation → symbols.” |
| Local windows | Add surrounding code context and concatenate multiple locations. | Location intervals are expanded and line-wrapped (`repair.py:226-269`); line localization uses this construction (`FL.py:546-681`). | “Selected symbols → local code windows.” |
| Sampling | Start greedy, then sample higher-temperature patches. | Temperature 0 request, then temperature 0.8 samples; repair default is 20 candidates (`repair.py:403-478,732-739`). | “Greedy candidate + sampled alternatives.” |
| Static screen | Syntax-error patches are filtered. | Candidate edits must parse/apply; `ast.parse` rejects empty/non-Python syntax (`repair.py:568-605`; `postprocess_data.py:11-24`); whitespace-only diffs are omitted (`postprocess_data.py:35-49`). | “Apply + Python syntax/no-op screen,” never semantic correctness. |
| Regression filter | Existing-test failures are filtered before voting. | Regression runner executes selected baseline-passing tests in a SWE-bench/Docker harness (`run_regression_tests.py:71-87,133-170`; `run_tests.py:211-303`). Reranker retains the **minimum failure-count cohort**, not strictly zero-failure only (`rerank.py:27-45,170-194`). | “Regression screen → least-failure eligible cohort.” Do not say “all tests pass.” |
| Selection | Normalize source/AST form and use majority voting. | Normalization parses/unparses where possible, removes comments/docstrings, then diffs canonicalized contents (`postprocess_data.py:376-470`); voting groups normalized strings and ties break by first occurrence (`rerank.py:256-287`). | “Normalize equivalent patches → frequency-select one patch.” |

## Output conditions and actual flags

- The agreed source route has related and fine-grained localization enabled and
  `direct_edit_loc=false`; this is not every possible CLI configuration.
  Defaults include localization `--top_n 3`, `--temperature 0`,
  `--num_samples 1`, `--context_window 10` (`localize.py:539-555`), while
  repair defaults to `--top_n 1`, `--context_window 10`, `--max_samples 20`
  (`repair.py:732-780`). Avoid putting a fixed count in the overview.
- Symbol/edit outputs retry at most five times; invalid output changes the retry
  temperature to 1.0 (`localize.py:19,173-245,271-372`). Prompt construction
  drops trailing content at a 128k threshold and can raise an error if the
  remaining content is still too long (`FL.py:14,402-418,584-610`).
- No found files or no nonempty constructed repair context produces an early
  empty output (`localize.py:167-168`; `repair.py:292-312,362-382`). Depict
  this, if at all, as a small neutral exclusion/stop condition—not a recovery agent.
- `--diff_format` and `--str_replace_format` cannot co-occur, and string
  replace requires the Anthropic backend (`repair.py:795-803`). Do not elevate
  a specific edit syntax to the paper mechanism.
- `lint_code` exists (`postprocess_data.py:52-104`) but is not called by this
  repair post-processing path. “Linting/type checking” would be unsupported.
- The intended rerank configuration is `--regression=true`,
  `--reproduction=false` (`rerank.py:323-331`). Reproduction is excluded by
  scope, even as an optional branch.

## Material regression/voting caveat

The paper’s idealized prose supports a zero-failure regression filter. The
pinned runner records failures among tests that passed in the original repository
(`run_regression_tests.py:18-31,34-68,133-170`). But reranking uses each record’s
failure-list length and converts only the lowest observed count into eligibility
(`rerank.py:170-178`). Thus, if every candidate has failures, candidates with the
fewest failures remain eligible. If no candidates are eligible, it falls back to
all nonempty normalized/raw patches; if all are empty, it emits an empty patch
(`rerank.py:217-254`). Frequency selection therefore does **not** establish that
a patch passes regression tests, resolves the issue, or is correct.

Normalization is a comparison key, explicitly not necessarily applicable to the
original source (`postprocess_data.py:469-470`); submission retains the selected
sample’s original patch (`rerank.py:282-287`).

## Design cautions for the forthcoming brief/pixels

1. Make hierarchical narrowing causal and visually focal: each output constrains
   the next representation/context. Avoid equal-weight card grids.
2. Preserve different visual encodings for repository/file structure, code
   symbols/windows, fan-out patch candidates, and converged normalized groups.
3. Make filtering conditional/exclusion-like. Do not draw test execution
   machinery, a green correctness seal, or a reproduction-test extension.
4. Short labels suitable for 7-inch width: “Issue,” “Repository structure,”
   “Candidate files,” “Relevant symbols,” “Local code windows,” “Patch
   candidates,” “Syntax/no-op screen,” “Regression screen,” “Normalize +
   frequency select,” “Selected patch.”
5. Required omissions: author-figure comparison, provider branding, autonomous
   decision-loop language, correctness/benchmark claims, title, and footer.

## Conclusion

A compact two-phase overview is supported if it shows the repair-phase sequence
as localized context → candidate patches → conditional screens → normalized
frequency selection. The key scientific care point is to preserve the difference
between the paper’s zero-failure ideal and the pinned implementation’s
least-failure cohort plus fallback. No image verdict has been made.

