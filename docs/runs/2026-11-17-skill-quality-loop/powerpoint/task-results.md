# Microsoft PowerPoint native-edit trial

This was programmatic Microsoft PowerPoint AppleScript work, not human mouse editing or a measurement of user time. The trial used Microsoft PowerPoint 16.115 and isolated copies of the supplied deck. Source and each input copy have SHA-256 `e1be931ec13f745c8a2f33525b914815706f3f455d4e82889ce715a014d8f420`; full input hashes are in `logs/input-sha256.txt`.

Result: **0 / 3 requested tasks achieved a usable saved, reopened native-edit artifact.** No actual PowerPoint PDF/PNG export, rendered review, or output XML review occurred because there was no saved output to inspect.

PowerPoint opened copied inputs as recovered documents named `[Repaired]`, rather than the original package. Read-side inspection succeeded for the encoder copy (29 top-level shapes; the lower `test-image-encoder`, its incident connector shapes, and grouped connector objects were present): see `logs/encoder-input-shapes.txt`. The local PowerPoint scripting definition declares native shape geometry, text-frame, connector-format, and `save as picture` operations; the relevant extract is retained at `logs/sdef-relevant-extract.txt`.

Task 1 attempted the requested label/reflow edit on its recovered copy: set `nearest` to `Nearest class description`, expand it from 225 to 285 points, shift it left, and shorten the readout connector. The save/export call produced no PPTX or PDF, and the bounded retry returned error `-9074`; evidence is `logs/task1.stderr` and `logs/task1-retry.stderr`. It is therefore a failed operation, not a successful layout edit.

Tasks 2 and 3 are explicitly **unverified**, not passing: after the shared native save/reopen blocker, no movement/attachment repair or native branch creation was attempted. This kept the evidence-seeking attempts within the stated maximum and avoids claiming native editability that was not demonstrated.

All owned recovered copies were closed without touching the two pre-existing user presentations. `logs/presentations-after-owned-close.txt` records that final state. The temporary PowerPoint lock file created for the owned input was removed after closure.
