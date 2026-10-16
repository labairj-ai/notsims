import {AudioManager} from './audio-manager.js';
import {AudioEventSubscriber} from './audio-event-subscriber.js';
import {InteractionAudio} from './interaction-audio.js';
import {MusicDirector} from './music-director.js';
import {loadSettings} from '../settings/settings.js';
import {installAudioSettings} from '../ui/audio-settings.js';

// This adapter observes returned facts and presentation state. It never writes GameState.
export function installAudio(app,{manager=new AudioManager({settings:loadSettings()})}={}){
 const subscriber=new AudioEventSubscriber(manager),interaction=new InteractionAudio(manager),music=new MusicDirector(manager);
 let ambient=null;let disposed=false;const removers=[];
 const listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);removers.push(()=>target.removeEventListener(type,fn,options));};
 const safe=fn=>{try{return fn();}catch(error){manager.report('presentation',error);}};
 const context=()=>({started:app.started,minutes:app.state.minutes,hidden:document.hidden});
 const audio={manager,music,interaction,
  receive:result=>safe(()=>{subscriber.receive(result);interaction.receive(result);}),
  frame:()=>safe(()=>{interaction.frame(app.state,{paused:app.paused(),hidden:document.hidden,spatial:app.is3D});music.update(context());if(app.started&&!document.hidden&&!manager.suspended&&manager.unlocked&&!manager.settings.muted&&manager.settings.ambience&&manager.settings.master){if(!manager.voices.has(ambient))ambient=manager.startLoop('ambience.garden.loop');}else{manager.stopLoop(ambient);ambient=null;}}),
  reset:()=>safe(()=>{interaction.reset();manager.stopAll();music.stop();}),
  settingsChanged:()=>safe(()=>{if(manager.settings.muted||!manager.settings.master){interaction.reset();music.stop();return;}if(!manager.settings.sfx)interaction.reset();music.update(context());}),
  debug:()=>({...manager.debug(),music:music.debug()}),
  dispose:()=>{if(disposed)return;disposed=true;if(globalThis.notsimsAudio===audio)delete globalThis.notsimsAudio;for(const remove of removers)remove();safe(()=>{interaction.reset();music.dispose();manager.dispose();});},
 };
 app.audio=audio;
 listen(document,'pointerdown',gesture,true);listen(document,'keydown',gesture,true);
 function gesture(event){if(!event.isTrusted||document.hidden||disposed)return;manager.unlock().then(()=>{if(!disposed)safe(()=>{music.retryAt=0;music.update(context());});});}
 listen(document,'click',event=>{if(!event.isTrusted||!event.target.closest('button'))return;const el=event.target.closest('button');safe(()=>subscriber.presentation({type:el.matches('#rotate')?'UI_ROTATE':el.matches('[data-close],#creator-close')?'UI_CANCEL':el.matches('#begin,#resume')?'UI_CONFIRM':'UI_SELECT'}));});
 listen(document,'keydown',event=>{if(event.key.toLowerCase()==='r'&&app.ui.tab==='shop'&&!document.querySelector('dialog[open]'))safe(()=>subscriber.presentation({type:'UI_ROTATE'}));});
 listen(document,'visibilitychange',()=>safe(()=>{if(document.hidden){interaction.reset();music.stop();manager.suspend();}else{manager.resume();music.update(context());}}));
 listen(window,'pagehide',audio.dispose);
 if(new URLSearchParams(location.search).has('audioDebug'))globalThis.notsimsAudio=audio;
 installAudioSettings(app);
 return audio;
}
