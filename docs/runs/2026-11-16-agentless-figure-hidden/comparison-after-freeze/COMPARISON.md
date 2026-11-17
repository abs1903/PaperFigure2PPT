# Agentless: post-freeze comparison with the author figure

Date: 2026-11-17. The user requested this comparison after the generated V3 raster was frozen. The original figure was first opened for this separate comparison. Earlier figure-hidden records and the selected raster remain unchanged; subsequent designs cannot be described as author-figure-hidden.

## Sources and scope

- Author: Agentless paper, arXiv 2407.01489v1, Figure 1, PDF page 3. https://arxiv.org/pdf/2407.01489v1
- Author diagram: `author-figure-1.png`, cropped from the real PDF page rendered with Poppler. The full page and PDF are retained. Attribution: Xia et al., Agentless, Figure 1 (paper license CC BY 4.0).
- Generated: `../selected-reference.png`, accepted V3 raster. Its SHA-256 before and after this comparison is unchanged; see `unblinding-provenance.json`.
- The author figure explains the paper-v1 method. The generated diagram additionally represents a configured route from the pinned implementation, including minimum-failure cohort selection and normalized-key/raw-patch association. These are different abstraction levels, not evidence that the author overview is incorrect.

## Visual and communication findings

| Dimension | Author Figure 1 | Generated V3 |
| --- | --- | --- |
| Main story | A numbered, two-row route gives localization a full row and repair a compact return row. | A left vertical localization chain feeds a long horizontal repair graph. Repair internals dominate. |
| Progressive context | Repository tree, declarations, and selected code show what changes across localization stages. | Files, Symbols, and Edit locations retain the stage names, but generic marks convey less about the actual LLM input and output. |
| Issue conditioning | Repeated issue cards visibly accompany multiple stages. | The issue enters the left-side wiring, but repeated conditioning is visually implicit. |
| LLM role | Repeated robot markers, with an LLM legend, identify model-driven steps. | No explicit LLM marker; the viewer cannot distinguish inference from deterministic processing. This weakens the explanation of the method. |
| Abstraction | Generate patches and Filter & Rank Patches compress the repair stage. | Normalize patches, regression failures, fewest failures, frequency voting and an empty-cohort bypass explain configured implementation details. Useful for a technical detail panel; too prominent for the primary overview. |
| Visual style | Strong stage background grouping and numbered steps, but mixed icons, shadows, dense tiny code and a long return arrow feel dated and cluttered. | More restrained palette and repeated card shapes; large braces and headings, a broad upper gap, and crowded right-side boxes create uneven hierarchy. |
| Reading at small width | Main phases and route remain identifiable; code and issue text become small. | Labels and branching on the repair side compete for limited width; overall cleanliness does not resolve information density. |

## Assessment

The author figure communicates the core paper method more effectively. Generated V3 is a plausible technical schematic, but its accepted raster status does not establish publication-level overview quality. The current review emphasized implementation fidelity and local legibility more strongly than storytelling, proportional emphasis, or explicit LLM roles. No numerical quality score or reader study was performed.

A future primary overview should prioritize the progressive localization funnel, identify LLM-driven steps, keep the two phases balanced, and place candidate normalization/ranking/fallback details in a separate detail panel. A source-correct graph should be followed by an explicit editorial abstraction step before ImageGen. Independent review should assess whether the main contribution can be understood quickly, in addition to checking correctness. This comparison does not itself implement a redesign or establish editable SVG/PPTX or Office delivery.
