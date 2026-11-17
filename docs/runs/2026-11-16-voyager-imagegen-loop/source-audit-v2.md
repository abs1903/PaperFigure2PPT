# Source-audit addendum v2 — registration condition

This focused amendment check preserves [the initial audit](source-audit.md) and
rechecks only the revised registration wording. No source execution, external
service, or raster candidate inspection occurred.

## Inputs checked

- `design-brief.json` SHA-256:
  `7439845a9def1080cd6a87448c1f51c3ce1dfc809419dd7a53d8ab5c1a22467e`
- `prompt-v1.txt` SHA-256:
  `ddc416a427395e1583bea1a68f4839ef3eb6784eea563e93fade54687a15e32d`
- Relevant pinned source: the outer loop calls registration only on
  `info["success"]` ([`voyager.py:353-354`](../../../paperfigure/examples/voyager-agent/source/voyager/voyager.py));
  the manager then returns without registration for tasks whose name starts
  `Deposit useless items into the chest at`
  ([`skill.py:61-64`](../../../paperfigure/examples/voyager-agent/source/voyager/agents/skill.py)).

## Amendment verdict: accept for generation

The brief and compiled prompt now state that *successful non-deposit-cleanup*
tasks enter persistent skill storage and that both deposit-cleanup success and
failures are not stored. The exact visible label, **“Success, except deposit
cleanup,”** makes the exception legible without inventing an extra module,
branch, or footnote. This precisely matches the two-stage source condition
above and is clearer than a bare “Success” label.

This acceptance is confined to the corrected source interpretation before
generation. It does not approve a generated image, its typography, composition,
arrow routing, or subsequent native reconstruction.
