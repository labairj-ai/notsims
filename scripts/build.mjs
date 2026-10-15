import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
import {vendor} from './vendor.mjs';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of ['index.html','favicon.svg'])await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});await copyFile('.nojekyll','dist/.nojekyll');
await cp('assets','dist/assets',{recursive:true});await vendor('dist/vendor');
await import('./check-build.mjs');
console.log('Notsims built in dist/');
