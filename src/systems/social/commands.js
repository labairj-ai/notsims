import {startSharedActivity,cancelSharedActivity} from './shared-activities.js';
import {prepareSocial} from './communication.js';
import {planCommand} from './plans.js';
import {introductionCommand} from './discovery.js';
import {respondVisit,leave} from './visitors.js';
import {emit} from '../../core/events.js';

export function socialCommand(s,c,events){
 if(c.type==='SHARED_ACTIVITY')return startSharedActivity(s,c,events);
 if(c.type==='INVITE_OVER'||c.type==='CANCEL_SOCIAL_PLAN')return planCommand(s,c,events);
 if(c.type==='REQUEST_INTRODUCTION')return introductionCommand(s,c,events);
 const id=c.personId;
 if(c.type==='SOCIAL_INTERACT'||c.type==='PHONE_CONTACT'){const result=prepareSocial(s,{...c,actorId:'player',targetId:id,source:'player'});if(result.code)return result.code;s.queue.push(result.action);emit(events,'ACTION_QUEUED',{kind:'social',personId:id});return null;}
 if(c.type==='ASK_GUEST_TO_LEAVE'){const p=s.social.presences.find(p=>p.personId===id);if(!p)return 'NOT_PRESENT';if(s.social.sharedActivity?.personId===id)cancelSharedActivity(s,events,'GUEST_LEFT');leave(s,p,events);return null;}
 if(c.type==='RESPOND_SOCIAL_EVENT'){const event=s.social.pendingEvent;if(!event||event.id!==c.eventId)return 'INVALID_EVENT';
 if(event.type==='drop_by')return respondVisit(s,c,event,events);
 if(!['reply','decline'].includes(c.response))return 'INVALID_EVENT';
 if(c.response==='reply'){const prepared=prepareSocial(s,{type:'PHONE_CONTACT',personId:event.personId,actorId:event.personId,targetId:'player',source:'incoming',interaction:'chat',channel:event.type});if(prepared.code)return prepared.code;s.queue.push(prepared.action);emit(events,'ACTION_QUEUED',{kind:'social',personId:event.personId});}
 s.social.pendingEvent=null;emit(events,'SOCIAL_EVENT_RESPONDED',{eventId:event.id,personId:event.personId,response:c.response});return null;}
 return 'UNKNOWN_COMMAND';
}
