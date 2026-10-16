// Isolated browser fixture; UI starts each shared activity, domain time is advanced explicitly.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>i%2?a:[...a,[v.slice(2),s[i+1]]],[]));
const {puppeteer}=await import(pathToFileURL(args['puppeteer-module']).href),out=args.out||'/private/tmp/notsims-shared-browser';await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:args.chrome,headless:true,args:['--enable-unsafe-swiftshader']}),results=[];
try{for(const view of ['classic','3d'])for(const width of [390,1440]){
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width,height:width===390?844:1000,isMobile:width===390,hasTouch:width===390});await page.goto((args.url||'http://127.0.0.1:5187/')+'?view='+view,{waitUntil:'networkidle0'});await page.select('#lot','empty');await page.click('#begin');
 await page.evaluate(async()=>{window.qaApp=(await import('./src/main.js')).app;qaApp.setSpeed(0);});
 for(const [type,id] of [['sofa','shared_sit'],['tv','shared_watch'],['table','shared_eat'],['stove','shared_cook'],['bookcase','shared_read']]){
 await page.evaluate(async type=>{const {newGame}=await import('./src/game/session.js'),{advance}=await import('./src/game/dispatch.js');qaApp.audio.reset();qaApp.state=newGame({},true);qaApp.state.social.nextSocialOpportunityMinute=1e8;qaApp.state.furniture=[{id:qaApp.state.nextId++,type,x:7,y:7,rotation:0}];qaApp.send({type:'INVITE_OVER',personId:'person_1'});advance(qaApp.state,45);qaApp.state.social.presences[0].until=qaApp.state.minutes+200;qaApp.openPerson('person_1');qaApp.updateUI();},type);
 assert.ok(await page.$$eval('.social-choice',buttons=>buttons.length<=5));await page.click(`[data-shared=${id}]`);
 const state=await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');const facts=[];for(let i=0;i<80;i++){const r=advance(qaApp.state,1);qaApp.audio.receive(r);facts.push(...r.events);if(qaApp.state.social.sharedActivity?.status==='active')return {status:'active',facts};if(!qaApp.state.social.sharedActivity)return {status:'cancelled',facts};}return {status:'timeout',facts};});assert.equal(state.status,'active',JSON.stringify(state));
 await page.click('#social-close');await page.evaluate(()=>{qaApp.renderer.zoom=2.5;qaApp.updateUI();});await page.screenshot({path:`${out}/${view}-${width}-${id}.png`});
 if(view==='3d'){assert.ok(await page.evaluate(()=>qaApp.renderer.visitors.size===1));assert.equal(await page.evaluate(()=>qaApp.renderer.visitors.get('person_1').current),id==='shared_sit'?'Sit':id==='shared_cook'||id==='shared_eat'?'Eat':'Idle');}
 const complete=await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');const r=advance(qaApp.state,60);qaApp.audio.receive(r);return r.events.some(e=>e.type==='SHARED_ACTIVITY_COMPLETED');});assert.equal(complete,true);results.push({view,width,activity:id,passed:true});
 }
 const audio=await page.evaluate(async()=>{const {AUDIO_ASSETS}=await import('./src/audio/audio-library.js');for(const id of ['social-text','social-ring','social-knock','social-milestone'])await qaApp.audio.manager.backend.load(AUDIO_ASSETS[id]);return qaApp.audio.manager.debug();});assert.deepEqual(audio.diagnostics,[]);assert.deepEqual(errors,[]);console.log(`${view} ${width}: five shared activities, poses, completion and four audio decodes PASS`);await page.close();
}}finally{await writeFile(out+'/results.json',JSON.stringify(results,null,2)+'\n');await browser.close();}
