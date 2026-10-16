// Shared vocabulary; metadata mirrors the pinned Blender exporter (24 fps).
const loop=(duration,mask='upper')=>({duration,loop:true,mask});
const once=(duration,mask='upper')=>({duration,loop:false,mask});
export const CLIPS=Object.freeze({
 Idle:loop(3,'full'),Walk:loop(1,'full'),Sit:loop(3,'full'),Sleep:loop(3,'full'),Eat:loop(2),
 Wave:once(2),TalkA:loop(3),TalkB:loop(3.5),Nod:once(1.2),HeadShake:once(1.4),Laugh:once(2),Shrug:once(2),Point:once(1.8),
 LeanIn:once(2),LeanBack:once(2),Apologize:once(2.5),Argue:loop(2),ReachHigh:once(2),ReachMid:once(2),ReachLow:once(2),
 UseHands:loop(2),Type:loop(2),Read:loop(3),Stir:loop(2.5),StandToSit:once(1.5,'full'),SitToStand:once(1.5,'full')
});
export const SOCIAL_GESTURES=Object.freeze({greet:'Wave',interests:'TalkB',chat:'TalkA',day:'TalkB',joke:'TalkB',compliment:'TalkA',share:'Point',encourage:'Nod',know:'TalkA',confide:'LeanIn',advice:'Shrug',news:'TalkB',disagree:'HeadShake',argue:'Argue',insult:'Point',confront:'Argue',apologize:'Apologize',clear:'TalkA',amends:'Nod'});
export const presentationRate=speed=>speed<=1?1:speed<=3?1.5:2;
