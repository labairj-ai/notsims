import {JOBS} from '../content/careers.js';
import {inside} from '../core/grid.js';
import {assetDef} from '../content/assets.js';
import {itemDef} from '../content/furniture.js';
import {WORK_STRATEGIES} from '../systems/careers/performance.js';
export function validateWealth(s,validateLot){
 const finite=Number.isFinite,c=s.career,o=s.ownership,bad=()=>{throw Error('Invalid career or ownership state.');};
 if(!c||!finite(c.performance)||c.performance<0||c.performance>100||!Number.isInteger(c.lastAttendanceDay)||c.lastAttendanceDay< -1||c.lastAttendanceDay>Math.floor(s.minutes/1440)+1)bad();
 if(!Number.isInteger(c.lastReviewedShift)||c.lastReviewedShift<0||c.lastReviewedShift>s.shifts)bad();
 if(!Number.isInteger(c.level)||c.level<0||c.level>4||!Number.isInteger(c.completedShifts)||c.completedShifts<0||c.completedShifts>s.shifts||!Number.isInteger(c.attendanceDebt)||c.attendanceDebt<0||c.attendanceDebt>6||!finite(c.legacyWageBase)||c.legacyWageBase<1||c.legacyWageBase>4||[c.lastPromotionDay,c.lastReviewDay].some(d=>!Number.isInteger(d)||d< -1||d>Math.floor(s.minutes/1440)))bad();
 if(c.lastSummary!==null&&(!c.lastSummary||!finite(c.lastSummary.pay)||!finite(c.lastSummary.performanceDelta)||!finite(c.lastSummary.minute)))bad();
 if(!o||!Array.isArray(o.assets)||o.assets.length<1||o.assets.length>32||!Number.isInteger(o.nextId)||!Array.isArray(o.ledger)||o.ledger.length>60||!Array.isArray(o.wishlist)||o.wishlist.length>30||o.wishlist.some(id=>!assetDef(id)&&!itemDef(id)))bad();
 const ids=new Set(),furnitureIds=new Set(s.furniture.map(f=>f.id));
 for(const a of o.assets){const d=assetDef(a.definitionId);if(!d||!Number.isInteger(a.id)||a.id<1||ids.has(a.id)||a.id>=o.nextId||a.purchasePrice!==d.price||![a.lastPayout,a.managedUntil].every(finite)||a.lastPayout<0||a.lastPayout>s.minutes||a.managedUntil<0||a.managedUntil>Math.max(s.minutes+(d.managementInterval??0),a.legacyManagedUntil??0))bad();if(a.legacyManagedUntil!==undefined&&(!finite(a.legacyManagedUntil)||a.legacyManagedUntil<0||a.legacyManagedUntil>s.minutes+10080))bad();if(d.payoutInterval&&s.minutes-a.lastPayout>=d.payoutInterval)bad();ids.add(a.id);
 if(d.kind==='property'){if(a.id===o.primary){if(a.lot!==null)bad();}else {if(!a.lot||!a.lot.person||!inside(a.lot.person.x,a.lot.person.y))bad();validateLot(a.lot);for(const f of a.lot.furniture){if(furnitureIds.has(f.id))bad();furnitureIds.add(f.id);}}}else if(a.lot!==null)bad();}
 if(assetDef(o.assets.find(a=>a.id===o.primary)?.definitionId)?.kind!=='property'||o.activeVehicle!==null&&assetDef(o.assets.find(a=>a.id===o.activeVehicle)?.definitionId)?.kind!=='vehicle')bad();
 for(const e of o.ledger)if(!e||!finite(e.minute)||e.minute<0||e.minute>s.minutes||!finite(e.amount)||e.amount<0||!['income','bill','purchase','sale'].includes(e.kind))bad();
 const w=s.activity?.awayState;if(w?.strategy&&!Object.hasOwn(WORK_STRATEGIES,w.strategy))bad();if(w?.strategyMinutes){if(Object.keys(w.strategyMinutes).some(k=>!Object.hasOwn(WORK_STRATEGIES,k))||Object.values(w.strategyMinutes).some(n=>!finite(n)||n<0)||Math.abs(Object.values(w.strategyMinutes).reduce((a,b)=>a+b,0)-s.activity.elapsed)>.00001)bad();}
 if(w?.eventPerformance!==undefined&&![0,1].includes(w.eventPerformance))bad();if(w?.latePenalty!==undefined&&![0,1].includes(w.latePenalty))bad();if(w?.workEvent&&(!['quiet','deadline'].includes(w.workEvent.id)||typeof w.workEvent.resolved!=='boolean'))bad();
 return true;
}
