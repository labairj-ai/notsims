import {sharedActivityPose} from './systems/social/shared-activities.js';
import {furnitureRecipes} from './render/shared/furniture-recipes.js';
import {SIZE, CATALOG, itemDef, dimensions, canPlace, key} from './engine.js';
const shade=(hex,n)=>{const v=parseInt(hex.slice(1),16);return `rgb(${Math.max(0,Math.min(255,(v>>16)+n))},${Math.max(0,Math.min(255,((v>>8)&255)+n))},${Math.max(0,Math.min(255,(v&255)+n))})`;};
export class Renderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1.15;this.panX=0;this.panY=0;this.fullWalls=false;this.t=25;this.ox=0;this.oy=0;}
 resize(){const r=this.canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);this.w=r.width;this.h=r.height;if(this.canvas.width!==Math.round(r.width*dpr)||this.canvas.height!==Math.round(r.height*dpr)){this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);}this.ctx.setTransform(dpr,0,0,dpr,0,0);this.t=Math.min(this.w/37,this.h/25)*this.zoom;this.ox=this.w/2+this.panX;this.oy=this.h*.49-8.5*this.t+this.panY;}
 p(x,y,z=0){return [this.ox+(x-y)*this.t,this.oy+(x+y)*this.t*.5-z*this.t*1.7];}
 unproject(px,py){const a=(px-this.ox)/this.t,b=(py-this.oy)/(this.t*.5);return [(a+b)/2,(b-a)/2];}
 polygon(points,color,stroke){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.65;c.stroke();}}
 tile(x,y,color,stroke){this.polygon([this.p(x,y),this.p(x+1,y),this.p(x+1,y+1),this.p(x,y+1)],color,stroke);}
 line(a,b,color,width=1){const c=this.ctx;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 box(x,y,w,h,z,color,base=0){this.polygon([this.p(x,y+h,base),this.p(x+w,y+h,base),this.p(x+w,y+h,z+base),this.p(x,y+h,z+base)],shade(color,-18));this.polygon([this.p(x+w,y,base),this.p(x+w,y+h,base),this.p(x+w,y+h,z+base),this.p(x+w,y,z+base)],shade(color,-34));this.polygon([this.p(x,y,z+base),this.p(x+w,y,z+base),this.p(x+w,y+h,z+base),this.p(x,y+h,z+base)],color);}
 ellipse(x,y,z,rx,ry,color){const p=this.p(x,y,z),c=this.ctx;c.beginPath();c.ellipse(p[0],p[1],rx*this.t,ry*this.t,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
 furniture(f){return furnitureRecipes.furniture.call(this,f);}
 person(p,time=0,working=false){if(working)return;const x=p.x+.5,y=p.y+.5;const c=this.ctx;this.ellipse(x,y,.01,.39,.16,'#233e3330');const bounce=Math.sin(time*4)*.012;
 if(p.pose?.animation==='Sit'){
  this.box(x-.2,y-.12,.4,.3,.42,p.shirt,.58);this.box(x-.2,y+.06,.4,.38,.13,'#42574c',.5);
  this.box(x-.18,y+.32,.13,.12,.46,'#42574c');this.box(x+.06,y+.36,.13,.12,.46,'#42574c');
  this.box(x-.29,y-.04,.1,.32,.12,p.skin,.66);this.box(x+.2,y+.02,.1,.32,.12,p.skin,.66);
  const [hx,hy]=this.p(x,y,1.32);c.fillStyle=p.hair;c.beginPath();c.ellipse(hx,hy-this.t*.08,this.t*.24,this.t*.29,0,0,Math.PI*2);c.fill();c.fillStyle=p.skin;c.beginPath();c.ellipse(hx,hy,this.t*.2,this.t*.24,0,0,Math.PI*2);c.fill();c.fillStyle=p.hair;c.beginPath();c.ellipse(hx,hy-this.t*.2,this.t*.22,this.t*.12,0,0,Math.PI*2);c.fill();return;
 }
if(p.pose){this.ellipse(x,y,.4,.2,.12,p.shirt);if(p.pose.animation==='Eat')this.ellipse(x+.22,y,.72,.12,.05,'#fff5d6');}
 this.box(x-.16,y-.09,.13,.14,.37,'#42574c');this.box(x+.07,y+.02,.13,.14,.37,'#42574c');this.box(x-.19,y-.06,.19,.25,.07,'#f1e9d3');this.box(x+.05,y+.04,.19,.25,.07,'#f1e9d3');
 this.box(x-.2,y-.15,.4,.34,.46,p.shirt,.36+bounce);const [px,py]=this.p(x,y,1.08+bounce);c.fillStyle=p.skin;c.beginPath();c.ellipse(px,py,this.t*.22,this.t*.29,0,0,Math.PI*2);c.fill();
 if(p.style==='long'){c.fillStyle=p.hair;c.beginPath();c.ellipse(px,py-this.t*.03,this.t*.27,this.t*.35,0,Math.PI,Math.PI*2);c.lineTo(px+this.t*.27,py+this.t*.27);c.lineTo(px+this.t*.14,py+this.t*.2);c.lineTo(px+this.t*.13,py-this.t*.05);c.closePath();c.fill();}
 c.fillStyle=p.hair;c.beginPath();c.ellipse(px-this.t*.03,py-this.t*.18,this.t*.23,this.t*.16,-.2,Math.PI*.65,Math.PI*2.05);c.fill();
 if(p.style==='curly'){for(let i=0;i<5;i++){c.beginPath();c.arc(px+(i-2)*this.t*.09,py-this.t*.23-Math.sin(i)*this.t*.035,this.t*.09,0,Math.PI*2);c.fill();}}
 this.box(x-.29,y-.08,.1,.13,.38,p.skin,.36+bounce);this.box(x+.21,y+.14,.1,.13,.38,p.skin,.36+bounce);
 c.fillStyle='#37463b';c.beginPath();c.arc(px+this.t*.08,py,this.t*.025,0,Math.PI*2);c.fill();
 const diamond=this.p(x,y,1.72+Math.sin(time*2)*.035);this.polygon([[diamond[0],diamond[1]-this.t*.21],[diamond[0]+this.t*.11,diamond[1]],[diamond[0],diamond[1]+this.t*.2],[diamond[0]-this.t*.11,diamond[1]]],'#e4cb82');
 }
 tree(...args){return furnitureRecipes.tree.apply(this,args);}
 wall(e,value){const [axis,xy]=e.split(':'),[x,y]=xy.split(',').map(Number);const front=(axis==='h'&&y>=10)||(axis==='v'&&x>=10);const height=this.fullWalls?1.6:front?.18:axis==='h'&&y===3||axis==='v'&&x===4?1.45:.6;
 if(value==='door'){const c=this.ctx;c.globalAlpha=.85;if(axis==='h'){this.box(x,y, .12,.1,height,'#a79576');this.box(x+.88,y,.12,.1,height,'#a79576');if(height>.7)this.box(x,y,1,.1,.12,'#b09d7b',height-.12);}else{this.box(x,y,.1,.12,height,'#a79576');this.box(x,y+.88,.1,.12,height,'#a79576');if(height>.7)this.box(x,y,.1,1,.12,'#b09d7b',height-.12);}c.globalAlpha=1;this.line(this.p(x+.16,y+.16,.01),this.p(x+(axis==='h'?.85:.16),y+(axis==='v'?.85:.16),.01),'#bca88c',2);}
 else{this.box(x,y,axis==='h'?1:.09,axis==='v'?1:.09,height,'#ece7d4');if(height>1.1&&((axis==='h'&&x%4===2)||(axis==='v'&&y%4===1))){if(axis==='h')this.box(x+.2,y+.095,.55,.025,.57,'#a8c4b9',.61);else this.box(x+.095,y+.2,.025,.55,.57,'#a8c4b9',.61);}}
 }
 draw(s,ui,time){this.resize();const c=this.ctx;c.clearRect(0,0,this.w,this.h);c.fillStyle='#dce5c9';c.fillRect(0,0,this.w,this.h);
 // Parkland around the plot, with a quiet neighborhood footpath.
 for(let x=-12;x<31;x++)for(let y=-12;y<31;y++){
 const road=y>=19&&y<22;this.tile(x,y,road?'#d9d6bd':(x+y)%2===0?'#dbe4c7':'#d9e2c4');
 if(!road&&((x*23+y*17+3000)%19===0)){const p=this.p(x+.4,y+.4);c.fillStyle='#aebb933c';c.fillRect(p[0],p[1],2,2);}
 }
 this.box(0,0,SIZE,SIZE,.05,'#b2c195',-.06);
 for(let x=0;x<SIZE;x++)for(let y=0;y<SIZE;y++){const floor=s.floors[key(x,y)];if(floor){const color=floor==='wood'?((x+y)%2?'#cfb293':'#d7bb9b'):floor==='sage'?((x+y)%2?'#c7d0ac':'#cdd5b6'):(x+y)%2?'#e3dfcc':'#d6d7c2';this.tile(x,y,color,'#b7b99c50');if(floor==='wood'){for(let i=1;i<4;i++)this.line(this.p(x,y+i/4),this.p(x+1,y+i/4),'#b7977540',.5);}else if(floor==='tile'){this.line(this.p(x+.5,y),this.p(x+.5,y+1),'#c5c9b280',.5);this.line(this.p(x,y+.5),this.p(x+1,y+.5),'#c5c9b280',.5);}}
 else{this.tile(x,y,(x+y)%2?'#c5d2a9':'#cad6af',ui.tab==='build'||ui.tab==='shop'?'#aeba9560':null);if((x*13+y*7)%29===0){const p=this.p(x+.4,y+.5);c.fillStyle='#aabb8a';c.fillRect(p[0],p[1],2,2);}}}
 // Garden stepping stones lead from the street to the front entrance.
 for(let y=12;y<19;y++)if(!s.floors[key(8,y)])this.box(8.12,y+.12,.75,.75,.025,'#d8d6ba');
 for(const f of s.furniture.filter(f=>itemDef(f.type).flat))this.furniture(f);
 for(const [x,y,z] of [[-2,0,1.15],[-2,11,.85],[16,-2,1.1],[3,-3,.9],[20,10,1.2]])this.tree(x,y,z);
 // Fence corners and tiny planting beds keep the lot legible.
 for(const [x,y] of [[0,0],[18,0],[0,18],[18,18]])this.box(x-.06,y-.06,.12,.12,.28,'#d9dec3');
 for(let x=1;x<5;x++){this.box(x,16,.5,.5,.12,'#9c9670');for(let i=0;i<3;i++){this.ellipse(x+.15+i*.12,16.25,.25,.15,.1,'#96a777');this.ellipse(x+.15+i*.12,16.25,.38,.07,.06,i%2?'#dfb994':'#eee1ae');}}
 const objects=s.furniture.filter(f=>!itemDef(f.type).flat).map(f=>({depth:f.x+f.y+dimensions(f)[0]+dimensions(f)[1]-.1,draw:()=>this.furniture(f)}));
 for(const [edge,v] of Object.entries(s.walls)){const [axis,xy]=edge.split(':'),[x,y]=xy.split(',').map(Number);objects.push({depth:x+y+(axis==='h'?1:1)+.02,draw:()=>this.wall(edge,v)});}
 const p={...s.person};const pose=sharedActivityPose(s,'player');if(pose){p.x=pose.x-.5;p.y=pose.y-.5;p.pose=pose;}if(s.activity?.path?.length){const target=s.activity.path[0],t=Math.min(1,(s.activity.walkClock||0)/2);p.x+=(target[0]-p.x)*t;p.y+=(target[1]-p.y)*t;}
 for(const visitor of s.social?.presences||[]){const pose=sharedActivityPose(s,visitor.personId),npc={...s.people[visitor.personId],x:pose?pose.x-.5:visitor.x,y:pose?pose.y-.5:visitor.y,pose};objects.push({depth:npc.x+npc.y+1,draw:()=>{if(ui.selectedPersonId===visitor.personId)this.ellipse(npc.x+.5,npc.y+.5,.02,.48,.2,'#e5c67a');this.person(npc,time);}});}
 objects.push({depth:p.x+p.y+1,draw:()=>this.person(p,time,s.activity?.kind==='work')});
 objects.sort((a,b)=>a.depth-b.depth);objects.forEach(o=>o.draw());
 if(s.activity?.path?.length){c.globalAlpha=.5;for(const [x,y] of s.activity.path)this.ellipse(x+.5,y+.5,.02,.07,.04,'#f9f7e2');c.globalAlpha=1;}
 if(ui.selectedObjectId){const f=s.furniture.find(f=>f.id===ui.selectedObjectId);if(f){const [w,h]=dimensions(f);for(let x=f.x;x<f.x+w;x++)for(let y=f.y;y<f.y+h;y++)this.tile(x,y,'#f8df8b88','#fff4cb');}}
 if(ui.hover&&ui.tab==='build'&&ui.tool==='room'&&ui.roomStart){const [x1,y1]=ui.roomStart,[x2,y2]=ui.hover;for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++)this.tile(x,y,ui.roomPreview?.valid?'#aac48980':'#ce806d80','#ffffcf');}
 else if(ui.hover&&ui.tab==='shop'&&ui.selected){const [x,y]=ui.hover,valid=canPlace(s,ui.selected,x,y,ui.rotation);c.globalAlpha=.6;this.furniture({type:ui.selected,x,y,rotation:ui.rotation});c.globalAlpha=.7;const [w,h]=dimensions({type:ui.selected,rotation:ui.rotation});for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)this.tile(a,b,valid?'#aac48960':'#ce806d80','#fff4cb');c.globalAlpha=1;}
 else if(ui.hover&&ui.tab==='build'){const [x,y]=ui.hover;this.tile(x,y,'#f6f0ba66','#fff5c8');if((ui.tool==='wall'||ui.tool==='door'||ui.tool==='erase')&&ui.edge){const [a,xy]=ui.edge.split(':'),[ex,ey]=xy.split(',').map(Number);this.line(this.p(ex,ey,.1),this.p(ex+(a==='h'?1:0),ey+(a==='v'?1:0),.1),'#fff9cf',4);}}
 const night=Math.floor(s.minutes%1440/60);if(night<6||night>=20){c.fillStyle='#34466326';c.fillRect(0,0,this.w,this.h);}
 }
}
export function drawThumbnail(canvas,type){const r=new Renderer(canvas);r.w=110;r.h=72;r.t=20;r.ox=55;r.oy=28;const d=itemDef(type);r.ox-=(d.w-d.h)*r.t/2;r.oy-=(d.w+d.h)*r.t/4;r.furniture({type,x:0,y:0,rotation:0});}
export function drawCharacter(canvas,person){const r=new Renderer(canvas);r.t=100;r.ox=canvas.width/2;r.oy=canvas.height*.86;const c=r.ctx;c.clearRect(0,0,canvas.width,canvas.height);r.ellipse(0,0,-.04,1.03,.4,'#d2dcba');r.person({...person,x:-.5,y:-.5},0);}
export function portraitSVG(p){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path d="M13 80Q12 55 40 55T67 80" fill="${p.shirt}"/><path d="M33 49h14v15H33z" fill="${p.skin}"/><ellipse cx="40" cy="34" rx="19" ry="24" fill="${p.hair}"/>${p.style==='long'?`<path d="M21 29v35l11-9 17 1 10 8V29" fill="${p.hair}"/>`:''}<ellipse cx="40" cy="37" rx="16" ry="20" fill="${p.skin}"/><path d="M23 34q-4-23 18-23 22 2 17 24L47 24l-13 2z" fill="${p.hair}"/>${p.style==='curly'?`<path d="M21 26q-6-11 5-12-1-9 9-7 8-9 13 0 14-1 13 12 6 14-5 12l-5-11-21 4z" fill="${p.hair}"/>`:''}<circle cx="34" cy="38" r="1.2" fill="#37463b"/><circle cx="47" cy="38" r="1.2" fill="#37463b"/><path d="M36 47q4 4 9 0" fill="none" stroke="#8e5f48" stroke-width="1.4" stroke-linecap="round"/></svg>`;}
