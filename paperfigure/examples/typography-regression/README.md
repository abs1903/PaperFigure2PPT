# Controlled typography and reference-route regression

This is a four-label software test fixture, not a paper architecture figure.
It covers source-style Times New Roman bold, Comic Sans MS, Verdana bold recovered
from the PDF face name `Verdana-Bold`, and Arial. No fonts are redistributed.

`build.mjs` explicitly normalizes known face/family names, fits native text and
freezes a profile. `output-v1/` includes editable SVG/PPTX, the profile, actual
Office/PDF rendering and final typography QA. All four families are observed in
actual output, including `Skill description` in `Verdana-Bold` after normalization.

The accepted historic AgeMem/MemSkill artifacts are separate immutable baselines
under `assets/typography/`. Their appearance is preserved. Old MemSkill's requested
`Verdana-Bold` family is a detected historic fallback, not an approved waiver for
future font gates.

Run from `paperfigure/`, always choosing a fresh output directory:

```sh
node examples/typography-regression/build.mjs NEW_OUTPUT
uv run --with pymupdf --with numpy python scripts/render-layout.py --out NEW_OUTPUT --checks
node scripts/typography-profile.mjs --out NEW_OUTPUT --profile NEW_OUTPUT/typography-profile.json --report NEW_OUTPUT/typography-qa.json
```

The selected PNG/profile in `reference-contract.json` are a controlled roundtrip
source generated from the known fixture, not an unrelated reference substituted
for a failed paper reconstruction. `roundtrip-output/` exercises the real
`paperfigure.mjs reconstruct` CLI and exact contract/profile copying. Its delivery
must remain unready without an actual independent visual review; no acceptance is
fabricated for this integration fixture.
