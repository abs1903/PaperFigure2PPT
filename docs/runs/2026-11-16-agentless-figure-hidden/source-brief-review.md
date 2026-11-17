# Source–brief review — pre-ImageGen

## Boundary and materials inspected

Independent focused review of the authored, text-only inputs below against
`source-audit.md` and the eight pinned Agentless files. I did not inspect a
paper figure/caption, README, website, image asset, prior diagram/review, or web
content; no model/API/test/repository code was executed.

| Artifact | SHA-256 |
| --- | --- |
| `spec.json` | `91fc27a5e30c34d6a31172a17f2298e427686af4c57e065f0b298a9bf3af146f` |
| `design-brief.json` | `b2d222653fa9ab3964f17ac2f40ab3b376539388c02772efd80aec23b2822a44` |
| `prompt-v1.txt` | `3e2b0cddc5047d15c13a6e5c4ff3ade5d100917758a70c9ade732e499c298c63` |
| `design-options.md` | `604b0f146bce33a2a92ce313c4f4930435ef2334dcdceb56c20d1903445e5052` |
| `semantic-freeze.json` | `6770722469aec8e41607ba70037280d7128748a07f0d48bbfbb1ac424b7412a9` |
| `source-manifest.json` | `09de0c43d7d21ff1da7854fc3fdcbb1a5b38b237c8bdae30a82ee501f2afee14` |

## Verdict: revise (one narrow wording correction)

The visual topology and source abstraction are suitable for generation after the
two unsupported assurance words are removed. No structural, branch-condition, or
raw-patch correction is required.

## Checks

| Check | Result | Evidence / finding |
| --- | --- | --- |
| Author-figure-hidden boundary | pass | All inspected inputs explicitly prohibit author-figure use; freeze says `sourceFigureAccess:false` and `authorFigureCompared:false`. |
| Two paper phases | pass | Brief assigns only Localization and Repair; proposal and selection are Repair subregions. Spec also sets display title/subtitle/legend false. |
| Hierarchical localization | pass | Issue + repository feed files, then symbols, then edit locations, matching the staged path in `localize.py:138-149,170-372`. |
| Localized repair context | pass | Locations, original repository source, and issue converge at focused context, consistent with interval construction in `repair.py:226-269` and its repair prompt path. |
| Sampling and static screen | pass | Greedy plus sampled edits lead to apply/syntax/no-op screening; this is supported by `repair.py:403-478,568-605` and `postprocess_data.py:11-49`. It does not incorrectly depict linting. |
| Regression abstraction | pass | “Regression failures” and “Fewest failures” correctly avoid a zero-failure/correctness claim. The chosen route has regression on and reproduction off. Pinned reranking uses the minimum recorded failure-list length (`rerank.py:27-45,170-194`); test runner produces the underlying selected baseline-passing-test failure reports (`run_regression_tests.py:18-31,71-87,133-170`). |
| Fallback condition | pass | Dashed normalized-key bypass is explicitly conditional on an empty usable least-failure cohort and votes over nonempty keys, matching fallback logic (`rerank.py:217-254`). It is not a reproduction path. |
| Normalized key versus delivered patch | pass | The brief/prompt state that the canonical key groups candidates but the winner is an associated **original** patch. This matches the warning that normalized diff need not apply to original source (`postprocess_data.py:469-470`) and selection of `sample["patch"]` (`rerank.py:282-287`). |
| 7-inch communication brief | pass with generation risk | 7-inch width, ≥9 pt body, ≥11 pt phase headings, 70-word maximum, no title/footer, and 19 short whitelisted labels are sufficient. The 13 semantic nodes need not become 13 equal cards; option A and the brief instead use narrowing/fan-out/convergence. At raster review, verify the dashed fallback label, two evidence streams, and code-tree distinctions remain readable at final size. |
| Unsupported assurance language | fail | The message in `design-brief.json:4` and `prompt-v1.txt:2` says “reproducible filtering”; selection representation in `design-brief.json:45` says “deterministic evidence streams.” The pinned code establishes procedure, not reproducibility/determinism across harness environments, dependencies, timeouts, or model samples. Replace with “syntax and regression filtering” and “paired evidence streams.” |

## Required correction before ImageGen

Change only this wording in the brief and compiled prompt:

- “using **reproducible filtering** and normalized-patch frequency” →
  “using **syntax and regression filtering** and normalized-patch frequency”.
- “**Paired deterministic** evidence streams” → “**Paired** evidence streams”.

Keep all topology, labels, fallback conditions, palette roles, two-phase headings,
and original-patch outcome unchanged. Re-hash the changed brief/prompt and then
generate. This review is not a raster verdict or an authorization to claim final
figure acceptance.

