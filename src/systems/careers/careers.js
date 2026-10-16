import {emit} from '../../core/events.js';
import {JOBS} from '../../content/careers.js';
import {wageMultiplier} from './progression.js';
import {changeFunds} from '../economy/economy.js';
import {log} from '../../core/log.js';
export const jobDef=id=>JOBS.find(j=>j.id===id);
export const hourlyWage=(s,j=jobDef(s.job))=>Math.round(j.pay*wageMultiplier(s));
export const shiftPay=(s,j=jobDef(s.job))=>Math.round(j.pay*j.hours*wageMultiplier(s));
export function changeJob(s,id,events){
 if(!jobDef(id))return 'Invalid career.';
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before changing careers.';
 if(s.job!==id){s.job=id;emit(events,'JOB_CHANGED',{job:id});log(s,`A new chapter: ${jobDef(id).role}.`);}return null;
}
export function workActivity(s,elapsed=0){const j=jobDef(s.job);return {kind:'work',label:`Working · ${j.role}`,elapsed,total:j.hours*60,pay:shiftPay(s,j),path:[]};}
export function startShift(s){const j=jobDef(s.job);if(!j)return 'INVALID_CAREER';
 if(s.needs.energy<15){log(s,'Get some rest before starting a shift.');return 'LOW_ENERGY';}
 s.activity=workActivity(s);log(s,`Off to ${j.name.toLowerCase()}. Payday in ${j.hours} hours.`);
}
export function completeShift(s,a,events){changeFunds(s,a.pay,'shift',events);s.shifts++;emit(events,'SHIFT_COMPLETED',{job:s.job,pay:a.pay,shifts:s.shifts});log(s,`Shift complete. Earned $${a.pay}!${s.shifts%3===0?' Promotion! Your hourly rate increased.':''}`);}
