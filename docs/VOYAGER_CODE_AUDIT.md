# Voyager Code Audit

## Scope and evidence

This is a static audit only. No source module, Minecraft environment, or model API
was executed. It covers the pinned `MineDojo/Voyager` snapshot at commit
`55e45a880755d0c8c66ca7fb5fe7962ac8974f89`, declared in
`paperfigure/examples/voyager-agent/source-manifest.json:2-35`. SHA-256 hashes of
the five audited files match that manifest.

The findings below describe the code path for `Voyager.learn()`, not an
unverified claim about all paper variants or runtime behavior.

## Verified learning-loop data/control flow

1. `learn()` resets the environment (hard on a fresh run; soft on resume), obtains
   an initial observation with `env.step("")`, and repeats until the recorder
   iteration exceeds `max_iterations` (`source/voyager/voyager.py:295-318`).
2. Each iteration asks the curriculum for `(task, context)` from `last_events`
   and the action agent's accumulated chest observation (`voyager.py:319-323`).
   The curriculum has two deterministic overrides before its LLM path: the first
   automatic task is “Mine 1 wood log”; a nearly full inventory triggers a
   deposit/place/craft-chest task (`agents/curriculum.py:240-290`).
3. A rollout resets/peeks the environment, retrieves skills using **`context` as
   the initial query**, and places the returned code in the action system message
   (`voyager.py:165-198`; `agents/action.py:75-100`). The action prompt also
   receives the task, context, observation, last-round code, execution errors,
   chat log, chest memory, and critique (`agents/action.py:102-199`).
4. Each action attempt calls the action LLM, extracts JavaScript fenced blocks,
   selects the last async function with one `bot` argument, then executes the
   concatenated declared functions plus `await main(bot)` in the environment
   (`voyager.py:203-227`; `agents/action.py:201-256`). A non-parsable response is
   not executed; it is recorded as an empty event and retried under the normal
   attempt limit (`voyager.py:260-269`).
5. After a parsed program executes, the critic receives the resulting events,
   task, context, and chest observation. Its Boolean `success` (or `False` on an
   event error, malformed/failed critic response, or exhausted critic retries)
   controls rollout completion (`voyager.py:219-227`, `266-285`; `agents/critic.py:27-42`,
   `91-136`).
6. Whether the critic says success or failure, a parsed/executed attempt creates
   the next action prompt from the **latest events** and critic feedback. The
   next retrieval query is `context + "\n\n" + summarize_chatlog(events)`;
   it is not the task string and it does not include the critique (`voyager.py:245-259`;
   `agents/action.py:258-280`). The chat-log summary retains only a few crafting
   and mining prerequisite patterns.
7. A rollout ends when critic success is true or action attempts reach
   `action_agent_task_max_retries` (`voyager.py:265-293`). The main loop then
   saves a skill only on `info["success"]`; it always updates curriculum progress
   afterward (`voyager.py:353-356`). The most recent executed events are copied
   to `last_events` inside `step` (`voyager.py:251-259`), so the next curriculum
   proposal sees the latest parsed action outcome, including an unsuccessful one.

## Skill retrieval and successful skill saving

- `SkillManager.retrieve_skills()` embeds the query in its Chroma vector store,
  selects at most `retrieval_top_k`, and returns the associated **stored program
  code**, which becomes action-prompt context (`agents/skill.py:114-127`).
  Retrieval has no explicit success/failure filter beyond what was previously
  admitted to the store.
- The environment receives `skill_manager.programs`: all stored skill code plus
  control primitives, rather than only the prompt-retrieved subset
  (`voyager.py:213-218`; `agents/skill.py:52-59`).
- A critic-confirmed successful rollout supplies the parsed program name and
  program code (`voyager.py:275-280`). `add_new_skill()` asks a separate LLM to
  create a description from that code, stores its embedding, updates the
  in-memory/JSON skill mapping, writes code and description files, and persists
  the vector store (`agents/skill.py:61-112`).
- A successful “Deposit useless items into the chest at …” task is deliberately
  excluded from skill saving (`agents/skill.py:61-64`); the curriculum also
  excludes that task from completed/failed progress records
  (`agents/curriculum.py:329-344`). Reusing a program name overwrites the active
  skill/vector entry; an incremented filename preserves the newly dumped source
  artifact (`agents/skill.py:71-100`).

## Diagram guardrails: unsupported or misleading paths

- Do **not** draw a direct failure-to-skill-library write. Failures produce
  critic feedback and another action prompt/retrieval opportunity; they are not
  saved as skills.
- Do **not** label the critic signal as a weight update, reward optimization, or
  backpropagation. The audited loop uses a Boolean/critique to terminate or
  refine prompting.
- Do **not** draw retrieval as querying the current task alone. Initial retrieval
  queries the curriculum-provided task context; later attempts add a restricted
  summary of recent chat feedback.
- Do **not** imply the retrieved top-k is the complete executable library. The
  prompt sees retrieved code, while environment execution is supplied all saved
  programs plus primitives.
- Do **not** draw a task-success edge solely from the environment to the skill
  manager. Saving requires the critic's success Boolean and parsed program fields;
  success is not inferred directly from an environment event.
- Do **not** depict every failed task as permanently excluded. The curriculum
  records ordinary failures, but its next-task selection is LLM-driven (apart
  from the documented overrides); the source does not impose a global hard
  “never retry failed task” gate (`agents/curriculum.py:278-309`, `329-367`).
- Do **not** claim the curriculum always sees every observation field. Its prompt
  includes fields under warm-up thresholds and random 0.8 inclusion for nonzero
  thresholds (`agents/curriculum.py:209-238`).

## Compact figure-safe relation set

`latest observation + chest memory -> Curriculum -> task context -> Skill retrieval
-> Action prompt/code -> Environment -> latest events -> Critic -> {success: save
program; failure: feedback/refined action prompt}; outcome -> Curriculum progress`.

Use the success/failure labels on the critic branches, and distinguish the
prompt-level retrieved skills from the environment's full executable program set.
