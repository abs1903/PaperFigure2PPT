# Independent review: LLaVA architecture-only study C

## Decision

**C is a defensible visual-direction target, conditionally, but it should not be
reconstructed unchanged or treated as a final deliverable.** It materially improves
on A/B: the rejected standalone Stage 1/Stage 2 panel is gone, the two modality lanes
now converge cleanly on a compact central Vicuna region, and the result retains the
more polished finish the user liked in A. Training states are deliberately out of
scope for this architecture-only study and remain in `METHOD.md`; their absence here
is not a scientific omission.

This review inspected the actual `design-studies/c.png` against `METHOD.md` and
`design-brief.json`. It does not approve scientific content merely because it finds
the direction visually useful, and it grants no editable-deliverable acceptance.

## What C gets right

- **Composition:** The upper image/vision lane and lower instruction lane meet the LM
  without the awkward left/right split or page-height training dashboard of A/B. The
  focal order is legible: image/instruction -> visual projection and text embeddings
  -> Vicuna -> response.
- **Negative space:** The white space is now mostly functional separation between the
  two lanes rather than vacant space created by a parked training panel. The output
  document has enough room to read as the endpoint without becoming a separate panel.
- **Architecture scope:** The figure shows image `X_v`, frozen CLIP ViT-L/14,
  `Z_v`, linear `W`, `H_v = W Z_v`, instruction `X_q`, `H_q`, Vicuna, and response
  `X_a`. It does not introduce B's unsupported discrete Text Embedding module, a
  Q-Former, cross-attention adapter, MLP projector, or a standalone fusion module.
- **Conditioning relation:** The visual and text representations enter separate ports
  on Vicuna. This is more defensible than A/B's boxed multimodal sequence because it
  does not silently claim a fixed concatenation/serialization order.
- **Presentation constraints:** No visible title, subtitle, footer, legend, fine
  print, or training-stage inset appears.

## Issues to correct before native reconstruction

1. **`W` must be called learned, not just linear.** The paper-grounded method says
   `W` is a learned/trainable linear matrix. The box says only “W (linear),” so a
   reader could mistake it for a fixed transform. Use a compact `learned linear W`
   label. Do not attach a static frozen/trainable label to Vicuna in this
   architecture-only figure, because that status changes by stage.

2. **The repeated vertical bars inside Vicuna remain pseudo-architecture.** They look
   like a particular depth/stack of decoder layers, despite the ellipsis. The source
   supports an autoregressive language model but no internal layer depiction. Replace
   the bars with a single restrained, abstract autoregressive-decoder cue or leave the
   model interior empty and let the labelled envelope carry the meaning.

3. **The token-like marks need a non-quantitative convention.** `Z_v`, `H_v`, and
   `H_q` are source-supported sequences, and the ellipses help, but the fixed visible
   bars can still look like a claimed count/shape. In native reconstruction, use a
   small repeated motif plus ellipsis and a local representation label, consistently,
   without presenting the marks as measured dimensions or a fixed token ordering.

4. **Make the output readable beyond notation alone.** `X_a` matches the paper,
   but a compact local “language response” label beside or under the document would
   make the endpoint self-explanatory for readers who do not know the notation. It
   should be a module label, not a caption/footer.

5. **Tighten the visual language.** The cat raster is a legitimate example of the
   image input, but it has more photographic texture than the rest of the clean vector
   plate. Recreate a controlled original image tile or reduce the tile's visual weight.
   The snowflake is also an informal frozen-status icon; pairing it with the explicit
   “frozen” label is sufficient, so it can be simplified or dropped.

## Science audit

| Claim or relation | Assessment |
| --- | --- |
| `X_v ->` frozen CLIP ViT-L/14 `-> Z_v` | Supported and accurately drawn. |
| `H_v = W Z_v` through a linear `W` | Supported and visibly communicated; add “learned.” |
| `X_q -> H_q` and both visual/text representations condition Vicuna | Supported at the level shown; separate entry arrows avoid an unsupported fixed sequence claim. |
| Vicuna `-> X_a` | Supported; the arrow direction and document endpoint are clear. The method states autoregressive generation, but C does not label it; a small local label is optional and source-supported. |
| Stage 1/Stage 2 parameter states | Correctly omitted under the explicitly revised architecture-only scope; they remain required in method documentation, not this graphic. |
| Repeated bars inside Vicuna | Not source-supported as a concrete interior/layer depiction; revise as above. |

## Minimal reconstruction brief

Use C's two-lane composition, palette, thin dark routes, and compact central LM. In
the semantic spec, keep only the six forward modules and the five forward edges from
`design-brief.json`; use `Z_v`, `H_v`, and `H_q` as labelled representations rather
than new learned nodes. Make `W` a learned linear projection, label the output
“language response,” retain CLIP's frozen status, and leave phase-dependent Vicuna/W
training states to the accompanying method documentation. Do not reproduce the
unverified pseudo-layer bars or turn the token motifs into fixed counts.

With those corrections, C is an appropriate target for a native editable draft and a
fresh independent render/semantic review—not a final approved paper figure.
