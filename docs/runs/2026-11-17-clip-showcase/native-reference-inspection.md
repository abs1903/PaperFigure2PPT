# Native reconstruction reference inspection — B2

**Inspection timing:** before native authoring output exists. This is an independent source-image transcript, not an acceptance of a native artifact.

## Frozen target

| Field | Value |
| --- | --- |
| Target | `candidate-b2.png` |
| SHA-256 | `e108391ae577afe2378d6439e86a03270518d3535eebccbfef86d88f4016d758` |
| Canvas | 1610 × 977 px |
| Paper-width diagnostic inspected | `candidate-b2-paper-width.png`, 672 × 408 px |
| Reconstruction mode | Strict native SVG/PPTX reconstruction of selected B2 raster |

The full canvas and 672 px diagnostic were opened directly. Coordinates below are source-pixel regions `[x, y, width, height]`, rounded to the nearest 2 px; they describe painted extents, not inferred font metrics.

## Non-negotiable composition and phase structure

- Horizontal separator: approximately `[20, 598, 1570, 5]`; everything above is **Contrastive pre-training**, everything below **Zero-shot use**.
- Three upper image tiles lead to the upper Image encoder, and three upper text chips lead to the upper Text encoder. Both outputs enter the central 3 × 3 matrix.
- Coral matrix cells are exactly the main diagonal (row/column 1, 2, and 3); the other six are pale-blue off-diagonal comparisons. Do not turn this into isolated pairs or change matrix order.
- Blue/teal dashed reuse routes start at the *upper encoders* and end at their same-modality lower encoders; they route around the matrix and do not originate at it.
- The lower panel takes a new boat image and class-description text into reused encoders, joins normalized embeddings at `Cosine similarity`, then reaches `Nearest label`. Class descriptions route **into** the lower Text encoder. This is conceptual zero-shot use, not execution, a fitted head, a loss, or a measured result.

## Count ledger

| Category | Expected count | Notes |
| --- | ---: | --- |
| Phase header pills | 2 | one upper blue, one lower blue |
| Image example/input tiles | 4 | boat, bird, cup in training; boat in zero-shot |
| Text pair chips (upper) | 3 | `boat`, `bird`, `cup` |
| Encoder modules | 4 | image/text in each phase |
| Matrix cells | 9 | 3 coral diagonal + 6 pale-blue off diagonal |
| Objective/similarity/output modules | 3 | `Symmetric loss`, `Cosine similarity`, `Nearest label` |
| Lower prompt-template box | 1 | literal template, not three braced prompts |
| Lower candidate-class chips | 3 | `boat`, `bird`, `cup` |
| Distinct visible labels | 24 | transcript below; repeated labels remain distinct objects |
| Major semantic connector routes | 13 | collector branches and matrix grid strokes excluded |
| Major pictorial icons | 4 | 2 boat instances, 1 bird, 1 cup; preserve identities/silhouettes |

## Visible text transcript and regions

| ID | Literal text | Region |
| --- | --- | --- |
| `label-train-phase` | `Contrastive pre-training` | `[22, 17, 544, 63]` |
| `label-paired-examples` | `Paired examples` | `[55, 136, 300, 39]` |
| `label-train-chip-boat` | `boat` | `[661, 15, 176, 60]` |
| `label-train-chip-bird` | `bird` | `[864, 15, 176, 60]` |
| `label-train-chip-cup` | `cup` | `[1066, 15, 176, 60]` |
| `label-train-text-encoder` | `Text encoder` | `[765, 132, 378, 60]` |
| `label-train-text-normalized` | `Normalized embeddings` | `[824, 204, 302, 29]` |
| `label-train-image-encoder` | `Image encoder` | `[350, 334, 207, 135]` |
| `label-train-image-normalized` | `Normalized embeddings` | `[571, 350, 151, 56]` |
| `label-image-to-text` | `Image to text` | `[1333, 316, 220, 35]` |
| `label-text-to-image` | `Text to image` | `[1342, 378, 211, 35]` |
| `label-symmetric-loss` | `Symmetric loss` | `[1228, 447, 354, 65]` |
| `label-zero-phase` | `Zero-shot use` | `[21, 622, 331, 61]` |
| `label-new-image` | `New image` | `[52, 703, 182, 34]` |
| `label-same-encoders` | `Same encoders` | `[475, 628, 233, 32]` |
| `label-zero-image-encoder` | `Image encoder` | `[318, 742, 208, 95]` |
| `label-zero-text-encoder` | `Text encoder` | `[649, 742, 211, 95]` |
| `label-class-descriptions` | `Class descriptions` | `[934, 642, 301, 35]` |
| `label-template` | `a photo of a {label}` | `[915, 707, 350, 51]` |
| `label-class-boat` | `boat` | `[936, 772, 99, 51]` |
| `label-class-bird` | `bird` | `[1048, 772, 99, 51]` |
| `label-class-cup` | `cup` | `[1160, 772, 100, 51]` |
| `label-zero-normalized` | `Normalized embeddings` | `[452, 924, 301, 30]` |
| `label-cosine-similarity` | `Cosine similarity` | `[894, 870, 269, 89]` |
| `label-nearest-label` | `Nearest label` | `[1285, 873, 307, 80]` |

## Region and route inventory

| ID | Role / region | Required route or visual relationship |
| --- | --- | --- |
| `train-image-tiles` | image group `[87, 201, 206, 374]` | boat `[88,203,160,114]`, bird `[88,337,160,114]`, cup `[88,464,160,110]`; blue collector into encoder |
| `train-text-chips` | text group `[661, 15, 581, 90]` | three green chip stems merge then descend into upper Text encoder |
| `train-image-encoder` | module `[350, 334, 207, 135]` | collector enters left; blue embedding arrow exits right into matrix |
| `train-text-encoder` | module `[764, 132, 379, 60]` | green collector enters above; embedding branches exit below into matrix columns |
| `all-pairs-matrix` | matrix `[735, 276, 443, 272]` | 3×3 grid; diagonal coral cells `[737,278,147,89]`, `[886,368,146,87]`, `[1034,457,142,89]`; no inference arrow |
| `route-train-image-input` | `[249, 258] → [350, 400]` | blue collector, three tile branches join before upper Image encoder |
| `route-train-text-input` | `[750/953/1153, 75] → [953, 132]` | green collector, three chip branches join above upper Text encoder |
| `route-image-to-matrix` | `[557, 420] → [735, 420]` | rightward blue arrow into matrix mid-left |
| `route-text-to-matrix` | `[811/956/1102, 238] → [811/956/1102, 276]` | three downward green arrows into matrix top |
| `legend-image-to-text` | `[1230, 330] → [1320, 330]` | blue rightward arrow with label |
| `legend-text-to-image` | `[1320, 394] → [1230, 394]` | green leftward arrow with label |
| `route-image-reuse` | `[412, 469] → [412, 741]` | dashed blue, vertical, upper to lower Image encoder |
| `route-text-reuse` | `[1143, 161] → [749, 741]` | dashed green leaves upper Text encoder right edge, routes around matrix, then to lower Text encoder |
| `zero-image-input` | lower boat tile `[53, 747, 180, 121]` | blue rightward arrow into lower Image encoder |
| `zero-class-input` | template/chips `[915, 707, 350, 116]` | green leftward arrow enters lower Text encoder; class text is input |
| `route-zero-image-embedding` | `[427, 836] → [895, 914]` | blue lower route, then arrow into similarity |
| `route-zero-text-embedding` | `[750, 837] → [750, 914]` | green lower route joins blue route before similarity |
| `route-nearest-label` | `[1163, 914] → [1285, 914]` | dark slate rightward arrow from similarity to output |

The 13 major routes are two upper collectors, two upper encoder-to-matrix routes, two legend routes, two reuse routes, two lower inputs, two lower encoder-to-similarity routes, and the output route. Matrix border/grid and short collector branches are component geometry, not extra semantic edges.

## Appearance profile and bounded approximations

- Preserve the wide 1610:977 white canvas, stacked composition, separator, spacing, rounded rectangular language, and blue/teal/coral/slate role assignment.
- Preserve every visible wording, capitalization, line break (notably two-line encoder and `Cosine similarity` labels), arrow direction, and count.
- Mild gradients may become solid role-matched native fills. This is an authorized approximation only; it must not alter hierarchy or semantic color roles.
- The source font cannot be identified from pixels. Use measured Arial / Arial Bold equivalents, with source-like weight/alignment/wrapping, and record substitution rather than claiming font identity.
- Boat/bird/cup contours may be locally simplified only if each identity and major silhouette (sailboat, standing bird, handled cup) remain clear. No raster images or unrelated generic icons.
- No full-canvas raster `<image>`, outlined label paths, title/footer, inference loss/gradient, measured score, or new classifier-training element is authorized.

## Pending native gate

The subsequent review must separately inspect actual SVG, full and 672 px Office-rendered PPTX, target comparisons, object-map/XML audit, typography evidence, and QA. This transcript provides none of those artifacts and gives no pre-emptive pass.
