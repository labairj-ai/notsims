import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {advance,dispatch} from '../src/game/dispatch.js';
import {SOCIAL_ACTIONS} from '../src/content/social.js';
import {CLIPS,presentationRate} from '../src/presentation/clips.js';
import {resolveBodyIntent,socialPoseFor,affectFor,microMotion} from '../src/presentation/body-intent.js';
import {BodyPresentation} from '../src/presentation/runtime.js';
import {classicPose} from '../src/presentation/classic-pose.js';
import {furnitureAnchors} from '../src/presentation/anchors.js';
import {furniturePoint} from '../src/systems/objects/geometry.js';
import {relationship} from '../src/systems/social/relationships.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.freeze(o);for(const v of Object.values(o))freeze(v);}return o;};
const present=()=>{const s=newGame();s.person.x=8;s.person.y=9;s.social.presences=[{personId:'person_1',x:9,y:9,state:'visiting',path:[],moveClock:0,until:s.minutes+300}];return s;};

test('all social actions have pure speaker/listener intents, with remote channels looking at no absent partner',()=>{
 for(const interaction of Object.keys(SOCIAL_ACTIONS))for(const initiator of ['player','person_1'])for(const channel of ['in_person','phone_call','text']){
  const s=present();s.activity={kind:'social',actorId:initiator,personId:'person_1',interaction,channel,path:[],elapsed:5,total:8};freeze(s);
  const a=resolveBodyIntent(s,'player',{time:2}),b=resolveBodyIntent(s,'person_1',{time:2});assert.ok(!a.gesture||CLIPS[a.gesture]);assert.ok(!b.gesture||CLIPS[b.gesture]);
  if(channel==='in_person'){assert.notEqual(a.role,b.role);assert.ok(a.lookAt);assert.ok(b.lookAt);}else assert.equal(a.lookAt,null);
  assert.ok(Object.values(affectFor(s,'player')).every(Number.isFinite));assert.equal(classicPose(a,2).sleeping,false);
 }
});
test('staging reflects both directional relationships, uses safe existing positions, and mirroring has bounded partial delay',()=>{
 const s=present(),r=relationship(s,'player','person_1',true),before=structuredClone(s);const stranger=socialPoseFor(s,'player','person_1');
 for(const v of Object.values(r.toward)){v.affinity=80;v.connection=90;v.trust=70;}const warm=socialPoseFor(s,'player','person_1','confide');assert.ok(warm.desiredDistance<stranger.desiredDistance);assert.ok(warm.synchrony>0&&warm.synchrony<=.25);assert.ok(warm.delay>=.4&&warm.delay<=1);
 r.toward.player.affinity=-50;assert.equal(socialPoseFor(s,'player','person_1').synchrony,0);assert.deepEqual(s.person,before.person);assert.deepEqual(s.social.presences,before.social.presences);
 s.social.presences=[];assert.equal(socialPoseFor(s,'player','person_1').orientation,null);
});
test('all furniture anchors rotate in the canonical coordinate space and object phases stay finite',()=>{
 for(const type of ['bed','sofa','toilet','fridge','stove','bookcase','desk','shower','tv'])for(let rotation=0;rotation<4;rotation++){
  const s=present(),f={id:1,type,x:6,y:6,rotation};s.furniture=[f];const anchors=furnitureAnchors(f);assert.ok(Object.values(anchors).flat().every(Number.isFinite));if(type==='fridge'){const [x,y]=furniturePoint(f,.25,.91);assert.deepEqual(anchors.rightHand,[x,.861,y]);}
  for(const elapsed of [0,.6,1.5,8,29.5]){s.activity={kind:'use',id:1,path:[],elapsed,total:30};const intent=resolveBodyIntent(freeze(structuredClone(s)),'player');assert.ok(intent.lookAt||type==='bed');assert.ok(intent.position.every(Number.isFinite));assert.ok(intent.hands.every(h=>h.weight>=0&&h.weight<=1));assert.ok(!intent.gesture||CLIPS[intent.gesture]);}
 }
});
test('all five shared activities have complementary roles for every rotation; cancellation releases intents',()=>{
 for(const [type,id] of [['sofa','shared_sit'],['tv','shared_watch'],['table','shared_eat'],['stove','shared_cook'],['bookcase','shared_read']])for(let rotation=0;rotation<4;rotation++){
  const s=present();s.furniture=[{id:1,type,x:6,y:6,rotation}];s.social.sharedActivity={id:9,interactionId:id,objectId:1,personId:'person_1',participants:['player','person_1'],status:'active',slots:[[8,9],[9,9]],elapsed:9,total:45};
  const a=resolveBodyIntent(s,'player'),b=resolveBodyIntent(s,'person_1');assert.notEqual(a.role,b.role);assert.notDeepEqual(a.position,b.position);assert.ok(a.position.every(Number.isFinite));if(id==='shared_cook')assert.notEqual(a.gesture,b.gesture);
  s.social.sharedActivity=null;assert.equal(resolveBodyIntent(s,'person_1').hands.length,0);assert.equal(resolveBodyIntent(s,'person_1').gesture,null);
 }
});
test('presentation is isolated from gameplay including enabled/disabled, clocks, reactions, saves and social RNG',()=>{
 const a=newGame(),b=structuredClone(a),body=new BodyPresentation(),off=new BodyPresentation({enabled:false});a.social.nextSocialOpportunityMinute=b.social.nextSocialOpportunityMinute=1e8;
 dispatch(a,{type:'QUICK_ACTION',kind:'snack'});dispatch(b,{type:'QUICK_ACTION',kind:'snack'});
 for(let i=0;i<200;i++){body.receive(advance(a,.2));off.receive(advance(b,.2));body.frame(a,i/60);off.frame(b,i/60);resolveBodyIntent(a,'player',{time:i,enabled:true});resolveBodyIntent(b,'player',{time:i,enabled:false});assert.deepEqual(a,b);}
 assert.equal(body.intent(a,'player').enabled,true);assert.equal(off.intent(b,'player').enabled,false);assert.ok(!JSON.stringify(a).includes('BodyIntent'));
});
test('reaction facts are deduplicated, role/outcome specific, bounded and cleared on state replacement/hide',()=>{
 for(const interaction of ['joke','apologize'])for(const success of [true,false]){const body=new BodyPresentation(),s=present();body.frame(s,0);const e={type:'SOCIAL_CONTACT_COMPLETED',actorId:'player',targetId:'person_1',personId:'person_1',channel:'in_person',interaction,success};body.receive({events:[e,e]});assert.equal(body.reactions.size,2);const listener=body.intent(s,'person_1');assert.equal(listener.gesture,success?(interaction==='joke'?'Laugh':'Nod'):'LeanBack');body.frame(s,1,{hidden:true});assert.equal(body.reactions.size,0);body.receive({events:[{...e}]});body.frame(structuredClone(s),2);assert.equal(body.reactions.size,0);}
});
test('pause freezes presentation; live reduced motion suppresses decoration and retains essential gestures',()=>{
 const body=new BodyPresentation(),s=present();body.frame(s,0);s.minutes++;body.frame(s,.1,{speed:8});const before=body.time;body.frame(s,4,{paused:true});assert.equal(body.time,before);assert.deepEqual([1,3,8].map(presentationRate),[1,1.5,2]);
 assert.notDeepEqual(microMotion('player',3),microMotion('person_1',3));assert.deepEqual(microMotion('player',3,{reducedMotion:true}),{sway:0,breath:0,glance:0});body.reducedMotion=true;s.activity={kind:'social',personId:'person_1',interaction:'greet',actorId:'player',channel:'in_person',path:[],elapsed:1,total:8};const intent=body.intent(s,'player');assert.equal(intent.gesture,'Wave');assert.deepEqual(intent.micro,{sway:0,breath:0,glance:0});
 assert.deepEqual(affectFor(s,'person_1'),{valence:0,arousal:.5,energy:.7,tension:0});
});

test('departing visitors render at their actual position but no longer receive conversation targets',()=>{
 const s=present();s.social.presences[0].state='leaving';s.activity={kind:'social',personId:'person_1',interaction:'chat',channel:'in_person',path:[],elapsed:2,total:8};const npc=resolveBodyIntent(s,'person_1');assert.deepEqual(npc.position,[9.5,0,9.5]);assert.equal(resolveBodyIntent(s,'player').lookAt,null);assert.equal(socialPoseFor(s,'player','person_1').orientation,null);
});
test('sit and stand transitions use authored full-body clips before steady seated/lying poses',()=>{
 const s=present();s.furniture=[{id:1,type:'sofa',x:6,y:6,rotation:0}];s.activity={kind:'use',id:1,path:[],elapsed:.5,total:30};assert.equal(resolveBodyIntent(s,'player').base,'StandToSit');s.activity.elapsed=8;assert.equal(resolveBodyIntent(s,'player').base,'Sit');s.activity.elapsed=29.5;assert.equal(resolveBodyIntent(s,'player').base,'SitToStand');
});

test('performance policy retains player/partner priority while degrading optional visitor layers',()=>{
 const body=new BodyPresentation(),s=present();for(let i=0;i<100;i++)body.reportCost(20);assert.equal(body.intent(s,'player').quality,'full');assert.equal(body.intent(s,'person_1').quality,'low');s.activity={kind:'social',personId:'person_1',interaction:'chat',channel:'in_person',path:[],elapsed:1,total:8};assert.equal(body.intent(s,'person_1').quality,'full');
});

test('disabled behavior preserves legacy seated positioning and has no procedural contacts',()=>{
 const s=present();s.furniture=[{id:1,type:'sofa',x:6,y:6,rotation:0}];s.activity={kind:'use',id:1,path:[],elapsed:8,total:30};const pose=resolveBodyIntent(s,'player',{enabled:false});assert.equal(pose.base,'Sit');assert.equal(pose.seatOffset,.874);assert.equal(pose.gesture,null);assert.deepEqual(pose.hands,[]);
});
