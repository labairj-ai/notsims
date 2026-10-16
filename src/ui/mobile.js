import {$} from './dom.js';
import {itemDef} from '../content/furniture.js';
import {NEEDS} from '../content/needs.js';
export function installMobile(app){
 const media=window.matchMedia?.('(max-width: 1024px)'),panel=$('.studio-panel'),life=$('.life-panel');
 panel.insertAdjacentHTML('afterbegin','<div class="sheet-heading"><button id="sheet-size" aria-label="Expand panel">━</button><strong id="sheet-title">Your life</strong><button id="sheet-close" aria-label="Collapse panel">×</button></div><div id="placement-tray"></div>');
 $('.world').insertAdjacentHTML('beforeend','<div class="mobile-hud"><button id="mobile-needs" aria-label="Open needs"></button><span id="mobile-funds"></span><button id="mobile-menu" aria-label="Game menu">☰</button></div><div class="mobile-time"><span id="mobile-clock"></span><button id="mobile-pause" aria-label="Pause or play">Ⅱ</button><button id="mobile-speed" aria-label="Cycle time speed">1×</button></div>');
 const mobile=app.mobile={active:!!media?.matches,state:'collapsed',setSheet(state){this.state=state;panel.dataset.sheet=state;$('#sheet-size').setAttribute('aria-expanded',String(state==='expanded'));$('#sheet-size').setAttribute('aria-label',state==='expanded'?'Reduce panel':'Expand panel');},selection(){if(this.active)this.setSheet('collapsed');this.update();},update(){
  if(this.lastState&&this.lastState!==app.state)app.dismissObject?.();this.lastState=app.state;
  const names={live:'Your life',build:'Build',shop:'Furnish',career:'Work'};$('#sheet-title').textContent=names[app.ui.tab];
  $('#mobile-funds').textContent=$('#money').textContent;$('#mobile-clock').textContent=$('#weekday').textContent+' · '+$('#clock').textContent;
  const lowest=Object.entries(app.state.needs).sort((a,b)=>a[1]-b[1])[0];$('#mobile-needs').textContent=`${NEEDS[lowest[0]][0]} ${Math.round(lowest[1])}% · ${$('#mood').textContent}`;
  $('#mobile-pause').textContent=app.paused()?'▶':'Ⅱ';$('#mobile-speed').textContent=(app.speed||app.lastNonzero)+'×';
  if(app.ui.selectedObjectId&&!app.state.furniture.some(f=>f.id===app.ui.selectedObjectId))app.dismissObject?.();
  const ui=app.ui,tray=$('#placement-tray'),signature=JSON.stringify([ui.tab,ui.tool,ui.floor,ui.selected,ui.rotation,ui.roomPreview]);if(signature===this.traySignature)return;this.traySignature=signature;tray.replaceChildren();
  if(ui.tab==='build'||ui.tab==='shop'&&ui.selected){const label=document.createElement('span');label.textContent=ui.tab==='build'?`${ui.tool} · ${ui.floor} · ${ui.roomPreview?.message||'Tap to edit; two fingers to navigate'}`:`${itemDef(ui.selected).name} · $${itemDef(ui.selected).price}`;tray.append(label);
   if(ui.tab==='shop'){const rotate=document.createElement('button');rotate.textContent=`Rotate ${ui.rotation*90}°`;rotate.onclick=()=>{ui.rotation=(ui.rotation+1)%4;this.update();};tray.append(rotate);}
   const cancel=document.createElement('button');cancel.textContent='Cancel';cancel.onclick=()=>{ui.selected=null;ui.roomStart=null;ui.roomPreview=null;app.selectTab('live');};tray.append(cancel);}
 }};
 const select=app.selectTab;app.selectTab=tab=>{app.dismissObject?.();app.ui.roomPreview=null;select(tab);mobile.setSheet(tab==='live'?'collapsed':'half');};
 const render=app.renderStudio;app.renderStudio=()=>{render();if(mobile.active){const walker=document.createTreeWalker($('#studio-content'),window.NodeFilter.SHOW_TEXT);while(walker.nextNode()){walker.currentNode.textContent=walker.currentNode.textContent.replace(/Click/g,'Tap').replace(/click/g,'tap').replace(/Press R to rotate or Esc to put it down\./g,'Use Rotate or Cancel in the placement tray.').replace(/Press /g,'Use ');}}if(mobile.active){panel.insertBefore(life,$('#studio-content'));life.hidden=app.ui.tab!=='live';}else life.hidden=false;mobile.update();};
 const update=app.updateUI;app.updateUI=(...args)=>{update(...args);mobile.update();};
 $('#mobile-menu').onclick=()=>$('#game-menu').showModal();$('#mobile-needs').onclick=()=>{app.selectTab('live');mobile.setSheet('half');};
 $('#mobile-pause').onclick=()=>{const paused=app.paused();if(['build','shop'].includes(app.ui.tab))app.selectTab('live');app.setSpeed(paused?app.lastNonzero:0);};$('#mobile-speed').onclick=()=>{app.selectTab('live');app.setSpeed(({1:3,3:8,8:1})[app.speed||app.lastNonzero]);};
 $('#sheet-close').onclick=()=>mobile.setSheet('collapsed');$('#sheet-size').onclick=()=>mobile.setSheet(mobile.state==='expanded'?'half':'expanded');
 let start;$('.sheet-heading').addEventListener('pointerdown',e=>{start=e.clientY;$('.sheet-heading').setPointerCapture?.(e.pointerId);});$('.sheet-heading').addEventListener('pointerup',e=>{if(start!==undefined&&Math.abs(e.clientY-start)>25)mobile.setSheet(e.clientY>start?'collapsed':'expanded');start=undefined;});
 const layout=()=>{mobile.active=!!media?.matches;$('#world').setAttribute('aria-label',mobile.active?'Home and garden. Tap ground to walk, furniture to interact. Drag to pan, pinch to zoom. Use two fingers to navigate while building.':'Home and garden. Click ground to walk and furniture to interact.');document.documentElement.classList.toggle('mobile-layout',mobile.active);if(!mobile.active)document.querySelector('.game-layout').prepend(life);app.renderStudio();};media?.addEventListener('change',layout);
 const viewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--app-height',`${v?.height||window.innerHeight}px`);document.documentElement.style.setProperty('--app-top',`${v?.offsetTop||0}px`);};window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);window.addEventListener('resize',viewport);viewport();
 document.addEventListener('focusin',e=>{if(e.target.matches('input,select,textarea'))setTimeout(()=>e.target.scrollIntoView?.({block:'nearest'}),100);});
 // Short, dismissible guidance remains available in Help; no gameplay gate or save field.
 $('#help-dialog .guide').insertAdjacentHTML('afterbegin','<div class="touch-guide"><p><b>Your world, at your fingertips.</b> Tap ground to walk; tap furniture to choose an action. Drag to pan and pinch to zoom.</p><p>Use Build and Furnish below. Drag corner to corner to draw a room. While editing, use two fingers to pan or pinch. Rotate and Cancel are in the placement tray.</p></div>');
 layout();mobile.setSheet('collapsed');
}
