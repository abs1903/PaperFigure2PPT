# ReAct HotpotQA Code Audit

## Scope and provenance

This is a static, code-only audit of the pinned `ysymyth/ReAct` snapshot. No
model completion, HTTP request, environment step, or paid API was executed.
`source-manifest.json` pins commit
`6bdb3a1fd38b8188fc7ba4102969fe483df8fdc9`; SHA-256 values of the three
source files match that manifest. `hotpotqa_code.py` is the supplied
output-free extraction of the notebook's code cells.

Sources cited below are relative to the repository root.

## Verified execution graph

### Nodes

1. **Few-shot task prompt.** The prompt is a fixed instruction concatenated
   with `webthink_simple6` demonstrations loaded from `prompts_naive.json`.
   It asks for interleaved Thought, Action, Observation text
   (`source/hotpotqa_code.py:35-47`). The prompt JSON itself is not in the
   pinned source bundle, so the demonstrations' exact contents are not
   auditable here.
2. **HotPotQA dev question.** `WikiEnv` is wrapped first by
   `HotPotQAWrapper(split="dev")` and then `LoggingWrapper`
   (`source/hotpotqa_code.py:19-22`). Reset selects the requested (or random)
   item and returns only `Question: ...` to the controller
   (`source/wrappers.py:80-99`).
3. **LLM completion.** `llm` calls `text-davinci-002` with temperature zero,
   `max_tokens=100`, and caller-provided stop strings
   (`source/hotpotqa_code.py:6-17`).
4. **Thought/Action parser and repair branch.** The normal completion begins
   after `Thought i:` and is expected to contain `\nAction i: `. If parsing
   fails, the first output line is retained as the thought and a second,
   action-only completion is requested (`source/hotpotqa_code.py:55-65`).
5. **Action dispatcher.** The controller lowercases only the first action
   character before calling the wrapper stack (`source/hotpotqa_code.py:66`).
   `WikiEnv.step` dispatches `search[...]`, `lookup[...]`, and `finish[...]`;
   it also implements undocumented-by-the-prompt `think[...]` and an invalid
   action response (`source/wikienv.py:124-160`).
6. **Wikipedia-backed environment state.** Search fetches Wikipedia HTML and
   either exposes up to five similar titles or builds a page and returns its
   first five sentences (`source/wikienv.py:98-122`, `:76-87`). Lookup retains
   a current keyword, matching-sentence list, and cursor, returning the next
   match on repeated lookup (`source/wikienv.py:59-74`, `:138-147`). Finish
   stores the supplied answer and sets `done=True` (`source/wikienv.py:148-152`).
7. **HotPotQA scorer and trajectory logger.** The wrapper converts a finished
   answer into exact-match reward/metrics and adds ground truth and question
   index to `info` (`source/wrappers.py:109-134`). Logging separately appends
   each environment observation and dispatched action, and augments the log
   with `info` only at completion (`source/wrappers.py:200-226`).
8. **Textual controller transcript.** For every loop iteration, the original
   thought, original model action text, and newline-stripped observation are
   appended to the prompt for the next completion (`source/hotpotqa_code.py:67-69`).
   The returned info additionally stores this full prompt as `traj`
   (`:78-79`).

### Directed edges and conditions

```text
few-shot instruction + examples + selected question
  -> prompt -> LLM(Thought i + Action i) -> parse
                                      | parse failure
                                      v
                                LLM(Action i only)
                                      |
                                      v
                    first-character lowercasing -> WikiEnv dispatch
                         | Search / Lookup / Finish / Think / invalid
                         v
                observation + done + wrapper reward/info
                         |
            append Thought/Action/Observation to prompt
                         |
              done? --yes--> return reward + info
                 |
                no
                 v
              next i (at most seven iterations)
```

* The loop runs `i = 1..7`; each normal iteration requests a thought/action
  completion (`source/hotpotqa_code.py:55-57`). `done=True` breaks immediately
  (`:72-73`). If all seven iterations finish without `done`, it dispatches the
  synthetic `finish[]`; this forced action is **not** appended to the textual
  prompt transcript (`:74-79`).
* `Search` and `Lookup` return `done=False`; only a syntactically valid
  `Finish` (or a previous answer) returns `done=True`
  (`source/wikienv.py:128-160`). Search may recursively search a bracketed
  entity after a disambiguation page, within one outer action
  (`source/wikienv.py:107-114`).
* The helper retries `env.step(action)` only when it catches a request timeout,
  up to ten attempts (`source/hotpotqa_code.py:24-30`). This is an environment
  call retry, not a model retry. The pinned controller does not import
  `requests`, and the helper has no return after ten timeouts; those are code
  limitations, not intentional semantic branches.

## Diagram requirements and misleading-pitfall checklist

* Show **one LLM generation of Thought + Action**, with a conditional
  parse-repair **second action generation**. Do not depict Thought and Action
  as two mandatory sequential model calls.
* Show the feedback edge as **Observation appended to the next prompt**. It is
  an inference transcript/state update, not gradient flow, memory training, or
  an optimizer update.
* Draw the environment as a stateful Wikipedia tool: `Search` changes the
  current page; `Lookup` reads and advances a cursor over matches for the
  current keyword; `Finish` records an answer and terminates. Do not imply
  lookup independently searches Wikipedia.
* Limit the primary exposed action set to `Search`, `Lookup`, and `Finish`, as
  the task instruction does (`source/hotpotqa_code.py:41-45`). `think[...]`
  exists in the raw environment but is not part of that controller prompt and
  should not be promoted as a fourth advertised tool.
* Make termination explicit: success/finish ends early; otherwise the
  controller performs **at most seven** deliberation/action iterations and
  forces `finish[]`. Do not label the loop as unbounded or claim that the
  forced empty finish was model-generated.
* Keep evaluation/logging visually secondary and downstream of environment
  termination. Exact-match reward is supplied by `HotPotQAWrapper`, not by
  Wikipedia or the LLM (`source/wrappers.py:109-134`).
* Do not equate the prompt transcript with the `LoggingWrapper` trajectory:
  the prompt records model action casing and strips literal `\\n` from the
  observation, while logging records the dispatched (first-character
  normalized) action and raw wrapper observation (`source/hotpotqa_code.py:66-69`; `source/wrappers.py:220-226`).
* Do not represent a static, curated knowledge base. Search performs live HTTP
  requests to English Wikipedia at runtime (`source/wikienv.py:98-105`).
* Do not claim that the exact few-shot demonstrations are source-verified from
  this bundle: the controller references an external prompt JSON not present
  in the manifest.

## Audit boundary

This document describes the supplied HotpotQA notebook/controller and its
wrapper/environment code only. It does not establish paper-wide ReAct claims,
accuracy, reproducibility of live Wikipedia responses, or visual correctness
of a resulting figure.
