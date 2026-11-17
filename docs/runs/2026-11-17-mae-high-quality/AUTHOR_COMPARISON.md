# MAE: author figure versus new editable design

The comparison is qualitative and author-informed. The original Figure 1 was opened before design. This is not a blind reproduction or an independent reader study. The author figure is the CVPR 2022 PDF Figure 1; the new figure has deliberately broader explanatory scope, so detail count is not a quality score.

| Dimension | Original Figure 1 | New B2 design, reconstructed natively |
|---|---|---|
| Main visual argument | A sparse visible-image strip enters a large encoder; a full latent strip enters a small decoder. Length and size carry the argument with very few words. | Explicit four-token lane, 75% mask label, twelve post-encoder mask copies, full 16-position grid, and large/small encoder/decoder contrast. |
| Information selection | Exceptionally economical. Most training bookkeeping is absent. | Adds restore indices, binary mask and a separate masked-only loss explanation. Useful for teaching, but increases density and splits attention. |
| Image identity | Real flamingo patches make image reconstruction immediately recognizable. | Native geometric mountains/sun retain image identity and full editability; less visually rich and less tied to real reconstruction. |
| Loss explanation | Not made explicit inside Figure 1; the caption/method explains masked-only loss. | Explicit same-position 4×4 selector, 12 scored/4 unscored positions and Masked-patch MSE. More self-contained. |
| Paper-width scan | Few labels and long token strips keep the main argument simple. | Upper path is readable; lower selector and metadata routes are the most compressed part at 672 px. |
| Native export | Author's editable source was not supplied or evaluated. | All native shapes/text/connectors, zero embedded pictures/media; exact font identity and interactive PowerPoint editing remain unverified. |

## Assessment

The new run demonstrates an end-to-end deliverable on a paper with a strong original figure. Its strengths are explicit asymmetric token loads, visible timing of mask-token insertion, and a source-correct masked-only objective. Native conversion preserves the selected design and does not introduce a generic flowchart layout.

It does not demonstrate that the new figure is better than the author figure. The author figure remains stronger in visual economy, attention control and photographic image identity. The new one is a useful explanatory variant, with an objective inset that may belong in a second panel or supplementary teaching figure if the intended role is a very compact paper overview. That would be a future composition choice, not a silent reconstruction change in this run.

Initial generation made exact count mistakes in both compositions. A had five blue selector cells; B had a 3×4 selector. One actual attached-image edit corrected B. The first factual pixel report initially missed the full selector issue until a region-specific count audit; all reports and corrections are retained. The protocol benefited from explicit grid counting, not just an overall aesthetic judgement.

No training, quantitative reconstruction, speed measurement, benchmark, superiority rating or generalization result was produced. The new input/output landscapes are diagrams, not measured reconstructions. One author-informed case cannot establish reliable arbitrary-paper design from code alone; source interpretation, ImageGen and manual native authoring were all involved.

Sources: [official CVPR paper](https://openaccess.thecvf.com/content/CVPR2022/papers/He_Masked_Autoencoders_Are_Scalable_Vision_Learners_CVPR_2022_paper.pdf), [pinned official implementation](https://github.com/facebookresearch/mae/blob/efb2a8062c206524e35e47d04501ed4f544c0ae8/models_mae.py). Original figure is retained locally as comparison evidence, not newly authored content.

See [same-width visual comparison](author-versus-office.png), [image-only first reading](first-reading.md), [raster factual review](image-review-b2.md), and the final independent native review in `output-v2/native-review.md`.
