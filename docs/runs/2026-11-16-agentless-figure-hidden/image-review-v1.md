# Image-stage review v1 — actual pixels

## Review scope and identity

I directly inspected `candidate-v1.png` (1817 × 866 px) as the first generated
raster candidate, using the amended prompt/brief, frozen spec, and immutable
`generation-record-v1.json`. Author figures, captions, README, websites, image
assets, and prior figure reviews were not opened or compared. No author-reference
comparison is made. This is an isolated image-stage review, not a native
reconstruction/Office review.

| Required artifact | SHA-256 |
| --- | --- |
| `candidate-v1.png` | `082cfbaf36b7736f0de414295ab95b6388ea00ddce4128d3946a44e87e9aeed8` |
| `prompt-generate-v1.txt` | `984304dd2b15e52c44c0dc9280978f3c66ae069c2613298b958bddef42688d62` |
| `design-brief-reviewed.json` | `4a62139615c6fdc7e7909d0cd03203c9da6357d8eb4fa160c4584fa4fe815688` |
| `spec.json` | `91fc27a5e30c34d6a31172a17f2298e427686af4c57e065f0b298a9bf3af146f` |
| `semantic-freeze.json` | `6770722469aec8e41607ba70037280d7128748a07f0d48bbfbb1ac424b7412a9` |
| `generation-record-v1.json` | `27b640c8c380711664c5719dcc5d43dc935351be9cdcde2b4f173487dec7416d` |

The immutable generation record declares no input images, source-figure access
false, author comparison false, and an unreviewed/not-delivery-ready state.

## Verdict: revise

The candidate is a strong visual start, but a source-critical relation in the
Repair selection region remains ambiguous. Do not advance it to native
reconstruction or delivery.

## Actual-pixel findings

| Criterion | Result | Pixel observation and effect |
| --- | --- | --- |
| Scientific scope / two phases | pass | “Localization” spans repository narrowing; “Repair” spans sampling through selected patch. There is no third numbered paper phase, agent/environment loop, title, or footer. |
| Hierarchical localization | pass | Issue report + repository visibly feed Files, then Symbols, then Edit locations; code highlights and the focused-context handoff communicate narrowing rather than a generic card grid. |
| Localized context and candidate fan-out | pass | Focused context visibly feeds a bounded fan-out of schematic edit slips, then Apply edits / Syntax screen. It does not assert executable code or empirical counts. |
| Regression condition and fallback | pass | “Regression failures” feeds “Fewest failures,” not an all-pass badge. The dashed “If cohort empty” bypass reaches Frequency vote and is visibly conditional. No reproduction branch is depicted. |
| **Normalized key → original patch distinction** | **fail** | In the right third, Normalized keys, the least-failure gate, Frequency vote, and green Original patch read as a serial pipeline. The original candidate patch associated with a winning normalized key is not visibly retained or linked into the vote/output. A reader can reasonably infer the canonical key itself is being emitted, despite the final label. This violates the required raw-original versus comparison-key distinction. |
| Composition / reading order | revise | Left-to-right narrowing → fan-out → convergence reads well. The large empty upper Repair area and “Candidate edits” brace are acceptable, but the selection logic loses visual precision because the two evidence streams converge into a small “Fewest failures” box with no visible original-patch association. |
| Typography at 7-inch target | pass with margin | The phase headings are prominent and labels are generally readable in the inspected 1817-px raster at the intended wide format. “If cohort empty” and the stacked-card micro-details are near the density limit; do not reduce them in an edit. |
| Semantic colors | pass | Blue consistently distinguishes localization/proposal operations; red appears as failure marks rather than success; green is confined to the final Original patch and is not paired with a correctness checkmark. Neutral black structures transforms and arrows. |
| Raster/native feasibility | likely feasible; native unverified | White background, flat fills, solid rounded rectangles, ordinary arrows, stacks, highlights, and one dashed bypass are reconstructable with editable shapes. Exact text/route geometry and the phase braces still need later native proof; this review makes no PPTX/SVG/Office claim. |
| No title/footer | pass | Only allowed phase headings and whitelisted mechanism labels are visible; no global title, subtitle, footer, legend, watermark, or provenance text appears. |

## Required next edit: selection-stage semantic routing only

**Defect class:** selection-stage association/routing.

Attach this exact candidate as the reference image and edit only the Repair
selection region from “Normalize patches” through “Original patch.”

**Concrete change:** retain a small visible raw-candidate patch slip (or a clearly
paired raw-patch strip) beside/behind each normalized-key stack, and route the
winning key **and its associated raw patch** through Frequency vote to the green
Original patch. Keep the normalized key visibly a grouping/comparison artifact,
not the emitted document. Preserve the regression-failure route into “Fewest
failures” and the dashed empty-cohort bypass, with the bypass still feeding
nonempty normalized keys only.

**Invariants:** preserve the overall canvas/aspect, all exact visible labels,
two phase headings, repository-to-context hierarchy, syntax screen, candidate
fan-out, green-only final original-patch role, red failure marks, dashed
“If cohort empty” condition, flat solid style, white background, no title/footer,
and no added modules, metrics, code, test results, agent loop, or reproduction
path. Do not shrink existing text.

A re-review must open the edited pixels and recheck the unchanged semantic
relations, final-size readability, and absence of regressions.
