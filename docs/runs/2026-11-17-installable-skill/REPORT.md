# Installable GitHub skill verification

## Finding and correction

The existing repository was already discoverable as exactly one `paperfigure`
skill. A root `SKILL.md` or a directory migration was not necessary. The previous
README emphasized cloning/manual export rather than direct GitHub installation;
first-use runtime setup was not covered by the figure-delivery tests.

The measured-native pipeline also used Playwright without declaring it in the
skill package, relying on an available host runtime. Playwright 1.62.1, the
already-used host version, is now an exact locked dependency. Existing renderer,
semantic contracts, themes, accepted figures and historical cases remain intact.

The repository now provides:

- A first-screen `npx skills add ... --skill paperfigure --agent codex --global`
  command and explicit `tree/main/paperfigure` URL.
- Packaged `references/installation.md` for both the skills CLI and Codex Skill
  Installer, authenticated private-repository access and environment requirements.
- Dependency-free `scripts/bootstrap.mjs`: checks exact local package versions and
  actual imports, installs missing locked dependencies using npm ci, and reports
  browser availability. `--check` is read-only; `--with-chromium` downloads Chromium
  only when no usable browser is found. No provider key or image-model API is used.
- A first-use instruction in SKILL.md that resolves the actual installed directory
  and bootstraps there instead of assuming the current project is the skill.

The installer CLI tested here is skills 1.9.0, requiring Node >=22.20. PaperFigure
itself and its pinned Playwright require Node >=20. GitHub skill installation is
independent of npm package publication; package.json remains private.

## Local clean-package test

[Local installation report](local-install-report.json) records a clean temporary
project install using the real skills CLI. The package source contained only files
Git would publish, plus the current candidate changes. It had no node_modules.
The actual install copied the named skill into the temporary project's
`.agents/skills/paperfigure`.

Verified outcomes:

1. Exactly one skill is discovered and installed.
2. Read-only bootstrap check exits 1 before dependencies exist.
3. First bootstrap performs npm ci and succeeds; the ready check exits 0.
4. Installed CLI help runs from that copied skill.
5. Installed CLI builds its bundled illustrative physical-VLN fixture, producing
   native PPTX, SVG, PDF and preview with mechanical QA pass. Artifact hashes are
   recorded in native-smoke-artifacts.json; no figure delivery acceptance is claimed.
6. The installed Playwright module launches an available isolated Chromium process
   and measures actual SVG text bounds. It does not import repository node_modules.
7. Packaged style profiles, preview images and installation reference exist.

The first local-path trial was invalid as a clean-install test: the third-party
CLI also copied the development node_modules from the working directory. That
failed precondition and receipt are preserved as `local-install-report-v1.json`.
The corrected run uses a Git-file-only source snapshot; the tool behavior is not
misreported as a PaperFigure runtime defect.

The test is a fresh skill directory on this existing macOS host, reusing installed
fonts and an available browser. It is not a fresh OS/container qualification.
Chromium download, Windows/Linux behavior, LibreOffice installation and interactive
Microsoft PowerPoint editing were not tested by this packaging task. Actual figure
Office/isolated-review requirements are unchanged. No global skill directory was
modified by these project-local tests.

## Remote verification

[Actual GitHub installation](github-install-report.json) passed from private
`abs1903/PaperFigure2PPT`, main commit
`fbbcda808735f8c55fc0f5f8abad98542187bcad`, with skills CLI 1.9.0 and existing
Git/GitHub CLI credentials. No credential was added to a command or log.

The real remote install took 143.52 seconds. Nine installed entrypoint/runtime,
lockfile, setup and style/provenance files matched the published candidate hashes.
The fresh skill had no node_modules; its cold check failed as expected, bootstrap
installed dependencies successfully, the ready check passed, and its installed
CLI produced native PPTX/SVG/PDF with mechanical QA pass. Remote dependency setup
used the normal npm cache and took 3.36 seconds. Global skill directories were
not modified.

The later receipt-only commit leaves these tested skill files byte-identical.
Full browser execution was exercised in the local clean-package run; no duplicate
Office or publication-review claim is inferred from this remote packaging smoke.

## Scope

The repository remains private. Authorized Git/GitHub CLI credentials are required;
no visibility change or npm publication was performed. The installable directory
currently retains its bundled source and historical/regression examples. This task
preserves them rather than restructuring frozen evidence to reduce package size.
