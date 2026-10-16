import {WorldGesture,clampZoom} from './gestures.js';
import {room} from '../systems/building/building.js';
import {$,$$,money,esc} from './dom.js';
import {inside} from '../core/grid.js';
import {itemDef} from '../content/furniture.js';
import {at,dimensions} from '../systems/objects/geometry.js';
export function installInput(app){
 const ui=app.ui,gesture=new WorldGesture();
 app.dismissObject=()=>{$('#object-popup').hidden=true;ui.selectedObjectId=null;};
 function preview(){if(!ui.roomStart||!ui.hover){ui.roomPreview=null;return;}const clone=structuredClone(app.state),before=clone.money,error=room(clone,...ui.roomStart,...ui.hover,ui.floor);ui.roomPreview={valid:!error,message:`${Math.abs(ui.hover[0]-ui.roomStart[0])+1} × ${Math.abs(ui.hover[1]-ui.roomStart[1])+1} · ${error||'$'+(before-clone.money)}`};app.mobile?.update();}

function pointer(e){const rect=$('#world').getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top,[x,y]=app.renderer.unproject(px,py),tx=Math.floor(x),ty=Math.floor(y);const fx=x-tx,fy=y-ty,dist=[fx,1-fx,fy,1-fy],i=dist.indexOf(Math.min(...dist));return {px,py,x:tx,y:ty,edge:i===0?`v:${tx},${ty}`:i===1?`v:${tx+1},${ty}`:i===2?`h:${tx},${ty}`:`h:${tx},${ty+1}`};}
$('#world').addEventListener('contextmenu',e=>e.preventDefault());
$('#world').addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==2)return;const p=pointer(e);gesture.down(e.pointerId,e.clientX,e.clientY);app.dismissObject();$('#world').setPointerCapture?.(e.pointerId);if(gesture.points.size>1){ui.roomStart=null;ui.roomPreview=null;return;}app.down={...p,clientX:e.clientX,clientY:e.clientY,panX:app.renderer.panX,panY:app.renderer.panY,button:e.button,mode:ui.tab};if(ui.tab==='build'&&ui.tool==='room'&&inside(p.x,p.y)&&e.button===0)ui.roomStart=[p.x,p.y];ui.hover=inside(p.x,p.y)?[p.x,p.y]:null;ui.edge=p.edge;preview();});
$('#world').addEventListener('pointermove',e=>{const navigate=ui.tab==='live'||ui.tab==='career'||app.down?.button===2;const movement=gesture.move(e.pointerId,e.clientX,e.clientY,{navigate});if(movement){const {before,after}=movement;if(after.count>1||(navigate&&gesture.panning)){app.renderer.panX+=after.x-before.x;app.renderer.panY+=after.y-before.y;if(after.count>1&&before.distance>0)app.renderer.zoom=clampZoom(app.renderer.zoom*after.distance/before.distance);ui.roomStart=null;ui.roomPreview=null;app.dismissObject();}}const p=pointer(e);ui.hover=inside(p.x,p.y)?[p.x,p.y]:null;ui.edge=p.edge;preview();});
$('#world').addEventListener('pointerleave',()=>{if(!app.down)ui.hover=null;});
$('#world').addEventListener('pointercancel',()=>{gesture.cancel();app.down=null;ui.roomStart=null;ui.roomPreview=null;app.mobile?.update();});
$('#world').addEventListener('pointerup',e=>{const allowed=gesture.up(e.pointerId);if(!app.down)return;const d=app.down;app.down=null;const p=pointer(e);if(!allowed||d.button===2||d.mode!==ui.tab){ui.roomStart=null;ui.roomPreview=null;app.mobile?.update();return;}if(!inside(p.x,p.y)){ui.roomStart=null;return;}
 if(ui.tab==='build'){
 if(ui.tool==='room'&&ui.roomStart){app.send({type:'BUILD_ROOM',x1:ui.roomStart[0],y1:ui.roomStart[1],x2:p.x,y2:p.y,floor:ui.floor},'A little more room for your life.');ui.roomStart=null;ui.roomPreview=null;}
 else app.send({type:'EDIT_TILE',tool:ui.tool,x:p.x,y:p.y,edge:p.edge,floor:ui.floor});return;
 }
 if(ui.tab==='shop'&&ui.selected){app.send({type:'PLACE_OBJECT',object:ui.selected,x:p.x,y:p.y,rotation:ui.rotation});return;}
 let f=app.renderer.pickFurniture?.(app.state,p.px,p.py)||(!app.is3D?at(app.state,p.x,p.y):null);if(!f&&!app.is3D){const candidates=app.state.furniture.filter(f=>!itemDef(f.type).flat).filter(f=>{const [w,h]=dimensions(f),[cx,cy]=app.renderer.p(f.x+w/2,f.y+h/2);return Math.abs(p.px-cx)<app.renderer.t*(w+h)*.45&&p.py>cy-app.renderer.t*2.6&&p.py<cy+app.renderer.t*.3;});f=candidates.sort((a,b)=>(b.x+b.y)-(a.x+a.y))[0];}
 if(!f&&e.pointerType==='touch'){f=touchFurniture(app.state,app.renderer,p.px,p.py);}if(f){showObject(f,p);return;}app.send({type:'MOVE_TO',x:p.x,y:p.y});
});
function showObject(f,p){ui.selectedObjectId=f.id;const d=itemDef(f.type),el=$('#object-popup');el.innerHTML=`<button class="close-popup" aria-label="Close object menu">×</button><strong>${esc(d.name)}</strong><small>${d.need?`A little boost for ${d.need}`:'A little character for your home'}</small>${d.need?`<button id="use-object">${d.verb} ${d.cost?`· ${money(d.cost)}`:'→'}</button>`:''}<button id="find-furnish">Make room for something new ↗</button>`;el.style.left=`${Math.max(10,Math.min(p.px-85,app.renderer.w-220))}px`;el.style.top=`${Math.max(80,Math.min(p.py-115,app.renderer.h-190))}px`;el.hidden=false;el.querySelector('.close-popup').onclick=()=>app.dismissObject();if($('#use-object'))$('#use-object').onclick=()=>{app.send({type:'INTERACT',id:f.id});app.dismissObject();};$('#find-furnish').onclick=()=>{ui.tool='erase';app.selectTab('build');};}
$('#world').addEventListener('wheel',e=>{e.preventDefault();app.renderer.zoom=clampZoom(app.renderer.zoom-e.deltaY*.001);},{passive:false});
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)||$('dialog[open]'))return;if(e.key===' '){e.preventDefault();if(['build','shop'].includes(ui.tab))app.selectTab('live');app.setSpeed(app.speed?0:app.lastNonzero);}if(['1','2','3'].includes(e.key)){if(['build','shop'].includes(ui.tab))app.selectTab('live');app.setSpeed({'1':1,'2':3,'3':8}[e.key]);}if(e.key.toLowerCase()==='r'&&ui.tab==='shop'){ui.rotation=(ui.rotation+1)%4;app.toast(`Rotated ${ui.rotation*90}°`);}if(app.is3D&&['q','e'].includes(e.key.toLowerCase())){app.renderer.rotate(e.key.toLowerCase()==='q'?-1:1);$('#object-popup').hidden=true;}if(e.key==='Escape'){ui.selected=null;ui.roomStart=null;app.dismissObject();if(ui.tab==='shop')app.renderStudio();}if(e.key.startsWith('Arrow')){e.preventDefault();app.renderer.panX+=e.key==='ArrowLeft'?35:e.key==='ArrowRight'?-35:0;app.renderer.panY+=e.key==='ArrowUp'?35:e.key==='ArrowDown'?-35:0;}app.updateUI(true);});

}

// Bounded screen-space fallback: nearest candidate, then frontmost, then stable ID.
export function touchFurniture(state,renderer,px,py,radius=24){return state.furniture.map(f=>{const [w,h]=dimensions(f),[x,y]=renderer.p(f.x+w/2,f.y+h/2,.5);return {f,d:Math.hypot(px-x,py-y)};}).filter(c=>c.d<=radius).filter(c=>{const [w,h]=dimensions(c.f),[x,y]=renderer.p(c.f.x+w/2,c.f.y+h/2,.5),hit=renderer.pickFurniture?.(state,x,y);return !renderer.pickFurniture||hit?.id===c.f.id;}).sort((a,b)=>a.d-b.d||(b.f.x+b.f.y)-(a.f.x+a.f.y)||String(a.f.id).localeCompare(String(b.f.id)))[0]?.f;}
