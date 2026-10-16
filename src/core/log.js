export function log(s,message){s.log.unshift(message);s.log=s.log.slice(0,12);}
