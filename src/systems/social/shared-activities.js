import {sharedMealCost} from '../../content/meals.js';
import {changeFunds} from '../economy/economy.js';
import {SHARED_ACTIVITIES} from '../../content/shared-activities.js';
import {interactionTargets,dimensions,furniturePoint,at} from '../objects/geometry.js';
import {pathFrom} from '../../core/navigation.js';
import {inside} from '../../core/grid.js';
import {emit} from '../../core/events.js';
import {resolveSocialInteraction} from './interactions.js';

const objectSignature=f=>[f.type,f.x,f.y,f.rotation].join(':');

// A single bounded shared activity reserves two approach tiles; no NPC player queue.
export function prepareSharedActivity(s,{personId,objectId,interactionId}){
 const def=Object.hasOwn(SHARED_ACTIVITIES,interactionId??'')?SHARED_ACTIVITIES[interactionId]:null,f=s.furniture.find(f=>f.id===objectId),p=s.social.presences.find(p=>p.personId===personId&&p.state==='visiting');
 if(!def||!f||!def.objects.includes(f.type))return {code:'INVALID_SHARED_ACTIVITY'};
 if(!p)return {code:'NOT_PRESENT'};
 if(s.activity||s.queue.length||s.social.sharedActivity)return {code:'BUSY'};
 if(s.money<sharedMealCost(interactionId))return {code:'INSUFFICIENT_FUNDS'};
 const occupied=(x,y)=>s.social.presences.some(v=>v.personId!==personId&&v.x===x&&v.y===y);
 const targets=interactionTargets(f).filter(([x,y])=>inside(x,y)&&!at(s,x,y)&&!occupied(x,y));
 const options=[];
 for(const a of targets)for(const b of targets){if(a[0]===b[0]&&a[1]===b[1]||b[0]===s.person.x&&b[1]===s.person.y)continue;
  const playerPath=pathFrom(s,s.person.x,s.person.y,...a),guestPath=pathFrom(s,p.x,p.y,...b);
  if(!playerPath||!guestPath||playerPath.some(v=>v[0]===b[0]&&v[1]===b[1])||guestPath.some(v=>v[0]===a[0]&&v[1]===a[1]))continue;
  options.push({slots:[a,b],playerPath,guestPath,pathDistance:playerPath.length+guestPath.length});
 }
 const timely=options.filter(o=>Math.max(o.playerPath.length,o.guestPath.length)*2+def.duration<120);options.length=0;options.push(...timely);options.sort((a,b)=>a.pathDistance-b.pathDistance);if(!options.length)return {code:'UNREACHABLE'};
 return {prepared:{personId,objectId,interactionId,objectSignature:objectSignature(f),...options[0]}};
}
export function startSharedActivity(s,c,events){const result=prepareSharedActivity(s,c);if(result.code)return result.code;const q=result.prepared,def=SHARED_ACTIVITIES[q.interactionId],p=s.social.presences.find(p=>p.personId===q.personId),id=s.social.nextId++;
 s.social.sharedActivity={id,interactionId:q.interactionId,objectId:q.objectId,personId:q.personId,participants:['player',q.personId],slots:q.slots,elapsed:0,total:def.duration,status:'approaching',objectSignature:q.objectSignature,deadline:s.minutes+120};
 s.activity={kind:'shared',id:q.objectId,sharedId:id,path:q.playerPath,label:`${def.label} · ${s.people[q.personId].name}`,elapsed:0,total:def.duration};p.path=q.guestPath;p.moveClock=0;
 emit(events,'SHARED_ACTIVITY_CREATED',{activityId:id,personId:q.personId,interactionId:q.interactionId,objectId:q.objectId});return null;
}
export function cancelSharedActivity(s,events,reason='PLAYER'){const a=s.social.sharedActivity;if(!a)return;const p=s.social.presences.find(p=>p.personId===a.personId);if(p&&p.state==='visiting'){p.path=[];p.moveClock=0;}if(s.activity?.sharedId===a.id)s.activity=null;s.social.sharedActivity=null;emit(events,'SHARED_ACTIVITY_CANCELLED',{activityId:a.id,personId:a.personId,reason});}
export function advanceSharedActivity(s,step,events){const a=s.social.sharedActivity;if(!a)return;const p=s.social.presences.find(p=>p.personId===a.personId&&p.state==='visiting'),f=s.furniture.find(f=>f.id===a.objectId),def=SHARED_ACTIVITIES[a.interactionId];
 if(!p||!f||objectSignature(f)!==a.objectSignature||s.activity?.sharedId!==a.id||s.minutes>=a.deadline||a.slots.some(([x,y])=>at(s,x,y)))return cancelSharedActivity(s,events,'INTERRUPTED');
 if(s.activity.path.length||p.path.length)return;
 if(s.person.x!==a.slots[0][0]||s.person.y!==a.slots[0][1]||p.x!==a.slots[1][0]||p.y!==a.slots[1][1])return cancelSharedActivity(s,events,'PATH_CHANGED');
 if(a.status!=='active'){const price=sharedMealCost(a.interactionId);if(s.money<price)return cancelSharedActivity(s,events,'INSUFFICIENT_FUNDS');changeFunds(s,-price,'shared_meal',events);a.status='active';emit(events,'SHARED_ACTIVITY_STARTED',{activityId:a.id,personId:a.personId,interactionId:a.interactionId});}
 a.elapsed+=step;s.activity.elapsed=a.elapsed;
 // Needs recover independently of the relationship/memory exchange at completion.
 if(def.need!=='social')s.needs[def.need]=Math.min(100,s.needs[def.need]+step*.45);
 s.needs.social=Math.min(100,s.needs.social+step*.18);
 if(a.elapsed>=a.total){resolveSocialInteraction(s,{actorId:'player',targetId:p.personId,personId:p.personId,initiatedBy:'player',interactionId:a.interactionId,channel:'in_person',source:'shared'},events);emit(events,'SHARED_ACTIVITY_COMPLETED',{activityId:a.id,personId:a.personId,interactionId:a.interactionId});s.social.sharedActivity=null;s.activity=null;p.path=[];}
}
export function availableSharedActivities(s,personId){return Object.entries(SHARED_ACTIVITIES).flatMap(([interactionId,def])=>s.furniture.filter(f=>def.objects.includes(f.type)).map(f=>({interactionId,objectId:f.id,label:def.label,cost:sharedMealCost(interactionId),disabledReason:prepareSharedActivity(s,{personId,objectId:f.id,interactionId}).code??null,eligible:!prepareSharedActivity(s,{personId,objectId:f.id,interactionId}).code}))).filter(a=>a.eligible||a.disabledReason==='INSUFFICIENT_FUNDS').slice(0,8);}
// Presentation-neutral pose query shared by both renderers; state remains authoritative.
export function sharedActivityPose(s,actorId){const a=s.social?.sharedActivity;if(!a||a.status!=='active'||!a.participants.includes(actorId))return null;const f=s.furniture.find(f=>f.id===a.objectId);if(!f)return null;const i=a.participants.indexOf(actorId),slot=a.slots[i],def=SHARED_ACTIVITIES[a.interactionId],angle=f.rotation*Math.PI/2;
 if(a.interactionId==='shared_sit'){const [x,y]=furniturePoint(f,i?1.35:.7,.56);return {x,y,height:.6,angle,animation:'Sit'};}
 return {x:slot[0]+.5,y:slot[1]+.5,height:0,angle:Math.atan2(f.x-slot[0],f.y-slot[1]),animation:def.animation==='Sit'?'Idle':def.animation};
}
