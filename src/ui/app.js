import {installSocial} from './social.js';
import {installAudio} from '../audio/audio-controller.js';
import {$} from './dom.js';
import {newGame} from '../game/session.js';
import {dispatch,advance} from '../game/dispatch.js';
import {commandMessage} from './command-feedback.js';
import {loadStored,installPersistence} from './persistence-controller.js';
import {bootstrapRenderer} from './renderer-bootstrap.js';
import {installViews} from './views.js';
import {installControls} from './controls.js';
import {installCharacterCreator} from './character-creator.js';
import {installMobile} from './mobile.js';
import {installInput} from './input.js';
import {createGameLoop} from './game-loop.js';
import {effectiveTimeScale,activityAttentionRequired} from '../systems/away/away.js';

export async function startApp({dispatchCommand=dispatch,audioOptions}={}){
 const app={state:newGame(),saved:null,started:false,editing:false,speed:1,lastNonzero:1,speedPaused:false,workSpeedOverride:null,toastTimer:null,lastLog:'',lastActivity:'',renderer:null,characterPreview:null,is3D:false,down:null,
  ui:{tab:'live',tool:'room',floor:'wood',selected:null,rotation:0,category:'All',hover:null,roomStart:null,edge:null}};
 try{app.saved=loadStored(localStorage);if(app.saved)app.state=app.saved;}catch{$('#save-status').textContent='Saved game unavailable. You can load a backup.';}
 app.dispatch=command=>{const result=dispatchCommand(app.state,command);app.audio?.receive(result);app.renderer?.body?.receive(result);return result;};
 app.send=(command,success)=>{const result=app.dispatch(command);app.errorOr(commandMessage(result),success);return result;};
 installViews(app);installControls(app);installPersistence(app);installAudio(app,audioOptions);
 await bootstrapRenderer(app);
 installCharacterCreator(app);installMobile(app);installSocial(app);installInput(app);
 app.effectiveSpeed=()=>effectiveTimeScale({activity:app.state.activity,selectedSpeed:app.speed,paused:app.paused(),attentionRequired:activityAttentionRequired(app.state.activity),override:app.workSpeedOverride});
 const loop=createGameLoop({now:performance.now(),paused:()=>app.paused(),hidden:()=>document.hidden,speed:()=>app.effectiveSpeed(),
  advance:dt=>{const wasWorking=app.state.activity?.kind==='work';const result=advance(app.state,dt);if(wasWorking&&app.state.activity?.kind!=='work'){app.workSpeedOverride=null;app.speedPaused=false;}app.audio.receive(result);app.renderer.body?.receive(result);},draw:t=>{app.renderer.draw(app.state,app.ui,t,{paused:app.paused(),hidden:document.hidden,speed:app.effectiveSpeed()});app.audio.frame();},
  preview:dt=>{if(app.characterPreview&&$('#creator').open)app.characterPreview.draw(dt);},refresh:()=>app.updateUI(),schedule:requestAnimationFrame});
 document.addEventListener('visibilitychange',()=>{loop.reset(performance.now());if(document.hidden){if(app.renderer.resetBodies)app.renderer.resetBodies();else app.renderer.body?.reset();}});
 const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 motion?.addEventListener('change',e=>{app.renderer.body.reducedMotion=e.matches;});
 if(new URLSearchParams(location.search).get('body')==='off')app.renderer.body.enabled=false;
 window.addEventListener('pageshow',event=>{if(event.persisted)installAudio(app,audioOptions);});
 app.renderStudio();app.updateUI(true);requestAnimationFrame(loop.frame);app.openCreator();
 return app;
}
