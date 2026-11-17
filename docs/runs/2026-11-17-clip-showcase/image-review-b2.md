# CLIP B2 raster review — source-informed

## Verdict: ACCEPT B2 as the selected raster candidate

B2 fixes every blocking relation/text error from initial B. It is now the
preferred composition over A: its stacked layout makes the all-pairs training
matrix the clearest focal relationship and its zero-shot band is visibly
separate. This is raster acceptance only; it does **not** accept any native
artifact.

## Exact inputs

| File | SHA-256 | Role |
| --- | --- | --- |
| `candidate-b2.png` | `e108391ae577afe2378d6439e86a03270518d3535eebccbfef86d88f4016d758` | Reviewed full raster, 1610 × 977 px |
| `candidate-b2-paper-width.png` | `79bba3e2792d2a84acfb01cb3f9f681cd55e5a0336c2adb035a621c311c5bde5` | Reviewed 7-inch diagnostic, 672 × 408 px |
| `generation-record-b2.json` | `90640e3abdbaccd17d2a233ef1411ff70d2fa040a13580dd9bb3c7ad059305ba` | Edit provenance: parent B plus B2 prompt |
| `prompt-edit-b2.txt` | `3b131472bbabf7c90e88bfb9ca200807f99014817e769a1adffc209f32598ed1` | Reviewed repair instruction |

The initial pixel-only read remains frozen before source-informed review in
`first-reading-freeze.json` (SHA-256
`a2bab13e359d5ea1356bcdb1aa789be2c0519b184a0e06949093ccabf196f100`).

## B2 repair verification

| Initial B blocker | B2 rendered result | Verdict |
| --- | --- | --- |
| Teal reuse seemed to originate at matrix bottom. | Dashed teal link clearly leaves the right edge of upper Text encoder, routes around the matrix through whitespace, then terminates at lower Text encoder. | Fixed. It now denotes encoder reuse, not matrix/logit transfer. |
| Prompt branch read Text encoder → prompt chips. | Teal arrowhead points left into the lower Text encoder from the class-description cluster. | Fixed. Class text is input to the Text encoder. |
| Individual strings retained braces (`{boat}` etc.). | One literal `a photo of a {label}` template is above separate `boat`, `bird`, `cup` chips. | Fixed. The cluster reads as a template plus candidate labels, not literal braced model inputs. |

## Scientific and design assessment

- Separate image/text encoders remain explicit in both phases; no cross-modal
  mixing occurs before encoding.
- Training visibly uses a 3 × 3 all-pairs matrix with three coral diagonal
  paired targets and six off-diagonal comparisons. This supports the paper's
  pairing story rather than a diagonal-only match.
- `Image to text`, `Text to image`, and `Symmetric loss` remain distinct,
  supporting the symmetric objective without implying the released forward
  function returns a loss.
- The dashed paths are model-reuse links; lower query image and class text are
  separate zero-shot inputs. No gradient, loss, target-data fitting, new head,
  numerical score, accuracy, or executed-result claim appears.
- At 672 px, the major training-to-zero-shot argument, matrix diagonal, reuse
  paths, template, class chips, and final `Nearest label` remain readable. The
  `Normalized embeddings` annotations are secondary but remain interpretable.

The template and three labels are separate visual objects rather than literal
fully expanded prompts. In the context of the `Class descriptions` group and
the arrow into Text encoder, this sufficiently communicates candidate class
text without a fabricated model output.

## Non-blocking design observations

The large phase headers are visually prominent, but the matrix remains the
dominant explanatory object within pre-training; no contribution-hierarchy
edit is warranted. Blue/teal/coral modules retain mild gradients despite the
flat-fill brief. That is a non-scientific rendering deviation and does not
justify spending the final image call. Any later solid-fill native
reconstruction must be labeled as a source-matched native approximation, not
as pixel-derived evidence.

## Hand-off

Select B2 for the subsequent README/native workflow. Do not let this raster
verdict substitute for a separate native/verifier acceptance gate.
