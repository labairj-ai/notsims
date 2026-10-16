import {CURRENT_SAVE_VERSION} from '../persistence/schema.js';
import {key} from '../core/grid.js';
import {initialNeeds,decayNeeds} from '../systems/needs/needs.js';
import {chargeBills} from '../systems/economy/bills.js';
import {advanceActions} from '../systems/actions/actions.js';
export function newGame(character={},empty=false){
 const s={version:CURRENT_SAVE_VERSION,money:empty?12000:6500,minutes:480,person:{name:'Alex Green',skin:'#c58b65',hair:'#49392e',shirt:'#d78261',style:'short',trait:'creative',x:8,y:10,...character},needs:initialNeeds(),floors:{},walls:{},furniture:[],job:null,shifts:0,skill:0,queue:[],activity:null,log:['A little plot. A lot of possibility. Welcome home.'],nextId:1,billsDay:0};
 if(!empty){for(let x=4;x<=12;x++)for(let y=3;y<=11;y++)s.floors[key(x,y)]=x<8?'wood':y<7?'sage':'tile';
 for(let x=4;x<=12;x++){s.walls[`h:${x},3`]='wall';s.walls[`h:${x},12`]=x===8?'door':'wall';}
 for(let y=3;y<=11;y++){s.walls[`v:4,${y}`]='wall';s.walls[`v:13,${y}`]='wall';}
 for(let y=3;y<8;y++)s.walls[`v:8,${y}`]=y===6?'door':'wall';
 for(const [type,x,y,rotation] of [['bed',4,3,0],['bookcase',6,3,0],['plant',4,6,0],['fridge',12,3,0],['stove',11,3,0],['table',9,5,0],['chair',11,5,0],['sofa',8,8,0],['tv',5,11,0],['rug',8,9,0],['toilet',12,8,0],['shower',12,10,0],['lamp',4,10,0]])s.furniture.push({id:s.nextId++,type,x,y,rotation});
 }return s;
}
export function tick(s,dt,events){
 if(!Number.isFinite(dt)||dt<=0)return;
 for(let remaining=Math.min(dt,1440);remaining>0;){const step=Math.min(1,remaining);remaining-=step;s.minutes+=step;decayNeeds(s,step);chargeBills(s,events);advanceActions(s,step,events);}
}
