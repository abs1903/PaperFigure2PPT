# MemSkill source-guided detail refinement

Date: 2026-11-16. Verified final artifacts: `paperfigure/examples/agentic-2026-layout/memskill/output-v13/`.
Source: original authors' MemSkill, arXiv **2602.02474v1**, Figure 2, page 4,
CC BY 4.0. Original source attribution, crop coordinates, PDF/PNG hashes and license
links remain unchanged in `source/provenance.json`. No external title/caption was added.

## Changes and invariants

- Recovered 23 non-text icon instances in seven source families as coherent native
  curves/shapes: six speech bubbles, six compasses, six token strips, one compound
  Memory Bank, two snowflakes, one flame and one optimization-loop icon.
- Each token strip retains all nine source positions, including intentional blank
  cells and the exact circle/square/diamond ordering. Each divider and visible
  glyph is an independent native part. No visual meaning was invented for tokens.
- Memory Bank retains its cylinder, connecting bridge, five slots and source color
  roles. The reset indicator was extended from empty space above a rounded corner
  to the visible bridge top at `(510,543)`. Its target and meaning remain unchanged.
- Sequence math uses base size 40 / subscript size 23.2, baseline 178 / 186 and
  measured horizontal centering in each cell. Current-span math is centered in its
  existing container; Input/Memory/Update labels are centered on their existing shafts.
- The existing twelve centered native text blocks remain. Source code/list/card
  typography is preserved; no blanket paragraph-centering or clipping was applied.
- Shared `cleanArrowTips` aligns SVG head sizes with native Office heads and removes
  the underlying round shaft from pointed tips. Arrow properties remain editable.
- Scientific topology and semantic hashes are identical to v12. All 238 text
  fragments retain their IDs, literal text and owners. 473 non-target primitives
  are unchanged; 11 explicitly logged text fragments receive layout/font changes.
  Every edge object except the reset indicator's visual anchor is unchanged.
- Source skill/failure-card stacks retain their reviewed exact geometry/source-
  hash-bound occlusion exceptions. No new blanket exceptions were introduced.

## Actual verification

| Check | Result |
|---|---|
| Measured SVG layout | PASS; 238 text fragments, 38 logical rendered edges, 12 centered blocks, zero unresolved errors/warnings |
| Native XML audit | PASS; no picture/media substitution; every label accounted for |
| Native content | 616/616; excludes 76 transparent attachment helpers and semantic groups |
| Native text boxes | 233, including twelve centered multiline blocks |
| Native shape paths | 276 across the complete figure |
| Semantic connector segments / source line art | 48 / 59 |
| Native icon groups / icon parts | 23 / 208 |
| Independent PPTX rendering | PASS; LibreOffice -> PDF -> MuPDF |
| Isolated rendered text checks | Twelve blocks, expected line counts and centering pass |
| Isolated rendered route checks | All 38 logical routes pass coverage |
| Actual native icon controls/styles | PASS for all 23 groups: curve controls/extents, fill, stroke, opacity, caps, grouping |
| Token positions | Six rows, nine cells each; blank positions and visible glyph types preserved |
| Formula alignment | Three measured cell clusters pass uniform size/baseline and center constraints |
| Reproduction | SVG and PPTX regenerate byte-identically from saved scene |
| Source hash | Matches frozen provenance |
| Independent original/SVG/PPTX visual review | PASS; exact inspected hashes in `MEMSKILL_REFINEMENT_REVIEW_V13.md` |

All new generation, inspection and verification scripts were actually executed.
No shared exporter/runtime code changed in this paper-specific refinement; the
prior shared 86-test suite was not redundantly rerun. The new case instead receives
its own measured SVG, actual XML/icon geometry, actual Office rendering, source-
semantics, token-position, formula-layout and deterministic regeneration checks.
`git diff --check` is clean. These checks are not subjective publication scoring.

## Delivered evidence

- `editable.svg`, `preview.png`, `figure.pptx`, scene and native object map.
- `refinement-changes.json` and `icon-regions.json` provide source-region/part/repair IDs.
- `layout-qa.json`, `native-audit.json`, `native-render/render-qa.json` and actual renders.
- `icon-detail/contact-sheet.png`: original / previous / SVG / actual native PPTX.
- `token-strip-comparison.png`: wide crops preserve legibility of all nine positions;
  square icon sheets alone downsample these thin sequences too much.
- `comparison-original-svg.png`, `comparison-svg-pptx.png`: complete figure comparisons.
- `verification-final.json`: mechanical evidence, source invariants and artifact hashes.
- `delivery.json`: separate isolated-review evidence and exact final output hashes.

Reproducible commands are in `examples/agentic-2026-layout/memskill/refinement/README.md`.
The Skill detail workflow now points to this worked case and records the narrow-
strip inspection lesson. Prior v12 outputs and source files remain intact.

## Limitations

The icons are smooth source-guided redraws, not recovery of original icon source
files. Fine raster shading, exact silhouettes and math font appearance can differ
slightly. User-authorized flat fills replace original gradient transfer channels.
The earlier paper-backed Controller optimization route remains; it was not reverted
to the source's visually ambiguous frozen-Executor route. No interactive Microsoft
PowerPoint drag/edit test was performed; actual static rendering uses LibreOffice.
Agent acceptance and native-object coverage do not certify a venue's visual standard.
