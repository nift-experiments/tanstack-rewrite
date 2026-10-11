// Diagnostic-only preload. No source invalidation, compiler options or outputs change.
import fs from 'node:fs';import path from 'node:path';import cp from 'node:child_process';import {syncBuiltinESMExports} from 'node:module';
const trace=process.env.NIFT_DIAGNOSTIC_TRACE;
if(trace){
 const script=path.basename(process.argv[1]??'');
 const phases={'build-frontend.mjs':'frontend-producer','generate-corpus.mjs':'corpus-preparation','probe-full-api-build.mjs':'backend-producer','build-worker.mjs':'worker-producer','prepare-posts.mjs':'posts-producer','compile-parser.mjs':'markdown-compiler','compile-document.mjs':'document-compiler','probe-shell-build.mjs':'browser-bundle','probe-publication-ssr.mjs':process.argv.includes('--docs-preparation')?'docs-preparation-SSR-bundle':process.argv.includes('--preparation')?'preparation-SSR-bundle':'request-SSR-bundle'};
 const emit=(event,phase,extra={})=>fs.appendFileSync(trace,JSON.stringify({event,phase,pid:process.pid,parentPid:process.ppid,epochMs:Date.now(),...extra})+'\n');
 if(phases[script]){emit('start',phases[script]);process.on('exit',code=>emit('end',phases[script],{exitCode:code}));}
 const original=cp.spawnSync;
 cp.spawnSync=function(command,args,options){const native=path.basename(String(command)).startsWith('nift');const build=native&&args?.[0]==='build';if(build)emit('start','Nift-build');try{return original.apply(this,arguments)}finally{if(build)emit('end','Nift-build')}};
 syncBuiltinESMExports();
}
