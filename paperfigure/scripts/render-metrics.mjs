// Measure whether the independently rendered image actually contains ink along
// the specified routes. Whole-image similarity can hide missing thin arrows.
export function routeCoverage(scene,reference,candidate) {
  const nearInk=(data,x,y)=>{
    for(let yy=Math.max(0,Math.round(y)-3);yy<=Math.min(scene.height-1,Math.round(y)+3);yy++)
      for(let xx=Math.max(0,Math.round(x)-3);xx<=Math.min(scene.width-1,Math.round(x)+3);xx++){
        const i=(yy*scene.width+xx)*3;
        if(Math.min(data[i],data[i+1],data[i+2])<180)return true;
      }
    return false;
  };
  const obscured=p=>[...scene.nodes,...scene.texts].some(b=>p[0]>b.x-4&&p[0]<b.x+b.w+4&&p[1]>b.y-4&&p[1]<b.y+b.h+4);
  return scene.edges.map(e=>{
    let tested=0,matched=0;
    for(let i=1;i<e.points.length;i++){
      const a=e.points[i-1],b=e.points[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
      for(let d=8;d<len-8;d+=5){
        const p=[a[0]+(b[0]-a[0])*d/len,a[1]+(b[1]-a[1])*d/len];
        if(obscured(p)||!nearInk(reference,...p))continue;
        tested++;matched+=nearInk(candidate,...p);
      }
    }
    return {edge:e.id,testedSamples:tested,matchedSamples:matched,coverage:tested?matched/tested:null,passed:tested>0&&matched/tested>=.9};
  });
}
