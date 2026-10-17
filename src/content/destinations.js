export const DESTINATIONS=Object.freeze([
 {id:'creative_class',label:'Creative Workshop',cost:250,duration:120,awayPolicy:'school',effects:{skill:3},travel:0},
 {id:'coding_class',label:'Coding Bootcamp',cost:400,duration:180,awayPolicy:'school',effects:{skill:5},travel:0},
 {id:'fitness_class',label:'Fitness Class',cost:150,duration:60,awayPolicy:'school',effects:{skill:2,fun:10},travel:0},
 {id:'cooking_class',label:'Cooking Class',cost:200,duration:120,awayPolicy:'school',effects:{skill:3},travel:0},
 {id:'errand',label:'Grocery errand',cost:35,duration:45,awayPolicy:'appointment',effects:{hunger:20},travel:30},
 {id:'appointment',label:'Wellness appointment',cost:100,duration:60,awayPolicy:'appointment',effects:{hygiene:25,fun:10},travel:30},
 {id:'day_trip',label:'Museum day trip',cost:80,duration:240,awayPolicy:'travel',effects:{fun:45,social:15},travel:90}
]);
export const destinationDef=id=>DESTINATIONS.find(d=>d.id===id);
