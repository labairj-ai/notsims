import {inflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function readGLB(bytes){
 if(bytes.readUInt32LE(0)!==0x46546c67||bytes.readUInt32LE(4)!==2||bytes.readUInt32LE(8)!==bytes.length)throw Error('Invalid GLB');
 const length=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.subarray(20,20+length).toString());
 return {gltf,bin:bytes.subarray(28+length)};
}
// The pinned exporter emits non-interlaced 8-bit RGB/RGBA PNGs. Reject other
// encodings rather than silently sampling incorrect data. No browser/DOM needed.
export function decodePNG(bytes){
 if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Expected PNG');
 let width,height,channels;const chunks=[];
 for(let at=8;at<bytes.length;){const size=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8),data=bytes.subarray(at+8,at+8+size);at+=size+12;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);channels=data[9]===6?4:data[9]===2?3:0;if(data[8]!==8||!channels||data[10]||data[11]||data[12]||width*height>4194304)throw Error('Unsupported PNG encoding');}
  if(type==='IDAT')chunks.push(data);if(type==='IEND')break;
 }
 if(!width||!height||!channels)throw Error('Missing PNG header');
 const raw=inflateSync(Buffer.concat(chunks),{maxOutputLength:(width*channels+1)*height}),stride=width*channels;
 if(raw.length!==(stride+1)*height)throw Error('Invalid PNG scanlines');
 const pixels=Buffer.alloc(stride*height),paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];if(filter>4)throw Error('Invalid PNG filter');for(let x=0;x<stride;x++){const at=y*stride+x,a=x>=channels?pixels[at-channels]:0,b=y?pixels[at-stride]:0,c=y&&x>=channels?pixels[at-stride-channels]:0;pixels[at]=(raw[y*(stride+1)+x+1]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}}
 return {width,height,channels,pixels};
}
export function texturePixels(gltf,bin,material){
 const index=material.pbrMetallicRoughness?.baseColorTexture?.index;
 const image=gltf.images?.[gltf.textures?.[index]?.source],view=gltf.bufferViews?.[image?.bufferView];
 if(!image||!view||image.mimeType!=='image/png')throw Error(`Missing PNG texture: ${material.name}`);
 const encoded=bin.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength);
 return {...decodePNG(encoded),encoded};
}
export function neutralMetrics(image){
 const {width,height,channels,pixels}=image,values=[],alpha=Buffer.alloc(width*height);let maxChroma=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=y*width+x,at=p*channels,a=channels===4?pixels[at+3]:255;alpha[(height-1-y)*width+x]=a;if(a<=102)continue;
 const rgb=[pixels[at],pixels[at+1],pixels[at+2]];maxChroma=Math.max(maxChroma,Math.max(...rgb)-Math.min(...rgb));values.push((rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)/255);}
 if(!values.length)throw Error('No visible texture pixels');values.sort((a,b)=>a-b);
 return {width,height,visiblePixels:values.length,maxChroma,p05:values[Math.floor((values.length-1)*.05)],p95:values[Math.floor((values.length-1)*.95)],alphaSha256:sha256(alpha),textureSha256:sha256(image.encoded)};
}
export async function checkAppearance(root='assets'){
 const bytes=await readFile(`${root}/notsims-human.glb`),metadata=JSON.parse(await readFile(`${root}/character-metadata.json`,'utf8'));
 if(metadata.appearance?.exporterSha256!==sha256(await readFile(new URL('./export-character.py',import.meta.url))))throw Error('Character exporter fingerprint mismatch');
 return validateAppearance(bytes,metadata);
}
export function validateAppearance(bytes,metadata){
 const {gltf,bin}=readGLB(bytes),appearance=metadata.appearance;
 if(appearance?.version!==1||!appearance.hair||Object.keys(appearance.hair).sort().join()!=='curly,long,short')throw Error('Missing appearance metadata');
 const roles=new Set(['Notsims_Skin','Notsims_Shirt','Notsims_Trousers','Notsims_Shoes','Notsims_Eyes','Notsims_Hair_short','Notsims_Hair_long','Notsims_Hair_curly']);
 if(gltf.materials.length!==roles.size||new Set(gltf.materials.map(m=>m.name)).size!==roles.size)throw Error('Missing or duplicate material role');
 for(const m of gltf.materials)if(!roles.has(m.name))throw Error(`Unrecognized material role: ${m.name}`);
 const result={};
 for(const style of ['short','long','curly']){
  const name=`Notsims_Hair_${style}`,materials=gltf.materials.filter(m=>m.name===name);if(materials.length!==1)throw Error(`Missing/duplicate ${name}`);
  const m=materials[0],factor=m.pbrMetallicRoughness?.baseColorFactor??[1,1,1,1];
  if(factor.length!==4||factor.some(v=>v!==1))throw Error(`Hair base color must be white: ${style}`);
  const image=texturePixels(gltf,bin,m),metrics=neutralMetrics(image),expected=appearance.hair[style];
  if(image.channels!==4||metrics.maxChroma>1||metrics.p05<.59||metrics.p95-metrics.p05<.005)throw Error(`Hair texture must be light neutral detail: ${style}`);
  if(metrics.alphaSha256!==expected.alphaSha256||metrics.textureSha256!==expected.neutralTextureSha256||metrics.visiblePixels!==expected.visiblePixels||metrics.width!==expected.width||metrics.height!==expected.height)throw Error(`Hair texture/alpha provenance mismatch: ${style}`);
  if(!/^[a-f0-9]{64}$/.test(expected.sourceSha256)||expected.luminanceFloor!==.6)throw Error('Invalid hair source metadata');result[style]=metrics;
 }
 const skin=gltf.materials.find(m=>m.name==='Notsims_Skin');if(!skin)throw Error('Missing skin role');const factor=skin.pbrMetallicRoughness?.baseColorFactor??[1,1,1,1];if(factor.some(v=>v!==1)||neutralMetrics(texturePixels(gltf,bin,skin)).maxChroma>1)throw Error('Skin must remain neutral');
 return {assetSha256:sha256(bytes),bytes:bytes.length,hair:result};
}
if(process.argv[1]?.endsWith('/character-appearance.mjs'))console.log(JSON.stringify(await checkAppearance(process.argv[2]),null,2));
