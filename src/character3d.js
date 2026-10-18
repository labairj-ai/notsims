import {CLIPS} from './presentation/clips.js';
import {CharacterAnimationController} from './presentation/animation-controller.js';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';

let assetPromise;
export function loadHuman() {
  if(!assetPromise)assetPromise=new GLTFLoader().loadAsync(new URL('../assets/notsims-human.glb',import.meta.url).href);
  return assetPromise;
}

export class Human {
  constructor(asset) {
    this.root=new THREE.Group();this.model=clone(asset.scene);this.root.add(this.model);
    const clonedMaterials=new Map();
    this.appearanceMaterials={skin:[],shirt:[],hair:[]};
    this.hairMeshes=[];
    this.model.traverse(o=>{
      if(o.name.startsWith('Notsims_Hair_')&&!o.isBone)this.hairMeshes.push(o);
      if(!o.isMesh)return;
      const cloneMaterial=m=>{
        if(!clonedMaterials.has(m.uuid)){
          const copy=m.clone();
          if(m.name.startsWith('Notsims_Hair_')){copy.alphaTest=.4;copy.transparent=false;copy.depthWrite=true;copy.side=THREE.DoubleSide;}
          clonedMaterials.set(m.uuid,copy);
          const role=m.name==='Notsims_Skin'?'skin':m.name==='Notsims_Shirt'?'shirt':m.name.startsWith('Notsims_Hair_')?'hair':null;
          if(role)this.appearanceMaterials[role].push(copy);
        }
        return clonedMaterials.get(m.uuid);
      };
      o.material=Array.isArray(o.material)?o.material.map(cloneMaterial):cloneMaterial(o.material);
      o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
    });
    this.materials=[...clonedMaterials.values()];
    this.mixer=new THREE.AnimationMixer(this.model);
    this.actions=Object.fromEntries(asset.animations.map(c=>{const action=this.mixer.clipAction(c);if(CLIPS[c.name]?.loop===false){action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;}return [c.name,action];}));
    this.current=null;this.appearance='';this.play('Idle',true);this.controller=new CharacterAnimationController(this,asset.animations);
  }
  play(name,immediate=false) {
    if(this.current===name)return;
    const next=this.actions[name]||this.actions.Idle;
    if(!next)return;
    const previous=this.actions[this.current];next.reset().play();
    if(previous&&!immediate)next.crossFadeFrom(previous,.22,true);
    else if(previous)previous.stop();
    this.current=name;
  }
  customize(person) {
    const signature=[person.skin,person.hair,person.shirt,person.style].join(':');
    if(this.appearance===signature)return;this.appearance=signature;
    for(const role of ['skin','shirt','hair'])for(const material of this.appearanceMaterials[role])material.color.set(person[role]);
    for(const mesh of this.hairMeshes)mesh.visible=mesh.name.startsWith(`Notsims_Hair_${person.style}`);
  }
  update(dt) {this.mixer.update(Math.max(0,dt));}
  dispose() {this.controller.dispose();this.mixer.stopAllAction();this.mixer.uncacheRoot(this.model);this.materials.forEach(m=>m.dispose());}
}

export class CharacterPreview {
  constructor(canvas) {
    this.canvas=canvas;this.person=null;
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    this.renderer.setSize(340,360,false);this.renderer.setClearColor(0,0);
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(33,340/360,.1,20);
    this.camera.position.set(1.7,1.15,3.2);this.camera.lookAt(0,.88,0);
    this.scene.add(new THREE.HemisphereLight('#fff8e5','#87976f',2));
    const light=new THREE.DirectionalLight('#fff1da',3);light.position.set(-2,4,4);this.scene.add(light);
    this.ready=loadHuman().then(asset=>{this.human=new Human(asset);this.scene.add(this.human.root);if(this.person)this.human.customize(this.person);this.draw();});
  }
  customize(person) {this.person=person;if(this.human)this.human.customize(person);this.draw();}
  draw(dt=0) {if(this.human)this.human.update(dt);this.renderer.render(this.scene,this.camera);}
}
