# Reflexion: ReactReflectAgent HotpotQA

Scope: REFLEXION strategy in the official ReactReflectAgent implementation, pinned
in source-manifest.json. The actor generates Thought and Action, uses Wikipedia
Search/Lookup, and collects observations in a scratchpad. Finish records the answer;
a step/token halt may also end an attempt. Correctness is normalized exact match
against a supplied reference key; this evaluator is not another language model.

On a later run() call, a finished/halted incorrect prior attempt triggers a separate
self-reflection language model. It receives the same question and a truncated prior
scratchpad. The returned reflection text is appended to the instance's reflection
list and formatted into the actor prompt. The next actor attempt resets scratchpad,
answer, finished flag and step counter while retaining the reflection list.

The diagram separates the within-attempt tool loop from the across-attempt text
memory loop. The caller controls repeated run() calls; there is no unlimited
self-executing retry loop, shared vector database, gradient or optimizer update.
Common task conditioning is named once; not every prompt argument is wired.
