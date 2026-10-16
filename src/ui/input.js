import {$,$$,money,esc} from './dom.js';
import {inside} from '../core/grid.js';
import {itemDef} from '../content/furniture.js';
import {at,dimensions} from '../systems/objects/geometry.js';
export function installInput(app){
 const ui=app.ui;
function pointer(e){const rect=$('#world').getBoundingClientRect(),px=e.clientX-rect.left,py=e.clientY-rect.top,[x,y]=app.renderer.unproject(px,py),tx=Math.floor(x),ty=Math.floor(y);const fx=x-tx,fy=y-ty,dist=[fx,1-fx,fy,1-fy],i=dist.indexOf(Math.min(...dist));return {px,py,x:tx,y:ty,edge:i===0?`v:${tx},${ty}`:i===1?`v:${tx+1},${ty}`:i===2?`h:${tx},${ty}`:`h:${tx},${ty+1}`};}
$('#world').addEventListener('contextmenu',e=>e.preventDefault());
$('#world').addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==2)return;const p=pointer(e);app.down={...p,clientX:e.clientX,clientY:e.clientY,panX:app.renderer.panX,panY:app.renderer.panY,button:e.button};$('#world').setPointerCapture(e.pointerId);$('#object-popup').hidden=true;if(ui.tab==='build'&&ui.tool==='room'&&inside(p.x,p.y)&&e.button===0)ui.roomStart=[p.x,p.y];});
$('#world').addEventListener('pointermove',e=>{const p=pointer(e);ui.hover=inside(p.x,p.y)?[p.x,p.y]:null;ui.edge=p.edge;if(app.down?.button===2){app.renderer.panX=app.down.panX+e.clientX-app.down.clientX;app.renderer.panY=app.down.panY+e.clientY-app.down.clientY;}});
$('#world').addEventListener('pointerleave',()=>{if(!app.down)ui.hover=null;});
$('#world').addEventListener('pointercancel',()=>{app.down=null;ui.roomStart=null;});
$('#world').addEventListener('pointerup',e=>{if(!app.down)return;const d=app.down;app.down=null;const p=pointer(e);if(d.button===2)return;if(!inside(p.x,p.y)){ui.roomStart=null;return;}
 if(ui.tab==='build'){
 if(ui.tool==='room'&&ui.roomStart){app.send({type:'BUILD_ROOM',x1:ui.roomStart[0],y1:ui.roomStart[1],x2:p.x,y2:p.y,floor:ui.floor},'A little more room for your life.');ui.roomStart=null;}
 else app.send({type:'EDIT_TILE',tool:ui.tool,x:p.x,y:p.y,edge:p.edge,floor:ui.floor});return;
 }
 if(ui.tab==='shop'&&ui.selected){app.send({type:'PLACE_OBJECT',object:ui.selected,x:p.x,y:p.y,rotation:ui.rotation});return;}
 let f=app.renderer.pickFurniture?.(app.state,p.px,p.py)||at(app.state,p.x,p.y);if(!f&&!app.is3D){const candidates=app.state.furniture.filter(f=>!itemDef(f.type).flat).filter(f=>{const [w,h]=dimensions(f),[cx,cy]=app.renderer.p(f.x+w/2,f.y+h/2);return Math.abs(p.px-cx)<app.renderer.t*(w+h)*.45&&p.py>cy-app.renderer.t*2.6&&p.py<cy+app.renderer.t*.3;});f=candidates.sort((a,b)=>(b.x+b.y)-(a.x+a.y))[0];}
 if(f){showObject(f,p);return;}app.send({type:'MOVE_TO',x:p.x,y:p.y});
});
function showObject(f,p){const d=itemDef(f.type),el=$('#object-popup');el.innerHTML=`<button class="close-popup" aria-label="Close object menu">×</button><strong>${esc(d.name)}</strong><small>${d.need?`A little boost for ${d.need}`:'A little character for your home'}</small>${d.need?`<button id="use-object">${d.verb} ${d.cost?`· ${money(d.cost)}`:'→'}</button>`:''}<button id="find-furnish">Make room for something new ↗</button>`;el.style.left=`${Math.max(10,Math.min(p.px-85,app.renderer.w-220))}px`;el.style.top=`${Math.max(80,Math.min(p.py-115,app.renderer.h-190))}px`;el.hidden=false;el.querySelector('.close-popup').onclick=()=>el.hidden=true;if($('#use-object'))$('#use-object').onclick=()=>{app.send({type:'INTERACT',id:f.id});el.hidden=true;};$('#find-furnish').onclick=()=>{ui.tool='erase';app.selectTab('build');};}
$('#world').addEventListener('wheel',e=>{e.preventDefault();app.renderer.zoom=Math.max(.6,Math.min(2.8,app.renderer.zoom-e.deltaY*.001));},{passive:false});
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)||$('dialog[open]'))return;if(e.key===' '){e.preventDefault();if(['build','shop'].includes(ui.tab))app.selectTab('live');app.setSpeed(app.speed?0:app.lastNonzero);}if(['1','2','3'].includes(e.key)){if(['build','shop'].includes(ui.tab))app.selectTab('live');app.setSpeed({'1':1,'2':3,'3':8}[e.key]);}if(e.key.toLowerCase()==='r'&&ui.tab==='shop'){ui.rotation=(ui.rotation+1)%4;app.toast(`Rotated ${ui.rotation*90}°`);}if(app.is3D&&['q','e'].includes(e.key.toLowerCase())){app.renderer.rotate(e.key.toLowerCase()==='q'?-1:1);$('#object-popup').hidden=true;}if(e.key==='Escape'){ui.selected=null;ui.roomStart=null;$('#object-popup').hidden=true;if(ui.tab==='shop')app.renderStudio();}if(e.key.startsWith('Arrow')){e.preventDefault();app.renderer.panX+=e.key==='ArrowLeft'?35:e.key==='ArrowRight'?-35:0;app.renderer.panY+=e.key==='ArrowUp'?35:e.key==='ArrowDown'?-35:0;}app.updateUI(true);});

}
