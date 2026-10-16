import {inside,key,edgeKey} from './grid.js';
import {at} from '../systems/objects/geometry.js';
export function blocked(s,x,y,nx,ny){return !inside(nx,ny)||!!at(s,nx,ny)||s.walls[edgeKey(x,y,nx,ny)]==='wall';}
export function pathTo(s,tx,ty){
 const start=[s.person.x,s.person.y], queue=[start], prev=new Map([[key(...start),null]]);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===tx&&y===ty){const path=[];let k=key(x,y);while(prev.get(k)!==null){path.unshift(k.split(',').map(Number));k=prev.get(k);}return path;}
 for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=key(nx,ny);if(!prev.has(k)&&!blocked(s,x,y,nx,ny)){prev.set(k,key(x,y));queue.push([nx,ny]);}}}return null;
}
