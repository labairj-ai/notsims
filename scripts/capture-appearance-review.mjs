// Browser evidence preparation; these measurements never certify human/phone QA.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const imported=await import(process.env.PUPPETEER_MODULE??'puppeteer'),puppeteer=imported.puppeteer??imported.default;
const base=process.env.QA_BASE??'http://127.0.0.1:5197',out=process.env.QA_OUT??'/private/tmp/notsims-appearance-review';await mkdir(out,{recursive:true});
const colors={black:'#16120f',brown:'#4a2c1b',auburn:'#8a3324',red:'#cc4b32',blonde:'#d9b27c',platinum:'#eee3cf'},styles=['short','long','curly'];
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader','--no-first-run']});
const browserVersion=await browser.version();
const results=[],errors=[],requestCounts={};let pageId=0;
async function boot(view='3d',width=1100,height=900){const page=await browser.newPage(),id=String(++pageId);requestCounts[id]=0;page.on('dialog',dialog=>dialog.accept());await page.setViewport({width,height});page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(r.url().endsWith('/assets/notsims-human.glb'))requestCounts[id]++;});await page.goto(`${base}/?view=${view}`,{waitUntil:'networkidle0'});await page.evaluate(async()=>{window.reviewApp=(await import('/src/main.js')).app;reviewApp.setSpeed(0);reviewApp.audio.manager.mute(true);});if(view==='3d'&&!await page.evaluate(()=>reviewApp.is3D&&!!reviewApp.characterPreview?.human))throw Error('Real WebGL/GLB preview unavailable');return page;}
async function select(page,style,hair){await page.select('#hairstyle',style);await page.$eval('#hair',(e,hair)=>{e.value=hair;e.dispatchEvent(new Event('input',{bubbles:true}));},hair);await page.evaluate(()=>reviewApp.characterPreview?.draw());}
try{
 const page=await boot();
 await page.evaluate(()=>{const a=reviewApp.characterPreview.human;window.originalAppearance={human:a,model:a.model,mixer:a.mixer,materials:[...a.materials],renderer:reviewApp.characterPreview.renderer};});
 for(const style of styles)for(const [color,hair]of Object.entries(colors)){
  await select(page,style,hair);const filename=`creator-${style}-${color}.png`;await (await page.$('#character-preview')).screenshot({path:`${out}/${filename}`});
  const state=await page.evaluate(()=>{const h=reviewApp.characterPreview.human,o=originalAppearance;return {colors:h.appearanceMaterials.hair.map(m=>m.color.getHexString()),stable:h===o.human&&h.model===o.model&&h.mixer===o.mixer&&h.materials.every((m,i)=>m===o.materials[i])&&reviewApp.characterPreview.renderer===o.renderer};});
  if(!state.stable||state.colors.some(c=>c!==hair.slice(1)))throw Error('Preview appearance allocation/color regression');results.push({surface:'creator',style,color,hair,filename,...state});
 }
 await page.click('#begin');
 // Use the actual live renderer, scene, materials and day/night lighting. A
 // temporary close-up camera makes hair detail inspectable; never save it.
 for(const lighting of ['day','night'])for(const style of styles)for(const [color,hair]of Object.entries(colors)){
  await page.evaluate(async({style,hair,lighting})=>{const app=reviewApp,{PerspectiveCamera}=await import('three');app.state.minutes=lighting==='day'?720:1320;const p=app.state.person;const r=app.send({type:'CHANGE_APPEARANCE',appearance:{name:p.name,skin:p.skin,shirt:p.shirt,trait:p.trait,style,hair}});if(!r.ok)throw Error(r.code);app.renderer.draw(app.state,app.ui,0,{paused:true});
   const h=app.renderer.human,pos=h.root.position;const camera=new PerspectiveCamera(28,app.renderer.canvas.width/app.renderer.canvas.height,.1,100);camera.position.set(pos.x+.7,pos.y+1.65,pos.z+2);camera.lookAt(pos.x,pos.y+1.5,pos.z);camera.updateMatrixWorld();app.renderer.pin.visible=false;window.reviewCamera=camera;
  },{style,hair,lighting});
  // RAF would redraw with the ordinary world camera between evaluation and a
  // screenshot; capture synchronously after drawing the inspection camera.
  const data=await page.evaluate(()=>{const r=reviewApp.renderer;r.renderer.render(r.scene,reviewCamera);return r.canvas.toDataURL('image/png');});
  const filename=`live-${lighting}-${style}-${color}.png`;await writeFile(`${out}/${filename}`,Buffer.from(data.split(',')[1],'base64'));results.push({surface:'live',lighting,style,color,hair,filename,camera:'inspection close-up; actual live scene/lighting'});
 }
 // Full normal-world render documents the inspection camera limitation.
 await page.evaluate(()=>reviewApp.renderer.draw(reviewApp.state,reviewApp.ui,0,{paused:true}));await (await page.$('#world')).screenshot({path:`${out}/live-normal-camera.png`});
 await page.close();
 for(const view of ['3d','classic'])for(const width of [320,390,430]){
  const p=await boot(view,width,844);await select(p,'long',colors.blonde);
  const layout=await p.evaluate(()=>{const dialog=document.querySelector('#creator'),preview=document.querySelector('#character-preview'),r=preview.getBoundingClientRect();return {dialogOverflow:dialog.scrollWidth>dialog.clientWidth+1,previewWidth:r.width,previewHeight:r.height,pickerWidth:document.querySelector('#hair').getBoundingClientRect().width};});
  if(layout.dialogOverflow||layout.previewWidth<40||layout.previewHeight<40||layout.pickerWidth<44)throw Error(`Creator layout regression ${view}/${width}`);
  await p.screenshot({path:`${out}/${view}-${width}-creator.png`});await p.click('#begin');await p.evaluate(()=>reviewApp.setSpeed(0));
  await p.click('#mobile-needs');await p.click('#edit-character');await select(p,'curly',colors.platinum);await p.click('#begin');await p.click('#mobile-menu');await p.click('#manual-save');await p.click('[data-close=game-menu]');
  await p.reload({waitUntil:'networkidle0'});await p.click('#resume');await p.evaluate(async()=>{window.reviewApp=(await import('/src/main.js')).app;reviewApp.setSpeed(0);});
  const persisted=await p.evaluate(()=>({hair:reviewApp.state.person.hair,style:reviewApp.state.person.style}));if(persisted.hair!==colors.platinum||persisted.style!=='curly')throw Error('Reload lost appearance');
  // Exercise the actual browser download and file-input import handlers.
  const client=await p.createCDPSession();await client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:out});await p.evaluate(()=>document.querySelector('#export').click());
  // Observe the Blob directly too: native download completion need not be raced.
  const exported=await p.evaluate(async()=>{const old=URL.createObjectURL;let json;URL.createObjectURL=blob=>{json=blob.text();return old(blob);};document.querySelector('#export').click();URL.createObjectURL=old;return await json;});
  const saveFile=`${out}/lifecycle-${view}-${width}.json`;await writeFile(saveFile,exported);
  await p.evaluate(()=>{const r=reviewApp.send({type:'CHANGE_APPEARANCE',appearance:{hair:'#16120f',style:'short'}});if(!r.ok||reviewApp.state.person.hair!=='#16120f')throw Error('Import test did not change original state');});
  const input=await p.$('#import-file');await input.uploadFile(saveFile);await p.waitForFunction(()=>reviewApp.state.person.hair==='#eee3cf');
  await p.click('#mobile-needs');await p.click('#edit-character');const reopened=await p.$eval('#hair',e=>e.value);if(reopened!==colors.platinum)throw Error('Reopened creator lost imported color');
  await p.screenshot({path:`${out}/${view}-${width}-restored.png`});results.push({surface:'lifecycle',view,width,...layout,persisted,imported:true,reopened:true,physicalDevice:false});await p.close();
 }
 // Contact sheets retain every case while keeping review documentation small.
 const sheet=await browser.newPage();await sheet.setViewport({width:1680,height:1200});
 for(const [name,selected]of [['creator',results.filter(r=>r.surface==='creator')],['day',results.filter(r=>r.lighting==='day')],['night',results.filter(r=>r.lighting==='night')]]){
  const images=[];for(const r of selected){const data=(await readFile(`${out}/${r.filename}`)).toString('base64');images.push(`<figure><img src="data:image/png;base64,${data}"><figcaption>${r.style} · ${r.color} · ${r.hair}</figcaption></figure>`);}
  await sheet.setContent(`<style>body{margin:16px;font:16px system-ui;background:#eee9db;color:#24382f}main{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}figure{margin:0;background:#e2e8d4}img{display:block;width:100%;height:300px;object-fit:contain}figcaption{padding:8px;font-size:14px}</style><h1>${name} hair matrix — automated browser evidence</h1><p>18 combinations. Live uses inspection camera with actual scene lighting. Human visual acceptance remains open.</p><main>${images.join('')}</main>`);
  await sheet.screenshot({path:`${out}/matrix-${name}.png`,fullPage:true});
 }
 await sheet.close();
 if(JSON.stringify(Object.values(requestCounts))!==JSON.stringify([1,2,2,2,0,0,0]))throw Error('Unexpected GLB reload count outside navigation');
 if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
const evidence={kind:'automated browser rendering/lifecycle; human visual and physical-device acceptance pending',sourceSha:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceClean:!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),assetSha256:createHash('sha256').update(await readFile('assets/notsims-human.glb')).digest('hex'),browser:browserVersion,mode:'headless Chrome; SwiftShader allowed; not a physical phone',requestCounts,errors,cases:results};
await writeFile(`${out}/manifest.json`,JSON.stringify(evidence,null,2)+'\n');
const cards=results.filter(r=>r.filename).map(r=>`<figure><img loading="lazy" src="${r.filename}"><figcaption>${r.surface} ${r.lighting??''} · ${r.style} · ${r.color}</figcaption></figure>`).join('');await writeFile(`${out}/index.html`,`<!doctype html><meta charset="utf-8"><title>Notsims appearance review</title><style>body{font:16px system-ui;background:#eee9db;color:#24382f;margin:24px}main{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}figure{margin:0}img{width:100%;background:#e2e8d4}figcaption{font-size:12px}</style><h1>Character appearance matrix</h1><p>Automated headless browser evidence. Human visual/physical-mobile acceptance pending. Live detail uses an inspection camera with actual scene lighting; normal-camera reference is included separately.</p><p>Source ${evidence.sourceSha}; clean=${evidence.sourceClean}; asset ${evidence.assetSha256}</p><main>${cards}</main>`);
console.log(`Captured ${results.length} cases at ${out}; human acceptance pending.`);
