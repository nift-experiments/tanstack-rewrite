import {refreshBuildDependencies} from './refresh-build-dependencies.mjs';
import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
function run(command,args){const result=spawnSync(command,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
const nift=process.env.NIFT_BIN??'nift';
// Route discovery bootstraps through the same native compiler/post producers.
if(!fs.existsSync('.work/corpus-manifest.json')||!JSON.parse(fs.readFileSync('.nift/tracked.json')).tracked.some(item=>item.name==='_build/preparation')){refreshBuildDependencies();run(nift,['build','_build/frontend','_build/posts']);run(process.execPath,['scripts/generate-corpus.mjs','--prepare-only']);}
refreshBuildDependencies();
const args=process.argv.slice(2);
// Nift decides invalidation. Preparation can discover routes, so complete its
// native DAG before a second Nift process loads the publication tracking graph.
// Do not derive freshness independently from source mtimes or content hashes.
if(!args.length){const status=spawnSync(nift,['status','-p'],{encoding:'utf8',maxBuffer:64*1024*1024});if(status.status!==0){process.stderr.write(status.stderr??'');if(status.error)console.error(status.error);process.exit(status.status??1)}const pending=status.stdout.replace(/\x1b\[[0-9;]*m/g,'').split('\n');if(pending.some(name=>['_build/frontend','_build/posts','_build/preparation'].includes(name.trim())))run(nift,['build','_build/preparation']);}
if(args.includes('--repair')){
 // A repair reconstructs native state but preparation may add tracked routes.
 // Reload that declared graph in a second native process. Retry a failed first
 // pass only when preparation actually changed the tracked declarations;
 // the second native repair must succeed and remains the acceptance gate.
 const before=fs.readFileSync('.nift/tracked.json','utf8');
 const first=spawnSync(nift,['build',...args],{stdio:'inherit'});
 const changed=before!==fs.readFileSync('.nift/tracked.json','utf8');
 if(changed){console.log('Preparation changed the tracked publication graph; reloading it for native repair.');run(nift,['build',...args]);}
 else if(first.status!==0)process.exit(first.status??1);
}else run(nift,['build',...args]);
