export const flush=()=>new Promise(resolve=>setImmediate(resolve));
export class FakeAudioBackend {
 constructor(){this.time=0;this.calls=[];this.gains={};this.loaded=[];this.active=new Set();this.music=new Set();this.available=true;this.decodeFails=false;this.musicFails=false;this.delay=null;}
 now(){return this.time;}
 async unlock(){this.calls.push('unlock');return this.available;}
 setBusGain(bus,gain){this.gains[bus]=gain;}
 async load(asset){this.loaded.push(asset.id);if(this.decodeFails)throw Error('decode failed');return {};}
 async play(asset,options){
  if(this.delay)await this.delay;
  if(options.isActive&&!options.isActive())return null;
  await this.load(asset);this.calls.push({id:asset.id,...options});
  const voice={stopped:false,stop:()=>{voice.stopped=true;this.active.delete(voice);options.onEnded?.();},setGain:()=>{}};this.active.add(voice);return voice;
 }
 startMusic(asset){this.calls.push({music:asset.id});const voice={gain:0,stopped:false,ready:this.musicFails?Promise.reject(Error('media failed')):Promise.resolve(true),setGain:value=>{voice.gain=value;},stop:()=>{voice.stopped=true;this.music.delete(voice);}};this.music.add(voice);return voice;}
 dispose(){for(const v of this.active)v.stop();for(const v of this.music)v.stop();this.disposed=true;}
}
