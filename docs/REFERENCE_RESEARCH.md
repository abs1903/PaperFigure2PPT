# Reference implementation research

Reviewed 2026-11-15. GitHub tree API results and raw source files were inspected at
the revisions below. Full shallow clones were slow, so the investigation used
commit-pinned raw files rather than treating the README as implementation proof.
No third-party implementation or figure asset was copied into PaperFigure.

| Repository | Reviewed revision | License observed |
| --- | --- | --- |
| [figures4papers](https://github.com/ChenLiu-1996/figures4papers) | `0ddfbd3fc9892e804a3fa01ae46bd0d32617f2aa` | CC BY-NC 4.0 in root LICENSE |
| [Scientific-Figure-Design](https://github.com/qhy991/Scientific-Figure-Design) | `d88f87dad2952af3ee450873c67e95be5ae44e71` | MIT in root LICENSE; asset rights require separate review |
| [research-drawio-skill](https://github.com/QIANJINYDX/research-drawio-skill) | `8619cb9bef57a940ca1d5c54210dee87dbe067a0` | No root LICENSE present in the inspected tree; no permission inferred |

## figures4papers

Inspected `scientific-figure-making/SKILL.md`, its `design-theory.md`,
`common-patterns.md`, `demos.md`, root README/LICENSE, and
`figure_MACL/plot_overview.py`.

The skill's frontmatter selects publication-targeted Matplotlib data figures. It
explicitly avoids unrelated interactive plotting and illustration-first tools.
The entry routes to individual references; `demos.md` links actual per-paper
scripts. The inspected MACL script loads scenario data/modules, derives retention
curves, and uses shared method styles and output helpers. It does not implement
architecture reconstruction or editable PowerPoint generation.

Transfer: narrow discovery, task-specific progressive loading, source data retained
with executable examples, and consistent publication typography. Do not claim
that all repository outputs use a vector export merely because style references
recommend it: the inspected MACL example calls a PNG saver.

## Scientific-Figure-Design

Inspected root `SKILL.md`, `assets/figure-contract.yaml`,
`references/evidence-and-audit.md`, `references/drawio-production.md`, and actual
`build_drawio_figure.py`, `validate_drawio_figure.py`, `collect_arxiv_figures.py`.

The frontmatter spans many scientific-figure tasks. The entry selects corpus
mining, original design, editable Draw.io production, redesign, or visual-language
analysis. Figure Contracts organize claim, audience, evidence and publication
width before rendering. The builder validates a JSON spec, resolves layouts and
ports, constructs mxGraph XML, and supports icon provenance/palette contracts.
The validator reads actual geometry/styles, checks bounds, contrast and semantic
node overlaps among other rules. The collector retains source HTML, captions,
URLs/manifests and assets, rather than only screenshots.

Transfer: explicit evidence contract, meaningful port geometry, layout validation,
rights/provenance and an audit distinction between observation and inference.
PaperFigure narrows the task to AI architecture overviews and adds editable PPTX
as a primary output. It does not import the larger icon library or assume that
its licenses cover every supplied asset.

## research-drawio-skill

Inspected `skills/research-draw/SKILL.md`, `skills/draw-science/SKILL.md`,
`skills/add-svg/SKILL.md`, the real Protenix example's
`build_protenix_pipeline.py`, and `compare_drawio_reference.py`.

The research-draw entry coordinates an image reference with Draw.io reconstruction.
Conditional references cover layout extraction, complex glyphs, rendering and
comparison. Complex recognizable assets can remain independent SVG components;
abstract boxes/labels/edges remain native. The Protenix generator constructs
separate SVG glyphs and Draw.io output with retained reference crops. The comparison
script computes pixel MAE, RMSE, SSIM, foreground/edge IoU and region/tile diagnostics.
The tracing workflow asks for repeated comparison rounds for close reproduction.
This is useful for fidelity to a supplied visual reference; it does not by itself
establish scientific correctness or support a PowerPoint-native editability claim.

Transfer: visual reference as a proposal, independent editable reconstruction,
separate complex elements and inspected rendered outputs. PaperFigure does not
require a fixed number of image-matching iterations for original figures and does
not optimize pixel similarity at the expense of scientific structure.

## Chosen implementation

Codex interprets the actual source and records a strict JSON semantic graph.
PptxGenJS produces native shapes/text; a small OOXML pass produces grouped native
straight connector segments. A tested custom-path/attachment approach was rejected
because LibreOffice reinterpreted its routes. The delivered connectors are
intentionally unbound, so moving modules requires adjusting the route. A shared scene produces SVG and PPTX geometry.
Sharp renders PNG; PDFKit + SVG-to-PDFKit export vector PDF. Draw.io XML is an
additional editable exchange format. The offline path is deterministic and uses
no AI API. Built-in image generation was exercised once for VLM composition; the
reference was reviewed and reconstructed rather than embedded as the final figure.

Trade-offs: a shared scene limits format drift but does not guarantee identical
font rasterization. Manual explicit layouts make the MVP predictable; dense graphs
still need design work. The image-to-layout transfer is agent-directed, not a
general vectorization algorithm. Automatic checks establish mechanical invariants;
source entailment and aesthetic quality remain separate review dimensions.

Implementation API references: [PptxGenJS shapes](https://gitbrent.github.io/PptxGenJS/docs/api-shapes/),
[Sharp output](https://sharp.pixelplumbing.com/api-output/),
[Draw.io XML essentials](https://raw.githubusercontent.com/jgraph/drawio-mcp/main/shared/xml-essentials.md).
The installed PptxGenJS 4.0.1 source was also inspected: native object names use
`objectName`, and ordinary `addShape(line)` output is not a `p:cxnSp` connector.
