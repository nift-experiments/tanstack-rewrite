import {build} from 'esbuild';import path from 'node:path';
await build({entryPoints:['publisher/upstream/src/utils/markdown/processor.ts'],bundle:true,outfile:'.work/parser.mjs',platform:'node',format:'esm',packages:'external',alias:{'~':path.resolve('publisher/upstream/src')}});
