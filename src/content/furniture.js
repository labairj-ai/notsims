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
export const itemDef = id=>CATALOG.find(d=>d.id===id);
