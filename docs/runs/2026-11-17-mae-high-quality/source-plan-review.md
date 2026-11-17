# MAE source-plan review

## Decision

**ACCEPT FOR CANDIDATE GENERATION.** Both proposed compositions preserve the
source-supported MAE abstraction. This is a semantic-plan acceptance only; it
does not accept generated images, native/Office artifacts, exports, or visual
legibility.

The previously suspected brief-hash mismatch was a digest-scope error in this
review, not a plan defect. Per `paperfigure/scripts/spec.mjs`, the brief binds
`digest(semanticSnapshot(spec))`; per
`paperfigure/references/paper-narrative.md:48-60`, it binds
`digest(parsedPlan)`, not raw pretty-printed file bytes. Current compiler checks
pass for both briefs:

| Bound value | Verified digest |
| --- | --- |
| Semantic snapshot | `78d2903cdc6e471d931efe6614098d735e18f651265e85c0ef144c92bf351116` |
| Parsed narrative plan | `7ec165808468308cea93040ec0e2166f23e0a2a28a65401cf31540b5a695b1ad` |

## Accepted contribution-to-visual mapping

| Plan mapping | Decision and evidence |
| --- | --- |
| 4 x 4 teaching grid: 16 image-patch tokens, 4 visible and 12 removed under `Mask 75%` | Accepted as an explicitly schematic example, not a literal 224 px tensor shape or empirical result. Random removal and a high-ratio 75% example are supported by `source/method-prose.txt:77-89` and `source/models_mae.py:123-148`. |
| Only four visible patch tokens enter the encoder | Accepted. Removed patches and mask tokens must remain absent from the encoder; this is the principal MAE distinction (`source/method-prose.txt:91-100`; `source/models_mae.py:150-170`). |
| Post-encoder merge of 4 encoded visible tokens and 12 copies of one learned mask token, then restored 16-slot order | Accepted. Gray tiles must represent repeated copies of the shared learned token, and `Restore indices` must represent ordering metadata, not pixels or a second mask (`source/method-prose.txt:101-112,140-155`; `source/models_mae.py:172-184`). |
| Smaller/lightweight decoder consumes the full restored sequence | Accepted as qualitative asymmetry only, with no invented layer count, compute amount, or speed claim (`source/method-prose.txt:113-123`). |
| All-position prediction grid compared with original target; binary mask selects only the 12 removed positions for MSE | Accepted for the pinned implementation. The paper establishes pixel reconstruction plus masked-only loss; the code establishes all-position `pred` before masked reduction (`source/method-prose.txt:124-139`; `source/models_mae.py:190-214`). |
| Class token, positional/projection internals, normalized-target option omitted | Accepted. The omissions avoid false counting or unsupported visual specifics (`source/models_mae.py:150-194,204-209`; `source-audit.md`). |
| Downstream encoder-only recognition omitted | Accepted for this pre-training-only figure (`source/method-prose.txt:113-115`). |
| Original schematic tiles and two distinct compositions | Accepted at plan level. Neither plan requests author Figure 1's photo/art/layout; final image review must still check output originality. |

## Required generation and render checks

- Maintain exactly 4 blue visible / 12 gray mask-token positions in the 4 x 4
  teaching grid. The encoder lane has only the four visible tokens.
- Keep `Restore indices` and `Binary mask` semantically distinct: restore
  indices restore order; the binary mask selects the loss positions. Do not
  depict the binary mask itself as the restoration operator.
- Make the all-position prediction grid visibly different from the
  masked-only MSE selector; do not imply that only missing logits are emitted.
- Preserve the target branch as supervision only, never as observed content
  entering encoder or decoder.
- Treat all generated tokens/tiles as schematic. Do not add scores, guaranteed
  reconstruction quality, training execution, or a downstream decoder branch.

## Still unverified

- Generator adherence to counts, arrows, labels, and loss scope.
- Seven-inch readability and whether visual hierarchy preserves the primary
  sparse-encoder/full-decoder contrast.
- Image-level originality relative to author Figure 1.
- Native/Office editability, export parity, and final delivery validation.

## Current-input ledger

| Input | Raw-file SHA-256 |
| --- | --- |
| `spec.json` | `c99c126ae1b5053ae08571139d13f3ed307ddf798bd395256a33f374f6bb2ea9` |
| `narrative-plan.json` | `eeb7d7e8d2e0c66065fbba1d93d317b815a57109dabfd9f672c039c67bb5dcc1` |
| `brief-sparse-full-columns.json` | `1950694cfee8776bbbdc1e197a5eaa566fb3e5b5496adbcf274343c3c62777a7` |
| `brief-horizontal-bottleneck.json` | `6248f339c8ec25c09c37af1ccca7728ba0cd280f2efee40a828639acf2746c81` |
| `prompt-sparse-full-columns.txt` | `de8d6b06a5739f6231af650d3b7a21f37f795207e8d76de76f20ba89a7482c2c` |
| `prompt-horizontal-bottleneck.txt` | `4e7deb05c2f1d5f19968c13c894238e4ff5814ee6102b2aa9553342596e3c516` |
| `source/method-prose.txt` | `f0630fbd77dd51ff4781138acad681d772edfc3a174641f3c085c0647a8974c7` |
| `source-audit.md` | `d1f1a4b2fe518c0cc3d30cee55199bcf50944aea75999fb0774415fda02dc421` |

The compiler input preparation reads `source/method-prose.txt` and normalizes
its sequential prose. The retained raw PDF layout extraction is not used for
the reviewed source string.
