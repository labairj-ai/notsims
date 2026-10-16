// Presentation-only gesture arbitration. Once multi-touch begins, no edit may escape.
export class WorldGesture {
 constructor(){this.points=new Map();this.blocked=false;this.panning=false;}
 down(id,x,y){this.points.set(id,{x,y,sx:x,sy:y});if(this.points.size>1)this.blocked=true;return this.snapshot();}
 move(id,x,y,{navigate=true,roomDrag=false}={}){const p=this.points.get(id);if(!p)return null;const before=this.snapshot();p.x=x;p.y=y;if(Math.hypot(x-p.sx,y-p.sy)>10){p.moved=true;if(navigate)this.panning=true;if(!navigate&&!roomDrag)this.blocked=true;}return {before,after:this.snapshot()};}
 up(id){const p=this.points.get(id);const tap=!!p&&!this.blocked&&!this.panning;this.points.delete(id);if(!this.points.size){this.blocked=false;this.panning=false;}return tap;}
 cancel(){this.points.clear();this.blocked=false;this.panning=false;}
 snapshot(){const a=[...this.points.values()];return {count:a.length,x:a.reduce((v,p)=>v+p.x,0)/(a.length||1),y:a.reduce((v,p)=>v+p.y,0)/(a.length||1),distance:a.length>1?Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y):0};}
}
export const clampZoom=n=>Math.max(.6,Math.min(2.8,n));
