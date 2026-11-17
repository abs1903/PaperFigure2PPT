# Source-bound readability revision

This is a local presentation revision of the same pinned automatic `learn()`
architecture, not a new scientific graph or model execution. Base:
`paperfigure/examples/voyager-agent/refinement/spec-final.json`.

## Communication brief

Takeaway: a language-model program is executed and checked in a bounded task loop;
useful successful programs become reusable skills for future prompts/execution.
Keep the central refinement workspace dominant, curriculum/state on the left,
and reusable code on the right. Preserve every node, endpoint, phase, edge kind,
source quote, scientific claim and state-lifetime assumption. Blue remains LM
computation, green retained state/library, neutral execution and data interfaces.
No image generation, author screenshots, raster illustrations or external API calls.

## Concrete changes

- Set all body/edge text to 44 px or larger at 2560 px width: at seven inches,
  the minimum is 8.6625 pt rather than v1's 7.0875 pt. Module text is 48 px.
- Replace the four-line conditional snippet with a clearly named single-line
  `craftWoodenPickaxe.js (excerpt)`: `await craftCraftingTable(bot);` exists verbatim
  in the released source. This is an excerpt, not an assertion that the whole
  skill is unconditional; the full conditional remains in the retained source.
- Retain all 12 relations. Remove repeated `Query`, `Events` and `Task outcome`
  edge labels; adjacent query/state labels and route endpoints retain meaning.
  Shorten `Top-k code` to `Top-k` beside the skill-to-program retrieval arrow.
- Shorten repeated human descriptions while retaining exact stored skill names.
  The environment still names all skills plus fixed primitives; no false
  top-k-only runtime dependency is introduced.
- Remove two rear library-card outlines, the outer workspace stroke and the
  feedback-card stroke. Keep semantic header tints, the main group, native
  Minecraft vignette and all ownership.
- Fit enlarged text with local box, row, header-rule and port adjustments.
  The failed first enlarged-font candidate remains in `output-v2/qa.json`.

## Reproduction

Run `python docs/runs/2026-11-16-skill-e2e/design/make_v2.py`, then `make_v3.py`.
Build `spec-v3.json` into a new directory with the design CLI. Independently render
with `scripts/render-check.mjs`; run `qa`, obtain independent re-review of the
actual exports, then run `review-status`. Existing v1/v2 and original examples
must remain unchanged. A successful Office render is not visual acceptance.
