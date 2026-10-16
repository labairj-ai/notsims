export const SOCIAL_LIMITS=Object.freeze({people:8,relationships:36,memories:24,plans:12,presences:3,notifications:16,priors:16});
export const CHANNELS=Object.freeze({in_person:1,phone_call:.65,text:.3});
const action=(label,family,affinity,trust,need,extra={})=>({label,family,affinity,trust,need,duration:8,cooldown:12,channels:Object.keys(CHANNELS),...extra});
export const SOCIAL_ACTIONS=Object.freeze({
 greet:action('Introduce yourself','Introduction',4,1,6),
 interests:action('Ask about interests','Introduction',4,2,8),
 chat:action('Chat','Friendly',5,2,12),day:action('Ask about day','Friendly',4,2,10),
 joke:action('Tell a joke','Friendly',7,1,12,{uncertain:true,memory:'shared_laugh'}),
 compliment:action('Compliment','Friendly',6,2,8),share:action('Share an interest','Friendly',6,2,10),
 encourage:action('Encourage','Friendly',5,4,10),know:action('Get to know','Deepening',6,4,12),
 confide:action('Confide','Deepening',8,7,15,{minTrust:15,memory:'confided_secret'}),
 advice:action('Ask advice','Deepening',5,5,12),news:action('Share good news','Deepening',6,3,10),
 disagree:action('Disagree','Conflict',-5,-1,6),argue:action('Argue','Conflict',-18,-7,8,{memory:'argument'}),
 insult:action('Insult','Conflict',-25,-10,3,{memory:'insulted'}),confront:action('Confront','Conflict',-12,-5,6),
 apologize:action('Apologize','Repair',10,5,8,{memory:'apology_accepted'}),
 clear:action('Clear the air','Repair',8,4,10),amends:action('Make amends','Repair',10,7,10,{minTrust:5})
});
export const TIERS=Object.freeze({friend:{familiarity:30,affinity:25,trust:15},close:{familiarity:55,affinity:50,trust:40},best:{familiarity:80,affinity:75,trust:65}});
const names=['Maya Hart','Theo Reed','June Moss','Finn Brooks','Riley Stone','Ada Bloom','Sam Vale'];
export function starterPeople(){return Object.fromEntries(names.map((name,i)=>{const id=`person_${i+1}`;return [id,{id,name,skin:['#c58b65','#9b6545','#e1b99a'][i%3],hair:['#49392e','#29252b','#a66d3d'][i%3],shirt:['#d78261','#809b87','#8793af'][i%3],style:['curly','short','long'][i%3],trait:['creative','social','active'][i%3],socialStyle:['warm','reserved','playful','blunt'][i%4],interests:[['books','cooking'],['gardening','books'],['music','games'],['games','fitness'],['fitness','cooking'],['art','music'],['art','books']][i],role:i===0?'old_friend':i===6?'coworker':'neighbor',availabilityProfile:i===0?'flexible':i%2?'day_evening':'evening'}];}));}
