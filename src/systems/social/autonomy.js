import {random} from './support.js';
import {prepareSocial} from './communication.js';
import {emit} from '../../core/events.js';

export function advanceAutonomy(s,p,events){
 if(p.state==='visiting'&&s.minutes>=p.nextInitiationMinute){p.nextInitiationMinute=s.minutes+45+Math.floor(random(s)*30);if(!s.activity&&!s.queue.length&&Math.abs(p.x-s.person.x)+Math.abs(p.y-s.person.y)<=2){const prepared=prepareSocial(s,{actorId:p.personId,targetId:'player',personId:p.personId,interaction:'day',channel:'in_person',source:'autonomy'});if(prepared.action){s.queue.push(prepared.action);emit(events,'ACTION_QUEUED',{kind:'social',personId:p.personId,initiatedBy:p.personId});}}}
}
