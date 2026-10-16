import {SOCIAL_LIMITS,SOCIAL_TUNING} from '../../content/social.js';
import {pairKey} from './relationships.js';
import {clamp} from './support.js';
import {emit} from '../../core/events.js';

export function memory(s,r,type,actor,target,valence,intensity,events){const existing=r.memories.findLast(m=>m.type===type&&m.actor===actor&&m.target===target&&s.minutes-m.minute<SOCIAL_TUNING.memoryWindow);if(existing){existing.count=Math.min(99,(existing.count||1)+1);existing.intensity=clamp(Math.max(existing.intensity,intensity)+(valence<0?1:0));if(existing.expiry)existing.expiry=s.minutes+4320;emit(events,'SOCIAL_MEMORY_UPDATED',{pair:pairKey(r.a,r.b),memory:{...existing}});return;}const m={count:1,type,minute:s.minutes,actor,target,valence,intensity,tags:valence<0?['conflict']:['connection'],...(valence<0?{expiry:s.minutes+4320}:{})};r.memories.push(m);r.memories=r.memories.slice(-SOCIAL_LIMITS.memories);emit(events,'SOCIAL_MEMORY_ADDED',{pair:pairKey(r.a,r.b),memory:m});}
