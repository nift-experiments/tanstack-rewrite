import {spawnSync} from 'node:child_process';
import {refreshBuildDependencies} from './refresh-build-dependencies.mjs';
// Explicit compiler/bootstrap command, using the same native producers as build.
refreshBuildDependencies();
const result=spawnSync(process.env.NIFT_BIN??'nift',['build','_build/frontend','_build/posts','_build/backend','_build/worker'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
