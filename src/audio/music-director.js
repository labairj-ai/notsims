import {CUES} from './audio-cues.js';
import {AUDIO_ASSETS} from './audio-library.js';

export class MusicDirector {
 constructor(manager,{fadeSeconds=1.5,schedule=(...args)=>setTimeout(...args),unschedule=handle=>clearTimeout(handle),random=Math.random}={}){
  Object.assign(this,{manager,fadeSeconds,schedule,unschedule,random});this.current=null;this.previous=null;this.state=null;this.lastTrack=null;this.fadeTimer=null;this.generation=0;this.disposed=false;this.retryAt=0;
 }
 update({started=false,minutes=480,hidden=false}={}){
  if(this.disposed||hidden||this.manager.suspended||!this.manager.unlocked||this.manager.settings.muted||!this.manager.settings.master||!this.manager.settings.music){this.stop();return;}
  const hour=(minutes%1440)/60,state=!started?'menu':hour>=6&&hour<18?'home.day':'home.evening';
  if(this.state===state&&this.manager.backend.now()<this.retryAt)return;
  const cue=CUES[`music.${state}`];
  if(this.state===state&&this.current){
   if(!this.current.ready||cue.sources.length<2||this.manager.backend.now()-this.current.since<AUDIO_ASSETS[this.current.id].duration-this.fadeSeconds)return;
  }
  this.transition(state,cue);
 }
 transition(state,cue){
  // At most one current and one previous media element, including pending loads.
  if(this.previous){this.previous.voice.stop();this.previous=null;}
  if(this.fadeTimer!==null){this.unschedule(this.fadeTimer);this.fadeTimer=null;}
  const old=this.current;if(old&&!old.ready){old.voice.stop();this.current=null;}
  const previous=old?.ready?old:null;
  const candidates=cue.sources.filter(id=>id!==this.lastTrack),pool=candidates.length?candidates:cue.sources;
  const id=pool[Math.min(pool.length-1,Math.floor(this.random()*pool.length))],voice=this.manager.startMusic(id);
  if(!voice)return;
  const generation=++this.generation,entry={id,voice,ready:false,since:this.manager.backend.now()};this.state=state;this.current=entry;this.previous=previous;
  voice.ready.then(ok=>{
   if(this.disposed||generation!==this.generation||!ok){voice.stop();if(generation===this.generation){this.current=previous;this.previous=null;this.retryAt=this.manager.backend.now()+10;}return;}
   entry.ready=true;entry.since=this.manager.backend.now();this.lastTrack=id;voice.setGain(cue.gain*AUDIO_ASSETS[id].normalizationGain,this.fadeSeconds);
   if(previous){previous.voice.setGain(0,this.fadeSeconds);this.fadeTimer=this.schedule(()=>{previous.voice.stop();if(this.previous===previous)this.previous=null;this.fadeTimer=null;},this.fadeSeconds*1000);}
  }).catch(error=>{this.manager.report('music',error);voice.stop();});
 }
 stop(){this.generation++;if(this.fadeTimer!==null)this.unschedule(this.fadeTimer);this.fadeTimer=null;this.current?.voice.stop();this.previous?.voice.stop();this.current=null;this.previous=null;this.state=null;this.retryAt=0;}
 dispose(){this.disposed=true;this.stop();}
 debug(){return {state:this.state,track:this.current?.id??null,fadingTrack:this.previous?.id??null};}
}
