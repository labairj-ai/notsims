import {$} from './dom.js';
import {Renderer} from '../render.js';
export async function bootstrapRenderer(app){
 const ui=app.ui;
const classicRequested=new URLSearchParams(location.search).get('view')==='classic';
if(!classicRequested){
 let candidate;
 try{
  const {Renderer3D}=await import('../render3d.js');
  candidate=new Renderer3D($('#world'));candidate.draw(app.state,ui,performance.now()/1000);
  await candidate.ready;app.renderer=candidate;app.is3D=true;
 }catch(error){
  console.warn('Using the classic view because the 3D view is unavailable.',error);
  candidate?.renderer.dispose();const canvas=$('#world'),fresh=canvas.cloneNode(false);canvas.replaceWith(fresh);
 }
}
if(!app.renderer)app.renderer=new Renderer($('#world'));
if(app.is3D){
 try{
  const {CharacterPreview}=await import('../character3d.js');
  app.characterPreview=new CharacterPreview($('#character-preview'));await app.characterPreview.ready;
 }catch(error){
  console.warn('Using a portrait preview.',error);app.characterPreview=null;
  const canvas=$('#character-preview');canvas.replaceWith(canvas.cloneNode(false));
 }
}
$('#scene-loading').hidden=true;$('#scene-badge').textContent=app.is3D?'3D WORLD':'CLASSIC VIEW';
$('#camera-left').disabled=$('#camera-right').disabled=!app.is3D;
$('#walls').onclick=()=>{app.renderer.fullWalls=!app.renderer.fullWalls;app.toast(app.renderer.fullWalls?'Full walls. Toggle again for the open dollhouse view.':'Dollhouse view. Front walls are lowered.');};
$('#zoom-in').onclick=()=>app.renderer.zoom=Math.min(2.8,app.renderer.zoom+.15);$('#zoom-out').onclick=()=>app.renderer.zoom=Math.max(.6,app.renderer.zoom-.15);$('#recenter').onclick=()=>{app.renderer.panX=app.renderer.panY=0;app.renderer.zoom=1.15;};
$('#camera-left').onclick=()=>{app.renderer.rotate?.(-1);$('#object-popup').hidden=true;};
$('#camera-right').onclick=()=>{app.renderer.rotate?.(1);$('#object-popup').hidden=true;};
$('#view-mode').innerHTML=app.is3D?'▧ Switch to classic view <span>→</span>':'▧ Try the 3D view <span>→</span>';
$('#view-mode').onclick=()=>{app.save(true);const url=new URL(location.href);if(app.is3D)url.searchParams.set('view','classic');else url.searchParams.delete('view');location.href=url.href;};

}
