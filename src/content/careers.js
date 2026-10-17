export const JOBS = [
 {id:'barista',name:'Neighborhood café',role:'Barista',icon:'☕',pay:22,hours:6,description:'Good coffee. Familiar faces. A fresh start.'},
 {id:'designer',name:'Little studio',role:'Designer',icon:'✎',pay:30,hours:7,description:'Turn a little creativity into a living.'},
 {id:'developer',name:'Bright ideas',role:'Developer',icon:'⌘',pay:38,hours:8,description:'Build something clever, one day at a time.'},
].map(j=>({...j,workDays:[0,1,2,3,4],startMinute:j.id==='barista'?420:540,performanceBaseline:50,performanceDrift:.04,levels:[0,1,2,3,4].map((level)=>({label:['Starter','Experienced','Specialist','Lead','Principal'][level],shifts:[0,3,12,30,60][level],skill:(j.id==='barista'?[0,0,5,15,30]:j.id==='designer'?[0,0,8,20,40]:[0,0,10,25,50])[level],performance:[0,60,68,72,75][level],payMultiplier:[1,1.35,1.8,2.6,4][level],baseline:50+level*5}))}));
