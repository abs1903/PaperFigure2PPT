# Voyager refinement source review

## Verdict: revise

Static source audit only. I read `refinement/spec.json` and
`refinement/make_spec.py` against the pinned Voyager snapshot and
`VOYAGER_CODE_AUDIT.md`; I did not execute the generator, model/API code, or a
Minecraft environment. This is not an aesthetic review.

## Source-supported refinements

- The first automatic-curriculum task is exactly `Mine 1 wood log` when progress
  is zero and mode is automatic (`source/voyager/agents/curriculum.py:240-244`).
  The refinement correctly scopes it as an example rather than a fixed later
  sequence. Near-full-inventory overrides and later LLM selection remain separate
  conditions (`curriculum.py:246-301`).
- The illustrative `async function skill(bot)` / `await skill(bot)` interface is
  faithful as an interface illustration: parsed action programs require a last
  async function with the single `bot` argument, and execution awaits that selected
  function (`source/voyager/agents/action.py:232-250`). Its generated-body comment
  and nonliteral name are properly disclosed in the assumptions.
- `All saved code + primitives` is an accurate local statement of the runtime
  bundle. `SkillManager.programs` concatenates every saved entry's code and every
  control primitive, and the environment receives that bundle
  (`source/voyager/agents/skill.py:52-59`; `source/voyager/voyager.py:213-218`).
  Omitting a separate library-to-runtime arrow is therefore a permissible
  readability abstraction if this local wording remains.
- Top-k prompt retrieval and the two query contexts are preserved: the initial
  query is task context, while refinement adds a restricted chat-log summary
  (`source/voyager/voyager.py:184-190`, `245-259`; `skill.py:114-127`). The
  curriculum/action-to-library arrows should continue to be understood as
  orchestration/data-flow abstractions, not direct extra-LM calls.
- Grouping latest events with completed/failed task histories under an
  **Exploration state** visual abstraction is defensible if it is not represented
  as one literal object. `last_events` is held on `Voyager` and copied after a
  parsed/executed action (`voyager.py:251-259`); completed/failed lists belong to
  `CurriculumAgent` and are updated from `info` (`curriculum.py:329-367`). The
  refinement's assumptions state that it is a grouping, which is essential.

## Required corrections

1. **The skill-library field names are not actual stored keys.** The card displays
   `program_name`, `program_code`, and `description`, and the generator calls them
   “actual record keys” (`refinement/make_spec.py:56-60,78`). In source,
   `program_name` and `program_code` are input locals; the persisted mapping is
   `self.skills[program_name] = {"code": program_code, "description":
   skill_description}` (`source/voyager/agents/skill.py:65-88`). Thus `code`, not
   `program_code`, is the stored field name, and `program_name` is the mapping key,
   not a field in each value. Revise the card/assumption to distinguish a key
   (`program_name`) from stored fields (`code`, `description`), or explicitly
   label the displayed values as registration inputs rather than record keys.

2. **“Save on success” is too broad without the visible exception.** Successful
   rollouts reach `add_new_skill` (`voyager.py:275-280`, `353-356`), but that
   method immediately returns for `Deposit useless items into the chest at …`
   (`skill.py:61-64`). The exception appears only in a non-rendered spec
   assumption, so a standalone main figure's unconditional label is misleading.
   Change the edge label to `Save eligible success` or state the deposit exception
   locally near the registration edge.

3. **The state-to-curriculum edge has the wrong semantic label.** It is labeled
   `Next task` in the refinement generator (`make_spec.py:77`), but its evidence
   is `events=self.last_events,`: these are inputs to
   `curriculum_agent.propose_next_task`, whose output `(task, context)` is then
   sent to Action (`voyager.py:319-323`, `328-332`). The arrow should be labeled
   `Latest events + history` (or simply `Exploration state`) rather than `Next
   task`; `Task + context` is the correct curriculum output already represented
   by the curriculum-to-action route.

## Scope limits to retain after revision

- The curriculum proposal also receives `chest_observation` from action-agent
  memory (`voyager.py:319-323`). The state group should not be presented as an
  exhaustive list of curriculum inputs unless that memory is named or its omission
  is explicitly scoped.
- The events-to-state update occurs only for a parsed program execution in the
  normal `step` branch; parse failures record empty events and retain the existing
  message state (`voyager.py:211-263`). Avoid implying that every attempted model
  response yields a new environment observation.
- The critic’s Boolean controls rollout termination and candidate saving, but the
  diagram must not imply weights, gradients, or generic reward optimization
  (`voyager.py:265-285`; `agents/critic.py:91-136`).
