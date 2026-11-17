# Voyager Imagegen Reconstruction — Independent Review V9

## Verdict

**FAIL for reference fidelity; PASS for native editability.** V9 introduces a material code-typography regression: the SVG preview and independently rendered PPTX no longer agree with one another or with the source. This report preserves the V8 revise report and evaluates V9 independently.

| Dimension | Verdict | Scope |
| --- | --- | --- |
| `referenceFidelity` | **FAIL** | The program-code font family/metrics change materially alters line widths and visual weight. This exceeds the only permitted gradient/shading-to-flat-fill change. |
| `svgNativeEditability` | **PASS** | Native text/vector representation remains present; no raster or gradient elements found. |
| `pptxNativeEditability` | **PASS** | Native DrawingML text/shapes/connectors/groups; no pictures, blips, media payload, or gradients found. |

## Measured native-pixel evidence

The measurement uses the unscaled source and candidate pixels, crop `x=590:908, y=456:480`, dark-pixel threshold, and tight bounds. It is not based on a resized display.

| Render | Dark-pixel bounds within crop | Width × height |
| --- | --- | --- |
| Source | `(608,463)–(893,479)` | `287 × 18 px` |
| V9 SVG preview | `(608,467)–(761,478)` | `154 × 18 px` |
| V9 PPTX render | `(608,466)–(832,479)` | `225 × 17 px` |

The source code run and V9's SVG/PPTX runs therefore have incompatible horizontal metrics. The V9 SVG code is substantially compacted; the V9 PPTX differs from both it and the source. Direct visual inspection agrees: the program document, retrieved-code bullets, line numbers, and code symbols render in a markedly different sans-mono treatment, not merely a flat-color conversion.

## Required repair blocker

Restore a source-matched monospaced typeface/metrics consistently in both the SVG renderer and the PPTX renderer. Verify the relevant native pixel crop before approving a replacement:

1. Preserve native text, literal wording, source line breaks, syntax colors, and module geometry.
2. Do not compensate by changing composition or rasterizing the code block.
3. Compare source/SVG/PPTX dark-pixel bounds at native resolution; a visually matched SVG alone is insufficient.

## Structural checks and limitations

The V9 SVG declares 69 text elements and no image/gradient/foreignObject elements. PPTX XML has 159 shapes, 32 connectors, 56 groups, 74 text runs, zero pictures/blips/gradient fills, and no actual media/embedding payload. Its object map retains module-owned icon groups. These facts support editability only; they do not offset the visual failure.

Independent PPTX rendering is LibreOffice headless -> PDF -> `pdftoppm`, not Microsoft PowerPoint. This review does not certify source scientific correctness, recover the original font license/provenance, or certify a publication-quality figure.

## Hash-bound review set

| Artifact | SHA-256 |
| --- | --- |
| `reference.png` | `d3e87edda4269dfaea5360a71b497b7fd42a47d19ec1da2aaa89743edc1a716f` |
| `output-v9/inventory.json` | `42583ff7ff3b1755d34c9cc4fcdb22131129ceb4d4fc15d762663ec15acf2afb` |
| `output-v9/figure.svg` | `7cefaa64786817fab7738837da828f4bbfe8b9a7ee39bf3bedc3398388880f6e` |
| `output-v9/figure.png` | `81a2dba56c6a8ceb20454c64195fc032b5dcc348af5c09158efd79e5072f2885` |
| `output-v9/figure.pptx` | `69fa6493fec1902d6b9d0d9acd677ae3032ccada8855d49fcf2871ac9d6b35e4` |
| `output-v9/pptx-render/figure.png` | `7bd658a090e6bc84743db850f0d3b80c72cf4b295413de34c5b5cbdc04a0853f` |
| `output-v9/pptx-object-map.json` | `c7b613e7185f7df33440d647099e5341f93fd03a79ac28270b99d301b7001595` |
| `output-v9/pptx-native-audit.json` | `faf06075a727a2e5d4f5c0ddf7a103e546847b7ef7c13370217e92b5f4be9471` |
