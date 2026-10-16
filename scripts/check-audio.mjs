import {readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {AUDIO_CUES,INTERACTION_AUDIO} from '../src/audio/audio-cues.js';
import {AUDIO_ASSETS} from '../src/audio/audio-library.js';
import {AUDIO_BUSES} from '../src/audio/audio-events.js';

export const AUDIO_BUDGET={totalWarn:2*1024*1024,totalMax:3*1024*1024,essentialWarn:96*1024,essentialMax:128*1024,decodedSfxMax:8*1024*1024};
export async function validateAudio(root='.',{cues=AUDIO_CUES,assets=AUDIO_ASSETS,writeManifest=false}={}){
 const base=resolve(root),ids=new Set(),referenced=new Set(),essential=new Set();
 for(const cue of cues){
  if(ids.has(cue.id))throw Error(`Duplicate audio cue: ${cue.id}`);ids.add(cue.id);
  if(!AUDIO_BUSES.includes(cue.bus))throw Error(`Unknown audio bus: ${cue.id} -> ${cue.bus}`);
  if(!['oneShot','loop','stream'].includes(cue.mode)||!cue.sources?.length||!Number.isFinite(cue.gain)||cue.gain<0||cue.gain>1||!Number.isFinite(cue.cooldown)||cue.cooldown<0||!Number.isInteger(cue.maxPolyphony)||cue.maxPolyphony<1||!Number.isFinite(cue.pitchJitter)||cue.pitchJitter<0||cue.pitchJitter>.1)throw Error(`Invalid cue metadata: ${cue.id}`);
  for(const id of cue.sources){if(!assets[id])throw Error(`Unknown audio asset: ${cue.id} -> ${id}`);referenced.add(id);if(cue.preloadGroup==='essential')essential.add(id);if(cue.mode==='stream'&&(!assets[id].loopable||!assets[id].allowedStates?.includes(cue.id.slice(6))||!Number.isFinite(assets[id].normalizationGain)))throw Error(`Invalid music track metadata: ${id}`);}
 }
 for(const mapping of Object.values(INTERACTION_AUDIO))for(const [phase,id] of Object.entries(mapping))if(phase!=='decision'&&!ids.has(id))throw Error(`Unknown interaction cue: ${id}`);
 let total=0,first=0,decoded=0;const entries=[];
 for(const [id,asset] of Object.entries(assets)){
  if(asset.id!==id||!referenced.has(id))throw Error(`Unreferenced/mismatched audio asset: ${id}`);
  for(const field of ['title','author','source','license','date','originalFilename','modifications'])if(!asset[field])throw Error(`Missing provenance ${field}: ${id}`);
  if(asset.license!=='CC0-1.0')throw Error(`Unapproved audio license: ${id}`);
  const path=resolve(base,asset.src);if(!path.startsWith(resolve(base,'assets/audio')+'/'))throw Error(`Audio path escapes bundle: ${id}`);
  let bytes;try{bytes=await readFile(path);}catch{throw Error(`Missing audio file for ${id}: ${asset.src}`);}
  if(bytes.length!==asset.bytes||!Number.isFinite(asset.duration)||asset.duration<=0)throw Error(`Invalid audio metadata: ${id}`);
  if(extname(path)==='.wav'){if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw Error(`Invalid WAV header: ${id}`);decoded+=Math.ceil(asset.duration*Math.max(48000,bytes.readUInt32LE(24))*bytes.readUInt16LE(22)*4);}
  else if(extname(path)==='.mp3'){if(bytes.toString('ascii',0,3)!=='ID3'&&bytes[0]!==255)throw Error(`Invalid MP3 header: ${id}`);}
  else throw Error(`Unsupported audio format: ${asset.src}`);
  total+=bytes.length;if(essential.has(id))first+=bytes.length;entries.push(asset);
 }
 async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())await scan(path);else if(/\.(wav|mp3|ogg)$/i.test(path)&&!entries.some(a=>resolve(base,a.src)===path))throw Error(`Audio file has no provenance: ${path}`);}}
 await scan(resolve(base,'assets/audio'));
 if(total>AUDIO_BUDGET.totalMax||first>AUDIO_BUDGET.essentialMax||decoded>AUDIO_BUDGET.decodedSfxMax)throw Error(`Audio budget exceeded: total=${total}, essential=${first}, decoded=${decoded}`);
 const manifest={version:1,totalBytes:total,essentialBytes:first,estimatedDecodedSfxBytes:decoded,budget:AUDIO_BUDGET,cues:cues.map(c=>({...c,sources:c.sources.map(id=>assets[id])}))};
 if(writeManifest)await writeFile(resolve(base,'assets/audio/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return manifest;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const report=await validateAudio(process.argv[2]??'.',{writeManifest:process.argv.includes('--write')});console.log(`Audio: ${report.cues.length} cues, ${Object.keys(AUDIO_ASSETS).length} assets; total ${report.totalBytes} B / ${AUDIO_BUDGET.totalMax} B, essential ${report.essentialBytes} B / ${AUDIO_BUDGET.essentialMax} B, decoded SFX ${report.estimatedDecodedSfxBytes} B.`);if(report.totalBytes>AUDIO_BUDGET.totalWarn||report.essentialBytes>AUDIO_BUDGET.essentialWarn)console.warn('Audio is above the warning budget.');}
