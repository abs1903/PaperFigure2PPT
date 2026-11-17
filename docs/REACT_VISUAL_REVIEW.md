# Independent Visual Review: ReAct HotpotQA

## Scope

Reviewer: `/root/react_paper_audit` (isolated from the figure-authoring task).

I inspected the frozen native output at publication scale: the renderer preview,
LibreOffice PPTX raster, and PDF raster. I also read `spec.json`, `METHOD.md`,
`design-contract.json`, and the prior code-only audit
`docs/REACT_CODE_AUDIT.md`. No author ReAct paper figure was inspected. This is
a source-first review, not a claim of paper-wide reconstruction fidelity or
venue-level aesthetic approval.

## Verdict: revise

The figure is visually clean and the intended palette reads correctly: blue is
the LM, green is per-question retained text state, and gray-white is external
I/O/tooling. The native PowerPoint and PDF render preserve the readable serif
typography, solid fills, connector routing, and title/footer-free canvas.

However, the figure only shows `Finish terminates`; it does not expose the
code-verified controller cap of seven iterations or the forced `finish[]` after
exhaustion. The code audit explicitly calls for termination to be made
explicit. Consequently the current diagram can be read as an open-ended
Thought/Action/Observation loop, which is a material semantic omission rather
than a cosmetic one.

## Criterion record

| Criterion | Result | Observed evidence |
| --- | --- | --- |
| Reference comparison | pass | The frozen design contract transfers the relevant aspects of the BLIP2 reference—white canvas, native serif hierarchy, controlled strokes, and solid semantic fills—while explicitly permitting ReAct-specific topology. The reference's visual/token motifs are not mechanically copied, appropriately, because they would imply unsupported VLM mechanisms. |
| Semantic fidelity | revise | The principal successful path is sound: Question → retained prompt/history → LM → parsed action → tools/Finish, with Thought+Action and Observation entering a Step record that appends to history. The missing seven-step/forced-empty-finish condition makes the termination semantics incomplete. |
| Composition | pass | Reading order is clear at 7-inch width. The lower Step record makes the feedback cycle distinct from the left-to-right action path; the feedback route does not collide with modules. |
| Modality identity | pass | Blue, green, and gray-white are applied consistently to LM computation, within-question state, and external/tool/I-O nodes respectively. The labels make the encoding intelligible without relying on color alone. |
| Typography | pass | The Times New Roman hierarchy is legible in preview, Office, and PDF rasters. The LM heading and Step record are focal without a redundant overall title. |
| Phase clarity | pass | There are no gradient/training arrows. `Append for next step` correctly frames the return route as within-question state feedback; `Finish terminates` distinguishes the output route. |
| Editability | pass | The mechanical report records 18 native text boxes, 26 native shapes, 12 native connector segments, zero pictures, and editable ratio 1.0. This checks object construction, not manual PowerPoint editing effort. |
| No title or footer | pass | None appears in the inspected rasters. |
| Office render | pass | The independently rendered PPTX and the PDF raster retain all labels and routes; no obvious clipping, glyph fallback, or broken connector was observed. |

## Concrete revision target

Add a compact, locally placed control annotation or branch that states the
bounded controller condition (for example, `Finish → answer; otherwise next
step, up to 7; then forced finish[]`). It must distinguish forced empty finish
from a model-produced Finish answer and should not introduce an optimizer,
training phase, or cross-question memory. Re-review all three render paths
after any change because every inspected artifact hash below will then be
stale.

## Inspected artifact identity

* Reference: `paperfigure/examples/blip2-opt-code/output-solid/figure.png`,
  SHA-256 `5af776269bdc0c4592c312c12f9c3dee60a99ce1bf08f7450a91081e6eb43fd9`.
* Frozen source records: `spec.json`
  `9469b3c06bbaf6840ac71d64d69a27d298825a95b690585d3500e5596f531aed`,
  `METHOD.md` `a7b85bb40e8dd0b1ad5e8fb8bef346ecd22569d571a7030854904b6795468d66`,
  and `design-contract.json`
  `75dce73221a101701b869c8ba1bd147889b38b452deb50eeda701cff9f618f42`.
* The inspected artifact hashes are recorded in
  `paperfigure/examples/react-hotpotqa/output/visual-review.json`; all match
  `initial-figure-freeze.json`.
