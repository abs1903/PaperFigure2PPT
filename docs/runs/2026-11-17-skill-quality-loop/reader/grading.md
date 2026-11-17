# Independent source-informed grading

Grader: `independent-agent /root/reader_grading`.

This audit compares each frozen, image-only observation to its paired rubric, the source-map image, and the cited source records. It assesses only the declared conceptual question scope. It does not require omitted implementation detail, does not turn general method familiarity into pixel evidence, and does not assess prior native-fidelity acceptance or human comprehension.

## Case a — contrastive image/text transfer

The source plan and method prose support paired natural-language image/text supervision, a full paired-batch similarity relation with two directions, and reuse of pretrained encoders with language-provided candidate classes. The rendered image visibly supports the reader's q1, q2, and q4 accounts and its stated boundaries. Q3 is **unclear**: it establishes reuse but stops short of answering that the upper encoders are learned in pre-training, a conclusion sufficiently supported by the labeled pre-training stage and source contract. It correctly declines to make unshown frozen/update/prompt-learning claims.

## Case b — masked autoencoding

The source audit confirms the key conceptual distinctions represented in the figure: visible-only encoder input, post-encoder shared mask-token insertion and restoration, full-position decoder prediction, and loss only over masked positions. All four saved answers are **correct**. Their caveats avoid out-of-scope implementation, configuration, and performance claims rather than weakening the scoped answers.

## Case c — fixed localization and repair

The narrative plan and supplied method text support hierarchical repository/file/element/edit-location narrowing, localized Search/Replace generation, syntax/regression filtering plus normalized frequency selection, and a fixed non-autonomous control design. All four saved answers are **correct**. In particular, the reader distinguishes a selected patch from a proven correct repair and rejects a success-rate claim; neither should be inferred from this schematic.

## Limitations

The finding is a source-informed audit of three saved agent observations, not a new blind-reader experiment or a timed human-comprehension result. It verifies neither implementation behavior nor empirical utility. Source support explains what the intended schematic claims mean; it does not license reading nonvisible particulars into an image-only answer. Conversely, previous native-fidelity/render acceptance is a separate acceptance dimension and is not re-certified here.
