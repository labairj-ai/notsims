import {awayPolicy} from '../away/away.js';
import {SOCIAL_LIMITS} from '../../content/social.js';
import {available} from './availability.js';
import {arrive} from './visitors.js';
import {notify} from './support.js';
import {emit} from '../../core/events.js';

export function planCommand(s,c,events){const id=c.personId,valid=Object.hasOwn(s.people,id??'');
 if(c.type==='INVITE_OVER'){if(!valid||!s.contacts.includes(id))return 'UNKNOWN_CONTACT';const start=c.startMinute??s.minutes;if(!Number.isFinite(start)||start<s.minutes||start>s.minutes+10080)return 'INVALID_TIME';if(!available(s,id,start))return 'UNAVAILABLE';if(!!awayPolicy(s.activity)&&start===s.minutes)return 'AT_WORK';if(s.social.plans.filter(p=>p.status==='scheduled'||p.status==='active').length>=SOCIAL_LIMITS.plans)return 'PLAN_LIMIT';if(s.social.plans.some(p=>p.personId===id&&p.status==='scheduled'&&Math.abs(p.startMinute-start)<120))return 'PLAN_CONFLICT';const plan={id:s.social.nextId++,host:'player',personId:id,startMinute:start,duration:120,location:'home',intent:'hangout',status:'scheduled'};s.social.plans=s.social.plans.filter(p=>p.status==='scheduled'||p.status==='active').concat(plan).slice(-SOCIAL_LIMITS.plans);emit(events,'SOCIAL_PLAN_CREATED',{...plan});return null;}
 if(c.type==='CANCEL_SOCIAL_PLAN'){const plan=s.social.plans.find(p=>p.id===c.planId&&p.status==='scheduled');if(!plan)return 'INVALID_PLAN';plan.status='cancelled';emit(events,'SOCIAL_PLAN_CANCELLED',{planId:plan.id});return null;}
return 'UNKNOWN_COMMAND';}
export function advancePlans(s,events){const social=s.social;
 for(const plan of social.plans){if(plan.status!=='scheduled'||plan.startMinute>s.minutes)continue;if(!!awayPolicy(s.activity)||!arrive(s,plan.personId,events,plan)){plan.status='missed';notify(s,`Visit with ${s.people[plan.personId].name} could not start. No relationship penalty.`,events);}else{plan.status='active';notify(s,`${s.people[plan.personId].name} arrived for your hangout.`,events,'visit',plan.personId);}}
}
