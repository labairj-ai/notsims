export const SIZE = 18;
export const key = (x,y)=>`${x},${y}`;
export const inside = (x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<SIZE&&y<SIZE;
export function edgeKey(x,y,nx,ny){return x===nx?`h:${x},${Math.max(y,ny)}`:`v:${Math.max(x,nx)},${y}`;}
