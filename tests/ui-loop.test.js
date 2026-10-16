import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameLoop} from '../src/ui/game-loop.js';
import {importSaveFile,loadStored} from '../src/ui/persistence-controller.js';

test('frame loop clamps delta, applies speed, pauses simulation and resets after visibility changes',()=>{
 let paused=false,hidden=false,draws=0,previews=0,refreshes=0;const advances=[];
 const loop=createGameLoop({now:0,paused:()=>paused,hidden:()=>hidden,speed:()=>8,advance:n=>advances.push(n),draw:()=>draws++,preview:()=>previews++,refresh:()=>refreshes++,schedule:()=>{}});
 loop.frame(1000);assert.deepEqual(advances,[2]);paused=true;loop.frame(2000);hidden=true;paused=false;loop.frame(3000);assert.deepEqual(advances,[2]);assert.equal(draws,3);assert.equal(previews,3);assert.equal(refreshes,3);
 hidden=false;loop.reset(10000);loop.frame(10010);assert.equal(advances[1],.08);
});
test('persistence adapters reject oversized files before reading and never rewrite failed loads',()=>{
 assert.throws(()=>importSaveFile({size:2_000_001,text:()=>{throw Error('must not read');}}),/too large/);
 assert.throws(()=>loadStored({getItem:()=>'{bad',setItem:()=>{throw Error('must not write');}}));
});
