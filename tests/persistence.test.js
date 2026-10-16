import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSave,serializeSave,MAX_SAVE_BYTES} from '../src/persistence/save.js';
import {migrateSave} from '../src/persistence/migrations/index.js';
import {validateState} from '../src/persistence/schema.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/save-v1.json',import.meta.url)));

test('frozen v1 fixture loads, resumes canonical work and rebuilds IDs without mutating input',()=>{
 const input=structuredClone(fixture),s=validateSave(input);assert.deepEqual(input,fixture);assert.equal(s.activity.kind,'work');assert.equal(s.activity.elapsed,30);assert.equal(s.activity.pay,132);assert.equal(s.activity.total,360);assert.deepEqual(s.activity.path,[]);assert.deepEqual(s.queue,[]);assert.equal(s.nextId,14);
 assert.deepEqual(validateSave(serializeSave(s)),s);const other=structuredClone(fixture);other.activity={kind:'nap'};assert.equal(validateSave(other).activity,null);
});
test('ordered pure migrations reject missing steps, bad results, corruption and future saves',()=>{
 const registry=new Map([[1,s=>({...s,version:2,marker:1})],[2,s=>({...s,version:3,marker:s.marker+1})]]);
 const before=structuredClone(fixture);const migrated=migrateSave(fixture,{currentVersion:3,migrations:registry});assert.equal(migrated.marker,2);assert.deepEqual(fixture,before);
 assert.throws(()=>migrateSave(fixture,{currentVersion:3}),/Missing/);
 assert.throws(()=>migrateSave(fixture,{currentVersion:2,migrations:new Map([[1,s=>s]])}),/Invalid/);
 assert.throws(()=>validateState({...migrateSave(fixture),needs:{hunger:-1}}));
 for(const raw of ['{bad',JSON.stringify({...fixture,version:99}),JSON.stringify({...fixture,money:null}),' '.repeat(MAX_SAVE_BYTES+1)])assert.throws(()=>validateSave(raw));
});
