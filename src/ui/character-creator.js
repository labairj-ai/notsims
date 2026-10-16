import {$} from './dom.js';
import {newGame} from '../game/session.js';
import {validateSave} from '../persistence/save.js';
import {drawCharacter} from '../render.js';
import {commandMessage} from './command-feedback.js';
export function installCharacterCreator(app){
function refreshCharacterPreview(){if(app.characterPreview)app.characterPreview.customize(fields());else drawCharacter($('#character-preview'),fields());}
function fields(){return {name:$('#character-name').value.trim()||'Alex Green',skin:$('#skin').value,hair:$('#hair').value,shirt:$('#shirt').value,style:$('#hairstyle').value,trait:$('#trait').value};}
app.openCreator=function(edit=false){app.editing=edit;$('#creator-close').hidden=!app.started;$('#lot-label').hidden=edit;$('#resume').hidden=edit||!app.saved;$('#begin').innerHTML=edit?'A little more you <span>↗</span>':'Let’s make a life <span>↗</span>';const p=app.state.person;$('#character-name').value=p.name;$('#skin').value=p.skin;$('#hair').value=p.hair;$('#shirt').value=p.shirt;$('#hairstyle').value=p.style;$('#trait').value=p.trait;refreshCharacterPreview();$('#creator').showModal();}
$('#character-form').addEventListener('input',()=>refreshCharacterPreview());
$('#character-form').onsubmit=e=>{e.preventDefault();if(app.editing){const result=app.dispatch({type:'CHANGE_APPEARANCE',appearance:fields()});if(!result.ok){app.toast(commandMessage(result));return;}}else{if(app.started&&!confirm('Start a new life? Download your current save from the menu first if you want to keep it.'))return;app.state=newGame(fields(),$('#lot').value==='empty');app.started=true;app.selectTab('live');}$('#creator').close();app.updateUI(true);app.save(true);app.toast(app.editing?'Looking good. Feeling like you.':'Welcome home. Click furniture to use it, or open Build to make it your own.');};
$('#creator').addEventListener('cancel',e=>{if(!app.started)e.preventDefault();});
$('#creator-close').onclick=()=>$('#creator').close();$('#edit-character').onclick=()=>app.openCreator(true);$('#new-game').onclick=()=>{$('#game-menu').close();app.openCreator(false);};
$('#resume').onclick=()=>{app.state=validateSave(app.saved);app.started=true;$('#creator').close();app.updateUI(true);app.toast('Welcome back. Your little world missed you.');};

}
