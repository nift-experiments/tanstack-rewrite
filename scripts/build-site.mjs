import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
function run(command,args){const result=spawnSync(command,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
// Route-graph discovery is a bootstrap step; normal builds use the Nift DAG.
if(!fs.existsSync('.work/corpus-manifest.json')||!JSON.parse(fs.readFileSync('.nift/tracked.json')).tracked.some(item=>item.name==='_build/preparation')){run('npm',['run','local:prepare']);run(process.execPath,['scripts/generate-corpus.mjs','--prepare-only']);}
run(path.resolve('../tanstack-rewrite-baseline/toolchain/nift-v4.10.0'),['build',...process.argv.slice(2)]);
