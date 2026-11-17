# Candidate A native-reference inspection

**Inspector:** `/root/clip_refinement_pixels`  
**Source inspected:** `candidate-a.png` only, SHA-256 `5b40d80ea1cbf366460e0c65d884a73969cba94f6adf7005495d20c8e667f8d8`, 1609 × 977 px  
**Status:** pre-output pixel inventory for reconstruction. No native scene, Office file, or future reconstruction was inspected or used.

Coordinates below are visual registrations in source pixels, rounded to the nearest few pixels; use them as reconstruction anchors, not an assertion of hidden object bounds.

## Regions and 16 semantic module groups

| # | Group | Approximate visible region (x, y, w, h) | Pixel inventory / reconstruction invariant |
| --- | --- | --- | --- |
| 1 | Upper phase heading | 49, 26, 485, 43 | Unboxed `Contrastive pre-training`, dark regular/medium sans, left aligned. |
| 2 | Paired training-image batch | 83, 201, 170, 376 | Three thin, pale rounded cards stacked: boat, bird, cup. Their right-side blue lines share one vertical merger. |
| 3 | Upper Image encoder | 350, 333, 207, 131 | Pale blue rounded rectangle; two-line `Image` / `encoder`. |
| 4 | Training caption batch | 659, 15, 580, 111 | Three pale-green chips (`boat`, `bird`, `cup`) above a shared green bus. |
| 5 | Upper Text encoder | 763, 132, 379, 60 | Pale-green rounded rectangle; `Text encoder`. |
| 6 | All-pairs matrix and embedding inlets | 735, 207, 445, 343 | `Normalized embeddings` appears at top and left; crisp 3 × 3 grid, with row inlet from upper Image encoder and column inlet from upper Text encoder. |
| 7 | Retrieval-direction cues and loss | 1229, 318, 354, 194 | Blue right arrow `Image to text`, green left arrow `Text to image`, then pale-warm `Symmetric loss` pill. Keep upper/training-only. |
| 8 | Lower phase heading | 49, 633, 247, 42 | Unboxed `Zero-shot use`, matching the upper heading treatment. |
| 9 | Reuse annotation and dashed routes | 411, 160, 794, 580 | `Same encoders` at about 480, 635. Blue dashed route descends from the upper Image encoder to the lower Image encoder; green dashed route leaves upper Text encoder, goes around matrix right, then descends to lower Text encoder. |
| 10 | New-image query | 53, 707, 177, 161 | `New image` over one thin rounded card containing the boat. |
| 11 | Lower Image encoder | 315, 744, 211, 93 | Pale-blue rounded rectangle; two-line `Image` / `encoder`. |
| 12 | Class-description inputs | 916, 639, 349, 185 | `Class descriptions`; one template chip `a photo of a {label}`; three separate class chips `boat`, `bird`, `cup`. |
| 13 | Lower Text encoder | 648, 743, 211, 93 | Pale-green rounded rectangle; two-line `Text` / `encoder`; incoming green arrow points left into it. |
| 14 | Lower normalized-embedding convergence | 428, 836, 467, 80 | `Normalized embeddings` at bottom left; blue and green lower encoder output routes meet before the similarity block. |
| 15 | Similarity operation | 894, 871, 269, 88 | Pale-warm rounded rectangle; two-line `Cosine` / `similarity`. |
| 16 | Output label | 1288, 875, 302, 80 | Quiet pale-neutral rounded rectangle; `Nearest label`, reached by gray arrow. |

## Exact visible text inventory

In reading order, including repeated labels: `Contrastive pre-training`; `boat`; `bird`; `cup`; `Paired examples`; `Text encoder`; `Normalized embeddings`; `Image encoder`; `Normalized embeddings`; `Image to text`; `Text to image`; `Symmetric loss`; `Zero-shot use`; `Same encoders`; `New image`; `Image encoder`; `Text encoder`; `Class descriptions`; `a photo of a {label}`; `boat`; `bird`; `cup`; `Normalized embeddings`; `Cosine similarity`; `Nearest label`.

Text that wraps in the visible reference: upper/lower `Image encoder`, lower `Text encoder`, and `Cosine similarity`. The upper `Text encoder` and `Nearest label` are single line. No title banner, subtitle, footer, step number, explanatory paragraph, score, or legend text beyond the listed strings is visible.

## Matrix inventory

Matrix bounds are approximately x=735–1180 and y=277–550; each of its nine cells is about 148 × 91 px. The warm paired cells are exactly top-left, center, and bottom-right. The remaining six cells are pale neutral. The matrix has three green column-arrow endpoints from the upper text route and one blue row-side inlet from the upper image route. There are no numbers, symbols, scores, or text inside matrix cells.

## Connector-route and junction inventory

Counting a continuous same-role connector bundle from source group to destination group as one route (multi-branch buses are one route), there are **13 visible connector routes**:

1. three training cards → upper Image encoder (blue merged bus);
2. three caption chips → upper Text encoder (green merged bus);
3. upper Image encoder → matrix row inlet (blue);
4. upper Text encoder → three matrix column inlets (green fan-out);
5. blue `Image to text` directional cue;
6. green `Text to image` directional cue;
7. upper Image encoder → lower Image encoder (blue dashed reuse);
8. upper Text encoder → lower Text encoder (green dashed reuse);
9. new boat → lower Image encoder (blue);
10. class-description group → lower Text encoder (green, left-pointing endpoint);
11. lower Image encoder → similarity (blue orthogonal route);
12. lower Text encoder → similarity (green orthogonal route);
13. similarity → nearest-label output (gray).

Using a visible three-or-more-way meeting as a junction, there are **8 junctions**: one upper-image merger, three caption-bus joins, three matrix-column fan-out joins, and one lower embedding convergence. Ordinary elbows, rounded-card contacts, and isolated arrow cues are not counted as junctions. The upper `Symmetric loss` label has no visible matrix-to-loss connector; retain it as the adjacent training-only objective annotation rather than inventing an unobserved arrow.

## Changed object contours relative to the baseline raster

- **Boat (three training objects and lower new-image object):** now has a two-tone triangular sail (dark left sail and lighter blue right sail), a dark tapered hull, and a thin pale wave band/three curved wave marks beneath. The new-image boat matches the boat vocabulary. Keep the sail facets, hull, and wave treatment as separate simple paths; do not substitute a photo or a solid baseline boat.
- **Bird:** now has a rounded dark blue body/head and beak, a small eye, pale-blue wing/breast contour/highlight, thin feet, and a small sage sprig with two leaves at lower right. The decorative contour and sprig are visibly thinner than the body and should be checked after publication-width rendering.
- **Cup:** now has a tapered dark blue cup body, pale elliptical rim/interior, a light rim accent, and a distinct right-side handle with pale interior. It is a simple flat silhouette with a few contour paths, rather than the baseline's single heavier solid glyph.

## Reconstruction cautions

Rebuild only what is visible here: two independently routed dashed reuse paths, the exact three-by-three diagonal, the phase split, and the listed text. Preserve the quiet palette and thin outlines, but validate actual font metrics, text extraction, connector attachment, and 7-inch legibility only after native output exists. This inspection makes no Office or native-artifact acceptance decision.
