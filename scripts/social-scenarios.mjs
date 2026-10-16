// Optional real-browser social acceptance. Uses isolated pages and deterministic QA state.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>i%2?a:[...a,[v.slice(2),s[i+1]]],[]));
const {puppeteer}=await import(pathToFileURL(args['puppeteer-module']).href);
const browser=await puppeteer.launch({executablePath:args.chrome,headless:true,args:['--enable-unsafe-swiftshader']});
const base=args.url||'http://127.0.0.1:5187/',out=args.out||'/private/tmp/notsims-social-browser';await mkdir(out,{recursive:true});
try{for(const view of ['classic','3d'])for(const width of [320,390,430,1440]){
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width,height:width<500?844:1000,isMobile:width<500,hasTouch:width<500});
 await page.goto(base+'?view='+view,{waitUntil:'networkidle0'});await page.select('#lot','empty');await page.click('#begin');
 await page.evaluate(async()=>{window.qaApp=(await import('./src/main.js')).app;qaApp.setSpeed(0);qaApp.state.social.nextSocialOpportunityMinute=1e8;});
 assert.equal(await page.evaluate(()=>qaApp.is3D),view==='3d');
 if(width<500)await page.click('#mobile-phone');else await page.click('.life-panel [data-action=chat]');
 await page.click('[data-person=person_1]');await page.select('#social-channel','text');assert.ok(await page.$$eval('.social-choice',buttons=>buttons.length<=5));await page.click('[data-interaction=chat][data-channel=text]');
 await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');advance(qaApp.state,20);qaApp.updateUI();});
 assert.equal(await page.evaluate(()=>qaApp.state.relationships['person_1|player'].contactCount),1);
 await page.click('[data-invite=now]');await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');advance(qaApp.state,60);qaApp.updateUI();});
 assert.equal(await page.evaluate(()=>qaApp.state.social.presences.length),1);await page.click('#social-close');
 const point=await page.evaluate(()=>{const p=qaApp.state.social.presences[0];const [x,y]=qaApp.renderer.p(p.x+.5,p.y+.5,.65),r=document.querySelector('#world').getBoundingClientRect();return [x+r.left,y+r.top];});
 await page.mouse.click(...point);assert.ok(await page.$eval('#social-sheet',e=>!e.hidden));assert.ok(await page.$eval('#social-sheet',e=>e.textContent.includes('Maya Hart')));
 const small=await page.evaluate(()=>[...document.querySelectorAll('#social-sheet button')].filter(e=>{const r=e.getBoundingClientRect();return (r.width>0||r.height>0)&&(r.width<44||r.height<44)}).map(e=>e.textContent));assert.deepEqual(small,[]);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:`${out}/${view}-${width}.png`});
 if(view==='3d')assert.equal(await page.evaluate(()=>qaApp.renderer.visitors.size),1);
 await page.click('#social-leave');await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');advance(qaApp.state,60);qaApp.updateUI();});assert.equal(await page.evaluate(()=>qaApp.state.social.presences.length),0);
 await page.click('#social-close');await page.evaluate(async()=>{const {advance}=await import('./src/game/dispatch.js');qaApp.state.contacts=[];qaApp.state.minutes=600;qaApp.state.social.nextSocialOpportunityMinute=601;advance(qaApp.state,1);qaApp.updateUI();});
 assert.equal(await page.$eval('#social-event',e=>e.hidden),false);await page.click('[data-response=outside]');assert.equal(await page.evaluate(()=>qaApp.state.social.presences[0].state),'visiting');
 assert.deepEqual(errors,[]);console.log(`${view} ${width}: phone, text, invitation, visible visitor, person picking, targets, event response, clean diagnostics PASS`);await page.close();
}}finally{await browser.close();}
