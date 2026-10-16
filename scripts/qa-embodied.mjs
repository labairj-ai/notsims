// Run with PUPPETEER_MODULE pointing at an installed Puppeteer module if needed.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const imported=await import(process.env.PUPPETEER_MODULE??'puppeteer'),puppeteer=imported.puppeteer??imported.default;
const base=process.env.QA_BASE??'http://127.0.0.1:5173',out=process.env.QA_OUT??'/private/tmp/notsims-embodied-browser';await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader','--no-first-run']});
const results=[];
try{
 for(const view of ['classic','3d'])for(const width of [1440,390]){
  const page=await browser.newPage();await page.setViewport({width,height:width===1440?1000:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/?${view==='classic'?'view=classic':''}`,{waitUntil:'networkidle0'});await page.waitForSelector('#scene-loading[hidden]');assert.equal(await page.$eval('#scene-badge',e=>e.textContent),view==='3d'?'3D WORLD':'CLASSIC VIEW');
  await page.click('#begin');await page.waitForSelector('#creator:not([open])');
  await page.evaluate(async()=>{const {app}=await import('/src/main.js');app.setSpeed(0);window.qaApp=app;});
  for(const [type,id] of [['sofa','shared_sit'],['tv','shared_watch'],['table','shared_eat'],['stove','shared_cook'],['bookcase','shared_read'],['fridge','use'],['bed','use'],['shower','use'],['toilet','use'],['desk','use'],['none','argue'],['none','apologize'],['none','greet']]){
   const stats=await page.evaluate(async({type,id})=>{
    const app=window.qaApp,{newGame}=await import('/src/game/session.js');const s=newGame({},true);s.person.x=7;s.person.y=9;s.social.nextSocialOpportunityMinute=1e8;s.furniture=type==='none'?[]:[{id:1,type,x:7,y:7,rotation:0}];s.social.presences=[{personId:'person_1',x:8,y:9,state:'visiting',path:[],moveClock:0,until:s.minutes+300}];
    if(id.startsWith('shared')){s.activity={kind:'shared',sharedId:1,path:[],elapsed:9,total:45};s.social.sharedActivity={id:1,interactionId:id,objectId:1,personId:'person_1',participants:['player','person_1'],status:'active',slots:[[7,9],[8,9]],elapsed:9,total:45};}
    else if(id==='use')s.activity={kind:'use',id:1,path:[],elapsed:8,total:40};else s.activity={kind:'social',actorId:'player',personId:'person_1',interaction:id,channel:'in_person',path:[],elapsed:2,total:8};
    app.state=s;app.renderer.zoom=2.8;app.renderer.panX=0;app.renderer.panY=0;app.renderer.body.reset();app.renderer.draw(s,app.ui,performance.now()/1000,{paused:true});
    if(app.is3D){for(let i=0;i<80;i++)for(const [actor,h] of [['player',app.renderer.human],...app.renderer.visitors]){const intent=app.renderer.body.intent(s,actor);if(intent.facing!==null)h.root.rotation.y=intent.facing;h.controller.update(intent,1/60);}}
    app.renderer.draw(s,app.ui,performance.now()/1000,{paused:true});app.updateUI(true);document.querySelector('#toast').hidden=true;
    const intent=app.renderer.body.intent(s,'player');return {base:intent.base,gesture:intent.gesture,finite:intent.position.every(Number.isFinite),ik:app.renderer.human?.controller.metrics.ik??0};
   },{type,id});assert.ok(stats.finite);await page.screenshot({path:`${out}/${view}-${width}-${type}-${id}.png`});results.push({view,width,type,id,...stats});
  }
  const meal=await page.evaluate(async()=>{
   const app=window.qaApp,{newGame}=await import('/src/game/session.js'),{advance}=await import('/src/game/dispatch.js');app.state=newGame({},true);const s=app.state;s.person.x=7;s.person.y=9;s.furniture=[{id:1,type:'table',x:7,y:7,rotation:0}];s.social.presences=[{personId:'person_1',x:8,y:9,state:'visiting',path:[],moveClock:0,until:s.minutes+300}];s.social.nextSocialOpportunityMinute=1e8;s.money=0;app.openPerson('person_1');
   const button=document.querySelector('[data-shared="shared_eat"]');const disabled=button?.disabled&&button.textContent.includes('$16 for two');s.money=16;app.updateUI(true);const enabled=!document.querySelector('[data-shared="shared_eat"]').disabled;
   const result=app.send({type:'SHARED_ACTIVITY',personId:'person_1',objectId:1,interactionId:'shared_eat'}),events=[];for(let i=0;i<120&&s.social.sharedActivity;i++){const result=advance(s,1);events.push(...result.events);app.renderer.body.receive(result);}document.querySelector('#social-close').click();
   return {disabled,enabled,ok:result.ok,balance:s.money,charges:events.filter(e=>e.type==='MONEY_SPENT'&&e.reason==='shared_meal').length,completed:events.some(e=>e.type==='SHARED_ACTIVITY_COMPLETED')};
  });assert.deepEqual(meal,{disabled:true,enabled:true,ok:true,balance:0,charges:1,completed:true});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.waitForFunction(()=>window.qaApp.renderer.body.reducedMotion);assert.deepEqual(errors,[]);await page.close();
 }
 await writeFile(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');console.log(`Verified ${results.length} Classic/3D desktop/mobile-size cases; live reduced motion; no runtime errors. Screenshots: ${out}`);
}finally{await browser.close();}
