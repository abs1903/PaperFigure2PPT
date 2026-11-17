# CLIP source audit

## Scope and verdict

This audit covers the pinned CLIP paper PDF/text extract, the official
`model.py` and `README.md` at the recorded OpenAI commit, and the supplied
license. No model, training program, or example inference was run.

**Status: sufficient source support for an original conceptual illustration of
CLIP's contribution.** It must distinguish *paper training semantics* from the
*released repository's inference-facing forward path*. This audit does not
approve a composition, prompt, native artifact, or raster output.

## Source identity and integrity

| Item | SHA-256 | Evidence / status |
| --- | --- | --- |
| Paper PDF | `2a4952960f350e50a3a4a847371b80b8aaa09ba82d1c2a8f6b30450e392a1fe4` | PMLR URL recorded in `source/manifest.json`. |
| Paper text extract | `17e0e352f7047a02fd80070f717d4cfeced7bdd6d3422b208cc908feebaa7613` | Supplied extraction used for locators below. |
| Official model code | `9902cbe5ee90a1da2aa3e6f043e8a23dc1f8831193b963785c9af03d5c7bef2c` | Pinned `model.py`, commit `d05afc436d78f1c48dc0dbf8e5980a9d471f35f6` in manifest. |
| Official README | `f82c5c75e140532eb37a7d943921e1bdd57d740c6b40d0030985bc5b5d11d6f1` | Pinned repository usage/API description. |
| License | `987e63b32f6c89ff5160e429458a872ff048e6860b590a3912e938f9da8f14db` | MIT License, OpenAI copyright 2021 (`source/LICENSE:1-3`). |

The supplied hashes match `source/manifest.json`. The new illustration should
be an independently authored explanation, not a redraw of paper Figure 1 or
Figure 3.

## Source-supported semantic contract

1. **Pre-training is a batch-wide pairing task.** Given a batch of `N`
   image-text pairs, the paper says CLIP predicts which of the `N × N`
   possible pairings occurred (`paper-text.txt:210-212`). The `N` real pairs
   are the diagonal positives; the other `N² − N` pairings are incorrect
   (`paper-text.txt:214-222`). A matrix in a figure should make that diagonal
   relationship visible rather than show isolated pair cards.

2. **The training objective is symmetric.** The paper specifies a symmetric
   cross-entropy loss over similarity scores (`paper-text.txt:220-224`), and
   Figure 3 pseudocode normalizes both projected embeddings, forms a scaled
   `[n, n]` pairwise-cosine matrix, and averages image-to-text and text-to-image
   cross entropy (`paper-text.txt:181-195`). Thus arrows or labels must not
   imply that only an image-to-text classifier is trained.

3. **The released forward path exposes normalized, scaled cosine logits, but
   not the loss.** `model.py` encodes images/text, L2-normalizes each feature,
   computes `exp(logit_scale) * image_features @ text_features.T`, and returns
   its transpose as the text-oriented logits (`model.py:358-372`). It does not
   contain the paper's cross-entropy computation. Therefore label this as a
   *similarity/logit matrix* when anchored to released code; depict symmetric
   training loss only as the paper-method layer, not as a claim about this
   inference-facing function.

4. **Zero-shot use reuses learned encoders and creates class text embeddings.**
   Paper Figure 1 states that the jointly trained image and text encoders learn
   batch pairings, then at test time the learned text encoder embeds class names
   or descriptions to synthesize a zero-shot linear classifier
   (`paper-text.txt:110-113`). Section 2.5 says CLIP reuses the pre-trained
   image-text pairing capability for downstream tasks (`paper-text.txt:296-305`)
   and uses dataset class names as candidate text pairings (`paper-text.txt:263-268`).
   A visual may show frozen/reused encoder *weights* conceptually, but must not
   claim an executed run, a particular checkpoint, or an observed result.

5. **The repository supports the same inference interpretation.** The README
   exposes separate `encode_image` / `encode_text` calls (`README.md:69-81`)
   and its zero-shot example normalizes features, scales their dot-product
   similarities, softmaxes across candidate class text, and selects top values
   (`README.md:104-118`). Its general `model(image, text)` API describes cosine
   similarities times 100 (`README.md:79-81`); the pinned code itself instead
   uses a learned positive `exp(logit_scale)` (`model.py:292`, `366-369`). Do
   not call the scale universally fixed at 100.

6. **Figure roles are source-bounded.** Paper Figure 1 is the high-level
   contribution summary—contrastive pre-training, class-text classifier
   creation, and zero-shot prediction (`paper-text.txt:73-113`). Paper Figure
   3 is implementation-style pseudocode for the core contrastive calculation
   (`paper-text.txt:181-199`, `224-226`). A new figure can combine their
   conceptual roles, but must not duplicate their layout/caption or present an
   invented execution trace as either source figure.

## Required visual truths

- Make the shared embedding comparison spatially central: two encoders feed a
  single all-pairs `N × N` affinity field, with diagonal paired examples
  visibly distinct from off-diagonal mismatches.
- Mark the two training directions (`image → text` and `text → image`) only
  if the symmetric loss is explained; otherwise omit loss arrows rather than
  reduce the method to one direction.
- Use language such as “L2-normalized embeddings”, “scaled cosine logits”,
  “diagonal paired examples”, and “candidate class text” precisely.
- Separate the pre-training panel from zero-shot use with a clear hand-off:
  same learned encoders, new task-specific class descriptions, one image
  compared with candidate text embeddings. A small winner highlight is fine
  only as schematic ranking, not an asserted probability or accuracy.
- Favor a contribution-driven composition: e.g., an embedding-space bridge or
  a diagonal-match field that transforms into a class-text decision surface.
  It should read as one visual argument, not a generic row of equal cards.

## Claims and depictions to reject

| Reject / revise | Why |
| --- | --- |
| Only matching each image to its paired text, with no all-pairs matrix | Removes the `N × N` contrastive task and diagonal-positive structure. |
| One-direction-only training objective | Contradicts the paper's symmetric loss. |
| Unnormalized dot product labelled cosine similarity | Contradicts paper pseudocode and pinned forward normalization. |
| Fixed `×100` stated as the implementation's invariant | Pinned code uses learned `exp(logit_scale)`; README wording is API-level. |
| Cross-entropy shown as returned by `model(image, text)` | The released forward returns logits, not loss. |
| New classifier weights fitted on a labelled target dataset in the zero-shot branch | Contradicts Figure 1's class-text classifier synthesis framing. |
| “Training run”, “inference run”, measured probability/accuracy, speed, data volume, or model-size claim | No such execution or matched measurement is part of this showcase. |
| Copying the source Figure 1/3 composition, caption, or visual assets | Source inspection is provenance, not a layout license for the new original illustration. |

## Pending plan/spec/brief gate

Approve a proposed visual only if it makes the following checkable:

1. Pre-training explicitly contains both encoders, normalized shared-space
   embeddings, a scaled all-pairs `N × N` matrix, diagonal positives, and a
   symmetric objective when loss is shown.
2. The zero-shot panel clearly uses the learned encoders to embed new candidate
   class text; it does not imply target-label fitting or a measured prediction.
3. The paper-method loss and released inference-code logits are not conflated.
4. Any “fixed” / “frozen” wording is limited to conceptual reuse of learned
   encoders, not to a claimed local model invocation or checkpoint state.
5. The composition is original, contribution-led, and is not a generic
   equal-card pipeline or a copy of Figure 1/3.

## Raster-stage boundary

This audit is source/narrative evidence only. The later raster reviewer should
first read the raster in isolation and save that pixel-only reading before
seeing the brief or source audit. Raster review is not native-artifact
acceptance and must not substitute for a separate native/verifier gate.
