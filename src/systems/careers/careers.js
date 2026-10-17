import {reviewPromotion} from './advancement.js';
import {initialCareer,shiftWindow,finishPerformance} from './performance.js';
import {emit} from '../../core/events.js';
import {JOBS} from '../../content/careers.js';
import {wageMultiplier} from './progression.js';
import {changeFunds} from '../economy/economy.js';
import {log} from '../../core/log.js';
export const jobDef=id=>JOBS.find(j=>j.id===id);
export const hourlyWage=(s,j=jobDef(s.job))=>Math.round(j.pay*wageMultiplier(s,j));
export const shiftPay=(s,j=jobDef(s.job))=>Math.round(j.pay*j.hours*wageMultiplier(s,j));
export function changeJob(s,id,events){
 if(!jobDef(id))return 'Invalid career.';
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before changing careers.';
 if(s.job!==id){s.job=id;s.career=initialCareer();emit(events,'JOB_CHANGED',{job:id});log(s,`A new chapter: ${jobDef(id).role}.`);}return null;
}
export function workActivity(s,elapsed=0,awayState=null){const j=jobDef(s.job);return {kind:'work',label:`Working · ${j.role}`,elapsed,total:j.hours*60,pay:shiftPay(s,j),path:[],awayState:awayState??{bladderCooldown:0,mealBreakUsed:false,care:null,careNotice:null,attentionRequired:false}};}
export function startShift(s){const j=jobDef(s.job);if(!j)return 'INVALID_CAREER';
 if(s.needs.energy<15){log(s,'Get some rest before starting a shift.');return 'LOW_ENERGY';}
 const window=shiftWindow(s);if(!window?.canAttend)return 'SHIFT_UNAVAILABLE';s.career.lastAttendanceDay=window.day;s.activity=workActivity(s);s.activity.total=window.end-s.minutes;s.activity.pay=Math.round(shiftPay(s,j)*s.activity.total/(j.hours*60));s.activity.awayState.latePenalty=window.late?1:0;log(s,`Off to ${j.name.toLowerCase()}. Payday in ${j.hours} hours.`);
}
export function completeShift(s,a,events){finishPerformance(s,a,events);changeFunds(s,a.pay,'shift',events);s.shifts++;const promoted=reviewPromotion(s,events);emit(events,'SHIFT_COMPLETED',{job:s.job,pay:a.pay,shifts:s.shifts});log(s,`Shift complete. Earned $${a.pay}!${promoted?' Promotion! Your hourly rate increased.':''}`);}
