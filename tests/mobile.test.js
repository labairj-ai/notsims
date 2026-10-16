import test from 'node:test';
import assert from 'node:assert/strict';
import {WorldGesture,clampZoom} from '../src/ui/gestures.js';
import {touchFurniture} from '../src/ui/input.js';
import {room} from '../src/systems/building/building.js';
import {newGame} from '../src/game/session.js';
test('tap threshold, drag, pinch and second-finger removal never leak a command',()=>{
 const g=new WorldGesture();g.down(1,0,0);g.move(1,6,6);assert.equal(g.up(1),true);
 g.down(1,0,0);g.move(1,11,0);assert.equal(g.up(1),false);
 g.down(1,0,0);g.down(2,20,0);const m=g.move(2,40,0);assert.equal(m.after.distance,40);assert.equal(g.up(2),false);assert.equal(g.up(1),false);
 g.down(1,0,0);g.down(2,20,0);g.up(1);assert.equal(g.up(2),false);g.down(3,1,1);assert.equal(g.up(3),true);
 g.down(1,0,0);g.cancel();assert.equal(g.up(1),false);assert.equal(clampZoom(.1),.6);assert.equal(clampZoom(4),2.8);
});
test('room editing drag remains eligible while navigation drag does not',()=>{const g=new WorldGesture();g.down(1,0,0);g.move(1,100,100,{navigate:false});assert.equal(g.up(1),true);});
test('touch selection is bounded, stable and respects renderer occlusion',()=>{const state={furniture:[{id:'b',type:'chair',x:1,y:1,rotation:0},{id:'a',type:'chair',x:1,y:1,rotation:0}]},r={p:()=>[100,100]};assert.equal(touchFurniture(state,r,101,100).id,'a');assert.equal(touchFurniture(state,r,130,100),undefined);r.pickFurniture=()=>state.furniture[0];assert.equal(touchFurniture(state,r,100,100).id,'b');});
test('room estimate uses authoritative validation without mutating the live state',()=>{const s=newGame({},true),snapshot=JSON.stringify(s),copy=structuredClone(s);assert.equal(room(copy,0,0,2,2),null);assert.ok(copy.money<s.money);assert.equal(JSON.stringify(s),snapshot);assert.match(room(structuredClone(s),0,0,1,1),/3 × 3/);});
