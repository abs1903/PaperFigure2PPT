// Source-guided manual recovery of the eight non-text AgeMem icon families.
// Coordinates are in a 100x100 local view; every part remains a native path/text.
// Source: frozen 2601.01885v1 Fig.1(c), CC BY 4.0; see ../source/provenance.json.
const M=(x,y)=>['M',x,y],L=(x,y)=>['L',x,y],C=(...v)=>['C',...v],Z=()=>['Z'];
const ellipse=(x,y,rx,ry)=>[M(x+rx,y),C(x+rx,y+ry*.5523,x+rx*.5523,y+ry,x,y+ry),C(x-rx*.5523,y+ry,x-rx,y+ry*.5523,x-rx,y),C(x-rx,y-ry*.5523,x-rx*.5523,y-ry,x,y-ry),C(x+rx*.5523,y-ry,x+rx,y-ry*.5523,x+rx,y),Z()];
const round=(x,y,w,h,r)=>[M(x+r,y),L(x+w-r,y),C(x+w,y,x+w,y,x+w,y+r),L(x+w,y+h-r),C(x+w,y+h,x+w,y+h,x+w-r,y+h),L(x+r,y+h),C(x,y+h,x,y+h,x,y+h-r),L(x,y+r),C(x,y,x,y,x+r,y),Z()];
const path=(name,commands,fill='none',stroke='none',width=0)=>({name,commands,fill,stroke,width});
const line=(name,commands,color,width)=>path(name,commands,'none',color,width);
const DARK='#4A575B',BLUE='#3AA9D5',CYAN='#70D3E3',GOLD='#E6A43A',ORANGE='#ED6744',PURPLE='#615B80';
function session(){return [
 path('rolled-end',round(76,8,19,22,5),'#6CCCE7',PURPLE,4),
 path('page', [M(16,9),L(80,9),L(80,88),C(80,101,60,101,60,88),L(16,88),Z()], '#FAFAF8',PURPLE,4),
 path('header',round(26,21,42,18,3),'#FFFFFF',PURPLE,4),
 line('line-1',[M(27,52),L(68,52)],PURPLE,4),line('line-2',[M(27,64),L(68,64)],PURPLE,4),
 path('lower-roll',[M(16,78),L(60,78),L(60,87),C(60,92,63,96,69,96),L(16,96),C(3,96,3,78,16,78),Z()],'#77CFE7',PURPLE,4)
];}
function query(){const parts=[
 line('head-outline',[M(40,93),L(40,78),C(40,72,36,69,28,69),C(23,69,22,65,22,59),L(17,54),L(23,43),C(19,17,37,9,53,10),C(79,10,90,28,88,48),C(87,58,80,63,80,74),L(80,93)],'#626B6F',2.3),
 line('inner-rim',[M(40,16),C(66,5,89,27,81,48),C(79,53,77,56,76,62)],'#5BBAB8',3)
 ];for(const [i,x,y,xx,yy] of [[0,51,2,51,-5],[1,37,4,35,-3],[2,25,10,21,4],[3,17,19,11,15],[4,67,5,70,-2],[5,79,12,84,6],[6,88,22,95,18]])parts.push(line(`ray-${i}`,[M(x,y),L(xx,yy)],'#737A7C',2));
 parts.push({name:'question',text:'?',positions:[[42,62]],font:'Arial',size:43,fill:'#626B6F',bold:false,italic:false,box:[42,19,27,47]});return parts;
}
function robot(){return [
 line('antenna-left',[M(42,25),L(31,15)],'#3A6877',2.8),line('antenna-right',[M(53,25),L(64,15)],'#3A6877',2.8),path('antenna-tip-left',ellipse(30,14,3,3),ORANGE),path('antenna-tip-right',ellipse(65,14,3,3),ORANGE),
 line('left-arm',[M(24,59),C(13,62,9,68,10,77)],'#28546C',3),line('right-arm',[M(74,54),C(89,53,90,43,89,34)],'#28546C',3),
 line('left-leg',[M(42,74),L(42,92)],'#28546C',3),line('right-leg',[M(59,74),L(59,92)],'#28546C',3),
 path('left-foot',round(34,90,15,7,1),ORANGE),path('right-foot',round(56,90,15,7,1),ORANGE),
 path('body',[M(37,25),L(62,25),C(68.627,25,74,30.373,74,37),L(74,62),C(74,68.627,68.627,74,62,74),L(37,74),C(30.373,74,25,68.627,25,62),L(25,37),C(25,30.373,30.373,25,37,25),Z()],ORANGE,'#C87D59',.8),
 path('eye-left',ellipse(39,43,6.2,7.3),'#D4F0E8'),path('eye-right',ellipse(61,43,6.2,7.3),'#D4F0E8'),
 path('iris-left',ellipse(39.5,44,3.3,4.5),'#3294BD'),path('iris-right',ellipse(60.5,44,3.3,4.5),'#3294BD'),
 path('pupil-left',ellipse(40,44.7,1.8,2.8),'#163F5C'),path('pupil-right',ellipse(60,44.7,1.8,2.8),'#163F5C'),
 path('glint-left',ellipse(38.3,42,1.4,1.8),'#FFFFFF'),path('glint-right',ellipse(58.5,42,1.4,1.8),'#FFFFFF'),
 line('smile',[M(40,60),C(44,66,56,66,60,59)],'#23465A',2.4),
 path('bulb', [M(86,27),C(86,23,80,20,80,13),C(80,-2,100,-2,100,13),C(100,21,94,24,94,28),Z()], '#F2C747'),
 path('bulb-glint',ellipse(93,9,2.1,2.4),'#FFF2BC'),path('bulb-neck',round(86,27,8,8,2),'#244C64'),
 path('raised-hand',round(84,33,12,12,5),ORANGE),path('bulb-base',round(86,28,8,7,2),'#244C64'),
 path('bag-handle',[M(4,79),L(4,74),C(4,69,13,69,13,74),L(13,79)],'none',ORANGE,3),
 path('bag',round(0,78,19,20,1),'#216486'),line('bag-seam',[M(7,79),L(7,97)],'#73BED2',1.4),path('bag-clasp',ellipse(14,85,1.7,2),'#F0BE41')
];}
function tools(){return [
 path('wrench',[M(27,41),C(9,44,4,27,9,21),L(19,30),L(25,24),L(18,14),C(35,8,45,23,40,35),L(76,68),C(91,61,102,77,93,89),C(85,101,66,92,68,78),Z()],'#E8F4FB','#5A3FB6',3),
 path('ring',ellipse(82,80,5.5,5.5),'#FAFAFB','#5A3FB6',3),
 path('hammer-head',[M(51,9),L(59,2),L(90,31),L(82,40),L(72,31),L(64,40),L(51,28),C(57,20,56,15,51,9),Z()],'#E9F4FA','#5A3FB6',3),
 path('shaft',[M(29,64),L(65,30),L(74,39),L(38,73),Z()],'#F3CF38','#5A3FB6',3),
 path('handle',[M(23,58),L(41,76),L(21,96),L(4,79),Z()],'#42CCDD','#5A3FB6',3),
 line('grip-1',[M(17,77),L(27,87)],'#5A3FB6',2.7),line('grip-2',[M(23,71),L(33,81)],'#5A3FB6',2.7)
];}
function maintenance(){return [
 line('orbit',[M(31,8),C(60,-3,90,15,94,45),C(102,73,83,97,60,98),M(44,97),C(17,93,3,76,5,50),C(4,34,12,22,22,17)],'#465A57',2),
 path('gear',[M(43,10),L(55,10),L(57,22),L(65,26),L(75,20),L(84,30),L(76,40),L(78,50),L(89,54),L(87,67),L(74,68),L(68,76),L(70,89),L(56,94),L(50,82),L(40,81),L(32,91),L(20,84),L(25,71),L(20,63),L(8,60),L(9,47),L(22,44),L(26,36),L(19,25),L(29,16),L(39,23),L(43,21),Z()], '#62D0DE','#43858D',2),
 path('gear-hole',ellipse(49,52,18,19),'#F9F9F8','#43858D',2),
 path('wrench',[M(20,28),C(3,31,-2,17,4,9),L(15,17),L(20,12),L(12,1),C(30,-4,38,10,31,22),L(76,67),C(93,62,104,78,95,90),L(83,80),L(78,85),L(87,97),C(70,102,59,87,65,77),Z()],'#EF7C7B','#77575A',2.5)
];}
function documentIcon(){return [
 path('tile',round(3,3,94,94,24),'#F8DE8A'),
 path('sheet',[M(21,13),L(64,13),L(84,34),L(84,78),L(21,78),Z()],'#E89B38','#514A32',3.5),
 path('fold',[M(64,13),L(64,34),L(84,34),Z()],'#514A32'),
 ...[42,53,64].map((y,i)=>line(`text-rule-${i}`,[M(32,y),L(70,y)],'#FCE3A3',3)),
 path('tray',[M(8,74),L(30,74),L(34,83),L(70,83),L(75,74),L(91,74),L(91,89),C(85,98,18,98,8,89),Z()],'#57402A'),
 path('tray-label',round(37,86,28,7,1),'#7FBC9A')
];}
function database(){return [
 path('bottom',[M(6,69),L(94,69),L(94,87),C(94,103,6,103,6,87),Z()],BLUE,DARK,2.2),
 path('bottom-top',ellipse(50,69,44,10),'#F3BA58',DARK,2),
 path('middle',[M(6,42),L(94,42),L(94,60),C(94,75,6,75,6,60),Z()],BLUE,DARK,2.2),
 path('middle-top',ellipse(50,42,44,10),'#F3BA58',DARK,2),
 path('top',[M(6,13),L(94,13),L(94,31),C(94,47,6,47,6,31),Z()],BLUE,DARK,2.2),
 path('top-face',ellipse(50,13,44,11),'#FBFBF8',DARK,2.2),
 line('top-glint',[M(18,12),C(24,7,35,6,45,6)],'#7F8E90',1.5),
 ...[34,62,90].flatMap((y,i)=>[line(`slot-${i}`,[M(49,y),L(70,y-2)],'#287A9A',2.2),path(`status-${i}`,ellipse(80,y-4,2,1.4),'#287A9A')])
];}
function check(){return [line('check',[M(14,55),L(39,81),L(84,15)],'#5B9434',15)];}
const factory={session,query,robot,tools,maintenance,document:documentIcon,database,check};
export const ICON_FAMILIES={50:'session',51:'query',55:'robot',56:'tools',57:'maintenance',58:'document',59:'database',61:'robot',62:'robot',63:'document',64:'database',65:'check'};
export function refineIcon(source,oldParts){const family=ICON_FAMILIES[Number(source.id.split('-')[1])],parts=factory[family](),[x,y,w,h]=source.box,owner=oldParts[0].owner,seq=Math.min(...oldParts.map(p=>p.seq));return parts.map((p,i)=>{const id=`${source.id}-refined-${p.name}`;if(p.text)return {id,type:'text',owner,icon:source.id,seq:seq+i*.001,text:p.text,font:p.font,size:p.size*h/100,bold:p.bold,italic:p.italic,fill:p.fill,positions:p.positions.map(([xx,yy])=>[x+xx*w/100,y+yy*h/100]),box:[x+p.box[0]*w/100,y+p.box[1]*h/100,p.box[2]*w/100,p.box[3]*h/100],angle:0};const commands=p.commands.map(c=>[c[0],...c.slice(1).map((v,j)=>j%2?y+v*h/100:x+v*w/100)]),points=commands.flatMap(c=>c.slice(1).filter((_,j)=>j%2===0).map((v,j)=>[v,c[j*2+2]])),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {id,type:'path',owner,icon:source.id,seq:seq+i*.001,commands,box:[Math.min(...xs),Math.min(...ys),Math.max(.01,Math.max(...xs)-Math.min(...xs)),Math.max(.01,Math.max(...ys)-Math.min(...ys))],fill:p.fill,stroke:p.stroke,width:p.width*(w+h)/200,fillRule:'nonzero',opacity:1,lineCap:'round'};});}
