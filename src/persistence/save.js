import {migrateSave} from './migrations/index.js';
import {validateState} from './schema.js';
import {rebuildRuntime} from './runtime.js';
export const MAX_SAVE_BYTES=2_000_000;
export function parseSave(raw){if(typeof raw==='string'){if(new TextEncoder().encode(raw).length>MAX_SAVE_BYTES)throw Error('That file is too large to be a Notsims save.');return JSON.parse(raw);}return structuredClone(raw);}
export function validateSave(raw){return rebuildRuntime(validateState(migrateSave(parseSave(raw))));}
export const serializeSave=s=>JSON.stringify(validateSave(s));
