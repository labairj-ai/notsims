import {SOCIAL_ACTIONS} from '../../content/social.js';
import {relationship,relationshipStatus} from './relationships.js';
import {repetitionMultiplier} from './interactions.js';
import {prepareSocial} from './communication.js';
export function availableSocialActions(s,{actorId='player',targetId,channel='in_person',context='person'}={}){
 const personId=actorId==='player'?targetId:actorId,r=relationship(s,actorId,targetId),status=relationshipStatus(r,s.minutes),tense=r?.memories.some(m=>m.valence<0&&s.minutes-m.minute<1440)||['Uneasy','Disliked','Rival','Enemy','Complicated'].includes(status),stranger=!r||r.familiarity<5;
 return Object.entries(SOCIAL_ACTIONS).map(([interactionId,def],index)=>{const checked=prepareSocial(s,{actorId,targetId,personId,interactionId,channel});let rank=50-index;
 if(stranger&&def.family==='Introduction')rank+=100;
 if(!stranger&&['chat','joke','day','news'].includes(interactionId))rank+=80;
 if(tense&&def.family==='Repair')rank+=180;
 if(def.family==='Conflict')rank-=60;
 if(!tense&&def.family==='Repair')rank-=40;
 rank-=Math.round((1-repetitionMultiplier(s,r,interactionId,channel))*60);
 return {interactionId,label:def.label,eligible:!checked.code,disabledReason:checked.code??null,rank,category:def.family,channel};
 }).sort((a,b)=>b.rank-a.rank||a.interactionId.localeCompare(b.interactionId));
}
