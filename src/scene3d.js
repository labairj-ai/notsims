import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Renderer as CanvasRecipes } from './render.js';
import { SIZE, dimensions, itemDef, key, furniturePoint } from './engine.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitSphere = new THREE.SphereGeometry(1, 12, 8);
const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
const materials = new Map();
export function material(color, options={}) {
  const id = color + JSON.stringify(options);
  if (!materials.has(id)) {
    const alpha = /^#[\da-f]{8}$/i.test(color) ? parseInt(color.slice(7),16)/255 : 1;
    materials.set(id,new THREE.MeshStandardMaterial({color:color.slice(0,7),roughness:.82,
      transparent:alpha<1,opacity:alpha,depthWrite:alpha>.8,...options}));
  }
  return materials.get(id);
}

// Reuse the existing furniture proportions in world coordinates. All generated
// geometry is original; the same catalog remains compatible with v1 save files.
export class GeometryPainter extends CanvasRecipes {
  constructor(group=new THREE.Group()) {
    super({getContext:()=>({globalAlpha:1})});
    this.group=group;
  }
  p(x,y,z=0) {return [x,z*1.4,y];}
  add(geometry,position,scale,color,options={}) {
    const mesh=new THREE.Mesh(geometry,material(color,options));
    mesh.position.set(...position);mesh.scale.set(...scale);
    mesh.castShadow=true;mesh.receiveShadow=true;this.group.add(mesh);return mesh;
  }
  box(x,y,w,h,z,color,base=0) {
    return this.add(unitBox,[x+w/2,base*1.4+z*.7,y+h/2],[w,Math.max(.004,z*1.4),h],color);
  }
  ellipse(x,y,z,rx,ry,color) {
    return this.add(unitSphere,[x,z*1.4,y],[rx,Math.max(.016,ry*.75),rx*.75],color);
  }
  line(a,b,color,width=1) {
    const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);
    const mesh=this.add(unitCylinder,from.clone().add(to).multiplyScalar(.5).toArray(),[width*.008,delta.length(),width*.008],color);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh;
  }
  tile(x,y,color) {this.box(x,y,1,1,.025,color,-.025);}
}

export function batch(group, data={}) {
  const buckets=new Map();group.updateMatrixWorld(true);
  for(const child of [...group.children]) {
    if(!child.isMesh)continue;
    const id=child.material.uuid;
    if(!buckets.has(id))buckets.set(id,{material:child.material,geometry:[]});
    buckets.get(id).geometry.push(child.geometry.clone().applyMatrix4(child.matrix));
    group.remove(child);
  }
  for(const bucket of buckets.values()) {
    const geometry=mergeGeometries(bucket.geometry,false);
    bucket.geometry.forEach(g=>g.dispose());
    const mesh=new THREE.Mesh(geometry,bucket.material);mesh.castShadow=true;mesh.receiveShadow=true;
    mesh.userData={...data};group.add(mesh);
  }
  return group;
}

export function furnitureObject(f) {
  const painter=new GeometryPainter(),d=itemDef(f.type),[w,h]=dimensions(f);
  painter.furniture({...f,x:0,y:0,rotation:0});
  for(const mesh of painter.group.children){mesh.position.x-=d.w/2;mesh.position.z-=d.h/2;}
  const group=batch(painter.group,{furnitureId:f.id});
  group.position.set(f.x+w/2,0,f.y+h/2);group.rotation.y=f.rotation*Math.PI/2;
  return group;
}
export function houseObject(s,fullWalls=false,angle=Math.PI/4) {
  const root=new THREE.Group(),floors=new GeometryPainter(),walls=new GeometryPainter();
  for(const [xy,type] of Object.entries(s.floors)) {
    const [x,y]=xy.split(',').map(Number);
    if(type==='wood')for(let i=0;i<4;i++)floors.box(x+.007,y+i*.25+.007,.986,.236,.06,(x+y+i)%2?'#d3b394':'#d9be9e',-.06);
    else for(let a=0;a<2;a++)for(let b=0;b<2;b++)floors.box(x+a*.5+.006,y+b*.5+.006,.488,.488,.06,
      type==='sage'?((x+y+a+b)%2?'#b9c7aa':'#c5d0b3'):((x+y+a+b)%2?'#dad9c7':'#e9e4d2'),-.06);
  }
  for(const [edge,type] of Object.entries(s.walls)) {
    // Walls facing the camera lower automatically, including after rotation.
    const [axis,xy]=edge.split(':'),[x,y]=xy.split(',').map(Number);
    const before=axis==='h'?s.floors[key(x,y-1)]:s.floors[key(x-1,y)];
    const after=s.floors[key(x,y)];
    const positive=axis==='h'?Math.sin(angle)>0:Math.cos(angle)>0;
    const front=before&&after||(positive?before&&!after:after&&!before);
    const height=fullWalls?1.6:front?.22:1.6;
    const w=axis==='h'?1:.10,h=axis==='v'?1:.10;
    if(type==='door') {
      if(axis==='h'){walls.box(x,y,.1,.1,height,'#ae9576');walls.box(x+.9,y,.1,.1,height,'#ae9576');}
      else{walls.box(x,y,.1,.1,height,'#ae9576');walls.box(x,y+.9,.1,.1,height,'#ae9576');}
      if(height>.4)walls.box(x,y,w,h,.1,'#ae9576',height-.1);
      floors.box(x,y,w,h,.015,'#b69b77');
    }else {
      walls.box(x,y,w,h,height,'#eee7d4');walls.box(x,y,w,h,.045,'#d5c7ac',height);
      if(height>1&&((axis==='h'&&x%4===2)||(axis==='v'&&y%4===1))) {
        if(axis==='h')walls.box(x+.16,y+.102,.65,.012,.65,'#a7c5be',.6);
        else walls.box(x+.102,y+.16,.012,.65,.65,'#a7c5be',.6);
      }
    }
  }
  root.add(batch(floors.group),batch(walls.group));
  for(const f of s.furniture)root.add(furnitureObject(f));
  return root;
}

export function gardenObject() {
  const p=new GeometryPainter();
  p.box(-32,-32,82,82,.05,'#d7e0c4',-.14);
  p.box(0,0,SIZE,SIZE,.06,'#b4c393',-.08);
  for(let x=0;x<SIZE;x++)for(let y=0;y<SIZE;y++)p.box(x,y,1,1,.014,(x+y)%2?'#c4d0a6':'#cbd6af',-.015);
  p.box(-32,19,82,3,.025,'#d5d0b8',-.04);
  for(let y=12;y<19;y++)p.box(8.12,y+.12,.75,.75,.025,'#ddd7bd');
  for(const [x,y,size] of [[-2,0,1.1],[-2,11,.85],[16,-2,1.1],[3,-3,.9],[20,10,1.1]])p.tree(x,y,size);
  for(const [x,y] of [[0,0],[18,0],[0,18],[18,18]])p.box(x-.06,y-.06,.12,.12,.35,'#e1dfc7');
  for(let x=1;x<5;x++){
    p.box(x,16,.5,.5,.13,'#9c9670');
    for(let i=0;i<3;i++){p.ellipse(x+.15+i*.12,16.25,.25,.15,.1,'#96a777');p.ellipse(x+.15+i*.12,16.25,.38,.07,.06,i%2?'#dfb994':'#eee1ae');}
  }
  return batch(p.group);
}

export function disposeGroup(group) {
  group.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.userData.previewMaterial)o.material.dispose();}});group.removeFromParent();
}

// An explicit interaction point is selected by the simulation. Occupied furniture
// cells remain blocked for navigation; only the rendered pose enters the seat.
export function interactionPose(s) {
  const a=s.activity;
  if(a?.kind!=='use'||a.path?.length)return null;
  const f=s.furniture.find(f=>f.id===a.id);if(!f)return null;
  const [w,h]=dimensions(f),d=itemDef(f.type),angle=f.rotation*Math.PI/2;
  const pose=(lx,ly,height,animation)=>{const [x,y]=furniturePoint(f,lx,ly);return {x,y,height,angle,animation};};
  if(f.type==='sofa')return pose(.7,.56,.61,'Sit');
  if(f.type==='toilet')return pose(.5,.59,.49,'Sit');
  if(f.type==='bed')return pose(1,1.87,.88,'Sleep');
  const facing=Math.atan2(f.x+w/2-s.person.x-.5,f.y+h/2-s.person.y-.5);
  return {x:s.person.x+.5,y:s.person.y+.5,height:0,angle:facing,animation:d.need==='hunger'?'Eat':'Idle'};
}
