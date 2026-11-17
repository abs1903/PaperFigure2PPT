# Independent review: LLaVA visual design studies A and B

## Scope and decision

This review inspected the actual generated rasters `design-studies/a.png` and
`design-studies/b.png`, the local method/brief, and the primary LLaVA paper’s
Sections 4.1–4.2. These files are **visual studies only**. Neither is an editable
deliverable, neither is granted delivery acceptance here, and a request for a visual
direction preference must not be read as approval of its scientific content.

The verified scientific boundary is narrow: CLIP ViT-L/14 produces visual features
`Z_v`; the trainable linear matrix `W` maps them to language-space visual embeddings
`H_v = W Z_v`; instruction text has embeddings `H_q`; both condition Vicuna, which
generates a response autoregressively. Stage 1 trains `W` only with the visual encoder
and LLM frozen; Stage 2 keeps the visual encoder frozen while updating `W` and Vicuna.
The primary paper confirms the projection equation and the two-stage parameter sets.

| Study | Aesthetic verdict | Semantic verdict | Reconstruction decision |
| --- | --- | --- | --- |
| A | **Fail / revise** | **Fail / revise** | Do not reconstruct until composition and sequence semantics are repaired. |
| B | **Promising direction, revise** | **Fail / revise** | May guide a new study after the extra Text Embedding module and sequence claims are corrected. |

## Study A — compact editorial pipeline

### Aesthetic assessment: fail / revise

The central image-to-Vicuna path is readable and the upper-right stage inset is useful,
but the composition does not reach the requested authored paper-figure quality.

- The training inset is visually too large and heavy for a secondary training-state
  explanation, while the entire upper-left half is unused. The open space feels
  accidental rather than a deliberate gutter.
- Several incompatible vocabularies coexist: a photographic cat, emoji snowflakes and
  flames, rounded gradient-like stage chips, serif math labels, and a broad blue model
  card with repeated vertical bars. This reads as a polished generated infographic,
  not one coherent scientific plate.
- The Vicuna box has a broad, low-information interior. Its four vertical bars and
  ellipsis become decorative pseudo-layers; they do not clarify the stated model.
- The visual feature ribbons are too close to UI-status pills. Their color and count
  have no immediately local explanation, and the mixed teal/blue input row is visually
  busier than its evidential content.
- The model-to-document endpoint is clear, but the document, long autoregressive
  label, and stage inset create three competing right-side focal points.

### Semantic assessment: fail / revise

- The study does not display the required relation `H_v = W Z_v`; it only labels the
  input/output symbols around `W`. The expression is a central evidenced claim and
  should be explicit if the diagram is meant to communicate the projection.
- The `Input: [teal …, blue …]` row presents one apparent visual-then-text ordering
  and a comma-separated composition. The supplied brief only establishes that `H_v`
  and `H_q` condition Vicuna. Moreover, the original training description allows the
  first-turn visual/instruction order to vary. The row must be qualified as schematic
  conditioning or removed; it cannot silently assert a fixed serialization.
- The feature bars convey token multiplicity without a non-quantitative cue or label.
  Ellipses help, but do not explain whether they are tokens, patches, or a sequence
  layout.
- The training inset correctly communicates frozen/trainable status for both stages.
  Its science is the strongest portion of A.

### Minimum changes before any native reconstruction

1. Put `H_v = W Z_v` beside the projection and replace the opaque mixed input row
   with a labelled, explicitly schematic conditioning interface (or no sequence box).
2. Reduce and recompose the training inset so it is clearly secondary and does not
   leave a vacant upper-left field.
3. Choose one vector/scientific visual language; remove emoji and avoid a photo-like
   input that conflicts with the rest of the plate.
4. Replace decorative repeated Vicuna bars with a single abstract decoder silhouette
   or a label-only slab, avoiding implied layer counts.

## Study B — scientific architecture plate

### Aesthetic assessment: promising direction, revise

B is the stronger visual direction. It has a cleaner upper vision lane/lower language
lane, an understandable central sequence interface, restrained geometry, and a useful
separation between inference flow and the stage panel. It is closer to a conference
paper plate than A.

It is still below the requested standard as rendered:

- The large right training panel consumes too much width and is separated by a harsh
  full-height vertical rule, making the composition feel split into two unrelated
  figures. It should be a smaller, quieter aligned inset.
- The central “Multimodal Input Sequence” enclosure becomes the main visual event,
  yet its dashed border and long token chains make it look like a new fusion component
  rather than an interface/representation.
- The image is a photographic raster while the rest is vector-like; the mismatch is
  more controlled than A but still breaks stylistic coherence.
- The stacked translucent `Z_v` slabs imply an unstated visual-feature structure, and
  the many colored blocks create an impression of exact counts or a prescribed layout.
- The Vicuna card is compact and better than A’s, but its prominent internal `f_phi`
  and generic decoder label still do not create a meaningful focal point without
  overclaiming internals.

### Semantic assessment: fail / revise

- B adds a discrete **“Text Embedding”** module. The design brief’s exact forward-node
  inventory contains `Text instruction` and says the instruction’s text embeddings
  condition Vicuna, but it does not authorize a separate learned text-embedding
  module. The paper’s architecture figure denotes `X_q -> H_q`; a new module could be
  interpreted as an added trainable encoder. Remove the module box and show `H_q` as
  the instruction representation, or obtain evidence for the intended embedding
  operation and parameter status.
- `H_v = W Z_v` is correctly visible, and the stage panel correctly states both
  stages’ frozen/trainable parameters.
- The labelled multimodal sequence risks asserting a fixed concatenation/order and
  calling it a separate fusion mechanism. It needs wording/geometry that conveys
  “visual and instruction embeddings condition Vicuna” without adding a new module or
  a fixed ordering claim.
- The answer path is appropriately marked autoregressive, but the output document has
  only `X_a`; add a compact local “language response” label if that is needed for
  readers rather than relying solely on notation.

### Minimum changes before any native reconstruction

1. Remove the Text Embedding box. Route `X_q` directly to an `H_q` representation
   label/notation, making no claim about a new component or its training state.
2. Replace “Multimodal Input Sequence” with a small, clearly non-module interface
   annotation such as “conditioning embeddings,” or show the two labelled streams
   entering Vicuna without a sequence enclosure. Do not encode a fixed ordering unless
   supported by the chosen training/inference claim.
3. Compress the stage panel into a quiet two-row inset, eliminating the page-height
   divider and restoring balance to the main forward path.
4. Standardize the image treatment and token glyph style; use explicitly schematic,
   non-counting visual marks and fewer of them.

## Cross-study acceptance criteria for the next visual study

Before native editable reconstruction, a successor must satisfy all of these:

1. Every visual node and arrow maps to the brief’s forward graph or its verified
   training-state table; derived representation labels (`Z_v`, `H_v`, `H_q`) must not
   silently become learned modules.
2. `H_v = W Z_v`, CLIP’s frozen status, and the two stage-dependent parameter sets
   are clear at normal paper width, with no Q-Former, MLP adapter, cross-attention,
   fixed token count, or fixed decoder-depth implication.
3. Any visual/text joint-input notation states only evidenced conditioning. It must
   not imply a fixed serialization, concatenation operator, or new fusion module
   without source support.
4. The figure has one cohesive visual language, a purposeful focal point, and
   balanced negative space. The training schedule is secondary but readable; it is
   not a dashboard competing with the forward architecture.
5. There is no visible title, subtitle, footer, fine print, provenance line, or
   generic “Decoder block” filler. The later native deliverable must retain adjustable
   text plus editable modules/connectors and undergo independent render inspection.

## Source boundary

The factual observations above are grounded in the local `METHOD.md`/`design-brief.json`
and the primary [LLaVA paper, Sections 4.1–4.2](https://proceedings.neurips.cc/paper_files/paper/2023/file/6dcf277ea32ce3288914faf369fe6de0-Paper-Conference.pdf).
No preference between A and B constitutes scientific or delivery approval.
