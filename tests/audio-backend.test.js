import test from 'node:test';
import assert from 'node:assert/strict';
import {WebAudioBackend} from '../src/audio/web-audio-backend.js';

test('backend caches short buffers and enforces decoded-memory budget after resampling',async()=>{
 let decodes=0;const backend=new WebAudioBackend({fetcher:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)})});
 backend.context={decodeAudioData:async()=>{decodes++;return {length:100,numberOfChannels:1};}};backend.maxDecodedBytes=500;
 const asset={id:'small',src:'assets/audio/sfx/ui/select.wav'};await backend.load(asset);await backend.load(asset);assert.equal(decodes,1);assert.equal(backend.decodedBytes,400);
 await assert.rejects(backend.load({...asset,id:'too-many'}),/memory budget/);assert.equal(backend.decodedBytes,400);
});
test('backend discards in-flight decode results after disposal',async()=>{
 let finish;const backend=new WebAudioBackend({fetcher:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)})});backend.context={decodeAudioData:()=>new Promise(r=>finish=r),close:async()=>{}};
 const load=backend.load({id:'pending',src:'assets/audio/sfx/ui/select.wav'});await new Promise(r=>setImmediate(r));backend.dispose();finish({length:100,numberOfChannels:1});await assert.rejects(load,/disposed/);assert.equal(backend.decodedBytes,0);assert.equal(backend.buffers.size,0);
});
test('intentional media stop cancels a pending play without reporting a playback failure',async()=>{
 for(const stop of [true,false]){let rejectPlay;const element={play:()=>new Promise((_resolve,reject)=>rejectPlay=reject),pause(){},removeAttribute(){},load(){}},node=()=>({connect(){},disconnect(){},gain:{value:0}}),backend=new WebAudioBackend({mediaFactory:()=>element});backend.context={createMediaElementSource:node,createGain:node};backend.buses.music=node();const voice=backend.startMusic({src:'assets/audio/music/little-morning.mp3',loopable:true});if(stop)voice.stop();rejectPlay(Error('play interrupted'));if(stop)assert.equal(await voice.ready,false);else await assert.rejects(voice.ready,/play interrupted/);assert.equal(backend.media.size,0);}
});
