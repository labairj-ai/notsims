import {newGame,tick} from '../../game/session.js';
import {dispatch} from '../../game/dispatch.js';
import {JOBS} from '../../content/careers.js';
import {assetDef} from '../../content/assets.js';
import {itemDef} from '../../content/furniture.js';
import {householdNetWorth,advanceOwnership} from '../ownership/ownership.js';
import {chargeBills} from './bills.js';
// Daily household-care budget is explicit: meals/rest are assumed between shifts.
// Use the real shift, strategy, attendance, payout and billing systems for money.
export function simulateEconomy({career='barista',performance=50,strategy='normal',skill=0,days=90,cash=0,ownedAssets=[],purchaseGoals=['chair','queen_bed','sports_car','yacht'],livingCost=24,buyGoals=false}={}){
 if(!Number.isInteger(days)||days<1||days>3650||!JOBS.some(j=>j.id===career)||!Number.isFinite(cash)||!Number.isFinite(livingCost)||livingCost<0||!Number.isFinite(performance)||performance<0||performance>100||!Number.isFinite(skill)||skill<0||skill>100||!['normal','hard','easy','socialize'].includes(strategy))throw Error('Invalid simulation inputs.');
 const s=newGame();s.money=cash+ownedAssets.reduce((n,id)=>n+(assetDef(id)?.price??0),0);s.job=career;s.career.performance=performance;s.skill=skill;s.social.nextSocialOpportunityMinute=Number.MAX_SAFE_INTEGER;
 for(const id of ownedAssets){const r=dispatch(s,{type:'BUY_ASSET',definitionId:id});if(!r.ok)throw Error(`Invalid initial asset: ${id}`);}
 const goals=Object.fromEntries(purchaseGoals.map(id=>{const d=assetDef(id)??itemDef(id);if(!d)throw Error(`Invalid purchase goal: ${id}`);return [id,{price:d.price,firstDay:s.money>=d.price?0:null,shifts:s.money>=d.price?0:null}];}));
 const rows=[],totals={wages:0,businessGross:0,operatingCost:0,bills:0,livingCost:0};
 for(let day=0;day<days;day++){
  const j=JOBS.find(j=>j.id===career),events=[];s.minutes=day*1440+j.startMinute;
  // A management visit takes time on non-work days. Businesses are managed weekly.
  if(day%7===5)for(const a of s.ownership.assets){const d=assetDef(a.definitionId);if(d.kind==='business')a.managedUntil=s.minutes+d.managementInterval;}
  advanceOwnership(s,events);chargeBills(s,events);
  if(j.workDays.includes(day%7)){for(const n of Object.keys(s.needs))s.needs[n]=100;const started=dispatch(s,{type:'START_SHIFT'});if(!started.ok)throw Error(`Simulation shift failed: ${started.code}`);dispatch(s,{type:'SET_WORK_STRATEGY',strategy});for(let n=0;n<j.hours*60;n++){tick(s,1,events);if(s.activity?.awayState.workEvent?.id==='deadline'&&!s.activity.awayState.workEvent.resolved)events.push(...dispatch(s,{type:'RESOLVE_WORK_EVENT',choice:'focus'}).events);}}
  s.minutes=(day+1)*1440;advanceOwnership(s,events);chargeBills(s,events);s.money-=livingCost;totals.livingCost+=livingCost;
  for(const e of events){if(e.type==='SHIFT_COMPLETED')totals.wages+=e.pay;if(e.type==='BUSINESS_PAYOUT'){totals.businessGross+=e.gross;totals.operatingCost+=e.cost;}if(e.type==='BILL_CHARGED')totals.bills+=e.amount;}
  for(const [id,goal] of Object.entries(goals))if(goal.firstDay===null&&s.money>=goal.price){if(buyGoals&&assetDef(id)){const r=dispatch(s,{type:'BUY_ASSET',definitionId:id});if(!r.ok)continue;}goal.firstDay=day+1;goal.shifts=s.shifts;}
  rows.push({day:day+1,cash:s.money,netWorth:householdNetWorth(s),shifts:s.shifts,performance:s.career.performance,bills:totals.bills});
 }
 return {inputs:{career,performance,strategy,skill,days,cash,ownedAssets,livingCost,buyGoals},assumptions:['Daily care restores needs before work; $24/day default living cost.','Work events choose focus; businesses managed weekly.',buyGoals?'Large asset goals are purchased in listed order when affordable; furniture goals are savings benchmarks.':'Time-to-afford is a savings benchmark: goals are not purchased.'],rows,goals,totals,billIncomeRatio:totals.bills/Math.max(1,totals.wages+totals.businessGross-totals.operatingCost)};
}
