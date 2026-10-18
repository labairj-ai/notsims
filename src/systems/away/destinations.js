import {destinationDef} from '../../content/destinations.js';
import {changeFunds} from '../economy/economy.js';
import {changeNeed} from '../needs/needs.js';
import {emit} from '../../core/events.js';
import {awayConflicts} from './away.js';
import {assetDef} from '../../content/assets.js';
export function destinationActivity(s,id){const d=destinationDef(id);if(!d)return null;const vehicle=s.ownership?.assets.find(a=>a.id===s.ownership.activeVehicle);const speed=assetDef(vehicle?.definitionId)?.travelFactor??1;return {kind:d.awayPolicy,destinationId:id,label:d.label,total:d.duration+Math.ceil(d.travel*speed),elapsed:0,path:[],awayState:{attentionRequired:false}};}
export function startDestination(s,c,events){const d=destinationDef(c.destinationId);if(!d)return 'INVALID_DESTINATION';if(s.activity||s.queue.length)return 'BUSY';if(s.money<d.cost)return 'INSUFFICIENT_FUNDS';const a=destinationActivity(s,d.id),conflicts=awayConflicts(s,a).filter(x=>!(Array.isArray(c.confirmedConflictIds)&&c.confirmedConflictIds.includes(x.id)));if(conflicts.length)return {code:'AWAY_CONFLICT',details:{conflicts}};changeFunds(s,-d.cost,'destination',events);s.activity=a;emit(events,'ACTION_STARTED',{kind:a.kind,destinationId:d.id});return null;}
export function completeDestination(s,a,events){const d=destinationDef(a.destinationId);if(!d)return;for(const [n,v] of Object.entries(d.effects)){if(n==='skill')s.skill=Math.min(100,s.skill+v);else changeNeed(s,n,v);}emit(events,'DESTINATION_COMPLETED',{destinationId:d.id,effects:d.effects});}
