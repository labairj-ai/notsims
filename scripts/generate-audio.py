"""Generate original CC0 audio; requires Python 3 and ffmpeg/libmp3lame."""
from pathlib import Path
import math,random,wave,struct,subprocess,json,tempfile
p=Path(__file__).resolve().parents[1];rate=22050;rng=random.Random(1364)
assets=[]
masters=tempfile.TemporaryDirectory(prefix="notsims-audio-")
def save(id,folder,samples,title,kind='sfx'):
 path=p/'assets/audio'/folder/(id+('.mp3' if kind=='music' else '.wav')); samples=[max(-.92,min(.92,v)) for v in samples]
 tmp=Path(masters.name)/(id+'.wav') if kind=='music' else path
 with wave.open(str(tmp),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
 if kind=='music':subprocess.run(['ffmpeg','-v','error','-y','-i',str(tmp),'-codec:a','libmp3lame','-b:a','64k',str(path)],check=True)
 entry=dict(id=id,src='assets/audio/'+str(path.relative_to(p/'assets/audio')),title=title,author='Notsims project',source='scripts/generate-audio.py',license='CC0-1.0',date='2026-10-16',originalFilename=path.name,modifications='Original deterministic synthesis; mono PCM16 22050 Hz'+('; MP3 64 kbit/s derivative' if kind=='music' else ''),duration=round(len(samples)/rate,4),bytes=path.stat().st_size,kind=kind)
 if kind=='music':entry.update(loopable=True,allowedStates={'little-morning':['menu','home.day'],'clover-walk':['home.day'],'porch-light':['home.evening']}[id],normalizationGain=1)
 assets.append(entry)
def tone(t,f):return math.sin(2*math.pi*f*t)
def effect(id,folder,dur,kind,freq=400):
 n=int(rate*dur);xs=[];low=0
 for i in range(n):
  t=i/rate;x=i/n;noise=rng.uniform(-1,1);low=.92*low+.08*noise
  env=min(1,t/.008)*min(1,(dur-t)/.025)
  if kind=='note':v=.26*math.exp(-x*5)*(tone(t,freq)+.25*tone(t,freq*2))
  elif kind=='chord':v=.16*math.exp(-x*4)*sum(tone(t,freq*f) for f in [1,1.25,1.5])
  elif kind=='wood':v=.24*math.exp(-x*16)*(low*2+tone(t,freq)*.45)
  elif kind=='fabric':v=.24*env*low*(.5+.5*tone(t,7))
  elif kind=='crunch':v=.16*noise*math.exp(-x*7)*(.5+.5*tone(t,38))
  elif kind=='door':v=.15*env*(tone(t,freq*(1+.5*x))*math.exp(-x*5)+low*1.8)
  elif kind=='water':v=.16*env*(noise*.45+low*2)*(.8+.2*tone(t,2))
  elif kind=='loop-water':v=.12*(noise*.45+low*2)*(.8+.2*tone(t,2))
  elif kind=='loop-fire':v=.08*(noise*.5+low)*(1+.3*tone(t,8))
  elif kind=='loop-tv':v=.055*(noise*.5+tone(t,110)*.25+tone(t,164.8)*.15)
  elif kind=='loop-keys':v=.13*noise*math.exp(-((t*7)%1)*18)+.06*tone(t,900)*math.exp(-((t*7)%1)*20)
  else:v=.10*low*env
  xs.append(v*env if not kind.startswith('loop-') else v)
 save(id,folder,xs,id.replace('-',' ').title())
for id,kind,f in [('select','note',660),('confirm','chord',440),('cancel','note',330),('error','note',180),('rotate','wood',520)]:effect(id,'sfx/ui',.18 if id!='confirm' else .45,kind,f)
for id,f in [('floor',180),('wall',130),('door-place',240),('place',210),('sell',440)]:effect(id,'sfx/build',.24,'wood' if id!='sell' else 'chord',f)
for id,kind,f,d in [('purchase','note',660,.25),('bill','note',220,.4),('payday','chord',523,.6),('promotion','chord',660,.9),('fabric','fabric',0,.45),('fridge','door',220,.55),('eat','crunch',0,.3),('flush','water',0,1.2),('page','fabric',0,.3),('switch','wood',900,.08),('water-start','water',0,.5),('water-stop','water',0,.35),('ignite','crunch',0,.3),('shower','loop-water',0,2),('stove','loop-fire',0,2),('tv','loop-tv',0,2),('typing','loop-keys',0,2)]:effect(id,'sfx/interactions',d,kind,f)
for surface,f in [('indoor',140),('outdoor',85)]:
 for v in range(2):effect('step-'+surface+'-'+str(v+1),'sfx/foley',.16,'wood' if surface=='indoor' else 'crunch',f+v*17)
effect('garden-breeze','ambience',4,'loop-breeze')
# Original gentle instrumental sketches, 16 bars at 96 BPM (40 seconds).
# No sampled music, borrowed melodies, voices or third-party source packs.
for id,title,transpose,melody in [('little-morning','Little Morning',0,[0,4,7,11,9,7,4,2]),('clover-walk','Clover Walk',2,[7,4,2,0,4,9,7,2]),('porch-light','Porch Light',-5,[4,2,0,7,9,4,2,0])]:
 dur=40;n=int(rate*dur);xs=[0.0]*n;beat=.625
 def note(start,length,midi,gain,soft=False):
  f=440*2**((midi-69)/12)
  for j in range(int(length*rate)):
   t=j/rate;env=min(1,t/.018)*math.exp(-t/(1.0 if soft else .38))*min(1,max(0,(length-t)/.08))
   xs[(int(start*rate)+j)%n]+=gain*env*(tone(t,f)+.18*tone(t,f*2)+.07*tone(t,f*3))
 chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]]
 for bar in range(16):
  chord=chords[bar%4]
  for q,m in enumerate(chord):note(bar*4*beat+q*.04,2.35,m+transpose,.045,True)
  for b in range(4):
   note((bar*4+b)*beat,.55,chord[(b+bar)%4]+12+transpose,.045)
   if b in [0,2]:note((bar*4+b)*beat,1.0,chord[0]-12+transpose,.05,True)
  if bar%2==0:
   for b in [0,1,2,3]:note((bar*4+b+.5)*beat,.6,60+transpose+melody[(bar//2+b)%len(melody)],.035)
 # Wrap note tails into the next phrase for a continuous loop; crossfade state changes.
 save(id,'music',xs,title,'music')
(p/'assets/audio/library.json').write_text(json.dumps({'version':1,'assets':assets},indent=2)+'\n')
(p/'src/audio/audio-library.js').write_text('// Generated by scripts/generate-audio.py; see assets/audio/library.json.\nexport const AUDIO_ASSETS='+json.dumps({a['id']:a for a in assets},indent=2)+';\n')
print('Created',len(assets),'original assets;',sum(a['bytes'] for a in assets),'bytes')

masters.cleanup()

# Restore the complete social extension after regenerating the base library.
import sys
subprocess.run([sys.executable,str(p/"scripts/generate-social-audio.py")],check=True)
