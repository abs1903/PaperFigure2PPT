<h1 align="center">PaperFigure</h1>

<p align="center"><strong>Research figures you can actually edit.</strong></p>
<p align="center">A Codex skill for source-grounded paper overviews, designed with ImageGen<br>and delivered as native PowerPoint shapes, text and connectors.</p>

<p align="center">
  <a href="#examples">Examples</a> ·
  <a href="#install">Install</a> ·
  <a href="#how-it-works">Workflow</a> ·
  <a href="paperfigure/SKILL.md">Skill</a> ·
  <a href="docs/USAGE.md">Reference</a>
</p>

## Examples

These figures use the current image-first workflow: source and contribution planning,
ImageGen design, isolated review, then faithful native reconstruction. The previews
below are **actual LibreOffice renders of the downloadable PPTX files**. Click any
figure to inspect it at full resolution.

### CLIP · Alignment becomes a classifier

A cross-modal pairing matrix makes the learning objective visible; a separate
zero-shot region shows how language descriptions define the classes.

<a href="docs/runs/2026-11-17-clip-showcase/output-v2/native-render/preview.png"><img src="docs/runs/2026-11-17-clip-showcase/output-v2/native-render/preview.png" width="100%" alt="CLIP: paired image and text alignment with a symmetric contrastive objective, followed by zero-shot classification using the same encoders."></a>

**[PowerPoint](docs/runs/2026-11-17-clip-showcase/output-v2/figure.pptx)** · [SVG](docs/runs/2026-11-17-clip-showcase/output-v2/editable.svg) · [PDF](docs/runs/2026-11-17-clip-showcase/output-v2/native-render/figure.pdf) · [Source & review](docs/runs/2026-11-17-clip-showcase/REPORT.md)

---

### Agentless · Narrow the search, focus the edit

A narrowing repository funnel exposes hierarchical localization. The enlarged edit
window makes localized Search/Replace distinct from unconstrained planning.

<a href="docs/runs/2026-11-17-agentless-native/output-v2/native-render/preview.png"><img src="docs/runs/2026-11-17-agentless-native/output-v2/native-render/preview.png" width="100%" alt="Agentless: repository-to-edit-location localization funnel, focused context for local Search/Replace, and candidate patch selection."></a>

**[PowerPoint](docs/runs/2026-11-17-agentless-native/output-v2/figure.pptx)** · [SVG](docs/runs/2026-11-17-agentless-native/output-v2/editable.svg) · [PDF](docs/runs/2026-11-17-agentless-native/output-v2/native-render/figure.pdf) · [Source & review](docs/runs/2026-11-17-agentless-native/REPORT.md)

---

### MAE · Encode less, reconstruct the full image

The sparse encoder lane expands only after mask tokens are inserted. A separate
objective inset preserves the distinction between full prediction and masked-only loss.

<a href="docs/runs/2026-11-17-mae-high-quality/output-v2/native-render/preview.png"><img src="docs/runs/2026-11-17-mae-high-quality/output-v2/native-render/preview.png" width="100%" alt="MAE: four visible patches enter the encoder, twelve learned mask tokens join afterward, and a lightweight decoder predicts all patches with masked-only MSE."></a>

**[PowerPoint](docs/runs/2026-11-17-mae-high-quality/output-v2/figure.pptx)** · [SVG](docs/runs/2026-11-17-mae-high-quality/output-v2/editable.svg) · [PDF](docs/runs/2026-11-17-mae-high-quality/output-v2/native-render/figure.pdf) · [Source & review](docs/runs/2026-11-17-mae-high-quality/REPORT.md)

All three cases retain native text, shapes and connectors with **zero embedded
pictures**. Source, actual-render and independent-review evidence are recorded for
each output. These are author-informed explanatory designs, not new experimental
results or claims to outperform the original paper figures.

Earlier ReAct, Reflexion, Voyager, BLIP-2 and LLaVA studies remain available in the
[case archive and technical reference](docs/USAGE.md#examples).

## Install

Requires Node.js 20+ and npm. Clone the repository, then run:

```bash
git clone https://github.com/abs1903/PaperFigure2PPT.git
cd PaperFigure2PPT
npm --prefix paperfigure ci
node paperfigure/scripts/install.mjs
```

Follow the dependency command printed by the installer, start a new Codex chat,
and invoke `$paperfigure`. Existing installations are protected from overwriting.
See [custom destinations and dependencies](docs/USAGE.md#install-in-codex).

Image generation uses the host's built-in tool when available; no external provider
API is called silently. Independent PowerPoint verification requires LibreOffice.
Deterministic native authoring is also available without image generation.

## Try it

> Use $paperfigure to read this paper and its official code, identify the central
> contribution, and design a clear method overview. Compare two visual compositions,
> review the generated image independently, then deliver an editable SVG and PPTX
> with an actual Office render. Keep the figure free of an overall title or footer.

For a supplied figure, ask to preserve its design while reconstructing native
editable elements. Text, modules and connectors remain editable; exact font identity
and interactive Microsoft PowerPoint behavior are not guaranteed by an Office render.

## How it works

**Sources → contribution plan → ImageGen candidates → isolated review → native SVG/PPTX → Office render → final review**

The paper story determines what gets visual emphasis. ImageGen explores the design;
the reviewed image is then frozen as a reconstruction target. SVG and PPTX are
built from the same authored scene, inspected and independently rendered.

The shared `delivery.json` gate separates **mechanical**, **render** and **review**
status. Every stage must pass before an output is marked ready. Rejected candidates,
source evidence and earlier versions are retained alongside the accepted files.

This is an agent-assisted skill, not a one-command paper parser or automatic PNG
vectorizer. See the [skill entrypoint](paperfigure/SKILL.md),
[image-first workflow](paperfigure/references/image-reference.md),
[native reconstruction](paperfigure/references/png-reconstruction.md) and
[CLI / verification reference](docs/USAGE.md).

## License

Original implementation: [MIT](LICENSE). Paper text, official source snapshots,
fonts and author figures retain their respective rights; each case records its
provenance. Displayed showcase figures use newly authored schematic artwork.
