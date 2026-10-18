import {upkeepFor,recordOwnership} from '../ownership/ownership.js';
import {emit} from '../../core/events.js';
import {changeFunds} from './economy.js';
import {log} from '../../core/log.js';
export const billAmount=s=>upkeepFor(s).reduce((sum,x)=>sum+x.amount,0);
export function chargeBills(s,events){const day=Math.floor(s.minutes/1440);if(day>s.billsDay){s.billsDay=day;if(day%3===0){const bill=billAmount(s);changeFunds(s,-bill,'bill',events);recordOwnership(s,{kind:'bill',amount:bill,breakdown:upkeepFor(s)});emit(events,'BILL_CHARGED',{day,amount:bill,breakdown:upkeepFor(s)});log(s,`Household bills: $${bill}. A new day begins.`);return bill;}}return null;}
