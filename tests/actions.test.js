import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,tick} from '../src/game/session.js';
import {enqueue,cancel} from '../src/systems/actions/queue.js';

test('queue cap, cancellation, unreachable use and meal cost preserve action contracts',()=>{
 const s=newGame();for(let i=0;i<5;i++)assert.equal(enqueue(s,{kind:'chat'}),null);
 const before=structuredClone(s);assert.ok(enqueue(s,{kind:'nap'}));assert.deepEqual(s,before);cancel(s);assert.deepEqual(s.queue,[]);
 const fridge=s.furniture.find(f=>f.type==='fridge');s.needs.hunger=0;const money=s.money;enqueue(s,{kind:'use',id:fridge.id});tick(s,1);assert.equal(s.money,money-8);cancel(s);
 const blocked=newGame({},true);blocked.person.x=0;blocked.person.y=0;blocked.walls={'v:1,0':'wall','h:0,1':'wall'};blocked.furniture=[{id:1,type:'fridge',x:2,y:2,rotation:0}];
 enqueue(blocked,{kind:'use',id:1});tick(blocked,1);assert.equal(blocked.activity,null);assert.equal(blocked.money,12000);assert.match(blocked.log[0],/Cannot reach/);
});
test('a changed path cancels safely before moving through a wall',()=>{
 const s=newGame({},true);enqueue(s,{kind:'walk',x:10,y:10});tick(s,1);s.walls['v:9,10']='wall';const events=[];tick(s,1,events);assert.equal(s.person.x,8);assert.equal(s.activity,null);assert.ok(events.some(e=>e.type==='ACTION_CANCELLED'&&e.reason==='PATH_CHANGED'));
});
