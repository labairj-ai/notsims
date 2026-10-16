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
