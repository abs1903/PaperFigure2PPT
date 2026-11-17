# Three real agent papers: solid semantic-color figures

## Deliverables and source scopes

| Paper | Pinned official source | Current figure |
| --- | --- | --- |
| ReAct, ICLR 2023 | [ysymyth/ReAct](https://github.com/ysymyth/ReAct), `6bdb3a1fd38b8188fc7ba4102969fe483df8fdc9`; HotpotQA notebook `webthink` | `paperfigure/examples/react-hotpotqa/output-reviewed/` |
| Reflexion, NeurIPS 2023 | [noahshinn/reflexion](https://github.com/noahshinn/reflexion), `218cf0ef1df84b05ce379dd4a8e47f17766733a0`; HotpotQA `ReactReflectAgent`, REFLEXION strategy | `paperfigure/examples/reflexion-hotpotqa/output/` |
| Voyager | [MineDojo/Voyager](https://github.com/MineDojo/Voyager), `55e45a880755d0c8c66ca7fb5fe7962ac8974f89`; automatic `learn()` loop | `paperfigure/examples/voyager-agent/output-reviewed/` |

Each current directory contains native editable PPTX, SVG/PDF/PNG, a Draw.io file,
source specification/scene, mechanical QA and independent Office/PDF render checks.
All three figures have zero picture elements. Fonts, modules and individual logical
edge groups can be edited; connector endpoints do not auto-follow moved modules.

BLIP-2 now also has an independently accepted solid-fill version:
`paperfigure/examples/blip2-opt-code/output-solid/`. Its graph is unchanged from the
accepted semantic-color revision. Historical gradient candidates remain archived
and are not current templates.

## Scientific color and style

Every current figure uses solid fills, never gradients, glow or 3D shading. Across
these three agent cases: blue means language-model computation, green retained
context/state, neutral gray-white tools/runtime, parameter-free checks or I/O.
Equivalent roles share colors. Lifetime is stated locally and is not conflated:
ReAct prompt/record state lasts within one question; Reflexion memory lasts across
attempts in the same agent; Voyager skills are persistent executable code/description
entries. Colors do not represent model trainability in these diagrams.

No actual figure has a title, subtitle, footer, footnote or legend. The gallery and
comparison sheet labels sit outside the figure images and are not exported inside
the PPTX. Necessary scientific conditions use readable local labels. Text has a
minimum computed 7.2 pt at seven-inch publication width. Actual target-column size
may require a new layout rather than simple scaling.

## Comparison with author illustrations

| Case | Original source inspected after initial native freeze | Author communication | Our communication and limitations |
| --- | --- | --- | --- |
| ReAct | [Author camera-ready preprint](https://arxiv.org/pdf/2210.03629), Figure 1(1d), PDF p.2 | A concrete successful Thought/Action/Observation trajectory, search refinements, evidence highlights and comparison with baselines | A bounded notebook-loop architecture with explicit prompt/step-record state, dispatch and forced-empty exhaustion. It does not reproduce the example outcome, evidence highlights or baseline comparison. |
| Reflexion | [NeurIPS paper](https://proceedings.neurips.cc/paper/2023/file/1b44b878bb782e6954cd888628510e90-Paper-Conference.pdf), Figure 2(a), PDF p.4 | Generic Actor/Evaluator/Self-reflection/short-term trajectory/long-term experience framework and separate pseudocode | A specific HotpotQA branch using parameter-free normalized exact match, failed finished/halted attempts and caller-triggered next run. This branch does not require the generic figure's evaluator to be an LM. Shared task inputs and token/step halt details are not all separately wired. |
| Voyager | [Author preprint](https://arxiv.org/pdf/2305.16291), Figure 2, PDF p.2 | Pictorial curriculum examples, executable code, Minecraft feedback, self-verification and a library of named skills | A source-level routing overview separating queried prompt code from all saved runtime programs/primitives and success-conditioned registration. It omits concrete skill/code/game screenshots and the explicit latest-events wire into curriculum; that input is named locally. |

The author diagrams are not failed attempts at our narrower task. ReAct's original
is a trajectory demonstration rather than a like-for-like architecture chart.
Reflexion's framework covers more task/evaluator variants. Voyager's illustrations
make the world and learned behaviors more tangible than our abstract runtime card.
Conversely, our artifacts expose the configured interfaces and retain editable
source. No numeric aesthetic ranking, performance result, or universal superiority
is inferred from the comparison sheets.

OpenReview PDF access returned HTTP 403/browser verification for ReAct and Voyager;
comparison uses the authors' arXiv PDFs instead. Reflexion uses the conference PDF.
The exact downloaded PDF SHA-256, page, crop and local comparison scope are recorded
in ignored `dist/agent-papers-comparison/provenance.json`. No author image/PDF is
bundled in the skill: reuse rights were not established. Selected source code
retains its original MIT notices and license, separately from paper-figure rights.

## Isolated review and revisions

Each case received a fresh isolated source reviewer, followed by inspection of
native PNG, independently rendered PPTX and separately rasterized source PDF.
The first complete figures/specs were frozen before visually viewing author figures
within this run. Model prior knowledge and textual search snippets are uncontrolled;
this is not a fully blind held-out study or automatic paper-ingestion benchmark.

- ReAct initial review requested the exact seven-step cap and forced-empty exit
  to be visible. The reviewed revision adds local labels without inventing a new
  mechanism. It was authored before parent author-image inspection. Original
  frozen spec and `revise` review remain intact.
- Reflexion passed the initial frozen native layout, with scoped review caveats.
- Voyager initial review rejected ambiguous `State + task history` wording because
  the explicit latest-events input wire was omitted. The revised local label is
  `Latest events + history`, supported by the corresponding source call. This
  wording correction followed parent author-image inspection and is disclosed.
- BLIP-2 solid revision removes gradients from the prior accepted semantic-color
  figure; its scientific nodes/edges are unchanged.

Final review records are hash-bound; modifying an inspected figure invalidates
acceptance. Accepted reconstruction/source review is not human approval or a
certification of venue-level aesthetic quality.

Review records:

- [ReAct source audit](REACT_CODE_AUDIT.md), [initial visual audit](REACT_VISUAL_REVIEW.md), [final review and author comparison](REACT_FINAL_REVIEW.md).
- [Reflexion source audit](REFLEXION_CODE_AUDIT.md), [visual review and author comparison](REFLEXION_VISUAL_REVIEW.md).
- [Voyager source audit](VOYAGER_CODE_AUDIT.md), [initial visual audit](VOYAGER_VISUAL_REVIEW.md), [final review and author comparison](VOYAGER_FINAL_REVIEW.md).
- [BLIP-2 solid-fill review](BLIP2_SOLID_REVIEW.md).

## Verification

`test-results-agent-papers.txt` records **46/46 tests passed**, zero skips/failures,
about 6.5 seconds under a 30-second budget. New tests verify the three cases'
source hashes, semantic palette membership, zero image assets, native editability,
absence of SVG/PPTX gradients and title/footer flags. Another test verifies that
the BLIP-2 solid revision retains scientific sources, claims, nodes and edges.
Existing tests include actual PDF downward-arrowhead raster regression.

| Case | Nodes / logical edges | Native shapes (includes text) | Native text boxes | Native connector segments | Pictures |
| --- | --- | --- | --- | --- | --- |
| ReAct reviewed | 7 / 8 | 27 | 19 | 12 | 0 |
| Reflexion | 6 / 8 | 25 | 19 | 16 | 0 |
| Voyager reviewed | 5 / 11 | 27 | 22 | 25 | 0 |

All current cases have zero mechanical errors, no reported edge crossings/shared
segments, source-PDF text complete, and Office/PDF route checks passed. Each retains
one expected analytic-font warning: estimates use Helvetica metrics, while actual
serif rasters were inspected. Native-object ratio is 100% by count for these cases;
it is not a measure of scientific fidelity, visual quality or editing time.

No source-agent code was imported or executed. No model API, weights, Minecraft or
external task environment ran. Parameter updates, paper performance reproduction
and interactive Microsoft PowerPoint edit cost remain unmeasured. Figure structure
and local rendering are reproducible from retained code/specs; binary hashes can
vary with timestamps/runtime/fonts and new exports need fresh independent review.

Reproduction commands are in
`paperfigure/examples/agent-papers/README.md`. The batch renderer takes a new output
root and refuses existing nonempty results. The new solid-only rule is in SKILL.md,
design.md and the generated image-reference prompt, not just in these examples.

The current `npm run examples` entry was exercised successfully against a fresh output
root (all three builds mechanically passed); repeating against that nonempty root
correctly refuses to overwrite it. All 27 initial frozen artifact hashes remain
unchanged. `dist/paperfigure-solid-agent-papers.zip` contains the installable skill,
current reviewed exports and reports, with ZIP integrity verified and no author
figure assets or node_modules bundled.
