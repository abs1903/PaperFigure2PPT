# Traceable architecture-pattern library (Phase 3 plan)

Start with metadata and original written pattern descriptions, not a redistributed
image collection. Each record needs paper title, authors, stable URL/version,
figure/section, architecture family, observed pattern, evidence type, asset rights
and reuse decision. Use `assets/paper-patterns.json` as the starter index.

Unknown rights means link-only; arXiv availability does not imply permission to
redistribute an image. Paper licenses, third-party content notices and repository
licenses can differ. Store downloaded figures only in an authorized local corpus
when access and usage are permitted. Do not publish them without clear permission.
Keep attribution and modification records for every reusable licensed asset.

Classification candidates: parallel encoders + fusion; token projection; retrieval
and generation; recurrent observation/action loop; tool request/observation loop;
training-only supervision; detail inset; before/after method comparison. Describe
the visual principle in original words. Do not infer the authoring tool from its
appearance or copy a paper's exact composition as a reusable template.

Next implementation: user-selected paper list, per-paper license review, manual
pattern labels, caption/source cross-check and coverage report including failures.
Only then add opt-in download/extraction and corpus contact sheets. No automatic
scraping or third-party image redistribution is enabled by this MVP.
