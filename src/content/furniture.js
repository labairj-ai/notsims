import {purchaseMetadata} from './purchases.js';
import {MEAL_PRICES} from './meals.js';
export const CATALOG = [
  {id:'bed',name:'Sunday bed',category:'Bedroom',price:450,w:2,h:2,color:'#e5aa83',need:'energy',rate:1.3,duration:420,verb:'Sleep'},
  {id:'sofa',name:'Cloud sofa',category:'Living',price:280,w:2,h:1,color:'#91a899',need:'fun',rate:.8,duration:90,verb:'Unwind'},
  {id:'fridge',name:'Everyday fridge',category:'Kitchen',price:320,w:1,h:1,color:'#e1e9d6',need:'hunger',rate:2.8,duration:35,verb:'Make a meal',cost:MEAL_PRICES.prepared},
  {id:'stove',name:'Little chef stove',category:'Kitchen',price:260,w:1,h:1,color:'#e7dbc3',need:'hunger',rate:3.8,duration:30,verb:'Cook dinner',cost:MEAL_PRICES.cooked},
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
const variants=[
 ['folding_chair','Folding chair','chair',35],['side_table','Small side table','table',50],['fan','Box fan','lamp',80,'fun',.5,'Cool off'],['microwave','Microwave','stove',180,'hunger',2.8,'Quick meal'],['used_desk','Used desk','desk',225],['laptop','Basic laptop','desk',700],
 ['espresso','Espresso machine','stove',850,'energy',.4,'Make coffee'],['dishwasher','Dishwasher','fridge',1100,'hygiene',.8,'Tidy kitchen'],['queen_bed','Queen bed','bed',1200],['large_tv','65-inch TV','tv',1500],['treadmill','Treadmill','desk',1600,'fun',1.2,'Exercise'],['sectional','Cloud+ Sectional','sofa',1800],['washer','Washer/dryer','fridge',2200,'hygiene',1.2,'Freshen clothes'],['gaming_pc','Gaming PC','desk',2500],['piano','Upright piano','desk',3500,'fun',1.4,'Practice piano'],['spa_shower','Spa shower','shower',4000],['hot_tub','Hot tub','sofa',5000,'fun',1,'Relax together'],['kitchen_package','Premium kitchen package','stove',7500],
 ['grand_piano','Grand piano','desk',18000,'fun',1.5,'Perform music'],['home_theater','Home theater','tv',25000],['chef_kitchen','Professional chef kitchen','stove',30000],['designer_collection','Designer room collection','sofa',40000],['original_art','Original artwork','bookcase',50000,'fun',1,'Admire art'],['pool','Swimming pool','rug',60000,'fun',1.5,'Swim']
];
for(const [id,name,baseId,price,need,rate,verb] of variants){const base=CATALOG.find(d=>d.id===baseId);const d={...base,id,name,price,recipe:baseId,...(need?{need,rate,verb,duration:60,cost:need==='hunger'?8:0}:{}),tags:['piano','grand_piano'].includes(id)?['music','shared']:['sectional','hot_tub','home_theater','pool'].includes(id)?['shared']:[],capacity:['sectional','hot_tub','pool'].includes(id)?4:2};CATALOG.push(d);}
for(let i=0;i<CATALOG.length;i++){const d=purchaseMetadata(CATALOG[i]);if(d.recipe){const base=CATALOG.find(b=>b.id===d.recipe);if(d.need&&d.need===base.need)d.rate=Math.min(d.rate*d.quality,base.rate*1.4);if(d.tier!=='entry')d.color=d.tier==='premium'?'#9a8064':'#8ba9ad';}if(['sofa','tv','table','stove','bookcase'].includes(d.id))d.tags=['shared'];if(d.id==='original_art')d.tags=['art','collection'];if(['piano','grand_piano','pool','hot_tub'].includes(d.id))d.interactions=[{id:'use',label:d.verb,need:d.need,rate:d.rate,total:d.duration,skill:['piano','grand_piano'].includes(d.id)},{id:'relax',label:d.id.includes('piano')?'Listen to music':'Relax',need:'fun',rate:.8,total:45}];if(d.id==='pool'){d.w=3;d.h=3;d.flat=false;}d.upkeep=d.id==='pool'?150:d.tier==='premium'?35:d.tier==='comfortable'?4:0;CATALOG[i]=d;}
export const itemDef = id=>CATALOG.find(d=>d.id===id);
