import {SOCIAL_LIMITS,SOCIAL_TUNING} from '../../content/social.js';
import {pathFrom,blocked} from '../../core/navigation.js';
import {random} from './support.js';
import {occupied,entrance,gatherPath} from './navigation.js';
import {advanceAutonomy} from './autonomy.js';
import {relationship} from './relationships.js';
import {memory} from './memories.js';
import {addContact} from './discovery.js';
import {emit} from '../../core/events.js';

export function arrive(s,id,events,plan=null){if(s.social.presences.length>=SOCIAL_LIMITS.presences||s.social.presences.some(p=>p.personId===id))return false;const pos=entrance(s);if(!pos)return false;const visitId=s.social.nextId++;const reserved=s.people[id].socialStyle==='reserved',warm=s.people[id].socialStyle==='warm';s.social.visits[id]={lastVisitMinute:s.minutes,nextAllowedMinute:s.minutes+SOCIAL_TUNING.visitMin+Math.floor(random(s)*SOCIAL_TUNING.visitRange*(warm?.65:reserved?1:.85)),introduced:true};s.social.presences.push({personId:id,x:pos[0],y:pos[1],state:plan?'visiting':'waiting',visitId,until:s.minutes+(plan?plan.duration:45),nextInitiationMinute:s.minutes+35,moveClock:0,path:[],exit:[...pos]});emit(events,'VISIT_ARRIVED',{personId:id,visitId});if(plan){const p=s.social.presences.at(-1);p.path=gatherPath(s,p);}if(plan)emit(events,'VISIT_STARTED',{personId:id,visitId});return true;}
export function leave(s,p,events){p.state='leaving';p.path=pathFrom(s,p.x,p.y,...p.exit)||[];p.until=s.minutes+30;if(s.social.pendingEvent?.personId===p.personId)s.social.pendingEvent=null;emit(events,'VISIT_LEAVING',{personId:p.personId});}
export function respondVisit(s,c,event,events){
 if(!['invite','outside','decline'].includes(c.response))return 'INVALID_EVENT';const p=s.social.presences.find(p=>p.personId===event.personId);if(!p)return 'NOT_PRESENT';if(c.response==='decline'){const r=relationship(s,'player',p.personId,true);const declines=r.memories.filter(m=>m.type==='visit_declined'&&s.minutes-m.minute<4320).length;memory(s,r,'visit_declined','player',p.personId,0,0,events);if(declines>=2)memory(s,r,'repeated_decline','player',p.personId,-1,2,events);leave(s,p,events);}else{p.state='visiting';p.until=s.minutes+(c.response==='outside'?60:120);addContact(s,p.personId,events);const r=relationship(s,'player',p.personId,true);memory(s,r,'visit_welcomed','player',p.personId,1,6,events);emit(events,'VISIT_STARTED',{personId:p.personId,visitId:p.visitId});if(c.response==='invite'){p.path=gatherPath(s,p);}}s.social.pendingEvent=null;emit(events,'SOCIAL_EVENT_RESPONDED',{eventId:event.id,personId:event.personId,response:c.response});return null;
}
export function advanceVisitors(s,step,events){const social=s.social;
 for(const p of [...social.presences]){if(p.until<=s.minutes&&p.state!=='leaving')leave(s,p,events);
 if(p.path.length){p.moveClock+=step;if(p.moveClock>=2){p.moveClock-=2;const [x,y]=p.path[0];if(!occupied(s,x,y,p.personId)&&!blocked(s,p.x,p.y,x,y)){p.x=x;p.y=y;p.path.shift();}else{p.path=[];}}}
 if(p.state==='leaving'&&(!p.path.length||p.until<=s.minutes)){social.presences.splice(social.presences.indexOf(p),1);for(const plan of social.plans)if(plan.personId===p.personId&&plan.status==='active')plan.status='completed';emit(events,'VISIT_ENDED',{personId:p.personId,visitId:p.visitId});continue;}
 advanceAutonomy(s,p,events);}
}
