# Faithful PNG reconstruction mode

The requested mode is now routed explicitly from `paperfigure/SKILL.md` to
`references/png-reconstruction.md`, separate from new-method figure design.

The reference PNG governs layout/style/text; no unrequested redesign, caption
removal, recoloring or English translation is permitted. Chosen generated targets
follow the same fidelity workflow. Native text and semantic SVG group ownership
are required. Full-raster embedding, raster mosaics, text outlining and one-picture
PPTX delivery are forbidden. Unknown fonts, unreadable labels, complex illustrations
and PPTX equivalence need explicit limitation reports rather than false recovery.

The workflow includes inventory, native authoring, original-size render/region
comparison, discrepancy repair, independently rendered editable PPTX and isolated
fidelity/editability review. Generic clean-layout or native-object checks cannot
approve a materially different composition. Direct SVG authoring is supported as
an agent workflow; it does not inherit the shared-scene renderer's review gate. A mandatory PPTX
object-map/XML-audit and independent rendered comparison remain an agent-assisted
authoring/review task, not a claimed capability of the SVG diagnostic command.
Reference fidelity, SVG native editability and PPTX native editability receive
separate hash-bound verdicts; unavailable PPTX evidence stays unverified.

`reconstruction-check.mjs` is a diagnostic helper, not a PNG parser or vectorizer.
Its versioned ledger binds the PNG hash/dimensions, source-inventoried counts,
per-element reference regions and explicit owners. It rejects definition-only or
known-hidden text (including hidden tspan runs), arbitrary catch-all roles, missing
vector entries and wrong label/connector owners. It rejects images/foreign objects, reports
aspect-ratio mismatch, renders matching-size comparison previews, and produces
pixel/alpha diagnostics with source/artifact hashes. It never sets delivery ready.
It cannot OCR the source, identify outlined words among legitimate icon paths,
fully resolve every clipping/paint/visibility effect, recover exact fonts or prove
that declared counts/roles match the source image. Those remain review tasks.
No new dependency or paid API was added. Existing new-design generation defaults
remain in place outside reconstruction mode.

Validation: Skill frontmatter/scaffold validation passed. The latest full regression
record in `test-results-png-reconstruction.txt` passed 58/58 tests, zero skips, about
8.7 s under a 30 s budget. The last visibility-guard correction was then checked
with the focused reconstruction suite: 12/12 passed, including singular matrices
and zero textLength. The independent reviewer reran those focused cases as well.
Tests cover PNG binding, native labels/groups/objects, screenshot insertion, hidden
or definition-only labels, wrong ownership, explicit raster exceptions, original-size
rendering, visible shift detection, non-overwrite behavior and aspect-ratio rejection.
These are synthetic fixtures; no user PNG was supplied or reconstructed in this task.

An independent workflow review is recorded separately in
`PNG_RECONSTRUCTION_WORKFLOW_REVIEW.md`; it is not a visual verdict on any actual
research image. Generated images, earlier layout studies and user files were not
rewritten by this mode addition.
