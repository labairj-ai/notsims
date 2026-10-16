import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../src/game/session.js';
import {SIZE,inside,edgeKey} from '../src/core/grid.js';
import {pathTo,blocked} from '../src/core/navigation.js';
import {interactionTargets,dimensions} from '../src/systems/objects/geometry.js';

test('navigation preserves bounds, BFS ordering, walls, doors, rugs and unreachable targets',()=>{
 const s=newGame({},true);s.person.x=0;s.person.y=0;
 assert.equal(inside(SIZE,0),false);assert.equal(inside(.5,0),false);
 assert.deepEqual(pathTo(s,1,1),[[1,0],[1,1]]);
 assert.deepEqual(pathTo(s,0,0),[]);assert.equal(pathTo(s,-1,0),null);
 const edge=edgeKey(0,0,1,0);s.walls[edge]='wall';assert.equal(blocked(s,0,0,1,0),true);
 s.walls[edge]='door';assert.equal(blocked(s,0,0,1,0),false);
 s.furniture.push({id:1,type:'rug',x:1,y:0,rotation:0});assert.equal(blocked(s,0,0,1,0),false);
 s.furniture.push({id:2,type:'chair',x:1,y:0,rotation:0});assert.equal(blocked(s,0,0,1,0),true);
 s.walls['h:0,1']='wall';assert.equal(pathTo(s,1,1),null);
});
test('oriented seat targets follow all four rotations',()=>{
 const expected=[[[4,5],[5,5]],[[5,5],[5,4]],[[5,3],[4,3]],[[3,4],[3,5]]];
 for(let rotation=0;rotation<4;rotation++){
  const f={type:'sofa',x:4,y:4,rotation};
  // Front side rotates clockwise in simulation coordinates.
  const targets=interactionTargets(f),[w,h]=dimensions(f);
  assert.deepEqual(targets,expected[rotation]);
  assert.equal(targets.length,2);assert.ok(targets.every(([x,y])=>x<4||y<4||x>=4+w||y>=4+h));
  assert.ok(targets.every(t=>t.every(Number.isInteger)));
 }
 assert.deepEqual(interactionTargets({type:'sofa',x:4,y:4,rotation:0}),[[4,5],[5,5]]);
});
