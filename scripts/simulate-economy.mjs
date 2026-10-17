import {writeFile,mkdir} from 'node:fs/promises';
import {compactReport,runBalanceSuite} from '../src/systems/economy/balance-contract.js';
const report=compactReport(runBalanceSuite());
await mkdir('docs/reviews/evidence',{recursive:true});await writeFile('docs/reviews/evidence/economy-simulation.json',JSON.stringify(report,null,2)+'\n');
console.table(report.scenarios.filter(r=>r.inputs.days===180||r.scenario==='business-ladder').map(r=>({scenario:r.scenario,days:r.inputs.days,cash:Math.round(r.final.cash),netWorth:Math.round(r.final.netWorth),managementHours:r.managementHours,shifts:r.totals.completedShifts,late:r.totals.lateShifts,missed:r.totals.missedShifts,yachtDay:r.goals.yacht?.firstDay})));
console.log(JSON.stringify(report.result));if(!report.result.passed)process.exitCode=1;
