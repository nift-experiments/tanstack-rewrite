import {computeFrontendRelease} from './compute-frontend-release.mjs';
import fs from 'node:fs';import {spawn,spawnSync} from 'node:child_process';
// The document compilers establish their own inputs before publication targets.
for(const args of [['scripts/compile-parser.mjs'],['scripts/compile-document.mjs']]){const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
// Independent compiler targets own distinct output roots and manifests. No
// target consumes another target's output; preparation waits for all four.
const targets=[['scripts/probe-shell-build.mjs','--layout-proof'],['scripts/probe-publication-ssr.mjs','--layout-proof'],['scripts/probe-publication-ssr.mjs','--layout-proof','--preparation'],['scripts/probe-publication-ssr.mjs','--docs-preparation']];
const results=await Promise.all(targets.map(args=>new Promise(resolve=>{const child=spawn(process.execPath,args,{stdio:'inherit'});child.on('error',()=>resolve(1));child.on('close',code=>resolve(code??1))})));
if(results.some(code=>code!==0))process.exit(1);
fs.mkdirSync('public/_build',{recursive:true});fs.writeFileSync('public/_build/frontend.json',JSON.stringify({compiledAt:new Date().toISOString(),releaseId:computeFrontendRelease()}));
