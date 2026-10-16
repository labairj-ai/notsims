import {clamp} from './support.js';
export function advanceMaintenance(s){const social=s.social;
 if(s.minutes>=social.nextDriftMinute){for(const r of Object.values(s.relationships)){for(const v of Object.values(r.toward))v.connection=clamp(v.connection-.08);r.memories=r.memories.filter(m=>!m.expiry||m.expiry>s.minutes);}social.priors=social.priors.filter(p=>p.expiry>s.minutes);social.nextDriftMinute+=60;}
}
