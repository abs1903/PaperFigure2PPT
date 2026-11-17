# Unblinded qualitative comparison — Agentless Figure 1 and frozen V4

## Scope and conclusion

This is a post-freeze, unblinded qualitative comparison of the official paper-v1
Figure 1 (PDF p. 3; https://arxiv.org/pdf/2407.01489v1) and the frozen V4
paper-v1 overview. The creator had already seen the author figure before redesign,
so this was not figure-hidden or a reader study. It does not assess native/Office
quality or establish superiority.

For a final-width paper-v1 overview, V4 is stronger at first-pass sequence clarity
and at separating LLM selections/generation from deterministic source
transformations. The author figure is stronger at conveying concrete issue/prompt
and line-level code artifacts. Its dense repeated issue boxes, robot icons, and
long return route make the overall process harder to parse at 7-inch width. These
are complementary strengths, not a blanket winner.

## Comparison

| Dimension | Author Figure 1 | Frozen V4 |
| --- | --- | --- |
| Main story | Explicit file/class/function/edit localization plus repair, but a long return route delays the phase transition. | Immediate upper L→R localization, short handoff, lower R→L repair. |
| Progressive context | Concrete repo, snippets, method/line region, and patch windows; rich but dense. | Tree → skeletons → selected code → yellow selected context is clear; less concrete issue/prompt evidence. |
| LLM/deterministic roles | Repeated issue cards and LLM robots make model use salient but noisy; representation-building role is less explicit. | `LLM + issue` / `LLM` badges and Build tree / Build skeletons / Read code cues make roles clearer. |
| Information hierarchy | Many co-salient code cards, issue boxes, icons, numbers, and phase boxes compete. | Strong stage-card hierarchy and compact repair block; phase chips/grouping remain sufficient. |
| Paper-width readability | Major labels/arrows survive; detailed issue prose and code are mostly too small. | Essential labels, badges, routes and filter sequence survive; code is intentionally secondary. |
| Craft | Bespoke, operationally tangible figure grammar, but cluttered at reduced scale. | Clean, consistent flat system; it risks feeling more schematic/generic. |

## Scope caveat and remaining V4 weakness

The inspected `previous-generated-paper-width.png` is historical only: it depicts a
later pinned-code route with empty-cohort/fewest-failure branches, so is not a
paper-v1 semantic baseline. V4 could gain operational grounding from one compact,
source-supported issue/context cue, but should not restore repeated issue paragraphs
or imply an executed repair. Its prior raster acceptance does not make it superior
to the author figure.

## Attribution and inspected identities

- Reviewer: `/root/agentless_narrative_review`; source/raster work used
  `fork_turns:none`, and this separate comparison was intentionally unblinded after
  freeze. No figures/specs/skill were changed; no native artifact was inspected.

| Artifact | SHA-256 |
| --- | --- |
| Author crop | `2115ac12019b5d66729e5b9a00f984c7d86241301eb3dec0f8be202f02bf0e8e` |
| Author 672-px diagnostic | `88d56759f5e08029fd1e1d8852440a84bea3dfaae1a4c7997be75ca4a11dda7b` |
| Frozen V4 | `81bea89ab5a2cfd8437c5ed5e194f66a81fa27852b98f372d9755e8e63ad6bcf` |
| V4 672-px diagnostic | `009194c9df89915577dc0d758c0790ba82bf771e5244ada45d130e21c8db3563` |
| Frozen-reference record | `df57666fa126ceed644a1facede7d7b6bb201c84554f82398762a1f2c6b69a0b` |
| Historical generated 672-px image | `ace2e2d988fd71d77cfc016325878d609e12e3e650703f597e50c222315921b9` |
| Historical pinned-code reference | `8ada8240f87b2f77d76097d43ec714f0d68b156481009f30a15ed2154df12d91` |

