// Optional real-browser QA; uses an externally installed Puppeteer, never audio hardware.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const arg=name=>process.argv[process.argv.indexOf(name)+1];
const modulePath=process.argv.includes('--puppeteer-module')?arg('--puppeteer-module'):'puppeteer';
const imported=await import(modulePath.startsWith('/')?pathToFileURL(modulePath).href:modulePath);
const puppeteer=imported.puppeteer??imported.default;
const base=process.argv.includes('--url')?arg('--url'):'http://127.0.0.1:5174';
const out=process.argv.includes('--out')?arg('--out'):'/private/tmp/notsims-audio-qa';await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({headless:true,...(process.argv.includes('--chrome')?{executablePath:arg('--chrome')}:{}),args:['--enable-unsafe-swiftshader','--no-first-run']});
console.log(await browser.version());
const ready=page=>page.waitForFunction(()=>!!globalThis.notsimsAudio&&document.querySelector('#scene-loading').hidden);
try{
 for(const view of ['classic','3d'])for(const size of [{width:1440,height:1000},{width:390,height:844,isMobile:true,hasTouch:true}]){
  const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport(size);const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(wav|mp3)(\?|$)/.test(r.url()))requests.push(r.url());});
  await page.goto(`${base}/?audioDebug=1${view==='classic'?'&view=classic':''}`,{waitUntil:'networkidle0'});await ready(page);
  assert.equal(requests.length,0,'no audio fetch before gesture');assert.equal(await page.evaluate(()=>notsimsAudio.manager.backend.context),null);
  assert.equal(await page.$eval('#scene-badge',e=>e.textContent),view==='classic'?'CLASSIC VIEW':'3D WORLD');
  // Trusted click unlocks audio while still in the creator/menu context.
  await page.click('#character-name');await page.waitForFunction(()=>notsimsAudio.manager.unlocked&&notsimsAudio.music.current?.ready);
  assert.equal(await page.evaluate(()=>notsimsAudio.music.state),'menu');
  await page.click('#begin');await page.waitForFunction(()=>notsimsAudio.music.state==='home.day'&&notsimsAudio.music.current?.ready);
  const decode=await page.evaluate(async()=>{const {AUDIO_ASSETS}=await import('./src/audio/audio-library.js');const backend=notsimsAudio.manager.backend;await Promise.all(Object.values(AUDIO_ASSETS).filter(a=>a.kind!=='music').map(a=>backend.load(a)));const media=document.createElement('audio');return {wav:media.canPlayType('audio/wav'),mp3:media.canPlayType('audio/mpeg'),state:backend.context.state,decodedBytes:backend.decodedBytes};});
  assert.ok(decode.wav&&decode.mp3);assert.equal(decode.state,'running');assert.ok(decode.decodedBytes<=8*1024*1024);
  // Reach a shower through public simulation interfaces; presentation owns no movement.
  await page.evaluate(async()=>{const {app}=await import('./src/main.js');const {advance}=await import('./src/game/dispatch.js');app.dispatch({type:'INTERACT',id:12});advance(app.state,1);while(app.state.activity?.path?.length)advance(app.state,1);});
  await page.waitForFunction(()=>notsimsAudio.manager.debug().loops.includes('interaction.shower.loop'));
  await page.click('#cancel-action');await page.waitForFunction(()=>!notsimsAudio.manager.debug().loops.includes('interaction.shower.loop'));
  await page.click('#menu');await page.click('#audio-menu');await page.waitForSelector('#audio-settings[open]');
  const settings=await page.evaluate(()=>['master','music','sfx','ambience','ui'].every(bus=>document.querySelector(`label[for="volume-${bus}"]`)&&document.querySelector(`#volume-${bus}`).getBoundingClientRect().height>=44));assert.ok(settings);
  await page.focus('#volume-music');await page.keyboard.press('ArrowLeft');
  const beforeMute=await page.evaluate(()=>notsimsAudio.manager.settings.music);assert.equal(beforeMute,.34);
  await page.click('#mute-all');await page.waitForFunction(()=>notsimsAudio.manager.settings.muted&&notsimsAudio.manager.musicVoices.size===0);assert.equal(await page.evaluate(()=>notsimsAudio.manager.settings.music),beforeMute);
  await page.screenshot({path:`${out}/${view}-${size.width}-settings.png`});
  await page.click('#mute-all');await page.waitForFunction(()=>notsimsAudio.music.current?.ready);await page.click('[data-close="audio-settings"]');
  // Public save import changes context to evening and resets old interaction handles.
  await page.evaluate(async()=>{const {app}=await import('./src/main.js');const {advance}=await import('./src/game/dispatch.js');advance(app.state,600);});
  await page.waitForFunction(()=>notsimsAudio.music.state==='home.evening'&&notsimsAudio.music.current?.ready);
  assert.ok(await page.evaluate(()=>notsimsAudio.manager.musicVoices.size<=2));
  if(size.width===1440){
   const foreground=await context.newPage();await foreground.bringToFront();await page.waitForFunction(()=>document.hidden&&notsimsAudio.manager.suspended);assert.equal(await page.evaluate(()=>notsimsAudio.manager.voices.size+notsimsAudio.manager.musicVoices.size),0);
   await page.bringToFront();await page.waitForFunction(()=>!notsimsAudio.manager.suspended&&notsimsAudio.music.current?.ready);await foreground.close();
   await page.evaluate(async()=>{const backend=notsimsAudio.manager.backend;backend.context.createStereoPanner=undefined;notsimsAudio.manager.playCue('object.place',{spatial:true,position:{x:1,y:1}});const original=backend.fetcher;backend.buffers.delete('error');backend.fetcher=(url,...args)=>String(url).endsWith('/error.wav')?Promise.resolve(new Response(new Uint8Array([1,2,3]),{status:200})):original(url,...args);notsimsAudio.manager.playCue('ui.error');});
   await page.waitForFunction(()=>notsimsAudio.manager.diagnostics.some(d=>d.where==='ui.error'));
  }
  await page.click('#save');const stored=await page.evaluate(()=>({world:JSON.parse(localStorage.getItem('notsims.save.v1')),preferences:JSON.parse(localStorage.getItem('notsims.settings.v1'))}));assert.equal(stored.world.version,1);assert.equal(stored.preferences.music,.34);assert.equal(Object.hasOwn(stored.world,'settings'),false);
  await page.reload({waitUntil:'networkidle0'});await ready(page);assert.equal(await page.evaluate(()=>notsimsAudio.manager.settings.music),.34);assert.equal(await page.evaluate(()=>notsimsAudio.manager.unlocked),false);
  await page.evaluate(()=>notsimsAudio.dispose());assert.equal(await page.evaluate(()=>typeof globalThis.notsimsAudio),'undefined');
  assert.deepEqual(errors,[]);console.log(`${view} ${size.width}×${size.height}: gesture unlock, all WAV decode, MP3 stream/crossfade, owned loops, keyboard settings, mute, persistence, teardown${size.width===1440?', hidden/resume, failed decode and spatial fallback':''}: PASS`);await context.close();
 }
 const disabled=await browser.newPage();await disabled.evaluateOnNewDocument(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});await disabled.goto(`${base}/?view=classic&audioDebug=1`,{waitUntil:'networkidle0'});await ready(disabled);await disabled.click('#begin');assert.equal(await disabled.evaluate(()=>notsimsAudio.manager.unlocked),false);assert.equal(await disabled.$eval('#creator',e=>e.open),false);console.log('Audio unavailable: startup and new game PASS');await disabled.close();
}finally{await browser.close();}
