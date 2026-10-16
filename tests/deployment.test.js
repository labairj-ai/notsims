import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

test('release verifier catches the production WAV MIME regression and stale bytes',()=>{
 const code=`import importlib.util
s=importlib.util.spec_from_file_location('verify','deploy/verify-release.py')
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
body=b'RIFF-example-WAVE'
m.verify_response('confirm.wav','audio/wav',body,body)
for name,kind,actual in [('confirm.wav','application/octet-stream',body),('audio-manager.js','text/html',body),('confirm.wav','audio/wav',b'stale')]:
 try:m.verify_response(name,kind,actual,body)
 except ValueError:pass
 else:raise AssertionError((name,kind,'accepted invalid response'))
`;
 const result=spawnSync('python3',['-c',code],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
});
