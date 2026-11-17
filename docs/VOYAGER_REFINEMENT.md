# Voyager paper-main-figure refinement

The new candidate replaces equal-weight system cards with a dominant native program
workspace and a grouped generation/execution/verification/refinement cycle. Curriculum
and exploration state become input rails; an explicit library registration port
clarifies eligible-success writes. Concrete released skill code replaces generic
schema fields and invented function names.

The visual brief is the user's: solid meaningful colors, independently editable
text, no title/footer/fine print, and a separate isolated review of visual quality.

## Independent evidence

- `VOYAGER_REFINEMENT_SOURCE_REVIEW.md`: initial source revision requests.
- `VOYAGER_REFINEMENT_SOURCE_REVIEW_V4.md`: actual released skill examples audited.
- `VOYAGER_REFINEMENT_VISUAL_QUALITY_V4.md`: fresh visual-only reviewer rejected the
  first polished layout despite successful rendering.
- `VOYAGER_REFINEMENT_VISUAL_QUALITY_V5.md`: that isolated reviewer accepted the
  reorganized primary loop and registration endpoint, with scoped limitations.
- `VOYAGER_REFINEMENT_SOURCE_REVIEW_V5.md` and `VOYAGER_REFINEMENT_SOURCE_FINAL.md`:
  require and verify the explicit `If not done` continuation condition.
- `VOYAGER_REFINEMENT_VISUAL_QUALITY_FINAL.md`: final actual-image recheck and hashes.

A source audit pass, successful rendering and visual quality acceptance are distinct
claims. The isolated visual reviewer started with `fork_turns: none`, directly saw
native/PPTX/PDF images and an intended-size proxy, and did not author or repair the
figure. It received no requested verdict. Its first `revise` is retained.

## Export checks and engine correction

Final export inventory: 7 nodes, 12 logical edges, one visual group, 82 native shapes
(including 39 native text boxes), 16 native connector segments, zero pictures.
All architectural artwork, the code excerpt and environment vignette are native.
Native-object ratio is 100% by count; this is not an aesthetic or scientific score.

Automated geometry finds no errors or edge crossings. The one warning remains the
known analytic Helvetica estimate versus the actual serif font; independent rasters
were checked. Office/PDF route checks and PDF label extraction pass. Minimum computed
text size is 7.09 pt at seven-inch width; smaller target widths need reflow, not an
assumed readability claim.

The new large group heading exposed a real renderer issue: fixed 52px group padding
allowed a 36px annotation to overlap its first member. Padding now scales with actual
annotation height while preserving the former minimum. A regression checks that
geometry, source example hashes, continuation guard, pure fills and native outputs.
`test-results-voyager-refinement.txt` records 47/47 tests passed, zero skipped,
about 7.9 seconds under the 30-second test budget.

No source-agent code or external environment was executed. No paid API was called.
The code/description examples are author-released artifacts at the pinned parent
commit, not fresh runs. Paper images and the exploratory generated design study
are references only; the final architecture is not a bitmap in PowerPoint.

Reproduction and source provenance:
`paperfigure/examples/voyager-agent/refinement/README.md`.
