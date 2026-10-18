import {awayPolicy} from '../away/away.js';
import {random,notify} from './support.js';
import {relationship} from './relationships.js';
import {available} from './availability.js';
import {isSociallyDiscoverable,visitEligible} from './discovery.js';
import {arrive} from './visitors.js';
import {emit} from '../../core/events.js';

export function advanceScheduler(s,events){const social=s.social;
 if(s.minutes>=social.nextSocialOpportunityMinute){social.eventCounter++;social.nextSocialOpportunityMinute=s.minutes+240+Math.floor(random(s)*180);const hour=s.minutes%1440;if(hour>=540&&hour<1260&&!social.pendingEvent&&social.presences.length===0&&!awayPolicy(s.activity)){const candidates=Object.values(s.people).filter(p=>isSociallyDiscoverable(s,p.id,'opportunity')&&available(s,p.id)&&(!relationship(s,'player',p.id)||s.minutes-relationship(s,'player',p.id).lastContactMinute>180));const weighted=candidates.flatMap(p=>{const r=relationship(s,'player',p.id),v=r?.toward[p.id];if(v?.affinity<0)return [];const reconnect=r&&r.familiarity>=30&&v.connection<25;return Array((p.role==='neighbor'?3:2)+(reconnect?3:0)+(p.socialStyle==='warm'?1:0)).fill(p);});if(weighted.length){const p=weighted[Math.floor(random(s)*weighted.length)];if(s.contacts.includes(p.id)&&random(s)<.35){const type=social.eventCounter%2?'text':'phone_call';social.pendingEvent={id:social.nextId++,personId:p.id,type,expiry:s.minutes+(type==='text'?60:15)};notify(s,`${p.name} ${type==='text'?'sent a check-in.':'is calling.'}`,events,type,p.id);emit(events,'SOCIAL_EVENT_OFFERED',{...social.pendingEvent,eventKind:social.pendingEvent.type});}else if(visitEligible(s,p.id)&&arrive(s,p.id,events)){social.pendingEvent={id:social.nextId++,personId:p.id,type:'drop_by',visitId:social.presences.find(v=>v.personId===p.id).visitId,expiry:s.minutes+45};notify(s,`${p.name} dropped by.`,events,'visit',p.id);emit(events,'SOCIAL_EVENT_OFFERED',{...social.pendingEvent,eventKind:social.pendingEvent.type});}}}}
}

export function expireSocialEvent(s,events){const social=s.social;
 if(social.pendingEvent&&social.pendingEvent.type!=='drop_by'&&social.pendingEvent.expiry<=s.minutes){emit(events,'SOCIAL_EVENT_EXPIRED',{eventId:social.pendingEvent.id,personId:social.pendingEvent.personId});social.pendingEvent=null;}
}
