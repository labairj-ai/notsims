import {dimensions,furniturePoint} from '../systems/objects/geometry.js';
import {itemDef} from '../content/furniture.js';
// An explicit interaction point is selected by the simulation. Occupied furniture
// cells remain blocked for navigation; only the rendered pose enters the seat.
export function interactionPose(s) {
  const a=s.activity;
  if(a?.kind!=='use'||a.path?.length)return null;
  const f=s.furniture.find(f=>f.id===a.id);if(!f)return null;
  const [w,h]=dimensions(f),d=itemDef(f.type),type=d.recipe??f.type,angle=f.rotation*Math.PI/2;
  const pose=(lx,ly,height,animation)=>{const [x,y]=furniturePoint(f,lx,ly);return {x,y,height,angle,animation};};
  if(type==='sofa')return pose(.7,.56,.61,'Sit');
  if(type==='toilet')return pose(.5,.59,.49,'Sit');
  if(type==='bed')return pose(1,1.87,.88,'Sleep');
  const facing=Math.atan2(f.x+w/2-s.person.x-.5,f.y+h/2-s.person.y-.5);
  return {x:s.person.x+.5,y:s.person.y+.5,height:0,angle:facing,animation:d.need==='hunger'?'Eat':'Idle'};
}
