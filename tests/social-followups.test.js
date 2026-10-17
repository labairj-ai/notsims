import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {relationship,prepareSocial,availableSocialActions,repetitionMultiplier,isSociallyDiscoverable,visitEligible} from '../src/systems/social/social.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
const quiet=()=>{const s=newGame({},true);s.social.nextSocialOpportunityMinute=1e8;return s;};
const send=(s,c)=>{const result=dispatch(s,c);assert.equal(result.ok,true,JSON.stringify(result));return result;};
const text=(s,interaction='chat')=>{send(s,{type:'PHONE_CONTACT',personId:'person_1',interaction,channel:'text'});return advance(s,20);};
test('incoming completed exchanges credit the NPC exactly once; declines/expiry credit nobody',()=>{
 for(const type of ['text','phone_call'])for(const response of ['reply','decline','expire']){const s=quiet(),r=relationship(s,'player','person_1');s.social.pendingEvent={id:s.social.nextId++,personId:'person_1',type,expiry:s.minutes+15};if(response!=='expire')send(s,{type:'RESPOND_SOCIAL_EVENT',eventId:s.social.pendingEvent.id,response});const events=advance(s,20).events;assert.equal(r.initiations.player,0);assert.equal(r.initiations.person_1,response==='reply'?1:0);if(response==='reply'){const e=events.find(e=>e.type==='SOCIAL_CONTACT_COMPLETED');assert.equal(e.actorId,'person_1');assert.equal(e.targetId,'player');assert.equal(e.source,'incoming');}}
});
test('discovery and waiting visitor decisions cannot be bypassed by interaction commands',()=>{
 const s=quiet();assert.equal(isSociallyDiscoverable(s,'person_7'),false);assert.equal(isSociallyDiscoverable(s,'person_2'),true);send(s,{type:'CHANGE_JOB',job:'barista'});assert.equal(isSociallyDiscoverable(s,'person_7'),true);
 s.contacts=[];s.minutes=600;s.social.nextSocialOpportunityMinute=601;advance(s,1);const e=s.social.pendingEvent;assert.equal(e.type,'drop_by');const before=structuredClone(s);assert.equal(dispatch(s,{type:'SOCIAL_INTERACT',personId:e.personId}).code,'NOT_PRESENT');assert.deepEqual(s,before);send(s,{type:'RESPOND_SOCIAL_EVENT',eventId:e.id,response:'outside'});assert.equal(prepareSocial(s,{personId:e.personId}).code,undefined);
});
test('visit cooldown persists independently of last contact and has an exact boundary',()=>{
 let s=quiet();send(s,{type:'INVITE_OVER',personId:'person_1'});advance(s,1);const v=s.social.visits.person_1;assert.ok(v.nextAllowedMinute-s.minutes>=2880);assert.equal(visitEligible(s,'person_1'),false);text(s);s=validateSave(serializeSave(s));assert.deepEqual(s.social.visits.person_1,v);s.minutes=v.nextAllowedMinute-1;assert.equal(visitEligible(s,'person_1'),false);s.minutes++;assert.equal(visitEligible(s,'person_1'),true);
});
test('autonomous visitor exchanges use canonical events and actor attribution',()=>{
 const s=quiet();send(s,{type:'INVITE_OVER',personId:'person_1'});advance(s,60);const p=s.social.presences[0];p.nextInitiationMinute=s.minutes;const before=relationship(s,'player','person_1').initiations.person_1;const events=advance(s,20).events;assert.ok(events.some(e=>e.type==='SOCIAL_CONTACT_COMPLETED'&&e.source==='autonomy'&&e.initiatedBy==='person_1'));assert.equal(relationship(s,'player','person_1').initiations.person_1,before+1);
});
test('rank query is pure, contextual, complete and shares authoritative cooldown/availability checks',()=>{
 const s=quiet(),snapshot=structuredClone(s),query=(id='person_1',channel='text')=>availableSocialActions(s,{targetId:id,channel});const friend=query();assert.deepEqual(s,snapshot);assert.ok(friend.slice(0,5).some(a=>a.interactionId==='chat'));assert.equal(friend.length,19);
 const stranger=availableSocialActions(s,{targetId:'person_2',channel:'in_person'});assert.ok(stranger[0].category==='Introduction');
 const r=relationship(s,'player','person_1');r.memories.push({type:'argument',valence:-1,minute:s.minutes,intensity:20});assert.equal(query()[0].category,'Repair');for(const v of Object.values(r.toward))v.affinity=-80;assert.equal(query()[0].category,'Repair');
 r.cooldowns.apologize=s.minutes+100;assert.equal(query().find(a=>a.interactionId==='apologize').disabledReason,'SOCIAL_COOLDOWN');s.minutes=60;assert.equal(query('person_1','phone_call').find(a=>a.interactionId==='chat').disabledReason,'UNAVAILABLE');
});
test('repetition multipliers recover, histories bound, memories coalesce and casual maintenance remains useful',()=>{
 const s=quiet(),r=relationship(s,'player','person_1');for(const expected of [1,.65,.35,.15]){assert.equal(repetitionMultiplier(s,r,'chat','text'),expected);text(s);}const oldConnection=r.toward.player.connection;assert.ok(oldConnection>25);assert.equal(repetitionMultiplier(s,r,'chat','phone_call'),1);
 for(let i=0;i<60;i++)text(s,'insult');assert.equal(r.recentInteractions.length,48);assert.ok(r.memories.length<24);assert.ok(r.memories.some(m=>m.type==='insulted'&&m.count>1));advance(s,241);assert.equal(repetitionMultiplier(s,r,'insult','text'),1);
});
test('varied progression beats repeated grinding without changing tiers; new v3 fields migrate purely from v2',()=>{
 const a=quiet(),b=quiet();for(let i=0;i<12;i++){text(a,'encourage');text(b,['chat','encourage','know','advice','news','compliment'][i%6]);}assert.ok(relationship(b,'player','person_1').toward.player.affinity>relationship(a,'player','person_1').toward.player.affinity+3);
 const old=quiet();old.version=2;delete old.social.visits;delete old.social.sharedActivity;for(const r of Object.values(old.relationships))delete r.recentInteractions;const snapshot=structuredClone(old),m=validateSave(old);assert.equal(m.version,4);assert.deepEqual(old,snapshot);assert.deepEqual(m.social.visits,{});assert.deepEqual(m.relationships['person_1|player'].recentInteractions,[]);
 for(const mutate of [s=>s.social.visits.person_1={lastVisitMinute:0,nextAllowedMinute:Infinity,introduced:true},s=>s.relationships['person_1|player'].recentInteractions=Array(49).fill({})]){const s=quiet();mutate(s);assert.throws(()=>validateSave(s));}
});
