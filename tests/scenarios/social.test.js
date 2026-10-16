import test from 'node:test';
import assert from 'node:assert/strict';
import {runScenario,replay} from '../helpers/scenario.js';
import {newGame} from '../../src/game/session.js';
import {advance,dispatch} from '../../src/game/dispatch.js';
import {validateSave,serializeSave} from '../../src/persistence/save.js';
import {relationship,relationshipStatus} from '../../src/systems/social/social.js';

test('seeded social story: introduction, maintenance, plans, drift and reconnect replay with identical facts',()=>{
 const initial=newGame({},true);initial.social.rngState=42;initial.social.nextSocialOpportunityMinute=1e8;
 const steps=[{command:{type:'REQUEST_INTRODUCTION',personId:'person_1'}}];
 for(let i=0;i<10;i++)steps.push({command:{type:'PHONE_CONTACT',personId:'person_2',channel:'text',interaction:i%2?'encourage':'joke'}},{advance:20});
 steps.push({command:{type:'INVITE_OVER',personId:'person_2',startMinute:1080}},{advance:400},{advance:180},{command:{type:'PHONE_CONTACT',personId:'person_1',channel:'text',interaction:'chat'}},{advance:20});
 const a=runScenario({name:'social story',initial,seed:42,steps}),b=replay(a.trace),c=runScenario({initial,steps:steps.map(s=>s.advance?{...s,chunk:1}:s)});
 assert.deepEqual(a.state,b.state);assert.deepEqual(a.state,c.state);assert.deepEqual(a.events,c.events);assert.ok(a.events.some(e=>e.type==='VISIT_STARTED'));assert.ok(a.events.some(e=>e.type==='VISIT_ENDED'));
 assert.ok(a.events.some(e=>e.type==='SOCIAL_CONTACT_COMPLETED'));assert.ok(a.state.contacts.includes('person_2'));assert.notEqual(relationshipStatus(relationship(a.state,'player','person_2')),'Stranger');
});
test('scheduler and RNG resume exactly across save/load over multiple in-game days',()=>{
 const a=newGame({},true);a.social.rngState=932;const b=validateSave(serializeSave(a));advance(a,900);advance(b,900);assert.deepEqual(a,b);
 const c=validateSave(serializeSave(b));for(let i=0;i<8;i++){advance(a,720);advance(c,720);assert.deepEqual(a,c);}assert.ok(a.social.eventCounter>10);assert.ok(a.social.notifications.length<=16);assert.ok(a.social.presences.length<=3);
});
test('welcomed neighbor can be met and history survives a save round trip',()=>{
 const s=newGame({},true);s.contacts=[];s.minutes=600;s.social.nextSocialOpportunityMinute=601;advance(s,1);const e=s.social.pendingEvent;
 assert.equal(dispatch(s,{type:'RESPOND_SOCIAL_EVENT',eventId:e.id,response:'invite'}).ok,true);advance(s,60);
 assert.equal(dispatch(s,{type:'SOCIAL_INTERACT',personId:e.personId,interaction:'interests',channel:'in_person'}).ok,true);advance(s,20);
 const loaded=validateSave(serializeSave(s));assert.deepEqual(loaded.relationships,s.relationships);assert.ok(loaded.contacts.includes(e.personId));assert.ok(relationship(loaded,'player',e.personId).contactCount>0);
});
