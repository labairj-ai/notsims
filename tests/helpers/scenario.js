import assert from 'node:assert/strict';
import {newGame} from '../../src/game/session.js';
import {dispatch,advance} from '../../src/game/dispatch.js';
import {validateSave} from '../../src/persistence/save.js';
import {createRng} from '../../src/core/rng.js';

export function runScenario({name='scenario',initial,character={},empty=false,seed=0,steps=[]}){
 const state=initial?validateSave(initial):newGame(character,empty),rng=createRng(seed);
 const trace={version:1,name,seed,initial:structuredClone(state),steps:[]};
 const events=[];
 for(const [index,step] of steps.entries()){
  try{
   let result;
   if(step.command)result=dispatch(state,structuredClone(step.command));
   else if(step.advance!==undefined){
    assert.ok(Number.isFinite(step.advance)&&step.advance>=0,'advance must be finite and nonnegative');
    const chunk=step.chunk??1440;assert.ok(Number.isFinite(chunk)&&chunk>0,'chunk must be positive');
    const emitted=[];for(let remaining=step.advance;remaining>0;){const dt=Math.min(1440,chunk,remaining);remaining-=dt;emitted.push(...advance(state,dt).events);}result={ok:true,code:'OK',events:emitted};
   }else result={ok:true,code:'OK',events:[]};
   if(step.expectCode)assert.equal(result.code,step.expectCode);
   else assert.equal(result.ok,true,JSON.stringify(result));
   if(step.expectEvents)assert.deepEqual(result.events.map(e=>e.type),step.expectEvents);
   step.assert?.({state,result,events:[...events,...result.events],rng});
   events.push(...result.events);
   trace.steps.push({... (step.command?{command:step.command}:step.advance!==undefined?{advance:step.advance,chunk:step.chunk??1440}:{}),result:structuredClone(result)});
  }catch(error){throw new Error(`${name}: step ${index+1} ${JSON.stringify(step.command??{advance:step.advance})}: ${error.message}`,{cause:error});}
 }
 return {state,canonical:validateSave(state),events,trace,rngState:rng.state};
}
export function replay(trace){assert.equal(trace.version,1);return runScenario({name:trace.name,seed:trace.seed,initial:trace.initial,steps:trace.steps.map(({result,...step})=>({...step,expectCode:result.code,assert:({result:actual})=>assert.deepEqual(actual,result)}))});}
