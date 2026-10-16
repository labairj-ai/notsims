import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runScenario,replay} from '../helpers/scenario.js';
import {createRng} from '../../src/core/rng.js';
const fixture=JSON.parse(readFileSync(new URL('../fixtures/save-v1.json',import.meta.url)));

test('morning routine traverses furniture, meals, hygiene and social recovery',()=>{
 const scenario={name:'morning routine',seed:42,steps:[
  {command:{type:'INTERACT',id:4}}, // starter fridge
  {advance:80,assert:({state,events})=>{assert.equal(state.money,6492);assert.equal(state.activity,null);assert.ok(events.some(e=>e.type==='MONEY_SPENT'&&e.reason==='meal'));}},
  {command:{type:'INTERACT',id:12}}, // starter shower
  {advance:80,assert:({state})=>assert.ok(state.needs.hygiene>90)},
  {command:{type:'QUICK_ACTION',kind:'chat'}},
  {advance:40,assert:({state})=>{assert.ok(state.needs.social>95);assert.equal(state.activity,null);}},
 ]};
 const a=runScenario(scenario),b=runScenario(scenario);assert.deepEqual(a.trace,b.trace);assert.deepEqual(a.state,b.state);
 const replayed=replay(JSON.parse(JSON.stringify(a.trace)));assert.deepEqual(replayed.state,a.state);
 const chunked=runScenario({...scenario,steps:scenario.steps.map(s=>s.advance?{...s,chunk:1}:s)});assert.deepEqual(chunked.state,a.state);assert.deepEqual(chunked.events,a.events);
});
test('furniture use completes skill practice and resting through public commands',()=>{
 runScenario({name:'learning and rest',steps:[
  {command:{type:'INTERACT',id:2}},
  {advance:100,assert:({state})=>{assert.equal(state.skill,1);assert.equal(state.activity,null);}},
  {command:{type:'INTERACT',id:1}},
  {advance:100,assert:({state})=>{assert.ok(state.needs.energy>95);assert.equal(state.activity,null);}},
 ]});
});
test('frozen legacy work save resumes, pays once and permits a new career',()=>{
 const result=runScenario({name:'legacy shift',initial:fixture,steps:[
  {advance:330,assert:({state,events})=>{assert.equal(state.money,6632);assert.equal(state.shifts,1);assert.equal(events.filter(e=>e.type==='SHIFT_COMPLETED').length,1);}},
  {command:{type:'CHANGE_JOB',job:'designer'},expectEvents:['JOB_CHANGED']},
  {command:{type:'START_SHIFT'}},
  {advance:20},
  {command:{type:'CANCEL_ACTION'},assert:({state})=>{assert.equal(state.money,6632);assert.equal(state.shifts,1);}},
 ]});assert.deepEqual(replay(result.trace).state,result.state);
});
test('building and furnishing sequence charges exact prices and rejects overlaps atomically',()=>{
 runScenario({name:'new home',empty:true,steps:[
  {command:{type:'BUILD_ROOM',x1:0,y1:0,x2:3,y2:3},assert:({state})=>{assert.equal(state.money,11520);assert.equal(state.walls['h:1,4'],'door');}},
  {command:{type:'PLACE_OBJECT',object:'sofa',x:1,y:1,rotation:0}},
  {command:{type:'PLACE_OBJECT',object:'chair',x:1,y:1},expectCode:'OBSTRUCTED',assert:({state})=>assert.equal(state.furniture.length,1)},
  {command:{type:'PLACE_OBJECT',object:'rug',x:1,y:1}},
  {command:{type:'ERASE',x:1,y:1,edge:'h:1,1'},assert:({state})=>{assert.equal(state.furniture.length,1);assert.equal(state.furniture[0].type,'rug');assert.equal(state.money,11327);}},
 ]});
});
test('multi-day bills are identical under minute and chunked advancement',()=>{
 const scenario={name:'six days',empty:true,steps:[{advance:6*1440,assert:({state,events})=>{assert.equal(state.money,11850);assert.equal(events.filter(e=>e.type==='BILL_CHARGED').length,2);assert.equal(state.billsDay,6);}}]};
 const a=runScenario(scenario),b=runScenario({...scenario,steps:scenario.steps.map(s=>({...s,chunk:1}))});assert.deepEqual(a.state,b.state);assert.deepEqual(a.events,b.events);
});
test('scenario divergence reports exact command/time step and assertion difference',()=>{
 assert.throws(()=>runScenario({name:'diagnostic',steps:[{command:{type:'QUICK_ACTION',kind:'nap'}},{advance:1,assert:({state})=>assert.equal(state.money,1)}]}),/diagnostic: step 2.*advance.*6500/s);
});
test('seeded RNG is reproducible, bounded and restorable with explicit state',()=>{
 const a=createRng(42),b=createRng(42);for(let i=0;i<100;i++){const n=a.next();assert.equal(n,b.next());assert.ok(n>=0&&n<1);}
 const restored=createRng(a.state);assert.equal(restored.next(),a.next());assert.throws(()=>createRng(-1));assert.throws(()=>createRng(NaN));
});
