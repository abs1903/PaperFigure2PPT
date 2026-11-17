# Independent contribution-oriented source/narrative review — Agentless

## Verdict: revise

The revised plan correctly moves away from seven equal process cards and identifies
the paper-v1 contribution as an **agentless combination of established techniques**:
fixed two-phase control, hierarchical concise-context localization, localized
Search/Replace generation, and deterministic selection. The source supports keeping
Lite-S outside this method computation graph. One central contribution callout still
needs to be made specific before generation.

## Required correction

### R1 — `Fixed control` is too generic to communicate the central distinction

The paper’s contribution-facing rationale is not merely that control is “fixed.” It
contrasts a simplistic, fixed two-phase process with autonomous agents that use
tools, observe feedback, and decide/plan future actions ([introduction lines
21–32](paper-introduction-source.txt), [69–99](paper-introduction-source.txt));
the method also contrasts its simple two-phase procedure with autonomous agent
interactions ([method lines 164–173](paper-method-source.txt)).

The proposed bracket does give the right geometry and avoids inventing a baseline
graph, but the label `Fixed control` alone does not name the actual source-supported
design choice or why it matters. Under the contribution-hierarchy rule, it risks
reading as a generic decoration rather than a contribution cue.

**Required correction:** label the framing annotation with the concrete distinction,
for example `Fixed two-phase control` plus a compact subordinate phrase such as
`no agent planning/tool loop`. This is a source-supported explanation of the
combination, not a claim of a new primitive or an added controller module.

## Supported hierarchy and visual mechanisms

| Claim/grouping | Outcome | Source support and planned visual mechanism |
| --- | --- | --- |
| Agentless fixed two-phase combination, not new primitives | pass with R1 label correction | Intro lines 27–32 and method lines 164–173; bracket over the two focal mechanisms and bounded LLM markers |
| Hierarchical localization via concise source representations | pass | Intro lines 112–120 and method Section 2.1; dominant source-reduction geometry with tree → skeletons → selected source → padded focused interval |
| Localized Search/Replace repair | pass | Method lines 140–149; magnification from one gold source interval to SEARCH/REPLACE strips while gray surroundings stay unchanged |
| Syntax/regression filtering and normalized frequency ranking | pass | Method lines 150–163; compact subordinate deterministic strip, correctly not promoted as the innovation |
| No LLM-built source/tree/skeletons or autonomous feedback/controller loop | pass | Intro lines 21–32, 73–106; small bounded LLM markers plus deterministic captions/no feedback path |
| Lite-S / benchmark audit outside the method graph | pass | Intro lines 33–40; deliberately record-only rather than an algorithm node |

## Contribution-communication assessment before pixels

The proposed asymmetrical layout has concrete mechanisms rather than generic flow:

1. **Constrained reasoning context** is represented by progressively shrinking,
   linked source artifacts, not a sequence of equal boxes.
2. **Constrained emitted change** is represented by magnifying only a selected
   source interval into local Search/Replace strips while surrounding code remains
   visible and unchanged.
3. **Combination under fixed control** is represented by a framing annotation and
   bounded LLM calls, but needs R1’s precise label to be interpretable.
4. Filtering/ranking remains necessary graph meaning but is visually subordinate,
   which correctly avoids treating an established support operation as the focal
   contribution.

The no-number/no-uniform-card choice directly addresses the user’s rejection of an
overly procedural diagram. The proposed graph retains all prior accepted method
relations; I did not repeat the unchanged edge-by-edge audit.

## Boundaries and unverified items

- No image exists in this review, so contribution prominence, composition,
  typography, arrow readability, and final-width behavior are unverified.
- No author/reference figure was opened for this pre-generation review.
- This does not grant raster, native/editability, Office, or delivery acceptance.

## Attribution and file identities

- Reviewer: `/root/agentless_narrative_review`, delegated with `fork_turns:none`.
  I opened the supplied paper extracts, current spec/plan/brief, and updated
  PaperFigure narrative/review instructions; no model/code/API ran and no inputs
  were modified.

| File | SHA-256 |
| --- | --- |
| `paper-introduction-source.txt` | `e1d5159bcc58a1c8e6dfd329829728746db2cbaa5233e9dd609e762c2b9ecec6` |
| `paper-method-source.txt` | `b0a9c15af53234d86bae255aca4dbc0751122ddf4ce845eda1d2eb97255a5622` |
| `spec.json` | `4a5efd5a2079c68cf61a2448386f1bc4657dc98187d8b410e8f9f1bc4959f78c` |
| `narrative-plan.json` | `f268a962ff9da31931ad02c81768119206d9a9010b060a384a678d701512369e` |
| `design-brief.json` | `d27349b3e9c304681bada90d52fb25a24622505a844f037582d7fc9d69588234` |
| `paper-narrative.md` | `812c4112a6e07d15908926b59bba19fc1e55676c6db6f228c149ef7b189b4737` |
| `visual-review.md` | `e9c4b50a9d73e12e2d5df7e826324ed06f92a2310eef248cbba932a164cf8ca6` |

