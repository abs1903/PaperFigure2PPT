# LATS Specification Review Against Pinned Code

## Verdict

**Conditionally source-faithful, with two required diagram-language corrections before
calling the specification fully source-faithful.** The 12-node / 17-edge semantic
ledger is internally complete, reflection-to-value has correctly been removed,
and the palette correctly encodes role rather than an invented learned
architecture. The two issues below are source-concrete attribution/routing
mismatches; this review does not edit the figure.

Scope is the frozen HotpotQA route at
`853d81614607dd27433faf17c7b0a7d660f95d22`, not the programming or WebShop
branches. The author figure was not viewed.

## Review boundary

This review read [`spec.json`](../paperfigure/examples/lats-hotpotqa/spec.json),
[`METHOD.md`](../paperfigure/examples/lats-hotpotqa/METHOD.md),
[`intake-corrections.json`](../paperfigure/examples/lats-hotpotqa/intake-corrections.json),
and [`build.mjs`](../paperfigure/examples/lats-hotpotqa/build.mjs) against the
pinned source. It also inspected the recorded offline-probe report; it did not
run an upstream import, model/API call, Wikipedia request, environment, or the
diagram builder.

## What is correct

- The stated route is accurate: `run.py` dispatches the explicit LATS option
  to `lats_search` ([`run.py:26-33`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/run.py#L26-L33)).
  The method correctly warns that `lats.sh` itself omits that option
  ([`lats.sh:1-11`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.sh#L1-L11)).
- The 12 declared node IDs have exactly 12 builder cards, and all 17 declared
  edge IDs have exactly one builder wire; no extra/missing IDs were found by
  static parsing of the JSON and builder source.
- The primary loop is faithfully represented as selection, expansion, child
  valuation, rollout from the maximum-valued child, then unsuccessful backup
  ([`lats.py:174-207`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L174-L207)).
  The blue policy/value/reflection cards match actual LLM-call sites rather than
  suggesting trained networks ([`lats.py:58-73`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L58-L73),
  [`lats.py:27-44`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L27-L44),
  [`hotpotqa.py:65-89`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L65-L89)).
- The green state cards are correctly question-scoped for the tree, failed
  traces, and reflection map: failure/reflection globals are cleared at each
  `lats_search` entry ([`lats.py:159-171`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L159-L171)).
  The source-level shared-environment caveat is retained: children have textual
  node state, but actions use one module-global environment with no per-branch
  state restore ([`lats.py:10-17`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L10-L17),
  [`lats.py:309-351`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L309-L351)).
- The reflection correction is right. CoT generation can consume
  `reflection_map` ([`lats.py:58-73`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L58-L73),
  [`hotpotqa.py:92-116`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L92-L116)).
  In contrast, the value-feedback prompt constructed for failures is
  unconditionally replaced by the later `else`, leaving the base reasoning
  value prompt ([`hotpotqa.py:175-207`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/hotpotqa.py#L175-L207)).
  Therefore the absent reflection-to-value edge is necessary and correct.
- The depth labels are precise: expansion stops at depth 7
  ([`lats.py:262-269`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L262-L269));
  rollout tests absolute depth against `max_depth=4`
  ([`lats.py:271-300`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L271-L300)).
  The “first terminal” caveat is also correctly retained in METHOD.md: the
  rollout returns the first terminal candidate encountered, including reward 0
  ([`lats.py:282-286`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L282-L286)).
- The role-color mapping in `design-contract.json` is appropriate: blue is
  actual LM inference (policy, value, reflection), green is stored per-question
  textual state, gray is input/control/tool/output, and gold is explicitly only
  a schematic selected trajectory. It does not claim neural layers, a learned
  reward model, or independent world-state branches.

## Required corrections

### 1. Exact-match reward is misattributed inside “Shared WikiEnv”

The tool card is named **“Shared WikiEnv”** but its contents include
**“Exact-match reward.”** WikiEnv itself initializes each step with reward 0 and
only sets answer/done for `finish[...]`
([`wikienv.py:127-163`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wikienv.py#L127-L163)).
Exact normalized answer matching is instead calculated by the outer
`HotPotQAWrapper` ([`wrappers.py:109-134`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/wrappers.py#L109-L134)).

**Required source-faithful wording:** rename the card to **“Shared wrapped
environment”** (or “Shared WikiEnv + HotPotQAWrapper”), or move exact-match
reward to a separately labelled wrapper/evaluator annotation. The existing
action list is safe as a subset, although WikiEnv also accepts `think[...]`.

### 2. Budget fallback is not necessarily a tree-only return

The `return-tree` relation and its “Budget fallback” label route from the
ordinary trajectory tree to the result. At the budget fallback, however, code
first collects ordinary descendants and then extends that collection with
`terminal_nodes` ([`lats.py:222-224`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L222-L224)).
Rollout-generated nodes are not appended to `node.children`; only their parent
links and separately collected endpoints remain ([`lats.py:271-300`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L271-L300)).
Thus `best_child` can be a separately retained rollout endpoint, not only a
displayed ordinary-tree node.

**Required source-faithful wording:** change the tree-return relation/annotation
to **“Search result / budget fallback”** and visually make it clear that the
fallback candidate pool includes collected rollout endpoints. Keep the separate
rollout-to-result edge for an immediate successful rollout terminal
([`lats.py:203-205`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L203-L205)).

## Non-blocking precision notes

- “Failed traces / Wrong terminal” is accurate only as the guarded subset
  `new_node.is_terminal and r == 0`; it should not be read as every tool
  response ([`lats.py:345-350`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L345-L350)).
- “Value-guided rollout” is supported: non-terminal rollout candidates are
  valued and the maximum is selected. The visual callout that it reuses policy,
  tools, and LM value is explanatory rather than an extra edge; it should remain
  visually secondary to avoid asserting an independently retained rollout tree.
- The specification correctly avoids portraying backup as weight learning.
  Backup only adjusts visits and node values up parent pointers
  ([`lats.py:386-400`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L386-L400)).
- The value cache is omitted from the diagram. This is acceptable for a focused
  control-flow figure, but it is a real task-object cache rather than
  question-scoped state ([`lats.py:35-43`](../paperfigure/examples/lats-hotpotqa/source/official/hotpot/lats.py#L35-L43)).
  Do not describe the diagram as enumerating all stored implementation state.

## Offline probe evidence boundary

[`offline-probes.json`](../paperfigure/examples/lats-hotpotqa/offline-probes.json)
records nine passing checks, including overwritten value feedback, shared
environment identity, absolute rollout horizon, first-terminal behavior, and
per-question feedback reset. Its stated scope is AST-extracted source functions
with local stubs; it neither imports upstream modules nor tests API, Wikipedia,
model output, task performance, or utility. The probes strengthen static
control-flow claims only; they are not effectiveness evidence.

## Acceptance gate for later diagram work

Do not alter the design in this review. Before presenting it as fully
source-faithful, correct the two required labels/routes above, preserve the
removed reflection-to-value relation, and retain the existing source caveats
(shared mutable environment, absolute rollout horizon, first-terminal return,
and non-retained rollout children). After that, the 12-node / 17-edge inventory
is suitable as a code-grounded implementation diagram, not a verdict about
method quality or measured performance.
