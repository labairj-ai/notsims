import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_SETTINGS,validateSettings,loadSettings,saveSettings,SETTINGS_KEY} from '../src/settings/settings.js';

test('audio settings versioning, malformed records, clamping and separate storage are safe',()=>{
 for(const bad of ['{bad','null','[]','{"version":99}',undefined])assert.deepEqual(validateSettings(bad),DEFAULT_SETTINGS);
 const s=validateSettings({version:1,master:8,music:-1,sfx:NaN,ambience:.1,muted:true});assert.equal(s.master,1);assert.equal(s.music,0);assert.equal(s.sfx,DEFAULT_SETTINGS.sfx);assert.equal(s.ambience,.1);assert.equal(s.muted,true);
 const records=new Map([['notsims.save.v1','world data']]),storage={getItem:k=>records.get(k),setItem:(k,v)=>records.set(k,v)};assert.equal(saveSettings(storage,s),true);assert.deepEqual(loadSettings(storage),s);assert.equal(records.get('notsims.save.v1'),'world data');assert.ok(records.has(SETTINGS_KEY));
 assert.deepEqual(loadSettings({getItem:()=>{throw Error('blocked');}}),DEFAULT_SETTINGS);assert.equal(saveSettings({setItem:()=>{throw Error('blocked');}},s),false);
});

test('blocked browser storage property recovers defaults without touching the world',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('SecurityError');}});
 try{assert.deepEqual(loadSettings(),DEFAULT_SETTINGS);}finally{if(previous)Object.defineProperty(globalThis,'localStorage',previous);else delete globalThis.localStorage;}
});
