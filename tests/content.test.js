import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG, itemDef} from '../src/content/furniture.js';
import {JOBS} from '../src/content/careers.js';
import {NEEDS, NEED_DECAY} from '../src/content/needs.js';
import {TRAITS} from '../src/content/traits.js';
import * as engine from '../src/engine.js';

test('canonical content keeps facade identity, stable counts and unique IDs',()=>{
  assert.equal(engine.CATALOG,CATALOG);
  assert.equal(engine.JOBS,JOBS);
  assert.equal(engine.NEEDS,NEEDS);
  assert.equal(engine.itemDef,itemDef);
  assert.equal(CATALOG.length,14);
  assert.equal(JOBS.length,3);
  for(const entries of [CATALOG,JOBS]){
    assert.equal(new Set(entries.map(d=>d.id)).size,entries.length);
    for(const d of entries)assert.equal(typeof d.id,'string');
  }
  assert.deepEqual(Object.keys(TRAITS),['creative','active','social']);
});

test('content references usable needs and valid gameplay values',()=>{
  assert.deepEqual(Object.keys(NEED_DECAY),Object.keys(NEEDS));
  for(const d of CATALOG){
    assert.equal(itemDef(d.id),d);
    assert.ok(d.price>0&&Number.isInteger(d.w)&&d.w>0&&Number.isInteger(d.h)&&d.h>0);
    if(d.need){
      assert.ok(Object.hasOwn(NEEDS,d.need));
      assert.ok(d.rate>0&&d.duration>0&&typeof d.verb==='string');
    }
    if(d.skill)assert.ok(d.need);
  }
  for(const trait of Object.values(TRAITS)){
    for(const [need,factor] of Object.entries(trait.decay??{})){
      assert.ok(Object.hasOwn(NEEDS,need));assert.ok(factor>0);
    }
    if(trait.skillRecovery!==undefined)assert.ok(trait.skillRecovery>0);
  }
  for(const j of JOBS)assert.ok(j.pay>0&&j.hours>0);
});

test('every trait preserves new-game and legacy save compatibility',()=>{
  for(const trait of Object.keys(TRAITS)){
    const s=engine.newGame({trait});
    assert.equal(s.furniture.length,13);
    assert.ok(s.furniture.every(f=>itemDef(f.type)));
    assert.deepEqual(engine.validateSave(JSON.stringify(s)),s);
    engine.tick(s,1);
    for(const need of Object.keys(NEEDS)){
      assert.equal(s.needs[need],85-NEED_DECAY[need]*(TRAITS[trait].decay?.[need]??1));
    }
  }
});
