# Vision-language model overview

This is an original illustrative architecture specification for testing PaperFigure, not a reproduction or a claim of research novelty.

The image is processed by a frozen vision encoder, which sends visual features to a trainable projector.

The projector maps visual features into visual tokens consumed by a decoder-only language model.

The text prompt is consumed by the same decoder-only language model.

At inference, the language model produces an answer.

During training only, the language model predictions are consumed by a supervised loss. The loss is a supervision path, not an inference module.
