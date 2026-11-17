# Final Skill reliability re-review

Date: 2026-11-16  
Scope: final independent re-review of the reconstruction binding and typography
hardening. LATS figure work remains suspended; no LATS output is accepted here.

## Verdict

**The prior blocking target-binding and usability gaps are closed.**

The reconstruction path now requires every scene module to be either:

1. inventory-bound to a frozen PNG region and measured through an actual SVG
   anchor; or
2. explicitly declared as a narrowly valid `nonVisualGroup`.

The exemption is constrained: it must be a container, cannot be a routing
obstacle, cannot own an anchor or graph endpoint, and annotation groups may own
text only. Hierarchy exemptions require actual children. This closes the previous
optional-anchor bypass; simply omitting `anchorShapeId` now yields both missing
anchor and missing inventory failures.

Geometry exceptions remain local: center displacement is at most 10% of the
original smaller side and never more than 20 px; each size delta is at most 15%
and never more than 30 px. Thus an exception cannot preserve a full redesign
behind replacement region coordinates.

Typography is now a complete documented gate for text-bearing reconstruction:

- the Skill directs authors to `references/typography.md`;
- source PDF face/family normalization is explicit and non-mutating for historical
  accepted artifacts;
- a hash-bound frozen profile is required before reconstruction;
- actual SVG/native style evidence and final actual Office/PDF font evidence are
  tied to the exact profile, SVG, PPTX, and render report before delivery status
  can be ready; and
- the documentation expressly limits document-wide PDF-font coverage and retains
  source/SVG/PDF crop inspection plus isolated review for per-glyph/fidelity
  questions.

These gates are necessary structural evidence, not proof that a figure is
visually faithful, aesthetically acceptable, or user-approved.

## Verification

Ran:

```sh
node --test tests/reference-layout.test.mjs tests/typography-profile.test.mjs
```

Result: **12 passed, 0 failed** (about 5.6 seconds). Coverage includes actual SVG
anchor measurement, changed target/canvas, hidden anchors, generic-build routing,
user-rejection precedence, bounded geometry exceptions, omitted-anchor/fake-
annotation rejection, historical byte/style preservation, native/SVG substitution
rejection, actual-render distinction, and explicit PDF-face normalization.

The controlled typography fixture's final `typography-qa.json` passes with four
planned families (Times New Roman, Comic Sans MS, Verdana, Arial) and
`renderedFontCoverage: true`. Its actual Office/PDF report records corresponding
embedded faces, including `Verdana-Bold` after the corrected family/style split.

AgeMem V15 and MemSkill V13 bytes remain protected by their golden hashes. The
known old MemSkill Verdana-Bold requested-family mismatch remains an expected
detected failure in that historical regression—not a pass, and not a waiver for
any new delivery.

## Residual non-blocking consistency issue

`reference-routing.md` says a blanket `"make prettier"` exception is invalid, but
the implementation currently accepts any nonempty reason/evidence when the move
is inside the strict numeric local bounds. This cannot recreate the prior
whole-composition bypass, and the isolated review still assesses the change, so it
is not a target-binding blocker. For complete policy/code consistency, either
validate structured source locators/reject aesthetic-only reasons or soften that
sentence to say such a reason is insufficient for review acceptance.

## Current disposition

Maintain `examples/lats-hotpotqa/STATUS.md`: all LATS figures remain unready and
are Skill-development evidence only. A later figure trial must still supply the
frozen target, profile, actual render, fresh final font QA, comparison crops,
isolated review, and no unresolved user rejection. Passing these reliability
checks alone does not accept that future figure.
