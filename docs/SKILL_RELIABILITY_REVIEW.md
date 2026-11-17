# Skill reliability review: reconstruction binding and typography

Date: 2026-11-16  
Scope: independent review of the current PaperFigure Skill hardening. LATS figure
design/refinement is suspended by `examples/lats-hotpotqa/STATUS.md`; no LATS
candidate is accepted or delivered here.

## Verdict

**Revise the reconstruction contract once more before treating it as closed.**

The two prior failures are substantially improved:

- An anchor-bearing module absent from the reference ledger now produces
  `uninventoried-reference-module`.
- A geometry exception is constrained to a center delta no greater than 10% of
  the original smaller side (capped at 20 px) and width/height deltas no greater
  than 15% (capped at 30 px). An arbitrary whole-panel move is rejected.
- Text-bearing reconstruction now requires a hash-bound typography profile before
  export. It freezes label family, size, weight, italic state, tracking, angle,
  positions and centered-block plan; audits actual SVG computed requests and
  native DrawingML runs; and requires a final QA tied to actual PPTX/PDF render
  hashes before contract-specific delivery can become ready.
- Historical AgeMem V15 and MemSkill V13 artifact bytes/styles are regression
  protected. The existing MemSkill Verdana-Bold-to-Hiragino fallback remains an
  expected failed font-identity finding, not a waiver for a new target delivery.

No geometry, typography, native-editability, or rendered-font metric is treated
as visual/reference-fidelity acceptance. The isolated review remains necessary,
and user rejection remains terminal.

## Blocking finding: anchor coverage remains opt-in

`checkReferenceLayout` enforces coverage only for modules that already expose an
`anchorShapeId`:

```js
for (const m of scene.modules)
  if (m.anchorShapeId && !ids.has(m.id)) ...
```

This fixes the tested case of an *anchored* omitted panel. It does not prevent an
author from adding/moving a semantic panel without `anchorShapeId` (or removing
that field from an existing one). Such a panel has no required ledger region and
is never measured. The rule “every major module must have an anchor” appears in
the routing prose but is not enforced by the scene/contract gate.

That is still a direct escape from the target-binding invariant and therefore a
blocker for claiming that reconstruction geometry is fully bound.

### Smallest fix

For reconstruct mode, require every non-annotation semantic module to declare an
anchor and every such module to be ledgered exactly once. Do not infer this from
an optional field. Add a deliberate `referenceExempt: true` only for containers
that have no visible source-owned geometry (for example, an annotation layer),
and require a reason/evidence record for each exemption. A visible module cannot
be exempt merely because it has no anchor.

Add two negative tests:

1. A new non-container module with no `anchorShapeId` rejects before browser
   measurement.
2. An existing region module whose `anchorShapeId` is removed rejects, rather
   than silently escaping the inventory.

The existing “new anchored panel omitted from regions” test should remain.

## Typography gate review

### What is correct

- `freezeTypography` rejects known PDF/PostScript face names for a new
  non-accepted plan until `normalizeTypographyFaces` splits family from
  bold/italic style. The normalization returns a new scene and records
  `sourceFont`; it does not mutate historical accepted artifacts.
- `auditTypography` compares the frozen plan to live scene data, native run
  typeface/size/style/tracking/content, text-block settings, and measured SVG
  style. Its profile/PPTX/SVG/render-report digests make stale final evidence
  fail status.
- The final status requires `typography-qa.json` to pass and its
  `renderedFontCoverage` to be `true`. The prior known MemSkill fallback cannot
  satisfy that condition for a new delivery.

### Limit that must remain explicit

PDF font coverage is document-wide. It proves that each requested family (or
declared name-compatible alias) appears somewhere in the rendered PDF; it cannot
prove that every glyph/run used that face. The code records this limitation, which
is correct. The Skill must retain the corresponding source-crop/PDF-crop visual
review requirement and must not call it per-glyph identity verification.

### Workflow/documentation blocker

The new behavior is mandatory for any text-bearing reconstruction, but the
currently read `SKILL.md` reconstruction entry and `reference-routing.md` do not
tell an author how to:

1. normalize a source PostScript face without changing a historical accepted
   artifact;
2. freeze the source-aware profile before `reconstruct`; or
3. render independently and run the final typography QA that emits
   `typography-qa.json` before `review-status`.

As implemented, an author encounters a hard reconstruction error or an unready
delivery without a documented recovery command. This makes the gate reliable as a
rejection mechanism but incomplete as a usable Skill path.

**Minimal documentation addition:** in the PNG reconstruction section and
`reference-routing.md`, add the exact sequence:

```sh
node scripts/typography-profile.mjs freeze --scene SCENE --out PROFILE.json \
  --kind source-pdf --locator SOURCE --notes NOTES
node scripts/paperfigure.mjs reconstruct --scene SCENE --contract CONTRACT --out OUTPUT
uv run --with pymupdf --with numpy python scripts/render-layout.py --out OUTPUT --checks
node scripts/typography-profile.mjs --out OUTPUT --profile OUTPUT/typography-profile.json \
  --report OUTPUT/typography-qa.json
node scripts/paperfigure.mjs review-status --out OUTPUT
```

State that source-PDF face normalization is an explicit pre-freeze operation,
that no old accepted artifact is rewritten, and that the final QA is required but
not a visual-fidelity pass.

## Exception provenance follow-up

The new numeric bounds close the broad redesign escape. `reason` and `evidence`
remain arbitrary nonempty strings, however, so “make prettier” with a small move
would pass. This is not comparable to the former whole-panel bypass, but it is
inconsistent with the intended “source-required” exception contract. Require a
structured evidence locator (source path/URL plus line/page/region) for future
hardening; preserve human review for judging whether it actually justifies the
change.

## Current disposition

- Keep all LATS directories unready, as `STATUS.md` specifies. In particular,
  the earlier `output-target-final` lacks a typography profile and independent
  Office render/review, so it is historical Skill-development evidence only.
- Do not use the known MemSkill font failure to downgrade any new delivery gate.
- Re-review after anchor-required reconstruction mode and the user-facing
  typography sequence are added, then run the targeted tests and inspect the
  controlled font fixture's actual render outcome.
