// Stable social API; rules live in focused, cycle-free domain modules.
export {initSocial} from './state.js';
export {pairKey,relationship,relationshipStatus,bond,dynamic} from './relationships.js';
export {compatibility} from './compatibility.js';
export {available} from './availability.js';
export {completeSocial,resolveSocialInteraction,repetitionMultiplier} from './interactions.js';
export {prepareSocial} from './communication.js';
export {availableSocialActions} from './queries.js';
export {isSociallyDiscoverable,visitEligible} from './discovery.js';
export {socialCommand} from './commands.js';
export {prepareSharedActivity,availableSharedActivities,sharedActivityPose} from './shared-activities.js';
import {advanceSharedActivity} from './shared-activities.js';
import {advanceMaintenance} from './maintenance.js';
import {advancePlans} from './plans.js';
import {advanceScheduler,expireSocialEvent} from './scheduler.js';
import {advanceVisitors} from './visitors.js';
export function advanceSocial(s,step,events){expireSocialEvent(s,events);advanceMaintenance(s);advancePlans(s,events);advanceScheduler(s,events);advanceVisitors(s,step,events);advanceSharedActivity(s,step,events);}
