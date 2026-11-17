# Install and prepare PaperFigure

This repository contains one skill at `paperfigure/`. A root-level `SKILL.md` is
not required: install the named skill or use its explicit GitHub tree URL.

## Install from GitHub

With the open `skills` CLI (version 1.9.0 was tested; it requires Node.js 22.20+):

```sh
npx skills add abs1903/PaperFigure2PPT --skill paperfigure --agent codex --global
```

Omit `--global` for a project installation. The explicit source URL is
`https://github.com/abs1903/PaperFigure2PPT/tree/main/paperfigure`.
The repository is private; installation requires an account with repository access
and existing Git/GitHub CLI authentication. No credential should be pasted into a
prompt or written into an install command.

Codex's Skill Installer also supports that tree URL. Ask it to install:

> Install the skill from https://github.com/abs1903/PaperFigure2PPT/tree/main/paperfigure

Both routes copy skill files; they do not execute npm setup automatically. After
installation, start a new Codex chat and invoke `$paperfigure`. Its first-use
instructions run setup from the installed directory.

## First-use setup

The skill runtime itself requires Node.js 20+ and npm. From the actual installed
skill directory, run:

```sh
node scripts/bootstrap.mjs
node scripts/bootstrap.mjs --check
```

Setup uses the bundled lockfile and installs dependencies only when local pinned
packages are missing, mismatched or cannot load. It does not use an ancestor
project's dependencies as proof of a complete installation. It reports Node and
browser readiness separately and never grants figure acceptance.

Measured SVG/native QA additionally needs Chromium. Playwright is a declared,
locked dependency. Setup reuses an available browser; to download the matching
Chromium only when no usable browser is found, run:

```sh
node scripts/bootstrap.mjs --with-chromium
```

`PAPERFIGURE_CHROMIUM` can select an existing executable, and
`PAPERFIGURE_PLAYWRIGHT` can select an explicit Playwright entrypoint. Existing
browser sessions are never restarted. A host-provided Codex browser runtime is a
supported fallback, not a substitute for declaring the installed skill's packages.

Actual PowerPoint verification additionally needs LibreOffice (`soffice`) and
Python with PyMuPDF/numpy, for example:

```sh
uv run --with pymupdf --with numpy python scripts/render-layout.py --out OUTPUT --checks
```

Usable fonts and fontconfig may be required by the selected source typography.
Missing Office, fonts or review evidence stays unverified. ImageGen is provided
by the host tool when available; installing this skill supplies no image model,
provider credentials or automatic paper parser.

## Local-checkout alternative

```sh
git clone https://github.com/abs1903/PaperFigure2PPT.git
cd PaperFigure2PPT
npm --prefix paperfigure ci
node paperfigure/scripts/install.mjs
```

The local installer refuses an existing destination and does not overwrite it.
This full development skill includes historical examples and regression fixtures;
the repository is not a minimal instruction-only download. They are retained to
keep example references and frozen checks intact.

Installer references: [skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md),
[Codex Skill Installer](https://github.com/openai/skills/tree/main/skills/.system/skill-installer).
