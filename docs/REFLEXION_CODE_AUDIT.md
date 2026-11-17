# Reflexion HotpotQA Code Audit

## Scope and provenance

This is a static, code-only audit of the pinned `noahshinn/reflexion` snapshot
`218cf0ef1df84b05ce379dd4a8e47f17766733a0`, specifically the HotpotQA
`ReactReflectAgent` with `ReflexionStrategy.REFLEXION`. No code, environment,
model, or external API was executed. The checked SHA-256 values match
`paperfigure/examples/reflexion-hotpotqa/source-manifest.json`:

| Source | SHA-256 |
| --- | --- |
| `hotpotqa_runs/agents.py` | `19be4a1a8639245ed344470873a534ea684898954c062378e2b0e32d429c874a` |
| `hotpotqa_runs/environment.py` | `615bd3f8090badad163ade9c076674726ef5c4763de57222ba482c9caa0b8402` |
| `hotpotqa_runs/prompts.py` | `6f239cfdb564d400db97f019c7fef5925127aee4519a1d0281aab57ea7616cdf` |

The strategy enum and selectable `REFLEXION` path are in `agents.py`, so it is
the primary evidence. `react.py` is a separate, environment-backed variant
with the same conditional reflection/retry pattern, but no strategy enum; it
should not be substituted for the strategy-selectable implementation in a
source-grounded method figure.

## Supported computation graph

```text
Question + ReAct examples + accumulated local reflections
                 |                         |
                 +------> agent prompt <---+
                              |
                         action LLM
                              |
      Search/Lookup ---> docstore observation ---> next scratchpad step
      Finish[answer] ---> normalized exact-match (EM) ---> correct / failed
                                                        |
                         only after an incorrect completed or halted trial
                                                        v
     truncated previous scratchpad + question + reflection examples
                              |
                         reflection LLM
                              |
                    append reflection to local list
                              |
                next `run()` resets scratchpad and retries same question
```

### Nodes and edges supported by code

| Figure element | Code evidence | Audit finding |
| --- | --- | --- |
| Actor / ReAct controller | `agents.py:184-245` | Each step appends Thought and Action, parses the action, obtains an observation, and appends it to the scratchpad. |
| Environment / tools | `agents.py:217-231`, `environment.py:39-53` | The actor can call `Search` and `Lookup` through a Wikipedia `DocstoreExplorer`; invalid actions and failed lookup/search are textual observations. |
| Task question and answer key | `agents.py:170-173,260-262` | Question and key live on the agent and can be replaced using `set_qa`; this code alone does not show any cross-question memory policy. |
| Exact-match evaluator (EM) | `agents.py:207-215,249-250,373-390` | A Finish action stores its argument as `answer`; correctness is normalized string equality against `key`. The environment variant has the same EM rule at `environment.py:31-37,63-64,84-101`. |
| Failed attempt | `agents.py:292-296`, `agents.py:252-253` | A trial is eligible only when it is finished or halted **and** is not EM-correct. Halt is step-budget or prompt-token-budget exhaustion. |
| Reflection generator | `agents.py:298-316,319-323` | Under `REFLEXION`, a separate reflection LLM is prompted with the prior trial and appends one textual reflection. |
| Local cross-trial memory | `agents.py:285-290,304-306,325-330,351-356` | Reflections accumulate in `self.reflections` on one agent instance and are inserted into future agent prompts. |
| Same-task retry | `agents.py:292-296,184-189,255-258` | Reflection occurs before base `run()` resets the scratchpad; the next call then begins a fresh trial on the same stored question/key. |
| Prompt reuse | `agents.py:325-330`; `prompts.py:100-111,113,117-124,131-139` | Each action call rebuilds a ReAct prompt containing fixed few-shot examples, the question, the current scratchpad, and accumulated reflections. The reflection prompt receives the question and a truncated prior scratchpad. |
| No gradient update | `agents.py:45-66,162-167,272-282,304-306` | The source constructs inference LLM clients and only mutates Python strings/lists such as `reflections`, `scratchpad`, and `answer`; no optimizer, loss, backward pass, parameter update, or weight persistence appears in the audited files. |

## Required causal/temporal interpretation

1. The first trial has no generated reflection. A reflection is conditionally
   created at the beginning of a subsequent `run()` call after the previous
   trial was incorrect and either finished or halted (`agents.py:292-296`).
2. In the `REFLEXION` branch, the previous trace is supplied to the reflection
   prompt, not directly copied into the next actor prompt. The next actor sees
   the generated reflection(s), not the raw previous trajectory
   (`agents.py:304-306,319-330`).
3. The attempted trace is lossy when made available to reflection: only long
   observation lines are replaced to stay within 1600 tokens
   (`agents.py:363-371`).
4. The memory is instance-local and grows as a list during repeated calls. The
   audited code does not serialize it, retrieve it by task similarity, or reset
   it in `set_qa` (`agents.py:260-262,285-290`). A figure must not depict a
   dataset-wide/shared experience buffer, long-term database, or learned memory.
5. Retry orchestration beyond repeatedly invoking `run()` is not present in the
   pinned files. The code establishes what one subsequent `run()` does; it does
   not establish a fixed number of trials or evaluation-level retry schedule.

## Scientific traps to avoid in the figure

- Do not draw reflection after every tool step. It follows a terminal or halted,
  EM-incorrect **trial**, not an individual Thought/Action/Observation step.
- Do not label EM as a generic reward model, critic, verifier, or learned
  evaluator. It is normalized exact equality with the provided key.
- Do not connect the failed trace directly to the next actor under the requested
  `REFLEXION` strategy. That is a distinct `LAST_ATTEMPT` option
  (`agents.py:301-310,358-361`).
- Do not imply gradient-based learning, fine-tuning, policy optimization, or
  cross-task parameter updates. The observed update is appending textual
  reflection(s) to in-process state.
- Do not claim a successful Finish triggers reflection: reflection is gated by
  `not self.is_correct()`.
- Do not promise unlimited ReAct steps despite the prompt wording
  (`prompts.py:104`): executable control halts on `max_steps` or token budget
  (`agents.py:252-253`).

## Figure-ready minimal claim

For the pinned HotpotQA `REFLEXION` strategy: an LLM ReAct actor uses Wikipedia
Search/Lookup observations to attempt one question; an exact-match failure after
a finished or halted trial conditionally triggers a separate LLM reflection over
the prior trace; the resulting textual reflection is retained locally and
prepended to the prompt for a fresh retry of that same agent instance. This is
in-context, text-state adaptation, not a gradient update.
