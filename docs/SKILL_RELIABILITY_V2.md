# PaperFigure reliability hardening: reference route and typography

Date: 2026-11-16. Scope follows the user's instruction to improve the Skill before
continuing new paper figures. LATS work is suspended, not accepted or delivered.

## Observed failure and actual causes

1. The LATS semantic auto-layout produced 47 geometry errors and 36 warnings. It
   was not a PNG conversion; a later custom native composition was also not bound
   to the chosen PNG. Local refinement success on AgeMem/MemSkill did not establish
   equally strong new-method composition or automatic layout.
2. Written reference-fidelity instructions lacked executable mode/target binding.
   A reference-free semantic spec could be rendered while a generated image was
   casually treated as a visual target. Correct source semantics alone did not
   preserve composition, relative sizes, typography or route appearance.
3. Multiline fitting centered the union of text, but native PPTX centered each
   paragraph. Different-length SVG lines could remain left aligned within a
   centered block, causing visible cross-format drift.
4. Native font declarations were not actual-font verification. A historical
   MemSkill PDF face, `Verdana-Bold`, was kept as a family. The accepted old native
   PDF renders `Skip` as HiraginoSans-W7. This is now a recorded detected defect,
   not a reason to overwrite the user's accepted files or to waive new font QA.
5. Initial LATS semantics were also corrected by isolated code review: passing a
   reflection parameter did not prove it affected the returned value prompt.
   This was an intake/prompt error, not solely an image-model hallucination.

## Implemented changes

- Generic `build` is the design route. It rejects a selected PNG target and
  `--mode reconstruct`, directing authors to explicit `reconstruct` instead.
- Reconstruction requires frozen PNG path/hash/dimensions and module regions.
  Actual Chromium SVG anchor geometry is checked before export. Omitted anchors
  cannot exempt panels; narrowly declared nonvisual groups are validated.
- Local geometry corrections need exact boxes/reason/evidence and strict bounds:
  center shift <=10% smaller side (max20px), dimensions <=15% (max30px). Large
  redesigns cannot be hidden behind an arbitrary expectedBox.
- User rejection persists per candidate. Target substitution, changed SVG/scene,
  stale checks, missing actual rendering or missing/rejected fidelity review
  keep delivery unready.
- Multiline labels now center every line horizontally and the whole block
  vertically. Per-line QA detects individual drift instead of relying on a union.
  Source-aligned code/lists remain outside centered-label blocks.
- Source-aware typography profiles freeze exact text/owner, family, size,
  bold/italic, rotation, tracking, positions and block geometry. Known PDF faces
  are explicitly split into family/style without mutating old scenes.
- Actual SVG and PPTX runs/boxes/paragraph spacing are compared with the frozen
  profile. Final font QA requires the independent Office/PDF render and checks
  requested-family coverage. Unrelated substitutes cannot be silently listed as
  aliases. This remains document-wide coverage, not proof of per-glyph font use.
- Text-bearing reconstruction must bind the profile. The final readiness gate
  binds font QA to the exact profile, SVG, PPTX and Office report, as well as the
  original target and isolated review. A native-object ratio is not font fidelity.

## Verification performed

- Full default regression suite: **99/99 passed, zero skipped**, about16 seconds;
  log `docs/test-results-skill-reliability.txt`.
- New negative tests cover wrong route, altered target/canvas, moved actual SVG
  with unchanged claimed geometry, missing/invisible anchors, omitted panels,
  disguised annotation panels, excessive geometry exceptions, user-rejection
  precedence, individual-line drift, actual font/size/weight substitutions,
  unobserved Office fonts and explicit face/family normalization.
- Accepted AgeMem v15 and MemSkill v13 saved SVG/PPTX/PNG/native previews remain
  unchanged. Tests also regenerate SVG/PPTX byte-identically from their saved
  scenes and audit the frozen typography. The known MemSkill actual-font mismatch
  is explicitly expected to remain detected; new deliveries cannot waive it.
- A controlled four-label fixture was generated and actually rendered through
  LibreOffice -> PDF -> MuPDF. All four planned families pass. Actual span fonts:
  TimesNewRomanPS-BoldMT, ComicSansMS, Verdana-Bold, ArialMT. The corrected Verdana
  family/style split therefore has positive runtime evidence, not only XML text.
- A controlled reference/profile roundtrip exercises the real reconstruct CLI;
  actual SVG/native/font checks passed. The final status correctly remained
  `deliveryReady: false`, with only the missing isolated fidelity review and
  missing reviewed target PNG as reasons. It is not a paper-image parser
  benchmark or a fabricated accepted figure.
- Skill creator `quick_validate.py paperfigure`: valid. `git diff --check`: clean.
- Independent implementation re-review closes prior blockers:
  `docs/SKILL_RELIABILITY_REVIEW_FINAL.md`. Original rejection/review records remain.
  Its remaining non-blocking free-text issue is clarified in documentation:
  structure/local bounds are automated; a reviewer judges whether source evidence
  actually justifies the change. No string classifier claims to prove entailment.

## Durable instructions and examples

Entry: `paperfigure/SKILL.md`. Conditional references:
`reference-routing.md`, `typography.md`, `layout-and-arrows.md`,
`png-reconstruction.md`, `detail-fidelity.md`, `visual-review.md`.

Implementation: `reference-layout.mjs`, `typography-profile.mjs`, CLI routing and
review-status dispatch, measured per-line fitting/QA. No paid external API is added.
`assets/typography/goldens.json` and the two frozen profiles protect accepted work;
`examples/typography-regression/` retains the actual font and controlled-route tests.

## Remaining boundary

This work improves route enforcement, source-aware text preservation and export
reliability. It does not make arbitrary PNG parsing, typeface identification,
aesthetic optimization or new-paper composition automatic. Fonts inferred from
pixels remain approximate; actual crops, isolated review and user judgment are
still required. The legacy semantic auto-layout still has limits on complex
feedback graphs. LATS has no accepted final figure. Do not resume it as a showcase
until a small typography/composition sample is satisfactory under this workflow.
