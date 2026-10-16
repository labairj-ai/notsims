// Production presentation diagnostics, not a substitute for a human listening check.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const arg=name=>process.argv[process.argv.indexOf(name)+1];
const {puppeteer}=await import(pathToFileURL(arg('--puppeteer-module')).href);
const base=arg('--url').replace(/\/$/,''),report=[];
const browser=await puppeteer.launch({executablePath:arg('--chrome'),headless:true,args:['--enable-unsafe-swiftshader']});
try{
 for(const view of ['classic','3d']){
  const context=await browser.createBrowserContext(),page=await context.newPage();await page.setViewport({width:1440,height:1000});
  const audioRequests=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(/\.(wav|mp3)$/.test(r.url()))audioRequests.push({url:r.url(),status:r.status(),contentType:r.headers()['content-type'],contentRange:r.headers()['content-range']??null});});
  await page.goto(`${base}/?audioDebug=1${view==='classic'?'&view=classic':''}`,{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>globalThis.notsimsAudio&&document.querySelector('#scene-loading').hidden);
  const before=await page.evaluate(()=>notsimsAudio.debug());assert.equal(before.unlocked,false);assert.equal(audioRequests.length,0);
  await page.click('#character-name');await page.waitForFunction(()=>notsimsAudio.manager.unlocked&&notsimsAudio.music.current?.ready);
  await page.evaluate(()=>{
   globalThis.certification={cues:[]};const m=notsimsAudio.manager,play=m.playCue.bind(m);m.playCue=(id,options)=>{const token=play(id,options);if(token!==null)certification.cues.push({id,token,time:performance.now()});return token;};
   certification.sample=async bus=>{const b=m.backend,a=b.context.createAnalyser();a.fftSize=2048;b.buses[bus].connect(a);const data=new Float32Array(a.fftSize);let peak=0;for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,25));a.getFloatTimeDomainData(data);for(const n of data)peak=Math.max(peak,Math.abs(n));}b.buses[bus].disconnect(a);return peak;};
  });
  const menu=await page.evaluate(async()=>({music:notsimsAudio.music.debug(),peak:await certification.sample('music')}));assert.equal(menu.music.state,'menu');assert.equal(menu.music.track,'little-morning');assert.ok(menu.peak>1e-6,'music bus has no nonzero audio signal');
  const confirmation=await page.evaluate(async()=>{const token=notsimsAudio.manager.playCue('ui.confirm');return {token,peak:await certification.sample('ui')};});assert.ok(confirmation.token);assert.ok(confirmation.peak>1e-6,'UI bus has no nonzero audio signal');
  await page.click('#begin');await page.waitForFunction(()=>notsimsAudio.music.state==='home.day'&&notsimsAudio.music.current?.ready);
  await page.evaluate(async()=>{const {AUDIO_ASSETS}=await import('./src/audio/audio-library.js');await Promise.all(Object.values(AUDIO_ASSETS).filter(a=>a.kind!=='music').map(a=>notsimsAudio.manager.backend.load(a)));});
  const interactions=[];
  for(const type of ['shower','stove','tv','desk','fridge','toilet']){
   const result=await page.evaluate(async type=>{
    const {app}=await import('./src/main.js'),{advance}=await import('./src/game/dispatch.js'),{canPlace}=await import('./src/systems/building/placement.js');
    app.dispatch({type:'CANCEL_ACTION'});let f=app.state.furniture.find(f=>f.type===type);
    if(!f){const xy=Object.keys(app.state.floors).map(k=>k.split(',').map(Number)).find(([x,y])=>canPlace(app.state,type,x,y));if(!xy)throw Error('No place for '+type);const placed=app.dispatch({type:'PLACE_OBJECT',object:type,x:xy[0],y:xy[1]});if(!placed.ok)throw Error(JSON.stringify(placed));f=app.state.furniture.find(f=>f.type===type);}
    const queued=app.dispatch({type:'INTERACT',id:f.id});if(!queued.ok)throw Error(JSON.stringify(queued));advance(app.state,1);
    const pathLength=app.state.activity?.path?.length;const earlyLoops=notsimsAudio.manager.debug().loops.filter(c=>c.startsWith('interaction.'));
    for(let n=0;n<500&&app.state.activity?.path?.length;n++)advance(app.state,1);
    if(!app.state.activity||app.state.activity.id!==f.id)throw Error('Did not reach '+type);
    app.audio.frame();await new Promise(r=>setTimeout(r,100));
    const active={pathLength,earlyLoops,loops:notsimsAudio.manager.debug().loops,object:type,position:{x:app.state.person.x,y:app.state.person.y},cues:certification.cues.slice(-8)};
    if(['fridge','toilet'].includes(type)){const finished=advance(app.state,50);app.audio.receive(finished);active.completion=finished.events.map(e=>e.type);active.completionCues=certification.cues.slice(-8).map(c=>c.id);}
    app.dispatch({type:'CANCEL_ACTION'});active.afterCancel=notsimsAudio.manager.debug().loops.filter(c=>c.startsWith('interaction.'));return active;
   },type);
   if(result.pathLength>0)assert.equal(result.earlyLoops.length,0);assert.equal(result.afterCancel.length,0);
   const loop={shower:'interaction.shower.loop',stove:'interaction.stove.loop',tv:'interaction.tv.loop',desk:'interaction.desk.loop'}[type];if(loop)assert.ok(result.loops.includes(loop));
   if(type==='toilet')assert.ok(result.completionCues.includes('interaction.toilet.flush'));if(type==='fridge')assert.ok(result.completionCues.includes('interaction.fridge.close'));
   interactions.push(result);
  }
  await page.evaluate(async()=>{const {app}=await import('./src/main.js');app.setSpeed(8);app.dispatch({type:'MOVE_TO',x:8,y:16});});
  await page.waitForFunction(async()=>{const {app}=await import('./src/main.js');return !app.state.activity&&!app.state.queue.length;});
  const steps=await page.evaluate(()=>certification.cues.filter(c=>c.id.startsWith('movement.footstep.')));assert.ok(steps.some(c=>c.id==='movement.footstep.indoor'));assert.ok(steps.some(c=>c.id==='movement.footstep.outdoor'));
  const purchase=await page.evaluate(async()=>{const {app}=await import('./src/main.js'),{canPlace}=await import('./src/systems/building/placement.js');app.setSpeed(1);const [x,y]=Object.keys(app.state.floors).map(k=>k.split(',').map(Number)).find(([x,y])=>canPlace(app.state,'chair',x,y));const bought=app.dispatch({type:'PLACE_OBJECT',object:'chair',x,y});await new Promise(r=>setTimeout(r,150));const sold=app.dispatch({type:'ERASE',x,y,edge:`h:${x},${y}`});const failed=app.dispatch({type:'PLACE_OBJECT',object:'chair',x:17,y:17});return {bought,sold,failed};});assert.ok(purchase.bought.ok&&purchase.sold.ok&&!purchase.failed.ok);
  const daytime=await page.evaluate(async()=>({music:notsimsAudio.music.debug(),peak:await certification.sample('music')}));assert.equal(daytime.music.state,'home.day');assert.ok(daytime.peak>1e-6);
  await page.evaluate(async()=>{const {app}=await import('./src/main.js'),{advance}=await import('./src/game/dispatch.js');advance(app.state,Math.max(0,1200-app.state.minutes));});await page.waitForFunction(()=>notsimsAudio.music.state==='home.evening'&&notsimsAudio.music.current?.ready);
  const evening=await page.evaluate(async()=>({music:notsimsAudio.music.debug(),peak:await certification.sample('music')}));assert.equal(evening.music.track,'porch-light');assert.ok(evening.peak>1e-6);
  await page.waitForFunction(()=>notsimsAudio.manager.musicVoices.size===1);
  await page.click(await page.$eval('#menu',e=>e.getBoundingClientRect().width>0)?'#menu':'#mobile-menu');await page.click('#audio-menu');await page.focus('#volume-music');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');await page.click('[data-close="audio-settings"]');
  const after=await page.evaluate(()=>({debug:notsimsAudio.debug(),music:notsimsAudio.music.debug(),settings:localStorage.getItem('notsims.settings.v1'),observed:certification.cues}));assert.deepEqual(after.debug.diagnostics,[]);assert.equal(after.debug.unlocked,true);assert.equal(after.debug.suspended,false);assert.equal(after.debug.muted,false);for(const bus of ['master','music','sfx'])assert.ok(after.debug.buses[bus]>0);
  assert.deepEqual(errors,[]);assert.ok(audioRequests.every(r=>(r.status===200||(r.status===206&&r.contentRange))&&r.contentType.startsWith('audio/')),JSON.stringify(audioRequests.filter(r=>r.status!==200)));
  report.push({view,browser:await browser.version(),before,confirmation,menu,daytime,evening,interactions,steps,purchase,after,audioRequests,errors,humanListening:'not performed by automated tool'});console.log(`${view}: production unlock, nonzero music/UI audio signal, all interaction families, indoor/outdoor footsteps, placement/sale/error, clean diagnostics: PASS`);await context.close();
 }
 await writeFile(arg('--report'),JSON.stringify(report,null,2)+'\n');
}finally{await browser.close();}
