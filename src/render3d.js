import * as THREE from 'three';
import {SIZE,inside,dimensions,canPlace} from './engine.js';
import {GeometryPainter,houseObject,gardenObject,furnitureObject,disposeGroup,interactionPose,material,batch} from './scene3d.js';
import {loadHuman,Human} from './character3d.js';

export class WorldCamera {
  constructor(){this.camera=new THREE.OrthographicCamera(-16,16,16,-16,.1,250);this.zoom=1.15;this.panX=0;this.panY=0;this.angle=Math.PI/4;this.w=1;this.h=1;this.t=1;this.raycaster=new THREE.Raycaster();this.ground=new THREE.Plane(new THREE.Vector3(0,1,0),0);}
  layout(w,h) {
    this.w=Math.max(1,w);this.h=Math.max(1,h);const aspect=this.w/this.h,viewWidth=32/this.zoom,viewHeight=viewWidth/aspect;
    const c=this.camera;c.left=-viewWidth/2;c.right=viewWidth/2;c.top=viewHeight/2;c.bottom=-viewHeight/2;
    c.position.set(8.5+Math.cos(this.angle)*35,33,8.5+Math.sin(this.angle)*35);c.lookAt(8.5,0,8.5);c.updateMatrixWorld();
    const right=new THREE.Vector3().setFromMatrixColumn(c.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(c.matrixWorld,1);
    c.position.addScaledVector(right,-this.panX*viewWidth/this.w).addScaledVector(up,this.panY*viewHeight/this.h);
    c.updateProjectionMatrix();c.updateMatrixWorld();this.t=this.w/viewWidth*.707;
  }
  p(x,y,z=0) {const v=new THREE.Vector3(x,z*1.4,y).project(this.camera);return [(v.x+1)*this.w/2,(1-v.y)*this.h/2];}
  ray(px,py) {this.raycaster.setFromCamera(new THREE.Vector2(px/this.w*2-1,1-py/this.h*2),this.camera);return this.raycaster;}
  unproject(px,py) {const p=new THREE.Vector3();return this.ray(px,py).ray.intersectPlane(this.ground,p)?[p.x,p.z]:[-1,-1];}
  rotate(direction) {this.angle+=direction*Math.PI/2;}
}

export class Renderer3D extends WorldCamera {
  constructor(canvas) {
    super();this.canvas=canvas;this.fullWalls=false;this.signature='';this.lastTime=null;this.lastMinute=null;
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.05;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#dbe3cb');this.scene.fog=new THREE.Fog('#dbe3cb',55,110);
    this.ambient=new THREE.HemisphereLight('#fff5de','#889574',2);this.scene.add(this.ambient);
    this.sun=new THREE.DirectionalLight('#fff0d0',3.4);this.sun.position.set(-8,24,13);this.sun.castShadow=true;
    this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:70});
    this.sun.shadow.normalBias=.035;this.sun.shadow.bias=-.00015;this.sun.target.position.set(9,0,9);this.scene.add(this.sun,this.sun.target);
    this.scene.add(gardenObject());this.highlight=new THREE.Group();this.scene.add(this.highlight);
    this.pathMarkers=new THREE.Group();this.scene.add(this.pathMarkers);this.markerSignature='';
    this.pin=new THREE.Mesh(new THREE.OctahedronGeometry(.10),new THREE.MeshStandardMaterial({color:'#e5c67a',emissive:'#b69b55',emissiveIntensity:.15,metalness:.25,roughness:.5}));this.scene.add(this.pin);
    this.visitors=new Map();this.ready=loadHuman().then(asset=>{this.humanAsset=asset;this.human=new Human(asset);this.scene.add(this.human.root);return this.human;});
    this.resize();
  }
  resize() {
    const r=this.canvas.getBoundingClientRect();
    if(r.width!==this.w||r.height!==this.h)this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
    this.layout(r.width,r.height);
  }
  pickFurniture(s,px,py) {
    if(!this.house)return null;
    const hits=this.ray(px,py).intersectObject(this.house,true);
    const hit=hits.find(h=>h.object.userData.furnitureId!==undefined);
    return hit?s.furniture.find(f=>f.id===hit.object.userData.furnitureId):null;
  }
  updateHouse(s) {
    const signature=JSON.stringify([s.floors,s.walls,s.furniture,this.fullWalls,Math.sign(Math.cos(this.angle)),Math.sign(Math.sin(this.angle))]);
    if(signature===this.signature)return;this.signature=signature;
    if(this.house)disposeGroup(this.house);
    this.house=houseObject(s,this.fullWalls,this.angle);this.scene.add(this.house);
  }
  updatePreview(s,ui) {
    const signature=JSON.stringify([ui.hover,ui.tab,ui.tool,ui.selected,ui.rotation,ui.roomStart,ui.edge,ui.selectedObjectId,ui.selectedPersonId,s.social?.presences,ui.roomPreview,this.signature]);
    if(signature===this.previewSignature)return;this.previewSignature=signature;
    for(const child of [...this.highlight.children])disposeGroup(child);
    const p=new GeometryPainter();
    const tile=(a,b,color)=>p.box(a+.025,b+.025,.95,.95,.012,color,.012);
    if(ui.selectedObjectId){const f=s.furniture.find(f=>f.id===ui.selectedObjectId);if(f){const [w,h]=dimensions(f);for(let a=f.x;a<f.x+w;a++)for(let b=f.y;b<f.y+h;b++)tile(a,b,'#f8df8b88');}}
    if(ui.selectedPersonId){const visitor=s.social.presences.find(v=>v.personId===ui.selectedPersonId);if(visitor)tile(visitor.x,visitor.y,'#f8df8b88');}
    if(!ui.hover){this.highlight.add(batch(p.group));return;}const [x,y]=ui.hover;
    if(ui.tab==='build'&&ui.tool==='room'&&ui.roomStart){const [sx,sy]=ui.roomStart;for(let a=Math.min(x,sx);a<=Math.max(x,sx);a++)for(let b=Math.min(y,sy);b<=Math.max(y,sy);b++)tile(a,b,ui.roomPreview?.valid?'#aac48999':'#ce806d99');}
    else if(ui.tab==='shop'&&ui.selected){
      const valid=canPlace(s,ui.selected,x,y,ui.rotation),[w,h]=dimensions({type:ui.selected,rotation:ui.rotation});
      for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)tile(a,b,valid?'#afc17d99':'#ce806d99');
      const f=furnitureObject({type:ui.selected,x,y,rotation:ui.rotation});
      f.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.55;o.castShadow=false;o.userData.previewMaterial=true;}});
      this.highlight.add(f);
    }else if(ui.tab==='build'){
      tile(x,y,'#f4e6aa99');if(['wall','door','erase'].includes(ui.tool)&&ui.edge){const [axis,xy]=ui.edge.split(':'),[ex,ey]=xy.split(',').map(Number);p.box(ex,ey,axis==='h'?1:.055,axis==='v'?1:.055,.035,'#fff0bc',.03);}
    }
    this.highlight.add(batch(p.group));
  }
  updatePath(s) {
    const path=s.activity?.path||[],signature=JSON.stringify(path);if(signature===this.markerSignature)return;this.markerSignature=signature;
    for(const o of [...this.pathMarkers.children])disposeGroup(o);
    const p=new GeometryPainter();for(const [x,y] of path)p.ellipse(x+.5,y+.5,.035,.055,.018,'#fff8d6');this.pathMarkers.add(batch(p.group));
  }
  updateHuman(s,time) {
    const a=s.activity,working=a?.kind==='work';this.pin.visible=!working;
    if(!this.human)return;
    const human=this.human;human.customize(s.person);human.root.visible=!working;
    let x=s.person.x+.5,y=s.person.y+.5,height=0,angle=human.root.rotation.y,animation='Idle';
    if(a?.path?.length){const [tx,ty]=a.path[0],t=Math.min(1,(a.walkClock||0)/2);x+=(tx-s.person.x)*t;y+=(ty-s.person.y)*t;angle=Math.atan2(tx-s.person.x,ty-s.person.y);animation='Walk';}
    const pose=interactionPose(s);if(pose){({x,y,height,angle,animation}=pose);if(animation==='Sit')height-=.874;}
    if(a?.kind==='snack')animation='Eat';if(a?.kind==='nap'){animation='Sleep';height=.05;}
    human.root.position.set(x,height,y);human.root.rotation.set(0,angle,0);
    human.model.rotation.x=animation==='Sleep'?-Math.PI/2:0;
    human.play(animation);
    // Animation and navigation use the same game clock, including pause and speed.
    const gameDelta=this.lastMinute===null?0:Math.max(0,Math.min(2,s.minutes-this.lastMinute));
    human.update(gameDelta);
    this.pin.position.set(x,animation==='Sleep'?.6:animation==='Sit'?1.7:2.05,y);
    if(gameDelta>0)this.pin.rotation.y+=gameDelta*.5;
  }
  updateVisitors(s){
    if(!this.humanAsset)return;
    const ids=new Set(s.social.presences.map(p=>p.personId));
    for(const [id,h] of this.visitors)if(!ids.has(id)){this.scene.remove(h.root);h.dispose();this.visitors.delete(id);}
    for(const p of s.social.presences){let h=this.visitors.get(p.personId);if(!h){h=new Human(this.humanAsset);this.visitors.set(p.personId,h);this.scene.add(h.root);}h.customize(s.people[p.personId]);let x=p.x+.5,y=p.y+.5;if(p.path.length){const [tx,ty]=p.path[0],t=Math.min(1,p.moveClock/2);x+=(tx-p.x)*t;y+=(ty-p.y)*t;h.root.rotation.y=Math.atan2(tx-p.x,ty-p.y);}h.root.position.set(x,0,y);h.play(p.path.length?'Walk':'Idle');h.update(this.lastMinute===null?0:Math.max(0,Math.min(2,s.minutes-this.lastMinute)));}
  }
  draw(s,ui,time) {
    this.resize();this.updateHouse(s);this.updatePreview(s,ui);this.updatePath(s);this.updateHuman(s,time);this.updateVisitors(s);
    const hour=(s.minutes%1440)/60,night=hour<6||hour>=20;
    this.ambient.intensity=night?.8:2;this.sun.intensity=night?.5:3.4;this.sun.color.set(night?'#b0c6ed':'#fff0d0');
    this.renderer.render(this.scene,this.camera);this.lastMinute=s.minutes;this.lastTime=time;
  }
}
