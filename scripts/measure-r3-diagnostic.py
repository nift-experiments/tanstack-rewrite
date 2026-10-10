import subprocess,time,pathlib,json,os,shutil
root=pathlib.Path(__file__).resolve().parent.parent
out=root.parent/'tanstack-rewrite-baseline'/'r3-diagnostic';out.mkdir(exist_ok=True)
pub=root/'.work/shell-publications';nift=str(root.parent/'tanstack-rewrite-baseline/toolchain/nift-v4.10.0')
records=[]
def measure(name,cmd,cwd,bundler):
 stat=out/(name+'.time');log=out/(name+'.log');peak=0;dominant=None;samples=0
 with log.open('w') as stream:
  p=subprocess.Popen(['/usr/bin/time','-f','%e %M','-o',str(stat),*cmd],cwd=cwd,stdout=stream,stderr=subprocess.STDOUT)
  start=time.monotonic()
  while p.poll() is None:
   procs={}
   for f in pathlib.Path('/proc').glob('[0-9]*/status'):
    try:
     fields=dict(line.split(':',1) for line in f.read_text().splitlines() if ':' in line)
     procs[int(f.parent.name)]=(int(fields['PPid']),int(fields.get('VmRSS','0 kB').strip().split()[0]),fields['Name'].strip())
    except (OSError,ValueError,KeyError):pass
   ids={p.pid};changed=True
   while changed:
    before=len(ids);ids.update(pid for pid,(parent,_,_) in procs.items() if parent in ids);changed=len(ids)!=before
   total=sum(procs.get(pid,(0,0,''))[1] for pid in ids)
   if total>peak:
    peak=total;dominant=max(({'pid':pid,'rss_kib':procs[pid][1],'name':procs[pid][2]} for pid in ids if pid in procs),key=lambda x:x['rss_kib'],default=None)
   samples+=1;time.sleep(.01)
  assert p.returncode==0,log.read_text()
 elapsed,maxrss=stat.read_text().strip().split()
 records.append(dict(scenario=name,elapsed_s=float(elapsed),max_process_phase_rss_mib=int(maxrss)/1024,sampled_tree_rss_mib=peak/1024,dominant_at_tree_peak=dominant,samples=samples,sample_interval_target_ms=10,browser_bundler=bundler,scope='R3 diagnostic only, incomplete product; not final site benchmark'))
measure('retained-browser-build',['node','scripts/probe-shell-build.mjs'],root,True)
for file in (pub/'rendered').glob('*.html'):os.utime(file,None)
measure('two-article-composition-all-inputs-touched',[nift,'build'],pub,False)
measure('two-article-composition-unchanged',[nift,'build'],pub,False)
source=root/'sources/representative/tanstack--query--overview.md';copy=out/'overview-edited.md';copy.write_text(source.read_text()+'\nDiagnostic content edit.\n')
js=out/'render-edit.mjs';js.write_text("import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {renderDocument} from "+json.dumps(str(root/'.work/render-document.mjs'))+";fs.writeFileSync("+json.dumps(str(pub/'rendered/overview.html'))+",await renderDocument(fs.readFileSync("+json.dumps(str(copy))+",'utf8'),'/query/latest/docs/framework/react/overview'));const r=spawnSync("+json.dumps(nift)+",['build'],{cwd:"+json.dumps(str(pub))+",stdio:'inherit'});process.exit(r.status??1)")
old=(pub/'rendered/overview.html').read_bytes()
try:measure('single-article-render-and-compose',['node',str(js)],root,False)
finally:(pub/'rendered/overview.html').write_bytes(old);subprocess.run([nift,'build'],cwd=pub,stdout=subprocess.DEVNULL,check=True)
result=dict(measured_at=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),node=subprocess.check_output(['node','--version'],text=True).strip(),records=records,not_meaningful=['warm full site publication','fresh application-state site publication','complete unchanged site command','backend-only build'],limitations=['Single diagnostic sample per phase','Only two article fragments, no complete SSR/layout/service/search pipeline','Sampled process-tree RSS sums shared pages and may miss short peaks; GNU time maximum is not aggregate memory','Browser build uses read-only frozen prototype dependencies'])
(out/'snapshot.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
