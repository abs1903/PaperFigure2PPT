# Voyager: ImageGen-first design, isolated review and attached-image edits

Date: 2026-11-16. The user requested code-grounded image design and iterative
isolated review before SVG/PPTX reconstruction. This run uses the host's built-in
ImageGen tool. No external provider API, model execution, simulator run or paid
API fallback was used.

## Current outcome and boundary

[The selected design PNG](selected-reference.png) passed
[independent image-stage review](image-review-v4.md). A small source-registered
native sample also passed [a separate narrow review](native-sample-v2/native-sample-review.md).
**The complete figure has not been rebuilt as SVG/PPTX. Final delivery is unready.**
See [image-stage.json](image-stage.json) for this explicit state.

The implemented skill route is:

`raw source code → independently reviewed semantics/brief → ImageGen candidate →
isolated pixel review → actual attached-image edits/re-review → selected reference
→ small native sample → full reference inventory/reconstruction → actual Office
render and independent full-native review`.

The first seven stages were exercised here, including actual Office rendering of
the partial sample. Complete-figure inventory, reconstruction and final review
remain downstream. The CLI does not itself call ImageGen or spawn reviewers; the
host agent orchestrates those stages using the skill.

## Source and communication contract

The semantic spec is the pinned Voyager automatic `learn()` overview at commit
`55e45a880755d0c8c66ca7fb5fe7962ac8974f89`, with seven semantic nodes and twelve
relations. [The initial source audit](source-audit.md) and
[focused amendment](source-audit-v2.md) retained the source-bound topology and made
successful deposit-cleanup exclusion explicit. The exact initial audited inputs
are preserved as `source-brief-v1.json` and `source-prompt-v1.txt` with matching
original hashes; no image call used that rejected pre-amendment prompt.

[The original brief](design-brief.json) separates reader takeaway, composition,
mechanism, exact text, semantic palette and node/edge-to-visual mapping. It does
not copy the old hand-authored native layout. Meaningful task/world/skill motifs
replace an exclusively box-and-wire communication style. Author Figure 2 was
inspected as a scoped comparison, so no blindness claim is made; author artwork
was not an ImageGen input. Task examples are illustrative, not a fixed observed
curriculum or a new execution result.

## Actual ImageGen and review rounds

| Candidate | Actual operation | Isolated verdict | Evidence and next action |
| --- | --- | --- | --- |
| [v1](candidate-v1.png) | New generation from [compiled prompt](prompt-v1.txt) | Revise | Scientific topology passed; shaded/texture-heavy motifs and field washes failed the flat-native brief. [Review](image-review-v1.md). |
| [v2](candidate-v2.png) | V1 actually attached; [style-only delta](prompt-v2.txt) | Revise | Geometric motifs/native feasibility improved; curriculum mistakenly became green and fields still graded. [Review](image-review-v2.md). |
| [v3](candidate-v3.png) | V2 actually attached; [palette/fill delta](prompt-v3.txt) | Revise | Ownership corrected, but visible field washes remained. [Review](image-review-v3.md). |
| [v4](candidate-v4.png) | V3 actually attached; [white-field/heading-ink delta](prompt-v4.txt) | Accept for image design | Pure white surfaces and consistent dark blue/green heading ink resolved the remaining blocker. [Review](image-review-v4.md). |

This was one initial generation and three purposeful edits, then a stop. Each edit
used the actual prior PNG through `referenced_image_paths`; it was not an unrelated
fresh generation described as an edit. The final change of color channel is
explicit in [the V4 appearance brief](design-brief-v4.json): blue heading ink = LM
computation; green = retained state/library/storage; neutral = execution and prompt
assembly. No scientific claim, text, route or geometry change was authorized.

[rounds.json](rounds.json) is the mutable history index. Each review binds an
immutable `generation-record-vN.json`, the actual PNG, spec, applicable brief and
submitted prompt. All candidates, rejected reviews and source amendments remain
available. Noncritical deviations are documented: a conventional code-excerpt
ellipsis outside the literal whitelist and a compact lower annotation band.
There is no claim of universal aesthetic superiority or human user approval.

## Partial native feasibility evidence

[native-sample-plan.json](native-sample-plan.json) records the sampled source
regions. The sample includes only one log icon, one small code line and part of
the lower Refine/Verify/Store junction; the rest of the canvas is intentionally
blank. It is not a substitute reconstruction of the complete figure.

- [Partial editable SVG](native-sample-v2/editable.svg),
  [partial PPTX](native-sample-v2/figure.pptx),
  [actual Office raster](native-sample-v2/native-render/preview.png).
- Twenty native content objects: eleven shapes, five native connector segments
  and four text boxes; no pictures/media. Six transparent connection helpers and
  semantic groups are excluded from that content denominator.
- Actual Chromium glyph/layout checks, native XML audit, isolated LibreOffice →
  PDF rendering, connector/centered-text checks and rendered-font verification
  passed. Arial Bold and Courier New Bold were observed in the actual PDF.
- V1 of the sample is retained; V2 fixes code weight and diamond layering after
  direct source comparison. These are local sample fits, not a figure redesign.
- Font identity from generated pixels remains approximate. The 25.5-px code-size
  choice would be about 6.91 pt at seven inches; this partial fit is not acceptance
  of a global 9-pt final typography plan. Full typography calibration is pending.
- The sample does not include the complete success-exception annotation, every
  return path, all task/library icons or the full world scene. It cannot establish
  complete-figure fidelity, layout or Microsoft PowerPoint interactive editability.

The independent sample verdict accepts feasibility only. Both sample output
folders retain `deliveryReady: false`.

## Frozen target and next stage

[selected-reference.json](selected-reference.json) binds the selected PNG and
actual review hashes. [spec-target.json](spec-target.json) marks it as a target:
`build` was actually tested and refused generic relayout before creating output;
see [the route-guard log](target-route-guard.log).

Before complete native authoring, inventory all original visible text, modules,
icons and routes, then freeze the complete reference contract and typography
profile. Rebuild the selected image faithfully. A material design change returns
to ImageGen/review; compact lower routing is not permission for an unrequested
SVG redesign. Full Office/PDF and independent native acceptance must be newly
obtained for those complete artifacts.

## Skill changes and checks

`paperfigure/SKILL.md` now explicitly routes ImageGen-first design and visual-quality
revision into `references/image-reference.md` before native rendering. The reference
spells out isolated pixel review, attached-image edits, bounded stopping, target
freeze and separate native acceptance. `design-workflow.md` clarifies that a
scientific spec can feed this route without an early `build`.

Skill validation, changed-reference links, `git diff --check`, selected-target
schema validation and the actual generic-build refusal check passed. Per-review
hash references are verified in [review-hash-verification.json](review-hash-verification.json).
