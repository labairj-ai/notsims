import {socialCommand} from '../systems/social/social.js';
import {COMMANDS} from './commands.js';
import {inside,SIZE} from '../core/grid.js';
import {itemDef} from '../content/furniture.js';
import {TRAITS} from '../content/traits.js';
import {QUICK_ACTIONS} from '../content/interactions.js';
import {enqueue,cancel} from '../systems/actions/queue.js';
import {room,buildTile} from '../systems/building/building.js';
import {buy} from '../systems/building/placement.js';
import {changeJob,jobDef,startShift} from '../systems/careers/careers.js';
import {resolveInteraction} from '../systems/actions/interactions.js';
import {log} from './log.js';
import {emit} from './events.js';
import {tick} from './session.js';
import {awayConflicts} from '../systems/away/away.js';

const fail=(code,details={})=>({ok:false,code,events:[],details});
const floors=['wood','tile','sage'];
const edgeValid=edge=>{if(typeof edge!=='string')return false;const m=/^([hv]):(\d+),(\d+)$/.exec(edge);return !!m&&+m[2]<=SIZE&&+m[3]<=SIZE;};
function appearanceValid(p){
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 const allowed=['name','skin','hair','shirt','style','trait'];
 return Object.entries(p).every(([key,value])=>{
  if(!allowed.includes(key)||typeof value!=='string')return false;
  if(key==='name')return value.length<=40;
  if(['skin','hair','shirt'].includes(key))return /^#[0-9a-f]{6}$/i.test(value);
  if(key==='style')return ['short','long','curly'].includes(value);
  return Object.hasOwn(TRAITS,value);
 });
}
function rejectionCode(message){
 if(message.includes('queue is full'))return 'QUEUE_FULL';
 if(message.includes('at work'))return 'AT_WORK';
 if(message.startsWith('Finish or cancel'))return 'BUSY';
 if(/funds|money|costs/.test(message))return 'INSUFFICIENT_FUNDS';
 if(message.includes('3 × 3'))return 'ROOM_TOO_SMALL';
 if(message.includes('furniture')||message.startsWith('Place it'))return 'OBSTRUCTED';
 return 'INVALID_PLACEMENT';
}
export function dispatch(s,c){
 if(!c||!COMMANDS.includes(c.type))return fail('UNKNOWN_COMMAND');
 const events=[];let message=null;
 if(['SHARED_ACTIVITY','SOCIAL_INTERACT','PHONE_CONTACT','INVITE_OVER','RESPOND_SOCIAL_EVENT','ASK_GUEST_TO_LEAVE','CANCEL_SOCIAL_PLAN','REQUEST_INTRODUCTION'].includes(c.type)){const code=socialCommand(s,c,events);return code?fail(code):{ok:true,code:'OK',events};}
 switch(c.type){
 case 'MOVE_TO':if(!inside(c.x,c.y))return fail('INVALID_TARGET');message=enqueue(s,{kind:'walk',x:c.x,y:c.y},events);break;
 case 'INTERACT':{const f=s.furniture.find(f=>f.id===c.id);if(!f||!resolveInteraction(f,c.interaction))return fail('INVALID_TARGET');message=enqueue(s,{kind:'use',id:c.id,...(c.interaction?{interaction:c.interaction}:{})},events);break;}
 case 'QUICK_ACTION':if(c.kind==='chat')return fail('SELECT_CONTACT');if(typeof c.kind!=='string'||!Object.hasOwn(QUICK_ACTIONS,c.kind))return fail('INVALID_ACTION');message=enqueue(s,{kind:c.kind},events);break;
 case 'CANCEL_ACTION':cancel(s,events);break;
 case 'BUILD_ROOM':if(![c.x1,c.y1,c.x2,c.y2].every(Number.isInteger)||!floors.includes(c.floor??'wood'))return fail('INVALID_TARGET');message=room(s,c.x1,c.y1,c.x2,c.y2,c.floor??undefined,events);break;
 case 'EDIT_TILE':case 'ERASE':{const tool=c.type==='ERASE'?'erase':c.tool;if(!['floor','wall','door','erase'].includes(tool)||!inside(c.x,c.y)||!edgeValid(c.edge)||!floors.includes(c.floor??'wood'))return fail('INVALID_TARGET');message=buildTile(s,tool,c.x,c.y,c.edge,c.floor??undefined,events);break;}
 case 'PLACE_OBJECT':if(!itemDef(c.object)||!inside(c.x,c.y)||![0,1,2,3].includes(c.rotation??0))return fail('INVALID_TARGET');message=buy(s,c.object,c.x,c.y,c.rotation??0,events);break;
 case 'CHANGE_JOB':if(!jobDef(c.job))return fail('INVALID_CAREER');message=changeJob(s,c.job,events);if(!message&&!s.contacts.includes('person_7')){s.contacts.push('person_7');emit(events,'CONTACT_ADDED',{personId:'person_7',reason:'coworker'});}break;
 case 'START_SHIFT':{if(!jobDef(s.job))return fail('INVALID_CAREER');if(s.activity||s.queue.length)return fail('BUSY');if(s.needs.energy<15)return fail('LOW_ENERGY');const work={kind:'work',total:jobDef(s.job).hours*60};const conflicts=awayConflicts(s,work);const acknowledged=new Set(Array.isArray(c.confirmedConflictIds)?c.confirmedConflictIds.filter(Number.isInteger):[]);const unacknowledged=conflicts.filter(x=>!acknowledged.has(x.id));if(unacknowledged.length)return fail('AWAY_CONFLICT',{conflicts:unacknowledged});message=startShift(s);if(message)return fail(message);emit(events,'ACTION_STARTED',{kind:'work'});break;}
 case 'CHANGE_APPEARANCE':if(!appearanceValid(c.appearance))return fail('INVALID_APPEARANCE');Object.assign(s.person,c.appearance);log(s,'A fresh look for a new day.');emit(events,'APPEARANCE_CHANGED',{appearance:{...c.appearance}});break;
 }
 return message?fail(rejectionCode(message),{message}):{ok:true,code:'OK',events};
}
export function advance(s,minutes){const events=[];tick(s,minutes,events);return {ok:true,code:'OK',events};}
