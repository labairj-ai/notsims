
export function available(s,id,minute=s.minutes){const p=s.people[id],hour=(minute%1440)/60;if(!p)return false;return p.availabilityProfile==='flexible'?hour>=7&&hour<22:p.availabilityProfile==='evening'?hour>=17&&hour<22:hour>=9&&hour<21;}
