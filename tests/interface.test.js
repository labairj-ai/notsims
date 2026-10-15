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
  try{await import(`../src/main.js?interface-test=${view}`);}finally{globalThis.setInterval=interval;console.warn=warn;console.error=error;}
  return {dom,w,$:s=>w.document.querySelector(s),messages,finish:()=>{globalThis.setTimeout=timeout;w.close();}};
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
