# Source–brief review v2 — amendment verification

## Scope

Focused verification of only `design-brief-reviewed.json` and
`prompt-generate-v1.txt` against the two corrections required in
`source-brief-review.md`. Earlier reviewed inputs, topology, and semantic freeze
were not altered or re-reviewed. No paper author figure/caption, website, README,
image asset, or prior diagram was opened. No model/API/test/repository execution
occurred.

## Verdict: accept for ImageGen input

Both required corrections are present and no scientific topology changed. This
accepts the amended text as an input to generation only; it is not a raster
quality verdict, native-delivery acceptance, or a correctness claim.

| Artifact | SHA-256 | Check |
| --- | --- | --- |
| `design-brief-reviewed.json` | `4a62139615c6fdc7e7909d0cd03203c9da6357d8eb4fa160c4584fa4fe815688` | pass |
| `prompt-generate-v1.txt` | `984304dd2b15e52c44c0dc9280978f3c66ae069c2613298b958bddef42688d62` | pass |

## Amendment checks

- “reproducible filtering” is replaced by “syntax and regression filtering” in
  the brief message and prompt reader takeaway. This no longer overclaims
  reproducibility beyond the pinned code/harness evidence.
- “Paired deterministic evidence streams” is replaced by “Paired evidence
  streams” in the selection-block text and prompt. This no longer characterizes
  external test execution as deterministic.
- The two-phase structure, least-failure cohort, conditional empty-cohort
  normalized-key fallback, and associated original-patch return remain intact.
  They remain supported by the pinned sources previously cited in
  `source-audit.md` and `source-brief-review.md`.
- The amended brief points to this v2 record. It retains no title/footer,
  7-inch/9pt/11pt requirements, 70-word visible-text budget, and the
  author-figure-hidden prohibition.

At pixel review, recheck that the dashed “If cohort empty” route is visibly
conditional, the green original-patch marker is not a correctness signal, and all
text is legible at 7 inches.

