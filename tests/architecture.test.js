import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';

test('module graph is acyclic and domain leaves never import presentation or facade',()=>{
 const root=resolve('src'),graph=new Map();
 function visit(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){const path=resolve(dir,ent.name);if(ent.isDirectory())visit(path);else if(path.endsWith('.js')){const text=readFileSync(path,'utf8');const deps=[...text.matchAll(/(?:from\s*|import\s*\(\s*)['"](\.[^'"]+)['"]/g)].map(m=>resolve(dirname(path),m[1]));graph.set(path,deps);
 if(/src\/(core|content|systems|game|persistence)\//.test(path))assert.ok(!deps.some(d=>/src\/(ui|render)|src\/engine.js/.test(d)),path);
 if(path.endsWith('/scene3d.js'))assert.ok(!text.includes("from './render.js'"));
 }}}
 visit(root);const visiting=new Set(),done=new Set();function check(path){if(done.has(path))return;assert.ok(!visiting.has(path),`cycle: ${path}`);visiting.add(path);for(const dep of graph.get(path)??[])check(dep);visiting.delete(path);done.add(path);}for(const path of graph.keys())check(path);
});
