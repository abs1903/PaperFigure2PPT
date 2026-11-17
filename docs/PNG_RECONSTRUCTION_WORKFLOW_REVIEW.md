# PNG reconstruction workflow review

**Verdict: REVISE before treating this as an acceptance-capable reconstruction
workflow.** The written fidelity contract is strong and correctly separates a
supplied reference from the new-design mode. It expressly prohibits a full PNG,
text outlines, and silent redesign; requires region-level render/compare/repair;
requires native SVG/PPTX objects; and says that no PNG was reconstructed in this
turn. It also candidly says that the checker is diagnostic, not OCR or visual
acceptance. Those are the right boundaries.

The implementation and test suite do not yet enforce enough of that contract to
call a structural pass evidence of independently editable reconstruction:

- **False native-text pass (material).** `inspectNativeSVG` accepts an inventory
  label if its matching `<text>` is inside `<defs>`; it does not require that it
  be visible or semantically owned. A separate zero-opacity visible text satisfies
  the `no-native-text` check, while the visible word may be a path. A synthetic
  fixture with exactly that construction returned `errors: []`. This is an
  especially important bypass of the no-outlines requirement.
- **False semantic-group pass (material).** Any nonempty inventory is accepted,
  and roles are arbitrary strings. A single `<g id="whole-figure"
  data-role="figure">` may own every module, edge, icon, and label. The checker
  never verifies independent module/edge/icon owners, group membership, or an
  inventory of all visible objects. Its “semantic group” success therefore does
  not demonstrate the promised independently editable components.
- **Inventory remains self-attested.** The documentation admits it cannot prove
  completeness, but the tests only exercise a complete friendly inventory. There
  is no required reference transcript/object ledger, region-by-region checklist,
  or reviewer schema that makes omissions (including small labels, arrowheads and
  icons) auditable.
- **PPTX has no executable native-reconstruction path/gate.** The reference says
  the existing exporter cannot import arbitrary authored SVG, then asks authors to
  build and inspect a native PPTX manually. No reconstruction-specific PPTX
  manifest, XML verifier, generator contract, or test establishes native labels,
  shapes, connectors, grouping, and icon exceptions from the same inventory.
  Existing shared-spec `review-status` is explicitly inapplicable.
- **Authorized raster exception is contradictory.** The text permits a genuine
  unrecoverable photographic subimage after explicit user choice, but the checker
  unconditionally fails every SVG `<image>` and offers no declared-exception path.
  Either add a narrowly scoped, review-required exception with its bounding box,
  source hash and limitation record, or state that such a request cannot pass this
  checker.
- **Artifact promise is slightly overstated.** The guide says the command emits
  preview/overlay/difference/side-by-side files. The checker writes only
  `report.json` when structural errors exist; document this conditional behavior
  so a failed native audit is not mistaken for an incomplete run.

## Required revision direction

Define a versioned reconstruction manifest that enumerates every expected visible
label, module, edge, icon and allowed background/raster exception, with stable
owner IDs, reference regions and declared roles from a closed vocabulary. Require
each declared label to be visible (not in `defs`, `display:none`, `visibility:hidden`
or zero-opacity) and inside its declared semantic owner. Reject a catch-all group
as satisfaction of module/edge/icon coverage. Keep the human transcription and
region checklist mandatory, since a PNG-only source cannot make OCR/font identity
provable.

Add negative tests for the `<defs>`/hidden-label bypass, a catch-all-group-only
inventory, incomplete object inventory, and declared raster exceptions. Specify a
PPTX-side manifest/XML validation and independently rendered comparison gate, or
say plainly that the PPTX portion is manual/unavailable rather than deliverable.
The isolated reviewer should issue separate, hash-bound verdicts for reference
fidelity, SVG native editability, and PPTX native editability; none may inherit
the checker pass.

## Evidence

- `npm test -- --test-reporter=spec` passed all 54 tests. This confirms the
  current tests, not a real-image reconstruction.
- A local synthetic call to `inspectNativeSVG` returned no errors for the hidden
  inventory label plus outlined visible-word/catch-all-group case described above.
- No user PNG was supplied, and no actual image reconstruction, visual comparison,
  or PPTX review was performed.

Key locations: `paperfigure/references/png-reconstruction.md:66-85,117-124,132-160`;
`paperfigure/scripts/reconstruction-check.mjs:22-56,65-91`; and
`paperfigure/tests/reconstruction.test.mjs`.
