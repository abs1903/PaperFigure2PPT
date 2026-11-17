# Voyager: automatic learn() loop

Scope: the official automatic-curriculum learn() mode, not a measured Minecraft
rollout. The curriculum proposes task and context using latest events, chest
observations and stored exploration progress. The action agent generates JavaScript;
the orchestrator parses and executes it in Minecraft with all saved programs and
fixed control primitives. Runtime events and a critic's success/critique feed the
next refinement prompt. A rollout stops on success or its retry cap.

The skill manager retrieves top-k code for the action prompt. The initial query
is task context; the refinement query adds a filtered chat-log prerequisite summary.
This query construction is orchestration/helper work, not another invented LLM.
The runtime's program bundle is broader than retrieved prompt snippets.

Critic-success programs are eligible for persistent skill registration as code
plus descriptions; deposit-useless-items tasks are explicitly excluded. This
success-conditioned edge abstracts registration orchestration and the description
LLM. Task success/failure also updates curriculum exploration progress. Latest
world events are another curriculum input named locally; the overview omits that
separate wire to keep the main learning loops legible. There are no gradient
updates or claims of unlimited retry/success. Primitive APIs are fixed dependencies,
not learned skill entries. API model names can be configured; no API was called.
