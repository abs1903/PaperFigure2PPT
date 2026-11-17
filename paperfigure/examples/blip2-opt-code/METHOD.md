# BLIP-2 OPT: source-derived generation route

This new example derives the active caption-generation route from the official
Salesforce LAVIS implementation, fixed at the commit in `source-manifest.json`.
The inspected `pretrain_opt2.7b` configuration resolves to EVA-CLIP-G, 32 query
tokens, a frozen vision encoder, and `facebook/opt-2.7b`.

The image passes through the frozen visual encoder and a separately constructed
`ln_vision` LayerNorm. The normalized image embeddings enter Q-Former as the
cross-attention key/value source. Learned query embeddings enter its query stream;
the generation call passes no text tokens into Q-Former. Its query representations
are mapped by the learned `opt_proj` linear layer into OPT's embedding width.

An optional caller prompt, empty by default in the selected configuration, is
tokenized and embedded using OPT's frozen token table. The generation input is
concatenated in the explicit order `[projected visual prefix; prompt embeddings]`.
The frozen OPT causal language model generates token IDs, and its tokenizer decodes
them into stripped caption text.

The vision freeze loop does not freeze the separately constructed LayerNorm.
Learned queries, Q-Former, LayerNorm and the linear projection retain trainable
parameters in the inspected constructor; no optimizer run or parameter update was
executed. Training loss masks are audited separately, not presented as generation
outputs. The first-stage objectives and FLAN-T5 branch are outside this diagram.

The semantic inventory was frozen before viewing any author diagram in this run.
This is not a claim of a fully blind held-out study: general prior knowledge and
textual search snippets cannot be excluded.
