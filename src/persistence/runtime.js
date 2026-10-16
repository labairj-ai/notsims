import {JOBS} from '../content/careers.js';
import {workActivity} from '../systems/careers/careers.js';
export function rebuildRuntime(s){
 const finite=Number.isFinite,ids=s.furniture.map(f=>f.id);
 // Rebuild transient paths after loading; preserve only legitimate work progress.
 if(s.activity?.kind==='work'){
 const a=s.activity,j=JOBS.find(j=>j.id===s.job);if(!j||!finite(a.elapsed)||a.elapsed<0||a.elapsed>=j.hours*60)throw Error('Invalid work progress.');
 s.activity=workActivity(s,a.elapsed);
 }else s.activity=null;
 s.queue=[];s.nextId=Math.max(0,...ids)+1;return s;
}
