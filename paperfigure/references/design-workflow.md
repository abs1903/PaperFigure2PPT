# New method figure workflow

Use this route when no selected image is the reconstruction target. Understanding
and composition run in the host agent; the CLI starts from authored JSON.

## Input to evidence

Read [method-understanding.md](method-understanding.md) for the supplied
input type. Extract inputs/outputs, computations, directed data/control edges,
temporal state, train/inference scope, and the stated contribution versus baseline.
Use the available Codex reasoning and document/browser/code tools to understand
the source. The CLI does **not** implement a natural-language model or a paper
parser. Do not claim automatic paper/code ingestion merely because a locator is
recorded. Retain exact supporting excerpts and locators in the specification.
Treat sketches as layout evidence; uncertain scientific relations need text/code
support or an explicit unresolved assumption. Ask only about material ambiguities.

## Specify and design

For a new overview or material redesign, apply
[paper-narrative.md](paper-narrative.md) before layout. The source audit may be
more detailed than the figure; review the chosen abstraction and retain the
disposition of omitted implementation details instead of drawing every code step.

If the requested workflow is ImageGen-first, finish the image-stage review/edit
loop in [image-reference.md](image-reference.md) before native rendering. A semantic
spec does not require an early `build`; it can feed the reviewed communication
brief directly. A selected accepted PNG then uses the reconstruction route.


Read [design.md](design.md) before composing the figure, and
[specification.md](specification.md) when writing a specification.
`references/figure.schema.json` (relative to the skill root) is the machine contract.
`examples/*/spec.json`
are executable examples, paired with the original natural-language `method.md`.
Choose the closest case using [case-guide.md](case-guide.md).

Write a project-local spec with stable node/edge IDs and source excerpts. Keep
`nodes`, `edges`, `groups`, and `claims` independent of `layout` and `visual`.
Never infer a missing mechanism from a familiar model name or generated image.
Classify feedback explicitly; a state-update arrow is not an optimizer update.
Highlight `proposed` components only when the source states the contribution.

Default to **no visible title, subtitle, footer, or footnote**. LaTeX supplies the
caption. Keep source/assumption/provenance explanations in files. Use meaningful
module labels and local edge labels instead of a footer legend. Typography is
adjustable through `visual.typography` and per-node `layout.nodes.ID.fontSize`.
Use **solid fills only** by default: no gradients, glow, glossy shading or 3D
color effects. Keep earlier gradient studies as history, not current templates.
Every schematic color must encode a named scientific role or state. Record the
palette-to-meaning mapping before rendering, reuse colors for equivalent roles,
and remove unexplained distinctions. Keep labels or shapes as redundant cues;
see the semantic-color rules in `design.md`.
Prefer English labels for this MVP's verified font path unless requested otherwise.

Obtain the independent semantic pass before writing an image-generation prompt;
function arguments are not proof that an input reaches the returned output.
For image generation or imagegen-quality complaints, read
[image-reference.md](image-reference.md). Study actual author figures
when comparison is in scope; distinguish paper-level story from code detail.
Write a source-bound communication brief (takeaway, mechanism, composition, exact
text budget, semantic palette, node/edge-to-visual mapping) before prompting.
`reference-prompt` requires both `--spec` and `--brief`; a semantic graph is not
art direction. Refine by attaching the best candidate and editing one concrete
defect class with explicit invariants; preserve prompt/input/output hashes,
compare regressions and roll back worse edits. Obtain isolated image-stage review
before freezing a PNG for native reconstruction. A revised prompt alone does not
prove improved visual quality.
Use the host's built-in image generation if available and within user scope;
use it for composition, never to authorize new modules or relations. Do not call
paid external APIs or request API keys as a fallback. Without image generation,
use the same local renderer and reference design principles.


Continue with the shared checks and delivery commands in [evaluation.md](evaluation.md).
