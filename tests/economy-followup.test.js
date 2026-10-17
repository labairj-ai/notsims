import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {simulateEconomy} from '../src/systems/economy/simulator.js';
import {assetDef} from '../src/content/assets.js';

test('simulator manages through real two-hour Away completions and persists a mid-visit reload',()=>{
 const options={career:'developer',ownedAssets:['cafe'],days:15};const a=simulateEconomy(options),b=simulateEconomy({...options,reloadDuringManagement:true});assert.equal(a.totals.managementVisits,2);assert.equal(a.managementHours,4);assert.deepEqual(a.totals,b.totals);assert.deepEqual(a.final,b.final);const starts=a.managementTrace.filter(e=>e.type==='ACTION_STARTED'),ends=a.managementTrace.filter(e=>e.type==='BUSINESS_MANAGED');for(let i=0;i<starts.length;i++)assert.equal(ends[i].minute-starts[i].minute,assetDef('cafe').managementDuration);
});
test('management cannot overlap work; accepted conflicts consume time and can shorten or miss a shift',()=>{
 const d=assetDef('cafe'),duration=d.managementDuration,interval=d.managementInterval;try{d.managementDuration=360;d.managementInterval=4320;const base={career:'developer',ownedAssets:['cafe'],days:15,management:'before-work'};const deferred=simulateEconomy(base),accepted=simulateEconomy({...base,conflictPolicy:'accept'});assert.ok(deferred.totals.conflicts>0);assert.ok(deferred.totals.managementVisits<accepted.totals.managementVisits);assert.ok(accepted.totals.missedShifts>0);assert.ok(accepted.totals.wages<simulateEconomy({...base,management:'after-work'}).totals.wages);assert.equal(accepted.managementHours,accepted.totals.managementVisits*6);}finally{d.managementDuration=duration;d.managementInterval=interval;}
});
test('management duration is content driven, multiple visits take time, and unmanaged policy is canonical',()=>{
 const options={career:'developer',ownedAssets:['cafe','online_shop'],days:15};const managed=simulateEconomy(options),unmanaged=simulateEconomy({...options,management:'none'});assert.equal(managed.managementHours,7);assert.ok(managed.totals.businessGross>unmanaged.totals.businessGross);const d=assetDef('online_shop'),duration=d.managementDuration;try{d.managementDuration=180;assert.equal(simulateEconomy(options).managementHours,10);}finally{d.managementDuration=duration;}assert.deepEqual(simulateEconomy(options),managed);
 assert.doesNotMatch(readFileSync(new URL('../src/systems/economy/simulator.js',import.meta.url),'utf8'),/\.(?:managedUntil|lastPayout)\s*=(?!=)/);
});

import {ECONOMY_BALANCE} from '../src/content/economy-balance.js';
import {evaluateBalance,runBalanceSuite,businessBalanceRows} from '../src/systems/economy/balance-contract.js';
import {newGame,tick} from '../src/game/session.js';
import {dispatch} from '../src/game/dispatch.js';
import {promotionStatus,reviewPromotion} from '../src/systems/careers/advancement.js';
import {hourlyWage} from '../src/systems/careers/careers.js';
import {validateSave,serializeSave} from '../src/persistence/save.js';
import {ASSETS} from '../src/content/assets.js';
import {ASSET_EXPERIENCES,PROPERTY_TEMPLATES} from '../src/content/asset-experiences.js';
import {collectionSummary,upkeepFor} from '../src/systems/ownership/ownership.js';
const send=(s,c)=>{const r=dispatch(s,c);assert.equal(r.ok,true,JSON.stringify(r));return r;};

test('versioned balance policy protects starter affordability, solvency, business payback, resale and luxury upkeep',()=>{
 assert.ok(ECONOMY_BALANCE.version>=2);const reports=runBalanceSuite({horizons:[180],scenarioIds:['barista','designer','developer','funded-starter','heavy-luxury']});assert.equal(evaluateBalance(reports).passed,true);
 const broken=structuredClone(reports);broken[0].goals.queen_bed.shifts=100;broken[0].negativeCashDays=1;assert.equal(evaluateBalance(broken).passed,false);
 const b=assetDef('cafe'),gross=b.grossIncome;try{b.grossIncome=1e8;assert.ok(evaluateBalance(reports).failures.some(x=>x.includes('payback')));}finally{b.grossIncome=gross;}
 assert.ok(businessBalanceRows().every(b=>b.managedNet>b.unmanagedNet&&Number.isFinite(b.unmanagedPaybackDays)));
});
test('promotion needs declared performance, experience, skill and attendance; one review day cannot grant multiple promotions',()=>{
 const s=newGame();s.job='developer';s.minutes=1020;s.shifts=30;s.career.completedShifts=30;s.career.level=1;s.career.performance=100;s.skill=0;assert.equal(promotionStatus(s).eligible,false);assert.ok(promotionStatus(s).reasons.includes('Needs Skill 10'));s.skill=100;s.career.performance=30;assert.equal(promotionStatus(s).eligible,false);s.career.performance=90;s.career.attendanceDebt=2;assert.equal(promotionStatus(s).eligible,false);s.career.attendanceDebt=0;s.shifts++;const events=[];assert.equal(reviewPromotion(s,events),true);assert.equal(s.career.level,2);assert.equal(reviewPromotion(s,events),false);assert.equal(events.filter(e=>e.type==='CAREER_PROMOTED').length,1);const restored=validateSave(serializeSave(s));assert.deepEqual(promotionStatus(restored),promotionStatus(s));
 const floor=hourlyWage(s);s.career.level=4;s.shifts=1e9;assert.ok(hourlyWage(s)<=Math.round(38*ECONOMY_BALANCE.wages.multiplierCeiling));assert.ok(hourlyWage(s)>floor);
});
test('performance recovers, ordinary work does not park at 100, and strategies change advancement rather than directly multiplying pay',()=>{
 const base={career:'developer',days:120,skillPractice:true,includeRows:false};const normal=simulateEconomy(base),hard=simulateEconomy({...base,strategy:'hard'}),easy=simulateEconomy({...base,strategy:'easy'}),recover=simulateEconomy({...base,performance:5});assert.ok(normal.final.performance<95&&normal.final.performance>55);assert.ok(recover.final.performance>50);assert.ok(hard.final.level>easy.final.level);assert.ok(hard.totals.wages>easy.totals.wages);assert.ok(normal.final.level>=easy.final.level);
 const a=newGame();a.job='developer';const wage=hourlyWage(a);a.career.performance=100;assert.equal(hourlyWage(a),wage);
});
test('v3 and v4 fixtures migrate once to v5, preserve money/furniture/social state and keep earned v4 wages',()=>{
 for(const version of [3,4]){const input=JSON.parse(readFileSync(new URL(`./fixtures/save-v${version}.json`,import.meta.url))),before=structuredClone(input),s=validateSave(input);assert.equal(s.version,5);for(const field of ['money','furniture','relationships','people','social'])assert.deepEqual(s[field],input[field],field);assert.deepEqual(input,before);assert.deepEqual(validateSave(serializeSave(s)),s);if(version===4)assert.equal(s.activity.pay,input.activity.pay);}
});
test('existing Premium and Ultra content retains distinctive templates, experiences and management roles',()=>{
 const ids=['cabin','condo','penthouse','estate','island'];assert.equal(new Set(ids.map(id=>PROPERTY_TEMPLATES[id].id)).size,5);for(const id of [...ids,'luxury_car','sports_car','supercar','jet','yacht']){assert.ok(ASSET_EXPERIENCES[id]?.length);assert.ok(assetDef(id).experienceIds.length);}
 assert.notEqual(assetDef('micro_business').managementDuration,assetDef('hotel').managementDuration);assert.notEqual(assetDef('micro_business').managementInterval,assetDef('hotel').managementInterval);
 for(const def of Object.values(ASSET_EXPERIENCES).flat())assert.ok(Object.values(def.effects).every(n=>n<=35));assert.ok(ASSETS.length===23);
});
test('three residences retain distinct templates and independent global furniture IDs across reloads',()=>{
 let s=newGame();s.money=1e8;const owned=[];for(const definitionId of ['cabin','condo','penthouse']){send(s,{type:'BUY_ASSET',definitionId});owned.push(s.ownership.assets.at(-1).id);}const templates=[];const placed=[];
 for(const id of owned){send(s,{type:'SWITCH_RESIDENCE',assetId:id});templates.push(JSON.stringify(s.floors));const pos=Object.keys(s.floors).map(k=>k.split(',').map(Number)).find(([x,y])=>x!==s.person.x||y!==s.person.y);send(s,{type:'PLACE_OBJECT',object:'chair',x:pos[0],y:pos[1]});placed.push(s.furniture[0].id);s=validateSave(serializeSave(s));}
 assert.equal(new Set(templates).size,3);assert.equal(new Set(placed).size,3);for(const [i,id] of owned.entries()){send(s,{type:'SWITCH_RESIDENCE',assetId:id});assert.equal(s.furniture[0].id,placed[i]);}
});
test('owned yacht outing uses canonical social memory, costs once, resumes once, and sale removes its affordance',()=>{
 const s=newGame();s.money=1e8;const relationships=structuredClone(s.relationships);send(s,{type:'BUY_ASSET',definitionId:'yacht'});const id=s.ownership.assets.at(-1).id;assert.deepEqual(s.relationships,relationships);assert.ok(collectionSummary(s).prestige>0);send(s,{type:'VISIT_ASSET',assetId:id,ownedActivityId:'harbor_cruise',personId:'person_1'});assert.equal(s.activity.total,240);const cash=s.money;tick(s,30);let loaded=validateSave(serializeSave(s));assert.equal(loaded.money,cash);const events=[];tick(loaded,210,events);assert.equal(events.filter(e=>e.type==='OWNED_EXPERIENCE_COMPLETED').length,1);assert.equal(events.filter(e=>e.type==='SOCIAL_CONTACT_COMPLETED').length,1);assert.ok(loaded.relationships['person_1|player'].memories.some(m=>m.type==='owned_outing'));loaded=validateSave(serializeSave(loaded));tick(loaded,1,events);assert.equal(events.filter(e=>e.type==='OWNED_EXPERIENCE_COMPLETED').length,1);send(loaded,{type:'SELL_ASSET',assetId:id});assert.ok(!upkeepFor(loaded).some(x=>x.label==='Yacht'));assert.equal(dispatch(loaded,{type:'VISIT_ASSET',assetId:id}).ok,false);
});
test('premium vehicle experiences consume actual clock time and preserve the entry need-efficiency contract',()=>{
 const s=newGame();s.money=1e8;send(s,{type:'BUY_ASSET',definitionId:'sports_car'});const id=s.ownership.assets.at(-1).id;send(s,{type:'SELECT_VEHICLE',assetId:id});const start=s.minutes;send(s,{type:'VISIT_ASSET',assetId:id,ownedActivityId:'track_day'});assert.equal(s.minutes,start);const total=s.activity.total;tick(s,total);assert.equal(s.minutes,start+total);assert.equal(s.activity,null);
});

test('legacy-only activity aliases cannot be started as new experiences and corrupt career review state is rejected',()=>{
 const s=newGame();s.money=1e7;send(s,{type:'BUY_ASSET',definitionId:'yacht'});const id=s.ownership.assets.at(-1).id;const before=structuredClone(s);assert.equal(dispatch(s,{type:'VISIT_ASSET',assetId:id,ownedActivityId:'legacy_visit'}).ok,false);assert.deepEqual(s,before);s.career.lastReviewedShift=1;assert.throws(()=>validateSave(s));
});
