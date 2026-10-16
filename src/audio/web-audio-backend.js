// Browser adapter. No AudioContext, network request or media is created at startup.
export class WebAudioBackend {
 constructor({contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),mediaFactory=src=>new Audio(src),fetcher=(...args)=>fetch(...args),diagnose=()=>{}}={}){
  Object.assign(this,{contextFactory,mediaFactory,fetcher,diagnose});this.context=null;this.buses={};this.buffers=new Map();this.media=new Set();this.disposed=false;this.decodedBytes=0;this.maxDecodedBytes=8*1024*1024;
 }
 now(){return globalThis.performance.now()/1000;}
 async unlock(){
  if(this.disposed)return false;
  try{
   if(!this.context){const c=this.contextFactory();this.context=c;this.buses.master=c.createGain();this.buses.master.connect(c.destination);for(const name of ['music','sfx','ambience','ui']){this.buses[name]=c.createGain();this.buses[name].connect(this.buses.master);}}
   if(this.context.state!=='running')await this.context.resume();
   return this.context.state==='running';
  }catch(error){this.diagnose('unlock',error);return false;}
 }
 setBusGain(bus,value){const node=this.buses[bus];if(!node)return;node.gain.setTargetAtTime(value,this.context.currentTime,.025);}
 async load(asset){
  if(!this.context||this.disposed)throw Error('Audio is locked or disposed.');
  if(!this.buffers.has(asset.id))this.buffers.set(asset.id,(async()=>{const response=await this.fetcher(new URL('../../'+asset.src,import.meta.url));if(!response.ok)throw Error(`Audio fetch failed (${response.status}): ${asset.id}`);const buffer=await this.context.decodeAudioData(await response.arrayBuffer());if(this.disposed)throw Error('Audio disposed.');const bytes=buffer.length*buffer.numberOfChannels*4;if(this.decodedBytes+bytes>this.maxDecodedBytes)throw Error('Decoded audio memory budget exceeded.');this.decodedBytes+=bytes;return buffer;})());
  return this.buffers.get(asset.id);
 }
 async play(asset,{bus,gain,rate=1,loop=false,position,spatial=false,onEnded=()=>{},isActive=()=>true}){
  const buffer=await this.load(asset),c=this.context;if(this.disposed||c.state!=='running'||!isActive())return null;
  const source=c.createBufferSource(),volume=c.createGain();source.buffer=buffer;source.loop=loop;source.playbackRate.value=rate;volume.gain.value=gain;
  source.connect(volume);let pan=null;
  if(spatial&&position&&c.createStereoPanner){pan=c.createStereoPanner();pan.pan.value=Math.max(-1,Math.min(1,(position.x-9)/9));volume.connect(pan);pan.connect(this.buses[bus]);}else volume.connect(this.buses[bus]);
  let stopped=false;const stop=()=>{if(stopped)return;stopped=true;try{source.stop();}catch{}source.disconnect();volume.disconnect();pan?.disconnect();onEnded();};
  source.onended=stop;source.start();return {stop,setGain:value=>volume.gain.setTargetAtTime(value,c.currentTime,.03)};
 }
 startMusic(asset,{gain=0}={}){
  const c=this.context;if(!c)throw Error('Audio is locked.');
  const element=this.mediaFactory(new URL('../../'+asset.src,import.meta.url).href),source=c.createMediaElementSource(element),volume=c.createGain();
  element.loop=asset.loopable;element.preload='metadata';volume.gain.value=gain;source.connect(volume);volume.connect(this.buses.music);this.media.add(element);
  let stopped=false;
  const voice={stop:()=>{if(stopped)return;stopped=true;element.pause();element.removeAttribute('src');element.load();source.disconnect();volume.disconnect();this.media.delete(element);},setGain:(value,seconds=0)=>{volume.gain.cancelScheduledValues(c.currentTime);volume.gain.setValueAtTime(volume.gain.value,c.currentTime);volume.gain.linearRampToValueAtTime(value,c.currentTime+seconds);}};
  voice.ready=element.play().then(()=>{if(this.disposed||stopped){voice.stop();return false;}return true;}).catch(error=>{if(stopped||this.disposed)return false;voice.stop();throw error;});return voice;
 }
 dispose(){this.disposed=true;for(const media of this.media){media.pause();media.removeAttribute('src');media.load();}this.media.clear();this.buffers.clear();this.decodedBytes=0;this.context?.close().catch(()=>{});}
}
