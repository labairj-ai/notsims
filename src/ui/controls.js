import {$,$$} from './dom.js';
import {NEEDS} from '../content/needs.js';
export function installControls(app){
 const ui=app.ui;
app.toast=function(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(app.toastTimer);app.toastTimer=setTimeout(()=>el.hidden=true,4200);}
app.errorOr=function(message,success){if(message)app.toast(message);else if(success)app.toast(success);app.updateUI(true);}
app.paused=function(){return !app.started||app.speed===0||['build','shop'].includes(ui.tab)||!!$('dialog[open]');}
app.setSpeed=function(n){app.speed=n;if(n)app.lastNonzero=n;app.updateUI(true);}
app.queueAction=function(kind){app.send({type:'QUICK_ACTION',kind});}
$('#needs').innerHTML=Object.entries(NEEDS).map(([id,[label,icon]])=>`<div><div class="need-label"><span>${icon}</span>${label}<span id="value-${id}" class="value">85</span></div><div class="need-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="85"><i id="need-${id}"></i></div></div>`).join('');
$$('[data-tab]').forEach(b=>b.onclick=()=>app.selectTab(b.dataset.tab));$$('[data-speed]').forEach(b=>b.onclick=()=>{if(['build','shop'].includes(ui.tab)&&+b.dataset.speed!==0)app.selectTab('live');app.setSpeed(+b.dataset.speed);});$$('.life-panel [data-action]').forEach(b=>b.onclick=()=>app.queueAction(b.dataset.action));
$('#cancel-action').onclick=()=>{app.dispatch({type:'CANCEL_ACTION'});app.updateUI(true);app.toast('A moment to yourself. Actions cleared.');};
$('#menu').onclick=()=>$('#game-menu').showModal();$$('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
$('#help').onclick=()=>{$('#game-menu').close();$('#help-dialog').showModal();};

}
