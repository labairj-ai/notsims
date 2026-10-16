import {pathFrom,blocked} from '../../core/navigation.js';
export function occupied(s,x,y,exclude){return (s.person.x===x&&s.person.y===y)||s.social.presences.some(p=>p.personId!==exclude&&p.x===x&&p.y===y);}
export function entrance(s){for(const [x,y] of [[8,17],[7,17],[9,17],[0,8],[17,8]])if(!occupied(s,x,y)&&!blocked(s,x,y,x,y))return [x,y];return null;}
export function gatherPath(s,p){return [[s.person.x,s.person.y+1],[s.person.x+1,s.person.y],[s.person.x-1,s.person.y],[s.person.x,s.person.y-1]].filter(([x,y])=>!occupied(s,x,y,p.personId)).map(([x,y])=>pathFrom(s,p.x,p.y,x,y)).filter(Boolean).sort((a,b)=>a.length-b.length)[0]||[];}
