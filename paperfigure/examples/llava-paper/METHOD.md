# Paper-grounded design brief: original LLaVA

Source: [Visual Instruction Tuning, NeurIPS 2023](https://proceedings.nips.cc/paper_files/paper/2023/file/6dcf277ea32ce3288914faf369fe6de0-Paper-Conference.pdf), Sections 4.1–4.2, Figure 1 and Equation 1.
This is an authored summary for a new example, not a revision of the original
six-sentence illustrative VLM source. No paper artwork is copied or redistributed.

An image passes through the CLIP ViT-L/14 visual encoder. A learned linear matrix
W maps its features Z_v into language-space visual embeddings H_v, with
H_v = W Z_v. These visual embeddings and the instruction's text embeddings condition
Vicuna, which generates a language response autoregressively.

The training schedule carries information absent from the earlier generic example:
alignment trains only W while retaining both backbones; subsequent instruction
tuning updates W and Vicuna while the vision encoder stays frozen.

Keep the model's internals abstract and compact. Do not import a Q-Former, MLP
projector, cross-attention adapter, exact token/layer counts or performance claims.
Do not label all of Vicuna as frozen without distinguishing the training stage.
No figure title, footer or explanatory fine print is requested.
