# Initial source-informed image review

## Scope and decision

This review opened the frozen first-reading account only after its image-only
record was saved. It then inspected the actual full-resolution and 672 px
paper-width rasters against the accepted source plan, spec, and composition
briefs. It does **not** accept a native/Office artifact, editability, export
parity, or final delivery.

| Candidate | Requested composition | Scientific outcome | Design/readability outcome | Decision |
| --- | --- | --- | --- | --- |
| A | `sparse-full-columns` | **Revise:** loss selector has 5 visible cells, not 4 | Lower panel is readable, but its selector count/correspondence is false | **Revise before selection/delivery** |
| B | `horizontal-bottleneck` | **Revise:** loss selector is 3 x 4, not 4 x 4 | Full forward path is clear, but lower loss panel is too compact and has an extra `MSE` label | **Revise before selection/delivery** |

The candidates genuinely realize different requested structures, rather than
merely recolouring the same layout: A separates sparse/full regions and uses a
full-width lower objective strip; B makes the forward pipeline a continuous top
row and moves the compact objective to lower right.

## Scientific relation audit

| Required relation | Candidate A | Candidate B |
| --- | --- | --- |
| 4 x 4 input has 16 image-patch tiles; `Mask 75%` visibly retains 4 | Pass: four blue vertical visible-token glyphs follow the input. | Pass: four blue vertical visible-token glyphs follow the input. |
| Encoder receives visible patches only; no removed-patch placeholders or learned mask tokens enter it | Pass: only four blue glyphs reach Encoder. | Pass: only four blue glyphs reach Encoder. |
| Encoder produces four encoded visible patch tokens | Pass: four blue output glyphs. | Pass: four blue output glyphs. |
| Twelve copies of a shared learned mask token are inserted only after encoder | Pass: a gray swatch labeled `×12` joins at Restore order. | Pass: a gray swatch labeled `×12` joins at Restore order. |
| Restore indices control original-position restoration, distinct from loss mask | Pass: `Restore indices` ends at Restore order; `Binary mask` also branches to objective. The shared gold bus is compact but does not route mask tokens/pixels into Encoder. | Pass: blue-gray `Restore indices` route ends at Restore order; gold `Binary mask` route ends at the loss panel. This is visually clearer than A. |
| Restored decoder input has 16 slots: 4 blue visible latents + 12 gray mask tokens | Pass: restored 4 x 4 grid visibly has four blue and twelve gray cells. | Pass: restored 4 x 4 grid visibly has four blue and twelve gray cells. |
| Lightweight decoder consumes full restored sequence and produces all-position pixel predictions | Pass: 4 x 4 teal prediction grid follows decoder. | Pass: 4 x 4 image-like prediction grid follows decoder. |
| Original target is supervision-only, not encoder/decoder input | Pass: separate lower target branch. | Pass: separate lower target branch. |
| MSE applies only to masked positions using the same 16-position mask | **Fail / revise:** the lower grid is 4 x 4 but has **5 blue** cells (all of row 1 plus row 3, column 3) and 11 gray cells. The restored decoder grid has 4 blue positions (row 1, columns 1/2/4; row 3, column 3), so the selector miscounts and mismatches it. | **Fail / revise:** the lower selector is only **3 x 4 = 12 cells**, with 3 white and 9 gold cells. It cannot represent a 16-position mask with 4 visible and 12 scored masked positions. |
| Class token, positional/projection internals, normalized target option, downstream branch absent | Pass. | Pass. |

All relations except the two loss selectors agree with
`source/method-prose.txt:77-155` and `source/models_mae.py:123-214`, as
constrained in `source-plan-review.md`; the selector errors are source-semantic
blockers, not merely visual defects.

## Contribution emphasis and candidate tradeoffs

Candidate A makes the intended masked-only objective easy to locate. Its large
lower panel preserves target/prediction/MSE separation at 672 px, but this also
exposes a factual render error: the selector has five blue/visible cells rather
than four and does not copy the upper restored-grid pattern. The main path is
interrupted by a broad second-row read; its gold metadata bus also packs
`Binary mask` and `Restore indices` close together.

Candidate B makes the architectural contribution most immediate: its sparse
four-token lane expands only after Encoder and Restore order into a 16-slot
decoder lane. The separate blue-gray restore-index path and gold binary-mask
path are better differentiated than in A. But the lower-right objective has a
factual error as well: its selector is a 3 x 4 grid, so it cannot correspond to
the 16-position decoder output. At 672 px its labels are also smaller, and it
introduces a separate visible `MSE` text beyond the whitelist.

## Style and label audit

Both candidates use original flat, schematic tiles rather than a copied photo,
author artwork, or author layout. B uses simple mountain/sun tile artwork and A
uses abstract color tiles; both are within the stated schematic image-tile
scope. Neither introduces benchmark numbers, performance claims, training
execution, a frozen-component symbol, or a downstream recognition branch.

Candidate A uses the whitelist labels and `×12` count without a material extra
label. Candidate B adds standalone `MSE`; revise it to the whitelisted
`Masked-patch MSE` wording or remove the redundant panel heading/inner label.

## Required revision for both candidates

1. Use a 4 x 4, 16-position loss selector with exactly 4 unscored visible
   positions and 12 scored masked positions.
2. Make its four visible positions exactly match the restored decoder-grid
   positions; preserve separate target, prediction, and binary-mask inputs.

## Additional required revision for Candidate B

1. Eliminate the label-whitelist violation (`MSE`), without weakening the
   masked-only objective label.
2. Enlarge/reflow the lower-right objective to make target, selector, and loss
   relation readable at seven-inch/672 px width.
3. Preserve B's distinct continuous upper bottleneck and the blue-gray restore
   index versus gold binary-mask paths.

## Unverified after this raster review

- Native/Office reconstruction, element editability, and export parity.
- Pixel-level similarity assessment against all third-party material beyond the
  visible non-copying design choice; author Figure 1 remains source-inspected,
  not a template.
- Any training outcome, throughput, reconstruction fidelity, or downstream
  utility. The rasters establish only the illustrated source semantics.

## Input and artifact hashes

| File | SHA-256 |
| --- | --- |
| `candidate-a.png` | `1924ee246390da207d959b61a0ad3d5c53f310747ffbbfb7fa8054edb493f376` |
| `candidate-a-paper-width.png` | `4bb9a576f43c4b6f261f8bcbfee5b4d0e3fe408ee53d917931460efdc48aa29e` |
| `candidate-b.png` | `fe548d6e60d42d21b44870ec72a09fb87422b5b3e19fe5d2d29e3f5fb657fb8b` |
| `candidate-b-paper-width.png` | `cc6bf2d7eca4905c2293e434ad504ed649985677112733a5f9dd7a0d584cc81e` |
| `generation-record-a.json` | `see source record; no content modified` |
| `generation-record-b.json` | `see source record; no content modified` |
| `first-reading.md` | `eaaba73dbd7ebcdb6116f5f351a5d373ec50f6ffd43a5676c279a0768d798297` |
| `first-reading-freeze.json` | `d95edd6b8fc96a035c0c9ccfc2c9fbad77bffc4ce82c0e86cdc1dfd6168f79dc` |
| `spec.json` | `c99c126ae1b5053ae08571139d13f3ed307ddf798bd395256a33f374f6bb2ea9` |
| `source-plan-review.json` | `66ccc10c5d535145e7d5c848950cdad53886bb669c33f113a67f9c956dd79ffb` |
