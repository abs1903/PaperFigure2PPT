# Independent B2 native-reference inspection

Reviewer: `/root/mae_native_review` (isolated reviewer; this record was made
before opening or inspecting `output-v2`).

## Inspected target

- File: `selected-reference.png`
- SHA-256: `0ea262af8cb3968d0c83ba05733cb27cb8469119227b83efa8a6b5b04d1e8766`
- Dimensions: 1774 x 887 px
- Full-view observation: horizontal two-band MAE teaching schematic on a white
  canvas. The upper band carries sparse encoding through full reconstruction;
  the lower dashed objective band shows supervision and masking only.

## Independent visual inventory

### Regions / modules (15)

1. `image` — 4 x 4 landscape patch grid, left upper.
2. `visible` — vertical lane of four blue tokens.
3. `encoder` — large dark-blue rounded rectangle.
4. `latents` — vertical lane of four blue encoded tokens.
5. `masktokens` — gray learned-token square and `x12` annotation, above restore.
6. `restore` — white outlined `Restore order` box.
7. `restored` — 4 x 4 grid after restoration.
8. `decoder` — pale-blue `Lightweight decoder` box.
9. `pred` — 4 x 4 full landscape prediction grid.
10. `objective` — dashed rounded lower container.
11. `target` — 4 x 4 original landscape target grid.
12. `selector` — 4 x 4 gold/white mask selector grid.
13. `loss` — gold `Masked-patch MSE` box.
14. `pred-loss` — 4 x 4 prediction grid inset on the loss-input side.
15. `selector-caption` — pale-gold `Masked positions only` pill.

### Grids / positions / counts

- Every landscape grid has 16 cells (4 x 4). Visible and encoded lanes each
  contain exactly four blue tokens.
- The restored decoder grid is 4 x 4: blue cells at r1c1, r1c4, r3c2, r4c4;
  the other twelve cells are gray.
- The learned-mask inlet is one gray token labelled `x12`, and occurs above/
  after the encoder, feeding restore order rather than the encoder.
- The selector is 4 x 4: white/unscored cells at r1c1, r1c4, r3c2, r4c4; its
  remaining twelve cells are gold/scored. Thus its white cells equal the
  restored grid's blue visible locations.

### Directed routes / edge inventory (15)

1. image patches -> visible patches;
2. visible patches -> encoder;
3. encoder -> encoded visible patches;
4. encoded visible patches -> restore order;
5. learned mask tokens -> restore order;
6. restore order -> restored 4 x 4 grid;
7. restored grid -> lightweight decoder;
8. lightweight decoder -> pixel predictions;
9. image patches -> original target;
10. pixel predictions -> prediction-loss inset;
11. original target -> selector;
12. selector -> masked-patch MSE;
13. prediction-loss inset -> masked-patch MSE;
14. visible/masking metadata -> restore order, dashed blue `Restore indices`;
15. visible/masking metadata -> selector, dashed gold `Binary mask`.

The upper target/image does not feed the encoder or decoder. The lower target,
selector, and prediction inset form only the loss relationship.

### Text / typography inventory

Visible text is 25 lines: `Image patches`; `Visible` / `patches`; `Mask` /
`75%`; `Encoder`; `Encoded` / `visible` / `patches`; `Learned mask tokens`;
`x12`; `Restore` / `order`; `Lightweight` / `decoder`; `Pixel` /
`predictions`; `Restore indices`; `Binary mask`; `Original` / `target`;
`Masked` / `positions only`; `Masked-patch` / `MSE`.

Text is a heavy sans-serif; the exact raster font cannot be determined from
pixels. Line breaks, relative hierarchy, and the compact lower-inset labels are
fidelity-critical. I observed no title, footer, benchmark result, training
claim, or downstream-use claim.

### Fine detail and allowed deviations

Each landscape uses light-blue sky, pale circular sun, teal mountain facets,
and sandy bottom tiles. Main routes are blue-gray solid arrows; the two metadata
routes are dashed (blue-gray restore index, gold binary mask). The objective
container is gold dashed. Mild fill gradients/shading are present in the raster
reference. Authorized native deviations are only solid source-color fills,
approximate Arial Bold for the unknown raster font, and approximate mountain
microcontours. They do not permit changed geometry, labels, counts, or routes.

## Source cross-check used for review

`source/models_mae.py:123-148` establishes random keep/remove masking and
`mask` values 0=keep/1=remove. Lines 150-170 pass only the retained tokens
through the encoder. Lines 172-194 append repeated shared mask tokens only in
the decoder path, restore order with `ids_restore`, and predict the full patch
sequence. Lines 198-214 construct per-patch prediction loss and average only
the removed (`mask == 1`) positions. The diagram deliberately omits class-token
and positional/projection details; that is acceptable for this teaching-level
pre-training schematic.
