import {emit} from '../../core/events.js';
import {inside,key} from '../../core/grid.js';
import {itemDef} from '../../content/furniture.js';
import {dimensions,at} from '../objects/geometry.js';
import {changeFunds} from '../economy/economy.js';
export function canPlace(s,type,x,y,rotation=0){
 const d=itemDef(type);if(!d)return false;const [w,h]=dimensions({type,rotation});
 for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++){
 if(!inside(a,b)||!s.floors[key(a,b)]||at(s,a,b,!!d.flat)||(!d.flat&&s.person.x===a&&s.person.y===b))return false;
 if(!d.flat&&((a>x&&s.walls[`v:${a},${b}`])||(b>y&&s.walls[`h:${a},${b}`])))return false;
 }return true;
}
export function buy(s,type,x,y,rotation=0,events){const d=itemDef(type);if(!d||s.activity?.kind==='work'||s.queue.length||s.activity)return 'Finish or cancel your current action before furnishing.';if(s.money<d.price)return 'You need a little more money for that.';if(!canPlace(s,type,x,y,rotation))return 'Place it on a clear floor, away from walls and your character.';changeFunds(s,-d.price,'furniture',events);const f={id:s.nextId++,type,x,y,rotation};s.furniture.push(f);emit(events,'FURNITURE_PLACED',{id:f.id,object:f.type,x,y,rotation});return null;}
