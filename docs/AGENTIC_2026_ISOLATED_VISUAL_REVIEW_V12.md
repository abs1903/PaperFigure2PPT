# Agentic 2026 isolated visual review (v12)

Review date: 2026-11-16. I directly inspected, at normal display scale, the
source `reference.png`, v12 SVG `preview.png`, and independently rendered
v12 `native-render/preview.png` for both cases. This review is visual and is
not an acceptance inferred solely from the passing QA JSON.

## Verdict

| Case | Reviewed source scope | Verdict |
|---|---|---|
| AgeMem | Figure 1(c) only; other panels and external caption excluded | **PASS** |
| MemSkill | Entire Figure 2; external LaTeX caption excluded | **PASS** |

## Visual findings

### AgeMem Figure 1(c)

The selected scope is correct: query/session cards, management/tool region,
context and memory blocks, multi-round response, and green memory
construction inset are all present. No labels or source-owned panel is
missing, and no external caption was added.

The two gold input arrows now have proportionate broad shafts and heads in
both previews and have clean native arrowheads. They deliberately use a solid
gold fill. The omitted source pale offset/shadow is not a defect: the explicit
current constraint is solid colors and no strange gradients/shadows. The
remainder of the arrows, card placement, dashed structures, centering, text
stacks, and line routing remain visually coherent. The recovered icons retain
minor source-font/icon approximation, but are legible and do not create a
collision or change information.

### MemSkill Figure 2

All four source regions, source-owned label stacks, trace/token cards,
sequential-process cells, memory-bank/controller/executor area, skill cards,
hard-case buffer, evolution column, and closed-loop route are present. SVG
and native previews are mutually faithful at normal display scale. The
aggregate and analysis box outlines are now clean, with connector lanes held
outside their visible boundaries; no connector crosses their text or leaves a
native-only border intrusion.

The prior v11 concern was revised after the zoom comparison requested by the
author: the small mark at the Aggregate Cases boundary occurred in the old
SVG as well as the native render, so it was not a native-only renderer
artifact. V12's calibrated outlines/endpoints remove the visually objectionable
intrusion while preserving the source's connector topology.

## Evidence and limits

Both `layout-qa.json` files pass with `visualAcceptance: unreviewed` (AgeMem:
33 texts, 10 edges; MemSkill: 238 texts, 38 edges) and zero recorded
collisions. Both independent `render-qa.json` files pass with zero errors and
1.0 coverage for every checked edge, using `LibreOffice -> PDF -> MuPDF`.
Those results support, but do not replace, the direct visual inspection above.

The v12 native audits report no pictures/media and fully native content:
AgeMem 165/165 objects; MemSkill 505/505. The reviewed SVGs contain no
`<image>` tags and contain 33 (AgeMem) and 238 (MemSkill) `<text>` tags. This
supports editable text and rejects a whole-raster or outlined-text delivery.

Material limitation: this verifies static LibreOffice rendering only. Neither
case was interactively edited in Microsoft PowerPoint, so post-move connector
reflow and final Microsoft font behavior remain unverified. The documented
source-font/icon recovery approximations are accepted only as such; this PASS
does not claim pixel-identical recovery of those source assets.

## Exact reviewed artifact SHA-256

### AgeMem

| Artifact | SHA-256 |
|---|---|
| `source/reference.png` | `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68` |
| `output-v12/preview.png` | `94775f0f7150b68127ce00e64f2d6945210fd46d045f83dc398030a3f5c0f74d` |
| `output-v12/native-render/preview.png` | `f37776644b164ab52e9bba87359c9e1a5fa2496a3d3a2b081cbb8cee75e8c7ed` |
| `output-v12/editable.svg` | `272bae277c5f893626ff968a2a740d4347c293721338da8caf940bf663e8ae72` |
| `output-v12/figure.pptx` | `f02e46f646fd72e7d307d51d572572ab4cbc0b0fdad7cb7194bd0636ad714ff4` |

### MemSkill

| Artifact | SHA-256 |
|---|---|
| `source/reference.png` | `5513b5de64da5929ac09592c51ae95ab078397f51e9e1211f6ce4beab46a3f31` |
| `output-v12/preview.png` | `73fc14c4ed088b45d69dafdd2506c7f8c02547449d279262aaf7726cc2fad473` |
| `output-v12/native-render/preview.png` | `f99784defa580759a1dbb7816c08104d375fd47a3f49643b1460cdcedf6945ac` |
| `output-v12/editable.svg` | `d0bf3245a9023c12bbb6db51b775480b2f169d2c7db58d4e6e685d56b57bdaf1` |
| `output-v12/figure.pptx` | `3de529fae8ea1c75b9e48884808371a5e9622fe3bdcde3701e8264817162a3a1` |
