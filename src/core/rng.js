// Mulberry32: seed/state are unsigned 32-bit integers; output is in [0,1).
// Future random systems receive this object explicitly, never Math.random.
export function createRng(seed=0){
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw Error('Seed must be an unsigned 32-bit integer.');
 let state=seed;
 return {next(){state=(state+0x6d2b79f5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;},get state(){return state;}};
}
