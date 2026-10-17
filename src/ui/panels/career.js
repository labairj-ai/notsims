import {$} from '../dom.js';
import {commandMessage} from '../command-feedback.js';
import {JOBS} from '../../content/careers.js';
import {hourlyWage} from '../../systems/careers/careers.js';
import {money} from '../dom.js';
export function careerPanel({ui,state}){return `<span class="eyebrow">A LITTLE WORK, A LITTLE REWARD</span><h2>Find your thing.</h2><p class="intro">A new routine. A little independence.<br>Good things take a little work.</p><div data-away-status></div>${JOBS.map(j=>`<div class="career-card ${state.job===j.id?'active':''}"><div class="career-top"><span class="career-icon">${j.icon}</span><span class="wage">${money(hourlyWage(state,j))}<small> / hr</small></span></div><h3>${j.name}</h3><p>${j.role} · ${j.hours}-hour shift</p><p>${j.description}</p><button data-job="${j.id}" ${state.activity?.kind==='work'?'disabled':''}>${state.job===j.id?'Start a shift →':'Take the job ↗'}</button></div>`).join('')}<div class="career-stat"><b>${state.shifts}</b> shifts completed · <b>${state.skill}</b> learning points<br>Raise every 3 completed shifts. Practice skills with a desk or a bookcase to boost your pay.<br><br>Bills arrive every 3 days. Work fast-forwards automatically; pause or choose a speed any time.</div>`;}

export function bindCareerPanel(app,root){
 const ui=app.ui;
 root.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>{if(app.state.activity?.kind==='work')return;if(app.state.job!==b.dataset.job){const result=app.dispatch({type:'CHANGE_JOB',job:b.dataset.job});if(!result.ok){app.toast(commandMessage(result));return;}app.toast('You got the job! Start a shift whenever you’re ready.');app.renderStudio();}else{const r=app.dispatch({type:'START_SHIFT'});if(r.code==='AWAY_CONFLICT')app.openAwayConflict(r.details.conflicts);else app.errorOr(commandMessage(r),'Your shift has started. Work fast-forwards automatically.');}app.mobile?.selection(app.state.activity?.kind==='work');app.updateUI(true);});
}
