export const SETTINGS_KEY='notsims.settings.v1';
export const DEFAULT_SETTINGS=Object.freeze({version:1,muted:false,master:.7,music:.35,sfx:.65,ambience:.4,ui:.55});
export function validateSettings(raw){
 let s;try{s=typeof raw==='string'?JSON.parse(raw):raw;}catch{return {...DEFAULT_SETTINGS};}
 if(!s||s.version!==1||typeof s!=='object'||Array.isArray(s))return {...DEFAULT_SETTINGS};
 const result={...DEFAULT_SETTINGS,muted:typeof s.muted==='boolean'?s.muted:false};
 for(const bus of ['master','music','sfx','ambience','ui'])if(typeof s[bus]==='number'&&Number.isFinite(s[bus]))result[bus]=Math.max(0,Math.min(1,s[bus]));
 return result;
}
export function browserSettingsStorage(){try{return globalThis.localStorage;}catch{return null;}}
export function loadSettings(storage=browserSettingsStorage()){try{return validateSettings(storage.getItem(SETTINGS_KEY));}catch{return {...DEFAULT_SETTINGS};}}
export function saveSettings(storage,settings){const clean=validateSettings(settings);try{storage.setItem(SETTINGS_KEY,JSON.stringify(clean));return true;}catch{return false;}}
