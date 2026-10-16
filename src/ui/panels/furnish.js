import {$} from '../dom.js';
import {CATALOG,itemDef} from '../../content/furniture.js';
import {money,esc} from '../dom.js';
export function furnishPanel({ui,state}){return `<span class="eyebrow">GOOD THINGS, SMALL SPACES</span><h2>Make yourself at home.</h2><p class="intro">A few favorite things.<br>A little more you.</p><div class="filter-row">${['All','Living','Bedroom','Kitchen','Bathroom','Decor'].map(c=>`<button class="${ui.category===c?'active':''}" data-category="${c}">${c}</button>`).join('')}</div><div class="catalog">${CATALOG.filter(d=>ui.category==='All'||d.category===ui.category).map(d=>`<button class="item-card ${ui.selected===d.id?'active':''}" data-item="${d.id}" aria-label="Buy ${d.name} for ${money(d.price)}"><div class="item-image"><canvas width="110" height="72" data-thumb="${d.id}" aria-hidden="true"></canvas></div><strong>${d.name}</strong><small>${money(d.price)}</small></button>`).join('')}</div><div class="shop-tools"><span id="selected-label">${ui.selected?esc(itemDef(ui.selected).name):'Pick a favorite, then a place.'}</span><button id="rotate">Rotate ↻ <small>R</small></button></div><div class="instruction-box" style="margin-top:16px">Place furniture on clear floor tiles. Leave walking space beside it. Press <b>R</b> to rotate or <b>Esc</b> to put it down. Time pauses while furnishing.</div>`;}

export function bindFurnishPanel(app,root){
 const ui=app.ui;
 root.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{ui.category=b.dataset.category;app.renderStudio();});
 root.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>{ui.selected=b.dataset.item;app.mobile?.selection();app.renderStudio();app.updateUI(true);});
 if($('#rotate'))$('#rotate').onclick=()=>{ui.rotation=(ui.rotation+1)%4;app.toast(`Rotated ${ui.rotation*90}°`);};
}
