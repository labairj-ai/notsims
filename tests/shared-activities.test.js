import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {prepareSharedActivity,availableSharedActivities,sharedActivityPose,relationship} from '../src/systems/social/social.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
import {runScenario,replay} from './helpers/scenario.js';
const setup=type=>{const s=newGame({},true);s.social.nextSocialOpportunityMinute=1e8;s.furniture=[{id:s.nextId++,type,x:7,y:7,rotation:0}];assert.equal(dispatch(s,{type:'INVITE_OVER',personId:'person_1'}).ok,true);advance(s,45);s.social.presences[0].until=s.minutes+200;return s;};
for(const [type,interactionId,need] of [['sofa','shared_sit','social'],['tv','shared_watch','fun'],['table','shared_eat','hunger'],['stove','shared_cook','hunger'],['bookcase','shared_read','fun']])test(`${interactionId}: coordinated arrival, visible poses, needs and canonical relationship effects`,()=>{
 const s=setup(type);s.needs[need]=20;const before=relationship(s,'player','person_1').contactCount;
 const q=prepareSharedActivity(s,{personId:'person_1',objectId:1,interactionId});assert.ok(q.prepared,JSON.stringify(q));assert.notDeepEqual(q.prepared.slots[0],q.prepared.slots[1]);
 assert.equal(dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId}).ok,true);let active=false,events=[];for(let i=0;i<100;i++){events.push(...advance(s,1).events);if(s.social.sharedActivity?.status==='active'){active=true;assert.ok(sharedActivityPose(s,'player'));assert.ok(sharedActivityPose(s,'person_1'));assert.equal(s.activity.path.length,0);assert.equal(s.social.presences[0].path.length,0);}if(!s.social.sharedActivity)break;}
 assert.ok(active);assert.ok(events.some(e=>e.type==='SHARED_ACTIVITY_COMPLETED'),JSON.stringify(events));assert.ok(s.needs[need]>20);assert.equal(relationship(s,'player','person_1').contactCount,before+1);assert.ok(events.some(e=>e.type==='SOCIAL_CONTACT_COMPLETED'&&e.source==='shared'));assert.ok(relationship(s,'player','person_1').memories.some(m=>m.type==='awkward_hangout'||m.type.includes('together')||m.type==='shared_meal'||m.type==='good_hangout'));assert.equal(s.social.sharedActivity,null);
});
test('shared reservation and path failures are atomic; occupied/absent targets cannot start',()=>{
 const s=setup('table');for(const c of [{personId:'missing',interactionId:'shared_eat',objectId:1},{personId:'person_1',interactionId:'shared_watch',objectId:1},{personId:'person_1',interactionId:'shared_eat',objectId:99}]){const before=structuredClone(s);assert.equal(dispatch(s,{type:'SHARED_ACTIVITY',...c}).ok,false);assert.deepEqual(s,before);}
 s.walls={};for(let x=0;x<18;x++)s.walls[`h:${x},9`]='wall';const before=structuredClone(s);assert.equal(dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',interactionId:'shared_eat',objectId:1}).code,'UNREACHABLE');assert.deepEqual(s,before);
});
test('cancel, guest departure, changed path and removed furniture release both participants without reward',()=>{
 for(const reason of ['cancel','leave','delete','path','move']){const s=setup('table'),before=relationship(s,'player','person_1').contactCount;dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',interactionId:'shared_eat',objectId:1});advance(s,2);
 if(reason==='cancel')dispatch(s,{type:'CANCEL_ACTION'});if(reason==='leave')dispatch(s,{type:'ASK_GUEST_TO_LEAVE',personId:'person_1'});if(reason==='delete')s.furniture=[];if(reason==='move')s.furniture[0].x++;if(reason==='path'){s.activity.path=[];s.social.presences[0].path=[];}advance(s,1);assert.equal(s.social.sharedActivity,null);assert.equal(s.activity,null);assert.equal(relationship(s,'player','person_1').contactCount,before);if(reason!=='leave')assert.equal(s.social.presences[0].path.length,0);
 }
});
test('saving a shared activity safely cancels transient coordination on load without changing original',()=>{
 const s=setup('table');dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',interactionId:'shared_eat',objectId:1});advance(s,1);const before=structuredClone(s),loaded=validateSave(serializeSave(s));assert.deepEqual(s,before);assert.equal(loaded.activity,null);assert.equal(loaded.social.sharedActivity,null);assert.equal(loaded.social.presences[0].path.length,0);assert.deepEqual(loaded.relationships,s.relationships);
 for(const mutate of [s=>s.social.sharedActivity.slots=[[7,7],[7,7]],s=>s.social.sharedActivity.participants=['player','missing'],s=>s.social.sharedActivity.elapsed=Infinity]){const bad=structuredClone(s);mutate(bad);assert.throws(()=>validateSave(bad));}
});
test('shared-activity scenario replays and contextual query is pure',()=>{
 const initial=setup('tv'),before=structuredClone(initial);assert.ok(availableSharedActivities(initial,'person_1').some(a=>a.interactionId==='shared_watch'));assert.deepEqual(initial,before);
 const a=runScenario({initial,steps:[{command:{type:'SHARED_ACTIVITY',personId:'person_1',interactionId:'shared_watch',objectId:1}},{advance:100}]});assert.deepEqual(replay(a.trace).state,a.state);assert.ok(a.events.some(e=>e.type==='SHARED_ACTIVITY_COMPLETED'));
});

test('shared meals price two portions, charge exactly once at consumption and reject insufficient funds atomically',()=>{
 for(const [type,interactionId,cost] of [['table','shared_eat',16],['stove','shared_cook',24]]){
  const s=setup(type),command={type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId};s.money=cost-1;let before=structuredClone(s);assert.equal(dispatch(s,command).code,'INSUFFICIENT_FUNDS');assert.deepEqual(s,before);
  const choice=availableSharedActivities(s,'person_1').find(a=>a.interactionId===interactionId);assert.equal(choice.cost,cost);assert.equal(choice.eligible,false);assert.equal(choice.disabledReason,'INSUFFICIENT_FUNDS');
  s.money=cost;assert.equal(dispatch(s,command).ok,true);assert.equal(s.money,cost);const events=[];for(let i=0;i<120&&s.social.sharedActivity;i++)events.push(...advance(s,1).events);
  assert.equal(s.money,0);assert.equal(events.filter(e=>e.type==='MONEY_SPENT'&&e.reason==='shared_meal').length,1);assert.equal(events.find(e=>e.type==='MONEY_SPENT').amount,cost);assert.ok(events.some(e=>e.type==='SHARED_ACTIVITY_COMPLETED'));
 }
});
test('food transaction revalidates funds on arrival and has no purchase or hunger benefit on failure',()=>{
 const s=setup('table');dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId:'shared_eat'});s.money=0;s.needs.hunger=20;const events=[];for(let i=0;i<100&&s.social.sharedActivity;i++)events.push(...advance(s,1).events);assert.ok(s.needs.hunger<=20);assert.equal(s.money,0);assert.equal(events.filter(e=>e.type==='MONEY_SPENT').length,0);assert.ok(events.some(e=>e.type==='SHARED_ACTIVITY_CANCELLED'&&e.reason==='INSUFFICIENT_FUNDS'));
});
test('cancellation, departure, object changes, timeout and save/load cannot duplicate charges or refund consumed portions',()=>{
 for(const active of [false,true])for(const reason of ['cancel','leave','object','timeout','load']){
  const s=setup('table'),money=s.money;dispatch(s,{type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId:'shared_eat'});
  if(active)for(let i=0;i<100&&s.social.sharedActivity.status!=='active';i++)advance(s,1);
  assert.equal(s.money,money-(active?16:0));
  if(reason==='cancel')dispatch(s,{type:'CANCEL_ACTION'});if(reason==='leave')dispatch(s,{type:'ASK_GUEST_TO_LEAVE',personId:'person_1'});if(reason==='object')s.furniture[0].rotation++;if(reason==='timeout')s.social.sharedActivity.deadline=s.minutes;
  if(reason==='load'){const loaded=validateSave(serializeSave(s));assert.equal(loaded.social.sharedActivity,null);assert.equal(loaded.money,s.money);const before=loaded.money;advance(loaded,2);assert.equal(loaded.money,before);}else {advance(s,1);assert.equal(s.social.sharedActivity,null);}
  assert.equal(s.money,money-(active?16:0));
 }
});
