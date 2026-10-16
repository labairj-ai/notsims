// Compatibility facade. Leaf modules must import their owners, never this module.
export {SIZE,key,inside,edgeKey} from './core/grid.js';
export {CATALOG,itemDef} from './content/furniture.js';
export {JOBS} from './content/careers.js';
export {NEEDS} from './content/needs.js';
export {dimensions,furniturePoint,interactionTargets,at} from './systems/objects/geometry.js';
export {blocked,pathTo} from './core/navigation.js';
export {canPlace,buy} from './systems/building/placement.js';
export {room,buildTile} from './systems/building/building.js';
export {log} from './game/log.js';
export {enqueue,cancel} from './systems/actions/queue.js';
export {newGame,tick} from './game/session.js';
export {mood} from './systems/needs/mood.js';
export {validateSave} from './persistence/save.js';
