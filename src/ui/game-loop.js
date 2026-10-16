export function createGameLoop({now,paused,hidden,speed,advance,draw,preview,refresh,schedule}){
 let lastFrame=now,lastUI=0;
 const reset=now=>{lastFrame=now;};
 function frame(now){const dt=Math.min(Math.max(0,(now-lastFrame)/1000),.25);lastFrame=now;
  if(!paused()&&!hidden())advance(dt*speed());draw(now/1000);preview(dt);
  if(now-lastUI>220){refresh();lastUI=now;}schedule(frame);
 }
 return {frame,reset};
}
