import {commandMessage} from './command-feedback.js';
import {awayPolicy} from '../systems/away/away.js';
import {$,$$} from './dom.js';
import {NEEDS} from '../content/needs.js';
export function installControls(app){
 const ui=app.ui;
app.toast=function(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(app.toastTimer);app.toastTimer=setTimeout(()=>el.hidden=true,4200);}
app.errorOr=function(message,success){if(message)app.toast(message);else if(success)app.toast(success);app.updateUI(true);}
app.paused=function(){return !app.started||app.speedPaused||['build','shop'].includes(ui.tab)||!!$('dialog[open]');}
app.setSpeed=function(n){if(n===0){app.speedPaused=true;}else if(!!awayPolicy(app.state.activity)){app.workSpeedOverride=n;app.speedPaused=false;}else{app.speed=n;app.lastNonzero=n;app.speedPaused=false;}app.updateUI(true);}
app.resumeSpeed=function(){app.speedPaused=false;app.updateUI(true);}
app.useAutoWorkSpeed=function(){app.workSpeedOverride=null;app.speedPaused=false;app.updateUI(true);}
app.openAwayConflict=function(conflicts,command={type:'START_SHIFT'}){const dialog=$('#away-conflict'),list=$('#away-conflict-list');list.replaceChildren(...conflicts.map(c=>{const li=document.createElement('li');const day=Math.floor(c.minute/1440),m=Math.floor(c.minute%1440),hour=Math.floor(m/60),mins=m%60;li.textContent=`${c.label} · ${hour%12||12}:${String(mins).padStart(2,'0')} ${hour<12?'AM':'PM'}${day?` · Day ${day+1}`:''}`;return li;}));dialog.showModal();$('#away-work-anyway').onclick=()=>{dialog.close();const r=app.dispatch({...command,confirmedConflictIds:conflicts.map(c=>c.id)});if(r.code==='AWAY_CONFLICT')app.openAwayConflict(r.details.conflicts,command);else app.errorOr(commandMessage(r),'Your shift has started. Work fast-forwards automatically.');app.updateUI(true);};$('#away-cancel').onclick=()=>dialog.close();}
app.queueAction=function(kind){if(kind==='chat'){app.openPhone();return;}app.send({type:'QUICK_ACTION',kind});}
$('#needs').innerHTML=Object.entries(NEEDS).map(([id,[label,icon]])=>`<div><div class="need-label"><span>${icon}</span>${label}<span id="value-${id}" class="value">85</span></div><div class="need-track" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="85"><i id="need-${id}"></i></div></div>`).join('');
$$('[data-tab]').forEach(b=>b.onclick=()=>app.selectTab(b.dataset.tab));$$('[data-speed]').forEach(b=>b.onclick=()=>{if(['build','shop'].includes(ui.tab)&&+b.dataset.speed!==0)app.selectTab('live');app.setSpeed(+b.dataset.speed);});$$('.life-panel [data-action]').forEach(b=>b.onclick=()=>app.queueAction(b.dataset.action));
$('#cancel-action').onclick=()=>{app.dispatch({type:'CANCEL_ACTION'});app.updateUI(true);app.toast('A moment to yourself. Actions cleared.');};
$('#menu').onclick=()=>$('#game-menu').showModal();$$('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
$('#help').onclick=()=>{$('#game-menu').close();$('#help-dialog').showModal();};

}
