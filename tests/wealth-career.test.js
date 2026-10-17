import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,tick} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
import {AWAY_POLICIES,advanceAwayNeeds,validateAwayPolicies,effectiveTimeScale} from '../src/systems/away/away.js';
import {shiftWindow} from '../src/systems/careers/performance.js';
import {ASSETS,assetDef} from '../src/content/assets.js';
import {CATALOG} from '../src/content/furniture.js';
import {DESTINATIONS} from '../src/content/destinations.js';
import {householdNetWorth,upkeepFor} from '../src/systems/ownership/ownership.js';
import {simulateEconomy} from '../src/systems/economy/simulator.js';
const send=(s,c)=>{const r=dispatch(s,c);assert.equal(r.ok,true,JSON.stringify(r));return r;};
const work=()=>{const s=newGame();send(s,{type:'CHANGE_JOB',job:'developer'});s.minutes=540;send(s,{type:'START_SHIFT'});return s;};
const buy=(s,id)=>{send(s,{type:'BUY_ASSET',definitionId:id});return s.ownership.assets.at(-1);};

test('optional Away care validates empty and partial policies and never freezes ordinary decay',()=>{
 assert.equal(validateAwayPolicies(AWAY_POLICIES),true);assert.equal(validateAwayPolicies({empty:{compressible:true,attentionPolicy:'interruptible',affordances:{bladder:null}}}),true);assert.throws(()=>validateAwayPolicies({bad:{compressible:true,attentionPolicy:'interruptible',affordances:{bladder:{mode:'auto-care',duration:-1}}}}));
 for(const kind of ['school','appointment','travel']){const s=newGame(),before=s.needs.energy;s.activity={kind,total:100,elapsed:0,path:[]};advanceAwayNeeds(s,s.activity,1,[]);tick(s,10);assert.ok(s.needs.energy<before);}
});
test('scheduled shifts reject early and repeated attendance atomically, late shifts pay only remaining hours, and misses occur once',()=>{
 const s=newGame();send(s,{type:'CHANGE_JOB',job:'developer'});assert.equal(shiftWindow(s).start,540);const before=structuredClone(s);assert.equal(dispatch(s,{type:'START_SHIFT'}).code,'SHIFT_UNAVAILABLE');assert.deepEqual(s,before);s.minutes=570;send(s,{type:'START_SHIFT'});assert.equal(s.activity.total,450);assert.equal(s.activity.pay,285);tick(s,450);assert.equal(s.career.performance,51);assert.equal(dispatch(s,{type:'START_SHIFT'}).code,'SHIFT_UNAVAILABLE');
 s.minutes=1980;const e=advance(s,61).events;assert.equal(e.filter(e=>e.type==='SHIFT_MISSED').length,1);const p=s.career.performance;tick(s,40);assert.equal(s.career.performance,p);
});
test('strategies are proportional, persist, replay exactly, and switching at completion cannot claim an entire hard shift',()=>{
 const a=work();send(a,{type:'SET_WORK_STRATEGY',strategy:'hard'});tick(a,240);const b=validateSave(serializeSave(a));send(a,{type:'SET_WORK_STRATEGY',strategy:'normal'});send(b,{type:'SET_WORK_STRATEGY',strategy:'normal'});const ea=[],eb=[];tick(a,240,ea);for(let n=0;n<240;n++)tick(b,1,eb);assert.deepEqual(ea,eb);assert.deepEqual(a.career,b.career);assert.equal(a.career.lastSummary.performanceDelta,4);assert.equal(a.career.lastSummary.strategyMinutes.hard,240);
 const c=work();tick(c,479);send(c,{type:'SET_WORK_STRATEGY',strategy:'hard'});tick(c,1);assert.ok(c.career.lastSummary.performanceDelta<2.01);
});
test('one work choice suspends compression and uses canonical coworker relationships without repeating rewards',()=>{
 const s=work();s.shifts=2;const e=advance(s,240).events;assert.equal(e.filter(e=>e.type==='WORK_EVENT').length,1);assert.equal(s.activity.awayState.attentionRequired,true);assert.equal(effectiveTimeScale({activity:s.activity,attentionRequired:true}),1);const loaded=validateSave(serializeSave(s));send(loaded,{type:'RESOLVE_WORK_EVENT',choice:'help'});assert.ok(loaded.relationships['person_7|player']);const before=structuredClone(loaded);assert.equal(dispatch(loaded,{type:'RESOLVE_WORK_EVENT',choice:'help'}).ok,false);assert.deepEqual(loaded,before);assert.equal(loaded.activity.awayState.attentionRequired,false);
});
test('classes and three destinations charge once, grant effects once, block home actions and resume from saves',()=>{
 for(const d of DESTINATIONS){const s=newGame();const cash=s.money;send(s,{type:'START_DESTINATION',destinationId:d.id});assert.equal(s.money,cash-d.cost);assert.equal(dispatch(s,{type:'MOVE_TO',x:0,y:0}).code,'AT_WORK');tick(s,5);const loaded=validateSave(serializeSave(s));const total=loaded.activity.total;tick(loaded,total);assert.equal(loaded.activity,null);assert.equal(loaded.skill,d.effects.skill??0);const skill=loaded.skill;tick(loaded,1);assert.equal(loaded.skill,skill);}
 const s=newGame();s.money=0;const before=structuredClone(s);assert.equal(dispatch(s,{type:'START_DESTINATION',destinationId:'coding_class'}).code,'INSUFFICIENT_FUNDS');assert.deepEqual(s,before);
});
test('all tier content is valid, quality bounded, and purchases never use social score gates',()=>{
 assert.ok(CATALOG.length>=38);for(const d of [...ASSETS,...CATALOG]){assert.ok(['entry','comfortable','premium','ultra'].includes(d.tier));assert.ok(d.quality>=1&&d.quality<=1.4);assert.ok(d.price>=0&&d.upkeep>=0);}
 const s=newGame();s.money=1e9;for(const id of ['supercar','museum_art','yacht','jet','island'])buy(s,id);assert.equal(s.ownership.assets.length,6);assert.deepEqual(validateSave(serializeSave(s)).ownership,s.ownership);
});
test('vehicle selection changes only travel duration, survives loading, sells once and removes upkeep',()=>{
 const s=newGame();s.money=100000;const a=buy(s,'used_car');send(s,{type:'SELECT_VEHICLE',assetId:a.id});const loaded=validateSave(serializeSave(s));send(loaded,{type:'START_DESTINATION',destinationId:'day_trip'});assert.equal(loaded.activity.total,303);assert.equal(loaded.minutes,480);tick(loaded,303);loaded.social.presences=[];send(loaded,{type:'SELL_ASSET',assetId:a.id});assert.equal(loaded.ownership.activeVehicle,null);const before=structuredClone(loaded);assert.equal(dispatch(loaded,{type:'SELL_ASSET',assetId:a.id}).ok,false);assert.deepEqual(loaded,before);assert.ok(!upkeepFor(loaded).some(x=>x.label==='Used car'));
});
test('two residences preserve independent lots and furniture IDs across multiple switches and save/load',()=>{
 let s=newGame();s.money=1e6;const original=structuredClone(s.furniture),a=buy(s,'larger_home');send(s,{type:'SWITCH_RESIDENCE',assetId:a.id});assert.equal(s.furniture.length,0);send(s,{type:'PLACE_OBJECT',object:'chair',x:4,y:4});const id=s.furniture[0].id;assert.ok(!original.some(f=>f.id===id));s=validateSave(serializeSave(s));send(s,{type:'SWITCH_RESIDENCE',assetId:1});assert.deepEqual(s.furniture,original);send(s,{type:'SWITCH_RESIDENCE',assetId:a.id});assert.equal(s.furniture[0].id,id);assert.equal(dispatch(s,{type:'SELL_ASSET',assetId:a.id}).code,'PRIMARY_RESIDENCE');send(s,{type:'SWITCH_RESIDENCE',assetId:1});assert.equal(dispatch(s,{type:'SELL_ASSET',assetId:a.id}).code,'PROPERTY_NOT_EMPTY');
});
test('business gross/cost/net and upkeep are deterministic, ledger bounded, sale is loss-making, reload cannot duplicate payouts',()=>{
 const s=newGame();s.money=100000;const a=buy(s,'cafe');const worth=householdNetWorth(s);assert.ok(worth<100000);tick(s,1440);const income=s.ownership.ledger.find(e=>e.kind==='income');assert.equal(income.gross,1700);assert.equal(income.cost,700);assert.equal(income.amount,1000);const loaded=validateSave(serializeSave(s)),cash=loaded.money;tick(loaded,1);assert.equal(loaded.money,cash);for(let n=0;n<70;n++)tick(loaded,1440);assert.ok(loaded.ownership.ledger.length<=60);loaded.social.presences=[];send(loaded,{type:'SELL_ASSET',assetId:a.id});assert.ok(!upkeepFor(loaded).some(x=>x.label==='Small café'));assert.ok(loaded.money<100000+71*1000);
});
test('corrupt ownership, duplicated lot IDs, future payout cursors, invalid strategies and accelerated rewards fail save validation',()=>{
 for(const mutate of [s=>s.career.performance=101,s=>s.ownership.assets.push({...s.ownership.assets[0]}),s=>s.ownership.assets[0].lastPayout=s.minutes+1,s=>s.ownership.assets[0].purchasePrice=-1,s=>s.ownership.primary=999]){const s=newGame();mutate(s);assert.throws(()=>validateSave(s));}
 const s=work();tick(s,10);s.activity.awayState.strategy='fake';assert.throws(()=>validateSave(s));const c=newGame();send(c,{type:'START_DESTINATION',destinationId:'coding_class'});c.activity.total=1;assert.throws(()=>validateSave(c));
});
test('economy simulator is deterministic, keeps ordinary starter cash flow viable and bounds wage growth',()=>{
 const a=simulateEconomy({days:20}),b=simulateEconomy({days:20});assert.deepEqual(a,b);assert.ok(a.rows.at(-1).cash>0);assert.ok(a.goals.queen_bed.shifts>=3&&a.goals.queen_bed.shifts<=25);assert.equal(a.goals.yacht.firstDay,null);assert.ok(a.billIncomeRatio<.5);
});

test('premium music and poolside activities use the existing shared relationship pipeline',()=>{
 for(const [type,interactionId] of [['piano','shared_music'],['pool','shared_pool']]){const s=newGame({},true);s.furniture=[{id:1,type,x:4,y:4,rotation:0}];s.nextId=2;s.person.x=3;s.person.y=5;s.social.nextSocialOpportunityMinute=1e8;s.social.presences=[{personId:'person_1',x:4,y:7,state:'visiting',visitId:1,path:[],moveClock:0,nextInitiationMinute:s.minutes+500,until:s.minutes+500,exit:[8,17]}];s.social.nextId=2;send(s,{type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId});const e=advance(s,100).events;assert.equal(e.filter(e=>e.type==='SHARED_ACTIVITY_COMPLETED').length,1);assert.ok(s.relationships['person_1|player'].memories.some(m=>m.type===(type==='piano'?'made_music_together':'poolside_hangout')));}
});
