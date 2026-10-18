import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';

test('command failures are structured and atomic, including malformed external payloads',()=>{
 const s=newGame({},true);
 const invalid=[{type:'UNKNOWN'},{type:'MOVE_TO',x:-1,y:0},{type:'CHANGE_JOB',job:'fake'},{type:'PLACE_OBJECT',object:'plant',x:0,y:0},{type:'BUILD_ROOM',x1:0,y1:0,x2:1,y2:1},{type:'EDIT_TILE',tool:'door',x:0,y:0,edge:'bad'},{type:'QUICK_ACTION',kind:'toString'},{type:'CHANGE_APPEARANCE',appearance:{x:1}},{type:'CHANGE_APPEARANCE',appearance:{trait:{toString:null}}},{type:'CHANGE_APPEARANCE',appearance:{skin:{toString:null}}},{type:'EDIT_TILE',tool:'floor',x:0,y:0,edge:{toString:null}}];
 for(const c of invalid){const before=structuredClone(s),r=dispatch(s,c);assert.equal(r.ok,false);assert.notEqual(r.code,'OK');assert.deepEqual(r.events,[]);assert.deepEqual(s,before);}
});
test('build, object sale, money and career/action events describe deterministic facts',()=>{
 const s=newGame({},true);const room={type:'BUILD_ROOM',x1:0,y1:0,x2:2,y2:2};const copy=structuredClone(s);
 assert.deepEqual(dispatch(s,room),dispatch(copy,JSON.parse(JSON.stringify(room))));assert.deepEqual(s,copy);
 const placed=dispatch(s,{type:'PLACE_OBJECT',object:'chair',x:1,y:1});assert.equal(placed.ok,true);assert.deepEqual(placed.events.map(e=>e.type),['MONEY_SPENT','FURNITURE_PLACED']);assert.equal(placed.events[0].amount,55);
 const sold=dispatch(s,{type:'ERASE',x:1,y:1,edge:'h:1,1'});assert.deepEqual(sold.events.map(e=>e.type),['FURNITURE_SOLD','MONEY_RECEIVED']);assert.equal(sold.events[1].amount,35);
 dispatch(s,{type:'CHANGE_JOB',job:'barista'});s.minutes=420;const started=dispatch(s,{type:'START_SHIFT'});assert.deepEqual(started.events.map(e=>e.type),['ACTION_STARTED']);const result=advance(s,360);
 assert.ok(result.events.some(e=>e.type==='SHIFT_COMPLETED'&&e.pay===132));assert.ok(result.events.some(e=>e.type==='ACTION_COMPLETED'));assert.equal(s.shifts,1);
});
