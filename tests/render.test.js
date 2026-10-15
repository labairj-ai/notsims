import test from 'node:test';
import assert from 'node:assert/strict';
import {Renderer,drawThumbnail,drawCharacter,portraitSVG} from '../src/render.js';
import {newGame,CATALOG} from '../src/engine.js';
globalThis.window={devicePixelRatio:1};
function canvas(w=900,h=720){
 let calls=0;
 const context=new Proxy({}, {get:(_t,k)=>{if(['fillStyle','strokeStyle','globalAlpha','lineWidth'].includes(k))return 1;return (...args)=>{calls++;for(const v of args)if(typeof v==='number')assert.ok(Number.isFinite(v),`${String(k)} received invalid coordinate`);};},set:()=>true});
 return {width:w,height:h,getContext:()=>context,getBoundingClientRect:()=>({width:w,height:h}),calls:()=>calls};
}
test('renderer draws each furniture type in all four rotations with finite coordinates',()=>{
 const c=canvas(),r=new Renderer(c);r.resize();for(const d of CATALOG)for(let rotation=0;rotation<4;rotation++)r.furniture({type:d.id,x:3,y:3,rotation});assert.ok(c.calls()>1000);
});
test('scene renders at desktop and mobile dimensions in every game mode',()=>{
 for(const [w,h] of [[900,720],[320,480]])for(const fullWalls of [false,true]){
 const c=canvas(w,h),r=new Renderer(c),s=newGame();r.fullWalls=fullWalls;
 for(const tab of ['live','build','shop','career'])r.draw(s,{tab,tool:'room',hover:[5,5],roomStart:[3,3],selected:'bed',rotation:1},0);
 s.minutes=1400;r.draw(s,{tab:'build',tool:'wall',hover:[4,4],edge:'h:4,4'},10);assert.ok(c.calls()>10000);
 }
});
test('catalog and character previews render without invalid coordinates',()=>{
 for(const d of CATALOG)drawThumbnail(canvas(110,72),d.id);
 for(const style of ['short','long','curly']){const p={...newGame().person,style};drawCharacter(canvas(340,360),p);assert.match(portraitSVG(p),/^<svg/);}
});
