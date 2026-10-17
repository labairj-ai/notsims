import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,room,buy,buildTile,pathTo,enqueue,tick,cancel,validateSave,canPlace,at,edgeKey,CATALOG,JOBS,key,SIZE} from '../src/engine.js';
test('starter home has accessible furniture, valid needs, and a passable entrance',()=>{
 const s=newGame();assert.equal(validateSave(JSON.stringify(s)).money,6500);assert.ok(pathTo(s,8,16));
 for(const f of s.furniture.filter(f=>CATALOG.find(d=>d.id===f.type).need)){
 const t=structuredClone(s);assert.equal(enqueue(t,{kind:'use',id:f.id}),null);tick(t,1);assert.ok(t.activity,`cannot reach ${f.type}`);
 }
});
test('room building is atomic, charges exact materials, and adds an entrance',()=>{
 const s=newGame({},true);assert.equal(room(s,2,2,5,5),null);assert.equal(Object.keys(s.floors).length,16);assert.equal(s.money,12000-16*12-16*18);assert.equal(s.walls['h:3,6'],'door');
 const poor=newGame({},true);poor.money=1;const before=JSON.stringify(poor);assert.match(room(poor,0,0,3,3),/funds/);assert.equal(JSON.stringify(poor),before);
 assert.ok(room(s,0,0,0,0));
});
test('furniture requires floor and clear footprint; rug may sit under furniture',()=>{
 const s=newGame({},true);assert.equal(canPlace(s,'bed',3,3),false);room(s,2,2,6,6);assert.equal(buy(s,'bed',3,3),null);assert.ok(buy(s,'bed',3,3));assert.equal(buy(s,'rug',3,3),null);assert.equal(at(s,3,3).type,'bed');assert.equal(canPlace(s,'bed',-1,3),false);
});
test('walls block movement and doors connect rooms',()=>{
 const s=newGame({},true);s.person.x=3;s.person.y=3;room(s,2,2,4,4);assert.ok(pathTo(s,3,6));s.walls['h:3,5']='wall';assert.equal(pathTo(s,3,6),null);s.walls['h:3,5']='door';assert.ok(pathTo(s,3,6));assert.equal(edgeKey(3,4,3,5),'h:3,5');
});
test('using a bed restores energy and caps all needs at 100',()=>{
 const s=newGame();s.needs.energy=10;enqueue(s,{kind:'use',id:s.furniture.find(f=>f.type==='bed').id});tick(s,200);assert.ok(s.needs.energy>90);assert.ok(Object.values(s.needs).every(v=>v>=0&&v<=100));
});
test('work pays only on completion and experience alone cannot force a promotion',()=>{
 const s=newGame();s.job='barista';s.minutes=419;const initial=s.money;
 enqueue(s,{kind:'work'});tick(s,100);assert.equal(s.money,initial);assert.equal(s.activity.kind,'work');cancel(s);assert.equal(s.money,initial);
 for(let i=0;i<3;i++){s.needs.energy=100;s.minutes=(i+1)*1440+419;enqueue(s,{kind:'work'});tick(s,360);}
 assert.equal(s.shifts,3);assert.equal(s.money,initial+132*3-101);s.needs.energy=100;s.minutes=4*1440+419;enqueue(s,{kind:'work'});tick(s,1);assert.equal(s.activity.pay,132);
});
test('all three jobs pay the advertised wages',()=>{
 for(const j of JOBS){const s=newGame();s.job=j.id;s.minutes=j.startMinute-1;enqueue(s,{kind:'work'});tick(s,j.hours*60);assert.equal(s.money,6500+j.pay*j.hours);assert.equal(s.shifts,1);}
});
test('fast-forward and normal time produce the same simulation result',()=>{
 const a=newGame(),b=structuredClone(a);enqueue(a,{kind:'chat'});enqueue(b,{kind:'chat'});tick(a,120);for(let i=0;i<120;i++)tick(b,1);assert.deepEqual(a,b);
});
test('save round trip preserves house, funds, needs, character and in-progress jobs',()=>{
 const s=newGame({name:'Taylor',style:'curly'});s.job='designer';s.minutes=539;enqueue(s,{kind:'work'});tick(s,100);const t=validateSave(JSON.stringify(s));assert.deepEqual(t.person,s.person);assert.deepEqual(t.furniture,s.furniture);assert.equal(t.activity.elapsed,100);assert.equal(t.money,s.money);tick(t,320);assert.equal(t.shifts,1);
});
test('bad saves cannot introduce invalid furniture, colors, time, or needs',()=>{
 for(const mutate of [s=>s.version=22,s=>s.minutes=-1,s=>s.person.skin='bad',s=>s.furniture[0].type='unknown',s=>s.needs.hunger=999,s=>s.furniture.push({...s.furniture[0]}),s=>s.person.x=SIZE]){const s=newGame();mutate(s);assert.throws(()=>validateSave(s));}
});
test('editing does not alter an active simulation or create walls through furniture',()=>{
 const s=newGame();enqueue(s,{kind:'nap'});assert.match(room(s,1,1,4,4),/action/);assert.match(buy(s,'chair',7,7),/action/);cancel(s);assert.match(buildTile(s,'wall',4,3,'v:5,3'),/furniture/);
});
test('selling refunds 65 percent and removes the item',()=>{
 const s=newGame(),f=s.furniture.find(f=>f.type==='bed');const before=s.money;buildTile(s,'erase',f.x,f.y,'h:4,3');assert.equal(s.money,before+Math.floor(450*.65));assert.ok(!s.furniture.some(i=>i.id===f.id));
});
test('bills are charged once every three days',()=>{
 const s=newGame({},true);s.minutes=3*1440-1;s.billsDay=2;tick(s,1);assert.equal(s.money,11925);tick(s,60);assert.equal(s.money,11925);
});
