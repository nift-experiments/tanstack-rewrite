"""Three-sample interim decision gate; never a final accepted benchmark."""
import json,os,pathlib,shutil,subprocess,sys,time
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'.work/performance-viability';out.mkdir(parents=True,exist_ok=True)
node=shutil.which('node');revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
measure=root/'scripts/measure-publication.py'
def run(label,cwd=root,args=()):
 print('START',label,flush=True)
 trace=out/(label+'.phases.jsonl');trace.write_text('');env={**os.environ,'NIFT_DIAGNOSTIC_TRACE':str(trace),'NODE_OPTIONS':'--import='+str(root/'scripts/measure-node-phase.mjs')}
 subprocess.run([sys.executable,str(measure),'--cwd',str(cwd),'--output',str(out),'--label',label,'--scope','Interim current full-site rewrite viability gate; not final parity-certified benchmark','--',node,'scripts/build-site.mjs',*args],check=True,env=env)
 r=json.loads((out/(label+'.json')).read_text());r['revision']=revision
 events=[json.loads(line) for line in trace.read_text().splitlines()];opened={};spans=[]
 for event in events:
  key=(event['pid'],event['phase'])
  if event['event']=='start':opened[key]=event['epochMs']
  elif key in opened:spans.append({'phase':event['phase'],'startMs':opened.pop(key),'endMs':event['epochMs']})
 r['phaseSpans']=spans
 producers={'frontend-producer','corpus-preparation','backend-producer','worker-producer','posts-producer'}
 exclusive=0
 for native in [v for v in spans if v['phase']=='Nift-build']:
  intervals=sorted((max(v['startMs'],native['startMs']),min(v['endMs'],native['endMs'])) for v in spans if v['phase'] in producers and v['endMs']>native['startMs'] and v['startMs']<native['endMs']);union=0;end=native['startMs']
  for lo,hi in intervals:union+=max(0,hi-max(lo,end));end=max(end,hi)
  exclusive+=native['endMs']-native['startMs']-union
 r['niftExclusiveWallSeconds']=exclusive/1000
 r['niftExclusiveWallScope']='Measured native build wall time excluding union of producer execution intervals; includes native dependency/cache/output work and orchestration; millisecond trace precision.'
 r['browserBundlingRan']=any(v['phase']=='browser-bundle' for v in spans);r['backendBuildRan']=any(v['phase'] in {'backend-producer','worker-producer'} for v in spans);r['niftBuildRan']=any(v['phase']=='Nift-build' for v in spans)
 text=(out/(label+'.log')).read_text()
 import re
 r['niftReportedBuildSeconds']=[float(v) for v in re.findall(r'time taken: ([0-9.]+) seconds',text)]
 r['scopeQualification']='Rewrite publishes complete static page corpus; upstream accepted docs refresh uses dynamic local R2 reads.'
 (out/(label+'.json')).write_text(json.dumps(r,indent=2)+'\n')
 print('DONE',label,r['elapsedSeconds'],r['maximumIndividualProcessPhaseRssMiB'],flush=True)
def edited(name,file,transform):
 p=root/file;original=p.read_bytes()
 try:
  for i in range(1,4):
   p.write_bytes(transform(original,i));run(f'{name}-{i}')
 finally:
  p.write_bytes(original)
  subprocess.run([node,'scripts/build-site.mjs'],cwd=root,stdout=(out/(name+'-restore.log')).open('w'),stderr=subprocess.STDOUT,check=True)
for i in range(1,4):run(f'warm-full-{i}',args=('--all',))
for i in range(1,4):run(f'unchanged-{i}')
edited('docs-edit',pathlib.Path('sources/docs/tanstack--query--main/docs/framework/react/overview.md'),lambda b,i:b+f'\nDiagnostic content revision {i}.\n'.encode())
edited('shared-layout',pathlib.Path('templates/site-page.html'),lambda b,i:b.replace(b'<body ',f'<!-- Shared publication layout revision {i} -->\n<body '.encode(),1))
edited('frontend-edit',pathlib.Path('frontend/home/HomePublication.tsx'),lambda b,i:b+f'\n// Diagnostic frontend source revision {i}.\n'.encode())
edited('backend-edit',pathlib.Path('services/backend/src/routes/robots[.]txt.ts'),lambda b,i:b+f'\n// Diagnostic backend source revision {i}.\n'.encode())
for i in range(1,4):
 stage=out/f'fresh-checkout-{i}'
 assert not stage.exists()
 stage.mkdir()
 archive=subprocess.Popen(['git','archive',revision],cwd=root,stdout=subprocess.PIPE)
 subprocess.run(['tar','-x','-C',str(stage)],stdin=archive.stdout,check=True);assert archive.wait()==0
 (stage/'node_modules').symlink_to(root/'node_modules',target_is_directory=True)
 try:run(f'fresh-{i}',cwd=stage)
 finally:shutil.rmtree(stage)
print('CAMPAIGN_COMPLETE',flush=True)
