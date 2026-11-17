# Independent Final Visual Review: ReAct HotpotQA

## Verdict: accept (scoped)

Reviewer: `/root/react_paper_audit`, independent of the figure-authoring task.

I inspected the revised preview, LibreOffice PPTX raster, and PDF raster at
the intended publication width, along with `spec-reviewed.json`, `METHOD.md`,
`design-contract.json`, and `docs/REACT_CODE_AUDIT.md`. The author ReAct
figure was not viewed. This accepts the revised source-first reconstruction
against its stated design contract; it is neither human approval nor a claim
of venue-level figure quality or paper-wide ReAct fidelity.

The prior frozen review remains valid history: it rejected the first output for
an omitted loop bound/forced termination. The revised LM card now states **Up
to 7 steps** and the Answer card states **Finish or forced empty**. These
phrases match the code's `range(1, 8)` loop and post-loop `finish[]` dispatch.
They resolve the prior ambiguity without introducing gradients, training, or
cross-question memory.

| Criterion | Result | Evidence |
| --- | --- | --- |
| Reference comparison | pass | The applicable BLIP2 contract features survive—white canvas, solid semantic fills, controlled strokes, and native serif hierarchy. ReAct topology is an explicit, justified deviation. |
| Semantic fidelity | pass | The rendered path depicts question-conditioned prompt/history, one LM Thought+Action generation, parsed action, Search/Lookup observations, a step record appended for the next step, and Finish to Answer. The two code-visible termination cases are now named locally. |
| Composition | pass | The enlarged LM card preserves the horizontal action path and leaves the lower record/feedback route unobstructed. Reading order remains clear at publication width. |
| Modality identity | pass | Blue denotes LM computation, green denotes within-question retained state, and gray-white denotes external tools/I-O. Labels provide redundant meaning. |
| Typography | pass | Times New Roman renders legibly across all inspected paths; the new local labels are readable and do not compete with module headings. |
| Phase clarity | pass | No visual element implies a gradient, training phase, optimizer update, or persistent cross-task memory. The feedback label says `Append for next step`. |
| Editability | pass | `qa.json` reports 19 native text boxes, 27 native shapes, 12 native connector segments, zero pictures, and editable ratio 1.0. This is structural evidence, not a measurement of manual editing cost. |
| No title or footer | pass | None appears in the preview, Office raster, or PDF raster. |
| Office render | pass | The Office and PDF rasters show all labels and routes without observed clipping, glyph loss, or connector breakage. Route alignment and PDF label checks pass in the render report. |

## Remaining scope limits

The primary route intentionally omits parse-repair, timeout retry, wrapper
scoring, and logging; `METHOD.md` declares those omissions. The exact
few-shot examples are not in the pinned source bundle. A future visual or
scientific change invalidates this hash-bound review and requires a new one.

## Post-freeze author-figure comparison

After the source-first review was complete, I inspected the local crop
`dist/agent-papers-comparison/react-author.png` (SHA-256
`525819d5fab7253649efe8c76b1b3537552c41230628e1098f867d01778fb113`),
identified as Figure 1(1d) from the camera-ready paper. This did not alter the
hash-bound verdict above.

The author figure is a concrete successful text trajectory: it prints four
numbered Thought/Act/Obs turns, shows successive `Search[...]` refinements
after a no-result/similar-entity observation, highlights selected textual
spans, and ends in `Finish[keyboard function keys]` with a check mark. It is
therefore an instance-level demonstration of evidence use and recovery within
one question.

The reviewed PaperFigure output is instead a notebook-structure overview: it
names the prompt/history state, LM, parsed action, Wikipedia tools, step record,
feedback route, seven-step bound, and forced-empty terminal case. It deliberately
does not reproduce a question, search query, failed lookup, textual evidence,
or a success marker. Conversely, the inspected author crop does not visually
state this notebook's seven-step cap or its forced-empty-finish fallback. These
are complementary scopes, not a basis for a superiority or equal-scope claim.
