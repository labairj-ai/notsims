import {ownedActivityDefinition} from '../content/asset-experiences.js';
import {JOBS} from '../content/careers.js';
import {workActivity} from '../systems/careers/careers.js';
import {destinationDef} from '../content/destinations.js';
import {assetDef} from '../content/assets.js';
import {awayPolicy} from '../systems/away/away.js';
export function rebuildRuntime(s){
 if(s.social.sharedActivity){const p=s.social.presences.find(p=>p.personId===s.social.sharedActivity.personId);if(p){p.path=[];p.moveClock=0;}s.social.sharedActivity=null;}
 const a=s.activity,finite=Number.isFinite;
 if(a&&awayPolicy(a)){
  const j=JOBS.find(j=>j.id===s.job),d=destinationDef(a.destinationId),owned=s.ownership.assets.find(x=>x.id===a.assetId),asset=assetDef(owned?.definitionId);
  const ownedDef=asset?ownedActivityDefinition(asset,a.ownedActivityId):null,vehicle=assetDef(s.ownership.assets.find(x=>x.id===s.ownership.activeVehicle)?.definitionId),ownedTotal=ownedDef?ownedDef.duration+Math.ceil(ownedDef.travel*(vehicle?.travelFactor??1)):0;
  const expectedOwned=a.legacyOwnedActivity?(asset?.kind==='business'?120:240):ownedTotal;
  const max=a.kind==='work'?j?.hours*60:d?d.duration+d.travel:asset?expectedOwned:0;
  if(!finite(a.elapsed)||!finite(a.total)||a.elapsed<0||a.elapsed>=a.total||a.total<=0||a.total>max)throw Error('Invalid away progress.');
  if(d&&(a.total<d.duration||a.total>d.duration+d.travel)||asset&&(a.total!==expectedOwned||asset.kind==='business'&&a.kind!=='appointment'))throw Error('Invalid Away duration.');
  if(d&&d.awayPolicy!==a.kind||asset&&!['appointment','travel'].includes(a.kind))throw Error('Invalid away destination.');
  const w=a.awayState??{},care=w.care;
  if(care&&(!['bladder','hunger'].includes(care.need)||!['bathroom_break','meal_break'].includes(care.kind)||(care.need==='bladder')!==(care.kind==='bathroom_break')||![care.elapsed,care.total,care.target].every(finite)||care.elapsed<0||care.elapsed>=care.total||care.total>20||care.total<=0||care.target<0||care.target>100))throw Error('Invalid away-care progress.');
  const awayState={...w,bladderCooldown:finite(w.bladderCooldown)?Math.min(90,Math.max(0,w.bladderCooldown)):0,mealBreakUsed:!!w.mealBreakUsed,care:care?{...care}:null,careNotice:['bathroom_break','meal_break'].includes(w.careNotice)?w.careNotice:null,attentionRequired:!!w.attentionRequired};
  if(a.kind==='work'){const base=workActivity(s,a.elapsed,awayState);const pay=Math.round(base.pay*a.total/(j.hours*60));if(!finite(a.pay)||a.pay!==pay)throw Error('Invalid shift pay.');s.activity={...base,total:a.total,pay};}
  else {if(asset&&(!ownedDef&&!a.legacyOwnedActivity||a.personId&&(!ownedDef?.social||!s.contacts.includes(a.personId))))throw Error('Invalid owned experience.');s.activity={kind:a.kind,...(d?{destinationId:d.id}:{assetId:owned.id,ownedActivityId:a.ownedActivityId??ownedDef?.id,...(a.legacyOwnedActivity?{legacyOwnedActivity:true}:{}),...(a.personId?{personId:a.personId}:{})}),label:d?.label??ownedDef?.label??`Managing ${asset.name}`,elapsed:a.elapsed,total:a.total,path:[],awayState};}
 }else s.activity=null;
 s.queue=[];s.nextId=Math.max(s.nextId??1,1,...s.furniture.map(f=>f.id+1),...s.ownership.assets.flatMap(a=>(a.lot?.furniture??[]).map(f=>f.id+1)));return s;
}
