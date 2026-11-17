# Voyager refinement v5 source review

## Verdict: revise

This static review checks only `refinement/spec-v5.json` and
`refinement/make_spec_v5.py` against the pinned Voyager sources and the v4 audit.
No generator, model/API, or environment code was run, and this is not an
aesthetic assessment.

## Source-supported v5 changes

- **Refine prompt** is a valid visual-only grouping of existing prompt assembly,
  not an extra language model. After a parsed program execution, the orchestrator
  passes `events`, prior code, task, context, and `critique` to
  `ActionAgent.render_human_message`, then installs the resulting human message
  for the action agent (`source/voyager/voyager.py:245-259`). The action renderer
  does incorporate runtime observation and critique (`agents/action.py:102-199`).
  It is correct to draw events and critic feedback as inputs to an interface that
  subsequently feeds the next action-model prompt, provided it is kept expressly
  as prompt assembly rather than a learned module.
- The explicit local **Eligible success** / **Register reusable skill** interface
  safely abstracts `if info["success"]: add_new_skill(info)`
  (`voyager.py:275-280`, `353-356`). Its existing deposit-useless-items exclusion
  remains documented in the assumptions and source (`agents/skill.py:61-64`).
- The new code label `craftWoodenPickaxe.js (excerpt)` and displayed conditional
  call are faithful to the hash-pinned released artifact. The retained disclaimer
  that it is not a complete/generated/executed program is necessary and correct.
- The v4 released-skill examples, local `All saved code + primitives` runtime
  dependency, initial-context versus refinement-filtered-chat retrieval wording,
  and exploration-state grouping remain source-consistent. The v4 pinned-artifact
  verification continues to apply; v5 does not change those source files.

## Required correction

**Make the feedback-to-ActionLM refinement route conditional on continuing the
rollout.** The graph sends Critic → Refine prompt → Program generation as an
unqualified cycle, while the Refine prompt text only says “bounded retries.” In
source, after constructing the next message, `done` is true when either critic
`success` is true **or** the action attempt counter reaches its cap
(`source/voyager/voyager.py:251-268`), and `rollout()` breaks before another
`step()`/ActionLM call (`voyager.py:287-293`). Therefore successful verification
does not lead to a further refinement action. The human message happens to be
assembled before `done` is evaluated, but that does not make the next model call
occur.

Label the Refine prompt → Program generation route, or the prompt interface,
with a condition such as **“if not done”**, **“on failure / retry”**, or **“retry
while not success and under cap.”** The critic’s eligible-success registration
port alone does not make the terminating condition clear enough for the primary
cycle.

## Limits to retain

- The prompt assembly has more inputs than the two highlighted here: it also
  includes prior code, task, context, chest memory (except deposit cases), and
  configurable execution-error/chat-log sections (`action.py:132-197`). Thus
  “Events + critique” must remain illustrative rather than exhaustive.
- `last_events` and curriculum history remain a visual grouping, not one literal
  runtime store; chest observation is another curriculum-proposal input
  (`voyager.py:319-323`).
- No feedback arrow represents gradients, reward optimization, or a weight
  update.
