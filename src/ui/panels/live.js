import {$} from '../dom.js';
export function livePanel({ui,state}){return `<span class="eyebrow">HOME, SWEET POSSIBILITY</span><h2>The good little life.</h2><p class="intro">There’s no right way to live.<br>Just a thousand little things to try.</p><div class="welcome-card"><span class="big-star">✳</span><h3>A place to call<br>your own.</h3><p>A cozy corner. A new routine.<br>Something lovely is taking shape.</p><button data-jump="build">Make it feel like you <span>↗</span></button></div><div class="mini-heading">Little happenings <span>YOUR STORY SO FAR</span></div><div id="story-list" class="story-list"></div><div class="tip-card"><b>A FRIENDLY LITTLE TIP</b>Furniture is more than decoration. A good night’s sleep starts with a bed, and a great day starts with breakfast.<br><button id="show-guide" class="text-button">Open the field guide ↗</button></div><div class="quick-actions mobile-actions"><button data-action="chat">♡ <span>Call a friend</span><b>↗</b></button><button data-action="snack">◒ <span>Free snack</span><b>↗</b></button><button data-action="nap">☾ <span>Nap outdoors</span><b>↗</b></button></div>`;}

export function bindLivePanel(app,root){
 const ui=app.ui;
 root.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>app.selectTab(b.dataset.jump));
 if($('#show-guide'))$('#show-guide').onclick=()=>$('#help-dialog').showModal();
 root.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>app.queueAction(b.dataset.action));
}
