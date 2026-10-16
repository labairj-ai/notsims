import {emit} from '../../core/events.js';
import {changeFunds} from './economy.js';
import {log} from '../../core/log.js';
export const billAmount=s=>75+Math.floor(s.furniture.length*2);
export function chargeBills(s,events){const day=Math.floor(s.minutes/1440);if(day>s.billsDay){s.billsDay=day;if(day%3===0){const bill=billAmount(s);changeFunds(s,-bill,'bill',events);emit(events,'BILL_CHARGED',{day,amount:bill});log(s,`Household bills: $${bill}. A new day begins.`);return bill;}}return null;}
