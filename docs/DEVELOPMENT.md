# Develop and test PaperFigure

Run these commands from the repository root. This repository's skill source is
`paperfigure/`; the project-local development installation points directly to it.

## Link the working source into this project

```sh
node paperfigure/scripts/bootstrap.mjs
npm run dev:link
npm run dev:check
```

`dev:link` creates `.agents/skills/paperfigure -> ../../paperfigure`. It is
idempotent for that exact source and refuses an existing copy or another link.
It never replaces a global installation. `.agents/` and `.paperfigure-dev/` are
ignored local state, not files to publish. Do not edit two installed copies.

Codex supports project-local and symlinked skill directories. Invoke `$paperfigure`
on the next turn. Codex detects skill changes automatically; if an update does not
appear, restart it. For a clean behavior test, start a fresh chat in this project
so the previous task's source, preferred answer and review verdict do not prime it.
See [OpenAI's skill discovery documentation](https://learn.chatgpt.com/docs/build-skills).

## What to edit

| Desired change | Authoritative files |
| --- | --- |
| Trigger, route selection, essential invariants | `paperfigure/SKILL.md` |
| Narrative, reader tasks, image refinement, QA procedure | Relevant file in `paperfigure/references/` |
| Style roles and palettes | `paperfigure/assets/visual-styles.json`, `palette-families.json` |
| Prompt compilation, native geometry/export, validation | `paperfigure/scripts/` |
| Repeatable behavior and failure checks | `paperfigure/tests/` |

Keep the entrypoint compact. Put case-specific rules in references. Do not edit
accepted example artifacts or old review records to make a new check pass. Source
edits are visible through the development link without reinstalling. A linked
source can change; record the Git revision and dirty diff when comparing outputs.

## Test code without image generation

```sh
npm run dev:check
npm run test:quick
npm test
```

`test:quick` covers development installation, prompt contracts and quality gates.
`npm test` runs the full software suite, including measured browser/native checks.
Neither calls ImageGen or verifies a new scientific figure's communication quality.
Use the quick suite after instruction/prompt/contract edits; use the full suite for
exporter, routing, typography or acceptance-policy changes.

To smoke-test the actual linked CLI, choose a new disposable output directory:

```sh
node .agents/skills/paperfigure/scripts/paperfigure.mjs build \
  --spec .agents/skills/paperfigure/examples/physical-vln/spec.json \
  --out .paperfigure-dev/smoke-v1
```

This exercises generation/export only. Missing Office or independent review remains
unverified; a mechanical pass is not a publication-quality or final-delivery pass.
Use a new `smoke-v2` directory on the next run; retain meaningful failures.

## Test the skill's actual decisions

In a fresh project chat, provide raw paper/code and the real request, not a
description of the intended answer. For example:

> Use $paperfigure to read [paper URL] and its official code, select the central
> mechanism, compare two distinct compositions within four ImageGen calls, obtain
> isolated image-only reading and source-informed review, then deliver native
> SVG/PPTX with an actual Office render and independent final review. Save all
> candidates and failures under a new .paperfigure-dev/paper-name-v1 directory.

Compare reader interpretations, scientific errors, visual hierarchy, native fidelity
and actual edit tasks separately. A new source scope or reader misconception calls
for narrative work; font/color polishing alone may not address it. Use the shared
[quality procedure](../paperfigure/references/quality-loop.md). The last retained
[three-case pilot](runs/2026-11-17-skill-quality-loop/REPORT.md) is historical evidence,
not an automatic pass for future revisions. Its native PowerPoint application
editing trial was unverified; code regeneration and LibreOffice are distinct.

## Test public installation separately

Use an unrelated temporary directory outside this repository. Installing a public
snapshot into this development project would obscure whether source or release is
being tested and may conflict with the existing link.

```sh
release_dir="$(mktemp -d)"
cd "$release_dir"
npx skills@1.9.0 add abs1903/PaperFigure2PPT --skill paperfigure --agent codex -y
node .agents/skills/paperfigure/scripts/bootstrap.mjs
node .agents/skills/paperfigure/scripts/paperfigure.mjs help
```

Open that separate folder in Codex to test release discovery and behavior. Record
the published Git revision; a successful install/help command does not establish
scientific, visual or editing quality. The current project continues to use its
working-source link.
