import {JOBS} from '../content/careers.js';
import {workActivity} from '../systems/careers/careers.js';
export function rebuildRuntime(s){
 if(s.social.sharedActivity){const p=s.social.presences.find(p=>p.personId===s.social.sharedActivity.personId);if(p){p.path=[];p.moveClock=0;}s.social.sharedActivity=null;}
 const finite=Number.isFinite,ids=s.furniture.map(f=>f.id);
 // Rebuild transient paths after loading; preserve only legitimate work progress.
 if(s.activity?.kind==='work'){
 const a=s.activity,j=JOBS.find(j=>j.id===s.job);if(!j||!finite(a.elapsed)||a.elapsed<0||a.elapsed>=j.hours*60)throw Error('Invalid work progress.');
 const w=a.awayState??{};const care=w.care;
 if(care&&(!(['bladder','hunger'].includes(care.need))||!(['bathroom_break','meal_break'].includes(care.kind))||(care.need==='bladder')!==(care.kind==='bathroom_break')||![care.elapsed,care.total,care.target].every(Number.isFinite)||care.elapsed<0||care.elapsed>=care.total||care.total>20||care.target<0||care.target>100))throw Error('Invalid away-care progress.');
 const awayState={bladderCooldown:Number.isFinite(w.bladderCooldown)?Math.min(90,Math.max(0,w.bladderCooldown)):0,mealBreakUsed:!!w.mealBreakUsed,care:care?{...care}:null,careNotice:['bathroom_break','meal_break'].includes(w.careNotice)?w.careNotice:null,attentionRequired:!!w.attentionRequired};
 s.activity=workActivity(s,a.elapsed,awayState);
 }else s.activity=null;
 s.queue=[];s.nextId=Math.max(0,...ids)+1;return s;
}
