# Reference-driven visual revision and isolated review

Date: 2026-11-15. This revision follows the user's rejection of the initial VLM
visual output. The initial automated tests proved mechanical properties; they did
not demonstrate preservation of the generated design reference.

## Subsequent user rejection

The user rejected V2 as strange and low quality after the scoped agent acceptance.
Its delivery status is now `needs-revision`; the earlier acceptance is retained
as history, not a quality endorsement. See [V2_USER_REJECTION_AUDIT.md](V2_USER_REJECTION_AUDIT.md).

## Independent findings

A fresh reviewer subagent was started with no inherited author conversation or
implementation assessment. It inspected the original generated image, final PNG,
independent LibreOffice render, method/spec and review workflow. Its
[initial verdict was reject](INDEPENDENT_VISUAL_REVIEW.md): the result had become a
sparse generic rounded-card flowchart, losing compact composition, stream identity
and the dominant technical LM region.

The reviewer supplied concrete P0/P1 acceptance criteria and distinguished safe
visual transfer from unsupported scientific additions. The author then built a
separate candidate, preserving the rejected baseline and the exact original semantic
snapshot. A follow-up by the same isolated reviewer independently inspected the
new actual images and [accepted v2 for reference reconstruction](INDEPENDENT_VISUAL_REVIEW_V2.md).
This is not human approval, general top-venue certification or a blind research study.

## Changes

- Added per-node/group/edge appearances and owned artwork to the shared scene.
  This allows deliberate geometry and native scientific motifs instead of forcing
  every design through the same generic card template.
- Reconstructed a compact two-stream layout, lightweight dashed tokenization group,
  dominant LM framing, modality token motifs and restrained training-only endpoint.
- Retained no title, subtitle, footer, legend or fine-print annotation.
- Preserved all seven semantic nodes and six directed edges, source quotations,
  phase assignments and assumptions exactly. No Attention/FFN internals, concrete
  answer, layer count, token count or extra scientific connection was introduced.
- Used the built-in image tool for a separate original scene illustration. It is
  one declared picture object inside the image input. All architecture text,
  module shapes, token motifs and route segments remain native. The object ratio
  is approximately 98.7%; it is not described as 100% editable primitives.
- Added `visual-review.json` records bound to the actual reference and inspected
  spec/SVG/PPTX/PNG/Office-render bytes. `review-status` writes `delivery.json` and
  rejects missing, failed or stale reviews. Mechanical QA alone keeps delivery unready.
- Updated the skill to require independent visual inspection for a reference-driven
  deliverable when delegation is available and authorized. It cannot self-label
  a mechanically valid file as visually accepted.
- The executable VLM example now selects `examples/vlm/revisions/v2/` by default.
  The old VLM is retained explicitly as a rejected visual baseline.

## Verification

The revision suite has **38 passing tests**. New checks cover the separation of
mechanical success and visual acceptance; failed/stale review rejection; exact
semantic preservation; independent asset ownership/content; native architecture
objects; and installation of the reference/illustration files. Existing graph,
overlap, overflow, artifact-tamper, font and reproducibility checks remain intact.
Raw results: [test-results-review-revision.txt](test-results-review-revision.txt).

The independently rendered V2 PowerPoint retains the revised design and passes all
six route alignment checks. The reviewer inspected the full PNG, preview and Office
render rather than inferring quality from those checks. Its review record validates
as `independently-accepted-for-reference-reconstruction`. Regeneration after the
review preserved all inspected artifact hashes.

Current candidate files:

- `paperfigure/examples/vlm/revisions/v2/spec.json`
- `paperfigure/examples/vlm/revisions/v2/design-contract.json`
- `paperfigure/examples/vlm/revisions/v2/output/figure.pptx`
- `paperfigure/examples/vlm/revisions/v2/output/preview.png`
- `paperfigure/examples/vlm/revisions/v2/output/visual-review.json`
- `paperfigure/examples/vlm/revisions/v2/output/delivery.json`

## Remaining limits

The reviewer accepted this bounded reference reconstruction, not every future figure.
Microsoft PowerPoint interactive editing remains unverified; connector segments need
manual adjustment after module moves. Motifs remain non-quantitative. The other two
architecture examples are software fixtures and have not received this independent
visual acceptance. A review record is attributed evidence, not cryptographic proof
that the reviewer was honest or independent; the skill workflow supplies that boundary.
