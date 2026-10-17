import {ECONOMY_BALANCE} from '../../content/economy-balance.js';
import {ASSETS} from '../../content/assets.js';
import {CATALOG} from '../../content/furniture.js';
import {resaleValue} from '../../content/purchases.js';
import {REFUNDS} from '../../content/building.js';
import {JOBS} from '../../content/careers.js';
import {hourlyWage} from '../careers/careers.js';
import {newGame} from '../../game/session.js';
import {simulateEconomy} from './simulator.js';
export function businessBalanceRows(){return ASSETS.filter(d=>d.kind==='business').map(d=>{const managedNet=d.grossIncome-d.operatingCost-d.upkeep/3,unmanagedNet=Math.floor(d.grossIncome*.5)-d.operatingCost-d.upkeep/3;return {id:d.id,price:d.price,gross:d.grossIncome,operatingCost:d.operatingCost,upkeep:d.upkeep,managementMinutes:d.managementDuration,managementInterval:d.managementInterval,managedNet,unmanagedNet,managedPaybackDays:d.price/managedNet,unmanagedPaybackDays:d.price/unmanagedNet};});}
export function wageBalanceRows(){return JOBS.map(j=>({id:j.id,atShifts:simulateEconomy({career:j.id,days:150,skill:100,includeRows:false}).wageSnapshots,ceiling:Math.round(j.pay*ECONOMY_BALANCE.wages.multiplierCeiling)}));}
export function evaluateBalance(reports,contract=ECONOMY_BALANCE){const failures=[],check=(ok,label)=>{if(!ok)failures.push(label);},range=(v,b)=>Number.isFinite(v)&&v>=b[0]&&v<=b[1];
 for(const r of reports){const name=`${r.scenario}/${r.inputs.days}d`,b=contract.benchmarks;
  if(['barista','designer','developer'].includes(r.scenario)){
   check(range(r.goals[b.entry.id]?.shifts,b.entry.shifts),`${name}: entry affordability`);
   check(range(r.goals[b.comfortable.id]?.shifts,b.comfortable.shifts),`${name}: comfortable affordability`);
   check(r.billIncomeRatio<=contract.starter.maxBillIncomeRatio,`${name}: starter bill burden`);
   check(r.negativeCashDays<=contract.starter.maxNegativeCashDays,`${name}: starter solvency`);
   check(r.final.cash>=contract.starter.minCashAt180,`${name}: positive cash flow`);
   const ultra=r.goals[b.ultra.id]?.firstDay;check(ultra===null||ultra>=b.ultra.earliestWageOnlyDay,`${name}: Ultra too early`);
   const premium=r.goals[b.premium.id]?.firstDay;check(premium===null||premium>=b.premium.earliestDay,`${name}: Premium too early`);
   if(r.scenario==='developer'&&r.inputs.days>=b.premium.latestDeveloperDay)check(premium!==null,`${name}: Premium unreachable`);
  }
  if(r.scenario==='funded-starter')check(r.negativeCashDays===0,`${name}: funded starter debt`);
  if(r.scenario==='business-ladder'&&r.inputs.days>=b.ultra.ladderDay[1])check(range(r.goals[b.ultra.id]?.firstDay,b.ultra.ladderDay),`${name}: business ladder Ultra pacing`);
  if(r.scenario==='heavy-luxury'&&r.inputs.days===180){check(r.negativeCashDays>=contract.luxury.minimumNegativeCashDays,`${name}: luxury burden missing`);check(range(r.billIncomeRatio,contract.luxury.billIncomeRatio),`${name}: luxury cost outlier`);check(range(r.totals.bills,contract.luxury.billsAt180),`${name}: luxury upkeep bypass or runaway`);}
  for(const paid of Object.values(r.businessPayback??{})){const band=r.inputs.management==='none'?contract.business.actualUnmanagedPaybackDays:contract.business.actualManagedPaybackDays,elapsed=r.inputs.days-paid.purchaseMinute/1440;if(paid.firstDay!==null)check(range(paid.firstDay-paid.purchaseMinute/1440,band),`${name}: actual business payback`);else if(elapsed>=band[1])check(false,`${name}: business never paid back`);}
  check(r.totals.managementMinutes>=r.totals.managementVisits,`${name}: zero-time management`);
 }
 for(const b of businessBalanceRows()){check(range(b.managedPaybackDays,contract.business.managedPaybackDays),`${b.id}: managed payback`);check(range(b.unmanagedPaybackDays,contract.business.unmanagedPaybackDays),`${b.id}: unmanaged payback`);}
 for(const d of ASSETS)check(resaleValue(d)<=d.price,`${d.id}: asset arbitrage`);
 for(const d of CATALOG)check(Math.floor(d.price*REFUNDS.furniture)<=d.price,`${d.id}: furniture arbitrage`);
 for(const j of JOBS){const s=newGame();s.job=j.id;s.shifts=1e6;s.skill=100;if(s.career.level!==undefined)s.career.level=j.levels.length-1;check(hourlyWage(s,j)<=Math.round(j.pay*contract.wages.multiplierCeiling),`${j.id}: wage ceiling`);}
 return {version:contract.version,passed:failures.length===0,failures};
}
export function runBalanceSuite({horizons=ECONOMY_BALANCE.horizons,scenarioIds=null}={}){
 return ECONOMY_BALANCE.scenarios.filter(x=>!scenarioIds||scenarioIds.includes(x.id)).flatMap(({id,...options})=>horizons.map(days=>({scenario:id,...simulateEconomy({...options,days})})));
}
export function compactReport(reports){return {contractVersion:ECONOMY_BALANCE.version,result:evaluateBalance(reports),businesses:businessBalanceRows(),wages:wageBalanceRows(),scenarios:reports.map(({managementTrace,rows,...r})=>({...r,managementTraceSample:managementTrace.slice(0,4),rows:rows.filter((row,i)=>i===0||(i+1)%30===0||i===rows.length-1)}))};}
