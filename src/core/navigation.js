import {inside,key,edgeKey} from './grid.js';
import {at} from '../systems/objects/geometry.js';
export function blocked(s,x,y,nx,ny){return !inside(nx,ny)||!!at(s,nx,ny)||s.walls[edgeKey(x,y,nx,ny)]==='wall';}
export const pathTo=(s,tx,ty)=>pathFrom(s,s.person.x,s.person.y,tx,ty);
export function pathFrom(s,x0,y0,tx,ty){
 if(!inside(x0,y0)||!inside(tx,ty))return null;
 const start=[x0,y0], queue=[start], prev=new Map([[key(...start),null]]);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===tx&&y===ty){const path=[];let k=key(x,y);while(prev.get(k)!==null){path.unshift(k.split(',').map(Number));k=prev.get(k);}return path;}
 for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=key(nx,ny);if(!prev.has(k)&&!((x0!==s.person.x||y0!==s.person.y)&&nx===s.person.x&&ny===s.person.y)&&!blocked(s,x,y,nx,ny)&&!s.social?.presences.some(p=>p.x===nx&&p.y===ny&&!(p.x===x0&&p.y===y0))){prev.set(k,key(x,y));queue.push([nx,ny]);}}}return null;
}
