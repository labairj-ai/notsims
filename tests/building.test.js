import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {room,buildTile} from '../src/systems/building/building.js';
import {buy,canPlace} from '../src/systems/building/placement.js';

test('rejected construction is atomic for funds, bounds, queued actions and furniture',()=>{
 for(const reject of [s=>{s.money=0;return ()=>room(s,0,0,2,2);},s=>()=>room(s,-1,0,2,2),s=>{s.queue.push({kind:'nap'});return ()=>buildTile(s,'floor',0,0,'h:0,0');},s=>()=>buildTile(s,'wall',4,3,'v:5,3')]){
  const s=newGame();const op=reject(s),before=structuredClone(s);assert.equal(typeof op(),'string');assert.deepEqual(s,before);
 }
});
test('building prices, room entrance, overlap, rug and sale refunds remain canonical',()=>{
 const s=newGame({},true);assert.equal(room(s,0,0,2,2),null);assert.equal(s.money,12000-9*12-12*18);assert.equal(s.walls['h:1,3'],'door');
 let money=s.money;assert.equal(buildTile(s,'floor',3,0,'h:3,0'),null);assert.equal(s.money,money-12);
 money=s.money;assert.equal(buildTile(s,'door',0,0,'h:0,0'),null);assert.equal(s.money,money-35);assert.equal(s.walls['h:0,0'],'door');
 assert.equal(buy(s,'table',0,1),null);assert.equal(canPlace(s,'chair',0,1),false);assert.equal(buy(s,'rug',0,1),null);
 const before=structuredClone(s);assert.ok(buy(s,'bed',17,17));assert.deepEqual(s,before);
 money=s.money;assert.equal(buildTile(s,'erase',0,1,'h:0,1'),null);assert.equal(s.money,money+117);assert.equal(s.furniture.length,1);
});
