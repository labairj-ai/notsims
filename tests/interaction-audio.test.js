import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio/audio-manager.js';
import {InteractionAudio} from '../src/audio/interaction-audio.js';
import {FakeAudioBackend,flush} from './helpers/fake-audio.js';
import {newGame} from '../src/game/session.js';

test('interaction loops wait for arrival and stop on cancel, pause, deletion, reset and teardown',async()=>{
 for(const type of ['shower','stove','tv','desk']){
  const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),adapter=new InteractionAudio(manager);await manager.unlock();const state=newGame();const f=state.furniture.find(f=>f.type===type)??{id:99,type,x:0,y:0};if(!state.furniture.includes(f))state.furniture.push(f);
  state.activity={kind:'use',id:f.id,path:[[1,1]]};adapter.frame(state);assert.equal(adapter.active,null);state.activity.path=[];adapter.frame(state);await flush();assert.equal(manager.debug().loops.length,1);
  adapter.receive({events:[{type:'ACTION_CANCELLED'}]});assert.equal(manager.debug().loops.length,0);
  adapter.frame(state);adapter.frame(state,{paused:true});assert.equal(manager.debug().loops.length,0);
  adapter.frame(state);state.furniture=[];adapter.frame(state);assert.equal(manager.debug().loops.length,0);
  adapter.reset();manager.dispose();assert.equal(backend.active.size,0);
 }
});
test('visible movement bounds footsteps by wall time at every simulation speed and handles hidden tabs',async()=>{
 for(const speed of [1,3,8]){const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),adapter=new InteractionAudio(manager);await manager.unlock();const state=newGame({},true);state.activity={kind:'walk',path:[[9,10]],walkClock:0};
  for(let frame=0;frame<120;frame++){backend.time=frame/60;state.activity.walkClock=(frame/60*speed)%2;adapter.frame(state);await flush();for(const v of [...backend.active])v.stop();}
  const steps=backend.calls.filter(c=>c.id?.startsWith('step-'));assert.ok(steps.length>0);assert.ok(steps.length<=5,`speed ${speed}: ${steps.length}`);assert.ok(steps.every(c=>c.id.startsWith('step-outdoor')));
  adapter.frame(state,{hidden:true});assert.equal(adapter.lastPosition,null);manager.dispose();
 }
});

test('footstep surface metadata selects indoor variants over existing floors',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),adapter=new InteractionAudio(manager);await manager.unlock();const state=newGame();state.activity={kind:'walk',path:[[9,10]],walkClock:0};adapter.frame(state);state.activity.walkClock=1;backend.time=1;adapter.frame(state);await flush();assert.ok(backend.calls.some(c=>c.id?.startsWith('step-indoor')));manager.dispose();
});

test('fridge eating detail follows reach/contact once without duplicate start or completion cues',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),adapter=new InteractionAudio(manager);await manager.unlock();const s=newGame(),f=s.furniture.find(f=>f.type==='fridge');s.activity={kind:'use',id:f.id,path:[],elapsed:.1,total:35};adapter.frame(s);await flush();assert.ok(!backend.calls.some(c=>c.id==='eat'));s.activity.elapsed=2;adapter.frame(s);await flush();adapter.frame(s);await flush();assert.equal(backend.calls.filter(c=>c.id==='eat').length,1);manager.dispose();
});
