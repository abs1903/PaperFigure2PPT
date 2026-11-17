# Case selection and retained regressions

Read only the case relevant to the current task. Example acceptance applies to
its frozen inputs and scope; it is not a universal layout or font prescription.

| Need | Closest source or fixture | Scope and cautions |
| --- | --- | --- |
| VLM design | `examples/blip2-opt-code/spec-solid.json` | Current solid-fill style; source-audited OPT branch |
| Tool/LLM agent | `examples/agent-papers/README.md`, then ReAct, Reflexion or Voyager | Choose by mechanism; retain pinned source scope |
| PNG reconstruction | `examples/voyager-imagegen-reconstruction/README.md` | Coordinates and crop inventory belong to its frozen PNG, not an automatic vectorizer |
| Typography regression | `assets/typography/goldens.json`, `examples/typography-regression/` | Frozen AgeMem v15 / MemSkill v13; never overwrite accepted artifacts |
| Geometry/export history | `examples/llava-paper/` | Historical spatial guidance; gradients are not a new-design default |
| Contribution-bound ImageGen brief | [paper-narrative.md](paper-narrative.md#bind-the-plan-to-a-version-11-brief) | New version 1.1: source-supported contribution cues and selectable composition alternatives |
| Legacy brief regression | `examples/lats-hotpotqa/design-study/design-brief-v2.json` with `spec-figure.json` | Version 1.0 draft only; retain exact legacy prompt, not a new-design default; LATS has no accepted final figure |

The generic VLM/V2 studies were rejected and remain negative/regression evidence.
A scoped fidelity acceptance did not meet the user's design bar. Preserve the
review history and candidate-local user rejection rather than reusing these as
accepted style templates.

The LLaVA user approval concerned study C's spatial layout, not all later native
exports. A PDF font fallback dropped phi despite good PNG/PPTX appearances; each
requested format still needs actual inspection.

The frozen MemSkill scene requests legacy `Verdana-Bold`, while actual Office
rendering uses a fallback for `Skip`. This defect must remain detected; preserving
a fixture does not waive actual-font checks for new deliveries. See
[typography.md](typography.md) for the correction and regression protocol.

Keep source/author comparisons, full failure evidence and historical review reports
in the repository's established `docs/` records. Installed workflow guidance must
remain usable without repository-level documents.
