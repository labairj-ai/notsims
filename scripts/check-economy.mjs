import {writeFile,mkdir} from 'node:fs/promises';
import {compactReport,runBalanceSuite} from '../src/systems/economy/balance-contract.js';
const report=compactReport(runBalanceSuite());await mkdir('artifacts',{recursive:true});await writeFile('artifacts/economy-balance.json',JSON.stringify(report)+'\n');console.log(JSON.stringify(report.result));if(!report.result.passed)process.exitCode=1;
