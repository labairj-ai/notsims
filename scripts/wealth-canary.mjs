import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {runWealthCanary} from '../src/systems/economy/release-canary.js';
const fixture=JSON.parse(await readFile('tests/fixtures/save-v3.json','utf8'));
const hash=createHash('sha256');async function fingerprint(dir){for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const file=`${dir}/${entry.name}`;if(entry.isDirectory())await fingerprint(file);else {hash.update(file);hash.update(await readFile(file));}}}await fingerprint('src');await fingerprint('scripts');
const report={sourceFingerprint:hash.digest('hex'),worktreeDirty:!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim(),sourceSha:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),...runWealthCanary(fixture)};
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/wealth-canary.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
