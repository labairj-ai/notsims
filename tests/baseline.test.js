import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as current from '../src/engine.js';
const source=readFileSync(new URL('./fixtures/engine-baseline.txt',import.meta.url),'utf8');
const legacy=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('extracted systems exactly match frozen engine across traits, careers, actions, building and load',()=>{
 for(const trait of ['creative','active','social'])for(const job of current.JOBS){
  const a=legacy.newGame({trait}),b=current.newGame({trait});a.job=b.job=job.id;
  for(const command of [{kind:'use',id:2},{kind:'work'},{kind:'chat'},{kind:'nap'},{kind:'snack'},{kind:'stretch'}]){assert.equal(legacy.enqueue(a,command),current.enqueue(b,command));legacy.tick(a,600);current.tick(b,600);assert.deepEqual(b,a);}
  for(const [method,args] of [['buildTile',['floor',0,0,'h:0,0']],['room',[0,0,2,2]],['buy',['chair',1,1]],['buildTile',['erase',1,1,'h:1,1']],['buildTile',['door',0,0,'h:0,0']]]){assert.equal(current[method](b,...args),legacy[method](a,...args));assert.deepEqual(b,a);}
  assert.deepEqual(current.validateSave(JSON.stringify(b)),legacy.validateSave(JSON.stringify(a)));
 }
});
