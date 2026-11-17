# MAE source audit

## Scope and verdict

This audit covers the pinned CVPR 2022 paper, its supplied text extracts, the
pinned `models_mae.py`, and its supplied license.  It is an author-informed
source audit: `author-figure-1.png` was allowed for source inspection, but is
not a visual specification for a new composition.  No model, training, or API
was executed.

**Status: source semantics are sufficient for a new, original MAE-method
illustration, subject to the non-negotiable distinctions below.**  The
forthcoming plan/spec/brief must be reviewed separately; this audit does not
accept a visual proposal.

## Source identity and integrity

| Item | SHA-256 | Evidence / status |
| --- | --- | --- |
| Paper PDF | `81bbc64bc197a64362927010470e46601a0f0311aa4c2014a355dfff0e5b3b6c` | CVPR Open Access URL and version are recorded in `source/paper-provenance.json`. |
| Paper text extract | `cc04fcfeeb544ad0c11b26a61e382d187b4fcef77e5fed1ea5d0d0cd2f90ac61` | Supplied extraction. |
| Method-pages extract | `157bc873bec27fda493eafcf3ea9e15e7a6132ff3a161de6315eeb80ce221e3f` | Supplied extraction; PDF pp. 3--4, marked at line 60. |
| Official implementation | `973c01f31fdf15febb5976baecd639b83a5cc011161af852e54ca68c6c2bafb4` | Pinned at commit `efb2a8062c206524e35e47d04501ed4f544c0ae8` in `source/manifest.json`. |
| Author Figure 1 | `59c7196892746b5a81267ca28f2c1eb52a9a7d779275ebf9cf50873cd96cbad1` | Inspected only as explicitly permitted; 517 x 290 px. |
| Supplied license | `ffe3b1e0b58c1f1250ce48f84d8c37328f9a1ff59bb77b63bc97480cf2778b64` | CC BY-NC 4.0 title at `source/LICENSE:2`; do not treat this audit as legal advice. |

The hashes above match `source/manifest.json` for its four listed pinned
artifacts. The extract hashes are recorded here because they are evidence
inputs but are not listed in that manifest.

## Source-supported semantic contract

1. **Patch masking is removal, not an encoder-side placeholder grid.**  The
   image is divided into regular non-overlapping patches; a uniform random
   subset is retained and the remainder is masked/removed (paper extract
   `method-pages.txt:27-32`).  The encoder consumes only visible patch tokens:
   masked patch tokens are absent and *no mask tokens* enter it
   (`method-pages.txt:41-50`; implementation `models_mae.py:150-170`).

2. **The asymmetry must remain legible.**  A comparatively large encoder acts
   on the shortened visible-token sequence. A lightweight decoder later acts
   on the restored full patch-token sequence. The paper explicitly frames this
   as the two core designs together with high-ratio masking
   (`paper-text.txt:15-29`; `method-pages.txt:73-90`). A new figure may show
   relative weight/size, but must not invent an unreported layer count,
   throughput, or speed benefit for the selected configuration.

3. **Mask tokens appear after the encoder and occupy missing positions only
   after restoration.**  The decoder input is encoded visible patch tokens plus
   shared learned mask tokens (`method-pages.txt:51-54`, `64-71`). The concrete
   implementation projects encoder outputs to decoder width, appends repeated
   `mask_token` vectors, restores original patch order, and then retains the
   class token (`models_mae.py:172-184`). Thus a diagram must not send mask
   tokens through the encoder, or depict the decoder as receiving only mask
   tokens.

4. **Restored spatial positions are essential at the decoder.**  The paper
   states that positional embeddings are added to every full-set decoder token
   so a mask token has location information (`method-pages.txt:64-71`). In the
   pinned implementation, encoder patch positions are added before masking
   (`models_mae.py:150-158`); separate fixed 2-D sin-cos encoder and decoder
   positional embeddings are initialized (`models_mae.py:36-37`, `49-52`,
   `65-72`) and decoder positional embeddings are added after restoration
   (`models_mae.py:182-184`). A high-level visual may omit drawing positional
   embeddings only if it makes no contrary claim; if it labels them, it must
   distinguish their role/placement correctly.

5. **Class-token detail is implementation-level and easy to misdraw.**  The
   provided code prepends a position-added class token only after patch masking
   and before encoder blocks (`models_mae.py:160-168`). It remains through the
   decoder sequence but is stripped before patch prediction (`models_mae.py:178-194`).
   The paper’s conceptual Figure 1 does not require a class-token glyph. For a
   clean conceptual illustration, omission is safer than showing a class token
   as a patch, a mask token, an output patch, or a loss target.

6. **Prediction coverage and loss coverage are different.**  Decoder
   prediction has one vector per restored patch position and is reshaped into a
   reconstructed image (paper `method-pages.txt:91-100`; code
   `models_mae.py:190-196`). The objective is pixel-space MSE, but is averaged
   only over removed/masked patches (`method-pages.txt:97-105`; code
   `models_mae.py:198-214`). Therefore do not equate “full decoder output”
   with “loss on every patch”; a loss callout should attach only to masked
   positions.

7. **Target wording must preserve the paper/code boundary.**  The paper
   describes raw pixel reconstruction and reports a normalized-per-patch pixel
   variant (`method-pages.txt:91-106`). The pinned code chooses that variant
   only if `norm_pix_loss` is enabled (`models_mae.py:204-209`). Use a generic
   label such as “pixel target / MSE on masked patches,” unless the proposed
   figure explicitly identifies the normalized-pixel option and its scope.

8. **Pre-training and downstream use are distinct.**  The decoder is for
   pre-training reconstruction; after pre-training it is discarded and the
   encoder receives uncorrupted full patch sets for recognition
   (`paper-text.txt:22-29`; `method-pages.txt:73-80`). A downstream inset is
   permissible, but it must not imply that decoder/mask tokens survive into
   recognition.

## Required visual truths for an original composition

- Show a regular patchified image and a visibly sparse/random visible subset;
  label any exact ratio as an example from the paper (for example, “75% masked
  during pre-training”), not as a universal constant.
- Make the encoder input shorter than the decoder's patch sequence.  A token
  count cue such as `visible tokens` versus `full positions` is stronger than
  merely colouring a dense grid.
- Place the mask-token insertion/restoration operation between encoder and
  decoder.  A compact `restore original patch order` cue is source-supported.
- Distinguish reconstructed patch predictions from the loss selection. A
  masked-only outline/brace on the comparison is accurate; a full-image MSE
  brace is not.
- If showing post-pretraining recognition, branch it from the encoder only and
  label it as downstream/fine-tuning use; otherwise omit the branch.

## Claims and depictions to reject

| Reject / revise | Why |
| --- | --- |
| Mask tokens drawn into the encoder, or masked patches passed there as blank/gray token embeddings | Contradicts removed-patch/no-mask-token encoder semantics. |
| A dense input sequence presented as the encoder input at 75% masking | Conceals the computationally important shortened sequence. |
| Decoder only predicts missing patches | The supplied implementation returns predictions for every patch position; only its loss is masked-only. |
| MSE applied to the entire reconstruction | Contradicts paper and code. |
| “The decoder sees the original image” | It sees encoded visible tokens plus learned mask tokens restored to full token positions, not raw image patches. |
| Mask token depicted as per-location learned content | It is a shared learned vector; positional embeddings supply location. |
| Claim that tokens are sampled spatially contiguous, semantic/object-aware, saliency-based, or fixed in a checkerboard | Source specifies uniform random sampling without replacement. |
| Claim that `75%` is mandatory for every use or that all MAE variants normalize targets | Unsupported generalization. |
| Class token drawn as a pixel patch/reconstruction target | Contradicts implementation handling; omit it unless the implementation-specific path is deliberately annotated. |
| Copying the original figure's layout, visual elements, or caption as if it were a template | Inspection is allowed, but the requested deliverable is a new composition. |
| Claimed performance, acceleration, or configuration numbers beyond cited source wording | Needs separately attributed, configuration-matched evidence. |

## Illustration-review gate for the pending plan

Approve only if the proposed plan/spec/brief makes all of the following
checkable:

1. random patch removal produces the encoder-visible subset;
2. encoder has no mask tokens and decoder insertion happens afterward;
3. restored full positions combine encoded visible tokens and shared mask
   tokens, with a non-misleading positional-location cue if positions are
   explained;
4. predicted patch grid/full reconstruction is visually separated from MSE
   over masked positions;
5. any class token and normalized-target details are either correct or omitted;
6. any downstream branch discards decoder/mask tokens;
7. composition is independently authored and does not reuse the author
   figure as a layout/template.

## Evidence locator conventions

Line locators refer to the immutable files under `source/` and their hashes in
the first table. `method-pages.txt` is a two-column PDF text extraction, so a
single numbered line can sit beside unrelated material from the other column;
the cited contiguous passages, PDF-page marker, and matching implementation
locators are supplied to prevent treating column adjacency as method flow.
