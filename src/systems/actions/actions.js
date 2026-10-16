import {prepareSocial,completeSocial} from '../social/social.js';
import {emit} from '../../core/events.js';
import {pathTo,blocked} from '../../core/navigation.js';
import {interactionTargets} from '../objects/geometry.js';
import {resolveInteraction} from './interactions.js';
import {QUICK_ACTIONS} from '../../content/interactions.js';
import {changeFunds} from '../economy/economy.js';
import {startShift,completeShift} from '../careers/careers.js';
import {practice} from '../careers/progression.js';
import {recoverNeed,changeNeed} from '../needs/needs.js';
import {log} from '../../core/log.js';
export function begin(s,a,events){
 if(a.kind==='social'){const result=prepareSocial(s,{...a,type:'SOCIAL_INTERACT'});if(result.code)return result.code;s.activity=result.action;return;}
 if(a.kind==='walk'){const path=pathTo(s,a.x,a.y);if(path===null){log(s,'That spot is blocked. Try adding a door or clearing a path.');return 'UNREACHABLE';}s.activity={...a,path,label:'Taking a little walk',elapsed:0,total:Math.max(1,path.length*2)};return;}
 if(a.kind==='use'){
 const f=s.furniture.find(f=>f.id===a.id);if(!f)return 'INVALID_TARGET';const d=resolveInteraction(f,a.interaction);if(!d)return 'INVALID_TARGET';
 if(s.money<(d.cost||0)){log(s,'Not enough money for that meal. Try a free snack.');return 'INSUFFICIENT_FUNDS';}
 const targets=interactionTargets(f);
 const paths=targets.map(([x,y])=>pathTo(s,x,y)).filter(p=>p!==null).sort((a,b)=>a.length-b.length);if(!paths.length){log(s,'Cannot reach that furniture. Clear a path to one of its sides.');return 'UNREACHABLE';}
 changeFunds(s,-(d.cost||0),'meal',events);s.activity={...a,path:paths[0],label:d.label,need:d.need,rate:d.rate,total:d.total,elapsed:0,skill:!!d.skill};return;
 }
 if(QUICK_ACTIONS[a.kind])s.activity={...a,...QUICK_ACTIONS[a.kind],elapsed:0,path:[]};
 if(a.kind==='work')return startShift(s);
}
export function advanceActions(s,step,events){
 if(!s.activity&&s.queue.length){const queued=s.queue.shift();const reason=begin(s,queued,events);emit(events,s.activity?'ACTION_STARTED':'ACTION_REJECTED',{kind:queued.kind,...(!s.activity?{reason:reason??'INVALID_ACTION'}:{}),...(queued.id!==undefined?{id:queued.id}:{})});}const a=s.activity;if(!a)return;
 if(a.path?.length){a.walkClock=(a.walkClock||0)+step;if(a.walkClock>=2-1e-9){a.walkClock=Math.max(0,a.walkClock-2);const [x,y]=a.path.shift();if(blocked(s,s.person.x,s.person.y,x,y)||s.social.presences.some(p=>p.x===x&&p.y===y)){log(s,'The path changed. Action cancelled.');emit(events,'ACTION_CANCELLED',{kind:a.kind,reason:'PATH_CHANGED'});s.activity=null;return;}s.person.x=x;s.person.y=y;}if(a.kind!=='walk')return;}
 if(a.kind==='shared')return;
 if(a.kind==='walk'){a.elapsed+=step;if(!a.path.length){emit(events,'ACTION_COMPLETED',{kind:a.kind});s.activity=null;}return;}
 a.elapsed+=step;
 recoverNeed(s,a,step);
 if(a.kind==='work'){changeNeed(s,'energy',-.025*step);changeNeed(s,'social',.08*step);}
 if(a.elapsed>=a.total||(a.need&&s.needs[a.need]>=99)){
 if(a.kind==='social')completeSocial(s,a,events);
 if(a.kind==='work')completeShift(s,a,events);
 if(a.skill)practice(s,events);
 emit(events,'ACTION_COMPLETED',{kind:a.kind});
 s.activity=null;
 }
}
