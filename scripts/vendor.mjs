import {mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
export async function vendor(target='vendor') {
  const files={
    'build/three.module.js':'three/three.module.js',
    'build/three.core.js':'three/three.core.js',
    'LICENSE':'three/LICENSE',
    'examples/jsm/loaders/GLTFLoader.js':'three/addons/loaders/GLTFLoader.js',
    'examples/jsm/utils/BufferGeometryUtils.js':'three/addons/utils/BufferGeometryUtils.js',
    'examples/jsm/utils/SkeletonUtils.js':'three/addons/utils/SkeletonUtils.js',
  };
  for(const [source,destination] of Object.entries(files)) {
    const path=resolve(target,destination);await mkdir(dirname(path),{recursive:true});
    await copyFile(resolve('node_modules/three',source),path);
  }
}
if(process.argv[1]===new URL(import.meta.url).pathname)await vendor();
