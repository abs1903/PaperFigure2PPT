# Voyager refinement v4 source review

## Verdict: pass (source fidelity within the declared overview scope)

This is a new static source review of the current `refinement/spec.json` and
`refinement/make_spec.py`. It preserves, rather than replaces,
`VOYAGER_REFINEMENT_SOURCE_REVIEW.md`, whose three revision requests are now
resolved. No generator, model/API, or Minecraft code was executed, and no
aesthetic verdict is made here.

## Pinned released-skill evidence

The six supplied released skill artifacts are recorded in
`paperfigure/examples/voyager-agent/refinement/example-source-manifest.json`
(the manifest is adjacent to `source/`, not inside it). All six local SHA-256
values match the manifest at pinned commit
`55e45a880755d0c8c66ca7fb5fe7962ac8974f89`:

- Code: `mineWoodLog.js`, `craftCraftingTable.js`, and
  `craftWoodenPickaxe.js`.
- Descriptions: the corresponding three `.txt` files.

The library's three names and short descriptions faithfully identify these
released examples. The specification explicitly disclaims both a claimed library
size and a claim that these were an actual retrieved top-k from a new run.

## Verification of the v4 corrections

- The earlier false “stored keys” panel is gone. The library now presents concrete
  released code/description examples rather than asserting that `program_name`
  and `program_code` are fields of `self.skills`. This avoids the prior mismatch:
  source stores `self.skills[program_name] = {"code": program_code,
  "description": skill_description}` (`source/voyager/agents/skill.py:65-100`).
- **Eligible success** accurately avoids universal success-to-save wording. The
  normal success branch calls `add_new_skill` (`source/voyager/voyager.py:275-280,
  353-356`), while the explicitly documented deposit-useless-items exclusion
  returns without saving (`agents/skill.py:61-64`).
- **State context** is an input label, not the prior reversed `Next task` label.
  `last_events` is passed into `propose_next_task`, and `(task, context)` is the
  output later supplied to the rollout/action path (`voyager.py:319-332`). The
  state card correctly remains a declared visual grouping: `last_events` is on
  `Voyager`, whereas completed/failed lists are on `CurriculumAgent`
  (`voyager.py:251-259`; `agents/curriculum.py:329-367`).

## Concrete example audit

- The task card explicitly says **Example task: Craft wooden pickaxe**, matching
  the author-released `craftWoodenPickaxe` code/description. It does not claim
  this is the first automatic task or the task of a fresh run.
- The program panel identifies `craftWoodenPickaxe(bot)` and reproduces the real
  conditional call `if (craftingTableCount === 0) { await
  craftCraftingTable(bot); }` from the released file. The spec accurately calls
  it an excerpt, not a full new/generated/executed program. The released function
  does contain further prerequisite, placement, and crafting steps, so retaining
  that disclosure is necessary.
- **All saved code + primitives** correctly represents the runtime bundle:
  `SkillManager.programs` concatenates every saved entry's `code` with all control
  primitives, and `env.step` receives the bundle (`skill.py:52-59`;
  `voyager.py:213-218`). The omitted library-to-runtime wire is acceptable because
  the dependency is named locally.
- The library query text is accurate: initial retrieval uses `self.context`, and
  refinement retrieval adds `summarize_chatlog(events)`, a filtered prerequisite
  summary (`voyager.py:184-190`, `245-259`; `agents/action.py:258-280`). The
  remaining action-to-library query arrow is a stated helper/orchestration
  abstraction, not an extra language model.

## Retained limits

- The exploration-state group is not an exhaustive curriculum-input inventory:
  the proposal call also receives action-agent chest observation
  (`voyager.py:319-323`). Do not revise the figure or prose to imply otherwise.
- Latest events are updated after the normal parsed/executed action branch;
  parsing failures do not execute an environment action (`voyager.py:211-263`).
- The critic feedback is prompt/control feedback. It is not a gradient, reward
  optimizer, or weight update (`voyager.py:221-227`, `265-285`).
