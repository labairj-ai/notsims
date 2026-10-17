import {writeFile,mkdir} from 'node:fs/promises';
import {simulateEconomy} from '../src/systems/economy/simulator.js';
const scenarios=[
 {name:'barista',career:'barista'},{name:'designer',career:'designer'},{name:'developer',career:'developer'},
 {name:'strong-performance',career:'developer',performance:90,skill:80},{name:'work-hard',strategy:'hard'},{name:'take-it-easy',strategy:'easy'},
 {name:'business-owner',career:'developer',ownedAssets:['cafe']},{name:'property-owner',ownedAssets:['cabin']},
 {name:'heavy-luxury',ownedAssets:['jet','yacht']},{name:'starter',cash:6500},
 {name:'business-ladder',career:'developer',days:1095,buyGoals:true,purchaseGoals:['micro_business','online_shop','cafe','duplex','commercial','hotel','yacht','island']},
 {name:'wealthy',career:'developer',cash:250000,ownedAssets:['hotel','commercial']}
];
const reports=scenarios.map(({name,...options})=>({name,...simulateEconomy({days:180,...options})}));
await mkdir('docs/reviews/evidence',{recursive:true});await writeFile('docs/reviews/evidence/economy-simulation.json',JSON.stringify(reports,null,2)+'\n');
console.table(reports.map(r=>({scenario:r.name,cash:Math.round(r.rows.at(-1).cash),netWorth:Math.round(r.rows.at(-1).netWorth),wages:r.totals.wages,businessNet:r.totals.businessGross-r.totals.operatingCost,bills:r.totals.bills,comfortableShifts:r.goals.queen_bed?.shifts,premiumShifts:r.goals.sports_car?.shifts,ultraDay:r.goals.yacht?.firstDay})));
