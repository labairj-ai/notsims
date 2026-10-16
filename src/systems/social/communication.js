import {SOCIAL_ACTIONS,CHANNELS} from '../../content/social.js';
import {pathFrom} from '../../core/navigation.js';
import {available} from './availability.js';
import {relationship} from './relationships.js';
import {occupied} from './navigation.js';
export function prepareSocial(s,c){c={...c,personId:c.personId??(c.actorId==='player'?c.targetId:c.actorId),interaction:c.interactionId??c.interaction};const actorId=c.actorId??'player',targetId=c.targetId??c.personId;if(!((actorId==='player'&&targetId===c.personId)||(targetId==='player'&&actorId===c.personId)))return {code:'INVALID_SOCIAL_TARGET'};const p=Object.hasOwn(s.people,c.personId??'')?s.people[c.personId]:null,def=Object.hasOwn(SOCIAL_ACTIONS,c.interaction??'chat')?SOCIAL_ACTIONS[c.interaction??'chat']:null,channel=c.channel??(c.type==='PHONE_CONTACT'?'phone_call':'in_person');if(!p||!def||!Object.hasOwn(CHANNELS,channel)||!def.channels.includes(channel))return {code:'INVALID_SOCIAL_TARGET'};
 if(channel!=='in_person'&&!s.contacts.includes(p.id))return {code:'UNKNOWN_CONTACT'};
 if(channel==='phone_call'&&!available(s,p.id))return {code:'UNAVAILABLE'};
 if(s.activity?.kind==='work')return {code:'AT_WORK'};if(s.queue.length>=5)return {code:'QUEUE_FULL'};
 if(s.queue.some(a=>a.kind==='social'&&a.personId===p.id&&a.interaction===(c.interaction??'chat'))||s.activity?.kind==='social'&&s.activity.personId===p.id&&s.activity.interaction===(c.interaction??'chat'))return {code:'SOCIAL_COOLDOWN'};
 const r=relationship(s,'player',p.id);if((r?.cooldowns[ c.interaction??'chat']??0)>s.minutes)return {code:'SOCIAL_COOLDOWN'};
 if(def.minTrust&&(!r||Math.min(...Object.values(r.toward).map(v=>v.trust))<def.minTrust))return {code:'NEEDS_TRUST'};
 let path=[];if(channel==='in_person'){const presence=s.social.presences.find(v=>v.personId===p.id&&v.state==='visiting');if(!presence)return {code:'NOT_PRESENT'};const paths=[[presence.x+1,presence.y],[presence.x-1,presence.y],[presence.x,presence.y+1],[presence.x,presence.y-1]].filter(([x,y])=>(x===s.person.x&&y===s.person.y)||!occupied(s,x,y,p.id)).map(([x,y])=>pathFrom(s,s.person.x,s.person.y,x,y)).filter(Boolean).sort((a,b)=>a.length-b.length);if(!paths.length)return {code:'UNREACHABLE'};path=paths[0];}
 return {action:{actorId,targetId,initiatedBy:actorId,source:c.source??'player',interactionId:c.interaction??'chat',kind:'social',personId:p.id,interaction:c.interaction??'chat',channel,path,label:`${def.label} · ${p.name}`,total:def.duration,elapsed:0,previousContact:r?.lastContactMinute??s.minutes}};
}
