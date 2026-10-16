import {resolveBodyIntent} from './body-intent.js';
import {presentationRate} from './clips.js';
// Device-local, disposable state only. GameState and simulation RNG are read-only.
export class BodyPresentation {
 constructor({reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false,enabled=true}={}){this.reducedMotion=reducedMotion;this.enabled=enabled;this.time=0;this.reactions=new Map();this.seen=new WeakSet();this.lastState=null;this.lastMinute=null;this.lastTime=null;this.frameMs=16;this.slowFrames=0;}
 reset(){this.reactions.clear();this.seen=new WeakSet();this.lastState=null;this.lastMinute=null;this.lastTime=null;this.time=0;}
 receive(result){for(const e of result.events??[]){if(e.type!=='SOCIAL_CONTACT_COMPLETED'||this.seen.has(e))continue;this.seen.add(e);const actor=e.actorId??'player',target=e.targetId??e.personId,key=`${e.interaction}:${this.time}`;
  for(const id of [actor,target]){if(id!=='player'&&e.channel!=='in_person')continue;const listener=id===target;const gesture=e.success?(e.interaction==='joke'?'Laugh':e.interaction==='apologize'?(listener?'Nod':'Apologize'):'Nod'):(listener?'LeanBack':'Shrug');this.reactions.set(id,{gesture,key,partner:listener?actor:target,channel:e.channel,expires:this.time+2.5});}
 }while(this.reactions.size>8)this.reactions.delete(this.reactions.keys().next().value);}
 frame(s,time,{paused=false,hidden=false,speed=1}={}){if(this.lastState&&this.lastState!==s||this.lastMinute!==null&&s.minutes<this.lastMinute)this.reset();const dt=this.lastTime===null?0:Math.min(.1,Math.max(0,time-this.lastTime));this.lastState=s;this.lastTime=time;
  if(hidden){this.reactions.clear();this.lastMinute=s.minutes;return {dt:0,paused:true,hidden:true,speed};}
  const stopped=paused||this.lastMinute===s.minutes;this.lastMinute=s.minutes;if(!stopped)this.time+=dt*presentationRate(speed);for(const [id,r] of this.reactions)if(r.expires<=this.time)this.reactions.delete(id);
  return {dt:stopped?0:dt,paused:stopped,hidden:false,speed};
 }
 reportCost(ms){this.frameMs=this.frameMs*.95+ms*.05;this.slowFrames=this.frameMs>8?Math.min(120,this.slowFrames+1):Math.max(0,this.slowFrames-1);}
 intent(s,id){const current=s.activity?.kind==='social'&&s.activity.personId===id||s.social.sharedActivity?.personId===id,priority=id==='player'||current,quality=priority?'full':this.slowFrames>30?'low':'full';return resolveBodyIntent(s,id,{time:this.time,reducedMotion:this.reducedMotion,quality,enabled:this.enabled,reaction:this.reactions.get(id)});}
}
