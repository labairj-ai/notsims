import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {checkAppearance,readGLB,decodePNG,neutralMetrics,validateAppearance} from '../scripts/character-appearance.mjs';
import {newGame} from '../src/game/session.js';
import {dispatch} from '../src/game/dispatch.js';
import {serializeSave,validateSave} from '../src/persistence/save.js';
import {drawCharacter,portraitSVG} from '../src/render.js';
test('0109/0111/0112: actual embedded hair textures are neutral, detailed, alpha-preserving and within budget',async()=>{
 const report=await checkAppearance();assert.ok(report.bytes<12000000);
 for(const style of ['short','long','curly']){const r=report.hair[style];assert.equal(r.maxChroma,0);assert.ok(r.p05>=.59);assert.ok(r.p95-r.p05>.005);assert.ok(r.visiblePixels>1000);}
});
test('0112: the shipped pre-fix brown texture fails the authored-asset contract even with a correct runtime color',async()=>{
 const old=await readFile(new URL('./fixtures/hair-short-before-neutral.png',import.meta.url)),metrics=neutralMetrics({...decodePNG(old),encoded:old});assert.ok(metrics.maxChroma>1||metrics.p05<.59);
 // Install the actual old PNG in the current GLB; white material/runtime tint
 // alone must not make it pass. This guards the original visual defect.
 const bytes=await readFile(new URL('../assets/notsims-human.glb',import.meta.url)),{gltf,bin}=readGLB(bytes),m=gltf.materials.find(m=>m.name==='Notsims_Hair_short');
 const image=gltf.images[gltf.textures[m.pbrMetallicRoughness.baseColorTexture.index].source];gltf.bufferViews[image.bufferView]={buffer:0,byteOffset:bin.length,byteLength:old.length};
 const newBin=Buffer.concat([bin,old,Buffer.alloc((4-old.length%4)%4)]);gltf.buffers[0].byteLength=newBin.length;
 let json=Buffer.from(JSON.stringify(gltf));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+newBin.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(newBin.length);bh.writeUInt32LE(0x004e4942,4);
 const bad=Buffer.concat([header,json,bh,newBin]),meta=JSON.parse(await readFile(new URL('../assets/character-metadata.json',import.meta.url)));
 assert.throws(()=>validateAppearance(bad,meta),/light neutral detail/);
});
test('0114: appearance commands and save/export/import persist only semantic colors/styles and leave NPCs unchanged',()=>{
 let s=newGame();const npcs=structuredClone(s.people);
 for(const style of ['short','long','curly'])for(const hair of ['#16120f','#4a2c1b','#8a3324','#cc4b32','#d9b27c','#eee3cf']){
  assert.equal(dispatch(s,{type:'CHANGE_APPEARANCE',appearance:{name:s.person.name,skin:s.person.skin,shirt:s.person.shirt,trait:s.person.trait,style,hair}}).ok,true);
  const save=serializeSave(s);s=validateSave(save);assert.equal(s.person.hair,hair);assert.equal(s.person.style,style);assert.deepEqual(s.people,npcs);
  assert.ok(!/"(material|texture|skeleton|appearanceMaterials)"/.test(save));
 }
});
test('0114: Classic creator/portrait use the exact semantic hair color for every style',()=>{
 for(const style of ['short','long','curly'])for(const hair of ['#16120f','#4a2c1b','#8a3324','#cc4b32','#d9b27c','#eee3cf']){
  const fills=[],ctx=new Proxy({}, {get:(_t,k)=>k==='measureText'?()=>({width:10}):()=>{},set:(o,k,v)=>{if(k==='fillStyle')fills.push(v);o[k]=v;return true;}}),canvas={width:340,height:360,getContext:()=>ctx,getBoundingClientRect:()=>({width:340,height:360})};
  const person={...newGame().person,style,hair};drawCharacter(canvas,person);assert.ok(fills.includes(hair));assert.ok(portraitSVG(person).includes(`fill="${hair}"`));
 }
});
