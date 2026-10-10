import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
// Dry-run is packaging, never deployment or account mutation.
const producer=spawnSync(process.execPath,['scripts/probe-full-api-build.mjs','--worker'],{stdio:'inherit'});if(producer.status!==0)process.exit(producer.status??1);
const result=spawnSync(process.execPath,[path.resolve('node_modules/wrangler/bin/wrangler.js'),'deploy','--dry-run','--tsconfig',path.resolve('services/worker/tsconfig.json'),'--config','services/worker/wrangler.jsonc','--outdir',path.resolve('.work/worker-runtime')],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});if(result.status!==0)process.exit(result.status??1);
fs.mkdirSync('public/_build',{recursive:true});fs.writeFileSync('public/_build/worker.json',JSON.stringify({compiled:true,packagingOnly:true}));
