# Voyager: refined paper-main-figure candidate

Current source: `spec-final.json`. Current exports: `output-final/figure.pptx`,
`.svg`, `.pdf`, `.png`, `.drawio`, plus `preview.png`, QA and independent renders.
The source paper and parent code commit remain fixed; no model, Minecraft, API,
or new caption/skill execution took place.

## What the layout communicates

The central visual group is iterative code refinement: generate a program, execute
it, verify the task, assemble feedback context, then call the model again **if not
done**. Reaching success or the action retry cap terminates the rollout. Feedback
assembly is a parameter-free interface to the existing `render_human_message`, not
another LLM. Its displayed events/critique are selected inputs, not a complete
argument inventory.

The left side is a quieter curriculum/state input rail. The right side is a native
code-and-description catalog, with success-conditioned registration at an explicit
port. Eligible success excludes the source's deposit-useless-items task exception.

Blue header tint = LM computation; green = retained state/skill memory; gray-white
= execution/data interfaces. All fills are solid. Heavier arrows emphasize the
primary within-task loop; dashed paths retain control/temporal meanings. There is
no overall title, subtitle, footer, footnote or legend in the figure.

The displayed `craftWoodenPickaxe.js` conditional really calls the released
`craftCraftingTable` skill. The three library examples and descriptions come from
the author's pinned `skill_library/trial1` artifacts, retained under `source/` with
`example-source-manifest.json` and the parent MIT license. The task slip is explicitly
an example matching that behavior, not an observed new task or a measured top-k set.
The original monochrome native block vignette is illustrative, not a screenshot or
reported environment state. No author paper artwork is embedded in the deliverable.

## Reproduce

From repository root, with installed Node dependencies and Python 3 stdlib:

```bash
python3 paperfigure/examples/voyager-agent/refinement/make_spec.py
python3 paperfigure/examples/voyager-agent/refinement/make_spec_v5.py
python3 paperfigure/examples/voyager-agent/refinement/make_spec_final.py
node paperfigure/scripts/paperfigure.mjs build \
  --spec paperfigure/examples/voyager-agent/refinement/spec-final.json \
  --out /tmp/my-new-voyager-main-figure
node paperfigure/scripts/render-check.mjs /tmp/my-new-voyager-main-figure
```

`make_spec_v5.py` uses the preserved `output-v4/spec.json` as its explicit revision
base; retain that snapshot when distributing this case. New exports need new
hash-bound independent visual review. Existing output destinations are protected.

## Review history and practical limits

Source audits and visual quality verdicts are separate. The first full visual
quality pass rejected v4 despite clean exports: the primary loop and registration
needed deliberate wire tracing. V5 reorganized those relationships and was visually
accepted. The last source review then required the continuation condition on the
return edge, producing the current final candidate. Earlier outputs/rejects remain
under their versioned names rather than being overwritten.

Reports live in repository `docs/VOYAGER_REFINEMENT_*`. Native text, code, module
shapes, illustrations and connector groups remain individually editable. Connector
routes do not auto-follow moved shapes; adjust them after moving modules. Fonts
are installed/resolved locally and PDF fonts are embedded; actual Microsoft
PowerPoint interaction and editing time remain unmeasured.

The environment's full saved-programs/primitives dependency and initial/refinement
query rules are named locally rather than drawing every argument wire. Chest
observations, parse-error branches and all prompt arguments remain outside the
shown overview. No new scientific mechanism, measured success or venue certification
is claimed by a positive visual review.
