// Cheap projected equivalents of the same authored movement vocabulary.
export function classicPose(intent,time){
 const seated=['Sit','StandToSit','SitToStand'].includes(intent.base),sleeping=intent.base==='Sleep',reduced=intent.reducedMotion,phase=time*3,wave=reduced?.3:Math.sin(phase),gesture=intent.gesture;
 const out={seated,sleeping,lean:intent.lean+(intent.posture==='slouched'?.035:0),headTilt:0,headTurn:0,left:[-.28,.76],right:[.28,.76],prop:null,bounce:intent.micro.breath,walking:intent.base==='Walk'};
 if(!reduced)out.lean+=intent.micro.sway;
 if(intent.lookAt&&intent.facing!==null)out.headTurn=Math.sin(intent.facing)*.05;
 switch(gesture){
  case 'Wave':out.right=[.38,1.25+wave*.06];break;
  case 'TalkA':case 'TalkB':out.right=[.38,.9+wave*.035];out.left=[-.3,.83-wave*.02];break;
  case 'Nod':out.headTilt=wave*.05;break;
  case 'HeadShake':out.headTurn=wave*.09;break;
  case 'Laugh':out.headTilt=-.05;out.bounce+=wave*.015;out.right=[.23,.94];break;
  case 'Shrug':out.left=[-.4,.97];out.right=[.4,.97];out.headTilt=.04;break;
  case 'Point':case 'Argue':out.right=[.51,1.03+wave*.025];out.lean+=.025;break;
  case 'Apologize':out.headTilt=.1;out.left=[-.12,.8];out.right=[.12,.8];break;
  case 'LeanIn':out.lean+=.05;break;
  case 'LeanBack':out.lean-=.04;break;
  case 'ReachHigh':out.right=[.36,1.38];break;
  case 'ReachMid':out.right=[.46,.95];break;
  case 'ReachLow':out.right=[.36,.5];break;
  case 'Eat':out.right=[.1,1.03];out.prop='meal';break;
  case 'Read':out.left=[-.14,.88];out.right=[.14,.88];out.headTilt=.05;out.prop='book';break;
  case 'Type':out.left=[-.18,.83+wave*.02];out.right=[.18,.83-wave*.02];out.prop='keyboard';break;
  case 'Stir':out.right=[.25+wave*.04,.86];out.left=[-.1,.8];out.prop='pan';break;
  case 'UseHands':out.left=[-.19,.87];out.right=[.25,.9+wave*.03];break;
 }
 return out;
}
