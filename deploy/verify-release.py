"""Regression check: public release bytes, audio MIME types, and complete audio modules."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import argparse,urllib.request,json,hashlib

def verify_response(name,kind,body,expected):
    if body != expected:
        raise ValueError(f'Production differs from verified build: {name}')
    if name.endswith(('.mp3','.wav')) and not kind.startswith('audio/'):
        raise ValueError(f'Incorrect audio MIME type: {name}: {kind}')
    if name.endswith('.webmanifest') and 'manifest+json' not in kind:
        raise ValueError(f'Incorrect manifest MIME type: {kind}')
    if name.endswith('.png') and not kind.startswith('image/png'):
        raise ValueError(f'Incorrect icon MIME type: {name}: {kind}')
    if name.endswith('.js') and 'javascript' not in kind:
        raise ValueError(f'Incorrect JavaScript MIME type: {name}: {kind}')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base',required=True)
    parser.add_argument('--dist',required=True,type=Path)
    parser.add_argument('--report',required=True,type=Path)
    args=parser.parse_args();dist=args.dist.resolve();base=args.base.rstrip('/')+'/'
    paths=['manifest.webmanifest','assets/icons/icon-192.png','assets/icons/icon-512.png','src/mobile.css','src/ui/mobile.js','src/ui/gestures.js','index.html','src/main.js','src/settings/settings.js','src/ui/audio-settings.js','build-info.json','assets/audio/manifest.json']
    paths += [str(f.relative_to(dist)) for f in sorted((dist/'src/audio').glob('*.js'))]
    paths += [a['src'] for a in json.loads((dist/'assets/audio/library.json').read_text())['assets']]
    def check(name):
        try:
            with urllib.request.urlopen(base+name,timeout=30) as response:
                body=response.read();kind=response.headers.get('Content-Type','')
                if response.status != 200:raise ValueError(f'HTTP {response.status}')
                verify_response(name,kind,body,(dist/name).read_bytes())
                return dict(path=name,status=response.status,contentType=kind,bytes=len(body),sha256=hashlib.sha256(body).hexdigest())
        except Exception as error:return dict(path=name,error=str(error))
    with ThreadPoolExecutor(max_workers=6) as pool:report=list(pool.map(check,paths))
    args.report.write_text(json.dumps(report,indent=2)+'\n')
    failures=[r for r in report if 'error' in r]
    if failures:
        for failure in failures:print(f"FAIL {failure['path']}: {failure['error']}")
        raise SystemExit(1)
    print(f'PASS: {len(report)} public responses are HTTP 200, correct MIME, and byte-identical to the verified build.')
if __name__=='__main__':main()
