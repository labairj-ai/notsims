export function mood(s){const avg=Object.values(s.needs).reduce((a,b)=>a+b,0)/6;return avg>75?'Feeling lovely':avg>50?'Doing alright':avg>25?'Could use some care':'Needs a little love';}
