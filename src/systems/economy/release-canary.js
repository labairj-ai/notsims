import {newGame} from '../../game/session.js';
import {dispatch,advance} from '../../game/dispatch.js';
import {validateSave,serializeSave} from '../../persistence/save.js';
import {householdNetWorth,upkeepFor} from '../ownership/ownership.js';
import {assetDef} from '../../content/assets.js';
export function runWealthCanary(legacyFixture){
 const checks=[],check=(ok,label)=>{if(!ok)throw Error(`Wealth canary: ${label}`);checks.push(label);};
 const migrated=validateSave(legacyFixture);check(migrated.version===5,'legacy save migrates to v5');for(const field of ['money','furniture','relationships','people','social'])check(JSON.stringify(migrated[field])===JSON.stringify(legacyFixture[field]),`${field} preserved`);check(serializeSave(validateSave(serializeSave(migrated)))===serializeSave(migrated),'migration is idempotent');
 // Disposable, explicitly funded setup; production/player saves are never edited.
 let s=newGame();s.money=1e6;s.social.nextSocialOpportunityMinute=900000000;
 const send=c=>{const r=dispatch(s,c);check(r.ok,`${c.type} ${c.definitionId??c.assetId??c.destinationId??''}`);return r;};
 const purchase=id=>{send({type:'BUY_ASSET',definitionId:id});return s.ownership.assets.at(-1).id;};
 const vehicle=purchase('used_car');send({type:'SELECT_VEHICLE',assetId:vehicle});send({type:'START_DESTINATION',destinationId:'errand'});advance(s,s.activity.total);send({type:'SELL_ASSET',assetId:vehicle});
 const property=purchase('cabin');send({type:'SWITCH_RESIDENCE',assetId:property});send({type:'PLACE_OBJECT',object:'chair',x:6,y:5});const chair=s.furniture.at(-1).id;send({type:'SWITCH_RESIDENCE',assetId:1});send({type:'SWITCH_RESIDENCE',assetId:property});check(s.furniture.some(f=>f.id===chair),'second residence furniture persists');
 const business=purchase('cafe'),initial=s.ownership.assets.find(a=>a.id===business).lastPayout;const emitted=advance(s,1440).events;check(emitted.filter(e=>e.type==='BUSINESS_PAYOUT'&&e.assetId===business).length===1,'one first payout');s=validateSave(serializeSave(s));const money=s.money;check(advance(s,1).events.filter(e=>e.type==='BUSINESS_PAYOUT').length===0&&s.money===money,'restart has no duplicate payout');
 // Let the initial management window expire through the canonical clock.
 const definition=assetDef('cafe');for(let left=definition.managementInterval;left>0;left-=1440)advance(s,Math.min(1440,left));send({type:'MANAGE_BUSINESS',assetId:business});advance(s,1);s=validateSave(serializeSave(s));const completed=advance(s,s.activity.total-s.activity.elapsed).events;check(completed.some(e=>e.type==='BUSINESS_MANAGED'&&e.assetId===business),'management resumes and completes');const next=s.ownership.assets.find(a=>a.id===business).lastPayout+definition.payoutInterval;const managedPayout=advance(s,next-s.minutes).events.find(e=>e.type==='BUSINESS_PAYOUT'&&e.assetId===business);check(managedPayout?.gross===definition.grossIncome,'next payout uses managed gross');check(upkeepFor(s).some(x=>x.label==='Vacation cabin'),'itemized property bills');check(Number.isFinite(householdNetWorth(s)),'net worth is finite');check(s.ownership.assets.find(a=>a.id===business).lastPayout>initial,'payout cursor advanced once per interval');
 return {passed:true,checks,fixtureVersion:legacyFixture.version,targetVersion:5,scope:'automated disposable-save canary; not browser, physical or production evidence'};
}
