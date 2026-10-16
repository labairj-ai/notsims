import {INTERACTION_IDS} from '../content/interactions.js';
import {INTERACTION_AUDIO} from './audio-cues.js';

// Reconcile the *current visible* activity. Historical tick events never spawn loops.
export class InteractionAudio {
 constructor(manager){this.manager=manager;this.active=null;this.lastPosition=null;this.lastStep=-Infinity;this.distance=0;}
 frame(state,{paused=false,hidden=false,spatial=false}={}){
  const m=this.manager,now=m.backend.now(),a=state.activity;
  if(paused||hidden||m.suspended||!m.unlocked||m.settings.muted){this.stop();this.lastPosition=null;this.distance=0;return;}
  const f=a?.kind==='use'&&!a.path?.length?state.furniture.find(f=>f.id===a.id):null;
  if(this.active&&(this.active.activity!==a||this.active.id!==f?.id))this.stop();
  if(f&&!this.active){
   const mapping=INTERACTION_AUDIO[INTERACTION_IDS[f.type]]??{};this.active={activity:a,id:f.id,mapping,token:null};
   if(mapping.start)m.playCue(mapping.start,{position:f,spatial});if(mapping.detail)m.playCue(mapping.detail,{position:f,spatial});
  }
  if(this.active){const active=this.active;if(active.mapping.loop&&!m.voices.has(active.token))active.token=m.startLoop(active.mapping.loop,{position:f,spatial});}
  // Match renderer interpolation, then bound footsteps by real presentation time.
  if(a?.path?.length){const target=a.path[0],t=Math.min(1,(a.walkClock||0)/2),pos={x:state.person.x+(target[0]-state.person.x)*t,y:state.person.y+(target[1]-state.person.y)*t};
   if(this.lastPosition)this.distance+=Math.hypot(pos.x-this.lastPosition.x,pos.y-this.lastPosition.y);
   if(this.distance>=.25&&now-this.lastStep>=.4){const surface=state.floors[`${Math.floor(pos.x)},${Math.floor(pos.y)}`]?'indoor':'outdoor';m.playCue(`movement.footstep.${surface}`,{position:pos,spatial});this.lastStep=now;this.distance=0;}
   this.lastPosition=pos;
  }else {this.lastPosition=null;this.distance=0;}
 }
 receive(result){if(!this.active)return;for(const e of result.events??[]){if(e.type==='ACTION_COMPLETED'&&e.kind===this.active.activity.kind){const cue=this.active.mapping.complete;if(cue)this.manager.playCue(cue);this.stop();break;}if(e.type==='ACTION_CANCELLED'){this.stop();break;}}}
 stop(){if(this.active?.token!=null)this.manager.stopLoop(this.active?.token);this.active=null;}
 reset(){this.stop();this.lastPosition=null;this.lastStep=-Infinity;this.distance=0;}
}
