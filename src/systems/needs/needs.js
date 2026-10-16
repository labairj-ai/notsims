import {NEEDS,NEED_DECAY} from '../../content/needs.js';
import {clamp} from '../../core/math.js';
import {decayFactor,recoveryFactor} from '../character/traits.js';
export const initialNeeds=()=>Object.fromEntries(Object.keys(NEEDS).map(n=>[n,85]));
export function decayNeeds(s,step){for(const n of Object.keys(NEEDS))s.needs[n]=clamp(s.needs[n]-NEED_DECAY[n]*step*decayFactor(s.person.trait,n));}
export function changeNeed(s,need,amount){s.needs[need]=clamp(s.needs[need]+amount);}
export function recoverNeed(s,a,step){if(a.need)changeNeed(s,a.need,a.rate*step*recoveryFactor(s.person.trait,a.skill));}
