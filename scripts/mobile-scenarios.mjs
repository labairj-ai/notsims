// Optional real-browser interaction regressions. Supply external Puppeteer/Chrome.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>i%2?a:[...a,[v.slice(2),s[i+1]]],[]));
const {puppeteer}=await import(pathToFileURL(args['puppeteer-module']).href);
const browser=await puppeteer.launch({executablePath:args.chrome,headless:true,args:['--enable-unsafe-swiftshader']});
try{for(const view of ['classic','3d']){
 const page=await browser.newPage();await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await page.goto((args.url||'http://127.0.0.1:5180/')+'?view='+view,{waitUntil:'networkidle0'});
 assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('#creator button,#creator input,#creator select')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&!e.hidden&&(r.width<44||r.height<44)}).map(e=>e.id)),[]);
 await page.focus('#character-name');await page.setViewport({width:390,height:450,isMobile:true,hasTouch:true});
 await page.waitForFunction(()=>parseFloat(document.documentElement.style.getPropertyValue('--app-height'))<=450);
 assert.ok(await page.$eval('#creator',e=>e.getBoundingClientRect().height<=450));
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.select('#lot','empty');await page.click('#begin');
 await page.evaluate(async()=>{window.qaApp=(await import('./src/main.js')).app;window.qaCommands=[];const send=qaApp.send;qaApp.send=(c,...a)=>{qaCommands.push(c);return send(c,...a);};});
 await page.click('#mobile-needs');assert.equal(await page.evaluate(()=>qaApp.mobile.state),'half');
 await page.click('#sheet-size');assert.equal(await page.evaluate(()=>qaApp.mobile.state),'expanded');await page.click('#sheet-close');assert.equal(await page.evaluate(()=>qaApp.mobile.state),'collapsed');
 await page.click('#mobile-pause');assert.equal(await page.evaluate(()=>qaApp.speed),0);await page.click('#mobile-pause');assert.equal(await page.evaluate(()=>qaApp.speed),1);
 await page.click('[data-tab=build]');await page.click('[data-tool=floor]');await page.click('#mobile-pause');assert.ok(await page.evaluate(()=>qaApp.ui.tab==='live'&&qaApp.speed>0));
 await page.click('[data-tab=build]');await page.click('[data-tool=room]');
 const cdp=await page.createCDPSession();const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([id,x,y])=>({id,x,y,radiusX:5,radiusY:5,force:1}))});
 const [start,end]=await page.evaluate(()=>[qaApp.renderer.p(4.5,4.5),qaApp.renderer.p(7.5,7.5)]);await page.evaluate(()=>{qaCommands=[];});
 await touch('touchStart',[[1,...start]]);await touch('touchMove',[[1,...end]]);assert.ok(await page.evaluate(()=>qaApp.ui.roomPreview?.valid));await touch('touchEnd',[]);
 assert.equal(await page.evaluate(()=>qaCommands.filter(c=>c.type==='BUILD_ROOM').length),1);assert.equal(await page.evaluate(()=>Object.keys(qaApp.state.floors).length),16);
 await page.click('[data-tab=shop]');await page.click('[data-item]');for(let i=0;i<4;i++)await page.click('#placement-tray button');assert.equal(await page.evaluate(()=>qaApp.ui.rotation),0);
 await touch('touchStart',[[1,...start]]);await touch('touchEnd',[]);assert.equal(await page.evaluate(()=>qaApp.state.furniture.length),1);
 await page.click('#placement-tray button:last-child');assert.equal(await page.evaluate(()=>qaApp.ui.tab),'live');
 await touch('touchStart',[[1,...start]]);await touch('touchEnd',[]);assert.ok(await page.evaluate(()=>!document.querySelector('#object-popup').hidden&&qaApp.ui.selectedObjectId));await page.click('.close-popup');assert.equal(await page.evaluate(()=>qaApp.ui.selectedObjectId),null);
 await page.click('#mobile-menu');await page.click('#help');assert.ok(await page.$eval('.touch-guide',e=>getComputedStyle(e).display!=='none'));await page.click('[data-close="help-dialog"]');
 console.log(`${view}: creator geometry/viewport, sheet states, play from Build, room drag, rotation/placement, object sheet/cancel and help PASS`);await page.close();
}}finally{await browser.close();}
