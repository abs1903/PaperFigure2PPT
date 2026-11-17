# CLIP source-plan review — regenerated v2

## Verdict: ACCEPT — generation may proceed

The prior blocking provenance defect is repaired. Both model-reuse edges now
cite the paper's whole-model downstream-reuse statement rather than the
text-encoder-only Figure 1 caption fragment. The updated source extraction is
necessary and appropriate: it provides a sequential, column-aware locator for
Section 2.5 while leaving the pinned PDF, raw `paper-text.txt`, and official
code bytes unchanged. No image calls have occurred.

The earlier rejected proposal and review are preserved under
`source-plan-v1-rejected/`; this document evaluates only the regenerated
current inputs.

## Integrity and regeneration checks

| Check | Result |
| --- | --- |
| Pinned PDF SHA-256 | Unchanged: `2a4952960f350e50a3a4a847371b80b8aaa09ba82d1c2a8f6b30450e392a1fe4` |
| Pinned `model.py` SHA-256 | Unchanged: `9902cbe5ee90a1da2aa3e6f043e8a23dc1f8831193b963785c9af03d5c7bef2c` |
| Column-aware method extract | `source/method-prose.txt`, SHA-256 `3413ab2b60a88b9857555972d8cd8d763c8a1ba565a2d4200cb68ad13d63cc9e`; recorded in manifest for PDF pages 1–5. |
| Evidence input construction | `prepare-inputs.mjs` normalizes and appends raw `paper-text.txt` plus `method-prose.txt`, preserving raw evidence while adding a usable sequential Section 2.5 locator. |
| Semantic digest | Both briefs record regenerated `0b787b11e6db4526d477e8ea1d0ffb67c34acbd07525491da0cc3d3b8f76832c`. |
| Plan digest | Both briefs record unchanged `21031f43cbb9b0cb5e1c72ad14038254055e7c475adf9ec23d8bf90346c5dc0d`. |
| Graph / phases | 12 nodes and 12 edges. Image/text encoders are `both`; loss/data flow is train-only; reuse links are inference-phase `control`. |

The semantic/plan values above are digests emitted from the normalized semantic
snapshot and plan serialization, not the pretty-file SHA-256 values.

## Blocking repair verified

`image-reuse` and `text-reuse` now both cite:

> “To apply CLIP to downstream tasks, we reuse this capability”

This phrase appears in the added sequential extraction at
`source/method-prose.txt:438-444`; it is also present in the raw paper text.
It supports model/capability reuse across the full CLIP system, so it covers
both the image and text encoder reuse links. The Figure 1 caption remains
useful as distinct evidence that class names/descriptions are embedded by the
learned text encoder (`source/paper-text.txt:110-113`), but it is no longer
overextended as evidence for the image link.

The visual meaning remains tightly bounded: dashed links denote conceptual
parameter/model reuse, not dataflow from training examples and not a local
claim about `requires_grad=False`, `eval()`, checkpoint selection, or an
executed inference run.

## Scientific / design acceptance

1. **Contribution abstraction:** The focal argument is correct and
   contribution-led: paired natural-language supervision produces an all-pairs
   alignment geometry; natural-language class descriptions make that aligned
   representation usable as a zero-shot classifier. It does not misrepresent
   contrastive learning or dual encoders as new primitives.

2. **Training semantics:** The matrix is train-only and explicitly represents
   an `N × N` comparison with diagonal real pairs and off-diagonal mismatches.
   The two retrieval directions and symmetric loss follow Figure 3/the paper
   (`source/paper-text.txt:181-195`, `210-224`).

3. **Code/paper boundary:** The plan correctly treats the released code as
   corroborating normalized scaled-cosine logits only (`source/model.py:358-372`),
   not the paper's cross-entropy training loop.

4. **Phase boundary:** Objective and training dataflow are train-only. Reused
   model links, query/class text, similarity and nearest-label readout are
   inference-only. Briefs prohibit inference gradients, inference loss, and a
   new task-specific classifier head.

5. **Non-empirical examples:** Boat/bird/cup examples and coral diagonal marks
   are clearly schematic. The output is “Nearest label,” with no probability,
   accuracy, benchmark, execution, or correctness claim.

6. **Alternatives and prompt coverage:** Matrix bridge and stacked transfer
   are materially different compositions while covering the same 12-node,
   12-edge graph. The matrix remains the visual focal object rather than a
   generic row of equal cards. Prompts preserve all required forbiddens.

## Conditions carried into generation and later review

- Generate only the two reviewed alternatives under the declared image-call
  budget; generated pixels cannot authorize scientific changes.
- Retain the 12-node/12-edge phase contract and the source/code distinction in
  any edit.
- Before source/brief comparison, the raster reviewer must save an independent
  pixel-only first reading.
- Raster review cannot accept a native artifact; native/verifier acceptance is
  a separate gate.
