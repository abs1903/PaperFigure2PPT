// Preserve rejected source inputs; amend assurance language without topology changes.
import fs from 'node:fs/promises';import path from 'node:path';
import {designPrompt,assertDesignBrief} from '../../../paperfigure/scripts/design-prompt.mjs';
const root=path.dirname(new URL(import.meta.url).pathname);
const spec=JSON.parse(await fs.readFile(path.join(root,'spec.json'),'utf8'));
const brief=JSON.parse(await fs.readFile(path.join(root,'design-brief.json'),'utf8'));
brief.message=brief.message.replace('reproducible filtering','syntax and regression filtering');
for(const b of brief.blocks)b.representation=b.representation.replace('Paired deterministic evidence streams','Paired evidence streams');
brief.sourceReview='source-audit.md, source-brief-review.md and source-brief-review-v2.md; amended wording checked before generation';
assertDesignBrief(spec,brief);
await fs.writeFile(path.join(root,'design-brief-reviewed.json'),JSON.stringify(brief,null,2)+'\n');
await fs.writeFile(path.join(root,'prompt-generate-v1.txt'),designPrompt(spec,brief));
console.log('Reviewed-brief amendment compiled; original rejected brief/prompt preserved.');
