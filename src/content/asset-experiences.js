// These templates describe structure/experiences, never a second world simulation.
export const PROPERTY_TEMPLATES={
 starter_home:{id:'starter',zones:[[3,3,12,12,'wood']],room:null},
 larger_home:{id:'family-home',zones:[[2,2,14,13,'wood']],room:[9,3,13]},
 cabin:{id:'woodland-cabin',zones:[[5,4,8,8,'wood'],[5,12,8,2,'tile']],room:[9,5,10]},
 condo:{id:'city-condo',zones:[[5,3,7,11,'tile']],room:[9,4,12]},
 penthouse:{id:'skyline-terrace',zones:[[3,2,12,9,'sage'],[3,11,12,3,'tile']],room:[10,3,9]},
 estate:{id:'garden-estate',zones:[[2,2,14,12,'wood'],[2,14,14,2,'sage']],room:[10,3,12]},
 island:{id:'island-compound',zones:[[4,3,10,10,'wood'],[2,13,14,3,'tile'],[2,6,2,7,'sage']],room:[9,4,11]}
};
const activity=(id,label,duration,travel,cost,effects,social=false)=>({id,label,duration,travel,cost,effects,social});
export const ASSET_EXPERIENCES={
 cabin:[activity('woodland_hike','Woodland hike',180,60,0,{fun:25,skill:1})],
 condo:[activity('city_gallery','Walk to a city gallery',120,15,15,{fun:20})],
 penthouse:[activity('skyline_evening','Skyline evening with a friend',120,30,35,{fun:15,social:20},true)],
 estate:[activity('garden_retreat','Garden retreat',180,30,20,{fun:25,hygiene:10})],
 island:[activity('island_expedition','Island expedition',360,180,250,{fun:35,skill:2})],
 bicycle:[activity('local_cycle','Cycle the local trail',90,15,0,{fun:15,skill:1})],
 luxury_car:[activity('scenic_outing','Scenic drive with a friend',90,45,35,{fun:20},true)],
 ev:[activity('quiet_road_trip','Quiet countryside road trip',150,60,20,{fun:20})],
 sports_car:[activity('track_day','Track day',180,45,200,{fun:25,skill:1})],
 supercar:[activity('collectors_rally','Collectors’ rally',240,60,500,{fun:30,skill:1})],
 jet:[activity('international_escape','International escape',360,60,1500,{fun:35})],
 yacht:[activity('harbor_cruise','Harbor cruise with a friend',180,60,100,{fun:25,social:15},true)]
};
export const experienceFor=(definitionId,id)=>ASSET_EXPERIENCES[definitionId]?.find(x=>x.id===id);
export function createPropertyLot(definitionId){const t=PROPERTY_TEMPLATES[definitionId]??PROPERTY_TEMPLATES.larger_home,floors={},walls={};for(const [x,y,w,h,material] of t.zones)for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)floors[`${a},${b}`]=material;if(t.room){const [x,y,end]=t.room;for(let b=y;b<end;b++)walls[`v:${x},${b}`]=b===y+2?'door':'wall';}const [x,y]=Object.keys(floors)[0].split(',').map(Number);return {floors,walls,furniture:[],person:{x,y}};}
export function ownedActivityDefinition(d,id){
 if(id==='legacy_visit')return {id,label:`Visiting ${d.name}`,duration:240,travel:0,cost:0,effects:{fun:35,social:10}};
 if(d.kind==='business'&&id&&id!=='manage')return null;
 if(d.kind==='business')return {id:'manage',label:`Managing ${d.name}`,duration:d.managementDuration,travel:0,cost:0,effects:{}};
 const experience=experienceFor(d.id,id??ASSET_EXPERIENCES[d.id]?.[0]?.id);if(experience)return experience;
 if(d.tags.includes('travel')&&!id)return {id:'visit',label:`Visiting ${d.name}`,duration:240,travel:0,cost:0,effects:{fun:25,social:10}};
 if(id==='visit'&&d.tags.includes('travel'))return {id,label:`Visiting ${d.name}`,duration:240,travel:0,cost:0,effects:{fun:25,social:10}};
 return null;
}
