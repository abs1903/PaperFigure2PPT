"""Text-only retrieval: never render/fetch images; drop figure/table/caption prose."""
from pathlib import Path
import urllib.request,hashlib,json,re
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parent
url='https://arxiv.org/html/2407.01489v1'
raw=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'PaperFigure text-only research audit'}),timeout=40).read()
soup=BeautifulSoup(raw,'html.parser');removed={}
for selector in ['figure','figcaption','img','svg','table','script','style']:
 nodes=soup.select(selector);removed[selector]=len(nodes)
 for node in nodes:node.decompose()
for node in soup.select('.ltx_caption,.ltx_figcaption,.ltx_graphics,.ltx_tabular'):node.decompose()
skipped=0
for node in soup.select('p.ltx_p'):
 if re.search(r'\b(?:Fig(?:ure)?s?\.?|Figure)\s*\d',node.get_text(' ',strip=True),re.I):node.decompose();skipped+=1
sections=[];headers=[]
for sec in soup.select('section.ltx_section'):
 heading=sec.find(['h2','h3']);name=heading.get_text(' ',strip=True) if heading else ''
 if re.search('agentless|approach|method',name,re.I):sections.append(sec.get_text('\n',strip=True));headers.append(name)
text='\n\n'.join(sections)
if len(text)<3000:raise RuntimeError('No substantive method section; do not accept navigation as method evidence')
(root/'paper-method-text.txt').write_text(text+'\n')
(root/'paper-text-extraction.json').write_text(json.dumps({'url':url,'rawHTMLSHA256':hashlib.sha256(raw).hexdigest(),'rawHTMLRendered':False,'imageAssetsFetched':False,'excludedElements':removed,'figureReferencingParagraphsExcluded':skipped,'retainedSectionHeaders':headers,'textSHA256':hashlib.sha256((text+'\n').encode()).hexdigest(),'figurePolicy':'No figure/table/image/caption elements or figure-referencing paragraphs in retained text; no paper image was rendered.'},indent=2)+'\n')
print('Saved method text:',len(text),'characters;',headers,'removed figure mentions:',skipped)
