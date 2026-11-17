# Agentic 2026 isolated visual review (v11)

Review date: 2026-11-16. Reviewer scope was visual fidelity and editable-layout
quality only. I inspected the six PNGs directly: each source `reference.png`,
the generated-SVG `output-v11/preview.png`, and the independent
LibreOffice-to-PDF native `output-v11/native-render/preview.png`. This is not
an acceptance inferred from JSON QA.

## Verdicts

| Case | Source scope | Verdict | Reason |
|---|---|---|---|
| AgeMem | Figure 1(c) only; comparison panels and external caption excluded | **REVISE** | The semantic layout and labels are complete, but the reconstructed yellow input arrows are visibly thinner/simpler and omit the source's broad, shaded/offset arrow treatment. This is an unnecessary visual change to source-owned line art. |
| MemSkill | Entire Figure 2; external LaTeX caption excluded | **REVISE** | The full information structure survives and the SVG preview is close, but the native render has a visible stray black vertical segment intruding at the left edge/interior of `Aggregate Cases from Each Cluster`. Native output is not presentation-clean until that connector/port artifact is removed. |

## Observed fidelity details

### AgeMem Figure 1(c)

The selection matches `source/provenance.json`: a lossless crop of page 2,
Figure 1(c), explicitly excluding panels (a)/(b) and the external caption. The
source's query/session cards, tool boxes, context/memory blocks, multi-round
loop, and green memory-construction inset are all represented; I found no
missing source label or panel.

Text hierarchy, card placement, enclosing dashed boxes, and all ten semantic
arrows are broadly aligned in both previews. The `output-v11/preview.png`
and native preview also retain the original informal text stack rather than
inventing a new one. The visibly material mismatch is the pair of yellow
down-arrows below the two top cards: source arrows have a substantially wider
shaft/head plus pale offset/shadow geometry, whereas both reconstructions use
a clean, narrow single-color arrow. That changes the source's illustrated
style rather than repairing a collision. The small source-like icons remain
slightly less crisp/consistent in the native output, particularly the memory
icons, but no collision or text clipping was observed.

`layout-changes.json` records only five centered-text adjustments (query,
session content, the two tool labels, and LLM Answer). Those are reasonable
and do not explain or authorize the arrow restyle. `layout-qa.json` says
`visualAcceptance: unreviewed`; its zero-collision result is not a visual
fidelity result.

### MemSkill Figure 2

The selection matches provenance: the entire Figure 2 crop on page 4, with no
external LaTeX caption. All four source regions and their source-owned label
stacks are present: Interaction Traces, Learning to Use Memory Skills,
Skill Bank, Skill Evolution, plus the hard-case and closed-loop structures.
No external caption was added.

The SVG preview retains the source topology closely: trace cards and token
rows, sequential-process cells, memory bank, controller/executor stack, two
skill cards, hard-case fan, vertical read/evolve relations, and bottom
closed-loop path are readable and visually ordered. The native render is
mostly faithful to that SVG, with font realization and small line-weight
differences only. However, a black vertical segment is visibly drawn through
the left boundary/interior of the native `Aggregate Cases from Each Cluster`
box (right-most Skill Evolution column). It does not appear in the source or
the SVG preview. This is exactly the sort of port/connector residue that a
coverage check can miss, so the native PPTX rendering needs repair and a
fresh render review.

`layout-changes.json` records measured centering and two font-fit changes;
the output visually keeps the intended label stacks. The largest recorded
centering shifts are still small relative to their containers (e.g.,
evaluation dy -4.60 and refine-skills dy -3.64). `layout-qa.json` likewise
reports `visualAcceptance: unreviewed`, so its 0 collision count cannot
override the native artifact above.

## Editability and rendering evidence

The supplied native audits report no pictures or media and a 1.0 native
content ratio (AgeMem 165/165, MemSkill 505/505). The reviewed SVGs contain
zero `<image>` tags and respectively 33 and 238 native `<text>` tags; this
supports the claim that neither case is a whole-raster reconstruction or
outlined-text substitute. The native audits explicitly state that XML/native
object evidence is not visual-fidelity evidence, which is borne out by the
MemSkill connector residue.

The independent native previews were rendered by `LibreOffice -> PDF ->
MuPDF`; requested source fonts are listed in their render QA files and no
render errors were reported. This is useful evidence of static native
renderability, not proof of interactive Microsoft PowerPoint behavior. Both
render-QA files state that no interactive Microsoft PowerPoint editing test
was made. In particular, grouped-module movement and rerouting remain an
unverified limitation.

## Required revision gate

1. Restore AgeMem's source-shaped/shaded yellow input arrows without altering
   the approved Figure 1(c) scope or moving source label stacks.
2. Remove the native MemSkill `Aggregate Cases` stray segment/visible port;
   verify all four box boundaries at native render resolution.
3. Re-render SVG and PPTX/LibreOffice after each repair and conduct a fresh
   visual inspection. Do not use a mechanical QA pass as the acceptance gate.

## Exact reviewed artifact SHA-256

### AgeMem

| Artifact | SHA-256 |
|---|---|
| `source/reference.png` | `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68` |
| `output-v11/preview.png` | `e68c95c546444f5414af156d9e620ae3a2b9d117528cad2317799acfa1159910` |
| `output-v11/native-render/preview.png` | `3161c0b95725c28417514b34845d8b126a48642ed574293df9c4ed4467c000f0` |
| `output-v11/editable.svg` | `21bf503e32af9ce22ebf8fb00cdfa8a2a4345589c3325833d357a75220eccd0c` |
| `output-v11/figure.pptx` | `920bd1568c68a5e09f545b65d83900e093fa6332447279f1dd115bd4f0f4f2df` |

### MemSkill

| Artifact | SHA-256 |
|---|---|
| `source/reference.png` | `5513b5de64da5929ac09592c51ae95ab078397f51e9e1211f6ce4beab46a3f31` |
| `output-v11/preview.png` | `a7b1f69dd0b247a6ec89955ca0a2012c3bdb38c2ef2f1904e640920fdb0faf44` |
| `output-v11/native-render/preview.png` | `658ef9359b8d005ca5b5c29dc36eed6449029cd06724870b04a50ed006ab0dc5` |
| `output-v11/editable.svg` | `04ee2ccfba484d7d8d7fdbc983dfbdb1ac09f9fe85522136b8227f97f6ceeea8` |
| `output-v11/figure.pptx` | `1987a526d5b9d679408545e5b356a313ebf859773fa9448019eea4671dfdffca` |
