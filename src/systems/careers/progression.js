import {JOBS} from '../../content/careers.js';
import {emit} from '../../core/events.js';
import {clamp} from '../../core/math.js';
import {log} from '../../core/log.js';
export const wageMultiplier=(s,j=JOBS.find(j=>j.id===s.job))=>Math.max(s.career?.legacyWageBase??1,j?.levels[s.career?.level??0]?.payMultiplier??1)+s.skill*.005;
export function practice(s,events){s.skill=clamp(s.skill+1);emit(events,'SKILL_GAINED',{skill:s.skill});log(s,'A little practice goes a long way. Skill +1.');}
