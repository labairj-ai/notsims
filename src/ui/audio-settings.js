import {$} from './dom.js';
import {saveSettings,browserSettingsStorage} from '../settings/settings.js';

export function installAudioSettings(app){
 const dialog=$('#audio-settings'),manager=app.audio.manager;
 function render(){
  $('#mute-all').checked=manager.settings.muted;
  for(const bus of ['master','music','sfx','ambience','ui']){const value=Math.round(manager.settings[bus]*100);$(`#volume-${bus}`).value=value;$(`#volume-${bus}-value`).textContent=`${value}%`;}
 }
 $('#audio-menu').onclick=()=>{$('#game-menu').close();render();dialog.showModal();};
 function persist(){saveSettings(browserSettingsStorage(),manager.settings);app.audio.settingsChanged();render();}
 $('#mute-all').onchange=e=>{manager.mute(e.target.checked);persist();};
 for(const bus of ['master','music','sfx','ambience','ui'])$(`#volume-${bus}`).oninput=e=>{manager.setBusGain(bus,Number(e.target.value)/100);persist();};
 render();
}
