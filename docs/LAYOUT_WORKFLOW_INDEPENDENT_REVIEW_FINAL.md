# Independent Re-review: Layout and Arrow Workflow

**Scope.** Read-only re-review of the fixes requested after
`LAYOUT_WORKFLOW_INDEPENDENT_REVIEW.md`. I inspected the current test command,
measured SVG QA, geometry checks, OOXML audit, and current v11 scene/QA/audit/
native-render outputs. I did not modify implementation or figure artifacts.

## Verdict

**Code acceptance: pass.** The four concrete blockers from the first review and
the follow-up opaque-exception evidence gap are fixed in the current reusable
workflow. The default test command exercises their negative cases. This is an
acceptance of the layout/arrow workflow implementation, not acceptance of a
paper figure's visual quality.

The output-specific v12 render is still in progress at this review point, so
v12 remains a candidate until its final SVG QA, native audit, independent PPTX
render, and isolated visual review are recorded. The prior v11 candidates did
complete native rendering and edit move/style tests according to the supplied
test record; this re-review did not rerun or rewrite those output artifacts.

## Previously reported blockers: disposition

| Prior finding | Current evidence | Disposition |
| --- | --- | --- |
| Browser suite omitted from `npm test` | `package.json` now runs `tests/*.test.mjs tests/*.browser.mjs`; default `npm test` ran all browser tests. | Fixed |
| `minPadding` was not enforced by QA | `analyzeLayout` applies `minPadding` to centered-label overflow, and `figure-geometry.test.mjs` has the padded-region negative test. | Fixed |
| Opaque overpainting was warning-only | `assessMeasuredLayout` now emits `opaque-label-occlusion` as an error unless an exact exception exists. Browser test covers the negative case. | Fixed |
| Arrowhead dimensions/dash drift passed native audit | Native audit validates `w`/`len`, custom dash pattern, and line cap; `layout-native.test.mjs` corrupts size/pattern and expects failure. | Fixed |
| Native-object editability ratio was a self-comparison | Audit walks actual `p:sp`, `p:cxnSp`, `p:grpSp`, and `p:pic` objects; injected picture test makes the real-object ratio fall below 1 and fails the audit. | Fixed |
| Opaque exception evidence could be omitted | Schema conditionally requires geometry/source hashes for `opaque-label-occlusion`; `exactException` rejects missing evidence, relative edits, and accepts only a joint translation. | Fixed |

## Verification performed

- `npm test` completed successfully: **81 passed, 0 failed** in about 9.0 s.
  This includes the four `layout.browser.mjs` tests under the default command,
  the padded-region regression, the arrowhead/dash corruption test, and the
  injected-picture denominator test. The new geometry test additionally proves
  that an opaque exception fails without evidence, fails after an individual
  typography edit, and remains valid after a joint translation of the text and
  covering primitive.
- Current v11 SVG-layout QA and OOXML audit both pass for the available
  candidate files:
  - AgeMem: 33 measured labels, 10 measured edges, 0 opaque occlusions; native
    audit reports 165 content objects and no errors.
  - MemSkill: 238 measured labels, 38 measured edges, 138 measured opaque
    occlusions; all are explicitly handled rather than warning-suppressed.
    The scene declares 203 exact opaque exceptions, each with a geometry hash
    and source-reference SHA-256; the QA report records 254 total approved
    exceptions (including other scoped source-layout exceptions). Native audit
    reports 505 content objects and no errors.

## Evidence-bound occlusion exceptions

The generic gap is now closed. For `opaque-label-occlusion`, the scene schema
requires both `geometryHash` and `sourceReferenceSHA256`; `exactException`
requires source-hash syntax and geometry-hash equality. The regression test
proves three important invariants: no evidence cannot waive an occlusion, an
individual typography change invalidates the waiver, and a common translation
of the text plus covering primitive preserves it. This allows source-layout
translation during reflow without permitting a relative overpaint change.

## Boundaries retained

- OOXML binding is verified as `a:stCxn`/`a:endCxn` reference integrity and
  helper-port placement; it is not an interactive Microsoft PowerPoint move or
  reroute test.
- v12 output-specific rendering is still in progress and must not be inferred
  from implementation tests. Its final QA/audit/render hashes and isolated
  visual review remain delivery gates.
- Mechanical QA does not replace the required isolated source/visual review or
  a human publication-quality decision.
