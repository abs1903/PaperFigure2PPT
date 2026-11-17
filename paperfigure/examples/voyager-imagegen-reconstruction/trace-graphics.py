"""Trace only isolated non-text graphics. No label glyphs or raster tiling."""
import cv2, json
from pathlib import Path
root=Path(__file__).resolve().parent
im=cv2.imread(str(root/'reference.png'))
# Every crop is inspected, contains graphics only, and stays in source coordinates.
regions={
 'curriculum-mark':[25,52,49,46], 'generation-mark':[536,17,56,53],
 'controller-mark':[297,140,35,35], 'action-mark':[595,243,54,53],
 'critic-mark':[1288,371,39,38],
 'history-icon':[35,235,48,43], 'retrieved-icon':[569,86,48,54],
 'context-icon':[958,93,49,44], 'edit-icon':[869,381,28,28],
 'cube-icon':[960,371,32,34], 'state-database':[39,544,43,44],
 'state-globe':[47,595,33,32], 'library-database':[1665,64,53,58],
 'skill-document-1':[1682,174,29,34], 'skill-document-2':[1682,292,29,36],
 'skill-document-3':[1682,405,29,36], 'feedback-bubble':[1268,590,31,30],
}
result=[]
for name,(x,y,w,h) in regions.items():
 crop=im[y:y+h,x:x+w]
 # Saturated dark marks, with grayscale allowed for world icon; no text in crops.
 gray=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY)
 mask=(gray<145).astype('uint8')*255
 contours,hierarchy=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
 paths=[]
 for contour in contours:
  if abs(cv2.contourArea(contour))<1.5: continue
  poly=cv2.approxPolyDP(contour,.28,True)[:,0,:]
  paths.append([[float(px+x),float(py+y)] for px,py in poly])
 result.append(dict(id=name,region=[x,y,w,h],fill='#124D2C' if 'database' in name else '#071832',paths=paths))
# Preserve the landscape icon's original grayscale mountains and sun.
# It is illustrative observation content, not a differently colored module.
x,y,w,h=34,137,53,47
world=cv2.cvtColor(im[y:y+h,x:x+w],cv2.COLOR_BGR2GRAY)
for threshold,value in [(245,233),(215,200),(180,165),(145,128),(110,95),(75,60),(40,23)]:
 mask=(world<threshold).astype('uint8')*255
 contours,_=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
 paths=[]
 for contour in contours:
  if abs(cv2.contourArea(contour))<1: continue
  poly=cv2.approxPolyDP(contour,.18,True)[:,0,:]
  paths.append([[float(px+x),float(py+y)] for px,py in poly])
 result.append(dict(id=f'world-icon-tone-{value}',region=[x,y,w,h],fill='#'+f'{value:02x}'*3,paths=paths))

# Scene: nested threshold contour layers preserve the tree, character, pickaxe,
# clouds and block silhouette. Tiny raster-like texture fragments are discarded.
x,y,w,h=947,412,283,185
scene=cv2.cvtColor(im[y:y+h,x:x+w],cv2.COLOR_BGR2GRAY)
scene=cv2.GaussianBlur(scene,(3,3),.55)
for threshold,value in [(225,208),(188,177),(156,144),(120,106),(82,67)]:
 mask=(scene<threshold).astype('uint8')*255
 contours,_=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
 paths=[]
 for contour in contours:
  if abs(cv2.contourArea(contour))<4: continue
  poly=cv2.approxPolyDP(contour,.42,True)[:,0,:]
  paths.append([[float(px+x),float(py+y)] for px,py in poly])
 result.append(dict(id=f'minecraft-tone-{value}',region=[x,y,w,h],fill='#'+f'{value:02x}'*3,paths=paths))
(root/'traced-graphics.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
print(f'{len(regions)} isolated marks, 7 world-icon tones; 5 solid grayscale scene layers; no text tracing')
