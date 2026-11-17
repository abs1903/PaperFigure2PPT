# V2 user-rejection audit: visual quality at the intended paper-figure standard

## Status

**V2 should be revised; it is not accepted at the user's requested top-AI-paper
architecture-figure standard.** This supersedes the earlier output-local `accept`
decision for delivery purposes. That prior decision remains historically accurate in
its narrow scope: it established source-safe reference reconstruction, output
integrity, and LibreOffice parity. It did **not** establish professional visual
authorship, information-design quality, or a user's aesthetic approval.

I re-inspected the actual generated reference, V2 preview, and V2 LibreOffice PowerPoint
render. The Office render preserves the same issues; they are design issues, not a
preview/rendering defect.

## What the earlier acceptance did not establish

The prior rubric answered: “Does this native diagram preserve the verified graph and
some safely transferable visual cues without inventing unsupported model details?”
It did not answer these more demanding questions:

- Does the figure look intentionally designed by a research group rather than
  assembled from a diagram toolkit?
- Does every visual device clarify an evidenced computation, instead of borrowing
  technical-looking decoration from a reference?
- Is the visual hierarchy elegant and proportionate at paper size, including
  whitespace, line rhythm, and endpoint treatment?
- Can a reader understand what is important beyond the obvious six-arrow pipeline?
- Is the composition independently compelling once the generated reference is put
  aside?

The answer to those questions for V2 is no. Passing a hash-bound independent review
record or an Office route check is therefore not an endorsement at the requested
quality level. The user’s rejection is decisive for delivery.

## Specific visual shortcomings

1. **It remains a decorated flowchart.** The primitive boxes, uniformly thin navy
   routes, centered labels, and simple arrow grammar make the figure feel like a
   cleaned-up slide. The V2 elements resemble the reference, but not its disciplined
   density, visual rhythm, or authored integration.

2. **The figure has no real information hierarchy after the basic pipeline.** The
   light-blue LM rectangle is bigger, but its interior consists of a generic context
   strip and two empty “Decoder block” slabs. This creates a large, visually inert
   region. The reference has a similarly large decoder, but uses that area to make a
   recognizable compact processing motif; V2 cannot do so safely because the method
   does not describe internals.

3. **Token decorations have weak semantic discipline.** Teal and lavender blocks
   make modality identity visible, but the mixed teal/lavender strip inside the LM
   can be read as a specified concatenation/context layout. The external strips also
   resemble arbitrary UI chips. Ellipses reduce, but do not eliminate, that invented
   interpretation. They need either a more abstract, clearly non-quantitative visual
   treatment or stronger method evidence.

4. **The left side is stylistically incoherent.** The relatively detailed raster
   scene tile, small snowflake-like frozen marker, dashed group rectangle, and large
   flat vector cards belong to different visual languages. The image tile is also
   taller/heavier than its role warrants, which competes with the actual method
   modules.

5. **The two streams do not resolve into a convincing fusion story.** “Visual
   tokens” is placed above its route and “Text tokens” below the other; both are
   readable, but their relationship at the LM boundary is merely spatial. There is
   no source-supported visual explanation of how they become one decoder input, so
   the extensive LM input strip risks promising more than the method says.

6. **Endpoint and training-path design is unbalanced.** Answer is a small distant
   card with a large empty gap before it. The supervision route starts near the LM's
   lower right, then turns into a purple card, but “Training only” is embedded in the
   card rather than attached to the dashed path. This makes it less immediately clear
   that it labels phase rather than the loss type, and gives the right side an
   unresolved two-endpoint silhouette.

7. **Typography is competent but not refined.** V2 has readable text, yet the bold
   prompt/loss headings, card captions, and group title use similar visual weight.
   The resulting hierarchy is flatter than intended. Some labels are positioned as
   annotations around line segments instead of being designed as part of a coherent
   input encoding.

8. **The reference is not a sufficient quality target by itself.** It supplies a
   useful composition proposal but includes unsupported self-attention/FFN detail,
   an invented answer, and a visible heading disallowed by this task. V2 correctly
   avoids those claims, but the missing source evidence leaves it without enough
   legitimate content to fill a complex paper-style architecture panel.

## Is the visual design intrinsically under-specified?

**Yes, for the requested level of figure.** The six-sentence method verifies only a
system-level dataflow: module names, frozen/trainable status, two inputs to a
decoder-only LM, an answer, and a train-only loss. It does not state the fusion
operator, token ordering, prompt template, decoder interface, prediction head,
loss target, internal decoder abstraction, or the claimed contribution. A high-density
method figure normally obtains its hierarchy and signature visual device from those
details.

This does not make a good overview impossible. It does mean the honest output should
be a deliberately minimal, elegant system overview—not a faux-detailed architecture
panel. Filling the gaps with token arrangements, repeated blocks, or internal motifs
will look strange precisely because readers cannot tie those marks to a claim. To
create a richer paper figure, obtain evidence for the fusion/input serialization and
the actual contribution, or explicitly request an illustrative rather than factual
diagram.

## Stronger acceptance criteria

Do not accept a next candidate unless all of the following are met by an independent
visual review at final paper width:

1. **Clear figure purpose.** The source establishes what the figure must communicate
   beyond the base pipeline (for example, the fusion/serialization mechanism or
   proposed contribution). If no such evidence exists, the design explicitly adopts
   a sparse system-overview brief and removes faux internal detail.
2. **One coherent visual language.** Choose either a restrained abstract/vector
   language or a tightly controlled illustrative language. Do not mix a detailed
   raster scene, pseudo-icon, UI-like token chips, and generic rounded flowchart
   cards without a shared style system.
3. **Evidence-bound encoding.** Every repeated block, colored sequence, bracket,
   and internal panel either has a source-supported meaning or is replaced by a
   plainly abstract, non-counting cue. No visual element should imply token order,
   concatenation, layer count, or decoder internals absent from the method.
4. **Deliberate hierarchy and whitespace.** The eye must follow image/prompt ->
   evidenced integration point -> LM -> answer, with training supervision visibly
   secondary. Module size, blank space, line weight, and label placement must serve
   that order; no large inert panel or accidental gap is allowed.
5. **Semantically local phase treatment.** Put a compact “training only” label on
   or immediately adjacent to the dashed supervision edge, without a footer/legend;
   keep the answer and loss endpoints visually balanced but subordinate to the core.
6. **Native editability and render checks remain necessary but insufficient.** Text,
   module shapes, and connectors must remain editable; SVG/PDF/PNG/PPTX must render
   correctly. These gates are prerequisites, not evidence of visual quality.
7. **Human/user visual sign-off.** A reviewer assesses the full-size preview and the
   PPTX render specifically for authorship, visual coherence, information hierarchy,
   and non-invented meaning. Delivery is blocked by a rejection, even if the
   mechanical and scoped-reference checks pass.

## Recommended decision

Treat V2 as a mechanically sound exploratory draft, not a deliverable paper figure.
Before another layout iteration, either supply method evidence that supports a real
architectural centerpiece or reset the brief to a sparse, source-faithful overview
whose quality comes from typography, proportions, and restrained visual grammar—not
from fabricated-looking internal detail.
