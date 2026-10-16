import {itemDef} from '../../content/furniture.js';
export function dimensions(item){const d=itemDef(item.type);return item.rotation%2?[d.h,d.w]:[d.w,d.h];}
export function furniturePoint(f,lx,ly){const d=itemDef(f.type),[w,h]=dimensions(f),a=f.rotation*Math.PI/2,c=Math.cos(a),s=Math.sin(a);return [f.x+w/2+(lx-d.w/2)*c+(ly-d.h/2)*s,f.y+h/2-(lx-d.w/2)*s+(ly-d.h/2)*c];}
export function interactionTargets(f){
 const [w,h]=dimensions(f),d=itemDef(f.type),targets=[];
 if(['sofa','toilet'].includes(f.type)){
  for(let x=0;x<d.w;x++){const [wx,wy]=furniturePoint(f,x+.5,d.h+.5);targets.push([Math.floor(wx+1e-8),Math.floor(wy+1e-8)]);}
 }else{
  for(let x=f.x;x<f.x+w;x++)targets.push([x,f.y-1],[x,f.y+h]);
  for(let y=f.y;y<f.y+h;y++)targets.push([f.x-1,y],[f.x+w,y]);
 }
 return targets;
}
export function at(s,x,y,flat=false){return s.furniture.find(f=>{const [w,h]=dimensions(f);return !!itemDef(f.type).flat===flat&&x>=f.x&&y>=f.y&&x<f.x+w&&y<f.y+h;});}
