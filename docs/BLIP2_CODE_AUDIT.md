# Independent code audit: BLIP-2 OPT generation branch

## Scope and status

This is a code-only audit of the Salesforce LAVIS checkout supplied at
`05cb670f47296522e24e7727e366b4a997d28582`. It traces the configured
`pretrain_opt2.7b` branch's `Blip2OPT.generate()` route. It does **not**
inspect, reproduce, or compare any paper figure, and it does not execute model
weights. Consequently, the findings below constrain a faithful architecture
diagram of this implementation; they do not claim which visual conventions a
paper used.

## Configuration resolved by this audit

The supplied YAML selects `arch: pretrain_opt2.7b`, sets `freeze_vit: True`,
`num_query_token: 32`, `opt_model: facebook/opt-2.7b`, image size 224, and an
empty default prompt. It does not set `vit_model`; `from_config()` supplies its
default `eva_clip_g`. [config lines 6-28; `blip2_opt.py` lines 393-423]

`from_config()` constructs the model and then asks the base machinery to load
the configured checkpoint. This audit did not download or inspect that
checkpoint, so it establishes module topology and explicit `requires_grad`
settings from source, not the numerical contents of the learned parameters.

## Active caption-generation data flow

For an image batch, `generate()` executes the following ordered route:

```
image
  -> EVA-CLIP-G visual encoder
  -> fp16-safe LayerNorm (`ln_vision`)
  -> image token embeddings + all-one image attention mask
  -> 32 learned query tokens expanded across the batch
  -> Q-Former query-only pass, cross-attending to image embeddings
  -> linear `opt_proj` into OPT hidden width
  -> visual prefix embeddings
  -> concatenate [visual prefix, OPT embeddings of prompt]
  -> frozen OPT causal-LM `generate`
  -> token IDs -> OPT tokenizer `batch_decode(..., skip_special_tokens=True)`
  -> stripped text
```

The source makes the concatenation order unambiguous: the projected Q-Former
output is first and the prompt-token embeddings are second; their attention
masks are concatenated in the same order. [ `blip2_opt.py` lines 192-245 ]

The configured default prompt is `""`. A caller can instead supply
`samples["prompt"]`; the selected string is repeated once per image before
OPT tokenization. Thus, a generation diagram may show an optional text prompt
entering **OPT**, but must not present a mandatory nonempty prompt for this
configuration. [ `blip2_opt.py` lines 212-230; config line 27 ]

## Q-Former facts that a diagram must preserve

1. The generation call gives the Q-Former `query_embeds`, image embeddings as
   `encoder_hidden_states`, and an image attention mask. It provides no
   `input_ids` or text embeddings to the Q-Former. Therefore, **generation
   text does not enter Q-Former in this branch**. [ `blip2_opt.py` lines
   199-205 ]
2. The actual configured query-token count is **32**. A compact drawing may
   show fewer glyphs only if it clearly says that they are schematic (for
   example, `32 learned query tokens`, with an ellipsis); four or another
   small number must not be shown as the literal model count. [config line 21;
   `blip2.py` lines 47-61]
3. Q-Former is initialized from BERT configuration with cross-attention
   enabled every two encoder layers (`cross_attention_freq=2`). The layer
   numbering in the implementation starts at zero, so layers 0, 2, ... have
   cross-attention. At those layers, only the query portion is passed through
   image cross-attention. A diagram should preserve the direction: query
   states attend to visual embeddings (visual embeddings are the key/value
   source), not the reverse. [ `blip2.py` lines 47-61; `Qformer.py` lines
   378-484 ]
4. Before use, this OPT-specific constructor removes Q-Former's classifier,
   word embeddings, position embeddings, and the non-query feed-forward
   modules (`layer.output` and `layer.intermediate`). That is compatible with
   the query-only generation invocation and is evidence against drawing a
   normal BERT text-token input pathway into Q-Former for this route.
   [ `blip2_opt.py` lines 75-83 ]
5. The Q-Former output is not directly an OPT token ID sequence. It is a
   sequence of query hidden states passed through a learned linear projection
   (`opt_proj`) before becoming OPT input **embeddings**. The projection must
   be present in a faithful diagram. [ `blip2_opt.py` lines 207-210 and
   229-230 ]

## Explicit freezing and trainability

The `freeze_vit: True` configuration takes effect by setting
`requires_grad=False` on **`visual_encoder` parameters only**, forcing that
encoder to evaluation mode, and overriding its `.train()` method so it remains
there. [config line 18; `blip2_opt.py` lines 65-73]

The OPT causal LM is also explicitly frozen parameter-by-parameter.
[ `blip2_opt.py` lines 85-95 ]

Do not overstate those two facts as "all vision-side computation is frozen":
`ln_vision` is constructed separately after the visual encoder, and the
freezing loop names only `self.visual_encoder`. This source does **not** set
`ln_vision` parameters to `requires_grad=False`. Nor does it explicitly freeze
the Q-Former, the learned query tokens, or `opt_proj`; absent optimizer-level
choices outside the supplied files, those remain trainable module parameters.
[ `blip2.py` lines 63-83; `blip2_opt.py` lines 65-97 ]

Accordingly, a figure may label the ViT and OPT as frozen, but should not label
the intervening LayerNorm as frozen solely because it is drawn after the ViT.
It may label Q-Former/query tokens/projection as trainable only with the scope
made clear: that statement follows their default `requires_grad` state in this
model code, not an inspected optimizer configuration or a checkpoint audit.

## Masks and training facts: keep separate from the generation diagram

During generation, the projected visual-prefix positions receive an all-one
attention mask, which is prepended to the tokenized prompt's attention mask.
The visual prefix is available to OPT as prefix embeddings; it is not a
decoded textual prompt. [ `blip2_opt.py` lines 207-230 ]

`forward()` is a distinct teacher-forced training path, not `generate()`. It
appends a newline to each training text, tokenizes that text, masks padding
labels to `-100`, optionally masks the configured prompt-length labels, and
prepends an all-`-100` target span for all visual-prefix positions. The inputs
are nevertheless concatenated in the same order: projected visual prefix then
OPT token embeddings. [ `blip2_opt.py` lines 107-162 ]

Therefore a caption-generation figure should not draw visual-prefix positions
as having direct next-token loss labels. If it includes training supervision at
all, it should be explicitly shown as a separate training-only annotation or
panel, with prefix-label loss masked.

## Figure acceptance checklist

A code-faithful figure of this branch must satisfy all of the following:

- Image passes through EVA-CLIP-G then a separate LayerNorm before Q-Former.
- 32 learned queries, not text tokens, are the inputs to Q-Former in
  `generate()`.
- Q-Former cross-attends from query states to image embeddings at alternating
  layers; it outputs query representations.
- A learned linear projection bridges Q-Former width to OPT width.
- Projected visual representations precede optional prompt embeddings in OPT's
  input-embedding sequence and attention mask.
- OPT is a frozen causal language model that performs autoregressive
  generation; decoded captions emerge after OPT, not from Q-Former.
- ViT and OPT freezing are shown precisely; the separate vision LayerNorm is
  not silently absorbed into the frozen ViT claim.
- Any schematic reduction in the number of query icons is explicitly marked as
  illustrative.

## Deliberate limits and uncertainties

- This audit does not establish the exact patch/token count emitted by the
  EVA-CLIP-G visual encoder, the Q-Former layer count or hidden dimensions, or
  OPT hidden width. Those depend on the referenced model configurations and
  weights, which were not among the requested source files.
- The code guarantees the default model selection and the generation topology;
  it does not guarantee what arbitrary caller-provided `samples["prompt"]`
  contains.
- `generate()` uses `max_length` rather than this audit resolving the
  transformers-version-specific semantic difference between total versus new
  token limits. That implementation detail does not change the architecture
  routing above.
- No visual comparison has been performed. That review is intentionally
  deferred until an author diagram is frozen.
