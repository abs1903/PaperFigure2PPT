# Homepage cover refinement

The homepage previously opened with text and an installation command, followed by
a dense CLIP figure. A dedicated cover now introduces the visual quality and range
of the existing examples before installation and the full-size figure gallery.

Two compositions were rendered and inspected: `cover-triptych.png` presents all
three examples at equal weight; `cover-feature.png` enlarges CLIP beside smaller
Agentless and MAE examples. The triptych was selected for its balanced case
coverage, consistent alignment and larger supporting examples. The cover uses
warm off-white, dark ink, restrained blue/green/clay accents and generous spacing.

`render-cover.mjs` reproduces both candidates using the existing Chromium runtime.
All figure thumbnails are unchanged, previously accepted native Office previews.
`cover-provenance.json` records their exact paths and SHA-256 hashes. This cover
is raster presentation artwork; editable scientific deliverables remain linked
individually under Examples. No new scientific figure, ImageGen study, Office
render or independent scientific review is claimed for this homepage change.

Verification checks cover source-image integrity, both cover layouts, Markdown
image/link destinations and desktop/mobile README rendering. The README preview
uses GitHub Markdown API HTML with local GitHub-like CSS; it is not a screenshot
of the authenticated GitHub website. Existing SVG/PPTX/PDF files and the skill
runtime are unchanged.

Final checks passed: both 1800 × 1000 cover layouts fit; all four README images load at 1200 px and 430 px without page overflow; 39 local link destinations resolve; the three source render hashes match. The first preview detected an existing long installation-link label overflowing on mobile; that finding is retained in `preview-qa-v1-overflow.json`, and the shorter label resolves it.
