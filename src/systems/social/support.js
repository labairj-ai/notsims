import {SOCIAL_LIMITS} from '../../content/social.js';
import {createRng} from '../../core/rng.js';
import {log} from '../../core/log.js';
import {emit} from '../../core/events.js';

export const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export function random(s){const rng=createRng(s.social.rngState),n=rng.next();s.social.rngState=rng.state;return n;}
export function notify(s,text,events,type='text',personId=null){const n={id:s.social.nextId++,minute:s.minutes,text,type,personId};s.social.notifications.push(n);s.social.notifications=s.social.notifications.slice(-SOCIAL_LIMITS.notifications);log(s,text);emit(events,'SOCIAL_NOTIFICATION',{...n,notificationType:type});}
