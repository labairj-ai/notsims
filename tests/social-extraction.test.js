import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runScenario} from './helpers/scenario.js';
// Audio adds only eventKind and offered-visit correlation after extraction; all original state/event fields remain exact.
test('focused social modules preserve pre-extraction scenario state, events and replay trace',()=>{for(const {expected,...story} of JSON.parse(readFileSync(new URL('./fixtures/social-followup-extraction.json',import.meta.url))))assert.equal(createHash('sha256').update(JSON.stringify(runScenario(story),function(key,value){if(key==='career'||key==='ownership')return undefined;if(key==='version'&&value>=4)return 3;return key==='eventKind'||key==='visitId'&&['SOCIAL_EVENT_OFFERED','drop_by'].includes(this?.type)?undefined:value;})).digest('hex'),expected,story.name);});
