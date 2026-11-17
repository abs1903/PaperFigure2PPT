# CLIP initial raster review — source-informed

## Verdict

**A: retain as a usable fallback.** It correctly shows dual encoders, a 3 × 3
all-pairs matrix with diagonal targets, both retrieval directions, symmetric
loss, encoder reuse, and a non-empirical zero-shot route. At 7-inch width, its
long dashed reuse links and normalized-embedding notes are secondary/small.
Its top matrix-caption arrows make a direct caption-to-matrix bypass plausible,
but that is a non-blocking clarity weakness.

**B initial: revise, not selectable.** It has the stronger stacked matrix-first
composition, but the teal reuse line seems to originate at the matrix, the
class-text branch reads out of Text encoder, and `{boat}`-style literal strings
misstate the template. B2 was the scientifically sufficient repair.

No native-artifact decision is made by this review.

## Reviewed hashes

| File | SHA-256 |
| --- | --- |
| `candidate-a.png` | `cf35019c1e6833366e417f2f1e38e4a9199165c2fc755645bcea2d9f4f939555` |
| `candidate-a-paper-width.png` | `d2532fffc39d314a1b766239ebba2bc54f1b657ffdf0d83d5f2e58041d90a1bd` |
| `candidate-b.png` | `81736939d72b5c1e1afa1f99f4edaf2c3f0d5bb7371cd6ce3188e9860030bfb9` |
| `candidate-b-paper-width.png` | `dfcdbf614c5c45f17abe0d30991c1c81c46ac5669c44331a501acc72b5c55801` |
| `prompt-edit-b2.txt` | `3b131472bbabf7c90e88bfb9ca200807f99014817e769a1adffc209f32598ed1` |

Pixel-only reading was frozen first in `first-reading-freeze.json` (SHA-256
`a2bab13e359d5ea1356bcdb1aa789be2c0519b184a0e06949093ccabf196f100`).

## Source-informed comparison

| Requirement | A | B initial |
| --- | --- | --- |
| Separate encoders and `N × N` matrix | Pass. | Pass. |
| Symmetric training and no code/loss conflation | Pass. | Pass. |
| Reused Image/Text encoder links | Pass, though visually secondary. | Block: teal path appears matrix-sourced. |
| Class descriptions as Text-encoder input | Usable but dense. | Block: direction is reversed and braces are wrong. |
| No target fitting, gradient, score or executed-result claim | Pass. | Pass. |

Both initial renders use gradients despite the flat-fill brief. That is
non-blocking and should not consume an edit intended for scientific repair.
The subsequent B2 review determines selection.
