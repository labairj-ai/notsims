import {assetDef} from '../../content/assets.js';
import {initialCareer} from '../../systems/careers/performance.js';
import {initialOwnership} from '../../systems/ownership/ownership.js';
import {initSocial} from '../../systems/social/social.js';
import {CURRENT_SAVE_VERSION} from '../schema.js';
// Map source version -> pure one-version migration. No production step is needed at v1.
export const MIGRATIONS=new Map([[1,s=>{initSocial(s);s.version=2;return s;}],[2,s=>{s.social.visits=Object.fromEntries(s.social.presences.map(p=>[p.personId,{lastVisitMinute:s.minutes,nextAllowedMinute:s.minutes+2880,introduced:true}]));s.social.sharedActivity=null;for(const r of Object.values(s.relationships))r.recentInteractions=[];s.version=3;return s;}],[3,s=>{s.career=initialCareer();s.ownership=initialOwnership();s.ownership.assets[0].lastPayout=s.minutes;if(s.activity?.kind==='work'){s.career.lastAttendanceDay=Math.floor(s.minutes/1440);s.activity.awayState??={};s.activity.awayState.strategy='normal';s.activity.awayState.strategyMinutes={normal:s.activity.elapsed,hard:0,easy:0,socialize:0};}s.version=4;return s;}],[4,s=>{s.career={...initialCareer(),...s.career,level:0,completedShifts:s.shifts,lastReviewedShift:s.shifts,lastPromotionDay:-1,lastReviewDay:-1,attendanceDebt:0,legacyWageBase:1+Math.min(20,Math.floor(s.shifts/3))*.15};for(const a of s.ownership.assets){if(assetDef(a.definitionId)?.kind==='business')a.legacyManagedUntil=a.managedUntil;}if(s.activity?.assetId){s.activity.legacyOwnedActivity=true;if(assetDef(s.ownership.assets.find(a=>a.id===s.activity.assetId)?.definitionId)?.kind!=='business')s.activity.ownedActivityId='legacy_visit';}s.version=5;return s;}]]);
export function migrateSave(input,{currentVersion=CURRENT_SAVE_VERSION,migrations=MIGRATIONS}={}){
 let s=structuredClone(input);
 if(!s||!Number.isInteger(s.version)||s.version<1||s.version>currentVersion)throw Error('This is not a valid Notsims save.');
 while(s.version<currentVersion){const from=s.version,step=migrations.get(from);if(!step)throw Error(`Missing save migration from version ${from}.`);s=step(structuredClone(s));if(s?.version!==from+1)throw Error('Invalid save migration.');}
 return s;
}
