export const SIZE = 18;
export const NEEDS = { hunger: ['Hunger', '◒'], energy: ['Energy', '☾'], hygiene: ['Hygiene', '♧'], bladder: ['Bladder', '◉'], fun: ['Fun', '✦'], social: ['Social', '♡'] };
export const CATALOG = [
  {id:'bed',name:'Sunday bed',category:'Bedroom',price:450,w:2,h:2,color:'#e5aa83',need:'energy',rate:1.3,duration:420,verb:'Sleep'},
  {id:'sofa',name:'Cloud sofa',category:'Living',price:280,w:2,h:1,color:'#91a899',need:'fun',rate:.8,duration:90,verb:'Unwind'},
  {id:'fridge',name:'Everyday fridge',category:'Kitchen',price:320,w:1,h:1,color:'#e1e9d6',need:'hunger',rate:2.8,duration:35,verb:'Make a meal',cost:8},
  {id:'stove',name:'Little chef stove',category:'Kitchen',price:260,w:1,h:1,color:'#e7dbc3',need:'hunger',rate:3.8,duration:30,verb:'Cook dinner',cost:12},
  {id:'toilet',name:'Porcelain throne',category:'Bathroom',price:150,w:1,h:1,color:'#eeeade',need:'bladder',rate:6,duration:18,verb:'Use bathroom'},
  {id:'shower',name:'Rain shower',category:'Bathroom',price:300,w:1,h:1,color:'#94bcc2',need:'hygiene',rate:4,duration:25,verb:'Take a shower'},
  {id:'tv',name:'Movie night TV',category:'Living',price:380,w:2,h:1,color:'#687b73',need:'fun',rate:1.8,duration:60,verb:'Watch a movie'},
  {id:'desk',name:'Studio desk',category:'Living',price:340,w:2,h:1,color:'#c6a47d',need:'fun',rate:1.1,duration:60,verb:'Practice a skill',skill:true},
  {id:'table',name:'Gathering table',category:'Kitchen',price:180,w:2,h:1,color:'#bd936d'},
  {id:'chair',name:'Oak chair',category:'Kitchen',price:55,w:1,h:1,color:'#c6a47d'},
  {id:'plant',name:'Happy monstera',category:'Decor',price:60,w:1,h:1,color:'#668968'},
  {id:'rug',name:'Terracotta rug',category:'Decor',price:95,w:2,h:2,color:'#cd896e',flat:true},
  {id:'lamp',name:'Paper lantern',category:'Decor',price:75,w:1,h:1,color:'#ecd6a3'},
  {id:'bookcase',name:'Story shelf',category:'Living',price:170,w:1,h:1,color:'#bc9670',need:'fun',rate:1.3,duration:60,verb:'Read a book',skill:true},
];
export const JOBS = [
 {id:'barista',name:'Neighborhood café',role:'Barista',icon:'☕',pay:22,hours:6,description:'Good coffee. Familiar faces. A fresh start.'},
 {id:'designer',name:'Little studio',role:'Designer',icon:'✎',pay:30,hours:7,description:'Turn a little creativity into a living.'},
 {id:'developer',name:'Bright ideas',role:'Developer',icon:'⌘',pay:38,hours:8,description:'Build something clever, one day at a time.'},
];
const clamp = (v,a=0,b=100)=>Math.max(a,Math.min(b,v));
export const key = (x,y)=>`${x},${y}`;
export const inside = (x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<SIZE&&y<SIZE;
export const itemDef = id=>CATALOG.find(d=>d.id===id);
export function dimensions(item){const d=itemDef(item.type);return item.rotation%2?[d.h,d.w]:[d.w,d.h];}
export function furniturePoint(f,lx,ly){const d=itemDef(f.type),[w,h]=dimensions(f),a=f.rotation*Math.PI/2,c=Math.cos(a),s=Math.sin(a);return [f.x+w/2+(lx-d.w/2)*c+(ly-d.h/2)*s,f.y+h/2-(lx-d.w/2)*s+(ly-d.h/2)*c];}
export function interactionTargets(f){
 const [w,h]=dimensions(f),d=itemDef(f.type),targets=[];
 if(['sofa','toilet'].includes(f.type)){
  for(let x=0;x<d.w;x++){const [wx,wy]=furniturePoint(f,x+.5,d.h+.5);targets.push([Math.floor(wx+1e-8),Math.floor(wy+1e-8)]);}
 }else{
  for(let x=f.x;x<f.x+w;x++)targets.push([x,f.y-1],[x,f.y+h]);
  for(let y=f.y;y<f.y+h;y++)targets.push([f.x-1,y],[f.x+w,y]);
 }
 return targets;
}
export function at(s,x,y,flat=false){return s.furniture.find(f=>{const [w,h]=dimensions(f);return !!itemDef(f.type).flat===flat&&x>=f.x&&y>=f.y&&x<f.x+w&&y<f.y+h;});}
export function edgeKey(x,y,nx,ny){return x===nx?`h:${x},${Math.max(y,ny)}`:`v:${Math.max(x,nx)},${y}`;}
export function blocked(s,x,y,nx,ny){return !inside(nx,ny)||!!at(s,nx,ny)||s.walls[edgeKey(x,y,nx,ny)]==='wall';}
export function pathTo(s,tx,ty){
 const start=[s.person.x,s.person.y], queue=[start], prev=new Map([[key(...start),null]]);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===tx&&y===ty){const path=[];let k=key(x,y);while(prev.get(k)!==null){path.unshift(k.split(',').map(Number));k=prev.get(k);}return path;}
 for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){const k=key(nx,ny);if(!prev.has(k)&&!blocked(s,x,y,nx,ny)){prev.set(k,key(x,y));queue.push([nx,ny]);}}}return null;
}
export function newGame(character={},empty=false){
 const s={version:1,money:empty?12000:6500,minutes:480,person:{name:'Alex Green',skin:'#c58b65',hair:'#49392e',shirt:'#d78261',style:'short',trait:'creative',x:8,y:10,...character},needs:Object.fromEntries(Object.keys(NEEDS).map(n=>[n,85])),floors:{},walls:{},furniture:[],job:null,shifts:0,skill:0,queue:[],activity:null,log:['A little plot. A lot of possibility. Welcome home.'],nextId:1,billsDay:0};
 if(!empty){for(let x=4;x<=12;x++)for(let y=3;y<=11;y++)s.floors[key(x,y)]=x<8?'wood':y<7?'sage':'tile';
 for(let x=4;x<=12;x++){s.walls[`h:${x},3`]='wall';s.walls[`h:${x},12`]=x===8?'door':'wall';}
 for(let y=3;y<=11;y++){s.walls[`v:4,${y}`]='wall';s.walls[`v:13,${y}`]='wall';}
 for(let y=3;y<8;y++)s.walls[`v:8,${y}`]=y===6?'door':'wall';
 for(const [type,x,y,rotation] of [['bed',4,3,0],['bookcase',6,3,0],['plant',4,6,0],['fridge',12,3,0],['stove',11,3,0],['table',9,5,0],['chair',11,5,0],['sofa',8,8,0],['tv',5,11,0],['rug',8,9,0],['toilet',12,8,0],['shower',12,10,0],['lamp',4,10,0]])s.furniture.push({id:s.nextId++,type,x,y,rotation});
 }return s;
}
export function canPlace(s,type,x,y,rotation=0){
 const d=itemDef(type);if(!d)return false;const [w,h]=dimensions({type,rotation});
 for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++){
 if(!inside(a,b)||!s.floors[key(a,b)]||at(s,a,b,!!d.flat)||(!d.flat&&s.person.x===a&&s.person.y===b))return false;
 if(!d.flat&&((a>x&&s.walls[`v:${a},${b}`])||(b>y&&s.walls[`h:${a},${b}`])))return false;
 }return true;
}
export function buy(s,type,x,y,rotation=0){const d=itemDef(type);if(!d||s.activity?.kind==='work'||s.queue.length||s.activity)return 'Finish or cancel your current action before furnishing.';if(s.money<d.price)return 'You need a little more money for that.';if(!canPlace(s,type,x,y,rotation))return 'Place it on a clear floor, away from walls and your character.';s.money-=d.price;s.furniture.push({id:s.nextId++,type,x,y,rotation});return null;}
export function room(s,x1,y1,x2,y2,floor='wood'){
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before building.';
 const left=Math.min(x1,x2),top=Math.min(y1,y2),right=Math.max(x1,x2),bottom=Math.max(y1,y2);
 if(!inside(left,top)||!inside(right,bottom))return 'Keep your home inside the plot.';
 if(right-left<2||bottom-top<2)return 'Drag a room at least 3 × 3 tiles.';
 const floors=[],walls=[];
 for(let x=left;x<=right;x++)for(let y=top;y<=bottom;y++)if(!s.floors[key(x,y)])floors.push(key(x,y));
 for(let x=left;x<=right;x++){walls.push(`h:${x},${top}`,`h:${x},${bottom+1}`);}for(let y=top;y<=bottom;y++){walls.push(`v:${left},${y}`,`v:${right+1},${y}`);}
 const fresh=walls.filter(k=>!s.walls[k]);
 // Prevent new perimeter walls from bisecting existing furniture.
 for(const f of s.furniture){if(itemDef(f.type).flat)continue;const [w,h]=dimensions(f);for(const e of fresh){const [axis,xy]=e.split(':'),[x,y]=xy.split(',').map(Number);if(axis==='v'?x>f.x&&x<f.x+w&&y>=f.y&&y<f.y+h:y>f.y&&y<f.y+h&&x>=f.x&&x<f.x+w)return 'Move furniture away from the new room edges first.';}}
 const cost=floors.length*12+fresh.length*18;if(s.money<cost)return `This room costs $${cost}. You need more funds.`;
 s.money-=cost;floors.forEach(k=>s.floors[k]=floor);fresh.forEach(k=>s.walls[k]='wall');
 // Every room gets a free entrance; existing walls may be converted to join rooms.
 s.walls[`h:${Math.floor((left+right)/2)},${bottom+1}`]='door';return null;
}
export function buildTile(s,tool,x,y,edge,floor='wood'){
 if(s.activity||s.queue.length)return 'Finish or cancel your current action before building.';
 if(!inside(x,y))return 'Choose a tile inside the plot.';
 if(tool==='floor'){if(s.floors[key(x,y)]===floor)return null;if(s.money<12)return 'A floor tile costs $12.';s.money-=12;s.floors[key(x,y)]=floor;}
 else if(tool==='wall'||tool==='door'){
 const [axis,xy]=edge.split(':'),[ex,ey]=xy.split(',').map(Number);
 if(!['h','v'].includes(axis)||!Number.isInteger(ex)||!Number.isInteger(ey)||ex<0||ey<0||ex>SIZE||ey>SIZE)return 'Choose a valid wall edge.';
 if(s.walls[edge]===tool)return null;
 for(const f of s.furniture){if(itemDef(f.type).flat)continue;const [w,h]=dimensions(f);if(axis==='v'?ex>f.x&&ex<f.x+w&&ey>=f.y&&ey<f.y+h:ey>f.y&&ey<f.y+h&&ex>=f.x&&ex<f.x+w)return 'This edge runs through furniture.';}
 const cost=tool==='wall'?18:35;if(s.money<cost)return 'You need more funds.';s.money-=cost;s.walls[edge]=tool;
 }else if(tool==='erase'){
 const f=at(s,x,y)||at(s,x,y,true);if(f){s.furniture=s.furniture.filter(i=>i.id!==f.id);s.money+=Math.floor(itemDef(f.type).price*.65);}
 else if(s.walls[edge]){delete s.walls[edge];s.money+=8;}
 else if(s.floors[key(x,y)]){delete s.floors[key(x,y)];s.money+=5;}
 }return null;
}
export function log(s,message){s.log.unshift(message);s.log=s.log.slice(0,12);}
export function enqueue(s,action){if(s.queue.length>=5)return 'Your queue is full. Let life catch up.';if(s.activity?.kind==='work')return 'You are at work. Your home will be here when you return.';s.queue.push(action);return null;}
export function cancel(s){if(s.activity?.kind==='work')log(s,'Left work early. No pay for an unfinished shift.');s.activity=null;s.queue=[];}
function begin(s,a){
 if(a.kind==='walk'){const path=pathTo(s,a.x,a.y);if(path===null){log(s,'That spot is blocked. Try adding a door or clearing a path.');return;}s.activity={...a,path,label:'Taking a little walk',elapsed:0,total:Math.max(1,path.length*2)};return;}
 if(a.kind==='use'){
 const f=s.furniture.find(f=>f.id===a.id);if(!f)return;const d=itemDef(f.type);if(!d.need)return;
 if(s.money<(d.cost||0)){log(s,'Not enough money for that meal. Try a free snack.');return;}
 const targets=interactionTargets(f);
 const paths=targets.map(([x,y])=>pathTo(s,x,y)).filter(p=>p!==null).sort((a,b)=>a.length-b.length);if(!paths.length){log(s,'Cannot reach that furniture. Clear a path to one of its sides.');return;}
 s.money-=d.cost||0;s.activity={...a,path:paths[0],label:d.verb,need:d.need,rate:d.rate,total:d.duration,elapsed:0,skill:!!d.skill};return;
 }
 const actions={snack:{label:'Having a free snack',need:'hunger',rate:1.6,total:20},nap:{label:'Napping on the grass',need:'energy',rate:.7,total:90},chat:{label:'Calling a friend',need:'social',rate:1.8,total:40},stretch:{label:'Taking a breather',need:'fun',rate:1.1,total:30}};
 if(actions[a.kind])s.activity={...a,...actions[a.kind],elapsed:0,path:[]};
 if(a.kind==='work'){
 const j=JOBS.find(j=>j.id===s.job);if(!j)return;
 if(s.needs.energy<15){log(s,'Get some rest before starting a shift.');return;}
 s.activity={kind:'work',label:`Working · ${j.role}`,elapsed:0,total:j.hours*60,pay:Math.round(j.pay*j.hours*(1+Math.floor(s.shifts/3)*.15+s.skill*.005)),path:[]};log(s,`Off to ${j.name.toLowerCase()}. Payday in ${j.hours} hours.`);
 }
}
export function tick(s,dt){
 if(!Number.isFinite(dt)||dt<=0)return;
 // Small steps keep movement, need recovery, jobs, and bills identical at every speed.
 for(let remaining=Math.min(dt,1440);remaining>0;){const step=Math.min(1,remaining);remaining-=step;s.minutes+=step;
 const decay={hunger:.055,energy:.037,hygiene:.033,bladder:.065,fun:.032,social:.028};
 for(const n of Object.keys(NEEDS)){let factor=s.person.trait==='social'&&n==='social'?.7:s.person.trait==='active'&&n==='energy'?.8:1;s.needs[n]=clamp(s.needs[n]-decay[n]*step*factor);}
 const day=Math.floor(s.minutes/1440);if(day>s.billsDay){s.billsDay=day;if(day%3===0){const bill=75+Math.floor(s.furniture.length*2);s.money-=bill;log(s,`Household bills: $${bill}. A new day begins.`);}}
 if(!s.activity&&s.queue.length)begin(s,s.queue.shift());const a=s.activity;if(!a)continue;
 if(a.path?.length){a.walkClock=(a.walkClock||0)+step;if(a.walkClock>=2-1e-9){a.walkClock=Math.max(0,a.walkClock-2);const [x,y]=a.path.shift();if(blocked(s,s.person.x,s.person.y,x,y)){log(s,'The path changed. Action cancelled.');s.activity=null;continue;}s.person.x=x;s.person.y=y;}if(a.kind!=='walk')continue;}
 if(a.kind==='walk'){a.elapsed+=step;if(!a.path.length)s.activity=null;continue;}
 a.elapsed+=step;
 if(a.need)s.needs[a.need]=clamp(s.needs[a.need]+a.rate*step*(s.person.trait==='creative'&&a.skill?1.2:1));
 if(a.kind==='work'){s.needs.energy=clamp(s.needs.energy-.025*step);s.needs.social=clamp(s.needs.social+.08*step);}
 if(a.elapsed>=a.total||(a.need&&s.needs[a.need]>=99)){
 if(a.kind==='work'){s.money+=a.pay;s.shifts++;log(s,`Shift complete. Earned $${a.pay}!${s.shifts%3===0?' Promotion! Your hourly rate increased.':''}`);}
 if(a.skill){s.skill=clamp(s.skill+1);log(s,'A little practice goes a long way. Skill +1.');}
 s.activity=null;
 }
 }
}
export function mood(s){const avg=Object.values(s.needs).reduce((a,b)=>a+b,0)/6;return avg>75?'Feeling lovely':avg>50?'Doing alright':avg>25?'Could use some care':'Needs a little love';}
export function validateSave(raw){
 const s=typeof raw==='string'?JSON.parse(raw):structuredClone(raw);const finite=n=>typeof n==='number'&&Number.isFinite(n);
 if(!s||s.version!==1||!finite(s.money)||!finite(s.minutes)||s.minutes<0||!s.person||typeof s.person.name!=='string'||s.person.name.length>40||!inside(s.person.x,s.person.y))throw Error('This is not a valid Notsims save.');
 for(const c of ['skin','hair','shirt'])if(!/^#[0-9a-f]{6}$/i.test(s.person[c]))throw Error('Invalid character color.');
 if(!['short','long','curly'].includes(s.person.style)||!['creative','active','social'].includes(s.person.trait))throw Error('Invalid character.');
 if(!s.needs||Object.keys(NEEDS).some(k=>!finite(s.needs[k])||s.needs[k]<0||s.needs[k]>100))throw Error('Invalid needs.');
 if(!Array.isArray(s.furniture)||s.furniture.length>SIZE*SIZE*2||!s.floors||!s.walls)throw Error('Invalid house.');
 for(const [k,f] of Object.entries(s.floors)){const [x,y]=k.split(',').map(Number);if(!inside(x,y)||!['wood','tile','sage'].includes(f))throw Error('Invalid floor.');}
 for(const [k,v] of Object.entries(s.walls)){const m=/^([hv]):(\d+),(\d+)$/.exec(k);if(!m||+m[2]>SIZE||+m[3]>SIZE||!['wall','door'].includes(v))throw Error('Invalid wall.');}
 const ids=new Set();for(const f of s.furniture){if(!itemDef(f.type)||!inside(f.x,f.y)||![0,1,2,3].includes(f.rotation)||!Number.isInteger(f.id)||ids.has(f.id))throw Error('Invalid furniture.');const [w,h]=dimensions(f);if(!inside(f.x+w-1,f.y+h-1))throw Error('Furniture outside plot.');ids.add(f.id);}
 if(s.job!==null&&!JOBS.some(j=>j.id===s.job))throw Error('Invalid career.');
 if(!finite(s.shifts)||s.shifts<0||!finite(s.skill)||s.skill<0||s.skill>100||!Number.isInteger(s.billsDay)||s.billsDay<0)throw Error('Invalid progress.');
 if(!Array.isArray(s.log)||!s.log.every(t=>typeof t==='string'))s.log=[];
 s.log=s.log.slice(0,12).map(t=>t.slice(0,200));s.person.name=s.person.name.trim()||'Alex';
 // Rebuild transient paths after loading; preserve only legitimate work progress.
 if(s.activity?.kind==='work'){
 const a=s.activity,j=JOBS.find(j=>j.id===s.job);if(!j||!finite(a.elapsed)||a.elapsed<0||a.elapsed>=j.hours*60)throw Error('Invalid work progress.');
 s.activity={kind:'work',label:`Working · ${j.role}`,elapsed:a.elapsed,total:j.hours*60,pay:Math.round(j.pay*j.hours*(1+Math.floor(s.shifts/3)*.15+s.skill*.005)),path:[]};
 }else s.activity=null;
 s.queue=[];s.nextId=Math.max(0,...ids)+1;return s;
}
