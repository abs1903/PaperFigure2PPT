# Pixel-only first reading

## Isolation statement

This account was made by opening only the four PNG files listed below. I did not inspect any source, parent, prompt, plan, review, metadata beyond dimensions and SHA-256 hashes, or external material. It is a visual first-read, not a novelty, correctness, or scientific-validity assessment. Intended publication width is 7 in; the `*-paper-width.png` files are the 672 px diagnostics.

## Files inspected

| File | SHA-256 | Dimensions (px) |
| --- | --- | --- |
| `candidate-a.png` | `cf35019c1e6833366e417f2f1e38e4a9199165c2fc755645bcea2d9f4f939555` | 1682 x 935 |
| `candidate-a-paper-width.png` | `d2532fffc39d314a1b766239ebba2bc54f1b657ffdf0d83d5f2e58041d90a1bd` | 672 x 374 |
| `candidate-b.png` | `81736939d72b5c1e1afa1f99f4edaf2c3f0d5bb7371cd6ce3188e9860030bfb9` | 1610 x 977 |
| `candidate-b-paper-width.png` | `dfcdbf614c5c45f17abe0d30991c1c81c46ac5669c44331a501acc72b5c55801` | 672 x 408 |

## Candidate A

**Main claim as read from the pixels.** A contrastive image--text pre-training procedure aligns image and text embeddings in both directions, after which the same image and text encoders can perform zero-shot classification by comparing a new-image embedding with embeddings of textual class descriptions and selecting the nearest label.

**Visible mechanism.** The left, larger training region presents paired boat, bird, and cup examples flowing to separate blue image and green text encoders. Their normalized embeddings feed a 3 x 3 image--text matching matrix with highlighted diagonal cells. Blue and green arrows label image-to-text and text-to-image directions, which converge conceptually in a `Symmetric loss` pill. Dashed blue and green links across the bottom label that the zero-shot region reuses the `Same encoders`. On the right, a boat image enters the image encoder; three template descriptions enter the text encoder; their outputs meet at `Cosine similarity`, then `Nearest label`.

**Primary and supporting regions.** The primary visual region is the left contrastive-pre-training panel and its matrix, which has the strongest causal/algorithmic explanation. The right zero-shot-use panel is a compact downstream consequence. The dashed cross-panel links are supporting evidence for encoder reuse rather than a separate procedural stage.

**At 672 px paper-width diagnostic.** The two blue section headers, the paired examples, the two encoders, 3 x 3 matrix, and loss/classification route remain legible. Secondary text becomes crowded or small: `Normalized embeddings`, both directional labels near the matrix, and especially the dashed `Same encoders` path need deliberate viewing. The braces around `{label}` and individual description strings remain recognizable but are small.

**Ambiguities/read limitations from pixels.** The diagram does not specify the loss formula, how a batch is formed, temperature/scaling, whether all off-diagonal matrix cells are negatives, or the exact rule behind `Nearest label`. The final predicted class is not explicitly shown. The relationship between the three visible pair examples and the matrix rows/columns is implied rather than keyed. Dashed reuse connectors travel a long distance and can be visually subordinated to the two panels.

**Prior familiarity.** The image/text dual-encoder, symmetric contrastive matrix, and zero-shot text-template classification pattern is visually familiar to me as a common class of multimodal-learning schematic. That familiarity affects recognition of the generic pattern only; it is not evidence about this candidate's source, originality, implementation, or correctness.

## Candidate B

**Main claim as read from the pixels.** The same contrastive image--text pre-training and zero-shot classification story is presented, with the training process in the upper field and the zero-shot deployment process below a horizontal divider.

**Visible mechanism.** In the upper panel, boat/bird/cup image cards feed an image encoder; boat/bird/cup word labels feed a text encoder; normalized embeddings form a diagonal-highlighted 3 x 3 matching matrix. Direction arrows and `Symmetric loss` sit to the matrix's right. In the lower panel, a new boat image goes through the image encoder and class-description templates go through the text encoder. Blue and green lines meet at `Cosine similarity`, which leads to `Nearest label`. Dashed vertical links indicate encoder reuse from top to bottom.

**Primary and supporting regions.** The upper training field is primary because it occupies the explanatory center and establishes the alignment matrix. The lower field provides the application path. The legend-like directional arrows and the dashed `Same encoders` links are supporting annotations.

**At 672 px paper-width diagnostic.** The horizontal top-to-bottom division and large story arc remain easy to parse. The major title badges, matrix, paired images, encoder boxes, and final label route are distinguishable. Several elements are difficult at this width: `Normalized embeddings` above/below the flows, the small description-template text, the text-encoder input branches, and dashed reuse links. The right-side direction labels and `Symmetric loss` remain readable but compete with the matrix for horizontal attention.

**Ambiguities/read limitations from pixels.** As in A, no formula or training details resolve the semantics of similarity, negatives, or loss reduction. The text-side top wiring visually collects labels before the text encoder, but does not explicitly pair each label with a corresponding image card. In the lower path, the blue and green embedding lines converge near the similarity box without an explicit visual distinction between one new-image embedding and a set of class-text embeddings. The final `Nearest label` output is not named.

**Prior familiarity.** The visual grammar likewise resembles a familiar dual-encoder contrastive-learning/zero-shot-classification schematic. This is a pattern-recognition observation only, not a claim about any underlying paper, novelty, authorship, model identity, or scientific validity.

## Cross-candidate first-read comparison

Both candidates communicate the same high-level process from pixels alone. A emphasizes a side-by-side train-versus-use comparison and makes the reuse connector explicit across the panel boundary; its training/data pairing is visually direct. B emphasizes a top-to-bottom chronology, devotes more continuous space to the matrix-and-encoder training relation, and gives the lower inference wiring more room. At the 672 px diagnostics, A's broad layout makes stage comparison immediate but compresses small annotations, while B's stacked layout keeps its flow orderly but makes lower text/template wiring and small labels denser. These are readability observations, not quality, novelty, or scientific judgments.
