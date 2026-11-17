# Agentic 2026 source audit — v11 addendum

**Scope.** Source-semantics re-audit of `output-v11/layout-scene.json` for the
pinned AgeMem and MemSkill examples. This addendum retains the v6 PASS and examines
only the subsequent painter-order, transfer-band, notation, and native-math changes.
It is not a visual-render acceptance.

## Result

**PASS — no new source, provenance, relation, text, or math blocker.** The source
records remain bound to the same local reference PNGs and PDFs:

| Example | Verified local PNG SHA-256 | Verified PDF SHA-256 |
| --- | --- | --- |
| AgeMem | `8a2ab882b9a3a73615d237e1cb0aa1ffffa181cced23ec9e9dc990bd552e0c68` | `49b008ec9220b53166e3b21eaa521a940512fb213fffc8cb844702732ee33f09` |
| MemSkill | `5513b5de64da5929ac09592c51ae95ab078397f51e9e1211f6ce4beab46a3f31` | `806e7bd28fa636ee7f1664e5719f98606955c3ceb2570487fe831488880f63f5` |

The provenance records still preserve the page/crop/scale derivation, separate
original HTML-image hash, pinned `v1` URLs, and CC BY 4.0 evidence.

## V11 changes assessed

### Preserved card painter order — pass

MemSkill v11 has 203 `opaque-label-occlusion` exceptions in addition to the existing
intentional card-overlap exceptions. Each exception is bounded to a specific label and
later card shape, declares that it preserves original PDF painter order, and records
both a geometry hash and the checked source-reference SHA-256. This is a presentation
constraint for the source's intentionally stacked skill and failure-case cards; it
does not add a module, operation, edge, label, or mechanism. The exceptions are
therefore source-faithful rather than an attempt to conceal an unsupported element.

### Four blue transfer bands — pass

The new `trace-transfer-band`, `read-skills-band`, `hard-case-transfer-band`, and
`evolution-transfer-band` modules are explicitly tagged `source transfer-channel
background`, are non-routing containers, and contain only the flat source-color path
behind the existing transfer channels. They introduce no edges or operations. This is
a faithful editable recovery of the visible blue channel backgrounds, not a claim of
four additional mechanisms.

### Restored `M_t` / Retrieved Memory notation — pass

V11 introduces two non-computational notation groups:

- `memory-token-notation` owns the native `M_t` glyphs.
- `retrieved-memory-notation` owns the native `Retrieved Memory` label.

Their double-arrow link is explicitly marked: `Source bidirectional notation linking
M_t and Retrieved Memory; not an agent action.` This matches the Figure 2 notation
between the retrieved-memory token and its label, while preserving the actual
architecture relations separately (`memory-bank <-> retriever`, `retriever ->
controller`). It does not introduce an unsupported runtime action or feedback loop.

### Native mathematics and shifted executor inputs — pass

The seven source-backed native math recoveries are unchanged: `x_1`, `x_2`, `x_T`,
`M_t`, `x_t`, `M_t`, and `x_t, A_t`. Moving the final `x_t, A_t` notation left of an
arrowhead is a placement-only adjustment: text content, source identity, ownership,
and the controller-to-executor relation are unchanged. No formula, variable, or
mathematical claim was added.

## Completeness recheck

- Every v6 native text primitive is retained in v11; v11 adds no semantic prose or
  architectural label.
- AgeMem’s Figure 1(c)-only scope, labels, ten source-supported edges, and no-math
  status are unchanged.
- MemSkill retains the complete source-backed v6 topology: edge-operation Segmenter;
  per-trace reset; memory-bank-to-evaluation; task-reward-to-controller; the explicit
  hard-case/designer pipeline; and the designer-learning closed loop.
- The only added declared edge is the explicitly non-computational `M_t` ↔ Retrieved
  Memory notation link. Its meaning is sufficiently constrained to prevent it from
  being interpreted as an agent mechanism.

## Checks performed

- Recomputed the local PDF and reference-PNG SHA-256 values and compared them with
  `source/provenance.json`.
- Compared v6 and v11 text primitives, core modules, relations, and math records.
- Inspected the new bands, notation modules, notation-edge metadata, and exception
  metadata against the already inspected pinned Figure 2 source.
- No code, example, source, or render artifact was edited; no paper/model code ran.
