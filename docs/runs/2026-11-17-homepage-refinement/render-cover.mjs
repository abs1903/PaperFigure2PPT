import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {browserRuntime} from '../../../paperfigure/scripts/layout-inspect.mjs';

const out = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(out, '../../..');
const figures = [
  {name:'CLIP', topic:'Align vision & language', color:'#547993', file:'docs/runs/2026-11-17-color-study/clip-soft-dual/native-render/preview.png'},
  {name:'Agentless', topic:'Make the contribution visible', color:'#687A62', file:'docs/runs/2026-11-17-agentless-native/output-v2/native-render/preview.png'},
  {name:'MAE', topic:'Reveal the sparse mechanism', color:'#B88067', file:'docs/runs/2026-11-17-mae-high-quality/output-v2/native-render/preview.png'},
];
for (const f of figures) {
  const bytes = await fs.readFile(path.join(root, f.file));
  f.sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  f.src = 'data:image/png;base64,' + bytes.toString('base64');
}
const styles = `
*{box-sizing:border-box}body{margin:0;background:#F5F4EF;font-family:Arial,sans-serif;color:#223840}
.cover{width:1800px;height:1000px;padding:68px 76px 50px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 90% 4%,#e6ede6 0,transparent 48%),#f5f4ef}
.mast{display:flex;align-items:center;justify-content:space-between;font-size:20px;letter-spacing:3px;font-weight:700;color:#526B6C}
.brand{display:flex;align-items:center;gap:15px}.mark{display:grid;grid-template-columns:13px 13px;gap:4px;transform:rotate(-8deg)}.mark i{height:13px;border-radius:3px;background:#547993}.mark i:nth-child(2){background:#8DA79B}.mark i:nth-child(3){background:#D7AE91}.mark i:nth-child(4){background:#243C43}
.tag{font-size:16px;letter-spacing:2px;font-weight:400}.intro{display:flex;justify-content:space-between;align-items:end;margin-top:43px;margin-bottom:43px}
h1{font-size:76px;line-height:1.08;letter-spacing:-3px;margin:0;font-weight:500}h1 em{font-family:Georgia,serif;font-weight:400;color:#527B6E} .desc{font-size:23px;line-height:1.5;color:#667675;width:390px;margin:0 0 6px 25px}
.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;height:445px}
.sheet{background:#fff;border:1px solid #DDE2DE;border-radius:13px;overflow:hidden;box-shadow:0 12px 25px #233c4310;display:flex;flex-direction:column}
.sheethead{display:flex;align-items:center;justify-content:space-between;padding:25px 26px 17px}.name{font-size:24px;font-weight:700;letter-spacing:-.4px}.idx{font-size:13px;letter-spacing:2px;color:#9BA7A3}.rule{width:31px;height:3px;border-radius:2px;margin-top:11px}
.art{flex:1;min-height:0;padding:7px 20px 11px;display:flex;align-items:center;justify-content:center}.art img{display:block;max-height:100%;max-width:100%;object-fit:contain}
.topic{font-size:17px;color:#687773;padding:17px 26px 24px;border-top:1px solid #F1F3F1}
.foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #D2DCD5;margin-top:44px;padding-top:25px;font-size:19px;color:#627670}
.formats{display:flex;gap:13px}.formats span{font-size:15px;letter-spacing:1px;border:1px solid #BACBC2;border-radius:5px;padding:8px 15px;color:#425D53}.dot{color:#A5B3AC;padding:0 12px}
.feature .gallery{height:550px;grid-template-columns:1.3fr 1fr;grid-template-rows:1fr 1fr;gap:20px}.feature .sheet:first-child{grid-row:1 / 3}.feature .sheet:not(:first-child){display:grid;grid-template-columns:230px 1fr;grid-template-rows:1fr 70px}.feature .sheet:not(:first-child) .sheethead{grid-column:1;grid-row:1;align-items:start;padding-top:32px}.feature .sheet:not(:first-child) .art{grid-column:2;grid-row:1 / 3;padding:23px 18px 23px 0}.feature .sheet:not(:first-child) .topic{grid-column:1;grid-row:2;border:0;font-size:16px;line-height:1.4;padding-top:0}.feature .sheet:not(:first-child) .idx{display:none}.feature .intro{margin-top:33px;margin-bottom:30px}.feature h1{font-size:66px}.feature .foot{margin-top:30px;padding-top:22px}
`;
const runtime = await browserRuntime();
const browser = await runtime.chromium.launch({headless:true, executablePath:runtime.executablePath});
const evidence = [];
try {
  for (const variant of ['triptych','feature']) {
    const page = await browser.newPage({viewport:{width:1800,height:1000}, deviceScaleFactor:1});
    const html = `<style>${styles}</style><main class="cover ${variant}"><div class="mast"><div class="brand"><div class="mark"><i></i><i></i><i></i><i></i></div>PAPERFIGURE</div><div class="tag">RESEARCH FIGURES · EDITABLE BY DESIGN</div></div><div class="intro"><h1>Make the idea visible.<br>Keep every part <em>editable.</em></h1><p class="desc">Source-grounded design.<br>Native shapes, text & connectors.<br>Actual Office renders below.</p></div><div class="gallery">${figures.map((f,i)=>`<section class="sheet"><div class="sheethead"><div><div class="name">${f.name}</div><div class="rule" style="background:${f.color}"></div></div><span class="idx">0${i+1}</span></div><div class="art"><img src="${f.src}" alt="${f.name}: actual Office-rendered example"></div><div class="topic">${f.topic}</div></section>`).join('')}</div><div class="foot"><span>Paper concepts<span class="dot">/</span>Visual explanation<span class="dot">/</span>Editable delivery</span><div class="formats"><span>SVG</span><span>PPTX</span><span>PDF</span></div></div></main>`;
    await page.setContent(html);
    await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
    const checks=await page.evaluate(()=>({images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,contained:i.getBoundingClientRect().right<=1800})),overflow:document.documentElement.scrollWidth>1800||document.documentElement.scrollHeight>1000}));
    await page.screenshot({path:path.join(out,`cover-${variant}.png`)});
    evidence.push({variant,...checks});
    await page.close();
  }
} finally {await browser.close();}
await fs.writeFile(path.join(out,'cover-provenance.json'), JSON.stringify({scope:'Homepage raster collage of three unchanged, previously accepted native Office previews. This cover is presentation artwork, not an independently editable scientific figure or a new Office delivery.',sources:figures.map(({src,...f})=>f),evidence},null,2)+'\n');
console.log(JSON.stringify(evidence));
if(evidence.some(x=>x.overflow||x.images.some(i=>!i.loaded||!i.contained)))process.exitCode=1;
