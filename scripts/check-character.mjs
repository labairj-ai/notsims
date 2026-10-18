import {checkAppearance} from './character-appearance.mjs';
import {readFile,stat} from 'node:fs/promises';
import {CLIPS} from '../src/presentation/clips.js';
export async function checkCharacter(root='assets'){
 const bytes=await readFile(`${root}/notsims-human.glb`),metadata=JSON.parse(await readFile(`${root}/character-metadata.json`,'utf8'));
 if(bytes.readUInt32LE(0)!==0x46546c67||bytes.length!==bytes.readUInt32LE(8))throw Error('Invalid GLB');
 if((await stat(`${root}/notsims-human.glb`)).size>12_000_000)throw Error('Character exceeds 12 MB budget');
 const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString()),names=gltf.animations.map(a=>a.name);
 if(new Set(names).size!==names.length||names.sort().join()!==Object.keys(CLIPS).sort().join())throw Error('Missing or duplicate clips');
 for(const a of gltf.animations){const times=a.samplers.map(s=>gltf.accessors[s.input]),duration=Math.max(...times.map(a=>a.max[0]));if(Math.abs(duration-CLIPS[a.name].duration)>1/24+.001)throw Error(`Clip duration: ${a.name}: ${duration}`);}
 for(const name of ['head','neck_01','spine_03','upperarm_l','lowerarm_l','hand_l','upperarm_r','lowerarm_r','hand_r'])if(!gltf.nodes.some(n=>n.name===name))throw Error(`Missing required bone: ${name}`);
 if(metadata.fps!==24||metadata.bones!==53||metadata.blender!=='4.5.4 LTS'||metadata.clips.length!==names.length)throw Error('Wrong pinned export metadata');
 await checkAppearance(root);
 console.log(`Verified ${names.length} clips, 53-bone rig, pinned exporter and ${bytes.length} character bytes.`);
 return {bytes:bytes.length,clips:names.length};
}
if(process.argv[1]?.endsWith('/check-character.mjs'))await checkCharacter(process.argv[2]);
