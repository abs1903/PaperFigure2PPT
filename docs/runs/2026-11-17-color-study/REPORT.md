# Recent-paper visual styles and matched CLIP paint study

## Saved skill resources

**Both palette variants are independently accepted and `deliveryReady: true`. The source-derived style pack is accepted in the [independent audit](rootstyle-study-review.md).**

The user requested learning from recent ICLR 2026 and other top-conference paper figures, then explicitly requested preserving the illustration styles inside the skill. The result is a self-contained original visual-style library, rather than a list of uncontextualized hex values:

- [Selection and source guide](../../../paperfigure/references/color-and-hierarchy.md): inspected figure locations, role/surface/ink distinctions, counterexamples and adaptation workflow.
- [Four visual grammars](../../../paperfigure/assets/visual-styles.json): role surfaces, token continuity, focus/detail and line-first. Each records mechanism fit, composition, glyph/icon vocabulary, typography, connector treatment, unsuitable uses and primary sources.
- [Four optional palette families](../../../paperfigure/assets/palette-families.json): soft-dual, plum-sage, line-first and token-categorical. These are newly authored syntheses, not recovered source palettes or venue standards.
- [Original preview provenance](../../../paperfigure/assets/styles/provenance.json): four exact project-authored Office renders, bundled inside the skill. Line-first remains a source-linked profile without a claimed new accepted project exemplar.

The compact SKILL.md links to the guide. Existing `themes.json`, prompt compilation, schemas, original accepted artifacts and native renderer implementation remain unchanged. New-brief treatment uses existing palette meanings, block representations and typography fields, not a new runtime API. The development source index is optional provenance; the installed skill contains the actual profile descriptions and its own image previews.

## Actual reference sample

[Source index](sources.json): **18 distinct papers attempted, 20 logical download attempts, 16 full papers inspected: 12 ICLR 2026 and 4 CVPR 2026 main-conference papers.** MotionStream and U-Mind failed twice each (timeout/incomplete transfer), then UltraMemV2 and FedAFD replaced them within the same venues. Failures and replacement relationships remain recorded; they are not counted as inspected.

Sources were selected for architecture/method diversity and availability, not randomly, exhaustively or by award rank. Accepted conference status was checked against the official ICLR index or CVF proceedings. Automatic caption selection initially suggested some charts/teasers; the final method observations use LaVer Figure3/page4, MemoryVLA Figure2/page4 and MoAlign Figure2/page5. Actual selected pages and contact sheets were opened; citations identify the actual inspected figure. The independent review preserves its earlier chart observation as a counterexample, rather than relabeling it a method figure.

Local PDFs/pages/contact sheets are retained under Git-ignored `local-corpus/`. The repository distributes source URLs/hashes and original written observations, not author artwork. The skill preview images are our own schematic figures, with separate provenance. No permission to reuse source paper illustrations is implied.

## What was learned

A useful recurring distinction is **role hue versus colored area**. The same modality can be carried by token/glyph color, a thin border, an accent route or a pale model surface. It need not fill a large module and phase banner with saturated paint. Dark structural ink on light support surfaces often leaves more visual emphasis available for the focal relation.

There is no single “2026 conference style.” MemAgent is a mostly line-based counterexample; LaVer and UltraMemV2 use localized dark blocks; MetaEmbed uses vivid token planes; some memory/video figures are dense. The saved profiles retain these differences rather than universally banning white text, dark fills or saturated hues. Mechanism, source semantics and publication-size reading determine the choice. No venue-wide prevalence, reader-performance or aesthetic superiority claim is made.

## Matched native palette experiment

Baseline: [accepted current CLIP native Office render](../2026-11-17-clip-showcase/output-v2/native-render/preview.png).

- [A: soft blue/green with warm pairing accent](clip-soft-dual/native-render/preview.png) — [PPTX](clip-soft-dual/figure.pptx), [SVG](clip-soft-dual/editable.svg), [PDF](clip-soft-dual/native-render/figure.pdf)
- [B: plum/sage with amber pairing accent](clip-plum-sage/native-render/preview.png) — [PPTX](clip-plum-sage/figure.pptx), [SVG](clip-plum-sage/editable.svg), [PDF](clip-plum-sage/native-render/figure.pdf)
- [Original/A/B comparison](clip-palette-comparison.png)

The new user-authorized revisions change **paint only**: path/text fill, path/connector stroke, and source/title bindings. All text literals, fonts/sizes, coordinates, shapes, grouping, counts and scientific topology compare identical to the accepted native scene. Each source directory contains `paint-invariance.json`. This is an isolated comparison of color treatment, not a new composition, ImageGen edit, new scientific paper case or model execution. No ImageGen calls were needed for editing the existing native vector assets.

The paired targets retain their warm highlighted 3×3 diagonal; image/text families remain consistent through both phases; light model surfaces now use dark text, and phase captions are neutral. Original semantic/source audits still apply. These revisions do not resolve any layout or font-size limitation because those fields deliberately stayed fixed.

Each contract references the actual approved baseline native preview and explicitly authorizes the new palette, rather than asserting unchanged-color fidelity. New typography profiles bind the changed text fills. Each output was independently rendered through LibreOffice → PDF → MuPDF, with actual-font, measured layout, native XML/object-map and route checks. Both have zero embedded pictures/media and preserve the baseline's 30 text lines and native object counts. Independent final palette/fidelity verdicts and the shared delivery states are output-local.

## Validation and limits

A bounded [native-ink diagnostic](centered-label-contrast.json) compares only centered labels on their exact solid module surfaces: the minimum luminance contrast is 2.51 for the original treatment, 10.16 for A and 10.79 for B. This checks the known paint pairs, not all text, rendered occlusion, reader performance or aesthetic quality; actual Office review remains required.

[Library QA](library-qa.json) checks four profiles, four palette families, four original preview files/hashes, source counts and local links. Skill Creator's `quick_validate.py` passes; the case authoring JavaScript parses. No renderer/compiler behavior changed, so no unrelated unit-suite batch was repeated. Actual Office rendering and typography/layout/native checks pass for both variants; isolated review separately evaluates readability, role semantics and reference geometry under the explicit paint exception.

Exact source font identity and interactive Microsoft PowerPoint editing remain unverified, as in the baseline. The palette families are not accessibility certifications; reading against actual surfaces and redundant semantic cues remain required. Any preference for A or B is qualitative and does not prove a general quality gain across papers. Original accepted figures and their reviews remain immutable.
