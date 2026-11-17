# Agentic 2026 source/provenance re-audit — final

**Scope.** Re-audit of the repaired local source records and
`output-v6/layout-scene.json` for AgeMem and MemSkill. This supersedes only the
findings repaired since `AGENTIC_2026_SOURCE_AUDIT.md`; the earlier report remains
the original evidence record. This is not a visual acceptance of the render in
progress.

## Result

**Source/provenance and editable-topology acceptance: PASS.** No remaining
source-fidelity blocker was found in the requested scope.

The only bounded limitation is that `htmlFigureSHA256` identifies a remote original
HTML asset that is not checked in locally; this audit verified that it is now clearly
separate from the local derivative hash, but did not fetch the remote asset again.
The versioned HTML URL and original-image URL remain pinned in the record.

## Repaired provenance — verified

For each example, `source/provenance.json` now makes the local editable-reference
derivative reproducible:

| Example | Local reference hash verified | PDF hash verified | Derivation bound in record |
| --- | --- | --- | --- |
| AgeMem | `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68` | `49b008ec9220b53166e3b21eaa521a940512fb213fffc8cb844702732ee33f09` | PDF page 2; crop `[375.2, 70.8, 524.5, 267.5]` points; scale 4 |
| MemSkill | `5513b5de64da5929ac09592c51ae95ab078397f51e9e1211f6ce4beab46a3f31` | `806e7bd28fa636ee7f1664e5719f98606955c3ceb2570487fe831488880f63f5` | PDF page 4; crop `[55.44, 67.0634, 541.44, 284.416]` points; scale 4 |

The computed SHA-256 values match the record. The original HTML-image hashes are
retained as distinct `htmlFigureSHA256` values rather than being misrepresented as
the local PNG hash. Both records now carry CC BY 4.0 with local HTML license-link
evidence, the pinned `v1` paper/HTML URLs, declared selected-figure boundaries, and
an explicit `noRedesign` derivation claim. This resolves the previous reproducibility
and license-record blockers.

## MemSkill v6 topology — verified

The five prior topology gaps are repaired in source-faithful form:

| Prior issue | v6 declaration | Source-fidelity assessment |
| --- | --- | --- |
| Segmenter lost as a relation | `operations[]` declares `segmenter` on edge `segmentation`, with `selected-trace` input, `span-sequence` output, and source primitive IDs | **Pass.** Figure 2 presents `Segmenter` as an annotation over the transition, not as a boxed component. Modeling it as an operation on the edge preserves the source semantics without inventing a visible node/box. |
| Reset Every Trace was text-only | Native-text `reset-event` module and `reset-every-trace: reset-event -> memory-bank` edge | **Pass.** This makes the source's trace-local reset invariant machine-readable while retaining it as source text rather than fabricating an algorithmic processing box. |
| Evaluation came from broad `step-loop` | Four source-routed `memory-bank -> evaluation` edges | **Pass.** This now states the caption's constructed-memory-to-evaluation relation. The memory-bank bounding box includes the source caption, avoiding a geometry-only surrogate. |
| Reward targeted a broad container | `optimize-controller: task-reward -> controller` | **Pass.** This matches the caption/method claim that task reward optimizes the controller and avoids incorrectly treating the frozen executor as the optimization target. |
| Designer pipeline used container-to-container edges | `aggregate-cases -> analyze-failures`, alongside explicit cluster/filter/aggregate and analysis/refine relations | **Pass.** The complete source chain is now declared without giving semantic responsibility to layout containers. |

The existing source-backed relations remain intact: span-wise processing; current span
and retrieved memory to controller; bidirectional retrieval interaction with the
trace-specific memory bank; controller-selected skills to executor; executor memory
update; evaluation to task reward/hard-case buffer; hard-case reads, skill evolution,
skill reads, and the designer-to-learning closed loop.

## Operation-on-edge decision

The `Segmenter` implementation is the faithful alternative. In the Figure 2 source,
the label appears on the connection from selected trace toward text spans and is not
enclosed by its own rounded rectangle or card. An additional visible `segmenter`
module would redesign the figure and falsely elevate an edge annotation into a
separate architectural component. The v6 operation object preserves all needed
editable semantics—identity, label, input, output, attached edge, source primitives,
and source rationale—while leaving the visual grammar intact.

## Text, mathematics, scope, and copyright recheck

- AgeMem remains correctly restricted to Figure 1(c): panels (a)/(b) and the external
  caption are excluded. Its query/session, tool/context/memory, answer loop, and
  construction-inset relations remain source-backed.
- MemSkill retains the source text, including the paper figure's `Two-stage Skill
  Evolusion` spelling, intended card overlaps, and the seven source-backed editable
  math substitutions: `x_1`, `x_2`, `x_T`, `M_t`, `x_t`, `M_t`, and `x_t, A_t`.
- No invented core edge, unsupported mathematical restoration, version substitution,
  or copyright/license blocker was observed in the v6 scene records.

## Checks performed

- Read both repaired provenance records and recomputed SHA-256 for each local PDF and
  reference PNG.
- Compared v6 modules, operation metadata, and every declared edge to the already
  inspected version-pinned local PDF/HTML Figure 1(c) and Figure 2 sources.
- Confirmed the repaired edge endpoints for memory evaluation, controller reward,
  designer analysis, and reset semantics.
- Did not run paper/model code or alter any example, source, or renderer artifact.
