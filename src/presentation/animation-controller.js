import * as THREE from 'three';
import {CLIPS,presentationRate} from './clips.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const UPPER=/^(spine|neck|head|clavicle|upperarm|lowerarm|hand|finger|thumb|index|middle|ring|pinky)/i;
// Bounded CCD over the two arm joints; bone lengths/positions are never edited.
export class ArmContact {
 constructor(model,side){this.upper=model.getObjectByName(`upperarm_${side}`);this.lower=model.getObjectByName(`lowerarm_${side}`);this.hand=model.getObjectByName(`hand_${side}`);this.a=new THREE.Vector3();this.b=new THREE.Vector3();this.c=new THREE.Vector3();this.target=new THREE.Vector3();this.from=new THREE.Vector3();this.to=new THREE.Vector3();this.q=new THREE.Quaternion();this.parentQ=new THREE.Quaternion();this.inverseParentQ=new THREE.Quaternion();this.identity=new THREE.Quaternion();this.solves=0;this.joints=[this.lower,this.upper];}
 solve(target,weight){if(!this.upper||!this.lower||!this.hand||!target?.every(Number.isFinite)||!Number.isFinite(weight)||weight<=0)return false;
  this.target.fromArray(target);this.upper.getWorldPosition(this.a);this.lower.getWorldPosition(this.b);this.hand.getWorldPosition(this.c);const length=this.a.distanceTo(this.b)+this.b.distanceTo(this.c),distance=this.a.distanceTo(this.target);
  if(distance>length*1.02||distance<.04)return false;
  for(let i=0;i<3;i++)for(const joint of this.joints){joint.getWorldPosition(this.a);this.hand.getWorldPosition(this.c);this.from.subVectors(this.c,this.a).normalize();this.to.subVectors(this.target,this.a).normalize();if(!this.from.lengthSq()||!this.to.lengthSq())continue;
   this.q.setFromUnitVectors(this.from,this.to);const angle=2*Math.acos(clamp(this.q.w,-1,1));this.q.slerp(this.identity,1-Math.min(1,.28/Math.max(.001,angle))*clamp(weight,0,1));joint.parent.getWorldQuaternion(this.parentQ);this.inverseParentQ.copy(this.parentQ).invert();this.q.premultiply(this.inverseParentQ).multiply(this.parentQ);joint.quaternion.premultiply(this.q).normalize();joint.updateWorldMatrix(false,true);
  }this.solves++;return true;
 }
}
export class CharacterAnimationController {
 constructor(human,clips){this.human=human;this.model=human.model;this.mixer=human.mixer;this.bones=[];this.model.traverse(b=>{if(b.isBone)this.bones.push({bone:b,base:b.quaternion.clone()});});this.overlayActions={};
  const reference=clips.find(c=>c.name==='Idle');for(const clip of clips){if(CLIPS[clip.name]?.mask!=='upper')continue;const overlay=clip.clone();overlay.name=`overlay:${clip.name}`;overlay.tracks=overlay.tracks.filter(t=>UPPER.test(t.name.split('.')[0]));if(!overlay.tracks.length)continue;if(reference)THREE.AnimationUtils.makeClipAdditive(overlay,0,reference,24);const action=this.mixer.clipAction(overlay);action.blendMode=THREE.AdditiveAnimationBlendMode;action.setLoop(CLIPS[clip.name].loop?THREE.LoopRepeat:THREE.LoopOnce,CLIPS[clip.name].loop?Infinity:1);action.clampWhenFinished=true;this.overlayActions[clip.name]=action;}
  this.head=this.model.getObjectByName('head');this.neck=this.model.getObjectByName('neck_01');this.spine=this.model.getObjectByName('spine_03');this.arms={left:new ArmContact(this.model,'l'),right:new ArmContact(this.model,'r')};this.yaw=0;this.pitch=0;this.affect={energy:.7,valence:0,tension:0};this.neutralArms={};for(const side of ['l','r']){const b=this.model.getObjectByName(`upperarm_${side}`);if(b)this.neutralArms[side]=b.quaternion.clone();}this.key=null;this.overlay=null;this.overlayKey=null;this.target=new THREE.Vector3();this.euler=new THREE.Euler();this.offset=new THREE.Quaternion();this.metrics={updates:0,ik:0};
 }
 restore(){for(const {bone,base} of this.bones)bone.quaternion.copy(base);}
 reset(){this.restore();for(const action of Object.values(this.overlayActions))action.stop();this.overlay=null;this.overlayKey=null;this.key=null;this.yaw=this.pitch=0;this.human.play('Idle',true);this.mixer.update(0);for(const b of this.bones)b.base.copy(b.bone.quaternion);}
 rotate(bone,x,y,z){if(!bone)return;this.euler.set(x,y,z);this.offset.setFromEuler(this.euler);bone.quaternion.multiply(this.offset).normalize();}
 update(intent,dt,{speed=1,paused=false,hidden=false}={}){
  if(hidden){this.reset();return;}if(paused||!Number.isFinite(dt)||dt<=0)return;
  this.restore();const delta=Math.min(.1,Math.max(0,dt)),rate=presentationRate(speed);if(this.key!==intent.key){for(const a of Object.values(this.overlayActions))a.stop();this.overlay=null;this.overlayKey=null;this.yaw*=.5;this.pitch*=.5;this.key=intent.key;}
  this.human.play(intent.base);const baseAction=this.human.actions[intent.base]??this.human.actions.Idle;if(baseAction)baseAction.setEffectiveTimeScale(intent.base==='Walk'?.9+this.affect.energy*.15:1);const desired=intent.enabled?intent.gesture:null,key=`${desired}:${intent.phase}`;
  if(key!==this.overlayKey){if(this.overlay)this.overlay.fadeOut(.18);this.overlay=this.overlayActions[desired]??null;if(this.overlay){this.overlay.reset().setEffectiveWeight(intent.reducedMotion?.35:.65).fadeIn(.18).play();}this.overlayKey=key;}
  this.mixer.update(delta*rate);
  for(const b of this.bones)b.base.copy(b.bone.quaternion);
  if(!intent.enabled)return;
  const smooth=1-Math.exp(-delta*4);for(const k of ['energy','valence','tension'])this.affect[k]+=(intent.affect[k]-this.affect[k])*smooth;
  const decorative=intent.reducedMotion?.25:1,sync=intent.synchrony*Math.sin(intent.syncPhase??0)*.025*decorative;
  this.rotate(this.spine,((1-this.affect.energy)*.045+intent.lean)*decorative,0,intent.micro.sway+sync);
  if(intent.base==='Walk')for(const side of ['l','r']){const bone=this.model.getObjectByName(`upperarm_${side}`);if(bone&&this.neutralArms[side])bone.quaternion.slerp(this.neutralArms[side],(1-this.affect.energy)*.2);}
  this.rotate(this.neck,this.affect.tension*.025,0,0);
  this.model.updateWorldMatrix(true,true);
  let yaw=0,pitch=0;if(intent.lookAt&&intent.base!=='Sleep'){
   this.target.fromArray(intent.lookAt);this.human.root.worldToLocal(this.target);yaw=clamp(Math.atan2(this.target.x,this.target.z),-.65,.65);pitch=clamp(-Math.atan2(this.target.y-1.45,Math.hypot(this.target.x,this.target.z)),-.28,.28);
  }
  const maxTurn=delta*1.5;this.yaw+=clamp(yaw-this.yaw,-maxTurn,maxTurn);this.pitch+=clamp(pitch-this.pitch,-maxTurn,maxTurn);
  this.rotate(this.head,this.pitch*.65,this.yaw*.6+intent.micro.glance,intent.micro.breath);
  this.rotate(this.neck,this.pitch*.2,this.yaw*.25,0);this.rotate(this.spine,0,this.yaw*.15,0);
  this.model.updateWorldMatrix(true,true);
  if(intent.quality==='full')for(const hand of intent.hands)if(this.arms[hand.hand]?.solve(hand.target,hand.weight))this.metrics.ik++;
  for(const {bone,base} of this.bones){const q=bone.quaternion;if(!Number.isFinite(q.x+q.y+q.z+q.w))q.copy(base);q.normalize();}
  this.metrics.updates++;
 }
 dispose(){this.reset();for(const a of Object.values(this.overlayActions))this.mixer.uncacheAction(a.getClip(),this.model);}
}
