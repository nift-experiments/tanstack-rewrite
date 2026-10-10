import path from 'node:path';
import {build} from 'esbuild';
await build({entryPoints:['publisher/render-document.tsx'],outfile:'.work/render-document.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',define:{'__TANSTACK_ENABLE_IMAGE_TRANSFORMATIONS__':'true'},packages:'external',loader:{'.svg':'dataurl'},alias:{'~':path.resolve('publisher/upstream/src')}});
