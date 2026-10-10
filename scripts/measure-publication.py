"""Measure one authorized publication command; raw output stays outside evidence.

GNU time's maximum is an individual process/phase high-water mark. Sampled
RSS sums descendants, counts shared pages, and can miss between-sample peaks.
Persistent preview/database services are not descendants and are excluded.
"""
import argparse,json,os,pathlib,subprocess,time
p=argparse.ArgumentParser();p.add_argument('--cwd',required=True);p.add_argument('--output',required=True);p.add_argument('--label',required=True);p.add_argument('--scope',default='Integration diagnostic; parity/final benchmark gates remain separate');p.add_argument('command',nargs=argparse.REMAINDER);args=p.parse_args();command=args.command[1:] if args.command[:1]==['--'] else args.command
assert command
output=pathlib.Path(args.output).resolve();output.mkdir(parents=True,exist_ok=True)
log=output/(args.label+'.log');stat=output/(args.label+'.time');sample_interval=.05;peak=0;dominant=None;samples=0;individual_peak=0;individual_dominant=None;seen=set()
def identify(pid,entries):
 try: argv=pathlib.Path(f"/proc/{pid}/cmdline").read_bytes().decode(errors="replace").split("\0")
 except OSError: argv=[]
 joined=" ".join(argv);seen.update(arg for arg in argv if arg.startswith("scripts/"))
 phase="orchestration"
 for key,value in [("compile-parser","docs compiler"),("compile-document","docs compiler"),("probe-shell-build","frontend browser bundle"),("probe-publication-ssr","publication SSR bundle"),("probe-full-api-build","backend bundle"),("build-worker","worker bundle"),("generate-corpus","corpus preparation"),("prepare-posts","posts preparation")]:
  if key in joined: phase=value;break
 if entries[pid][2].startswith("nift"): phase="Nift build (may include producer children)"
 return {"pid":pid,"rssKiB":entries[pid][1],"name":entries[pid][2],"phase":phase,"executable":pathlib.Path(argv[0]).name if argv else None}
with log.open('w') as stream:
 process=subprocess.Popen(['/usr/bin/time','-f','%e %M','-o',str(stat),*command],cwd=args.cwd,stdout=stream,stderr=subprocess.STDOUT);started=time.monotonic()
 while process.poll() is None:
  entries={}
  for file in pathlib.Path('/proc').glob('[0-9]*/status'):
   try:
    fields=dict(line.split(':',1) for line in file.read_text().splitlines() if ':' in line);entries[int(file.parent.name)]=(int(fields['PPid']),int(fields.get('VmRSS','0 kB').split()[0]),fields['Name'].strip())
   except (OSError,ValueError,KeyError):pass
  descendants={process.pid}
  while True:
   previous=len(descendants);descendants.update(pid for pid,(parent,_,_) in entries.items() if parent in descendants)
   if len(descendants)==previous:break
  rows=[identify(pid,entries) for pid in descendants if pid in entries]
  by_pid={r['pid']:r for r in rows}
  for row in rows:
   parent=entries[row['pid']][0];visited=set()
   while row['phase']=='orchestration' and parent in by_pid and parent not in visited:
    visited.add(parent);row['phase']=by_pid[parent]['phase'];parent=entries[parent][0]
  candidate=max(rows,key=lambda row:row['rssKiB'],default=None)
  if candidate and candidate['rssKiB']>individual_peak: individual_peak=candidate['rssKiB'];individual_dominant=candidate
  rss=sum(entries[pid][1] for pid in descendants if pid in entries)
  if rss>peak:
   peak=rss;dominant=candidate
  samples+=1;time.sleep(sample_interval)
 elapsed=time.monotonic()-started
lines=stat.read_text().splitlines();measured=lines[-1].split();receipt={'label':args.label,'command':command,'cwd':str(pathlib.Path(args.cwd).resolve()),'exitCode':process.returncode,'elapsedSeconds':float(measured[0]),'harnessElapsedSeconds':elapsed,'maximumIndividualProcessPhaseRssMiB':int(measured[1])/1024,'sampledDescendantRssMiB':peak/1024,'dominantAtSampledTreePeak':dominant,'dominantAtSampledIndividualPeak':individual_dominant,'observedProducerScripts':sorted(seen),'samples':samples,'targetSampleIntervalMs':50,'scope':args.scope,'limitations':['Maximum individual process/phase RSS is not aggregate tree memory.','Sampled descendant RSS sums shared pages and may miss brief peaks.','Persistent runtime services are excluded from publication commands.']}
(output/(args.label+'.json')).write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt));raise SystemExit(process.returncode)
