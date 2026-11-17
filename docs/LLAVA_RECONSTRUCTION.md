# LLaVA C: native reconstruction and verification

Date: 2026-11-15. Current scope: the paper-grounded architecture-only LLaVA example.
The other two agent examples remain software fixtures without this visual review.

## Design decision and source

The initial generic VLM and V2 were rejected by the user. An isolated audit found
that narrow reference fidelity and passing geometry tests had been mistaken for
sufficient visual quality. Both failures and their audits remain in the repository.

The new case uses an explicitly authored summary of the original LLaVA paper,
Sections 4.1–4.2, rather than silently adding details to the old illustrative source.
The user liked study A's finish but rejected the detached training panel and awkward
composition. Study C removed that panel and realigned the two modality lanes. The
user explicitly accepted C's layout. That preference does not imply blanket approval
of every future native export.

The final native figure preserves C's canvas, module positions/dimensions, photo
crop, typography family choices, palette, rounded geometry and subtle gradients.
Its scientific changes were reviewed independently: learned-linear W and a language
response label are explicit; unsupported pseudo-layer filler is replaced with
source-supported autoregressive decoding and representation-level conditional
notation. The conditional expression is a shorthand, not a transcription of the
paper's Equation 3. Training stages remain in METHOD.md and are omitted from the
architecture figure as requested. There is no visible title, footer, legend or fine print.

## Editable construction

- Six semantic nodes and five directed edges, each traceable to the retained summary
  and primary-paper locator; this is not a new-science claim.
- 79 native PowerPoint shapes, including 19 native text boxes; 11 native connector
  segments grouped into five logical routes; one independent photo viewport.
- Approximately 98.9% native objects. No full-figure bitmap is used as the visible
  architecture. The retained source image supplies the cat-photo crop only.
- Gradients are native DrawingML fills. Math uses native text/rich runs, italic serif
  variables and native subscript formatting, with editable font/size settings.
- Module moves still require route adjustment. Interactive Microsoft PowerPoint
  editing is not verified; LibreOffice rendering is verified.

## All-format verification

An isolated reviewer inspected the user-accepted C reference, actual PNG/SVG output,
independently rendered PowerPoint and PDF. The review record binds its verdict to
actual spec/SVG/PPTX/PDF/PNG/Office-render hashes. See
[LLAVA_NATIVE_REVIEW.md](LLAVA_NATIVE_REVIEW.md).

A PDF-specific failure was found after the initial native review: the SVG-to-PDF
fallback replaced serif math and dropped phi even while PNG/PPTX looked correct.
The fix resolves and embeds actual installed fonts. PDF font weight is explicitly
named, rather than relying on a numeric CSS weight the library did not interpret.
The corrected PDF was rasterized and visually re-reviewed; text extraction confirms
that `fφ` and the conditional notation survive.

`render-check` now checks both independent Office and PDF rasterization, route
alignment, and PDF label presence. All five routes have 100% sampled alignment in
both renders; all PDF labels are present. These checks are not aesthetic scores.
One mechanical warning remains for the non-Latin phi metric estimate; the actual
glyph was visually checked and extracted correctly in the PDF.

The current automated suite has **41 passes, 0 failures, 0 skips**. It includes:
semantic/phase/source checks, typography controls, overlaps, original-text and
route consistency, tamper detection, native gradients, photo viewports, embedded
PDF fonts/phi, reproducibility, installation, rejected/stale visual reviews, and
user rejection taking precedence over a scoped agent pass.
Raw result: [test-results-llava-native.txt](test-results-llava-native.txt).

The skill validator also passed. A clean copy was installed outside the workspace,
its locked dependencies installed from cache, and its LLaVA spec built with the
same local CLI. No provider API key or paid external service was called.

## Files and remaining boundaries

Source: `paperfigure/examples/llava-paper/spec.json`, `METHOD.md`, and
`design-contract.json`. Outputs: `paperfigure/examples/llava-paper/output/`.
The actual review is `output/visual-review.json`; `review-status` produces
`output/delivery.json`. User rejection overrides a scoped agent acceptance.

The accepted scope is this concrete native reconstruction, not a certification of
NeurIPS/ICML/ICLR/CVPR/journal readiness, general autonomous design quality, or a
human/user acceptance of the final native image. Original method claims still need
researcher review in a real paper. Installed font versions can affect rendering on
another machine. The gallery's other agent figures have not received this review.
