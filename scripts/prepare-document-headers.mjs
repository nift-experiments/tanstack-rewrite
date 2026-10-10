import path from 'node:path';import {build} from 'esbuild';
export async function prepareDocumentHeaders(){await build({entryPoints:['publisher/document-headers.ts'],outfile:'.work/document-headers.mjs',bundle:true,platform:'node',format:'esm',packages:'external',alias:{'~':path.resolve('frontend/retained/src')}});return import('../.work/document-headers.mjs');}
