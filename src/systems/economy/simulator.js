import {hourlyWage} from '../careers/careers.js';
import {newGame} from '../../game/session.js';
import {dispatch,advance} from '../../game/dispatch.js';
import {validateSave} from '../../persistence/save.js';
import {JOBS} from '../../content/careers.js';
import {assetDef} from '../../content/assets.js';
import {itemDef} from '../../content/furniture.js';
import {householdNetWorth,upkeepFor,ownedValue} from '../ownership/ownership.js';
import {changeFunds} from './economy.js';

// Controlled initial capital/needs/clock fixtures isolate economic balance.
// After setup every minute, management reward, shift and payout uses production code.
export function simulateEconomy(options={}){
 const {career='barista',performance=50,strategy='normal',skill=0,days=90,cash=0,ownedAssets=[],purchaseGoals=['chair','queen_bed','sports_car','yacht'],livingCost=24,buyGoals=false,management='after-work',conflictPolicy='defer',lateMinutes=0,missEvery=0,skillPractice=false,socialPlans=[],reloadDuringManagement=false,includeRows=true}=options;
 if(!Number.isInteger(days)||days<1||days>3650||!JOBS.some(j=>j.id===career)||!Number.isFinite(cash)||!Number.isFinite(livingCost)||livingCost<0||!Number.isFinite(performance)||performance<0||performance>100||!Number.isFinite(skill)||skill<0||skill>100||!['normal','hard','easy','socialize'].includes(strategy)||!['after-work','before-work','none'].includes(management)||!['defer','accept'].includes(conflictPolicy)||!Number.isInteger(lateMinutes)||lateMinutes<0||lateMinutes>240||!Number.isInteger(missEvery)||missEvery<0||!Array.isArray(socialPlans)||socialPlans.length>12)throw Error('Invalid simulation inputs.');
 let s=newGame();s.minutes=0;s.money=cash+ownedAssets.reduce((n,id)=>n+(assetDef(id)?.price??0),0);s.social.nextSocialOpportunityMinute=900000000;
 const must=c=>{const r=dispatch(s,c);if(!r.ok)throw Error(`Simulation command ${c.type}: ${r.code}`);return r;};
 must({type:'CHANGE_JOB',job:career});s.career.performance=performance;s.skill=skill;
 for(const id of ownedAssets)must({type:'BUY_ASSET',definitionId:id});
 for(const plan of socialPlans)must({type:'INVITE_OVER',personId:'person_1',startMinute:plan.startMinute});
 const j=JOBS.find(j=>j.id===career),goals=Object.fromEntries(purchaseGoals.map(id=>{const d=assetDef(id)??itemDef(id);if(!d)throw Error(`Invalid purchase goal: ${id}`);return [id,{price:d.price,firstDay:!buyGoals&&s.money>=d.price?0:null,shifts:!buyGoals&&s.money>=d.price?0:null}];}));
 const rows=[],totals={wages:0,businessGross:0,operatingCost:0,bills:0,livingCost:0,managementMinutes:0,managementVisits:0,completedShifts:0,lateShifts:0,missedShifts:0,conflicts:0,busyManagement:0,careResets:0,practiceMinutes:0,purchases:0,assetUpkeep:0};
 const milestones=Object.fromEntries([10000,100000,1000000,5000000,25000000].map(n=>[n,{cashDay:cash>=n?0:null,netWorthDay:householdNetWorth(s)>=n?0:null}]));
 const wageSnapshots=[{shifts:0,hourly:hourlyWage(s,j),level:s.career.level}],managementTrace=[],purchaseTrace=[],businessPayback={};let negativeCashDays=0,minimumCash=s.money;
 function observe(events){for(const e of events){
  if(e.type==='SHIFT_COMPLETED'){totals.wages+=e.pay;totals.completedShifts++;if([10,25,50,100].includes(totals.completedShifts))wageSnapshots.push({shifts:totals.completedShifts,hourly:hourlyWage(s,j),level:s.career.level});}
  if(e.type==='SHIFT_MISSED')totals.missedShifts++;
  if(e.type==='BUSINESS_PAYOUT'){totals.businessGross+=e.gross;totals.operatingCost+=e.cost;const paid=businessPayback[e.assetId];if(paid){paid.net+=e.amount;if(paid.firstDay===null&&paid.net>=paid.price)paid.firstDay=s.minutes/1440;}}
  if(e.type==='BILL_CHARGED'){totals.bills+=e.amount;totals.assetUpkeep+=(e.breakdown??[]).slice(1).reduce((n,x)=>n+x.amount,0);for(const a of s.ownership.assets)if(businessPayback[a.id])businessPayback[a.id].net-=assetDef(a.definitionId).upkeep;}
  if(e.type==='BUSINESS_MANAGED'){totals.managementVisits++;managementTrace.push({assetId:e.assetId,minute:s.minutes,type:e.type});}
 }}
 function elapse(minutes){while(minutes>0){const amount=Math.min(minutes,60);minutes-=amount;const a=s.activity;if(a?.assetId&&assetDef(s.ownership.assets.find(x=>x.id===a.assetId)?.definitionId)?.kind==='business')totals.managementMinutes+=Math.min(amount,a.total-a.elapsed);const r=advance(s,amount);observe(r.events);if(s.activity?.awayState?.workEvent?.id==='deadline'&&!s.activity.awayState.workEvent.resolved)observe(must({type:'RESOLVE_WORK_EVENT',choice:'focus'}).events);}}
 function until(minute){if(minute>s.minutes)elapse(minute-s.minutes);}
 function care(){for(const n of Object.keys(s.needs))s.needs[n]=100;totals.careResets++;}
 function manage(dayEnd){if(management==='none')return;for(const a of s.ownership.assets){const d=assetDef(a.definitionId);if(d.kind!=='business'||a.managedUntil>s.minutes+1440||s.minutes>=dayEnd)continue;
  care();let r=dispatch(s,{type:'MANAGE_BUSINESS',assetId:a.id});
  if(r.code==='AWAY_CONFLICT'){totals.conflicts++;managementTrace.push({assetId:a.id,minute:s.minutes,type:'AWAY_CONFLICT',conflictIds:r.details.conflicts.map(x=>x.id)});if(conflictPolicy==='accept')r=dispatch(s,{type:'MANAGE_BUSINESS',assetId:a.id,confirmedConflictIds:r.details.conflicts.map(x=>x.id)});}
  if(!r.ok){if(r.code==='BUSY')totals.busyManagement++;continue;}
  managementTrace.push({assetId:a.id,minute:s.minutes,type:'ACTION_STARTED',duration:s.activity.total});
  if(reloadDuringManagement){elapse(Math.min(1,s.activity.total));if(s.activity)s=validateSave(s);}
  if(s.activity)elapse(s.activity.total-s.activity.elapsed);
 }}
 function buy(){for(const [id,goal] of Object.entries(goals)){if(goal.firstDay!==null||s.money<goal.price)continue;if(buyGoals&&assetDef(id)){const r=dispatch(s,{type:'BUY_ASSET',definitionId:id});if(!r.ok)continue;totals.purchases+=goal.price;const a=s.ownership.assets.at(-1);purchaseTrace.push({definitionId:id,assetId:a.id,minute:s.minutes,price:goal.price});if(assetDef(id).kind==='business')businessPayback[a.id]={price:goal.price,purchaseMinute:s.minutes,net:0,firstDay:null};}goal.firstDay=s.minutes/1440;goal.shifts=s.shifts;}}
 for(const a of s.ownership.assets){const d=assetDef(a.definitionId);if(d.kind==='business')businessPayback[a.id]={price:d.price,purchaseMinute:0,net:0,firstDay:null};}
 for(let day=0;day<days;day++){
  const dayEnd=(day+1)*1440,start=day*1440+j.startMinute;
  until(day*1440+300);if(management==='before-work')manage(dayEnd);
  if(j.workDays.includes(day%7)&&!(missEvery&&(day+1)%missEvery===0)){
   until(start+lateMinutes);care();const result=dispatch(s,{type:'START_SHIFT'});
   if(result.ok){if(s.minutes>start)totals.lateShifts++;must({type:'SET_WORK_STRATEGY',strategy});elapse(s.activity.total);}
  }
  if(management==='after-work'){until(j.workDays.includes(day%7)?start+j.hours*60:day*1440+540);manage(dayEnd);}
  if(skillPractice&&s.minutes+60<=dayEnd&&!s.activity){care();const book=s.furniture.find(f=>f.type==='bookcase');const r=dispatch(s,{type:'INTERACT',id:book.id});if(r.ok){elapse(1);if(s.activity){const duration=(s.activity.path?.length??0)*2+s.activity.total-s.activity.elapsed;totals.practiceMinutes+=duration;elapse(duration);}}}
  until(dayEnd);changeFunds(s,-livingCost,'simulation_living_cost');totals.livingCost+=livingCost;for(const [n,m] of Object.entries(milestones)){if(m.cashDay===null&&s.money>=+n)m.cashDay=s.minutes/1440;if(m.netWorthDay===null&&householdNetWorth(s)>=+n)m.netWorthDay=s.minutes/1440;}buy();
  const worth=householdNetWorth(s);for(const [n,m] of Object.entries(milestones)){if(m.cashDay===null&&s.money>=+n)m.cashDay=s.minutes/1440;if(m.netWorthDay===null&&worth>=+n)m.netWorthDay=s.minutes/1440;}
  if(s.money<0)negativeCashDays++;minimumCash=Math.min(minimumCash,s.money);
  if(includeRows)rows.push({day:day+1,minute:s.minutes,cash:s.money,netWorth:worth,shifts:s.shifts,performance:s.career.performance,level:s.career.level??0,bills:totals.bills,managementHours:totals.managementMinutes/60});
 }
 const income=totals.wages+totals.businessGross-totals.operatingCost;
 return {inputs:{career,performance,strategy,skill,days,cash,ownedAssets,livingCost,buyGoals,management,conflictPolicy,lateMinutes,missEvery,skillPractice},assumptions:['All elapsed game minutes use canonical advance; activities never overlap.','Needs reset before major activities with no time cost (balance isolation); living costs are explicit.','Unprompted visits disabled in setup; authored social conflicts remain active.','Work choices select focus. Management conflicts defer unless explicitly configured to accept.'],rows,goals,totals,milestones,wageSnapshots,managementTrace,purchaseTrace,businessPayback,billIncomeRatio:totals.bills/Math.max(1,income),upkeepIncomeRatio:totals.assetUpkeep/Math.max(1,income),ownershipBurden:upkeepFor(s).reduce((n,x)=>n+x.amount,0)/3,negativeCashDays,minimumCash,liquidationValue:ownedValue(s),final:{minute:s.minutes,cash:s.money,netWorth:householdNetWorth(s),shifts:s.shifts,performance:s.career.performance,level:s.career.level??0},managementHours:totals.managementMinutes/60};
}
