# ReAct: HotpotQA interaction

Scope: `webthink` in the official HotpotQA notebook, pinned in source-manifest.json.
A question and few-shot instructions initialize a prompt. One language-model call
normally yields Thought and Action together; parsing failure may cause another
Action-only call. The parsed command enters WikiEnv: Search returns a Wikipedia
passage, Lookup searches the current page, Finish sets an answer and terminates.
Thought, Action and returned Observation are concatenated into a step record and
appended to the same question's prompt for the following decision.

The loop is bounded to seven iterations with an early done break and forced empty
Finish on exhaustion. The figure shows the principal successful-parse route, not
parse repair, error strings, timeout retries, wrapper scoring or logging. An Answer
node means submitted output, not verified correctness. State is text within this
question; no persistent cross-task memory or parameter updates are implied.
