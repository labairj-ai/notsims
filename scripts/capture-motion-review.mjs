// Optional human-review preparation, not perceptual acceptance. Uses isolated fixture pages.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const imported=await import(process.env.PUPPETEER_MODULE??'puppeteer'),puppeteer=imported.puppeteer??imported.default;
const base=process.env.QA_BASE??'http://127.0.0.1:5187',out=process.env.QA_OUT??'/private/tmp/notsims-human-motion-review';await mkdir(out,{recursive:true});
const sourceSha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),assetSha256=createHash('sha256').update(await readFile('assets/notsims-human.glb')).digest('hex');
const cases=[['walk-1x',1],['walk-3x',3],['walk-8x',8],['chat',1],['argue',1],['apologize',1],['fridge',1],['shared-cook',1]];
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader','--no-first-run']});const results=[];
try{for(const view of ['classic','3d']){
 const page=await browser.newPage();await page.setViewport({width:960,height:800});await page.goto(`${base}/?view=${view}`,{waitUntil:'networkidle0'});await page.click('#begin');await page.evaluate(async()=>{window.reviewApp=(await import('/src/main.js')).app;reviewApp.setSpeed(0);});
 for(const [name,speed] of cases){await page.evaluate(async({name})=>{const app=window.reviewApp,{newGame}=await import('/src/game/session.js'),{advance}=await import('/src/game/dispatch.js');app.setSpeed(0);app.audio.reset();app.audio.manager.mute(true);app.selectTab('live');app.mobile?.setSheet('collapsed');app.state=newGame({},true);const s=app.state;s.social.nextSocialOpportunityMinute=1e8;s.person.x=7;s.person.y=9;
 s.social.presences=[{personId:'person_1',x:8,y:9,state:'visiting',visitId:s.social.nextId++,path:[],moveClock:0,nextInitiationMinute:s.minutes+500,until:s.minutes+500,exit:[8,17]}];
 if(name.startsWith('walk')){s.social.presences=[];app.send({type:'MOVE_TO',x:13,y:9});}
 else if(name==='fridge'){s.furniture=[{id:s.nextId++,type:'fridge',x:7,y:7,rotation:0}];s.person.y=6;app.send({type:'INTERACT',id:1});}
 else if(name==='shared-cook'){s.furniture=[{id:s.nextId++,type:'stove',x:7,y:7,rotation:0}];app.send({type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId:'shared_cook'});advance(s,20);}
 else app.send({type:'SOCIAL_INTERACT',personId:'person_1',interaction:name,channel:'in_person'});
 app.renderer.zoom=2.8;app.renderer.panX=0;app.renderer.panY=0;app.renderer.body.reset();document.querySelector('#toast').hidden=true;app.updateUI(true);
 },{name});
 const filename=`${view}-${name}.webm`,recorder=await page.screencast({path:`${out}/${filename}`,ffmpegPath:process.env.FFMPEG_PATH??'/opt/homebrew/bin/ffmpeg',fps:15});await page.evaluate(speed=>reviewApp.setSpeed(speed),speed);await new Promise(resolve=>setTimeout(resolve,4000));await page.evaluate(()=>reviewApp.setSpeed(0));await recorder.stop();results.push({view,name,speed,filename});console.log(`${view} ${name}: captured 4 seconds for human review`);
 }await page.close();
}}finally{await browser.close();}
const evidence={kind:'agent-generated review preparation; human acceptance pending',sourceSha,assetSha256,cases:results};await writeFile(`${out}/manifest.json`,JSON.stringify(evidence,null,2)+'\n');
const cards=results.map(r=>`<article><h2>${r.view} · ${r.name}</h2><video controls loop muted preload="metadata" src="${r.filename}"></video></article>`).join('');
await writeFile(`${out}/index.html`,`<!doctype html><meta charset="utf-8"><title>Notsims human motion review — pending</title><style>body{font:16px system-ui;background:#f7f5eb;color:#24382f;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}article{background:white;padding:16px;border-radius:14px}video{width:100%}code{overflow-wrap:anywhere}</style><h1>Motion review preparation</h1><p>These isolated, muted recordings are for a human to inspect. They are not human acceptance, physical-device evidence or audio listening results.</p><p>Source <code>${sourceSha}</code><br>Character <code>${assetSha256}</code></p><p>Record tester, browser, source/asset identity, scenario, observed defects and pass/fail in the repository acceptance matrices. This representative set supplements the full interactive matrix; short clips cannot establish sustained thermal/performance behavior.</p><main>${cards}</main>`);
console.log(`Review gallery: ${out}/index.html`);
