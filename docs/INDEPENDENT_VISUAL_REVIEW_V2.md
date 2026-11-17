# Independent visual review: VLM v2 reconstruction

## Verdict

**Accept for reference reconstruction, with the scope stated below.** This is a
substantial correction of the previously reviewed candidate. I independently opened
the original generated reference, the v2 preview, the v2 full-resolution PNG, and
the LibreOffice-rendered PowerPoint PNG. V2 satisfies the prior P0/P1 visual criteria
for this bounded illustrative VLM graph. This is not a top-venue-quality
certification and not a human approval.

The companion output-local record,
`paperfigure/examples/vlm/revisions/v2/output/visual-review.json`, binds this
decision to the hashes of the inspected output artifacts and retained reference.

## What now works

- The figure has regained the reference's compact two-stream composition: image and
  visual tokenization occupy the upper-left path; text input occupies the lower path;
  both clearly feed one dominant decoder-only language-model region.
- The input is now a small original scene tile rather than a generic landscape icon.
  The visual-tokenization group is a lightweight dashed enclosure, visually quieter
  than the LM anchor.
- Short teal visual-token blocks and lavender text-token blocks distinguish the
  two modalities without asserting a token count; ellipses make the illustrative
  status legible. The same restrained palette also makes the train-only loss path
  distinct.
- The LM is visibly primary, with a context/token strip and repeated generic decoder
  blocks. It avoids importing the reference's unsupported self-attention/FFN claims
  and does not state a fixed number of layers.
- The dashed LM-to-loss route terminates in a compact purple loss box marked
  “Training only.” It is unambiguous as a separate supervision branch, while the
  answer remains the ordinary inference endpoint.
- No visible title, subtitle, footer, legend, footnote, or provenance/fine-print
  annotation is present. The title/subtitle only remain as specification metadata.
- The independent LibreOffice render retains composition, text hierarchy, token
  motifs, dashed route, and arrow directions. Its supplied route check passes all
  six edges.

## Semantic and editability checks

The semantic snapshot of v2 exactly matches the original VLM specification
(`81ef27c1b2399d65af965744cee835198f52edfc3d6809d3184dd20643c1808d`): seven
nodes, six directed edges, and the same phase assignments. The visual treatment
therefore does not add attention/FFN internals, a decoder/token count, output answer
content, an optimizer path, or another connection.

The supplied mechanical QA passes and reports native text, 64 native shapes, and 10
native connector segments. It reports one picture object: the source-safe illustrative
scene tile within the image-input module. This is not a rasterized full-canvas figure;
the module boxes, labels, token motifs, routes, and endpoints remain native/editable.
The existing implementation limitation remains: connector segments are not
auto-attached, so module moves require manual route adjustment.

## Concrete remaining limitations

1. The reviewed render target is LibreOffice. Actual interactive rendering/editing in
   Microsoft PowerPoint remains unverified.
2. The visual token squares and repeated decoder blocks are intentionally
   non-quantitative motifs. A paper caption should not convert them into a claim of
   exact token/layer counts.
3. The assessment is a reference-reconstruction decision for this explicitly
   illustrative example. It does not establish general top-conference/journal
   readiness for other figures or layouts.

## Evidence inspected

| Artifact | SHA-256 |
| --- | --- |
| Original reference `examples/vlm/design-reference/imagegen-v1.png` | `c10dcce0a77ff07fbdf8857eff1a30eb8eca44e0fa8118e150a087d4b6946809` |
| V2 `output/spec.json` | `533756ada0cbd144288dbebcbc7e691292d35aa0fe4f301d118a3d58531cfe55` |
| V2 `output/figure.svg` | `2b459673dd3ae1b95b8939ef0eec372e927fcc1c335dbeb2207364d26a7ed592` |
| V2 `output/figure.pptx` | `63d9a97c00ed2cf69c729182c44b821506c8c7e7e76ad39be6e4d3054d6adda1` |
| V2 `output/figure.png` | `e781bd9ecdb8bbab3930c16eec702661b0a1ab30ac78a1d03d6731a23c096e72` |
| V2 `output/rendered-pptx/figure.png` | `e2cc544eb8e275ae25ac00354f339afb044b7899cdca181be884a6be4d553de3` |
