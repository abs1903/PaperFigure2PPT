# Embodied navigation agent

This is an original illustrative architecture specification for testing PaperFigure, not a reproduction or a claim of research novelty.

The current RGB-D observation is processed by a visual encoder. The resulting visual features are sent to a state fusion module.

The navigation instruction is processed by a language encoder. Language features are sent to the state fusion module.

A recurrent state store supplies previous state to state fusion. The fused state updates the recurrent store for the next time step.

The state fusion output is passed to an action policy. The action policy sends an action to the environment.

The environment returns the next RGB-D observation at the next time step.

For this illustrative design, state fusion is the component under study; visual and language encoders and the action interface are the baseline components. This is not a claim of novelty over published VLN systems.
