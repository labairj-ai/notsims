import {emit} from '../../core/events.js';
export const canAfford = (s,amount)=>s.money>=amount;
// Reason is supplied at every transaction site for future auditing; no ledger is persisted.
export function changeFunds(s,amount,reason,events){s.money+=amount;if(amount)emit(events,amount<0?'MONEY_SPENT':'MONEY_RECEIVED',{amount:Math.abs(amount),reason,balance:s.money});return {amount,reason,balance:s.money};}
