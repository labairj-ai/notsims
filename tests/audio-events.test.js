import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolveAudioCues} from '../src/audio/audio-cue-resolver.js';
import {AudioEventSubscriber} from '../src/audio/audio-event-subscriber.js';
import {AudioManager} from '../src/audio/audio-manager.js';
import {FakeAudioBackend,flush} from './helpers/fake-audio.js';
import {dispatch,advance} from '../src/game/dispatch.js';
import {newGame} from '../src/game/session.js';

test('resolver maps every first-wave family and chooses promotion without duplicate paycheck cues',()=>{
 for(const [event,cue] of [[{type:'UI_SELECT'},'ui.select'],[{type:'UI_ERROR'},'ui.error'],[{type:'UI_ROTATE'},'ui.rotate'],[{type:'TILE_EDITED'},'build.floor.place'],[{type:'EDGE_EDITED',tool:'door'},'build.door.place'],[{type:'ROOM_BUILT'},'build.wall.place'],[{type:'FURNITURE_PLACED'},'object.place'],[{type:'FURNITURE_SOLD'},'object.sell'],[{type:'MONEY_SPENT',reason:'meal'},'economy.purchase'],[{type:'BILL_CHARGED'},'economy.bill'],[{type:'SHIFT_COMPLETED',shifts:3},'career.promotion'],[{type:'SHIFT_COMPLETED',shifts:2},'career.shift.complete'],[{type:'ACTION_CANCELLED'},'ui.cancel'],[{type:'ACTION_REJECTED'},'ui.error']])assert.deepEqual(resolveAudioCues(event),[cue]);
});
test('rejected commands never resolve success cues and bursty builds are coalesced without backlog',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),subscriber=new AudioEventSubscriber(manager);await manager.unlock();
 assert.deepEqual(subscriber.receive({ok:false,events:[{type:'FURNITURE_PLACED'}]}),['ui.error']);
 assert.deepEqual(subscriber.receive({ok:true,events:[{type:'TILE_EDITED'},{type:'TILE_EDITED'},{type:'EDGE_EDITED'}]}),['build.floor.place']);
 assert.deepEqual(subscriber.receive({ok:true,events:[{type:'ROOM_BUILT'}]}),[]);manager.suspend();assert.deepEqual(subscriber.receive({ok:true,events:[{type:'BILL_CHARGED'}]}),[]);await flush();
});
test('audio-enabled command and time outputs exactly match audio-disabled simulation, with no domain audio dependency',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),subscriber=new AudioEventSubscriber(manager);await manager.unlock();
 const a=newGame(),b=structuredClone(a);
 for(const c of [{type:'CHANGE_JOB',job:'barista'},{type:'START_SHIFT'}]){const enabled=dispatch(a,c),disabled=dispatch(b,c);subscriber.receive(enabled);assert.deepEqual(enabled,disabled);}
 const enabled=advance(a,360),disabled=advance(b,360);subscriber.receive(enabled);assert.deepEqual(enabled,disabled);assert.equal(JSON.stringify(a),JSON.stringify(b));assert.ok(!JSON.stringify(a).includes('audio'));
 for(const dir of ['src/core','src/content','src/systems','src/game','src/persistence'])scan(dir);
 function scan(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())scan(path);else if(path.endsWith('.js'))assert.doesNotMatch(readFileSync(path,'utf8'),/from\s*['"][^'"]*\/audio\//,path);}}
 manager.dispose();
});
