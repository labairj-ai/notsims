import {sharedActivityPose} from '../systems/social/shared-activities.js';
import {interactionPose} from './object-pose.js';
import {furnitureAnchors,objectPhase,objectGesture} from './anchors.js';
import {SOCIAL_GESTURES} from './clips.js';
import {relationship} from '../systems/social/relationships.js';
const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));
export function actorPosition(s,id){const pose=sharedActivityPose(s,id);if(pose)return [pose.x,0,pose.y];if(id==='player')return [s.person.x+.5,0,s.person.y+.5];const p=s.social?.presences.find(p=>p.personId===id);return p?[p.x+.5,0,p.y+.5]:null;}
function attentionPosition(s,id){if(id!=='player'&&!s.social?.presences.some(p=>p.personId===id&&p.state==='visiting'))return null;return actorPosition(s,id);}
export function affectFor(s,id){if(id!=='player')return {valence:0,arousal:.5,energy:.7,tension:0};const n=s.needs,mean=Object.values(n).reduce((a,b)=>a+b,0)/Object.keys(n).length;return {valence:clamp((mean-50)/60,-.65,.65),arousal:clamp(.2+n.energy/150,.2,.85),energy:clamp(n.energy/100),tension:clamp((35-Math.min(n.hunger,n.bladder,n.hygiene))/60)};}
export function socialPoseFor(s,actorId,targetId,interaction='chat'){
 const r=relationship(s,actorId,targetId),values=r?Object.values(r.toward):[],warm=values.length?clamp(Math.min(...values.map(v=>v.affinity))/80):0,conflict=['argue','insult','confront','disagree'].includes(interaction)||values.some(v=>v.affinity<0),a=actorPosition(s,actorId),b=attentionPosition(s,targetId);
 return {desiredDistance:conflict?1.35:1.2-warm*.35,orientation:a&&b?Math.atan2(b[0]-a[0],b[2]-a[2]):null,lean:conflict?-.035:interaction==='confide'?.04:warm*.025,gazeWeight:conflict?.85:.65,synchrony:conflict?0:warm*.25,delay:.45+(1-warm)*.5};
}
export function presentationHash(id){let h=2166136261;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;}
export function microMotion(id,time,{suppressed=false,reducedMotion=false}={}){if(suppressed||reducedMotion)return {sway:0,breath:0,glance:0};const seed=presentationHash(id)*100;return {sway:(Math.sin(time*.73+seed)+Math.sin(time*.31+seed*2))*.006,breath:Math.sin(time*1.4+seed)*.003,glance:Math.sin(time*.21+seed)>.96?.12:0};}
export function resolveBodyIntent(s,actorId,{time=0,reducedMotion=false,quality='full',enabled=true,reaction=null,mirroring=true}={}){
 const player=actorId==='player',presence=player?null:s.social?.presences.find(p=>p.personId===actorId),a=s.activity,move=player?a:presence,walking=!!move?.path?.length;
 const pose=sharedActivityPose(s,actorId)||(player?interactionPose(s):null),position=pose?[pose.x,pose.height,pose.y]:actorPosition(s,actorId)??[0,0,0];
 let facing=pose?.angle??null;
 if(walking){const p=player?s.person:presence,[tx,ty]=move.path[0],t=clamp((player?move.walkClock??0:presence.moveClock??0)/2);position[0]=p.x+.5+(tx-p.x)*t;position[2]=p.y+.5+(ty-p.y)*t;facing=Math.atan2(tx-p.x,ty-p.y);}
 const intent={actorId,key:walking?'walk':'idle',base:walking?'Walk':pose?.animation??(player&&a?.kind==='nap'?'Sleep':'Idle'),gesture:player&&a?.kind==='snack'?'Eat':null,phase:walking?'approach':'settle',position,facing,lookAt:null,hands:[],posture:'upright',lean:0,affect:affectFor(s,actorId),micro:{sway:0,breath:0,glance:0},synchrony:0,reducedMotion,quality,role:'none',enabled};
 intent.seatOffset=intent.base==='Sit'?.874:0;
 if(!enabled)return {...intent,gesture:null,affect:{valence:0,arousal:.5,energy:.7,tension:0}};
 const shared=s.social?.sharedActivity,sharedActive=shared?.status==='active'&&shared.participants.includes(actorId),social=a?.kind==='social'&&!a.path?.length&&(player||a.personId===actorId)&&a.channel==='in_person'&&attentionPosition(s,a.personId),remote=player&&a?.kind==='social'&&!a.path?.length&&a.channel!=='in_person';
 if(!walking&&player&&a?.kind==='use'){
  const f=s.furniture.find(f=>f.id===a.id);if(f){intent.key=`use:${f.id}:${f.rotation}`;intent.phase=objectPhase(a);intent.gesture=objectGesture(f.type,intent.phase);if(['fridge','stove'].includes(f.type))intent.base='Idle';const anchors=furnitureAnchors(f);intent.lookAt=anchors.look??anchors.center;
   if(['sofa','toilet','bed'].includes(f.type)){
    const elapsed=a.elapsed??3,total=a.total??60,sitting=clamp(elapsed/1.5),leaving=elapsed>total-1.5;
    if(elapsed<1.5){intent.base='StandToSit';intent.gesture=null;intent.seatOffset=.874*sitting;intent.position[1]=(f.type==='bed'?.62:pose.height)*sitting;intent.phase='prepare';}
    else if(leaving){intent.base='SitToStand';intent.gesture=null;intent.seatOffset=.874*clamp((total-elapsed)/1.5);intent.position[1]=(f.type==='bed'?.62:pose.height)*clamp((total-elapsed)/1.5);intent.phase='release';}
    else if(f.type==='bed'&&elapsed<3){intent.base='Sit';intent.gesture=null;intent.position[1]=.62;}
   }
   const contact=['contact','active'].includes(intent.phase)&&!['fridge'].includes(f.type)||f.type==='fridge'&&['prepare','contact'].includes(intent.phase);if(contact&&quality==='full')for(const hand of ['rightHand','leftHand'])if(anchors[hand])intent.hands.push({hand:hand==='rightHand'?'right':'left',target:anchors[hand],weight:clamp(((a.elapsed??0)-.3)/1.2)*clamp(((a.total??60)-(a.elapsed??0))/.8)});}
 }
 if(sharedActive){
  const i=shared.participants.indexOf(actorId),partner=shared.participants[1-i],f=s.furniture.find(f=>f.id===shared.objectId),anchors=furnitureAnchors(f),turn=Math.floor(shared.elapsed/6)%2,speaker=i===turn;
  intent.key=`shared:${shared.id}`;intent.phase=objectPhase(shared);intent.role=speaker?'speaker':'listener';intent.lookAt=anchors.look??anchors.center;
  switch(shared.interactionId){
   case 'shared_sit':intent.base='Sit';intent.gesture=speaker?'TalkA':shared.elapsed%6>3?'Nod':null;intent.lookAt=attentionPosition(s,partner);if(intent.lookAt)intent.lookAt[1]=1.3;break;
   case 'shared_watch':intent.base='Idle';intent.gesture=shared.elapsed%14<2?(i?'Nod':'Laugh'):null;if(shared.elapsed%17>15){intent.lookAt=attentionPosition(s,partner);if(intent.lookAt)intent.lookAt[1]=1.45;}if(intent.lookAt)intent.lookAt[1]=1.3;break;
   case 'shared_eat':intent.base='Idle';intent.gesture=speaker?'Eat':'TalkB';if(!speaker){intent.lookAt=attentionPosition(s,partner);if(intent.lookAt)intent.lookAt[1]=1.45;}if(intent.lookAt)intent.lookAt[1]=1.3;break;
   case 'shared_cook':intent.base='Idle';intent.role=i===turn?'cook':'helper';intent.gesture=i===turn?'Stir':'UseHands';if(quality==='full'&&anchors.rightHand)intent.hands=[{hand:'right',target:anchors[i?'leftHand':'rightHand']??anchors.rightHand,weight:.7}];break;
   case 'shared_read':intent.gesture=shared.elapsed%18<12?'Read':speaker?'TalkB':'Nod';if(intent.gesture!=='Read'){intent.lookAt=attentionPosition(s,partner);if(intent.lookAt)intent.lookAt[1]=1.45;}if(intent.lookAt)intent.lookAt[1]=1.3;break;
  }
  const stage=socialPoseFor(s,actorId,partner,shared.interactionId);intent.synchrony=mirroring?stage.synchrony:0;intent.lean=stage.lean;
  // Stable reference, delayed per role; no actor output feeds another actor.
  intent.syncPhase=time*.9-(i?stage.delay:0);
 }else if(social||remote){
  const speakerId=a.actorId??'player',partner=player?a.personId:'player',speaker=actorId===speakerId,progress=(a.elapsed??0)/(a.total??8),stage=socialPoseFor(s,actorId,partner,a.interaction);
  intent.key=`social:${a.personId}:${a.interaction}:${a.channel}`;intent.role=speaker?'speaker':'listener';intent.phase=progress<.55?'speaker':progress<.85?'response':'settle';intent.gesture=remote?(a.channel==='text'?'Type':'TalkA'):speaker?(progress<.85?SOCIAL_GESTURES[a.interaction]??'TalkA':null):(progress>.55?'Nod':null);
  if(!remote){intent.lookAt=attentionPosition(s,partner);if(intent.lookAt)intent.lookAt[1]=1.45;intent.facing=stage.orientation===null?null:stage.orientation+(stage.synchrony>0?(speaker?.035:-.035):0);intent.lean=stage.lean;
   // Stay inside the already safe grid cell; never change destinations or cross a wall.
   const target=attentionPosition(s,partner);if(target){const dx=target[0]-position[0],dy=target[2]-position[2],length=Math.hypot(dx,dy),offset=clamp((1-stage.desiredDistance)/2,-.08,.08);if(length>.5){position[0]+=dx/length*offset;position[2]+=dy/length*offset;}}
   intent.synchrony=mirroring?stage.synchrony:0;intent.syncPhase=time*.9-(speaker?0:stage.delay);}
 }
 if(reaction&&!walking&&!social&&!sharedActive&&(!a||a.kind==='walk')){intent.gesture=reaction.gesture;intent.key=`reaction:${reaction.key}`;if(reaction.channel==='in_person'){intent.lookAt=attentionPosition(s,reaction.partner);if(intent.lookAt)intent.lookAt[1]=1.45;}}
 if(intent.seatOffset===undefined)intent.seatOffset=intent.base==='Sit'?.874:0;
 if(intent.base==='Sleep'){intent.gesture=null;intent.lookAt=null;intent.hands=[];intent.position[1]=pose?.height??.05;intent.posture='sleeping';}
 else if(intent.base==='Sit')intent.posture='seated';else if(intent.affect.tension>.3)intent.posture='tense';else if(intent.affect.energy<.3)intent.posture='slouched';else if(intent.affect.valence>.2)intent.posture='relaxed';
 // Need flourishes in sparse, actor-specific windows, never while occupied.
 const seed=presentationHash(actorId),window=Math.floor(time/(13+seed*8));if(!reducedMotion&&quality==='full'&&!intent.gesture&&!walking&&!pose&&player&&!a&&Math.sin(window*12.9898+seed*37)>.83&&time%(13+seed*8)<1.7)intent.gesture=s.needs.energy<30?'LeanBack':s.needs.hunger<30?'ReachLow':s.needs.bladder<30?'LeanIn':s.needs.hygiene<30?'Shrug':s.needs.fun<30?'HeadShake':s.needs.social<30?'Read':null;
 intent.micro=microMotion(actorId,time,{suppressed:walking||!!intent.gesture||!!pose,reducedMotion:reducedMotion||quality!=='full'});
 if(intent.lookAt&&intent.base!=='Sleep'&&!reducedMotion&&Math.sin(time*.81+seed*15)>.82){intent.lookAt[0]+=.5;intent.lookAt[2]-=.3;}
 if(quality==='low')intent.hands=[];
 return intent;
}
