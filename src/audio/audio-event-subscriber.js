import {resolveAudioCues} from './audio-cue-resolver.js';

export class AudioEventSubscriber {
 constructor(manager){this.manager=manager;this.lastBuild=-Infinity;this.lastSocial=-Infinity;this.ringToken=null;this.ringEventId=null;this.seenVisits=new Set();}
 reset(clearHistory=false){if(clearHistory)this.seenVisits.clear();this.manager.stopLoop(this.ringToken);this.ringToken=null;this.ringEventId=null;}
 frame(s){if(!s.social.pendingEvent||s.social.pendingEvent.id!==this.ringEventId||this.manager.suspended||this.manager.settings.muted||!this.manager.settings.sfx||!this.manager.settings.master)this.reset();}
 receive(result){
  for(const e of result.events??[])if(['SOCIAL_EVENT_RESPONDED','SOCIAL_EVENT_EXPIRED'].includes(e.type)&&e.eventId===this.ringEventId)this.reset();
  if(this.manager.suspended||!this.manager.unlocked)return [];
  const cues=result.ok===false?['ui.error']:[...new Set((result.events??[]).flatMap(resolveAudioCues))];
  const chosen=[];
  for(const id of cues.slice(0,4)){
   if(id==='social.door.knock'){const visits=(result.events??[]).filter(e=>e.type==='VISIT_ARRIVED'||e.type==='SOCIAL_EVENT_OFFERED'&&e.eventKind==='drop_by').map(e=>e.visitId).filter(v=>v!==undefined);if(visits.length&&visits.every(v=>this.seenVisits.has(v)))continue;for(const v of visits)this.seenVisits.add(v);while(this.seenVisits.size>64)this.seenVisits.delete(this.seenVisits.values().next().value);}
   const social=id.startsWith('social.');if(social&&this.manager.backend.now()-this.lastSocial<.2)continue;
   const build=id.startsWith('build.')||id.startsWith('object.');
   const now=this.manager.backend.now();if(build&&now-this.lastBuild<.1)continue;
   if(build)this.lastBuild=now;
   const event=(result.events??[]).find(e=>e.position||e.x!==undefined);
   const token=this.manager.playCue(id,{position:event?.position??(event?.x!==undefined?{x:event.x,y:event.y}:undefined)});if(social)this.lastSocial=now;if(id==='social.phone.ring'){this.manager.stopLoop(this.ringToken);this.ringToken=token;this.ringEventId=(result.events??[]).find(e=>e.type==='SOCIAL_EVENT_OFFERED'&&e.eventKind==='phone_call')?.id??null;}chosen.push(id);
  }
  return chosen;
 }
 presentation(event){for(const id of resolveAudioCues(event))this.manager.playCue(id,{position:event.position,spatial:!!event.spatial});}
}
