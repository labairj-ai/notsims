import {initSocial} from '../../systems/social/social.js';
import {CURRENT_SAVE_VERSION} from '../schema.js';
// Map source version -> pure one-version migration. No production step is needed at v1.
export const MIGRATIONS=new Map([[1,s=>{initSocial(s);s.version=2;return s;}]]);
export function migrateSave(input,{currentVersion=CURRENT_SAVE_VERSION,migrations=MIGRATIONS}={}){
 let s=structuredClone(input);
 if(!s||!Number.isInteger(s.version)||s.version<1||s.version>currentVersion)throw Error('This is not a valid Notsims save.');
 while(s.version<currentVersion){const from=s.version,step=migrations.get(from);if(!step)throw Error(`Missing save migration from version ${from}.`);s=step(structuredClone(s));if(s?.version!==from+1)throw Error('Invalid save migration.');}
 return s;
}
