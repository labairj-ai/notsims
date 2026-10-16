import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {relationship,relationshipStatus,compatibility,dynamic,pairKey,available} from '../src/systems/social/social.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
import {pathFrom} from '../src/core/navigation.js';
const send=(s,c)=>{const result=dispatch(s,c);assert.equal(result.ok,true,JSON.stringify(result));return result;};
const contact=(s,interaction='chat',channel='text',personId='person_1')=>{send(s,{type:'SOCIAL_INTERACT',personId,interaction,channel});return advance(s,20);};
const quiet=()=>{const s=newGame({},true);s.social.nextSocialOpportunityMinute=1e8;return s;};
test('v1 migration adds deterministic roster and canonical player without changing existing progress',()=>{
 const old=JSON.parse(readFileSync(new URL('./fixtures/save-v1.json',import.meta.url))),copy=structuredClone(old),s=validateSave(old);
 assert.deepEqual(old,copy);for(const k of ['money','minutes','needs','floors','walls','furniture','job','shifts','skill'])assert.deepEqual(s[k],old[k]);
 assert.equal(s.version,3);assert.equal(s.person.id,'player');assert.equal(Object.keys(s.people).length,7);assert.deepEqual(s.contacts,['person_1']);assert.deepEqual(s,validateSave(old));assert.deepEqual(validateSave(serializeSave(s)),s);
});
test('canonical pairs, directional tiers, negative history and compatibility are separate from social need',()=>{
 const s=quiet(),r=relationship(s,'player','person_2',true);assert.equal(pairKey('player','person_2'),pairKey('person_2','player'));r.familiarity=85;
 for(const v of Object.values(r.toward))Object.assign(v,{affinity:80,trust:70,connection:90});assert.equal(relationshipStatus(r,s.minutes),'Best Friend');
 r.toward.player.affinity=-10;assert.equal(relationshipStatus(r,s.minutes),'Complicated');
 for(const v of Object.values(r.toward))Object.assign(v,{affinity:-80,trust:0});r.memories=[{valence:-1,intensity:25,minute:s.minutes}];assert.equal(relationshipStatus(r,s.minutes),'Enemy');assert.equal(relationshipStatus(r,s.minutes+5000),'Rival');
 assert.ok(compatibility({interests:['books'],trait:'creative'},s.people.person_1)>0);assert.equal(s.needs.social,85);
});
test('specific contact calls/texts, cooldowns, invalid IDs and availability reject atomically',()=>{
 const s=quiet();for(const c of [{type:'PHONE_CONTACT',personId:'missing'},{type:'PHONE_CONTACT',personId:'person_2'},{type:'SOCIAL_INTERACT',personId:'person_1',channel:'internet'},{type:'SOCIAL_INTERACT',personId:'person_1',channel:'in_person'}]){const before=structuredClone(s);assert.equal(dispatch(s,c).ok,false);assert.deepEqual(s,before);}
 s.minutes=60;const before=structuredClone(s);assert.equal(dispatch(s,{type:'PHONE_CONTACT',personId:'person_1'}).code,'UNAVAILABLE');assert.deepEqual(s,before);
 s.needs.social=20;contact(s);assert.ok(s.needs.social>20);const r=relationship(s,'player','person_1');assert.equal(r.contactCount,1);assert.equal(r.initiations.player,1);assert.ok(r.memories.some(m=>m.type==='first_met'));
 send(s,{type:'PHONE_CONTACT',personId:'person_1',channel:'text'});assert.equal(dispatch(s,{type:'PHONE_CONTACT',personId:'person_1',channel:'text'}).code,'SOCIAL_COOLDOWN');
});
test('phone friendship progresses, conflict makes rivals/enemies, repair recovers and peak history persists',()=>{
 const s=quiet();for(let i=0;i<18;i++)contact(s,['encourage','know','chat','advice','news','compliment'][i%6],'phone_call');const r=relationship(s,'player','person_1');assert.ok(['Friend','Close Friend','Best Friend'].includes(relationshipStatus(r,s.minutes)));
 const peak=r.peakTier;for(let i=0;i<36;i++){contact(s,['insult','argue','confront','disagree'][i%4],'text');advance(s,60);}assert.ok(['Uneasy','Disliked','Rival','Enemy'].includes(relationshipStatus(r,s.minutes)));assert.equal(r.peakTier,peak);assert.ok(r.memories.length<=24);
 for(let i=0;i<18;i++)contact(s,['apologize','clear','encourage'][i%3],'text');assert.ok(r.toward.player.affinity>-90);assert.ok(r.memories.some(m=>m.type==='apology_accepted'));assert.ok(['Tense','Volatile','Warm','Distant'].includes(dynamic(r)));
});
test('visits arrive visibly, accept, path adjacent for conversations and leave without overlapping actors',()=>{
 const s=quiet();send(s,{type:'INVITE_OVER',personId:'person_1'});advance(s,1);assert.equal(s.social.presences.length,1);const p=s.social.presences[0];assert.equal(p.state,'visiting');advance(s,60);assert.equal(p.path.length,0);assert.equal(Math.abs(p.x-s.person.x)+Math.abs(p.y-s.person.y),1);
 send(s,{type:'SOCIAL_INTERACT',personId:'person_1',interaction:'greet',channel:'in_person'});const result=advance(s,10);assert.ok(result.events.some(e=>e.type==='SOCIAL_CONTACT_COMPLETED'));
 send(s,{type:'ASK_GUEST_TO_LEAVE',personId:'person_1'});const count=relationship(s,'player','person_1').contactCount;assert.equal(dispatch(s,{type:'SOCIAL_INTERACT',personId:'person_1'}).code,'NOT_PRESENT');advance(s,50);assert.equal(s.social.presences.length,0);assert.equal(s.social.plans[0].status,'completed');assert.equal(relationship(s,'player','person_1').contactCount,count);
});
test('unexpected visitor accept, decline and timeout have deterministic bounded lifecycle',()=>{
 for(const response of ['invite','outside','decline','ignore']){const s=newGame({},true);s.contacts=[];s.minutes=600;s.social.nextSocialOpportunityMinute=601;const result=advance(s,1);assert.ok(result.events.some(e=>e.type==='SOCIAL_EVENT_OFFERED'));const event=s.social.pendingEvent,id=event.personId;
 if(response!=='ignore')send(s,{type:'RESPOND_SOCIAL_EVENT',eventId:event.id,response});if(response==='invite'||response==='outside'){assert.ok(s.contacts.includes(id));assert.equal(s.social.presences[0].state,'visiting');}else assert.ok(!s.contacts.includes(id)||id==='person_1');
 advance(s,180);assert.equal(s.social.pendingEvent,null);assert.equal(s.social.presences.length,0);}
});
test('planned visit survives save/load and cancellation; blocked entrances never punish relationships',()=>{
 let s=quiet();send(s,{type:'INVITE_OVER',personId:'person_1',startMinute:600});s=validateSave(serializeSave(s));advance(s,120);assert.equal(s.social.plans[0].status,'active');assert.equal(s.social.presences.length,1);
 send(s,{type:'INVITE_OVER',personId:'person_1',startMinute:900});send(s,{type:'CANCEL_SOCIAL_PLAN',planId:s.social.plans.at(-1).id});assert.equal(s.social.plans.at(-1).status,'cancelled');
 s=quiet();send(s,{type:'INVITE_OVER',personId:'person_1'});for(const [x,y] of [[8,17],[7,17],[9,17],[0,8],[17,8]])s.furniture.push({id:s.nextId++,type:'chair',x,y,rotation:0});const before=structuredClone(s.relationships);advance(s,1);assert.equal(s.social.plans[0].status,'missed');assert.deepEqual(s.relationships,before);
});
test('maintenance only drifts connection; contact restores it, reciprocity and introductions retain source',()=>{
 const s=quiet(),r=relationship(s,'player','person_1'),before=structuredClone(r);advance(s,1440);assert.equal(r.familiarity,before.familiarity);assert.equal(r.toward.player.trust,before.toward.player.trust);assert.equal(r.toward.player.affinity,before.toward.player.affinity);assert.ok(r.toward.player.connection<before.toward.player.connection);contact(s,'chat','text');assert.ok(r.toward.player.connection>before.toward.player.connection);
 send(s,{type:'REQUEST_INTRODUCTION',personId:'person_1'});assert.ok(s.contacts.includes('person_2'));assert.equal(s.social.priors[0].source,'person_1');assert.equal(s.social.priors[0].hops,1);assert.equal(relationshipStatus(relationship(s,'player','person_2')),'Stranger');assert.equal(dispatch(s,{type:'REQUEST_INTRODUCTION',personId:'person_2'}).code,'NEEDS_FRIEND');
});
test('social save validation rejects corrupt or unbounded graphs, collections and person references',()=>{
 for(const mutate of [s=>s.people.person_1.id='renamed',s=>s.contacts.push('missing'),s=>s.relationships['person_1|player'].toward.player.affinity=Infinity,s=>s.relationships['person_1|player'].memories=Array(25).fill({}),s=>s.social.rngState=-1,s=>s.social.pendingEvent={id:1,personId:'missing',type:'drop_by',expiry:100},s=>s.social.presences=Array(4).fill({}),s=>s.social.priors=[{source:'person_1',subject:'player',minute:0,expiry:10,affinity:3,hops:2}]]){const s=quiet();mutate(s);assert.throws(()=>validateSave(s));}
});
test('navigation starts from arbitrary actor and avoids visitors; queued departing conversation rejects cleanly',()=>{
 const s=quiet();assert.deepEqual(pathFrom(s,0,0,1,0),[[1,0]]);send(s,{type:'INVITE_OVER',personId:'person_1'});advance(s,1);const p=s.social.presences[0];send(s,{type:'SOCIAL_INTERACT',personId:'person_1'});assert.ok(pathFrom(s,0,0,p.x,p.y)===null);send(s,{type:'ASK_GUEST_TO_LEAVE',personId:'person_1'});assert.ok(advance(s,1).events.some(e=>e.type==='ACTION_REJECTED'));assert.equal(s.activity,null);
});
test('incoming text/call offers can be answered, declined or expire without forced contact',()=>{
 for(const type of ['text','phone_call'])for(const response of ['reply','decline','expire']){const s=quiet();s.social.pendingEvent={id:s.social.nextId++,personId:'person_1',type,expiry:s.minutes+15};const before=relationship(s,'player','person_1').contactCount;
 if(response==='expire')advance(s,20);else{send(s,{type:'RESPOND_SOCIAL_EVENT',eventId:s.social.pendingEvent.id,response});advance(s,20);}assert.equal(s.social.pendingEvent,null);assert.equal(relationship(s,'player','person_1').contactCount,before+(response==='reply'?1:0));assert.deepEqual(validateSave(serializeSave(s)).social,s.social);}
});
test('inherited property names are never valid social commands and failed calls preserve state',()=>{
 const s=quiet();for(const personId of ['__proto__','constructor','toString']){const before=structuredClone(s);assert.equal(dispatch(s,{type:'PHONE_CONTACT',personId,channel:'text'}).ok,false);assert.deepEqual(s,before);}for(const interaction of ['__proto__','constructor'])assert.equal(dispatch(s,{type:'PHONE_CONTACT',personId:'person_1',interaction,channel:'text'}).ok,false);
});
