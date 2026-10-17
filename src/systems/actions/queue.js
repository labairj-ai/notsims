import {awayPolicy} from '../away/away.js';
import {cancelSharedActivity} from '../social/shared-activities.js';
import {emit} from '../../core/events.js';
import {log} from '../../core/log.js';
export function enqueue(s,action,events){if(s.queue.length>=5)return 'Your queue is full. Let life catch up.';if(!!awayPolicy(s.activity))return 'You are at work. Your home will be here when you return.';s.queue.push(action);emit(events,'ACTION_QUEUED',{kind:action.kind});return null;}
export function cancel(s,events){cancelSharedActivity(s,events);if(s.activity||s.queue.length)emit(events,'ACTION_CANCELLED',{kind:s.activity?.kind??null,reason:'PLAYER',queued:s.queue.length});if(!!awayPolicy(s.activity))log(s,'Left work early. No pay for an unfinished shift.');s.activity=null;s.queue=[];}
