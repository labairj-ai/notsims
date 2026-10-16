import {SOCIAL_LIMITS} from '../../content/social.js';
import {relationship} from './relationships.js';
import {memory} from './memories.js';
import {notify} from './support.js';
import {emit} from '../../core/events.js';

export function addContact(s,id,events){if(!s.contacts.includes(id)){s.contacts.push(id);emit(events,'PERSON_MET',{personId:id});emit(events,'CONTACT_ADDED',{personId:id});}}
export function isSociallyDiscoverable(s,id,context='opportunity'){const p=s.people[id];return !!p&&(s.contacts.includes(id)||p.role==='old_friend'||p.role==='neighbor');}
export function visitEligible(s,id){return isSociallyDiscoverable(s,id)&&(!s.social.visits[id]?.introduced||s.contacts.includes(id))&&((s.social.visits[id]?.nextAllowedMinute??0)<=s.minutes);}
export function introductionCommand(s,c,events){const id=c.personId,valid=Object.hasOwn(s.people,id??'');
 if(c.type==='REQUEST_INTRODUCTION'){if(!valid||!s.contacts.includes(id))return 'UNKNOWN_CONTACT';const known=relationship(s,'player',id);if(!known||known.familiarity<30)return 'NEEDS_FRIEND';const other=Object.keys(s.people).find(target=>!s.contacts.includes(target)&&relationship(s,id,target)?.familiarity>=20);if(!other)return 'NO_INTRODUCTION';addContact(s,other,events);const r=relationship(s,'player',other,true);memory(s,r,'introduced_by_friend',id,other,1,3,events);s.social.priors.push({source:id,subject:other,affinity:3,minute:s.minutes,expiry:s.minutes+4320,hops:1});s.social.priors=s.social.priors.slice(-SOCIAL_LIMITS.priors);notify(s,`${s.people[id].name} introduced ${s.people[other].name}.`,events,'introduction',other);return null;}
return 'UNKNOWN_COMMAND';}
