import {CUES} from './audio-cues.js';
import {AUDIO_ASSETS} from './audio-library.js';
import {AUDIO_BUSES} from './audio-events.js';
import {DEFAULT_SETTINGS,validateSettings} from '../settings/settings.js';
import {WebAudioBackend} from './web-audio-backend.js';

export class AudioManager {
 constructor({backend,random=Math.random,settings=DEFAULT_SETTINGS,maxVoices=24}={}){
  this.diagnostics=[];this.backend=backend??new WebAudioBackend({diagnose:(where,error)=>this.report(where,error)});this.random=random;this.settings=validateSettings(settings);this.maxVoices=maxVoices;
  this.unlocked=false;this.suspended=false;this.disposed=false;this.voices=new Map();this.lastPlayed=new Map();this.nextToken=1;this.musicVoices=new Set();
 }
 report(where,error){this.diagnostics.push({where,message:String(error?.message??error)});this.diagnostics=this.diagnostics.slice(-12);}
 async unlock(){if(this.disposed)return false;try{this.unlocked=await this.backend.unlock();if(this.disposed)return false;if(this.unlocked){this.applySettings(this.settings);this.preload('essential');}return this.unlocked;}catch(error){this.report('unlock',error);return false;}}
 applySettings(settings){this.settings=validateSettings(settings);for(const bus of AUDIO_BUSES)this.backend.setBusGain(bus,bus==='master'&&(this.settings.muted||this.suspended)?0:this.settings[bus]);if(this.settings.muted){this.stopAll();this.stopMusic();}}
 setBusGain(bus,value){if(!AUDIO_BUSES.includes(bus)||!Number.isFinite(value))return;this.applySettings({...this.settings,[bus]:Math.max(0,Math.min(1,value))});}
 mute(muted=true){this.applySettings({...this.settings,muted});}
 async preload(group){if(!this.unlocked||this.disposed)return;const ids=new Set(Object.values(CUES).filter(c=>c.preloadGroup===group&&c.mode!=='stream').flatMap(c=>c.sources));await Promise.all([...ids].map(id=>this.backend.load?.(AUDIO_ASSETS[id]).catch(error=>this.report(id,error))));}
 playCue(id,options={}){
  const cue=CUES[id];if(!cue||cue.mode==='stream'||!this.unlocked||this.suspended||this.disposed||this.settings.muted||this.settings.master===0||this.settings[cue.bus]===0)return null;
  const now=this.backend.now(),same=[...this.voices.values()].filter(v=>v.cue===id);
  if(now-(this.lastPlayed.get(id)??-Infinity)<cue.cooldown||same.length>=cue.maxPolyphony||this.voices.size>=this.maxVoices)return null;
  const token=this.nextToken++,source=cue.sources[Math.min(cue.sources.length-1,Math.floor(this.random()*cue.sources.length))],entry={cue:id,loop:cue.mode==='loop',voice:null};
  this.voices.set(token,entry);this.lastPlayed.set(id,now);
  Promise.resolve().then(()=>this.voices.get(token)!==entry?null:this.backend.play(AUDIO_ASSETS[source],{bus:cue.bus,gain:cue.gain,rate:1+(this.random()*2-1)*cue.pitchJitter,loop:entry.loop,spatial:cue.spatial&&!!options.spatial,position:options.position,isActive:()=>this.voices.get(token)===entry&&!this.suspended&&!this.disposed&&!this.settings.muted,onEnded:()=>this.voices.delete(token)})).then(voice=>{if(!voice){this.voices.delete(token);return;}if(this.voices.get(token)!==entry){voice.stop();return;}entry.voice=voice;}).catch(error=>{this.voices.delete(token);this.report(id,error);});
  return token;
 }
 startLoop(id,options){return CUES[id]?.mode==='loop'?this.playCue(id,options):null;}
 stopLoop(token){const entry=this.voices.get(token);if(!entry)return;this.voices.delete(token);entry.voice?.stop();}
 stopAll(){for(const token of [...this.voices.keys()])this.stopLoop(token);}
 suspend(){this.suspended=true;this.stopAll();this.stopMusic();this.applySettings(this.settings);}
 resume(){if(this.disposed)return;this.suspended=false;this.applySettings(this.settings);}
 startMusic(assetId){if(!this.unlocked||this.suspended||this.disposed||this.settings.muted||!this.settings.music||!this.settings.master)return null;try{if(this.musicVoices.size>=2)[...this.musicVoices][0].stop();const voice=this.backend.startMusic(AUDIO_ASSETS[assetId],{gain:0});this.musicVoices.add(voice);const stop=voice.stop;voice.stop=()=>{this.musicVoices.delete(voice);stop();};voice.ready=voice.ready.catch(error=>{this.report(assetId,error);return false;});return voice;}catch(error){this.report(assetId,error);return null;}}
 stopMusic(){for(const voice of [...this.musicVoices])voice.stop();}
 dispose(){if(this.disposed)return;this.disposed=true;this.stopAll();this.stopMusic();this.backend.dispose();}
 debug(){return {unlocked:this.unlocked,suspended:this.suspended,muted:this.settings.muted,buses:{...this.settings},activeVoices:this.voices.size,streams:this.musicVoices.size,decodedBytes:this.backend.decodedBytes??0,loops:[...this.voices.values()].filter(v=>v.loop).map(v=>v.cue),diagnostics:[...this.diagnostics]};}
}
