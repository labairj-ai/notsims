import {emit} from '../../core/events.js';
import {SIZE,inside,key} from '../../core/grid.js';
import {itemDef} from '../../content/furniture.js';
import {BUILD_PRICES,REFUNDS} from '../../content/building.js';
import {dimensions,at} from '../objects/geometry.js';
import {changeFunds} from '../economy/economy.js';
export function room(s,x1,y1,x2,y2,floor='wood',events){
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before building.';
 const left=Math.min(x1,x2),top=Math.min(y1,y2),right=Math.max(x1,x2),bottom=Math.max(y1,y2);
 if(!inside(left,top)||!inside(right,bottom))return 'Keep your home inside the plot.';
 if(right-left<2||bottom-top<2)return 'Drag a room at least 3 × 3 tiles.';
 const floors=[],walls=[];
 for(let x=left;x<=right;x++)for(let y=top;y<=bottom;y++)if(!s.floors[key(x,y)])floors.push(key(x,y));
 for(let x=left;x<=right;x++){walls.push(`h:${x},${top}`,`h:${x},${bottom+1}`);}for(let y=top;y<=bottom;y++){walls.push(`v:${left},${y}`,`v:${right+1},${y}`);}
 const fresh=walls.filter(k=>!s.walls[k]);
 // Prevent new perimeter walls from bisecting existing furniture.
 for(const f of s.furniture){if(itemDef(f.type).flat)continue;const [w,h]=dimensions(f);for(const e of fresh){const [axis,xy]=e.split(':'),[x,y]=xy.split(',').map(Number);if(axis==='v'?x>f.x&&x<f.x+w&&y>=f.y&&y<f.y+h:y>f.y&&y<f.y+h&&x>=f.x&&x<f.x+w)return 'Move furniture away from the new room edges first.';}}
 const cost=floors.length*BUILD_PRICES.floor+fresh.length*BUILD_PRICES.wall;if(s.money<cost)return `This room costs $${cost}. You need more funds.`;
 changeFunds(s,-cost,'construction',events);floors.forEach(k=>s.floors[k]=floor);fresh.forEach(k=>s.walls[k]='wall');
 // Every room gets a free entrance; existing walls may be converted to join rooms.
 s.walls[`h:${Math.floor((left+right)/2)},${bottom+1}`]='door';emit(events,'ROOM_BUILT',{left,top,right,bottom,cost});return null;
}
export function buildTile(s,tool,x,y,edge,floor='wood',events){
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before building.';
 if(!inside(x,y))return 'Choose a tile inside the plot.';
 if(tool==='floor'){if(s.floors[key(x,y)]===floor)return null;if(s.money<BUILD_PRICES.floor)return 'A floor tile costs $12.';changeFunds(s,-BUILD_PRICES.floor,'floor',events);s.floors[key(x,y)]=floor;emit(events,'TILE_EDITED',{tool,x,y,floor});}
 else if(tool==='wall'||tool==='door'){
 const [axis,xy]=edge.split(':'),[ex,ey]=xy.split(',').map(Number);
 if(!['h','v'].includes(axis)||!Number.isInteger(ex)||!Number.isInteger(ey)||ex<0||ey<0||ex>SIZE||ey>SIZE)return 'Choose a valid wall edge.';
 if(s.walls[edge]===tool)return null;
 for(const f of s.furniture){if(itemDef(f.type).flat)continue;const [w,h]=dimensions(f);if(axis==='v'?ex>f.x&&ex<f.x+w&&ey>=f.y&&ey<f.y+h:ey>f.y&&ey<f.y+h&&ex>=f.x&&ex<f.x+w)return 'This edge runs through furniture.';}
 const cost=BUILD_PRICES[tool];if(s.money<cost)return 'You need more funds.';changeFunds(s,-cost,'construction',events);s.walls[edge]=tool;emit(events,'EDGE_EDITED',{tool,edge});
 }else if(tool==='erase'){
 const f=at(s,x,y)||at(s,x,y,true);if(f){emit(events,'FURNITURE_SOLD',{id:f.id,object:f.type});s.furniture=s.furniture.filter(i=>i.id!==f.id);changeFunds(s,Math.floor(itemDef(f.type).price*REFUNDS.furniture),'furniture-sale',events);}
 else if(s.walls[edge]){delete s.walls[edge];emit(events,'EDGE_REMOVED',{edge});changeFunds(s,REFUNDS.wall,'wall-removal',events);}
 else if(s.floors[key(x,y)]){delete s.floors[key(x,y)];emit(events,'TILE_REMOVED',{x,y});changeFunds(s,REFUNDS.floor,'floor-removal',events);}
 }return null;
}
