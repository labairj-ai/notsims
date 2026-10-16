import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioManager} from '../src/audio/audio-manager.js';
import {FakeAudioBackend,flush} from './helpers/fake-audio.js';

test('audio stays locked until a gesture, preloads only tiny SFX, and preserves mixer values across mute',async()=>{
 const backend=new FakeAudioBackend(),m=new AudioManager({backend});assert.equal(m.playCue('ui.select'),null);assert.deepEqual(backend.loaded,[]);
 await m.unlock();await flush();assert.ok(backend.loaded.length>0);assert.ok(!backend.loaded.some(id=>['little-morning','clover-walk','porch-light'].includes(id)));
 m.setBusGain('music',.42);m.mute(true);assert.equal(backend.gains.master,0);assert.equal(m.settings.music,.42);m.mute(false);assert.equal(backend.gains.music,.42);assert.equal(backend.gains.master,.7);
 assert.equal(m.playCue('unknown'),null);m.dispose();assert.equal(await m.unlock(),false);
});
test('cooldowns, cue polyphony and global voice budget include pending decodes',async()=>{
 const backend=new FakeAudioBackend(),m=new AudioManager({backend,maxVoices:2,random:()=>.99});await m.unlock();
 assert.ok(m.playCue('movement.footstep.indoor'));assert.equal(m.playCue('movement.footstep.indoor'),null);backend.time=1;assert.equal(m.playCue('movement.footstep.indoor'),null);
 assert.ok(m.playCue('ui.confirm'));assert.equal(m.playCue('ui.cancel'),null);await flush();assert.equal(backend.active.size,2);
 const call=backend.calls.find(c=>c.id==='step-indoor-2');assert.ok(call.rate>=.975&&call.rate<=1.025);
 m.stopAll();assert.equal(backend.active.size,0);assert.equal(m.voices.size,0);
});
test('loop handles cannot stop another owner and cancellation before decode never starts stale sound',async()=>{
 const backend=new FakeAudioBackend(),m=new AudioManager({backend});await m.unlock();
 const a=m.startLoop('interaction.shower.loop'),b=m.startLoop('interaction.tv.loop');await flush();m.stopLoop(a);assert.equal(m.voices.has(b),true);assert.equal(backend.active.size,1);
 m.suspend();assert.equal(backend.active.size,0);assert.equal(m.playCue('ui.select'),null);m.resume();
 let resolve;backend.delay=new Promise(r=>resolve=r);const pending=m.startLoop('interaction.stove.loop');await flush();m.stopLoop(pending);resolve();await flush();assert.equal(backend.active.size,0);assert.equal(m.voices.size,0);
});
test('unavailable and corrupt audio never throw into gameplay or leave active handles',async()=>{
 const backend=new FakeAudioBackend(),m=new AudioManager({backend});backend.available=false;assert.equal(await m.unlock(),false);backend.available=true;await m.unlock();await flush();backend.decodeFails=true;
 m.playCue('ui.confirm');await flush();assert.equal(m.voices.size,0);assert.ok(m.diagnostics.some(d=>d.message==='decode failed'));m.dispose();
});
