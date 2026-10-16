import {clamp} from './support.js';
export function compatibility(a,b){const overlap=(a.interests||[]).filter(v=>b.interests?.includes(v)).length;return clamp(overlap*.18+(a.trait===b.trait? .15:0)+(a.socialStyle===b.socialStyle? .1:0),0,.6);}
