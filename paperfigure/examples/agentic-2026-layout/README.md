# 2026 agentic paper reconstruction and editing tests

These are attributed reconstructions of published figures, not proposed new methods
or claims about venue-level design quality. The original authors retain copyright.
Both frozen arXiv HTML snapshots link to CC BY 4.0. Sources, licenses, PDF/crop
coordinates and separate HTML-image/reference-PNG hashes are recorded per case.

| Case | Frozen primary source | Exact visual input |
|---|---|---|
| AgeMem | [Agentic Memory: Learning Unified Long-Term and Short-Term Memory Management for Large Language Model Agents](https://arxiv.org/abs/2601.01885v1), 2026-01-05, v1 | Figure 1(c), page 2, unified-management panel only; baseline panels (a)/(b) and external caption excluded |
| MemSkill | [MemSkill: Learning and Evolving Memory Skills for Self-Evolving Agents](https://arxiv.org/abs/2602.02474v1), 2026-02-02, v1 | Figure 2, page 4, entire architecture; external caption excluded |

## Deliverables

Subsequent AgeMem small-icon refinement is in `agemem/output-v15/`; see
[icon refinement](agemem/icon-refinement/README.md). It preserves the frozen
architecture and leaves the v12 two-paper test evidence intact.

Frozen two-paper layout-test outputs: `agemem/output-v12/`, `memskill/output-v12/`.
Each contains `editable.svg`, `preview.png`, native `figure.pptx`, source-linked
`layout-scene.json`, `pptx-object-map.json`, `layout-changes.json`, measured
`layout-qa.json`, `native-audit.json`, actual `native-render/` evidence, and
`comparison-original-svg.png` / `comparison-svg-pptx.png`.
`verification-final.json` records hashes and separate mechanical/editing results.
Independent source and visual reviews are under the repository's `docs/`.

Earlier immutable revisions preserve failure/debug evidence; they are not the
current delivery. `edit-test-v2/` deliberately moves a module and changes one arrow
color, width, dash/gap, head, size and cap. Its test color has no paper semantic
meaning and is not used in the delivered paper reconstruction.

Subsequent MemSkill icon/text/arrow refinement is in `memskill/output-v13/`;
see [MemSkill refinement](memskill/refinement/README.md), with separate source,
SVG/native comparison and review evidence. Frozen v12 outputs remain intact.

## Reproduce

From this skill directory (`paperfigure/`), install Node 20+ dependencies with
`npm ci`. Browser measurement needs Playwright and Chromium; the Codex bundled
runtime/system Chrome are discovered, or set `PAPERFIGURE_PLAYWRIGHT` and
`PAPERFIGURE_CHROMIUM`. Independent Office rendering needs LibreOffice on PATH
and Python PyMuPDF/NumPy. No external paid service or API is used.

```sh
# Uses frozen local PDFs; leaves source/reference.png byte-identical.
uv run --with pymupdf --with opencv-python-headless --with numpy python examples/agentic-2026-layout/extract-source.py
# Always choose a NEW output name; never overwrite the reference or prior result.
node examples/agentic-2026-layout/case-layouts.mjs output-reproduced
node scripts/layout-inspect.mjs --svg examples/agentic-2026-layout/agemem/output-reproduced/editable.svg --scene examples/agentic-2026-layout/agemem/output-reproduced/layout-scene.json --out examples/agentic-2026-layout/agemem/output-reproduced/layout-qa.json
uv run --with pymupdf --with numpy python scripts/render-layout.py --out examples/agentic-2026-layout/agemem/output-reproduced --checks
# Repeat inspect/render for memskill.
npm test
```

The source PDFs supply original text and vector coordinates, improving fidelity
and preventing font tracing. PNG-only inputs still require agent-assisted visual
reconstruction; there is no claim of an arbitrary-image automatic converter.
Source raster **icons only** are recovered as colored contour geometry; raster
math labels are explicitly replaced with editable base/subscript text. No source
text is outlined or retained as an image.

The final test and comparison command, after both candidates and both editing
tests have been independently rendered, is:

```sh
node examples/agentic-2026-layout/verify-cases.mjs output-v12 edit-test-v2
```

It creates exclusive final report/comparison files and refuses overwrites. To
repeat verification, use a fresh output name and fresh editing-test name.

## Editing and invariants

`layout-scene.json` separates logical endpoints/operations from visual geometry.
The CLI moves logical groups and reroutes incident edges, preserving topology and
semantic hashes. It fits declared centered label blocks; code/list paragraphs
retain source alignment. Every SVG line is native `<text>`; PowerPoint uses native
text blocks, editable shape paths, and native connectors. Complex icons consist
of independent native colored contour shapes, not one opaque picture.

```sh
node scripts/layout-reflow.mjs --scene examples/agentic-2026-layout/agemem/output-v12/layout-scene.json --out examples/agentic-2026-layout/agemem/NEW_EDIT --move query:12:0 --edge-style 'query-input={"stroke":"#334455","width":3,"dashed":true,"dashPattern":[10,6],"endArrow":"stealth","arrowSize":"med","lineCap":"square"}'
```

For MemSkill the tested move is `task-reward:0:12` and the styled edge is
`evaluation-to-reward`. Re-run actual rendering after edits. `--font-family Arial`
and `--font-scale 1.05` apply to declared centered label blocks. Native PowerPoint
text remains directly editable independently of these CLI operations.

## Intentional differences and limits

- User-requested solid fills replace original gradient arrows/channels. AgeMem
  input arrows have broad native shafts/heads; ornamental gradient/shadow is not
  restored. All changes are attributed reconstructions under CC BY 4.0.
- A few labels are measured/recentered with explicit padding and a bounded font
  fit. MemSkill action notation is moved 12 px left to clear an arrowhead. Side
  lanes connect aggregate/analysis at actual source-vector module boundaries.
- MemSkill's paper establishes optimization of the trainable Controller, not the
  frozen Executor. The ambiguous source reward route is explicitly resolved to
  Controller. Segmenter is an operation on an edge, not an invented visible box.
- Native math glyphs and source-matched installed fonts are approximate recovery,
  not a guarantee of the exact original embedded typeface. Small raster icons are
  ten-color contour approximations and lose some fine detail.
- Intentional source card stacks remain. Opaque-label exceptions name exact
  text/shape pairs, source PNG hash and geometry fingerprint; relative geometry
  or font changes invalidate them. Such source occlusion is not a new defect.
- Tiny transparent native port helpers are grouped with modules and excluded
  from editability denominators. Native endpoints are attached; a complex module
  drag may require CLI reflow of intermediate polyline segments. Curved bound
  native connector export and interactive Microsoft PowerPoint testing are not
  implemented. LibreOffice static rendering and scene-based editing are tested.
- Layout QA is not a subjective aesthetic score. Faithfulness to these original
  informal font choices is not a claim that either reconstruction is a new,
  publication-ready design. Independent visual findings must accompany delivery.
