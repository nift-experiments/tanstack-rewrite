import fs from 'node:fs';import {spawnSync} from 'node:child_process';
for(const args of [['scripts/compile-parser.mjs'],['scripts/compile-document.mjs'],['scripts/probe-shell-build.mjs','--layout-proof'],['scripts/probe-publication-ssr.mjs','--layout-proof'],['scripts/probe-publication-ssr.mjs','--layout-proof','--preparation']]){const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
fs.mkdirSync('public/_build',{recursive:true});fs.writeFileSync('public/_build/frontend.json',JSON.stringify({compiledAt:new Date().toISOString()}));
