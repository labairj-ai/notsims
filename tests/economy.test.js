import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {chargeBills,billAmount} from '../src/systems/economy/bills.js';

test('bills charge once per observed third day and permit negative funds',()=>{
 const s=newGame();s.money=0;s.minutes=4320;const events=[];assert.equal(chargeBills(s,events),billAmount(s));assert.equal(s.money,-101);assert.equal(chargeBills(s,events),null);assert.equal(events.filter(e=>e.type==='BILL_CHARGED').length,1);
 s.minutes=5760;assert.equal(chargeBills(s),null);assert.equal(s.billsDay,4);
});
