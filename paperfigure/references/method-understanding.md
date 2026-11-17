# Understanding a method without inventing its architecture

The Codex agent performs this stage, using the user's actual input. The local
CLI consumes the resulting JSON; it does not call an LLM. Retain the natural
language input and the agent's interpretation so reviewers can compare them.

| Input | Focused intake | Evidence to retain |
| --- | --- | --- |
| Method text / description | Identify named computations, tensors, interfaces and conditions | Exact excerpts and original file |
| PDF / arXiv | Read method, relevant equations and caption; inspect the source figure if supplied | Paper URL/version, section/page, exact excerpt; text extraction alone may lose formulas |
| Model repository | Follow the executed forward/inference path, configuration and state updates | Commit hash, path and line range, excerpt; distinguish unused classes from active computation |
| Sketch / reference image | Inventory labels, arrows, groups and ambiguities | Original image, visible-label transcription and uncertainty list; visual appearance does not establish training semantics |

For each semantic node and edge, attach at least one `{source, quote}` record
whose quote occurs in the retained source text. The validator checks presence,
not entailment: a quote can exist while failing to support the claimed edge.
The source review must therefore examine arrow direction and meaning explicitly.

Decide what belongs in the figure before deciding how to draw it. Record one
communication claim, baseline boundary, proposed component(s), scope, and unresolved
assumptions. Do not highlight a standard component as novel simply to add color.
Keep weights/frozen status, training losses, token transformations and temporal
state distinct. A tool call is control; its observation is returned data. A memory
read does not imply a memory write. A recurrent update is temporal feedback.

For missing PDF/browser/image tools, continue only from evidence actually readable.
Report the missing intake path instead of claiming that the entire paper was read.
The provided three examples verify local description-to-spec-to-export behavior;
general paper/code/sketch understanding is an agent workflow, not benchmarked NLP.
