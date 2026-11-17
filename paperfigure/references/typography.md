# Preserve typography before accepting a reconstruction

Native editable text is necessary, not sufficient: a wrong font family or weight,
fallback face, baseline, line spacing or alignment can make a vector figure worse
than its PNG. Do not replace source-specific typography with a global Arial theme.
Use the typography of an accepted example as a regression baseline, not a universal
font prescription for other papers.

## Recover and choose deliberately

1. Prefer actual PDF text/font records when available, retaining the original
   `sourceFont`. A PDF PostScript **face** is not always a usable font **family**:
   `Verdana-Bold` should be family `Verdana` plus a bold flag. The explicit
   `normalizeTypographyFaces(scene)` helper handles a small known map and returns
   a copy plus change log. It never silently rewrites old accepted files or guesses
   every unknown hyphenated family.
2. For raster-only or generated PNGs, mark font identity as approximate. Record
   the visual match evidence and uncertainty; do not claim a font was identified
   because it is installed. Compare source crops of a heading, body label, edge
   annotation and math against a small native type sample before laying out a
   whole new figure. Use the same words to judge glyph shape, width and weight.
   A generated reference should use the selected intended family in its prompt,
   but generated text still requires this check.
3. Choose family/size/weight/italic/spacing by semantic text role. Preserve source
   line breaks and mathematical baselines/subscripts. Do not stretch glyphs or
   lower the readable floor merely to fit the chosen boxes. Use actual font metrics
   and authorized local rewrapping, with a discrepancy record.
4. Complete measured layout fitting, then freeze its exact text IDs, literals,
   owners, family/style/size, character positions, rotation, tracking, and centered
   block regions. For centered multiline labels, center **each line horizontally**
   while centering the whole block vertically. Source-aligned code/lists remain
   separately aligned; they are not module-centered blocks.

## Freeze and check actual output

```sh
node scripts/typography-profile.mjs freeze --scene layout-scene.json \
  --out NEW-typography-profile.json --kind image-approximation \
  --locator reference.png --notes 'Approximate source match; verified using local text samples'
```

Supported source kinds: `source-pdf`, `image-approximation`,
`approved-native-scene`, `user-specified`. They record provenance, not confidence
certification. New profiles reject known PostScript-face/family mistakes. The
approved-scene kind can freeze a legacy defect for regression analysis; it does
not waive a failed actual-font check for a new delivery.

A reference reconstruction with text must bind this profile in its contract:

```json
"typography": {"path": "NEW-typography-profile.json", "sha256": "ACTUAL_FILE_HASH"}
```

`reconstruct` checks its hash/coverage, copies the profile into the output and
writes `typography-style-qa.json` after checking actual SVG/native text attributes.
After independent Office rendering, run the final check:

```sh
node scripts/typography-profile.mjs --out OUTPUT \
  --profile OUTPUT/typography-profile.json \
  --report OUTPUT/typography-qa.json
```

This requires actual `native-render/render-qa.json`. It checks actual SVG and
native PPTX family, size, bold/italic, text, tracking, rotation/text-box geometry,
paragraph centering, block geometry and line spacing against the frozen plan.
It also verifies that requested families appear in the actual PDF-render font list.
A substitute is not a valid alias: change the intended family explicitly, retain
its source-match explanation, and re-review if substitution is necessary.

`review-status` binds this font QA to the exact profile, SVG, PPTX and Office
render report. Missing/stale font verification cannot become an accepted target
reconstruction merely because module boxes or native-object counts are correct.

User-requested typography edits authorize a new explicit plan: preserve the old
profile, refit, re-render and re-review. Do not ask permission again solely because
a profile is frozen. Never modify a frozen reference or accepted artifact in place
to hide an unsuccessful comparison.

## What the checks do not establish

Computed SVG family names express font requests, not actual per-glyph platform
selection. PDF font-list coverage is document-wide; an observed family somewhere
cannot prove every symbol used it. Inspect actual source/SVG/native text crops for
partial fallback, glyph shape, baseline and native wrapping. A font-style audit
is not OCR or automatic typeface recovery. Missing fonts or unresolved visual
substitutions remain failed/unverified; do not outline the text as a workaround.

## Regression baselines

`assets/typography/goldens.json` hashes the accepted AgeMem v15 and MemSkill v13
artifacts. Tests regenerate their saved native scenes byte-identically and compare
all native text styles with frozen profiles. They do not reflow or overwrite those
figures. The MemSkill legacy `Verdana-Bold` requested family is absent from its
actual Office font list; `Skip` renders in HiraginoSans-W7. This known defect remains
explicitly detected, rather than changing the old artifact or weakening the new gate.

`examples/typography-regression/` tests the corrected family/style split with actual
SVG/PPTX/Office rendering. A controlled sample fixture is evidence about font
handling, not a new publication figure or a claim that LATS design is complete.
