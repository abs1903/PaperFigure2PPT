# Independent visual inspection - first eight selected figures

Inspection date: 2026-11-17

## Scope and method

This is a source-bound visual observation record, not a venue-wide style claim,
award ranking, reuse-permission assessment, or palette prescription. I inspected
the selected rendered pages (`sheet-1.png` and `sheet-2.png`) against the eight
named local PDFs and their selected figure captions in `figure-candidates.json`.
The pages are 980 x 1268-pixel renderings; the underlying source PDFs are listed
in the provenance table below. Observation is limited to the selected figure on
each page, with the surrounding page used only to judge local white space and
contrast.

The sample is the first eight available selected figures in the run corpus:
`cache-to-cache`, `laver`, `lightmem`, `mem1`, `memagent`, `memgen`,
`memoryvla`, and `metaembed`. It is heterogeneous (architecture diagrams,
workflow diagrams, a benchmark radar plot, and illustrated examples), so a
single visual rule would be an overreach.

## Neutral observations by figure

| Source / selected figure | Color roles visible in the selected figure | Ink, fill, neutral space, and accent behavior | Useful counter-observation |
| --- | --- | --- | --- |
| Cache-to-Cache, Fig. 5 (p. 5) | Blue differentiates cache endpoints; orange identifies the fuser/process; a small red mark identifies gate-related elements. | White page and white modules dominate. Blue/orange are used both as thin outlines and light fills; black arrows and labels remain the structural ink. The red is sparse and localized rather than a third broad phase fill. | This is compact and highly role-coded, but its small components make colored borders relatively prominent; it does not demonstrate low-ink, large-panel styling. |
| LaVer, Fig. 1 (p. 1) | Two radar plots use pink/purple surfaces and lines, with small blue/purple series marks. | The chart is mostly white/gray grid and black labels. Color is concentrated in the plotted polygons rather than in containers or section backgrounds. | A quantitative plot, not a workflow: its overlapping translucent fills are not evidence that diagram modules should use overlapping fills. |
| LightMem, Fig. 2 (p. 4) | Repeated memory/module tokens use reds, greens, blues, and purple; dotted green frames mark stage/group boundaries. | The diagram has a white base and mostly black arrows/ink. Several colors recur for semantic tokens and modules, often as small colored cells or pale boxes. Saturated red labels appear as warnings/emphasis. | This is the densest and most multi-hue example; it is an example of intentional local vocabulary, not evidence for assigning many hues by default. |
| MEM1, Fig. 1 (p. 4) | Pale pink, pale green, pale blue, and pale yellow encode pipeline and token/mask roles. | Black/gray outlines and arrows maintain the workflow. Large white gaps separate stages. Fills are light enough that dark type and outlines carry legibility; token rows repeat color-role pairing consistently. | The systematic palette includes several categories, but it relies on accompanying labels and position; color is not the only carrier of meaning. |
| MemAgent, Fig. 4 (p. 4) | Almost entirely monochrome, with small green and red arrows for write/read dynamics. | White panels, black rectangular frames, thin black arrows, and black labels dominate. Color has no container-fill role and only marks directional/action differences. | A direct counterexample to “recent paper figures need pastel module fills”: this architecture remains readable through linework and layout with only two small accents. |
| MemGen, Fig. 2 (p. 4) | Soft green, blue, purple, and gray organize three horizontal conceptual bands; red/green circular status icons mark an explicit contrast. | The diagram uses pale panel fills, dark outlines, and a large white page field. Repeated band colors align with the left-side named phases; tiny elements reuse those colors. Red is visually reserved for a failure/no-memory condition and green for invocation/positive transition. | It shows phase/band color use, but it contains numerous pictorial assets and a high information density; phase fill alone is not doing the explanatory work. |
| MemoryVLA, Fig. 1 (p. 2) | Pale blue frames group subpanels; green/blue/pink distinguish token or memory elements; orange/red are used for calls-to-action and outcome emphasis. | The broad canvas is white. Colored cards have strong dark or colored outlines; arrows and labels retain dark ink. The repeated blue framing visually ties four subfigures together, while more saturated marks call attention to temporal/action details. | This combines illustration, UI-like modules, and a chart. Its colors are task-specific and include photographic content, so it is not a clean source for a generic diagram palette. |
| MetaEmbed, Fig. 1 (p. 2) | Light green denotes VLM blocks, blue/orange identify vector/group constructions, and small pink tokens repeat a distinct input role. | The white background and gray/black connectors carry much of the diagram. Colors appear as flat, named component fills and are repeated consistently across the upper comparison and lower method. | It is the clearest modular-role example, but still uses icons, labels, and spatial grouping alongside color; the roles cannot be reconstructed from hue alone. |

## Cross-sample observations, stated with bounds

- **Neutral space and ink:** all eight selected pages retain a white figure field or white page field. Black/dark gray text, outlines, and connectors remain essential even where several fills are present. None supports replacing structural ink with pale colored strokes.
- **Fill versus stroke:** light fills are common in the workflow/module examples (Cache-to-Cache, MEM1, MemGen, MemoryVLA, MetaEmbed), usually paired with darker outlines. MemAgent demonstrates an equally deliberate line-first alternative. LaVer concentrates color inside chart marks rather than boxes.
- **Focal accents:** saturated red/orange appears in small, semantically specific places (e.g., a gate/status/action or warning), not as a general background. Blue/green are often recurring categorical/module colors, but their meaning differs by paper.
- **Phase headings:** only MemGen visibly assigns broad horizontal colored bands to named conceptual stages in this selected set. LightMem also uses stage/group framing, whereas MEM1 reads as a left-to-right process without broad colored phase headers. Phase color is therefore a selective pattern, not a baseline requirement.
- **Repeated roles:** MEM1 and MetaEmbed provide the strongest examples of a role color being repeated across multiple tokens/modules; LightMem repeats a richer local vocabulary. The visual role is reinforced by labels, grouping, and position in every case observed.
- **Contrast and exemplars:** MemAgent is the important monochrome-plus-accent counterexample; LaVer is the chart-specific counterexample; MetaEmbed and MEM1 are the cleanest examples of restrained, repeated module-role color. These examples should not be collapsed into a claim about ICLR/CVPR generally.

## Provenance fingerprints

| ID | Selected page | PDF SHA-256 |
| --- | ---: | --- |
| cache-to-cache | 5 | `e755d9c32dca0fc5049a1dc300f9d034ff02fef8e343bb8ef5994c23a0ecaedd` |
| laver | 1 | `f7129b00ea8b321ddfde8cd39c1a4531172de7df6ff405b9b5a50e122685e27d` |
| lightmem | 4 | `bb7868bc650cde657a4bc37f9aae9a3ba594b60e062506dd747f48c085b98dd7` |
| mem1 | 4 | `ced7e45453b8c67279672fe39d71c039753a0554824015e90afd049e6baae433` |
| memagent | 4 | `b4c9095c87943625e812dfd8ea7386c4fc98ddde133960d98d2d00ea877238a0` |
| memgen | 4 | `004e6dbcccf61856334f814535cde98d51da925d1f6f683e99406aac195c388e` |
| memoryvla | 2 | `1c88607622513c100573579b0cb2443d61a66165e0db6fe775f0a8de544504df` |
| metaembed | 2 | `c39353e97342786365908da74a271d2b2ae146ee42ec841a75d78f8dceb2b613` |

Rendered-sheet SHA-256: `sheet-1.png` `c9a07a11381a7fd640e64e472376f3f6e8d0441ce07c2369c9baacd334f52df2`; `sheet-2.png` `7ca2b3393e382b5a5b298acafe7e525420b4e55b047a044664566f2ce1027cca`.

## Explicit non-findings and boundaries

- No claim is made that any observed palette is an ICLR/CVPR norm, a quality signal, or suitable for all scientific figures.
- No conclusion about awards, acceptance quality beyond the corpus metadata, copyright, or figure reuse permission follows from visual style. Source papers remain local analysis material and are excluded from Git under the run policy.
- This document intentionally does not choose a target palette, approve any figure change, or assess the native CLIP figure variants. Such an assessment requires the authorized palette revision, native Office artifact, and an explicit comparison to the accepted `docs/runs/2026-11-17-clip-showcase/output-v2` baseline.
