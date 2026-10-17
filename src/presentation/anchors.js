import {itemDef} from '../content/furniture.js';
import {furniturePoint,dimensions} from '../systems/objects/geometry.js';
// Local [x, height, plot-y], metres, matching neutral furniture recipes.
export const FURNITURE_ANCHORS=Object.freeze({
 fridge:{rightHand:[.25,.861,.91],look:[.5,1.15,.7]},
 stove:{rightHand:[.69,1.15,.68],leftHand:[.3,1.15,.68],look:[.5,1.2,.5]},
 bookcase:{rightHand:[.65,1.38,.84],objectHold:[.5,.95,.85],look:[.5,1.1,.5]},
 desk:{rightHand:[1.15,1.19,.6],leftHand:[.8,1.19,.6],look:[1,1.2,.3]},
 shower:{rightHand:[.28,1.1,.17],look:[.4,1.3,.2]},
 bed:{seat:[1,.65,1.5],lie:[1,.88,1.87],look:[1,.7,.5]},
 sofa:{seat:[.7,.61,.56],seat2:[1.35,.61,.56],look:[1,1,.9]},
 toilet:{seat:[.5,.49,.59],look:[.5,.9,1]},
 tv:{look:[1,1.2,.5]},table:{rightHand:[.6,1.12,.8],leftHand:[1.4,1.12,.8],look:[1,.9,.5]}
});
export function furnitureAnchors(f){const result={};for(const [key,[lx,z,ly]] of Object.entries(FURNITURE_ANCHORS[itemDef(f.type)?.recipe??f.type]??{})){const [x,y]=furniturePoint(f,lx,ly);result[key]=[x,z,y];}const [w,h]=dimensions(f);result.center=[f.x+w/2,.9,f.y+h/2];return result;}
export function objectPhase(a){if(a?.path?.length)return 'approach';if(!a)return 'settle';const elapsed=a.elapsed??0,total=a.total??60;return elapsed<.3?'orient':elapsed<1?'prepare':elapsed<2?'contact':elapsed>total-1?'release':'active';}
export function objectGesture(type,phase){type=itemDef(type)?.recipe??type;if(phase==='approach'||phase==='settle')return null;if(['orient','prepare','contact'].includes(phase))return ['bed','sofa','toilet'].includes(type)?'StandToSit':type==='bookcase'?'ReachHigh':'ReachMid';if(phase==='release')return ['bed','sofa','toilet'].includes(type)?'SitToStand':'ReachMid';return {fridge:'Eat',stove:'Stir',bookcase:'Read',desk:'Type',shower:'UseHands',tv:null}[type]??null;}
