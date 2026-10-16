import {resolveAudioCues} from './audio-cue-resolver.js';

export class AudioEventSubscriber {
 constructor(manager){this.manager=manager;this.lastBuild=-Infinity;}
 receive(result){
  if(this.manager.suspended||!this.manager.unlocked)return [];
  const cues=result.ok===false?['ui.error']:[...new Set((result.events??[]).flatMap(resolveAudioCues))];
  const chosen=[];
  for(const id of cues.slice(0,4)){
   const build=id.startsWith('build.')||id.startsWith('object.');
   const now=this.manager.backend.now();if(build&&now-this.lastBuild<.1)continue;
   if(build)this.lastBuild=now;
   const event=(result.events??[]).find(e=>e.position||e.x!==undefined);
   this.manager.playCue(id,{position:event?.position??(event?.x!==undefined?{x:event.x,y:event.y}:undefined)});chosen.push(id);
  }
  return chosen;
 }
 presentation(event){for(const id of resolveAudioCues(event))this.manager.playCue(id,{position:event.position,spatial:!!event.spatial});}
}
