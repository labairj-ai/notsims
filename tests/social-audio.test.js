import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio/audio-manager.js';
import {AudioEventSubscriber} from '../src/audio/audio-event-subscriber.js';
import {resolveAudioCues} from '../src/audio/audio-cue-resolver.js';
import {FakeAudioBackend,flush} from './helpers/fake-audio.js';
import {newGame} from '../src/game/session.js';
import {dispatch,advance} from '../src/game/dispatch.js';
const offered={type:'SOCIAL_EVENT_OFFERED',id:17,eventKind:'phone_call',personId:'person_1'};
test('semantic social resolver maps text, calls, deduplicated visits and positive milestones',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),sub=new AudioEventSubscriber(manager);await manager.unlock();await flush();assert.deepEqual(resolveAudioCues({type:'SOCIAL_NOTIFICATION',notificationType:'text'}),['social.phone.text']);assert.deepEqual(resolveAudioCues(offered),['social.phone.ring']);assert.deepEqual(resolveAudioCues({type:'RELATIONSHIP_STATUS_CHANGED',after:'Enemy'}),[]);
 assert.deepEqual(sub.receive({ok:true,events:[{type:'VISIT_ARRIVED',visitId:1},{type:'SOCIAL_EVENT_OFFERED',id:2,eventKind:'drop_by'}]}),['social.door.knock']);await flush();assert.equal(backend.calls.filter(c=>c.id==='social-knock').length,1);backend.time=3;assert.deepEqual(sub.receive({ok:true,events:[{type:'SOCIAL_EVENT_OFFERED',id:2,eventKind:'drop_by',visitId:1}]}),[]);backend.time=0;assert.deepEqual(sub.receive({ok:true,events:Array(20).fill({type:'VISIT_ARRIVED'})}),[]);manager.dispose();
});
test('bounded ringtone stops on answer, decline, expiry, state replacement, hide and mute',async()=>{
 for(const reason of ['answer','decline','expire','reset','state','hidden','mute']){const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),sub=new AudioEventSubscriber(manager);await manager.unlock();sub.receive({ok:true,events:[offered]});await flush();assert.equal(manager.voices.size,1);
 if(['answer','decline','expire'].includes(reason))sub.receive({ok:true,events:[{type:reason==='expire'?'SOCIAL_EVENT_EXPIRED':'SOCIAL_EVENT_RESPONDED',eventId:17,response:reason}]});
 if(reason==='reset')sub.reset();if(reason==='state')sub.frame({social:{pendingEvent:null}});if(reason==='hidden'){manager.suspend();sub.frame({social:{pendingEvent:{id:17}}});}if(reason==='mute'){manager.mute();sub.frame({social:{pendingEvent:{id:17}}});}assert.equal(manager.voices.size,0);assert.equal(sub.ringToken,null);manager.dispose();}
});
test('audio-disabled social gameplay has identical persistent state and unavailable audio never changes effects',async()=>{
 const a=newGame(),b=structuredClone(a),backend=new FakeAudioBackend(),manager=new AudioManager({backend}),sub=new AudioEventSubscriber(manager);await manager.unlock();manager.mute();for(const s of [a,b]){const c=dispatch(s,{type:'PHONE_CONTACT',personId:'person_1',channel:'text'});if(s===a)sub.receive(c);const r=advance(s,20);if(s===a)sub.receive(r);}assert.deepEqual(a,b);assert.equal(backend.calls.filter(c=>c.id).length,0);manager.dispose();
});
