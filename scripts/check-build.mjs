import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const root=resolve('dist'),seen=new Set();
async function visit(path){
 path=resolve(path);if(seen.has(path))return;seen.add(path);
 if(!path.startsWith(root+'/'))throw Error('Module escaped build directory: '+path);
 await stat(path);const text=await readFile(path,'utf8');
 if(!path.endsWith('.js'))return;
 for(const match of text.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)(['"])([^'"\n]+)\1/g)){
  const spec=match[2];let target;
  if(spec==='three')target=resolve(root,'vendor/three/three.module.js');
  else if(spec.startsWith('three/addons/'))target=resolve(root,'vendor/three/addons',spec.slice(13));
  else if(spec.startsWith('.'))target=resolve(dirname(path),spec);
  else continue;
  await visit(target);
 }
 for(const match of text.matchAll(/new URL\(['"]([^'"]+)['"],\s*import\.meta\.url\)/g))await stat(resolve(dirname(path),match[1]));
}
await visit(resolve(root,'src/main.js'));
const html=await readFile(resolve(root,'index.html'),'utf8');
if(!html.includes('type="importmap"'))throw Error('Missing browser import map');
await stat(resolve(root,'assets/CC0-1.0.txt'));await stat(resolve(root,'vendor/three/LICENSE'));
console.log(`Verified ${seen.size} packaged JS modules, character asset, import map, and licenses.`);

const manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
if(manifest.id!=='/notsims/'||manifest.start_url!=='/notsims/'||manifest.display!=='standalone'||manifest.orientation)throw Error('Invalid standalone mobile contract');
for(const icon of manifest.icons)await stat(resolve(root,icon.src));
console.log('Verified standalone manifest and icons.');
