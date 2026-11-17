---
name: paperfigure
description: Design, faithfully reconstruct supplied PNGs, and revise architecture figures and method overviews for AI conference and journal papers from method text, papers, code, sketches, or reference figures. Produce scientifically traceable specifications, editable PowerPoint shapes and connectors, and SVG/PDF/PNG. Use for VLM, LLM-agent, and embodied-agent architecture diagrams; not experimental data charts or presentation decks.
---

# PaperFigure

Create source-grounded paper architecture figures with native editable PPTX and
vector/raster exports. Resolve paths relative to this skill. The deterministic
renderer requires Node.js 20+ and `npm ci`; it needs no API credentials.
Understanding sources, interpreting images and composing figures run in the host
agent, not an automatic paper parser or PNG vectorizer.

## First use after installation

Resolve this skill's actual directory; do not assume it is the current project.
Before running its CLI, run `node <skill-directory>/scripts/bootstrap.mjs` to
install missing locked Node dependencies. For measured SVG/native reconstruction,
use `--with-chromium` if no usable browser is reported. `--check` inspects without
installing. See [installation.md](references/installation.md) for GitHub install
commands and optional Office/Python requirements. Setup is not a figure QA pass.

## Choose the route

- **ImageGen-first design or visual-quality revision:** read
  [image-reference.md](references/image-reference.md). Audit code/method semantics,
  and for new overviews bind the contribution plan to a version `1.1` brief. Compare
  two composition candidates within the call budget, and obtain image-only first reading before
  source-informed pixel review. Edit the best candidate within the remaining
  budget. Local appearance edits can reuse the existing reviewed plan; selected
  compositions can skip search using the documented exception.
  Only an accepted image may be frozen as a native
  reconstruction target. Do not substitute a generic `build` layout for this route.
- **New method figure:** read [design-workflow.md](references/design-workflow.md).
  Author a semantic spec separating source evidence, graph, layout and appearance;
  use `build --spec FILE --out NEW_DIRECTORY`.
- **Selected PNG → editable figure:** read
  [reference-routing.md](references/reference-routing.md) and
  [png-reconstruction.md](references/png-reconstruction.md). Freeze the selected
  PNG, module regions, allowed deviations and a source-aware typography profile
  before native authoring. Use `reconstruct --scene FILE --contract FILE --out
  NEW_DIRECTORY`. Generic `build` does not reconstruct a PNG.
- **Revision:** retain the existing route and scientific topology unless the user
  requests a scientific change. For text, alignment or arrows read
  [layout-and-arrows.md](references/layout-and-arrows.md); for icons and small
  contours read [detail-fidelity.md](references/detail-fidelity.md).

Once a supplied or generated image is selected as the target, preserve its layout,
typography, colors and details except explicit user/source-required deviations.
Switch to reconstruction; do not silently substitute a redesigned layout.
For native text reconstruction, read [typography.md](references/typography.md)
before full authoring. For generated design references or imagegen refinement,
read [image-reference.md](references/image-reference.md).

## Shared invariants

- For new overviews, material redesigns and quality assessments, use
  [quality-loop.md](references/quality-loop.md): test what an unprimed reader
  actually infers, share design roles across ImageGen/native authoring, and
  verify realistic edits on copies. Report understanding, fidelity and editing
  results separately; preserve failed and unverified outcomes.

- Before composing a new overview or materially redesigning one, freeze the reader
  takeaway, contribution emphasis and reviewed information hierarchy using
  [paper-narrative.md](references/paper-narrative.md). Separate paper mechanisms
  from implementation detail; a complete code graph is not the figure brief.
- Ground scientific modules, edges, phases, state lifetime and contribution claims
  in actual source evidence. Quote presence is not scientific entailment; invented
  relations cannot be justified by familiar method names or generated images.
- For color or visual-style selection, read [color-and-hierarchy.md](references/color-and-hierarchy.md).
  It routes to saved mechanism-specific style profiles, palette families and original
  preview examples; choose a suitable grammar rather than imposing one venue style.
- For new designs, default to solid semantic colors and no visible title, subtitle,
  footer or footnote. These defaults do not override a selected reference or an
  explicit user request. Keep provenance and uncertainty in accompanying files.
- Keep text, modules, motifs and routes native and independently editable. Never
  flatten architecture content into a full-canvas picture or outline labels.
  Declare independent illustration exceptions and remaining editability limits.
- Repair the owning spec/scene and regenerate. Preserve meaningful candidates,
  rejected outputs and accepted regression fixtures. Do not lower QA thresholds
  or change frozen references to hide differences.

## Validate and deliver

Both routes use the status contract and route-specific checks described in
[evaluation.md](references/evaluation.md). Open actual previews at publication size
and independently render the PPTX; native XML alone does not prove appearance.
Missing tools or evidence remain unverified.

Follow [visual-review.md](references/visual-review.md) for isolated source/visual
review and re-review after material changes. The reviewer must not author the
figure it accepts. Delegation runs through host tools, never the CLI. If unavailable
or disallowed, deliver a candidate marked unreviewed; do not substitute self-approval.
User rejection overrides agent acceptance.

```sh
node scripts/paperfigure.mjs qa --out OUTPUT
node scripts/paperfigure.mjs review-status --out OUTPUT
```

`qa` refreshes the route's mechanical evidence. `review-status` checks the recorded
mechanical, render and review evidence and writes the same versioned `delivery.json`
contract. All three stages must pass for delivery readiness. Hashes establish file
identity, not genuine inspection, reviewer independence or publication quality.

Link the editable PPTX, SVG, PNG preview, available PDF, spec/scene and QA/review
records. State what was source-reviewed, actually rendered, approximate or unverified.
PPTX native objects do not establish interactive Microsoft PowerPoint editing cost.

For an example, read only the closest entry in
[case-guide.md](references/case-guide.md). For corpus expansion and reuse rights,
read [paper-library.md](references/paper-library.md).
