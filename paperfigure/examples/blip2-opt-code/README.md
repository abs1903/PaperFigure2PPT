# BLIP-2 OPT: official-code reconstruction

A new real-paper case, based on the official Salesforce LAVIS implementation,
not a re-skin of the LLaVA graph. The target is `pretrain_opt2.7b` caption
`generate()`, not BLIP-2's complete pretraining framework.

- Paper: [Li et al., ICML 2023](https://proceedings.mlr.press/v202/li23q.html).
- Code commit: `05cb670f47296522e24e7727e366b4a997d28582`.
- Evidence: selected original source files under `source/`, their retained BSD-3-Clause
  license and `source-manifest.json`. These third-party files are not relicensed
  under the project's MIT license.
- Current deliverable: `output-solid/figure.pptx`, `.svg`, `.pdf`, `.png`
  and a secondary `.drawio` export; `preview.png` is the smaller preview.
  Draw.io currently omits the input-photo crop viewport and is not part of the
  verified visual deliverable. Use PPTX/SVG/PDF/PNG for the reviewed appearance.
- Current source: `spec-solid.json`; full reproducible construction uses both
  Python scripts below. Font sizes/family and all module geometry remain editable.
- `palette-contract.json`: blue = frozen parameter modules; gold = source-default
  trainable parameter modules/learned queries; gray-white = interfaces, operations
  and activations. Color is not assigned by arbitrary module identity.

Run from the repository root (Python 3 stdlib; Node 20+):

```bash
npm --prefix paperfigure ci
python3 paperfigure/examples/blip2-opt-code/make_spec.py
python3 paperfigure/examples/blip2-opt-code/make_spec_reviewed.py
python3 paperfigure/examples/blip2-opt-code/make_solid.py
python3 paperfigure/examples/blip2-opt-code/verify_case.py
node paperfigure/scripts/paperfigure.mjs build \
  --spec paperfigure/examples/blip2-opt-code/spec-solid.json \
  --out /tmp/my-new-blip2-output
node paperfigure/scripts/render-check.mjs /tmp/my-new-blip2-output
```

The renderer refuses existing destinations by default. Use a new destination.
Independent review records apply only to exact reviewed artifact hashes; a new
render is mechanically checked but requires a new visual review.

## Reconstruction protocol and revisions

The source graph and first complete native figure were frozen **before visually
viewing any author diagram in this run**. `semantic-freeze.json` records the
initial 10-node/9-edge graph. `initial-figure-freeze.json` hashes the original
`spec.json`, generator, SVG/PPTX/PDF/PNG and independent Office raster. That is a
figure-hidden run, not a controlled held-out benchmark: model prior knowledge
and textual web search snippets were not excluded.

`output-initial/` and `output-v1/` preserve initial text-layout failures. `output/`
is the first mechanically valid frozen figure. Independent review rejected its
ambiguous input routing, and PDF inspection revealed a wrongly oriented arrowhead.
`output-final/` only fixes the PDF exporter; its name does not denote acceptance.
`output-reviewed/` makes actual parameter-free `torch.cat` a separate 11th node,
with an additional edge into OPT. `output-semantic-color/` adds the user's semantic
palette requirement; `output-solid/` then removes every gradient and is the current
candidate. Only `output-solid/` should
be used as the current deliverable. Earlier versions remain evidence, not defaults.

The final display graph was revised after viewing Figure 3. Do not describe the
final artifact as entirely pre-author or claim the source diagram was independently
invented without any prior exposure. The initial freeze remains unchanged.

## Comparison and limitations

The closest author view is Figure 3's **top** decoder-based branch (paper page 4).
The full figure also includes an encoder-decoder branch. Its scope is second-stage
pretraining; ours is a configured inference route. These are related, not identical
communication tasks. See `docs/BLIP2_COMPARISON.md` at the repository root.

Author artwork is not included in this installable case. Reuse rights were not
established; the local analysis crop/contact sheet stays in ignored `dist/`.
The source PDF is linked, not redistributed. Our architecture is newly constructed
from native text/shapes/connectors and uses only an independent generated input
photo crop. No author illustration is embedded in its PPTX or vector exports.

No weights, model dependencies, optimizer or inference run was executed. This
verifies source topology and declared parameter states, not runtime performance.
Native connectors preserve segments but do not auto-follow moved modules.
Microsoft PowerPoint interactive editing and human editing time remain unmeasured.
