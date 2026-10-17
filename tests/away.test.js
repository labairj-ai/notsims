import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,tick} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
import {JOBS} from '../src/content/careers.js';
import {awayConflicts,awayDescriptor,effectiveTimeScale,requireAwayAttention} from '../src/systems/away/away.js';
import {createGameLoop} from '../src/ui/game-loop.js';

const start=(s,job='developer')=>{s.job=job;const r=dispatch(s,{type:'START_SHIFT'});assert.equal(r.ok,true);tick(s,1);};
test('away policy is derived, supports future fixtures, and compression respects pause, attention, and override',()=>{
 const s=newGame();start(s);assert.deepEqual(awayDescriptor(s.activity),{location:'away',policy:'work',compressible:true,attentionPolicy:'interruptible',strategy:'normal'});assert.equal(effectiveTimeScale({activity:s.activity}),24);assert.equal(effectiveTimeScale({activity:s.activity,paused:true}),0);assert.equal(effectiveTimeScale({activity:s.activity,override:3}),3);requireAwayAttention(s.activity);assert.equal(effectiveTimeScale({activity:s.activity,attentionRequired:true}),1);for(const kind of ['school','appointment','travel'])assert.equal(effectiveTimeScale({activity:{kind}}),24);
});
test('6/7/8 hour shifts finish once, pay once, and retain the selected normal speed outside the simulation',()=>{
 for(const job of JOBS){const s=newGame();s.job=job.id;s.needs.energy=100;assert.equal(effectiveTimeScale({activity:{kind:'work'},selectedSpeed:3}),24);tick(s,job.hours*60);assert.equal(s.shifts,0);dispatch(s,{type:'START_SHIFT'});tick(s,job.hours*60);assert.equal(s.activity,null);assert.equal(effectiveTimeScale({activity:s.activity,selectedSpeed:3}),3);assert.equal(s.shifts,1);assert.equal(s.money,6500+job.pay*job.hours);}
});
test('away bladder and meal care are thresholded, bounded, deterministic, and do not restore energy, hygiene, or fun',()=>{
 const low=newGame();low.job='developer';low.needs.bladder=20;low.needs.hunger=20;low.needs.energy=70;low.needs.hygiene=70;low.needs.fun=70;let events=[];dispatch(low,{type:'START_SHIFT'});tick(low,1,events);assert.equal(low.activity.awayState.care.kind,'bathroom_break');tick(low,5,events);assert.ok(low.needs.bladder>=79);assert.equal(events.filter(e=>e.type==='AWAY_CARE_STARTED').length,1);tick(low,120,events);assert.equal(low.activity.awayState.mealBreakUsed,true);assert.equal(events.filter(e=>e.type==='AWAY_CARE_STARTED'&&e.care==='meal_break').length,1);const energy=low.needs.energy,hygiene=low.needs.hygiene,fun=low.needs.fun;tick(low,500,events);assert.ok(low.needs.energy<energy);assert.ok(low.needs.hygiene<hygiene);assert.ok(low.needs.fun<fun);
 const healthy=newGame();healthy.job='developer';healthy.needs.energy=100;healthy.needs.bladder=80;healthy.needs.hunger=80;dispatch(healthy,{type:'START_SHIFT'});const healthyEvents=[];tick(healthy,480,healthyEvents);assert.equal(healthy.activity,null);assert.equal(healthyEvents.filter(e=>e.type==='AWAY_CARE_STARTED').length,0);
});
test('save/load during active away care preserves progress and emits no duplicate care start',()=>{
 const s=newGame();s.job='developer';s.needs.bladder=20;dispatch(s,{type:'START_SHIFT'});const events=[];tick(s,3,events);assert.equal(s.activity.awayState.care.elapsed,2);const loaded=validateSave(serializeSave(s));assert.deepEqual(loaded.activity.awayState,s.activity.awayState);const after=[];tick(loaded,3,after);assert.equal(after.filter(e=>e.type==='AWAY_CARE_STARTED').length,0);assert.equal(after.filter(e=>e.type==='AWAY_CARE_COMPLETED').length,1);
});
test('away results and event ordering match across 1-minute and 24-minute chunks, including full social state',()=>{
 const a=newGame(),b=newGame(),eventsA=[],eventsB=[];for(const s of [a,b]){s.job='developer';s.needs.bladder=20;s.needs.hunger=20;s.needs.energy=100;s.minutes=3*1440-480;s.billsDay=2;s.social.plans.push({id:s.social.nextId++,host:'player',personId:'person_1',startMinute:s.minutes+60,duration:120,status:'scheduled'});dispatch(s,{type:'START_SHIFT'});}
 for(let i=0;i<480;i++)tick(a,1,eventsA);for(let i=0;i<20;i++)tick(b,24,eventsB);
 assert.equal(a.minutes,b.minutes);assert.equal(a.money,b.money);assert.deepEqual(a.needs,b.needs);assert.deepEqual(a.activity,b.activity);assert.deepEqual(a.social,b.social);assert.deepEqual(a.relationships,b.relationships);assert.deepEqual(eventsA,eventsB);assert.equal(a.shifts,b.shifts);
});
test('scheduled plan conflicts are pure, strict at shift boundaries, and require deliberate acknowledgement',()=>{
 const s=newGame();s.job='barista';const startMinute=s.minutes,total=JOBS.find(j=>j.id==='barista').hours*60;s.social.plans.push({id:77,personId:'person_1',startMinute:startMinute+total,duration:60,status:'scheduled'});assert.deepEqual(awayConflicts(s,{total}),[]);s.social.plans[0].startMinute=startMinute+total-1;const before=JSON.stringify(s);assert.equal(awayConflicts(s,{total})[0].id,77);assert.equal(JSON.stringify(s),before);let r=dispatch(s,{type:'START_SHIFT'});assert.equal(r.code,'AWAY_CONFLICT');r=dispatch(s,{type:'START_SHIFT',confirmedConflictIds:[77]});assert.equal(r.ok,true);assert.equal(s.activity.elapsed,0);assert.equal(s.activity.total,total);tick(s,total);assert.equal(s.minutes,startMinute+total);assert.equal(s.social.plans[0].status,'missed');
});
test('future attention requirement can be cleared without changing normal speed state',()=>{const a={kind:'work',awayState:{attentionRequired:false}};assert.equal(requireAwayAttention(a),true);assert.equal(a.awayState.attentionRequired,true);assert.equal(requireAwayAttention(a,false),true);assert.equal(a.awayState.attentionRequired,false);});
test('spontaneous social opportunities do not create home visitors while the player is away at work',()=>{const s=newGame();s.job='barista';s.social.nextSocialOpportunityMinute=s.minutes+1;dispatch(s,{type:'START_SHIFT'});tick(s,360);assert.equal(s.activity,null);assert.equal(s.social.presences.length,0);assert.equal(s.social.pendingEvent,null);});
test('busy household actions cannot queue an away transition behind an unknown start time',()=>{const s=newGame();s.job='developer';s.activity={kind:'nap',elapsed:0,total:60};const before=structuredClone(s);assert.equal(dispatch(s,{type:'START_SHIFT'}).code,'BUSY');assert.deepEqual(s,before);});
test('bathroom and lunch care do not begin unless their full duration fits before shift end',()=>{
 for(const {total,elapsed,need} of [{total:5,elapsed:0,need:'bladder'},{total:139,elapsed:119,need:'hunger'}]){const s=newGame();s.job='developer';dispatch(s,{type:'START_SHIFT'});s.activity.total=total;s.activity.elapsed=elapsed;s.needs[need]=20;const events=[];tick(s,1,events);assert.equal(events.some(e=>e.type==='AWAY_CARE_STARTED'),false);}
});
test('the real frame loop completes each shift in its expected Auto 24× wall time and measures bounded work',()=>{
 const durations=[];
 for(const job of JOBS){const s=newGame();s.job=job.id;s.needs.energy=100;dispatch(s,{type:'START_SHIFT'});let now=0,cpuMs=0,eventCount=0,maxEventsPerFrame=0;const loop=createGameLoop({now,paused:()=>false,hidden:()=>false,speed:()=>effectiveTimeScale({activity:s.activity,selectedSpeed:3}),advance:dt=>{const t=performance.now(),r=advance(s,dt);cpuMs+=performance.now()-t;eventCount+=r.events.length;maxEventsPerFrame=Math.max(maxEventsPerFrame,r.events.length);},draw:()=>{},preview:()=>{},refresh:()=>{},schedule:()=>{}});while(s.activity&&now<25000){now+=250;loop.frame(now);}assert.equal(s.activity,null);assert.equal(s.shifts,1);assert.equal(s.minutes-480,job.hours*60);assert.equal(now/1000,job.hours*60/24);assert.ok(Number.isFinite(cpuMs));assert.ok(eventCount<=3);assert.ok(maxEventsPerFrame<=3);durations.push({job:job.id,seconds:now/1000,cpuMs:+cpuMs.toFixed(2),events:eventCount,maxEventsPerFrame});}
 assert.deepEqual(durations.map(x=>x.seconds),[15,17.5,20]);
});
test('attention boundaries suspend and restore compression through the game-loop application boundary',()=>{
 const s=newGame();s.job='developer';dispatch(s,{type:'START_SHIFT'});let now=0;const loop=createGameLoop({now,paused:()=>false,hidden:()=>false,speed:()=>effectiveTimeScale({activity:s.activity,selectedSpeed:3,attentionRequired:s.activity.awayState.attentionRequired}),advance:dt=>advance(s,dt),draw:()=>{},preview:()=>{},refresh:()=>{},schedule:()=>{}});for(let i=0;i<4;i++){now+=250;loop.frame(now);}assert.equal(s.minutes-480,24);requireAwayAttention(s.activity);for(let i=0;i<4;i++){now+=250;loop.frame(now);}assert.equal(s.minutes-480,27);requireAwayAttention(s.activity,false);for(let i=0;i<4;i++){now+=250;loop.frame(now);}assert.equal(s.minutes-480,51);
});
