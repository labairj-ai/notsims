import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateAudio,AUDIO_BUDGET} from '../scripts/check-audio.mjs';
import {AUDIO_CUES,INTERACTION_AUDIO} from '../src/audio/audio-cues.js';
import {AUDIO_ASSETS} from '../src/audio/audio-library.js';
import {INTERACTION_IDS} from '../src/content/interactions.js';
import {CATALOG} from '../src/content/furniture.js';
import {resolveAudioCues} from '../src/audio/audio-cue-resolver.js';

test('all local assets have provenance, valid formats, bounded payload and canonical manifest metadata',async()=>{
 const report=await validateAudio();assert.ok(report.totalBytes<AUDIO_BUDGET.totalMax);assert.ok(report.essentialBytes<AUDIO_BUDGET.essentialMax);assert.ok(report.estimatedDecodedSfxBytes<AUDIO_BUDGET.decodedSfxMax);
 const library=JSON.parse(await readFile(new URL('../assets/audio/library.json',import.meta.url),'utf8'));assert.deepEqual(Object.fromEntries(library.assets.map(a=>[a.id,a])),AUDIO_ASSETS);
 for(const f of CATALOG){const id=INTERACTION_IDS[f.id];assert.ok(id?INTERACTION_AUDIO[id]:INTERACTION_AUDIO[f.id]?.decision);}
 assert.deepEqual(resolveAudioCues({type:'FUTURE_EVENT'}),[]);assert.deepEqual(resolveAudioCues(null),[]);
});
test('invalid cue IDs, buses, source files and missing provenance fail asset validation usefully',async()=>{
 await assert.rejects(validateAudio('.',{cues:[...AUDIO_CUES,AUDIO_CUES[0]]}),/Duplicate audio cue/);
 await assert.rejects(validateAudio('.',{cues:[{...AUDIO_CUES[0],bus:'fake'}]}),/Unknown audio bus/);
 await assert.rejects(validateAudio('.',{cues:[{...AUDIO_CUES[0],sources:['missing']}]}),/Unknown audio asset/);
 const assets=structuredClone(AUDIO_ASSETS);assets.select.src='assets/audio/missing.wav';await assert.rejects(validateAudio('.',{assets}),/Missing audio file/);
 const noLicense=structuredClone(AUDIO_ASSETS);delete noLicense.select.license;await assert.rejects(validateAudio('.',{assets:noLicense}),/Missing provenance license/);
});
