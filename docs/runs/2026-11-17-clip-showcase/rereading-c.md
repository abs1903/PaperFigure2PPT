# Pixel-only rereading: candidate C

## Isolation statement

This rereading opened only `candidate-c.png` and `candidate-c-paper-width.png` in this directory and compared their visible presentation with my already saved `first-reading` account of candidates A and B. I did not reopen the A/B pixels or inspect any source, parent, prompt, plan, review, metadata beyond C's dimensions and SHA-256 hashes, or external material. This is a visual account only, not a novelty, correctness, or scientific-validity assessment.

## Files inspected

| File | SHA-256 | Dimensions (px) |
| --- | --- | --- |
| `candidate-c.png` | `e108391ae577afe2378d6439e86a03270518d3535eebccbfef86d88f4016d758` | 1610 x 977 |
| `candidate-c-paper-width.png` | `79bba3e2792d2a84acfb01cb3f9f681cd55e5a0336c2adb035a621c311c5bde5` | 672 x 408 |

## Candidate C: apparent mechanism

The upper field, labeled `Contrastive pre-training`, visually depicts boat/bird/cup image cards entering an image encoder and their word labels entering a text encoder. Their normalized embeddings meet in a 3 x 3 matrix with the diagonal in coral. Directional key arrows label blue as image-to-text and green as text-to-image, and a coral `Symmetric loss` pill names the training objective.

Below a horizontal divider, `Zero-shot use` begins with a new boat image entering the reused image encoder. A generic textual template, `a photo of a {label}`, is visibly separated from three substitution labels, `boat`, `bird`, and `cup`; that constructed text input flows into the reused text encoder. The blue and green encoder routes run toward `Cosine similarity`, then an arrow points to `Nearest label`.

Dashed blue and green routes visibly connect the upper and lower encoders, with `Same encoders` centered between them. In C, the green dashed route bends from the upper text-encoder/matrix region down into the lower text encoder, which makes reuse explicit.

## Primary and supporting regions

The upper pre-training field is the primary explanatory region, centered on the two encoders and diagonal-highlighted alignment matrix. The lower zero-shot field is a second primary operational region because it shows the application decision route. The direction key, loss pill, dashed reuse routes, divider, and title badges are supporting annotations.

## Directions and visual ordering

The overall order is top-to-bottom: training above, use below. Within the upper field, image examples flow left-to-right into the image encoder and matrix; text labels flow down into the text encoder and then matrix. In the lower field, the image flows left-to-right while the template/label group flows leftward into the text encoder. The blue and green routes then converge toward the cosine-similarity box, followed by a rightward arrow to the final label box. The direction legend is placed to the matrix's right rather than directly on the matrix arrows.

## Comparison with my prior A/B account

Relative to my prior account, C retains B's stacked training-over-use layout and central matrix. The most apparent visible difference from that account is the lower class-description representation: C separates one generic template from three label tokens instead of presenting three complete template strings. C also makes the green dashed same-encoder connection more visually explicit by routing it from the upper text-side area down into the lower text encoder. This first-read comparison does not establish any underlying relationship among files beyond their visible layouts.

## Paper-width readability (672 px)

The two phases, major encoder boxes, three example images, 3 x 3 matrix, symmetric-loss label, cosine-similarity box, and nearest-label endpoint remain recognizable. The generic template remains readable at close inspection, but its braces and the three small label tokens are comparatively small. `Normalized embeddings`, the dashed green reuse path, the small text-encoder input elbow, and the lower convergence of blue and green lines require more deliberate viewing. The upper text-label boxes and directional legend are readable but compact.

## Ambiguities/read limitations from pixels

The schematic does not show a loss equation, batching rule, treatment of off-diagonal cells, temperature/scaling, or decision threshold. The individual images and top text labels align in ordering, but no explicit pair markers bind each image to a specific word. The matrix axes are not named. In the lower stage, the diagram implies generation of multiple text descriptions from the template and labels, but it does not visibly show each full generated sentence or the representation count entering cosine similarity. `Nearest label` does not name the predicted label. The diagram identifies directional image-to-text/text-to-image training terms through a legend, but does not attach each legend arrow to an unambiguous matrix traversal.

## Prior familiarity

The dual-encoder contrastive matrix plus text-template zero-shot decision pattern is visually familiar to me as a generic multimodal-learning schematic. This is only a recognition of graphical/method-family conventions and is not evidence about candidate C's source, originality, implementation, or correctness.
