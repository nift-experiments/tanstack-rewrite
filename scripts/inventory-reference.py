"""Freeze and reconcile the observable source/reference inventory, without source translation."""
from pathlib import Path
import argparse,json,hashlib,re,shutil,subprocess
p=argparse.ArgumentParser();p.add_argument('--upstream',type=Path,required=True);p.add_argument('--baseline',type=Path,required=True);p.add_argument('--authored',type=Path,required=True);p.add_argument('--reference-copy',type=Path,required=True);a=p.parse_args();root=Path(__file__).resolve().parents[1];out=root/'evidence/r1';out.mkdir(exist_ok=True)
pin=subprocess.check_output(['git','rev-parse','HEAD'],cwd=a.upstream,text=True).strip();assert pin=='862ccc3d191818320c3e6d217542883f80cb907a';assert not subprocess.check_output(['git','status','--porcelain'],cwd=a.upstream,text=True)
s=json.loads((a.baseline/'surface-inventory.json').read_text());assert s['upstream_sha']==pin
text=(a.upstream/'src/routeTree.gen.ts').read_text().split('export interface FileRoutesByFullPath {',1)[1].split('\n}',1)[0];routes=re.findall(r"^  '([^']+)':",text,re.M);assert routes==s['route_patterns'] and len(routes)==314
for f,h in s['input_hashes'].items():assert hashlib.sha256((a.upstream/f).read_bytes()).hexdigest()==h,f
def classify(route):
 if route.startswith(('/api/','/.well-known/','/auth/','/oauth/')):return 'backend/service protocol'
 if route.startswith(('/admin','/account','/dashboard','/login','/chat-access')):return 'auth/session-sensitive application'
 if route.startswith(('/chat','/builder')):return 'complex client + backend application'
 if '/docs' in route:return 'documentation publication + client state'
 if route.endswith(('.xml','.txt','.json','.svg','.png','.md')):return 'generated/negotiated output'
 return 'public page/application route'
route_rows=[{'pattern':r,'classification':classify(r),'parameterized':('$' in r or '{' in r),'preserve':True,'status':'inventoried; concrete/state proof pending'} for r in routes]
(out/'route-contract-inventory.json').write_text(json.dumps({'pin':pin,'patterns':route_rows,'warning':'314 router pattern identities are not 314 static pages; parameter/query/auth state spaces require family-level and concrete-case contracts. No private route is silently excluded.'},indent=2)+'\n')
docs=json.loads((a.authored/'sources/docs-inputs.json').read_text());assert len(docs['files'])==7601;counts={'maintained_inputs':len(docs['files']),'render_candidates':sum(bool(x['render']) for x in docs['files']),'roots':len(docs['roots']),'nonempty_render_candidates':sum(bool(x['render']) and bool((a.authored/x['source']).read_text().strip()) for x in docs['files'])}
(out/'content-input-identities.json').write_text(json.dumps({'roots':docs['roots'],'files':[{k:v for k,v in f.items() if k!='source'} for f in docs['files']]},separators=(',',':'))+'\n')
(out/'source-surface.json').write_text(json.dumps(s,indent=2)+'\n')
if not a.reference_copy.exists():shutil.copytree(a.baseline/'reference-production-build1',a.reference_copy)
manifest={}
for f in sorted((a.baseline/'reference-production-build1').rglob('*')):
 if f.is_file():
  rel=f.relative_to(a.baseline/'reference-production-build1');h=hashlib.sha256(f.read_bytes()).hexdigest();assert hashlib.sha256((a.reference_copy/rel).read_bytes()).hexdigest()==h;manifest[str(rel)]={'sha256':h,'bytes':f.stat().st_size}
(out/'reference-output-manifest.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
for name in ['docs-tree-inventory.json','t7-route-plan.json','http-contract.json','dynamic-shell-contract.json','catalog-input-capture.json','catalog-runtime-extra-inputs.json']:
 shutil.copy2(a.baseline/name,out/name)
(out/'inventory-receipt.json').write_text(json.dumps({'upstream_pin':pin,'reference_output_files':len(manifest),'independent_reference_copy_byte_equal':True,'route_patterns':len(routes),'route_source_files':len(s['route_files']),**counts,'static_assets':len(s['static_assets']),'static_asset_bytes':s['static_asset_bytes'],'browser_reference_recapture':'pending; inherited evidence is provenance, not new visual certification','core_changed':False},indent=2)+'\n')
print(json.dumps(counts));print('Verified immutable independent reference copy and 314 route patterns')
