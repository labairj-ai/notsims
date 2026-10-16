import {CLIPS} from '../src/presentation/clips.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Human} from '../src/character3d.js';
import {WorldCamera,Renderer3D} from '../src/render3d.js';
import {houseObject,furnitureObject,interactionPose} from '../src/scene3d.js';
import {newGame,CATALOG,enqueue,tick,validateSave,interactionTargets,furniturePoint} from '../src/engine.js';

const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-5,message||`${a} != ${b}`);
let model;
async function asset(){
  if(!model){
    const bytes=await readFile(new URL('../assets/notsims-human.glb',import.meta.url));
    const loader=new GLTFLoader();
    // Decode the actual skeleton, geometry, skin weights and animation tracks.
    // Image decoding belongs to browser QA; geometry tests need no fake browser.
    loader.register(parser=>{parser.loadTexture=async()=>new THREE.Texture();return {name:'GeometryOnlyQA'};});
    model=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
  }
  return model;
}

test('camera ground picking stays aligned after rotation, zoom, pan and mobile resize',()=>{
  const camera=new WorldCamera();
  for(const [w,h] of [[900,720],[320,480]])for(const zoom of [.6,1.15,2.8])for(let a=0;a<4;a++){
    camera.zoom=zoom;camera.angle=Math.PI/4+a*Math.PI/2;camera.panX=47;camera.panY=-25;camera.layout(w,h);
    for(const [x,y] of [[0,0],[8,9],[18,18],[4.5,12.3]]){
      const pixel=camera.p(x,y),ground=camera.unproject(...pixel);near(ground[0],x);near(ground[1],y);
    }
  }
});
test('every catalog object generates finite 3D geometry in every rotation',()=>{
  for(const d of CATALOG)for(let rotation=0;rotation<4;rotation++){
    const group=furnitureObject({id:42,type:d.id,x:3,y:3,rotation});assert.ok(group.children.length);
    group.traverse(o=>{if(o.isMesh){assert.equal(o.userData.furnitureId,42);assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));}});
  }
});
test('raycast clicks identify furniture on the same plot used by the simulation',()=>{
  const s=newGame(),camera=new WorldCamera();camera.layout(900,720);camera.house=houseObject(s);camera.house.updateMatrixWorld(true);
  const fridge=s.furniture.find(f=>f.type==='fridge');
  const pixel=camera.p(fridge.x+.5,fridge.y+.5,1.5);
  const found=Renderer3D.prototype.pickFurniture.call(camera,s,...pixel);assert.equal(found?.id,fridge.id);
});
test('the exported free character contains a skinned mesh, shared skeleton, and the complete animation vocabulary',async()=>{
  const data=await asset();assert.deepEqual(data.animations.map(a=>a.name).sort(),Object.keys(CLIPS).sort());
  const meshes=[];data.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
  assert.ok(meshes.length>=7);assert.equal(meshes[0].skeleton.bones.length,53);
  for(const mesh of meshes){assert.ok(mesh.geometry.attributes.skinWeight);assert.ok([...mesh.geometry.attributes.position.array].every(Number.isFinite));}
});
test('walk and sit clips deform the skeleton, and pause holds the current pose',async()=>{
  const h=new Human(await asset());h.update(.4);
  const thigh=h.model.getObjectByName('thigh_l'),arm=h.model.getObjectByName('upperarm_l');assert.ok(thigh&&arm);
  const idle=thigh.quaternion.clone();h.play('Walk',true);h.update(.25);assert.ok(idle.angleTo(thigh.quaternion)>.15);
  h.play('Sit',true);h.update(.3);assert.ok(idle.angleTo(thigh.quaternion)>1);
  const paused=thigh.quaternion.toArray();h.update(0);assert.deepEqual(thigh.quaternion.toArray(),paused);h.dispose();
});
test('appearance edits change the actual model while keeping other instances independent',async()=>{
  const a=new Human(await asset()),b=new Human(await asset());
  const person=newGame().person;a.customize({...person,skin:'#a87850',hair:'#231b18',shirt:'#629482',style:'long'});
  assert.equal(a.materials.find(m=>m.name==='Notsims_Shirt').color.getHexString(),'629482');
  assert.notEqual(a.materials.find(m=>m.name==='Notsims_Shirt'),b.materials.find(m=>m.name==='Notsims_Shirt'));
  assert.equal(a.model.getObjectByName('Notsims_Hair_long').visible,true);
  assert.equal(a.model.getObjectByName('Notsims_Hair_short').visible,false);
  assert.equal(a.model.getObjectByName('Notsims_Hair_curly').visible,false);a.dispose();b.dispose();
});
test('furniture poses activate only after walking to an interaction point',()=>{
  const s=newGame(),sofa=s.furniture.find(f=>f.type==='sofa');
  s.activity={kind:'use',id:sofa.id,path:[[7,8]]};assert.equal(interactionPose(s),null);
  s.activity.path=[];assert.equal(interactionPose(s).animation,'Sit');
  const bed=s.furniture.find(f=>f.type==='bed');s.activity.id=bed.id;assert.equal(interactionPose(s).animation,'Sleep');
  const recovered=validateSave(JSON.stringify(s));assert.equal(recovered.activity,null);assert.deepEqual(recovered.furniture,s.furniture);
});
test('fractional frame times finish walks at their exact destination at every speed',()=>{
  for(const step of [1/60,3/60,8/60]){
    const s=newGame({},true);enqueue(s,{kind:'walk',x:2,y:2});
    for(let i=0;i<2000;i++)tick(s,step);
    assert.equal(s.person.x,2);assert.equal(s.person.y,2);assert.equal(s.activity,null);
  }
});
test('all four furniture orientations rotate the visual seat and its approach together',()=>{
 const expected=[[[8,9],[9,9]],[[9,9],[9,8]],[[9,7],[8,7]],[[7,8],[7,9]]];
 for(let rotation=0;rotation<4;rotation++){
  const f={id:4,type:'sofa',x:8,y:8,rotation};
  assert.deepEqual(interactionTargets(f),expected[rotation]);
  const point=furniturePoint(f,.7,.56),s=newGame();s.furniture=[f];s.activity={kind:'use',id:4,path:[]};
  const pose=interactionPose(s);near(pose.x,point[0]);near(pose.y,point[1]);near(pose.angle,rotation*Math.PI/2);
 }
});

test('layered controller masks gestures, bounds gaze and IK, freezes on pause, and resets without sharing bones',async()=>{
 const a=new Human(await asset()),b=new Human(await asset());
 const {resolveBodyIntent}=await import('../src/presentation/body-intent.js');
 const s=newGame(),id=s.furniture.find(f=>f.type==='stove')?.id;s.activity={kind:'use',id,path:[],elapsed:8,total:30};
 const base=resolveBodyIntent(s,'player');base.lookAt=[100,100,100];base.hands=[{hand:'right',target:[Infinity,0,0],weight:1}];const before=b.model.getObjectByName('head').quaternion.toArray();
 for(const speed of [1,3,8])for(let i=0;i<100;i++)a.controller.update(base,1/60,{speed});
 assert.ok(Math.abs(a.controller.yaw)<=.65);assert.ok(Math.abs(a.controller.pitch)<=.28);assert.deepEqual(b.model.getObjectByName('head').quaternion.toArray(),before);
 const pose=a.model.getObjectByName('head').quaternion.toArray();a.controller.update({...base,gesture:'Argue'},1,{paused:true});assert.deepEqual(a.model.getObjectByName('head').quaternion.toArray(),pose);
 const handTarget=new THREE.Vector3(),shoulder=new THREE.Vector3();a.model.updateWorldMatrix(true,true);a.controller.arms.right.hand.getWorldPosition(handTarget);a.controller.arms.right.upper.getWorldPosition(shoulder);handTarget.lerp(shoulder,.1);a.controller.update({...base,hands:[{hand:'right',target:handTarget.toArray(),weight:.7}]},1/60);assert.ok(a.controller.metrics.ik>0);assert.ok(a.controller.overlay);
 assert.ok(a.controller.overlayActions.Stir.getClip().tracks.every(t=>!/^thigh|^calf|^root/.test(t.name)));
 a.controller.update(base,1/60,{hidden:true});assert.equal(a.controller.overlay,null);assert.equal(a.controller.yaw,0);
 for(const entry of a.controller.bones)assert.ok(entry.bone.quaternion.toArray().every(Number.isFinite));a.dispose();b.dispose();
});
test('every authored clip has bounded duration, no root translation, finite tracks and smooth loop endpoints',async()=>{
 const data=await asset();for(const c of data.animations){const meta=CLIPS[c.name];assert.ok(Math.abs(c.duration-meta.duration)<.05,`${c.name}: ${c.duration}`);for(const t of c.tracks.filter(t=>t.name.endsWith('.position')))for(let i=3;i<t.values.length;i++)near(t.values[i],t.values[i%3],`${c.name} translates ${t.name}`);for(const t of c.tracks){assert.ok([...t.values].every(Number.isFinite));if(meta.loop&&t.name.endsWith('.quaternion')){const first=new THREE.Quaternion().fromArray(t.values),last=new THREE.Quaternion().fromArray(t.values,t.values.length-4);assert.ok(first.angleTo(last)<.01,`${c.name} ${t.name}`);}}}
});
test('two-bone contact never stretches, falls back on missing chains, and reduces reachable hand error',async()=>{
 const {ArmContact}=await import('../src/presentation/animation-controller.js');const h=new Human(await asset());h.update(.2);h.model.updateWorldMatrix(true,true);const solver=h.controller.arms.right,hand=new THREE.Vector3();solver.hand.getWorldPosition(hand);const target=hand.clone().add(new THREE.Vector3(0,.04,.04)),before=hand.distanceTo(target),length=solver.upper.position.distanceTo(solver.lower.position);assert.equal(solver.solve(target.toArray(),1),true);solver.hand.getWorldPosition(hand);assert.ok(hand.distanceTo(target)<before);assert.equal(solver.upper.position.distanceTo(solver.lower.position),length);assert.equal(solver.solve([1000,1000,1000],1),false);assert.equal(new ArmContact(new THREE.Group(),'r').solve([0,0,0],1),false);h.dispose();
});
test('all gestures can be interrupted and missing optional clips use a safe base',async()=>{
 const {resolveBodyIntent}=await import('../src/presentation/body-intent.js');const h=new Human(await asset()),s=newGame(),intent=resolveBodyIntent(s,'player');for(const gesture of Object.keys(CLIPS)){for(let i=0;i<8;i++)h.controller.update({...intent,key:gesture,gesture},1/60);h.controller.update({...intent,key:'idle'},1/60);assert.equal(h.controller.overlay,null);for(const {bone} of h.controller.bones)assert.ok(bone.quaternion.toArray().every(Number.isFinite));}h.controller.update({...intent,gesture:'MissingClip'},1/60);assert.equal(h.current,'Idle');assert.equal(h.controller.overlay,null);h.dispose();
});
