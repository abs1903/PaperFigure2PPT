# Independent Review: Layout and Arrow Workflow

**Scope.** Read-only audit of the new `paperfigure` layout route and its two
agentic-2026 examples. I inspected the layout contract, SVG/PPTX exporters,
geometry/native/render audits, and tests. I did not modify source figures or
generated artifacts.

**Verdict: not ready to claim the requested layout/editability acceptance yet.**
The route has a useful source-assisted architecture: native SVG text is measured
in Chromium, SVG geometry detects many real route failures, OOXML uses
`p:cxnSp` plus helper ports, and the independent LibreOffice/MuPDF pass checks
centered blocks and connector shafts. `npm test` currently passes (73 tests),
but it does not exercise the new browser-layout test file and several required
failure conditions can still pass.

## Release blockers

1. **The browser text/occlusion/word-wrap tests are excluded from `npm test`.**
   `paperfigure/package.json` runs `node --test tests/*.test.mjs`, but the new
   browser suite is `tests/layout.browser.mjs`. Its four tests (actual glyph
   bounds, opaque overpainting, invisible labels, and wrapping) are never
   selected by that command. The passing 73-test result therefore does not
   cover the primary measured-layout path. Rename it to `layout.browser.test.mjs`
   or include `tests/*.mjs`, and make the browser/runtime-unavailable status an
   explicit unverified gate rather than silently losing the suite.

2. **Declared `minPadding` is used by reflow but ignored by layout QA, producing
   a centered/padded-container false pass.**
   `fitCenteredBlocks` shrinks its target by `m.minPadding`
   (`scripts/layout-reflow.mjs:8`), while `analyzeLayout` uses only
   `label.padding ?? 0` for overflow (`scripts/figure-geometry.mjs:29`). The
   centered calculation itself also uses the unpadded box (`:30`).

   Reproduction (against the current implementation): one centered label with
   ink bbox `[10,40,80,20]` inside `textBox [0,0,100,100]` and
   `minPadding:20` returns `passed:true`. It violates the actual permitted
   padded region `[20,20,60,60]`. QA must derive a single per-label permitted
   region (including module padding for `centerTextIds`, plus any explicit
   label padding) and use it consistently for fitting, overflow, and centering.
   Add this regression test.

3. **Unapproved opaque text occlusion is only a warning, not a failed check.**
   `layout-inspect.mjs:12` appends non-exempt `potential-label-occlusion` to
   `qa.warnings`; `qa.passed` depends solely on `qa.errors`. That conflicts with
   the route's stated rule that unresolved collisions/occlusion are defects and
   that only specifically source-approved stacks may be excepted.

   This is observable in the current `memskill/output-v9`: it reports
   **138 measured opaque occlusions**, **358 exceptions**, zero errors and zero
   warnings. The broad `module-overlap` exception is being reused to convert
   many individual text/shape overpaintings into exceptions. The report loses
   the required explicit owner-pair/shape justification. Require an explicit
   `opaque-occlusion` exception keyed to the exact text and covering primitive
   (with source reason), otherwise fail; retain approved occlusions as a
   separately counted denominator.

4. **Native arrowhead size is not audited, so editable arrow-style QA can pass
   after a size corruption.**
   The exporter writes `w` and `len` from `arrowSize`
   (`scripts/layout-export.mjs:34-35`), but native audit checks only arrowhead
   `type` (`scripts/layout-native-audit.mjs:10`). I generated the native fixture
   with `arrowSize:'lg'`, changed both OOXML head/tail attributes from
   `w="lg" len="lg"` to `w="sm" len="sm"`, and `auditNativeLayout` still
   returned `passed:true`. Audit `w` and `len` for every terminal segment and
   add the corruption test. The independent render deliberately excludes the
   arrowhead neighborhood from shaft coverage, so it cannot compensate for this
   omission.

## Material non-blocking gaps / claims to narrow

- **The editability ratio is tautological rather than a coverage denominator.**
  `auditNativeLayout` returns `nativeContent == totalContent == content.length`
  (`layout-native-audit.mjs:12`), hence `ratio:1` by construction. It is not
  compared with declared scene primitives, labels, logical edges, or expected
  connector segments. Current reports give bare numerators such as
  `nativeSVGLabelsCovered: 33` (AgeMem) and `238` (MemSkill), not `33/33` or
  `238/238`. Report at least: scene labels covered/total, centered labels
  covered/total, logical edges represented/total, native connector segments
  expected/actual, path primitives represented/total, and auxiliary ports
  excluded/total. The existing XML/map ownership checks remain useful but do
  not establish this denominator.

- **Native endpoint binding is proven as XML-reference integrity, not as actual
  interactive PowerPoint behavior.** The audit validates `a:stCxn`/`a:endCxn`
  IDs and helper coordinates, and LibreOffice checks shaft pixels. Neither
  performs a PowerPoint move/attachment action; the code's own limits say this.
  Keep the claim at “OOXML binding references verified”; do not label it as
  verified interactive reattachment/rerouting.

- **Crossing is warning-only.** `figure-geometry.mjs:42` records an undeclared
  crossing as a warning. That can be legitimate in a source figure, but the
  workflow says crossings need inspection and scoped source exception. Treat it
  as an unresolved review gate (or explicitly report it as an unresolved
  difference) rather than allowing a mechanical clean pass.

- **Shape-level native style coverage is incomplete.** The native audit checks
  connector stroke/color/dash/type and centered text alignment, but does not
  validate font family, font size, text color/italic/bold, or general vector
  shape paint/stroke against the scene. The render loop catches some visible
  drift, not all editable-property drift. This should be stated as a limitation
  unless the audit is extended.

## Evidence that does work

- `npm test` passed the 73 selected tests in 7.2 seconds; focused geometry,
  native XML, and existing paperfigure suites ran.
- The native v9 audits report no raster/image substitution; AgeMem reports 33
  SVG labels and 10 logical edges, while MemSkill reports 238 labels and 37
  logical edges. Their LibreOffice/MuPDF text-block and shaft tests passed.
- The route correctly refuses unmeasured SVG edges, detects detached anchors,
  detects a rendered interior-route mismatch, and rejects a no-corridor route.
  These are good foundations, but they do not cure the blockers above.

## Acceptance recommendation

Do not mark v9 as visually/layout accepted or claim complete native arrow/text
constraint verification until the four blockers are fixed and their negative
tests run through the actual `npm test` command. Re-run SVG inspection, native
audit, and independent render for both agentic examples. Delivery should show
unresolved differences explicitly and remain `unreviewed` until the separate
isolated visual review is supplied.
