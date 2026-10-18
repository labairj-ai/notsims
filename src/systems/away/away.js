import {shiftWindow} from '../careers/performance.js';
import {changeNeed} from '../needs/needs.js';
import {emit} from '../../core/events.js';

// Stable behavior is derived from activity.kind; only an in-progress care episode
// belongs in the save. Future away activities can add policies without changing tick().
export const AWAY_POLICIES=Object.freeze({
 work:Object.freeze({compressible:true,attentionPolicy:'interruptible',strategy:'normal',
  effects:Object.freeze({energy:-.025,social:.08}),
  affordances:Object.freeze({
   bladder:Object.freeze({mode:'auto-care',triggerBelow:35,target:80,duration:5,cooldown:90}),
   hunger:Object.freeze({mode:'break',triggerBelow:30,target:65,duration:20,minElapsed:120,maxUses:1}),
   energy:Object.freeze({mode:'decay'}),hygiene:Object.freeze({mode:'decay'}),fun:Object.freeze({mode:'decay'}),social:Object.freeze({mode:'activity-effect'})
  })}),
 school:Object.freeze({compressible:true,attentionPolicy:'interruptible',strategy:'normal',effects:{social:.03},affordances:{bladder:{mode:'auto-care',triggerBelow:35,target:80,duration:5,cooldown:90}}}),
 appointment:Object.freeze({compressible:true,attentionPolicy:'interruptible',strategy:'normal',effects:{},affordances:{}}),
 travel:Object.freeze({compressible:true,attentionPolicy:'interruptible',strategy:'normal',effects:{},affordances:{}})
});
export function validateAwayPolicies(policies){
 for(const [id,p] of Object.entries(policies)){
  if(!p||typeof p.compressible!=='boolean'||!['interruptible','continuous'].includes(p.attentionPolicy))throw Error(`Invalid Away policy: ${id}`);
  for(const [need,rate] of Object.entries(p.effects??{}))if(!['energy','social','hunger','bladder','hygiene','fun'].includes(need)||!Number.isFinite(rate))throw Error(`Invalid Away effect: ${id}`);
  for(const [need,c] of Object.entries(p.affordances??{})){if(c==null)continue;if(!['bladder','hunger','energy','hygiene','fun','social'].includes(need)||!['auto-care','break','decay','activity-effect'].includes(c.mode))throw Error(`Invalid Away affordance: ${id}`);if(['auto-care','break'].includes(c.mode)&&(![c.triggerBelow,c.target,c.duration].every(Number.isFinite)||c.duration<=0||c.triggerBelow<0||c.target>100||c.target<c.triggerBelow||['cooldown','minElapsed','maxUses'].some(k=>c[k]!==undefined&&(!Number.isFinite(c[k])||c[k]<0))))throw Error(`Invalid Away care: ${id}`);}
 }return true;
}
validateAwayPolicies(AWAY_POLICIES);
export const awayPolicy=activity=>activity?.kind?AWAY_POLICIES[activity.kind]??null:null;
export const awayDescriptor=activity=>{const policy=awayPolicy(activity);return policy?{location:'away',policy:activity.kind,compressible:policy.compressible,attentionPolicy:policy.attentionPolicy,strategy:activity.awayState?.strategy??policy.strategy??'normal'}:null;};
export const effectiveTimeScale=({activity,selectedSpeed=1,paused=false,attentionRequired=false,override=null})=>paused?0:(activity&&awayPolicy(activity)?.compressible&&!attentionRequired?(override??24):selectedSpeed);
export const activityAttentionRequired=activity=>!!activity?.awayState?.attentionRequired;
export function requireAwayAttention(activity,required=true){if(!activity||!awayPolicy(activity))return false;activity.awayState??={};activity.awayState.attentionRequired=!!required;return true;}
export function awayConflicts(state,proposedActivity){
 const start=state.minutes,end=start+(proposedActivity?.total??0),out=[];
 for(const p of state.social?.plans??[]){if(p.status!=='scheduled')continue;const pEnd=p.startMinute+(p.duration??0);if(p.startMinute<end&&pEnd>start){const person=state.people?.[p.personId];out.push({type:'social_plan',id:p.id,minute:p.startMinute,label:`Hangout with ${person?.name??'a friend'}`});}}
 const w=proposedActivity?.kind!=='work'?shiftWindow(state):null;if(w&&w.start<end&&w.end>start)out.push({type:'work_shift',id:-(w.day+1),minute:w.start,label:'Scheduled work shift'});
 return out.sort((a,b)=>a.minute-b.minute||a.id-b.id);
}
export function advanceAwayNeeds(s,a,step,events){
 const policy=awayPolicy(a);if(!policy)return;
 a.awayState??={bladderCooldown:0,mealBreakUsed:false,care:null,careNotice:null,attentionRequired:false};
 const st=a.awayState;st.bladderCooldown=Math.max(0,(st.bladderCooldown??0)-step);
 for(const [need,rate] of Object.entries(policy.effects??{}))changeNeed(s,need,rate*step);
 if(st.care){st.care.elapsed=Math.min(st.care.total,st.care.elapsed+step);if(st.care.elapsed>=st.care.total){const c=st.care;changeNeed(s,c.need,Math.max(0,c.target-s.needs[c.need]));if(c.need==='bladder')st.bladderCooldown=policy.affordances?.bladder?.cooldown??0;st.care=null;st.careNotice=c.kind;emit(events,'AWAY_CARE_COMPLETED',{activity:a.kind,care:c.kind,need:c.need});}return;}
 let need=null,cfg=null,kind=null;
 const remaining=a.total-a.elapsed,b=policy.affordances?.bladder,h=policy.affordances?.hunger;
 if(b&&s.needs.bladder<b.triggerBelow&&st.bladderCooldown<=0&&remaining>=b.duration){need='bladder';cfg=b;kind='bathroom_break';}
 else if(h&&!st.mealBreakUsed&&a.elapsed>=(h.minElapsed??0)&&s.needs.hunger<h.triggerBelow&&remaining>=h.duration){need='hunger';cfg=h;kind='meal_break';st.mealBreakUsed=true;}
 if(need){st.care={need,kind,elapsed:0,total:cfg.duration,target:cfg.target};st.careNotice=kind;emit(events,'AWAY_CARE_STARTED',{activity:a.kind,care:kind,need});}
 else st.careNotice=null;
}
