# BLIP-2 OPT native-figure review

## Scope

This is an independent agent review of the code-first frozen native
reconstruction, not user acceptance or a claim of publication/venue quality.
It was performed before inspecting an author paper figure. The source baseline
is [`BLIP2_CODE_AUDIT.md`](BLIP2_CODE_AUDIT.md): the relevant route is
`image -> frozen ViT -> separate LayerNorm -> query-only Q-Former -> opt_proj
-> [visual-prefix embeddings; prompt embeddings] -> frozen OPT -> decoded
caption`.

I inspected the following actual rasters at their supplied final dimensions:

- `paperfigure/examples/blip2-opt-code/design-reference.png`
  (`b2fc45bb52a0da9a23fff2a95653525557ac763b85a0be7d45ac479e4eb1bc51`)
- `paperfigure/examples/blip2-opt-code/output/figure.png`
  (`937cd1277e3eeea5162abbd95798a1990d3f8ebbc692408c09bc6ef40ec09798`)
- `paperfigure/examples/blip2-opt-code/output/rendered-pptx/figure.png`
  (`a837be5c8e1510fe47cf41365f08ece9dd05719571e44e27fb0a5afd09c16daa`)
- `paperfigure/examples/blip2-opt-code/output/rendered-pdf/figure.png`
  (`7605745de835dfe3ee292bccda0214e9845b738c312ae3a219806ff892814d9f`)

## Verdict: revise

The figure preserves most code-level modules and the requested visual language,
but its arrows fail to make the code-mandated concatenation site unambiguous.
This is a scientific-communication issue, not a cosmetic preference.

The `opt_proj -> OPT` arrow enters the outer OPT language-model box at its
midline, rather than the inner strip labelled `Visual (32) | Prompt`. The lower
`Tokenize + embed -> OPT` arrow likewise enters the outer box below that strip.
Although the strip correctly orders visual representations before prompt
representations, neither incoming edge visibly terminates on it. A reader can
therefore interpret both arrows as independent conditioning inputs to the
language model, rather than the explicit single `inputs_embeds` sequence
`[projected visual prefix; prompt embeddings]` established by code. This fails
the required prefix/ordering communication and should be corrected before
acceptance.

## Nine-criterion assessment

| Criterion | Result | Observed evidence |
| --- | --- | --- |
| Reference comparison | Revise | The white landscape, upper learned-query input, central image route, lower prompt lane, blue/amber/teal palette, serif hierarchy, and absence of title/footer survive. The native version deliberately condenses the tokenizer/table and removes the intermediate free-standing prefix motif under the recorded design-contract deviations. However, moving both arrows to the outer OPT boundary loses a key relationship that the reference made legible. |
| Semantic fidelity | Revise | ViT then separate learned-affine LayerNorm; 32 query tokens; query-to-image Q-Former; `opt_proj`; frozen OPT; optional empty-default prompt; and decoded caption are correctly represented. The internal strip correctly displays `Visual (32) | Prompt`, but its bypassed inputs do not faithfully communicate code's concatenation operation. No text pathway into Q-Former is shown. |
| Composition | Pass | The primary left-to-right image path is continuous. The upper query lane and lower optional-prompt lane are visually distinct and converge on OPT without collisions. |
| Modality identity | Pass | Image, learned-query tokens, prompt icon, embedding tokens, frozen model blocks, and caption document are visually separable. Token colors distinguish visual (teal) and prompt (blue) representations. |
| Typography | Pass | Main labels remain readable in the 2240 × 850 PPTX and PDF renders; Q-Former remains the visual focal point. Secondary labels are comparatively small but readable at the supplied final width. The PDF retained the required symbols and labels. |
| Phase clarity | Pass | It is an inference/generation-only route: no teacher-forcing loss, target labels, or optimizer arrows are introduced. `Autoregressive generation` and the decoded-caption endpoint establish the phase. |
| Editability | Pass | The supplied mechanical QA reports 79 native shapes, 11 native connectors, 24 native text boxes, one picture, and a 0.989 editable ratio. This supports object-level editability, but is not a measurement of human editing effort. |
| No title or footer | Pass | The inspected renders have no title, subtitle, footer, footnote, or source citation competing with the diagram. |
| Office render | Revise | The independently rendered PPTX image has no observed missing labels, clipped text, or lost token motifs. However, a magnified inspection of the frozen PDF raster shows the downward learned-query edge terminating at Q-Former with a malformed, left-facing arrowhead rather than a downward head. The PDF export therefore cannot pass as frozen, despite retained typography and otherwise consistent layout. |

## Required revision

Make the inner ordered strip the unambiguous assembly point: route the
`opt_proj`/visual-prefix edge to the left visual portion of the strip and the
prompt-embedding edge to its right prompt portion, or add a clearly labelled
merge/concatenation junction immediately before the strip. The route must make
the sequence order (visual prefix first, prompt second) legible without relying
on a reader to infer that the outer OPT container performs the assembly.

Also correct the PDF arrow-marker export and re-render. In the frozen PDF, the
query-to-Q-Former connector's head is visibly malformed; this is distinct from
the concatenation-routing defect and independently prevents export acceptance.

No other scientific defect was found in the frozen inventory. The illustrative
cat is treated as a styling asset, not an evaluation example. This review did
not compare against any author paper figure.
