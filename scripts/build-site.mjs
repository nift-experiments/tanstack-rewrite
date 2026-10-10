import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
function run(command,args){const result=spawnSync(command,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
// Route-graph discovery is a bootstrap step; normal builds use the Nift DAG.
if(!fs.existsSync('.work/corpus-manifest.json')||!JSON.parse(fs.readFileSync('.nift/tracked.json')).tracked.some(item=>item.name==='_build/preparation')){run('npm',['run','local:prepare']);run(process.execPath,['scripts/generate-corpus.mjs','--prepare-only']);}
const nift=path.resolve('../tanstack-rewrite-baseline/toolchain/nift-v4.10.0'),args=process.argv.slice(2);
// Nift decides invalidation. Preparation can discover routes, so complete its
// native DAG before a second Nift process loads the publication tracking graph.
// Do not derive freshness independently from source mtimes or content hashes.
if(!args.length){const status=spawnSync(nift,['status','-p'],{encoding:'utf8'});if(status.status!==0){process.stderr.write(status.stderr);process.exit(status.status??1)}const pending=status.stdout.replace(/\x1b\[[0-9;]*m/g,'').split('\n');if(pending.some(name=>['_build/frontend','_build/posts','_build/preparation'].includes(name.trim())))run(nift,['build','_build/preparation']);}
run(nift,['build',...args]);
