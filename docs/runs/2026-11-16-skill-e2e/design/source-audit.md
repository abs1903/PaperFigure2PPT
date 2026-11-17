# Independent source audit: Voyager design route

**Reviewer:** `/root/voyager_e2e_review` (independent-agent)  
**Date:** 2026-11-16  
**Isolation:** fresh task context; I inspected only the pinned Voyager sources,
their manifests, `METHOD.md`, `refinement/spec-final.json`, and the current
visual-review/evaluation requirements. I did not read prior Voyager reviews or
verdicts, alter an export/spec/figure, execute model code, or call an external
service.

## Scope and decision

This audit covers the automatic-curriculum `learn()` route, not an empirical
Minecraft result and not the separate `inference()` branch. The intended graphic
is a paper architecture figure: meaningful solid colors, no overall title or
footer, native editable PPTX, and legibility at seven inches wide.

**Source-audit verdict: revise the semantic specification before visual
acceptance.** The central loop is broadly supported, but the current wording and
some unlabeled arrows elide conditions that materially change the mechanism.
The corrections below are limited and do not call for an added title/footer or a
claim about empirical performance.

## Provenance check

Both manifests identify `MineDojo/Voyager` commit
`55e45a880755d0c8c66ca7fb5fe7962ac8974f89`. I recomputed SHA-256 for all six
code/license files in `source/` and all six released skill artifacts in
`refinement/source/`; each matched its declared hash and byte count in
`source-manifest.json` and `refinement/example-source-manifest.json`.

The three released artifacts are concrete JavaScript examples, not an execution
trace: `mineWoodLog` searches a listed set of log types then mines one
([mineWoodLog.js:2-18](../../../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/code/mineWoodLog.js));
`craftWoodenPickaxe` calls the table helper when absent and later places a table
before crafting ([craftWoodenPickaxe.js:7-10](../../../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/code/craftWoodenPickaxe.js),
[35-41](../../../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/code/craftWoodenPickaxe.js)). They substantiate what a stored skill may contain, not a new reported outcome.

## Supported architecture

| Depicted relation | Source support | Audit judgment |
| --- | --- | --- |
| Automatic curriculum produces task and context | `learn()` asks `propose_next_task` using `last_events` and chest memory, then passes both into the rollout ([voyager.py:319-332](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); the curriculum's first automatic task is special-cased ([curriculum.py:240-244](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py)). | Supported for `learn()`/automatic mode. It is not an unconditional property of all modes: manual curriculum is available ([curriculum.py:39-43](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py)). |
| Retrieved code enters program generation | Reset retrieves from task context, renders it into the action system prompt ([voyager.py:184-196](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); retrieval returns at most `retrieval_top_k` code strings ([skill.py:114-127](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)). | Supported, provided “Top-k code” means prompt context, not the full executor payload. |
| Program is executed and verified | Parsed JavaScript yields `program_code` plus a main-function invocation; the environment executes it and its events feed the critic ([voyager.py:211-227](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)). | Supported. The action parser requires the final async one-argument `bot` function ([action.py:232-250](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/action.py)). |
| Events and critique refine the next action prompt | The next human message receives events, previous code, task/context, and critique ([voyager.py:245-259](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)). | Supported, but this feedback is inside a single task rollout. The retrieval query adds only a filtered chat-log prerequisite summary, not all events/critique ([action.py:258-280](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/action.py)). |
| Success registers a reusable skill | After a successful rollout `learn()` calls `add_new_skill` ([voyager.py:353-356](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); registration creates a description, vector entry, code/description files and persistent JSON ([skill.py:61-100](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)). | Supported only with the explicit condition below. |
| Exploration state feeds future curriculum | `last_events` is updated after a valid action step ([voyager.py:245-259](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); curriculum observations combine current environment fields with completed/failed tasks ([curriculum.py:139-207](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py)). | Supported, but the state is not one undifferentiated store. |

## Required semantic corrections

1. **Make skill registration conditional and name the exception.** The critic-to-library edge is not simply “success.” It occurs after `info["success"]` in `learn()` and `add_new_skill()` immediately excludes tasks whose name begins `Deposit useless items into the chest at` ([voyager.py:353-356](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py); [skill.py:61-64](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)). Label it “on success (except deposit tasks)” or put that condition in the adjacent annotation.

2. **Separate retrieved prompt snippets from the executor’s full program bundle.** The proposed “Top-k code” library-to-generator arrow is accurate only for the action prompt. Environment execution passes `self.skill_manager.programs`, which concatenates **all** stored skill code and fixed control primitives ([voyager.py:214-218](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py); [skill.py:52-59](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)). Do not let the visual imply that only top-k code exists at runtime. A compact second dashed/support arrow from library to execution, labeled “all saved skills + fixed primitives,” would resolve this without adding clutter.

3. **Show the retry termination precisely.** A task stops when either success is true or its action-attempt counter reaches `action_agent_task_max_retries` ([voyager.py:265-269](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); the default constructor value is four ([voyager.py:26-30](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)). Thus “If not done” must lead only to the next action attempt before the cap, not portray indefinite self-refinement. Parsing failure is also counted as an attempt but does not produce environment events ([voyager.py:260-269](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)).

4. **Clarify state lifetime and contents.** `last_events` is the latest valid execution event sequence and is initialized once before the learning loop ([voyager.py:313-323](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); successful/failed task lists are separately persistent curriculum state ([curriculum.py:46-56](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py), [329-365](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py)); chest memory is a separate persistent action-agent store ([action.py:25-54](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/action.py)). A box called “Exploration state” needs a concise detail such as “latest events + task history; chest memory” or visually distinguish the stores. Do not imply that all world history is retained.

5. **Treat automatic curriculum and automatic critic as scope conditions.** Both agents support manual modes ([curriculum.py:39-43](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py); [critic.py:20-21](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/critic.py), while the critic dispatches on this choice ([critic.py:116-136](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/critic.py)). The chosen `METHOD.md` scope is valid, but the diagram should retain “automatic” on curriculum and avoid presenting LLM verification as universally mandatory.

## Deliberate omissions and unsupported claims

- No gradient update or parameter-learning edge is supported. The observed persistence is programs/descriptions/vector index, task histories, chest memory, and QA cache; it is not model-weight training.
- There is no evidence here of success rate, sample efficiency, generalization, unlimited retries, or an actual run. The method label “no runtime experiment” is appropriate.
- The curriculum has additional QA/cache machinery (`run_qa` and `get_task_context`, [curriculum.py:384-434](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py)); omitting it from a seven-inch overview is defensible only if the curriculum input is not falsely reduced to task history alone.
- The critic can reject malformed answers after up to five parsing retries ([critic.py:91-114](../../../../../paperfigure/examples/voyager-agent/source/voyager/agents/critic.py)); the figure should not equate “verify task” with an oracle.
- `inference()` resets completed/failed task lists and follows supplied/decomposed subgoals ([voyager.py:380-405](../../../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)); it is out of scope for this `learn()` figure and should remain omitted rather than merged into the learning loop.

## Visual-review readiness

No render has been inspected in this source pass. Per the current review contract, scientific fidelity and visual quality remain separate; native-object evidence or a render QA report cannot establish appearance. When provided the actual output paths, I will open the design PNG, independent Office-rendered PPTX PNG, and PDF raster, assess them independently at the stated seven-inch width, and write an attributed report plus hash-bound output-local `visual-review.json`. Until then, no visual acceptance is implied.

## Post-render encoding addendum (v1)

After this source pass, I inspected the actual v1 pixels. Three earlier cautions
are already handled by compact, truthful encodings and are **not** blocking
semantic defects:

- `Execute program` explicitly says **“All saved code + primitives.”** Although
  it does not draw a second long library-to-executor wire, this distinguishes the
  runtime bundle from the nearby **“Top-k code”** prompt arrow. A second wire is
  optional only if it can be added without worsening the busy lower routing.
- `Refine prompt` says **“Events + critique; bounded retries,”** and the return
  route says **“If not done.”** Together these accurately convey the
  success-or-cap stop condition at overview level; the numeric default four and
  parsing-failure detail need not be drawn.
- `Exploration state` says **“Latest events”** and **“Task history.”** This does
  not falsely claim all world history is retained. Chest memory and the QA cache
  are legitimate omitted implementation detail at seven inches.

The `Verify task` → registration route is labeled **“Eligible success.”** That
is a truthful abstraction: it prevents the false claim that every verification
outcome is saved. Naming the deposit-task exception would improve audit
specificity, but is not a required main-figure addition unless a nearby
condition/note can remain legible without lowering the text-size floor.
