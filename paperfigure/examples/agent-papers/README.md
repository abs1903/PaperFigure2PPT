# Three source-audited agent papers

Solid-fill architecture overviews from pinned official code, with original layouts
and native text, shapes and connectors. No generated architecture bitmap is used.

| Case | Source route | Current spec | Current output |
| --- | --- | --- | --- |
| ReAct, ICLR 2023 | Official HotpotQA notebook `webthink` | `../react-hotpotqa/spec-reviewed.json` | `../react-hotpotqa/output-reviewed/` |
| Reflexion, NeurIPS 2023 | `ReactReflectAgent`, REFLEXION strategy | `../reflexion-hotpotqa/spec.json` | `../reflexion-hotpotqa/output/` |
| Voyager | Automatic curriculum `learn()` | `../voyager-agent/refinement/spec-final.json` | `../voyager-agent/refinement/output-final/` |

Each output has `figure.pptx`, `.svg`, `.pdf`, `.png`, `.drawio`, `preview.png`,
`spec.json`, `scene.json`, structural QA, source-PDF and Office renders, hash-bound
independent review and `delivery.json`. New renders require fresh review hashes.
All three current figures are entirely native objects with no image asset.

## Reproduce

From the repository root:

```bash
npm --prefix paperfigure ci
python3 paperfigure/examples/agent-papers/make_specs.py
python3 paperfigure/examples/agent-papers/make_revisions.py
node paperfigure/scripts/agent-examples.mjs /tmp/my-new-agent-figures
node paperfigure/scripts/render-check.mjs /tmp/my-new-agent-figures/react-hotpotqa
node paperfigure/scripts/render-check.mjs /tmp/my-new-agent-figures/reflexion-hotpotqa
node paperfigure/scripts/render-check.mjs /tmp/my-new-agent-figures/voyager-agent
```

The batch renderer refuses a nonempty output root; without an argument it creates
a fresh temporary directory and prints its path. `npm run examples` inside the
skill now uses this solid-fill agent set. Python generators construct
case-owned specs; they never run external model or environment code. For an installed
skill, omit the leading `paperfigure/` in these paths. The generated sources are
sufficient to redraw offline after npm dependencies and fonts are installed.

Each case retains METHOD.md, original selected source files and their MIT license,
a source manifest, a semantic palette contract and an initial figure freeze. The
ReAct `hotpotqa_code.py` is derived from notebook code cells without executing them.
These repository snapshots are separate from the source-paper figure licenses.

## Visual and scientific contract

- Solid fills only. Blue = language-model computation; green = retained context
  or memory; neutral gray-white = external execution, parameter-free operations
  and I/O. Lifetime is local: current-question state in ReAct, same-agent retry
  memory in Reflexion, persistent code library in Voyager.
- No title, subtitle, footer, footnote or legend inside any actual figure. Gallery
  and comparison labels belong to contact sheets outside the figure artifacts.
- Native editable typography, modules and connector segments; routes do not
  automatically follow moved shapes. Microsoft PowerPoint interactive editing
  cost remains unmeasured; LibreOffice renders were inspected.
- ReAct shows the seven-step cap and forced-empty termination; Reflexion explicitly
  uses exact match rather than an LM evaluator; Voyager separates retrieved
  prompt code from all programs/primitives sent to the runtime.
- Voyager's latest-events curriculum input is named locally; its separate wire is
  omitted. The overview does not enumerate all arguments or helper model calls.
- No models, paid APIs, weights or external environments were run. This is source
  reconstruction, not reproduction of paper performance.

## Freeze and review history

The initial complete specs and native output files were frozen before visually
viewing author figures within this run. This does not exclude prior model knowledge
or textual search snippets. ReAct's explicit cap correction was authored before
parent author-image inspection; Voyager's local latest-events wording correction
was authored afterward. Original rejects and frozen artifact hashes are preserved.
Reflexion was accepted on its initial frozen native layout.

See repository `docs/AGENT_PAPERS_COMPARISON.md` for actual source/author figure
locations, code audits, review records and limitations. Author images are local
analysis crops in ignored `dist/agent-papers-comparison/`; their redistribution
rights were not established, so they are not bundled with the installable skill.
