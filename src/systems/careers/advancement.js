import {JOBS} from '../../content/careers.js';
import {emit} from '../../core/events.js';
export function promotionStatus(s){
 const j=JOBS.find(j=>j.id===s.job);if(!j)return null;
 const c=s.career,next=j.levels[c.level+1];if(!next)return {level:j.levels[c.level],next:null,eligible:false,reasons:['Top career level reached']};
 const reasons=[];if(c.completedShifts<next.shifts)reasons.push(`Needs ${next.shifts-c.completedShifts} more completed shifts`);if(s.skill<next.skill)reasons.push(`Needs Skill ${next.skill}`);if(c.performance+1e-8<next.performance)reasons.push(`Needs Performance ${next.performance}`);if(c.attendanceDebt)reasons.push(`Complete ${c.attendanceDebt} reliable shifts after missed work`);if(c.lastPromotionDay===Math.floor(s.minutes/1440))reasons.push('Next promotion review is on another workday');
 return {level:j.levels[c.level],next,eligible:reasons.length===0,reasons};
}
export function reviewPromotion(s,events){const c=s.career;if(c.lastReviewedShift===s.shifts)return false;c.lastReviewedShift=s.shifts;c.completedShifts++;c.attendanceDebt=Math.max(0,c.attendanceDebt-1);c.lastReviewDay=Math.floor(s.minutes/1440);const status=promotionStatus(s);if(!status?.eligible)return false;c.level++;c.lastPromotionDay=c.lastReviewDay;emit(events,'CAREER_PROMOTED',{job:s.job,level:c.level,label:status.next.label});return true;}
