import {TRAITS} from '../../content/traits.js';
export const decayFactor=(trait,need)=>TRAITS[trait]?.decay?.[need]??1;
export const recoveryFactor=(trait,skill)=>skill?(TRAITS[trait]?.skillRecovery??1):1;
