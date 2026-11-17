# CLIP source-plan review

## Verdict: REVISE — one provenance repair before generation

The contribution abstraction, both alternative compositions, phase separation,
brief coverage, prompt scope, and stated generation budget are scientifically
appropriate. The review is **not yet accepted** because both model-reuse edges
claim to carry parameters from the trained image and text encoders while citing
only the Figure 1 caption fragment, “At test time the learned text encoder.”
That fragment supports the text-side claim but cannot independently evidence
the image-encoder reuse edge.

This is an evidence-locator defect, not a proposed visual redesign. Repair it,
regenerate the dependent artifacts/digests, then the plan is acceptable without
changing the intended matrix-first narrative.

## Inputs reviewed

| Input | Review result |
| --- | --- |
| `spec.json` | 12 nodes / 12 edges; training and inference are explicitly phased. |
| `narrative-plan.json` | Matrix-first contribution abstraction and two materially distinct alternatives. |
| `brief-matrix-bridge.json` | Covers the full semantic graph with a horizontal matrix-led composition. |
| `brief-stacked-transfer.json` | Covers the full semantic graph with a vertical/stacked transfer composition. |
| Compiled prompts | Preserve source bounds, scientific forbiddens, text whitelist, and original-composition constraints. |
| Digest records | Briefs record semantic `3be36bc7f445b80824d2e2a9635f580a495f7e3d392fd0ace9cf92effac1d297` and plan `21031f43cbb9b0cb5e1c72ad14038254055e7c475adf9ec23d8bf90346c5dc0d`; these are semantic/plan serializations emitted by `scripts/spec.mjs`, not pretty-file SHA-256 values. |

The two alternatives are genuine alternatives, not superficial recolors: the
matrix bridge allocates the main horizontal field to alignment with a compact
right-hand transfer region, while stacked transfer makes the matrix a top
bilateral scene and uses a lower transfer strip.

## Scientific and phase review

### Accepted content

1. The main visual claim is suitably scoped: dual encoders map a paired batch
   into an all-pairs image-text matrix, then natural-language class descriptions
   support zero-shot classification. It avoids claiming that contrastive loss or
   dual encoders alone are novel.

2. The training phase is correct. The `matrix` and `loss` nodes are train-only;
   the all-pairs matrix is paired with diagonal positives and off-diagonal
   comparisons, and the brief requires image-to-text plus text-to-image
   supervision. This is consistent with the paper's `N × N` pairing statement
   and symmetric loss (`source/paper-text.txt:210-224`) and its Figure 3
   pseudocode (`source/paper-text.txt:181-195`).

3. The scoring abstraction is correctly bounded. The briefs/prompt identify
   normalized embeddings and cosine similarity, while their scope says that
   released code corroborates the normalized scaled-cosine *forward path only*.
   No brief says that the released `model.py` computes the paper loss. This
   matches `model.py:358-372`.

4. Inference is separated from training. Inputs/classes/query/similarity/output
   are inference-only; the objective is train-only. Briefs explicitly forbid
   inference gradients, an inference loss, and a new task-specific head. This
   makes the dashed reuse links parameter/model identity rather than training
   dataflow—a necessary distinction.

5. The zero-shot readout is carefully non-empirical. `Nearest label` is an
   abstract selection, not a named winning class, probability, accuracy,
   benchmark, or local inference result. The boat/bird/cup examples are
   declared schematic and the diagonal color is described as pair labels rather
   than scores.

6. Prompt/brief coverage is strong. Both cover every node and relation; the
   all-pairs matrix is primary, symmetry is subordinate, and the zero-shot
   section contains no added model head. The forbiddens rule out generative
   captioning, diagonal-only comparisons, one-way loss, cross-modal encoder
   mixing, numeric results, and source-figure copying.

### Required revision: evidence for both reuse edges

In `prepare-inputs.mjs`, `image-reuse` and `text-reuse` are both declared as
inference-phase `control` edges. Their current evidence is the same text-only
quote:

```
At test time the learned text encoder
```

The resulting visual instruction is defensible—Figure 1 visibly carries both
the image and text encoder into the zero-shot stage—but the machine-readable
evidence does not say that. It should be repaired with text that covers the
whole model capability, rather than making the image edge ride on a
text-encoder-only phrase.

Minimum source-preserving repair:

- cite `source/paper-text.txt:296-305`, especially “To apply CLIP to downstream
  tasks, we reuse this capability,” for **both** `image-reuse` and `text-reuse`;
- retain the Figure 1 caption (`source/paper-text.txt:110-113`) as additional
  text-side/classifier-synthesis evidence if useful;
- keep reuse links as `control`/dashed model-reuse edges—not `data` edges—and
  retain the no-gradient/no-new-head visual prohibition;
- do **not** upgrade “fixed” into a claim that the pinned repository executed
  `requires_grad=False`, `eval()`, or a particular checkpoint. Here “fixed for
  zero-shot use” may only mean no task-specific fitting in the conceptual
  diagram.

The paper's own Figure 1 geometry supports the intended image-side continuity,
but the raw Figure 1 caption names only the learned text encoder at test time.
The broader Section 2.5 reuse statement is therefore needed to make the
machine-readable graph evidence complete.

## Post-repair acceptance gate

Accept after regeneration only if:

1. both reuse edges cite the broader reuse statement (or equally complete
   evidence) and do not rely only on the text-encoder fragment;
2. regenerated briefs/prompts carry the newly emitted semantic and plan digests
   consistently, while preserving the expected 12 nodes / 12 edges;
3. the existing phase constraints remain: model nodes may span both phases,
   objective remains train-only, and zero-shot has no gradients/loss/new head;
4. the selected generated route retains the matrix as a relational focal object,
   not a generic equal-card flow; and
5. raster review begins with a saved pixel-only reading and does not accept a
   native artifact.

No image generation is authorized by this review until item 1 is repaired.
