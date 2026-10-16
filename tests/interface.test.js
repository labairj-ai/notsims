import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {newGame} from '../src/engine.js';

async function boot(view,saved=null){
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  const dom=new JSDOM(html,{url:`https://notsims.test/notsims/${view==='classic'?'?view=classic':''}`});
  const w=dom.window;
  Object.assign(globalThis,{window:w,document:w.document,location:w.location,localStorage:w.localStorage,confirm:()=>true,requestAnimationFrame:()=>0});
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  const ctx=new Proxy({}, {get:(_t,k)=>()=>{},set:()=>true});
  w.HTMLCanvasElement.prototype.getContext=function(type){return type==='2d'?ctx:null;};
  if(saved)w.localStorage.setItem('notsims.save.v1',JSON.stringify(saved));
  const interval=globalThis.setInterval,timeout=globalThis.setTimeout,warn=console.warn,error=console.error;
  globalThis.setInterval=()=>0;
  globalThis.setTimeout=(...args)=>{const timer=timeout(...args);timer.unref?.();return timer;};
  const messages=[];console.warn=(...a)=>messages.push(a.join(' '));console.error=(...a)=>messages.push(a.join(' '));
  let game;try{game=(await import(`../src/main.js?interface-test=${view}`)).app;}finally{globalThis.setInterval=interval;console.warn=warn;console.error=error;}
  return {dom,w,game,$:s=>w.document.querySelector(s),messages,finish:()=>{game?.audio?.dispose();globalThis.setTimeout=timeout;w.close();}};
}

test('classic interface starts a game, edits appearance, switches tools and persists a save',async()=>{
  const app=await boot('classic'),{$,w}=app;
  try{
    assert.equal($('#scene-badge').textContent,'CLASSIC VIEW');assert.ok($('#creator').open);
    $('#character-name').value='Riley';$('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
    assert.equal($('#person-name').textContent,'Riley');assert.equal($('#creator').open,false);
    $('[data-tab="build"]').click();assert.match($('#studio-content').textContent,/Room to grow/);
    $('[data-tab="shop"]').click();assert.ok($('[data-item="bed"]'));
    $('[data-tab="career"]').click();$('[data-job="barista"]').click();
    $('#edit-character').click();$('#shirt').value='#629482';$('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
    $('#save').click();const saved=JSON.parse(w.localStorage.getItem('notsims.save.v1'));
    assert.equal(saved.person.name,'Riley');assert.equal(saved.person.shirt,'#629482');assert.equal(saved.job,'barista');assert.equal(saved.version,1);
  }finally{app.finish();}
});
test('failed WebGL initialization falls back and resumes an existing v1 save',async()=>{
  const saved=newGame({name:'Casey'});saved.money=4321;
  const app=await boot('fallback',saved),{$}=app;
  try{
    assert.ok(app.messages.some(m=>m.includes('classic view')));assert.equal($('#scene-badge').textContent,'CLASSIC VIEW');
    assert.equal($('#scene-loading').hidden,true);assert.equal($('#camera-left').disabled,true);
    assert.equal($('#resume').hidden,false);$('#resume').click();
    assert.equal($('#person-name').textContent,'Casey');assert.equal($('#money').textContent,'$4,321');
    assert.equal($('#creator').open,false);
  }finally{app.finish();}
});

test('keyboard, touch controls and panels retain pause semantics and dispatch all player mutations',async()=>{
  const app=await boot('controls'),{$,w}=app;
  try{
    // boot's entry point is independently initialized for this surface.
    const mod=await import('../src/main.js?interface-test=controls');
    const game=mod.app,commands=[],original=game.dispatch;
    game.dispatch=c=>{commands.push(c);return original(c);};
    $('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
    const key=k=>w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
    key(' ');assert.equal(game.speed,0);key(' ');assert.equal(game.speed,1);
    $('[data-tab="build"]').click();assert.equal(game.paused(),true);key('3');assert.equal(game.ui.tab,'live');assert.equal(game.speed,8);
    $('[data-tab="shop"]').click();assert.equal(game.paused(),true);key('r');assert.equal(game.ui.rotation,1);
    $('[data-item="chair"]').click();key('Escape');assert.equal(game.ui.selected,null);
    $('[data-speed="3"]').click();assert.equal(game.ui.tab,'live');assert.equal(game.speed,3);
    $('.life-panel [data-action="chat"]').click();assert.equal(commands.at(-1).type,'QUICK_ACTION');
    $('#cancel-action').click();assert.equal(commands.at(-1).type,'CANCEL_ACTION');
    $('[data-tab="career"]').click();$('[data-job="designer"]').click();assert.equal(commands.at(-1).type,'CHANGE_JOB');
    $('#edit-character').click();$('#character-name').value='Morgan';$('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(commands.at(-1).type,'CHANGE_APPEARANCE');
    $('#edit-character').click();$('#character-name').focus();key('1');assert.equal(game.speed,3);
  }finally{app.finish();}
});

test('import/export controller validates before replacing local save and preserves backup data',async()=>{
  const app=await boot('files'),{$,w}=app;
  const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL;
  try{
    $('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
    const previous=w.localStorage.getItem('notsims.save.v1');
    const input=$('#import-file');
    Object.defineProperty(input,'files',{configurable:true,value:[{size:4,text:async()=>'{bad'}]});
    await input.onchange({target:input});assert.equal(w.localStorage.getItem('notsims.save.v1'),previous);
    const imported=newGame({name:'Imported Resident'});imported.money=9876;
    Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(imported)}]});
    await input.onchange({target:input});assert.equal($('#person-name').textContent,'Imported Resident');assert.equal(JSON.parse(w.localStorage.getItem('notsims.save.v1')).money,9876);
    let blob,clicked=false;URL.createObjectURL=b=>{blob=b;return 'blob:notsims-test';};URL.revokeObjectURL=()=>{};
    w.HTMLAnchorElement.prototype.click=function(){clicked=true;assert.match(this.download,/notsims-day-1.json/);};
    $('#export').click();assert.equal(clicked,true);assert.equal(JSON.parse(await blob.text()).person.name,'Imported Resident');
  }finally{URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;app.finish();}
});

test('audio settings are labelled, live, reversible and remain device-local across imports and new games',async()=>{
 const {FakeAudioBackend,flush}=await import('./helpers/fake-audio.js');
 const app=await boot('audio-settings'),{$,w,game}=app;const backend=new FakeAudioBackend();game.audio.manager.backend=backend;
 try{
  await game.audio.manager.unlock();await flush();
  $('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));$('#menu').click();$('#audio-menu').click();assert.ok($('#audio-settings').open);
  for(const bus of ['master','music','sfx','ambience','ui'])assert.ok($(`label[for="volume-${bus}"]`));
  const slider=$('#volume-music');slider.value='22';slider.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(backend.gains.music,.22);assert.equal($('#volume-music-value').textContent,'22%');
  $('#mute-all').checked=true;$('#mute-all').dispatchEvent(new w.Event('change'));assert.equal(backend.gains.master,0);assert.equal(game.audio.manager.settings.music,.22);
  $('#mute-all').checked=false;$('#mute-all').dispatchEvent(new w.Event('change'));assert.equal(backend.gains.master,.7);assert.equal(backend.gains.music,.22);
  const prefs=w.localStorage.getItem('notsims.settings.v1');assert.equal(JSON.parse(prefs).music,.22);
  $('[data-close="audio-settings"]').click();assert.equal($('#audio-settings').open,false);
  const input=$('#import-file');const imported=newGame({name:'Audio Import'});Object.defineProperty(input,'files',{configurable:true,value:[{size:100,text:async()=>JSON.stringify(imported)}]});
  game.audio.manager.startLoop('interaction.shower.loop');await flush();await input.onchange({target:input});assert.equal(game.audio.manager.debug().loops.length,0);assert.equal(w.localStorage.getItem('notsims.settings.v1'),prefs);
  assert.ok(!JSON.stringify(game.state).includes('volume'));assert.ok(!Object.hasOwn(game.state,'settings'));
  $('#new-game').click();$('#character-form').dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(w.localStorage.getItem('notsims.settings.v1'),prefs);assert.equal(game.audio.manager.settings.music,.22);
 }finally{app.finish();}
});
