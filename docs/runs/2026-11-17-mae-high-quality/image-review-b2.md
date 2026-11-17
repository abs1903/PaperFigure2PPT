# B2 source-informed raster review

## Decision

**ACCEPT AS THE FROZEN NATIVE-RECONSTRUCTION TARGET.** Candidate B2 corrects
the B loss-selector defect without changing the requested horizontal
sparse-to-full architecture. It is source-faithful enough to guide native/Office
reconstruction, but this decision does **not** accept a native/Office artifact,
editability, export parity, or final delivery.

## Position-by-position semantic audit

All counts below were inspected from `candidate-b2.png`, then checked again in
`candidate-b2-paper-width.png` (672 x 336 px).

| Visual object | Observed count / positions | Outcome |
| --- | --- | --- |
| Input image patches | 4 x 4 = 16 tiles | Pass |
| Visible patch lane | 4 blue tokens | Pass |
| Encoded-visible lane | 4 blue tokens | Pass |
| Learned mask-token inlet | one gray token marked `×12`, introduced after Encoder | Pass |
| Restored decoder input | 4 x 4; blue at `(r1,c1)`, `(r1,c4)`, `(r3,c2)`, `(r4,c4)`; other 12 cells gray | Pass |
| Decoder prediction | full 4 x 4 image-patch grid | Pass |
| Original target | full 4 x 4 image-patch grid on separate supervision path | Pass |
| Loss selector | exact 4 x 4; white/unscored at `(r1,c1)`, `(r1,c4)`, `(r3,c2)`, `(r4,c4)`; remaining 12 gold/scored | Pass: exact complement of restored blue positions |
| Loss wording | `Masked-patch MSE` appears inside the loss box; no standalone `MSE` duplicate | Pass |

The main scientific relations therefore hold: only visible patches enter
Encoder; shared learned mask-token copies join only afterward; restore indices
and binary mask follow distinct routes; the decoder predicts all positions; the
same 16-position binary-mask complement selects only the twelve removed
positions for pixel MSE against the original target. This matches the accepted
contract in `source/method-prose.txt:77-155` and
`source/models_mae.py:123-214`.

## Contribution emphasis and structure

B2 genuinely retains the requested `horizontal-bottleneck` composition. The
continuous top row foregrounds the contribution: a sparse four-token path goes
through the substantial Encoder, expands only after Restore order into the full
16-slot decoder sequence, then reaches all-position predictions. The smaller
lower-right supervision inset is now scientifically complete and still
subordinate to that architectural story.

The control paths remain distinguishable: blue-gray `Restore indices` enters
restoration; gold `Binary mask` enters the selector. The original target is
routed only to the loss inset and does not enter Encoder or decoder. There is no
class-token count, positional/projection claim, normalized-target claim,
downstream branch, performance number, execution claim, or frozen-component
symbol.

## Paper-width and style review

At 672 px, the main pipeline labels, four-versus-sixteen token geometry, and
loss-box label remain readable. The lower `Original target` and `Masked
positions only` labels are compact but still legible; native reconstruction must
not reduce them further. The corrected 4 x 4 selector is countable at this
scale.

The candidate keeps the requested original, schematic landscape tiles and is
clearly distinct from the source author figure's artwork/layout. Its forms are
vector-friendly: rectilinear grids, simple arrows, modules, and a white ground.
There is mild tonal shading in module and loss fills rather than perfectly flat
solid fills. This is a non-blocking style deviation for the raster target; use
flat palette fills during native reconstruction to meet the brief exactly.

## No further image edit required

The constrained B2 edit resolves the prior source-semantic blockers. A further
raster edit is not warranted for the mild fill treatment; preserve the current
geometry and labels as the native target, while applying the solid palette in
the native/Office rendition.

## Still unverified

- Native/Office construction, editability, and PDF/PPTX export parity.
- Final native text measurements at seven-inch publication width.
- Any training, speed, reconstruction-fidelity, benchmark, or downstream-use
  claim. This review verifies only the illustrated method semantics.

## Hash ledger

| File | SHA-256 |
| --- | --- |
| `candidate-b2.png` | `0ea262af8cb3968d0c83ba05733cb27cb8469119227b83efa8a6b5b04d1e8766` |
| `candidate-b2-paper-width.png` | `a7ebe892df3a8e3bbd02be19fb1b01953866c830b149686267e0a090a48ad0a0` |
| `prompt-edit-b2.txt` | `0a73d1f9a91b9771f0543aa2cafbc113d09d6cfc2bcd2e7ae181a58c0dd8493b` |
| `generation-record-b2.json` | `0ec950f5a204f951dde9e9c6c0498fe17ab750d1b5a0ad8195eff023ef1a73bf` |
| Prior candidate B | `fe548d6e60d42d21b44870ec72a09fb87422b5b3e19fe5d2d29e3f5fb657fb8b` |
| `image-review-initial.json` | `1fc9f06f2ef09598bd46c8e148f60bee241a2c5a68f47854e9c8d30198768d8e` |
| `spec.json` | `c99c126ae1b5053ae08571139d13f3ed307ddf798bd395256a33f374f6bb2ea9` |
| `source-plan-review.json` | `66ccc10c5d535145e7d5c848950cdad53886bb669c33f113a67f9c956dd79ffb` |
