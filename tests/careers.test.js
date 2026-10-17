import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,tick} from '../src/game/session.js';
import {JOBS} from '../src/content/careers.js';
import {hourlyWage,shiftPay,changeJob,startShift} from '../src/systems/careers/careers.js';
import {cancel} from '../src/systems/actions/queue.js';

test('canonical wages, promotion, work energy and early leave cover every career',()=>{
 for(const j of JOBS){const s=newGame();changeJob(s,j.id);s.minutes=j.startMinute;assert.equal(hourlyWage(s),j.pay);assert.equal(shiftPay(s),j.pay*j.hours);
  s.shifts=3;s.skill=10;assert.equal(hourlyWage(s),Math.round(j.pay*1.2));assert.equal(shiftPay(s),Math.round(j.pay*j.hours*1.2));
  s.needs.energy=14;startShift(s);assert.equal(s.activity,null);s.needs.energy=15;startShift(s);assert.equal(s.activity.kind,'work');const money=s.money;tick(s,1);cancel(s);assert.equal(s.money,money);assert.equal(s.shifts,3);
 }
 assert.match(readFileSync(new URL('../src/ui/panels/career.js',import.meta.url),'utf8'),/hourlyWage\(state,j\)/);
});
