import {WORK_STRATEGIES,shiftWindow} from '../systems/careers/performance.js';
import {awayPolicy} from '../systems/away/away.js';
import {$,$$,money,esc} from './dom.js';
import {NEEDS} from '../content/needs.js';
import {itemDef} from '../content/furniture.js';
import {mood} from '../systems/needs/mood.js';
import {drawThumbnail,portraitSVG} from '../render.js';
import {commandMessage} from './command-feedback.js';
import {livePanel,bindLivePanel} from './panels/live.js';
import {buildPanel,bindBuildPanel} from './panels/build.js';
import {furnishPanel,bindFurnishPanel} from './panels/furnish.js';
import {careerPanel,bindCareerPanel} from './panels/career.js';

export function installViews(app){
 const ui=app.ui;
app.selectTab=function(tab){ui.tab=tab;ui.roomStart=null;ui.selected=null;$('#object-popup').hidden=true;$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));app.renderStudio();app.updateUI(true);}
app.renderStudio=function(){const root=$('#studio-content');
 if(ui.tab==='live')root.innerHTML=livePanel({ui,state:app.state});
 if(ui.tab==='build')root.innerHTML=buildPanel({ui,state:app.state});
 if(ui.tab==='shop')root.innerHTML=furnishPanel({ui,state:app.state});
 if(ui.tab==='career')root.innerHTML=careerPanel({ui,state:app.state});
 ({live:bindLivePanel,build:bindBuildPanel,shop:bindFurnishPanel,career:bindCareerPanel}[ui.tab])(app,root);
 $$('[data-thumb]').forEach(c=>drawThumbnail(c,c.dataset.thumb));app.lastLog='';app.lastActivity='';
}
app.updateUI=function(force=false){
 $('#money').textContent=money(app.state.money);$('#person-name').textContent=app.state.person.name;$('#mood').textContent=mood(app.state);
 if(force)$('#portrait').innerHTML=portraitSVG(app.state.person);
 for(const n of Object.keys(NEEDS)){const v=Math.round(app.state.needs[n]),bar=$(`#need-${n}`);bar.style.width=`${v}%`;bar.style.background=v<25?'#c77e60':v<50?'#c5ad71':'#9fac80';$(`#value-${n}`).textContent=v;bar.parentElement.setAttribute('aria-valuenow',v);}
 $('#needs-label').textContent=Math.min(...Object.values(app.state.needs))<25?'NEEDS SOME LOVE':'ALL IS WELL';
 const day=Math.floor(app.state.minutes/1440),m=Math.floor(app.state.minutes%1440),hour=Math.floor(m/60),mins=m%60;
 $('#clock').textContent=`${hour%12||12}:${String(mins).padStart(2,'0')} ${hour<12?'AM':'PM'}`;$('#weekday').textContent=`${['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'][day%7]} · DAY ${day+1}`;
 $('#weather').textContent=hour>=6&&hour<20?'☀':'☾';$('#day-label').innerHTML=`${hour<6?'A quiet little night':hour<12?'A little morning magic':hour<17?'An afternoon to yourself':hour<20?'The golden little hours':'Home under the stars'}<small>DAY ${day+1} IN WILLOW GROVE</small>`;
 const p=app.paused(),a=app.state.activity,effective=app.effectiveSpeed?.()??app.speed,activeSpeed=p?0:!!awayPolicy(a)?(app.workSpeedOverride??(effective===24?24:app.speed)):app.speed;$$('[data-speed]').forEach(b=>b.classList.toggle('active',+b.dataset.speed===activeSpeed));$('#speed-label').textContent=p?'Ⅱ':!!awayPolicy(a)?(app.workSpeedOverride===null&&effective===24?'AUTO 24×':`${effective}×`):`${effective}×`;
 $('#activity-label').textContent=a?a.awayState?.care?({bathroom_break:'Bathroom break',meal_break:'Lunch break'}[a.awayState.care.kind]):a.label:p?'Taking a little pause':'Enjoying the possibilities';$('#activity-icon').textContent=!!awayPolicy(a)?'▱':a?.need==='energy'?'☾':'✦';$('#activity-progress').style.width=a?`${Math.min(100,a.elapsed/a.total*100)}%`:'0';$('#queue-label').textContent=app.state.queue.length?`+ ${app.state.queue.length} thing${app.state.queue.length>1?'s':''} to do`:'';$('#cancel-action').style.visibility=a||app.state.queue.length?'visible':'hidden';
 $('#mode-hint').textContent=ui.tab==='build'?({room:'Drag corner to corner to draw a room. Time is paused.',floor:'Click a tile to lay your chosen floor. $12 per tile.',wall:'Click near a tile edge to build a wall. $18 per edge.',door:'Click a wall edge to add an entrance. $35 per door.',erase:'Click furniture to sell, or an empty tile to remove a wall / floor.'}[ui.tool]):ui.tab==='shop'?(ui.selected?`${itemDef(ui.selected).name} · ${money(itemDef(ui.selected).price)} · R to rotate · Esc to cancel`:'Choose a favorite from the shop, then click a clear floor.'): 'Click to wander. Click an object to make yourself at home.';
 if($('#story-list')&&JSON.stringify(app.state.log)!==app.lastLog){app.lastLog=JSON.stringify(app.state.log);$('#story-list').innerHTML=app.state.log.slice(0,5).map(l=>`<div class="story-entry">${esc(l)}</div>`).join('');}
 const sig=`${app.state.job}:${app.state.shifts}:${app.state.skill}:${!!awayPolicy(a)}:${shiftWindow(app.state)?.canAttend}:${app.state.career.performance}:${app.state.career.level}:${app.state.career.attendanceDebt}`;if(ui.tab==='career'&&sig!==app.lastActivity){app.lastActivity=sig;app.renderStudio();app.lastActivity=sig;}
 const awayHTML=!!awayPolicy(a)?`<section class="away-status"><b>${a.kind==='work'?'WORKING':'AWAY'} · ${esc(a.label.replace('Working · ','').toUpperCase())}</b><span>${Math.floor((a.total-a.elapsed)/60)}h ${Math.floor((a.total-a.elapsed)%60)}m remaining</span><small>${a.awayState?.care?({bathroom_break:'Taking a bathroom break',meal_break:'Having lunch'}[a.awayState.care.kind]):p?'Paused':app.workSpeedOverride===null?'Auto fast-forward · 24×':`Manual speed · ${effective}×`}</small>${a.kind==='work'?`<label>Strategy <select data-work-strategy>${Object.entries(WORK_STRATEGIES).map(([id,d])=>`<option value="${id}" ${id===(a.awayState?.strategy??'normal')?'selected':''}>${d.label}</option>`).join('')}</select></label><small>Hard: +4 performance, more Energy/Fun cost. Easy: −2, less drain. Socialize: −1, more Social. Effects scale with time.</small>${a.awayState?.workEvent?.id==='deadline'&&!a.awayState.workEvent.resolved?'<p>A deadline is slipping.</p><button data-work-choice="help">Help the team</button><button data-work-choice="focus">Focus on your work</button><button data-work-choice="ask">Ask Sam for help</button>':''}`:''}${app.workSpeedOverride!==null?'<button data-away-auto>Return to Auto 24×</button>':''}</section>`:'';$$('[data-away-status]').forEach(x=>{if(!x.contains(document.activeElement)||!document.activeElement?.matches('[data-work-strategy]'))x.innerHTML=awayHTML;});$$('[data-away-auto]').forEach(b=>b.onclick=()=>app.useAutoWorkSpeed());$$('[data-work-strategy]').forEach(el=>el.onchange=()=>app.send({type:'SET_WORK_STRATEGY',strategy:el.value}));$$('[data-work-choice]').forEach(b=>b.onclick=()=>app.send({type:'RESOLVE_WORK_EVENT',choice:b.dataset.workChoice}));const w=shiftWindow(app.state);$$('[data-schedule]').forEach(el=>el.textContent=w?`Next shift · Day ${w.day+1} · ${Math.floor(w.start%1440/60)}:00 · ${w.canAttend?'Time for work':`starts in ${Math.max(0,Math.ceil(w.start-app.state.minutes))} minutes`}`:'Choose a career.');
}

}
