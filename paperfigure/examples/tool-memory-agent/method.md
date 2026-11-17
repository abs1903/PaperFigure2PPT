# Language agent with tools and memory

This is an original illustrative architecture specification for testing PaperFigure, not a reproduction or a claim of research novelty.

The task is passed to the language-model controller.

The controller issues tool calls to external tools. Tool observations return to the controller on a subsequent decision step.

The controller queries persistent memory. Retrieved context returns to the controller. Memory contents are maintained externally; this overview does not imply gradient updates or automatic memory writes.

The controller emits a final response to the user.
