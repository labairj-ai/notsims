import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,tick} from '../src/game/session.js';
import {changeNeed} from '../src/systems/needs/needs.js';
import {recoveryFactor} from '../src/systems/character/traits.js';
import {mood} from '../src/systems/needs/mood.js';

test('needs clamp, traits retain semantics and mood thresholds remain strict',()=>{
 const s=newGame();changeNeed(s,'energy',500);assert.equal(s.needs.energy,100);changeNeed(s,'energy',-600);assert.equal(s.needs.energy,0);
 assert.equal(recoveryFactor('creative',true),1.2);assert.equal(recoveryFactor('creative',false),1);
 for(const [v,label] of [[76,'Feeling lovely'],[75,'Doing alright'],[50,'Could use some care'],[25,'Needs a little love']]){for(const n of Object.keys(s.needs))s.needs[n]=v;assert.equal(mood(s),label);}
 for(const trait of ['creative','active','social']){const a=newGame({trait}),b=structuredClone(a);tick(a,600);for(let i=0;i<600;i++)tick(b,1);assert.deepEqual(a,b);}
});
