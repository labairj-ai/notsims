import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio/audio-manager.js';
import {MusicDirector} from '../src/audio/music-director.js';
import {FakeAudioBackend,flush} from './helpers/fake-audio.js';

test('music unlocks, crossfades between states, avoids repeats, ignores panels and limits pending streams',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),timers=new Map();let id=0;
 const director=new MusicDirector(manager,{schedule:fn=>{timers.set(++id,fn);return id;},unschedule:key=>timers.delete(key),random:()=>0});
 director.update({});assert.equal(backend.music.size,0);await manager.unlock();director.update({});await flush();assert.equal(director.debug().track,'little-morning');
 director.update({started:true,minutes:480});await flush();assert.equal(director.debug().track,'clover-walk');assert.equal(backend.music.size,2);for(const fn of [...timers.values()])fn();timers.clear();assert.equal(backend.music.size,1);
 backend.time=39;director.update({started:true,minutes:481});await flush();assert.equal(director.debug().track,'little-morning');
 const calls=backend.calls.length;for(let i=0;i<100;i++)director.update({started:true,minutes:481,tab:'build'});assert.equal(backend.calls.length,calls);
 for(const minutes of [1200,480,1300,480,1300])director.update({started:true,minutes});await flush();assert.ok(backend.music.size<=2);director.stop();assert.equal(backend.music.size,0);assert.equal(timers.size,0);director.dispose();manager.dispose();
});
test('music failure, hidden-tab, mute and disposal leave no orphaned media or retry storm',async()=>{
 const backend=new FakeAudioBackend(),manager=new AudioManager({backend}),director=new MusicDirector(manager);await manager.unlock();backend.musicFails=true;director.update({});await flush();assert.equal(backend.music.size,0);
 const count=backend.calls.length;for(let i=0;i<100;i++)director.update({});assert.equal(backend.calls.length,count);
 backend.musicFails=false;backend.time=11;director.update({});await flush();assert.equal(backend.music.size,1);manager.suspend();director.update({hidden:true});assert.equal(backend.music.size,0);manager.resume();director.update({});await flush();assert.equal(backend.music.size,1);
 manager.mute();director.update({});assert.equal(backend.music.size,0);director.dispose();manager.dispose();
});
