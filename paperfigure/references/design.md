# Visual design for AI architecture figures

This is a design reference, not a claim that one palette guarantees publication
quality or that the named venues impose identical figure rules.

## Communication and composition

Give the claimed mechanism a visible place in a clear primary reading path. Let
actual parallel branches, temporal returns and training-only supervision determine
the topology. Distinguish the proposed change from the baseline by role and text,
not arbitrary decoration. Use stable module boundaries; show internal detail only
when it explains the method. Avoid a card for every sentence of the Method.

For VLMs, distinguish visual features, projected tokens, text input and decoding.
For tool agents, separate calls, observations, persistent state and final output.
For physical agents, identify observation time, recurrent state, action selection
and the environment step. Draw gradients or controller feedback only if supported.

Use horizontal flow when the story is sequential. Use aligned modality lanes for
parallel encoders, a dominant center for fusion/decision, and outer channels for
temporal returns. The shared renderer supports explicit geometry and a sparse
orthogonal router; the automatic layout is a starting point for simple graphs,
not a publication-layout optimizer.

## Typography and visual grammar

Default: no title, subtitle, footer, legend, or explanatory fine print. Let LaTeX
caption carry the title and longer explanations. Make necessary edge meanings
legible locally; do not remove scientific conditions to obtain a cleaner picture.

Use `visual.typography.fontFamily`, `moduleSize`, `detailSize`, `annotationSize`,
and optional `titleSize`. Each layout node can override `fontSize`. All values are
SVG coordinate pixels; PowerPoint uses 0.75 times that value in points at the same
canvas size. Actual paper text size is `px / canvasWidth * publicationWidthIn * 72`.
Changing the font size can require reflow and wider modules. Keep the print-size
gate and repair layout rather than simply making the text smaller.

Use solid fills only by default. Do not add gradients, glow, glossy shading or
3D color effects. Historical gradient examples demonstrate exporter capability,
not the current visual brief.

Muted fills, dark text and thin strokes are a starting palette. Meaning should
survive grayscale. Use arrow direction, local labels and line style as redundant
encodings. Native symbolic glyphs can differentiate image inputs, model stacks,
tools and memory; they are illustrative, not additional semantic nodes or fixed
counts. Do not use empty panels, unexplained token grids, emoji, or arbitrary
invented submodules to make a figure appear sophisticated. Decorative block counts
must not be presented as actual layer/token counts. Add exact counts only from evidence.

## Semantic color

For recent-paper observations, saved visual profiles and optional palette families,
read [color-and-hierarchy.md](color-and-hierarchy.md). It complements the semantic
rules here without changing existing references or default theme values.

Assign colors only after extracting scientific categories. Record each accent's
meaning, applicable object IDs and evidence in the case's design contract. Use
one color for equivalent categories across the whole figure; different module
names alone do not justify different colors. Use neutral styling for objects
without a supported category. Do not color an important-looking box differently
only to make it stand out; use size, position and typography for that purpose.

Choose one explicit encoding per visual channel, for example module fill = frozen
versus trainable parameters. Do not silently switch the same fill channel to
modality or novelty halfway through a figure. A tensor activation has no parameter
trainability state: keep activation glyphs neutral unless a separate, explicit
provenance/modality encoding is necessary and documented. Natural input-photo
colors are data content and are outside schematic palette encoding.

Keep semantic labels or line/shape cues so meaning survives grayscale. Default
caption-free figures need local labels where interpretation would otherwise be
ambiguous, not a new footer legend. Validate category membership against source
facts; trainability from constructor defaults is not an observed optimizer update.
During independent review ask which scientific fact each accent communicates;
remove or unify accents that have no answer. Automated palette checks can verify
contract consistency but cannot prove that the chosen meaning is scientifically
correct. A generated style reference yields to source facts and this rule.

## Visual inspection

Inspect both the full PNG and a preview at final paper width. Look for oversized
headings, gaps without communicative purpose, ambiguous merge points, line labels
that float away from their edge, arrows touching text, and illustrative motifs
that invite a false scientific interpretation. Inspect the PowerPoint render too:
native object generation does not guarantee identical Office typography.
