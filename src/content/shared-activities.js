const shared=(label,objects,need,memory,animation)=>({label,objects,need,memory,animation,duration:45,family:'Shared',affinity:7,trust:4,channels:['in_person'],cooldown:30});
export const SHARED_ACTIVITIES=Object.freeze({
 shared_sit:shared('Sit and chat',['sofa'],'social','relaxed_together','Sit'),
 shared_watch:shared('Watch TV together',['tv'],'fun','watched_show_together','Sit'),
 shared_eat:shared('Eat together',['table'],'hunger','shared_meal','Eat'),
 shared_cook:shared('Cook together',['stove'],'hunger','cooked_together','Eat'),
 shared_read:shared('Read and discuss books',['bookcase'],'fun','good_hangout','Idle')
});
