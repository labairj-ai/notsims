import {$} from './dom.js';
import {validateSave} from '../persistence/save.js';
export const STORAGE='notsims.save.v1';
export function loadStored(storage){const raw=storage.getItem(STORAGE);return raw?validateSave(raw):null;}
export function importSaveFile(file){if(file.size>2_000_000)throw Error('That file is too large to be a Notsims save.');return file.text().then(validateSave);}

export function installPersistence(app){
app.save=function(quiet=false){if(!app.started)return;try{localStorage.setItem(STORAGE,JSON.stringify(app.state));app.saved=structuredClone(app.state);$('#save-status').textContent=`Saved at ${new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}`;if(!quiet)app.toast('Your little life is saved.');}catch{$('#save-status').textContent='Autosave unavailable';if(!quiet)app.toast('Browser storage is unavailable. Download a save from the menu.');}}
$('#export').onclick=()=>{app.save(true);const blob=new Blob([JSON.stringify(app.state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`notsims-day-${Math.floor(app.state.minutes/1440)+1}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);app.toast('Save downloaded. Keep it somewhere lovely.');};
$('#import').onclick=()=>$('#import-file').click();$('#import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const loaded=await importSaveFile(f);if(!confirm(`Load ${loaded.person.name}’s game? This replaces the current browser save.`))return;app.state=loaded;app.saved=loaded;app.started=true;app.selectTab('live');app.save(true);$('#game-menu').close();app.updateUI(true);app.toast('Your little life, right where you left it.');}catch(err){app.toast(err.message||'Could not read this save.');}finally{e.target.value='';}};
setInterval(()=>app.save(true),20000);window.addEventListener('pagehide',()=>app.save(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)app.save(true);});

$('#save').onclick=()=>app.save();$('#manual-save').onclick=()=>app.save();

}
