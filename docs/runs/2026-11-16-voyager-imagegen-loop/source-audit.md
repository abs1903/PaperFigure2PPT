# Independent source and brief audit — Voyager ImageGen loop

## Scope and material inspected

- **Scope reviewed:** the pinned `MineDojo/Voyager` implementation's
  `Voyager.learn()` automatic overview, not a runtime result, complete API map,
  or claim about a particular rollout.
- **Pinned primary material:** `paperfigure/examples/voyager-agent/source/`
  and the released skill examples under
  `paperfigure/examples/voyager-agent/refinement/source/`, identified by
  `source-manifest.json` and `refinement/example-source-manifest.json` as
  commit `55e45a880755d0c8c66ca7fb5fe7962ac8974f89`. Their manifest SHA-256
  values are `67bf44a855abb59ba527e9cc3992dcd857a2b21ec0409d6f9f9fefbf9058027d`
  and `67b6fac9e457e1bcdebccb3f766605cda7dc8300bc8da99ad2e59750de3fb607`.
- **Run inputs reviewed:** `spec.json` (`09975ef413ed42cc6d2c09ae6aaa125a75ee923809bf82d1f2297dceabeea543`),
  `design-brief.json` (`c2e58c33e0a85215be44e591b3f673b096a53774b04ef139f26c8aab736f8114`),
  and `prompt-v1.txt` (`052dc772f43f36e25c1d58e92e1a360b81bba79550aad7d5c046e1bef3fcb0cc`).
- **Review isolation:** I read raw source, manifests, the current run inputs,
  and the ImageGen/review workflow references. I did not read earlier Voyager
  review verdicts, run model code, or invoke external services.

## Source-grounded method interpretation

`learn()` resets the environment, obtains initial events, then repeatedly asks
the curriculum for `(task, context)`, runs a bounded task rollout, conditionally
registers a successful program as a skill, and updates curriculum progress
([`voyager.py:295-356`](../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py)).
This supports an overview with three semantic areas: automatic curriculum and
state, an embodied action/refinement loop, and reusable skills.

- **Automatic task selection and state.** The next-task call consumes
  `last_events` and chest observation (`voyager.py:319-323`). The curriculum
  renders current observation plus completed and failed task records
  ([`curriculum.py:178-205`](../../../paperfigure/examples/voyager-agent/source/voyager/agents/curriculum.py));
  it records success in `completed_tasks` and failure in `failed_tasks`
  (`curriculum.py:329-365`). Thus a compact “exploration state” grouping of
  latest events and task history is a defensible editorial abstraction, but it
  combines transient `last_events` with persistent task records rather than
  denoting one source object.
- **Code execution and verification.** A parsed Action response yields program
  and execution code; the environment executes it with all stored programs,
  and the critic receives the resulting events (`voyager.py:211-227`). The
  critic produces both `success` and `critique` (`critic.py:101-135`).
- **Bounded refinement.** After a parsed execution, events and critique are
  rendered into the next Action human message (`voyager.py:245-259`); the task
  ends when success is true or the action retry cap is reached
  (`voyager.py:265-285`). “If not done”/“bounded retries” is therefore
  source-supported. It must not be rendered as an unconditional loop.
- **Skill retrieval and registration.** At reset, retrieval queries with task
  context (`voyager.py:184-191`); on later parsed execution attempts, it uses
  task context plus filtered chat summary (`voyager.py:245-250`). Retrieval
  returns at most `retrieval_top_k` stored code entries (`skill.py:114-127`)
  for the Action system prompt. Environment execution, however, receives the
  full stored-program bundle plus fixed primitives (`skill.py:52-59`), so the
  top-k arrow may end only at the generation prompt, never at the executor.
  The outer loop calls `add_new_skill` only when `info["success"]` is true
  (`voyager.py:353-354`); the manager stores code and generated description
  (`skill.py:61-100`).
- **Concrete examples.** The three library names correspond to the retained
  released artifacts. In particular, the descriptions identify wood-log
  mining, crafting table creation, and wooden-pickaxe crafting
  ([`mineWoodLog.txt:1-2`](../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/description/mineWoodLog.txt),
  [`craftCraftingTable.txt:1-2`](../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/description/craftCraftingTable.txt),
  [`craftWoodenPickaxe.txt:1-2`](../../../paperfigure/examples/voyager-agent/refinement/source/skill_library/trial1/skill/description/craftWoodenPickaxe.txt)).
  They are appropriate illustrative examples, not evidence of a fresh rollout,
  retrieved set, or fixed curriculum sequence.

## Verdict on the current spec, brief, and prompt

**Verdict: revise before generation — a narrow scientific labeling correction
is required; the overall topology is acceptable for the requested overview.**

The major flow is source-bound and the brief appropriately prohibits training
arrows, failure-to-library storage, treating top-k retrieval as the executor
bundle, and an infinite refinement loop. Its non-card-grid central
code/world/verify/refine composition is also plausibly native-reconstructable.
The requested level of abstraction need not expose every runtime branch.

### Required correction

The exact-text whitelist calls the library inlet **“Eligible success”** and
**“Store skill.”** This overstates the actual eligibility condition. Even after
the outer success condition, `SkillManager.add_new_skill` returns without
registration for tasks beginning “Deposit useless items into the chest at”
([`skill.py:61-64`](../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)).
The spec's prose notes that exception, but it is not visible in the proposed
figure, while the unqualified label communicates a universal criterion. Before
generation, change the visible label/brief so it says only **“Success”** (or
another non-universal wording) and preserve the source record's exception. Do
not add a new mechanism or a tiny exception footnote merely to encode this
implementation detail.

### Conditions for the image-stage review

- Keep retrieval directed to **Generate code/prompt** only; visually distinguish
  it from the full `All skills + primitives` executor dependency.
- Preserve the refinement stop condition visibly enough that the return path is
  not read as an infinite learning loop.
- Treat “Exploration state” as an editorial grouping, not a single learned
  memory or a measured progress result.
- Use the named tasks and skills only as released illustrative content; do not
  imply their order, success, or measurement.
- The reviewed author crop,
  `dist/agent-papers-comparison/voyager-author.png`
  (`58c9faaea93d9d7d98ffdd390bb72ac01d1023b51dd288a2b75ad27791bceef9`),
  communicates the paper-level three-part mechanism with a curriculum cycle,
  iterative prompting, and skill library. It is a communication comparison
  only: the present figure is explicitly a pinned `learn()` implementation
  overview and must not copy that crop's artwork, layout, or imply its
  experiment/task sequence.

No raster candidate has been inspected; no design, prompt, figure, or tool code
was modified by this audit.
