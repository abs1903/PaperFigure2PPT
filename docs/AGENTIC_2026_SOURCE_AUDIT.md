# Agentic 2026 source/topology audit

**Scope.** This is a source-fidelity audit of the two `output-v3/layout-scene.json`
files. It is not a visual-quality review of their in-progress rendering and makes
no change to the examples or implementation.

## Sources inspected

| Example | Pinned source and intended scope | Directly checked evidence |
| --- | --- | --- |
| AgeMem | arXiv `2601.01885v1`; Figure 1(c) only (the right, Unified Management panel) | local `source/paper.pdf`, `source/paper.html`, `source/reference.png`, `source/provenance.json`, and `output-v3/layout-scene.json` |
| MemSkill | arXiv `2602.02474v1`; Figure 2 in full | same five local artifacts |

The PDF titles, authors, versions in `provenance.json`, selected-figure declarations,
and HTML figure identifiers agree. The local HTML also explicitly states **CC BY 4.0**
for both papers. Thus, the source selection itself is sound, subject to the
provenance reproducibility issue below.

## Findings that block a source-complete editable graph

### P0 — provenance hashes do not identify the local reference image

The `referenceSHA256` declared in each `source/provenance.json` does not equal the
SHA-256 of the checked-in `source/reference.png`:

| Example | Declared | Actual local `reference.png` |
| --- | --- | --- |
| AgeMem | `8aec630ec0ef5630a79b74d8bd6f5ec29a4dc6a30965f7a77ec1fea3a5da79b5` | `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68` |
| MemSkill | `a4f8af2a4ca3520bbcd7cebea12a4ce75bb347bb95088752ba4afe92d7dae3e3` | `5513b5de64da5929ac09592c51ae95ab078397f51e9e1211f6ce4beab46a3f31` |

This is plausibly because the tracked files are local crops/rasterizations: AgeMem's
reference is `598 x 787`, while its declared HTML image has a `476/218` aspect ratio;
MemSkill's is `1945 x 870`, while the HTML image is `476/213`. The record does not
say so, however. A consumer cannot reproduce the local source image from the declared
hash or distinguish an intentional crop from replacement content.

There is a related metadata contradiction: both `provenance.json` files have an empty
`licenseFound` array, while both local HTML snapshots explicitly expose `License: CC
BY 4.0`; `output-v3` then records `CC BY 4.0`. The license conclusion is verified,
but it is not carried consistently through the provenance record.

**Required record fix (not performed by this audit):** retain the downloaded source
asset hash separately, add the local derivative hash, and record the exact crop/page
or rasterization recipe. Keep the pinned versioned arXiv URLs and CC BY 4.0 notice.
Populate `licenseFound` (or replace it with a structured, source-located license
record) so the scene is not the only place that states the license.

### P1 — MemSkill's declared graph loses core source relations

The Figure 2 primitives and recovered text broadly match the source, but several
relations visible in the paper are represented only by a label, a broad container edge,
or no graph edge. This prevents the scene graph from being a reliable editable
architecture specification.

1. **Segmenter is not a graph node.** The source explicitly has `Trace 1 -> Segmenter
   -> Text Span -> x_1, x_2, ..., x_T`. In the scene, `Segmenter` is text owned by the
   `learning` container; there is no `segmenter` module and the `segmentation` edge
   goes directly from `selected-trace` to `span-sequence`. The visible reconstruction
   may look correct, but the declared topology no longer says that segmentation is a
   distinct operation.
2. **Trace reset is text-only.** `Reset Every Trace` is a source-level invariant of
   the trace-specific memory bank. It is a text primitive in `step-loop` and has no
   declared relation to the memory bank or trace boundary. This matters semantically:
   the paper distinguishes the trace-specific memory bank from the shared skill bank.
3. **Constructed-memory evaluation is not declared as `memory-bank -> evaluation`.**
   The caption states that the constructed memory is evaluated on training queries.
   The scene instead has four `step-loop -> evaluation` edges. That is an ambiguous
   container-level surrogate; it obscures the actual data product being evaluated.
4. **Reward target is over-broad.** The paper says task reward optimizes the
   controller. The scene declares `task-reward -> step-loop`, not a controller-targeted
   relation. A container edge can be retained for routing, but it must be accompanied
   by the semantic edge to `controller` (or a documented controller-training node).
5. **The designer's two-stage pipeline is not fully declared.** `Two-stage Skill
   Evolusion` (the source's own spelling) is text in `designer-evolution`, not a node.
   The edge IDs `aggregate-to-analysis*` actually connect the broad
   `designer-selection` and `designer-evolution` containers, rather than
   `aggregate-cases -> analyze-failures`. This loses the paper's stated chain:
   cluster hard cases -> difficulty filtering -> aggregate/select representative cases
   -> analyze failures -> refine existing skills / propose new skills.

These are topology/schema issues, not evidence that the rendered figure is visually
wrong. They should be corrected before treating the graph as the source of truth for
subsequent re-layout or export.

## AgeMem Figure 1(c) result

**Pass, with one scope note.** The source-supported core relationships are all
declared:

- Query and Session Content feed Agentic Memory Management.
- Short-term tools operate on Agentic Context; long-term tools operate on Agentic
  Memory; the latter has the upward Memory retrieval tool relation.
- Agentic Context feeds LLM Answer; the Multi-round responses loop returns to the
  manager.
- The separate Agentic construction inset connects the construction agent to both
  short- and long-term memory and coordinates the two stores.

The exact source labels are recovered without semantic expansion: `Agentic Memory
Management`, `Short-term Memory Tools`, `Long-term Memory Tools`, `Agentic Context`,
`Agentic Memory`, `LLM Answer`, `Tools calling & Memory operation`, `Memory retrieval
tool`, `Multi-round responses`, and `Agentic construction` are all source text. No
mathematics is invented or restored in this figure.

The only qualification is representational: the original's internal tool-to-memory
arrows carry the joint green label, so treating them as two discrete edges is a sound
editable decomposition, but it must not be read as evidence for an additional
manager-to-tool control arrow. The source supports direct tool operations and the
loop shown above; it does not draw a separate internal control-flow edge from the
manager heading to either tool block.

## MemSkill Figure 2 text and mathematics result

**Text and math pass.** The recovered editable text is source-faithful, including
the paper's Figure 2 labels and its original `Two-stage Skill Evolusion` typo. The
seven declared raster-to-native math recoveries are supported by the source figure:
`x_1`, `x_2`, `x_T`, `M_t` (retrieved), `x_t` (current span), `M_t` (executor input),
and `x_t, A_t` (executor input). They agree with the immediate method text, which
defines the state from current span `x_t` and retrieved memories `M_t`, and with the
caption's Top-K skill-selection/executor workflow. No unsupported equation or symbol
was found.

The cards `Skip`, `Update`, `Delete`, `Insert`, `New Skill 1`, `New Skill 2`, and the
hard-case fields are likewise source text. The overlapped-card exceptions are an
appropriate declaration of source-intended stacking, not invented architecture.

## Supported versus ambiguous additions

Both scenes state that raster gradient arrows were converted to solid native
connectors and that connectors were extended to declared module edges. This is an
acceptable editability transformation only when every added edge is source-backed.
The AgeMem additions satisfy that condition. Most MemSkill edges do too (trace
selection, span processing, retrieval, memory update, evaluation, hard-case logging,
designer/skill-bank exchange, and the closed loop), but the five P1 losses above make
the graph incomplete/ambiguous even though no clearly fabricated core relation was
found.

## Acceptance recommendation

- **Do not approve either source package as reproducibly pinned** until the derivative
  image/hash/crop provenance is recorded.
- **Do not approve MemSkill as a semantically complete editable graph** until the five
  P1 relations are modeled explicitly or intentionally encoded and documented as
  semantic relations independent of their visual routing.
- **AgeMem Figure 1(c) is source-topology-ready** once the common provenance record is
  repaired. Its selected-panel boundary is correctly respected; panels (a)/(b) and
  the external caption are not silently imported as content.

## Checks performed

- Inspected the local version-pinned PDF and HTML Figure 1 / Figure 2 sources.
- Rendered the relevant PDF pages and inspected both local reference PNGs.
- Compared every declared `output-v3` module, edge, recovered text primitive, and
  declared math substitution against the source figure/caption and nearby method
  text.
- Calculated SHA-256 for both local reference PNGs; no paper code or model code was
  executed.
