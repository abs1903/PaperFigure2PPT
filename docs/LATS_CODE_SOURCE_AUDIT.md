# LATS HotpotQA Code-Path Audit

## Scope and evidence boundary

This static, source-only audit covers the frozen MIT snapshot
`andyz245/LanguageAgentTreeSearch@853d81614607dd27433faf17c7b0a7d660f95d22`
recorded in [`source/provenance.json`](../paperfigure/examples/lats-hotpotqa/source/provenance.json#L1-L7).
It traces only `hotpot/run.py --algorithm lats --prompt_sample cot`, excluding
the programming and WebShop implementations.

No module was imported; no model, API, dataset, environment, or original author
architecture image was used. **Static** claims below are source-observed.
**Runtime uncertainty** is deliberately not asserted.

## Entry and configuration

`run.py` constructs one `HotPotQATask`, loops through the requested index range,
and dispatches `--algorithm lats` to `lats_search(args, task, i,
args.iterations, True)` ([`run.py:12-33`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/run.py#L12-L33)).
The parser defaults to one generation, one evaluation, and 50 iterations; it has
no default algorithm or prompt sample ([`run.py:48-62`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/run.py#L48-L62)).

The supplied script fixes indices 0--99, five generation samples, one
evaluation, CoT, temperature 1.0, and 30 iterations, but does **not** pass
`--algorithm lats`; that must arrive through `${@}`. Its logfile is named
`tot_10k.log` ([`lats.sh:1-11`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.sh#L1-L11)).

## Executed path (static)

### Environment and reward

At module import, `lats.py` constructs one `WikiEnv`, then a train
`HotPotQAWrapper`, then a `LoggingWrapper` ([`lats.py:10-17`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L10-L17)).
Each search begins with `env.reset(idx=idx)` and an empty-state root
([`lats.py:159-171`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L159-L171)).
The wrapper selects the indexed question ([`wrappers.py:89-107`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wrappers.py#L89-L107)).

WikiEnv handles `search`, `lookup`, `finish`, and `think`; `finish` alone ends
the episode and stores the submitted answer ([`wikienv.py:127-163`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wikienv.py#L127-L163)).
Search makes a live Wikipedia request and mutates page/lookup state
([`wikienv.py:101-125`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wikienv.py#L101-L125)).
The wrapper reward and EM are normalized exact answer equality
([`wrappers.py:109-134`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wrappers.py#L109-L134)).

**Critical static fact:** a `Node` stores only its latest textual
thought/action/observation and a parent pointer, not an environment snapshot
([`lats.py:87-121`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L87-L121)).
All candidate actions call the same module-global `env`; there is no branch
reset, clone, replay, or restoration ([`lats.py:302-351`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L302-L351)).

### Policy expansion

The current parent chain is serialized as question plus
Thought/Action/Observation history ([`lats.py:402-415`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L402-L415)).
Generation uses CoT (when requested) and `stop="Observation"`
([`lats.py:302-306`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L302-L306)).
It parses a current-depth Thought and Action, deduplicates their pair,
lower-cases/reformats the action, performs an environment step, and records the
returned observation in a child ([`lats.py:309-351`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L309-L351)).

`cot_prompt_wrap` inserts reflections only when available and switches prompt
templates above a 4,000-token GPT-2 count ([`hotpotqa.py:15`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L15),
[`hotpotqa.py:92-116`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L92-L116)).

### Value, selection, rollout, and backup

`evaluate_node` values non-terminal children, assigns those scalars, and pads
unscored terminal positions with zero ([`lats.py:354-377`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L354-L377)).
`get_value` has a task-level prompt cache and passes the first model response to
the parser ([`lats.py:27-56`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L27-L56));
the parser selects the first matching digit substring from `10` through `1`
([`hotpotqa.py:210-234`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L210-L234)).

Selection uses `value / visits + sqrt(2 log(parent.visits) / visits)`, while an
unvisited child returns its existing value ([`lats.py:101-104`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L101-L104)).
It prunes a node if all its children are terminal and returns a successful
terminal child when observed ([`lats.py:234-260`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L234-L260)).
Expansion terminates at depth 7 ([`lats.py:262-269`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L262-L269)).

The main loop expands, evaluates, then starts rollout at the highest-valued
child ([`lats.py:190-207`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L190-L207)).
Rollout generates five candidates at a time, returns immediately on terminal,
otherwise values and selects one; it compares **absolute** node depth against
`max_depth=4`, and at a non-terminal bound replaces rewards with `[-1]`
([`lats.py:271-300`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L271-L300)).
After an unsuccessful rollout, backup averages the propagated value up parent
links, using `-1` for a terminal reward-0 node
([`lats.py:386-400`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L386-L400)).

### Reflection

Terminal reward-0 children add a stringified trajectory and final action to
`failed_trajectories` ([`lats.py:345-350`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L345-L350)).
Later generation deduplicates failures by final action and self-reflects only
while their count is below four ([`lats.py:58-85`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L58-L85)).
Reflection performs one model call per selected failed trajectory
([`hotpotqa.py:65-89`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L65-L89)).
Both feedback globals are cleared per `lats_search`
([`lats.py:159-171`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L159-L171)).

## Temporal state lifetime

| State | Lifetime / owner | Source-faithful diagram treatment |
| --- | --- | --- |
| WikiEnv and wrappers | Module-global; reset once per task; mutated across every candidate and rollout action | One shared mutable environment lane, not branch-local worlds. |
| Root and parent-linked Nodes | One `lats_search` | Textual trajectory tree plus search statistics. |
| Node state | Per node; newest triple plus parent pointer | Full displayed history is reconstructed, not stored as a world state. |
| `failed_trajectories`, `reflection_map` | Module globals cleared per task | Per-task feedback memory, not persistent long-term memory. |
| `task.value_cache` | One task object is created outside index loop | Cross-index cache only for equal value prompts. |
| `LoggingWrapper.traj` | Reset per task | Sequential actual trace; `run.py` does not call `write` or `close`. |

## Figure hazards: abstraction versus implementation

| Avoid implying | Source-faithful replacement |
| --- | --- |
| Each child has an independent restored WikiEnv state. | Textual candidate branches issue serial calls to one shared mutable environment. |
| Rollout descendants are ordinary retained tree children. | Rollout never extends `node.children`; endpoints are separately appended to `terminal_nodes`, though parent links permit backup. |
| Reflection feedback always reaches the value critic. | The feedback prompt built when failures exist is then overwritten by the `else` attached to `if len(z) != 0 and False`; the returned value prompt is `value_prompt_reasoning` ([`hotpotqa.py:175-207`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L175-L207)). Reflections are clearly used in generation. |
| Value is a robust learned critic or vote aggregate. | It is an LLM-derived scalar, one requested evaluation sample in `lats.sh`, parsed from response zero by digit substring. |
| One horizon controls all search. | Expansion has depth 7; rollout uses absolute depth 4. |
| Exhaustion cleanly exits. | The loop reselects while `node is None`, so the later `if node is None: break` is unreachable if `None` persists ([`lats.py:176-184`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L176-L184)). |
| Retries always yield a valid environment result. | `step` retries only Timeout ten times then can return `None`, while the caller unpacks a tuple ([`lats.py:19-25`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L19-L25), [`lats.py:328`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L328)). |

## Actionable source-faithful diagram inventory

1. Indexed Hotpot question -> `LoggingWrapper -> HotPotQAWrapper -> WikiEnv`.
2. Textual tree: root/node parent links; latest thought, action, observation;
   value, visits, depth, terminal flag, reward.
3. Policy: CoT prompt + optional failed-trajectory reflection -> sampled
   Thought/Action -> parser/deduplicator -> shared environment -> observation.
4. Value: serialized non-terminal child -> cached LLM call -> first-response
   digit parser -> scalar child value.
5. Control: UCT selection -> depth-7 expansion -> max-valued child ->
   absolute-depth-4 rollout -> terminal check -> mean-value backup.
6. Feedback: terminal reward-0 trajectory -> final-action deduplication ->
   bounded self-reflection -> later generation prompt.
7. Output: immediate reward-1 return; otherwise highest-reward collected
   endpoint after the iteration budget; reward is normalized exact answer match.

Recommended labels: **textual candidate branch**, **shared mutable web
environment**, **LLM-derived value**, **per-task failed-trajectory reflection**,
and **expand <=7 / rollout <4 absolute depth**. Do not depict learned
policy/value networks, a persistent memory database, or branch-local simulator
states unless explicitly labelled as method abstraction rather than this code.

## Runtime uncertainty deliberately left open

Static source cannot establish output-format compliance, live Wikipedia/network
behavior, retry frequency, API compatibility, how often exhaustion occurs,
accuracy, token use, or which branches reach `finish[...]`. Those require a
separately authorized reproducible execution with exact dependency, API, and
environment state recorded.

