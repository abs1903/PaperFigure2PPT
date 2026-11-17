# Independent visual review — design output v1

**Reviewer:** `/root/voyager_e2e_review` (independent-agent)  
**Review date:** 2026-11-16  
**Context isolation:** I performed the source audit from pinned source first, then
opened the actual v1 PNG, independent LibreOffice PPTX raster, PDF raster,
exploratory design-study image, design contract, and the local author Figure 2
crop. I did not inspect older output-final reviews, modify the figure, or infer
appearance from QA/native ratio.

## Verdict: revise

The output is a credible, code-generated editable-PPTX candidate with good
cross-format parity, an intelligible central loop, solid semantic fills, and no
overall title/footer. It is **not yet a strong seven-inch paper figure**: its
minimum text is about 7.1 pt, several explanatory routes and labels are too
fine at target width, and quiet route density weakens the primary reading path.
The earlier source-audit cautions are resolved by the v1 pixel review's
overview-level encodings; this is a visual-quality verdict, not a claim that
the export failed.

## Directly inspected artifacts

| Artifact | Observation |
| --- | --- |
| `output-v1/figure.png` | The design is clean and readable when enlarged, with a left-to-right primary story: curriculum → generation → execution → verification → reusable skill. At seven inches, the code excerpt, dotted-route labels, library descriptions, and `Initial`/`Refine` notes are crowded or small. |
| `output-v1/rendered-pptx/figure.png` | Directly inspected. LibreOffice preserves the composition, line styles, solid blue/green tints, arrowheads, text hierarchy, and the Minecraft vignette. There is no apparent clipping or missing connector. |
| `output-v1/rendered-pdf/figure.png` | Directly inspected. It closely matches the PPTX raster; the same small-text limitation remains. |
| `refinement/design-study.png` | Directly inspected as exploratory inspiration only. It is more decorative and more spacious, but it uses a large title, a logo and an image-heavy treatment that the v1 contract intentionally rejects. |
| `dist/agent-papers-comparison/voyager-author.png` | Directly inspected as the author Figure 2 crop. It is a different communication scope, not a pixel/fidelity target. |

## Scientific fidelity (separate from aesthetics)

The selected `learn()` overview is traceable to the audit in
[source-audit.md](source-audit.md). V1 already makes the material overview
distinctions: **“All saved code + primitives”** versus **“Top-k code,”**
**“Events + critique; bounded retries”** plus **“If not done,”** and **“Latest
events / Task history.”** Those are honest abstractions of the pinned code;
the figure need not add another long runtime wire, a numeric retry count, or
every state cache.

The dotted verification-to-registration route says **“Eligible success.”** This
is scientifically safe at overview scope: it does not say every task outcome
is saved. The exact deposit-task exclusion in `voyager/agents/skill.py:61-64`
is omitted, but that is a disclosed implementation condition rather than a
materially misleading claim. Add it only if it can replace, rather than add to,
existing microcopy and remain readable at seven inches.

The bounded-refinement statement is good: “bounded retries” avoids an unlimited
loop claim. “Automatic curriculum,” “latest events,” task history, concrete
released skill names, and the state/library color assignment all communicate
the intended scope. Chest memory and curriculum QA/cache are omitted; that is
acceptable at this overview scale only because the diagram does not claim its
state box is exhaustive.

## Visual-quality assessment (separate decision)

### Strengths

- The central blue workspace is the focal area; the action/program, execution,
  critic, and refine loop have a coherent reading order.
- Blue denotes computation and green denotes retained state/library consistently.
  Fills are solid, restrained, and semantically meaningful rather than merely
  decorative.
- Concrete code and named skill entries make the mechanism tangible. The
  runtime vignette adds modality identity without becoming a second focal point.
- The flat, pale palette and thin rules look professional; the Office and PDF
  rasters retain this character without obvious degradation.

### Limitations requiring revision

- **Typography at target width — fail.** The measured minimum is 7.0875 pt.
  At seven inches, the monospaced code, skill descriptions, dotted-route labels
  (`Query`, `Events`, `Task outcome`), and lower `Initial`/`Refine` notes lose
  easy scanability. Remove or merge redundant microcopy before enlarging text;
  simply shrinking the whole figure would worsen the problem.
- **Secondary routing is too dense.** The dotted feedback/state paths cross the
  lower half and compete with the primary loop. In particular, `Task outcome`
  is visually remote from its target and the library query route has two
  competing labels. Consolidate the two quiet retrieval annotations and use a
  single clean return route; reserve dotted paths for secondary information.
- **Library is visually a little isolated.** Its triple-card stack is
  attractive, but its role in the larger loop is secondary. This is not a
  semantic error—the executor labels the full saved bundle—but slightly
  strengthening the library's compositional relationship to the workspace may
  help if it can be done without adding another long route.
- **The central workspace is a little over-framed.** The outer rounded panel,
  program card, execution card, verify card, and refine card create many
  similarly weighted borders. Preserve the central focal region but reduce one
  enclosing boundary or reduce nonessential card chrome.

## Author-figure comparison (scoped)

The author crop uses a compact three-column layout with circular Minecraft
observations/curriculum progression, a colorful executable-code example, a
plain skill list, and a visibly explicit self-verification fork. Its strengths
are immediate domain specificity and the visually memorable curriculum
progression. Its weaknesses, relative to this v1's stated scope, are denser
microtext, a less systematic state model, and a code snippet that is harder to
scan at small size.

V1 is stronger in editorial order, persistent-state distinction, and
cross-format polish. It is weaker in showing the concrete *world progression*
that makes Voyager memorable: the small generic Minecraft vignette does not
carry as much explanatory weight as the author crop's task snapshots. That is
not a requirement to imitate the author figure—the v1 scope intentionally
foregrounds an audit-friendly refinement architecture—but it is a real visual
trade-off. Neither is declared superior overall.

## Native/technical viability

`qa.json` reports 82 native shapes, 16 native connector segments, 39 native
text boxes, zero pictures, and editable ratio 1.0. The independently rendered
PPTX and PDF were visually inspected and showed the intended full figure.
Thus the delivered file is technically viable as a **code-generated, native
PPTX candidate**. Manual Microsoft PowerPoint editing/reflow was not performed,
and the QA notes that connector endpoints are not automatically attached; a
user moving modules must adjust grouped connector routes. This is a real
editability-cost limitation, not a rendering failure.

## Required re-review inputs

For one focused repair, simplify quiet routes/microcopy and raise all final text
above the current seven-inch readability floor. Do not add a second long runtime
wire or an exception footnote if doing so perpetuates the very microtext/routing
problem identified here. Regenerate into a new output directory and re-open all
three rendered images; descriptions or mechanical QA alone do not resolve this
review.
