# AgeMem Figure 1(c) source audit

**Reviewer:** independent source pass (`/root/agemem_e2e_review`), performed
before receiving or inspecting a new reconstruction export.  This audit uses
only the named raw source files and the supplied starting scene/typography
profile; it does not use historical review verdicts.

## Authority and scope

The selected visual target is
`paperfigure/examples/agentic-2026-layout/agemem/source/reference.png`
(SHA-256 `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68`).
`source/provenance.json` identifies it as a lossless crop of page 2 of
`source/paper.pdf` (page 2, crop `[375.2, 70.8, 524.5, 267.5]`, 4x scale), and
selects Figure 1(c), not panels (a) or (b).  The caption on page 2 identifies
the right panel as the proposed AgeMem framework: STM and LTM are jointly and
intelligently managed through explicit tool-based operations.  These two facts
make the supplied PNG the authority for composition, wording, topology,
color/layout roles, and visual hierarchy.  The paper text is supporting
semantic evidence, not authority to redesign the selected panel.

The source text further says that AgeMem integrates LTM and STM management into
the agent policy and lets the LLM decide when and what to store, retrieve,
update, summarize, or discard (`source/paper.html`, abstract and §1; see also
the page-2 text following Figure 1).  It defines LTM as persistent
user/task-specific knowledge and STM as information in the current input
context (`source/paper.html`, §1).  These claims support the distinctions in
the target; this reconstruction must not add the paper's separate training/RL
stages because the selected Figure 1(c) does not depict them.

`source-text-ledger.txt` supplies the exact target strings and their source-PNG
coordinates.  `source-primitives.json` supplies the canvas (597.2 x 786.8),
text/image primitive geometry, and sixteen non-text source icon locations.
The starting scene is `output-v15/layout-scene.json`; the frozen source-aware
typography baseline is `assets/typography/agemem-accepted.json`.

## Required visual/semantic reading

Read from top to bottom, with the loop on the left:

1. **Inputs.** The query card and session-content card feed downward into the
   rounded "Agentic Memory Management" manager.  Preserve the question,
   three session entries, source icons, stacked-paper treatment, and the two
   yellow downward arrows.
2. **Unified management.** The manager contains exactly two dashed tool
   compartments: *Short-term Memory Tools* and *Long-term Memory Tools*.
   Their placement and equal role convey joint management, not a serial
   pipeline.  The central manager label and robot icon remain the focal
   mechanism.
3. **Two managed outputs.** The STM tool compartment points to *Agentic
   Context*; the LTM tool compartment points to *Agentic Memory*.  The
   green italic label "Tools calling & Memory operation" belongs to this
   two-branch operation area.  The pink LTM return route is labeled "Memory
   retrieval tool" and returns upward to the manager.  Do not turn that
   route into an output arrow or add a reciprocal STM retrieval edge.
4. **Response loop.** Agentic Context flows down to the LLM Answer card,
   which contains the exact answer markup.  The grey dashed left-side route
   labeled "Multi-round responses" returns from this answer area toward the
   manager.  It establishes repetition/feedback, not a new memory store.
5. **Construction inset.** The dashed pale-green *Agentic construction*
   region is a subordinate LTM construction/maintenance vignette.  Its small
   agent fans out to Short-term Memory and Long-term Memory; a green dashed
   bidirectional horizontal relationship joins those memory instances.  It
   must remain an inset rather than a peer main stage.

## Starting-scene comparison and permitted deviations

The starting scene lists the same principal modules and ten relationships:
query/session inputs; STM/LTM operations; LTM retrieval; context-to-answer;
multi-round feedback; construction-to-STM/LTM; and STM/LTM coordination.  Its
declared `layoutChanges` identify the only intended non-target substitutions:

- Raster gradient arrows become solid-color native connectors, as explicitly
  constrained for this task.  Direction, endpoints, edge roles, broad input
  shaft treatment, and source colors must otherwise stay recognizably tied to
  the target.
- Source icons are approximated as editable native icon groups.  This is an
  appearance/editability accommodation, not authorization to substitute new
  semantics, symbols, or panel geometry.
- Recovered text and source-backed mathematical images may be native text;
  wording and line breaks must be checked against the text ledger/reference.

No other topological, scientific, wording, or composition change is supported
by the sources.  In particular: retain the target's warm full-page background,
rounded-card hierarchy, dashed boundaries, italic green/pink explanatory
labels, lack of title/footer, and the source's asymmetric feedback routes.

## Source-supported concerns to inspect in the export pass

- The target's yellow input shafts, pink STM/LTM routes, green construction
  routes, grey feedback loop, and solid/dashed boundaries carry distinct
  visual roles.  A solid-color policy does not permit flattening them into one
  undifferentiated connector style.
- The target uses compact hand-lettered/serif/italic typography and many
  small labels.  Exact strings, wrapping, clipping, final-width readability,
  and observed Office font substitution need inspection in actual SVG, PPTX,
  and PDF rasters; profile conformance alone is insufficient.
- Source primitives mark icon families as non-text source icons requiring
  manual review.  Native approximation can be editable and still fail
  reference fidelity if recognizability, scale, color, or location changes.
- The figure is a single framework panel, not evidence for every algorithmic
  or training claim in the paper.  Do not infer stagewise RL, reward flow,
  tool internals, or data direction beyond the arrows/labels shown.

## Audit verdict

**Source interpretation: pass, with the above bounded-deviation contract.**
This does not approve any export.  Native editability and visual quality remain
separate, unjudged questions until the exact reconstructed SVG, independent
Office PPTX raster, and PDF raster are directly opened against the selected
target.
