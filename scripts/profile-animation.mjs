import {readFile,writeFile} from 'node:fs/promises';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Human} from '../src/character3d.js';
import {resolveBodyIntent} from '../src/presentation/body-intent.js';
import {newGame} from '../src/game/session.js';
const bytes=await readFile(new URL('../assets/notsims-human.glb',import.meta.url)),loader=new GLTFLoader();loader.register(parser=>{parser.loadTexture=async()=>new THREE.Texture();return {name:'ProfileWithoutTextureDecode'};});
const load=performance.now(),asset=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');const decodeMs=performance.now()-load,profiles=[];
for(const count of [1,3,4,8]){
 const humans=Array.from({length:count},()=>new Human(asset)),s=newGame(),intent=resolveBodyIntent(s,'player');const times=[],ikTimes=[];
 for(let frame=0;frame<1200;frame++){
  const start=performance.now();for(let i=0;i<count;i++){intent.key='profile';intent.base='Idle';intent.gesture='TalkA';intent.lookAt=[1,1.5,2];intent.micro.sway=Math.sin(frame/60+i)*.005;humans[i].controller.update(intent,1/60);}
  if(frame>=200)times.push(performance.now()-start);
  const ikStart=performance.now();for(const h of humans){const arm=h.controller.arms.right;arm.hand.getWorldPosition(arm.target);arm.target.y+=.035;arm.solve([arm.target.x,arm.target.y,arm.target.z],.7);}if(frame>=200)ikTimes.push(performance.now()-ikStart);
 }
 times.sort((a,b)=>a-b);ikTimes.sort((a,b)=>a-b);profiles.push({actors:count,mixers:count,controllerMedianMs:times[500],controllerP95Ms:times[950],ikMedianMs:ikTimes[500],ikP95Ms:ikTimes[950]});humans.forEach(h=>h.dispose());
}
const result={kind:'headless desktop CPU; excludes texture decode, GPU and browser rendering',node:process.version,assetBytes:bytes.length,geometryParseMs:decodeMs,profiles};console.log(JSON.stringify(result,null,2));if(process.env.PROFILE_OUT)await writeFile(process.env.PROFILE_OUT,JSON.stringify(result,null,2)+'\n');
