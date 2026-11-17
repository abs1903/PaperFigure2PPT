# PNG reconstruction workflow re-review

**Verdict: PASS for the documented diagnostic-plus-manual workflow.** The revision
fixes the material issues in the initial review and is now a credible
fidelity-first *workflow*, not an automatic PNG-to-vector claim. No real
reconstruction can be claimed: no user PNG was supplied or reviewed in this turn.

## What now passes review

- The frozen-reference v1.0 ledger records hash, dimensions, source counts,
  regions, closed semantic roles, vector kinds and explicit owners.
- The prior `<defs>`/hidden-text bypass is closed. Ordinary zero-opacity,
  `display:none`, hidden, zero-font-size, transparent-fill, wrong-owner,
  catch-all-role, missing-vector-ledger and image cases fail. Hidden `<tspan>`
  text and definition-only groups also fail.
- Documentation accurately marks PPTX as manual/agent-assisted, requires an
  object map, XML audit and independent rendering, and keeps missing PPTX evidence
  unverified. SVG diagnostics cannot imply fidelity or PPTX acceptance.
- Strict-native raster handling and conditional comparison artifacts are now
  described correctly. Separate hash-bound reference-fidelity, SVG-editability
  and PPTX-editability reviews are the appropriate delivery boundary.

## Scope boundary retained

The checker now rejects zero-determinant matrix transforms and zero `textLength`,
with focused regression coverage. It still deliberately does not prove painted
glyph visibility, OCR/transcription correctness, inventory truthfulness, font
identity, visual fidelity, or PPTX editability. The guide says so explicitly and
requires region-level manual comparison plus independent, hash-bound SVG/PPTX
review. Paths in marker/definition subtrees consequently remain matters for the
reference region checklist and isolated visual review rather than automatic
per-vector acceptance.

## Evidence

- `node --test tests/reconstruction.test.mjs --test-reporter=spec`: **12 passed,
  0 failed**, including the new singular-matrix and zero-`textLength` guard.
- The prior broad suite result remains **58 passed, 0 failed** before this focused
  guard addition; it was not needlessly rerun for this targeted verification.
- The initial synthetic hidden-label/catch-all-group case is now rejected by the
  new negative coverage.
- Direct synthetic probes now confirm both matrix-zero and `textLength="0"`
  labels fail with `hidden-native-text`/`no-native-text`; hidden `<tspan>` also
  fails.
- No supplied research-architecture PNG, reconstruction SVG, preview, or PPTX was
  evaluated.
