# Code-grounded scope: LATS / HotPotQA

Frozen repository: https://github.com/andyz245/LanguageAgentTreeSearch
Commit: `853d81614607dd27433faf17c7b0a7d660f95d22`, included source license MIT.
Paper: ICML 2024, https://proceedings.mlr.press/v235/zhou24r.html.

This case reconstructs `hotpot/run.py --algorithm lats --prompt_sample cot`.
It does not merge in the programming/WebShop variants or claim to reproduce model
performance. No upstream modules are imported: module import would initialize the
environment and download a tokenizer. No model, API, Wikipedia or training is run.

## Scientific communication claim

The implementation explores question-scoped thought/action/observation trajectories
with tree search, language-model candidate values and value-guided rollout. Failed
terminal attempts provide conditional natural-language reflection context for later
sampling and value evaluation. Search-statistic updates are not weight gradients.

## Source-backed inventory

- Question/reset/root: `lats.py:159-171`; state includes thought/action/observation,
  parent/children, visits/value, terminal/reward (`87-104`).
- Selection: `select_node`, `234-260`; UCT score and terminal/backtracking handling.
- Expansion/policy: `262-269`, `302-341`; sample thought/action, deduplicate by the
  thought+action key, execute actual tool action and create a trajectory child.
- Tool execution: one module-global WikiEnv (`10-12`, `328`). The displayed tools
  Search/Lookup/Finish come from `wikienv.py:127-163`. Observation and done/reward
  return via HotPotQAWrapper (`wrappers.py:109-134`); terminal reward is normalized
  answer exact match, not a learned reward model or deployment-time verifier.
- LM value: `lats.py:27-55`, `354-377`, prompt templates in `hotpotqa.py:175-227`.
  Value may be cached; later rollout starts at the highest-valued child (`199`).
- Rollout: `271-300`, samples up to five candidate actions per expansion; absolute
  depth guard `<4`, not four additional steps. First generated terminal candidate
  returns immediately, including unsuccessful terminal outcomes (`284-286`).
- Backup: nonsuccess path `207`; `386-400` updates visit counts and node.value;
  it does not optimize network weights. Success during rollout returns first (`203-205`).
- Failure/reflection: record terminal zero-reward traces (`345-349`), deduplicate
  by final answer (`75-85`), conditionally regenerate reflection when the unique
  failure count exceeds reflection count AND is below four (`58-68`). The CoT
  policy and value prompts consume reflections (`hotpotqa.py:92-116,175-190`).
- Lifetimes: failed trajectories and reflection map clear at question start
  (`169-171`); this is not persistent long-term learning across questions.
- Exit: terminal success and budget fallback return node state (`186-188`,
  `203-215`, `222-232`). Expansion depth cap seven is distinct from rollout cap four.

## Implementation caveats, not repaired by the diagram

- lats.sh has no --algorithm value; supply `--algorithm lats` through its extra
  arguments. The figure is scoped to that explicit route, not the incomplete
  shell invocation's default behavior.
- Child textual state is copied, but the shared tool environment is not cloned
  or replayed for each sibling (`311`, `328`). Do not imply independent branch
  simulator/world states. Search state and shared environment are distinct.
- UCT divides node.value by visits although backup already averages node.value;
  retain the name without silently substituting a canonical MCTS equation.
- Candidate values are evaluated on nonterminal children then assigned/padded over
  all children; mixed-terminal alignment is a source-code caveat, not a mechanism
  to idealize in an architecture claim (`354-364`).
- Selection/retry loops may not terminate on certain exhausted-tree cases. An
  outer iteration budget is not a guarantee of a hard runtime bound.
- Prompt trajectories are retained in the code as examples, not observed results
  of this study. Any tree motif is illustrative, not a measured sampled rollout.

The graph/spec will retain exact supporting source quotations. Independent source
review precedes final visual composition. Original author figures are withheld
until a code-derived native candidate is frozen; this does not erase prior model
knowledge or textual search snippets.
