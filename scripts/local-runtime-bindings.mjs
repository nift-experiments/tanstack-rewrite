import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

// Local hosting only: actual owned workerd classes, never publication creation.
// Compiler and runtime resolve this project’s locked packages. HTTP responses
// crossing the workerd RPC realm are normalized at this hosting boundary.
export function nativeRpcResponse(value) {
  if(value instanceof Response || Object.prototype.toString.call(value)!=='[object Response]')return value;
  return new Response(value.body,{status:value.status,statusText:value.statusText,headers:value.headers});
}
export function nativeRpcNamespace(namespace) {
  const stubs=new WeakMap();
  const wrap=stub=>{
    if(stubs.has(stub))return stubs.get(stub);
    const wrapped=new Proxy(stub,{get(target,name){const value=Reflect.get(target,name,target);if(typeof value!=='function')return value;return async(...args)=>nativeRpcResponse(await Reflect.apply(value,target,args));}});
    stubs.set(stub,wrapped);return wrapped;
  };
  return new Proxy(namespace,{get(target,name){const value=Reflect.get(target,name,target);if(typeof value!=='function')return value;if(name==='get'||name==='getByName')return (...args)=>wrap(Reflect.apply(value,target,args));return value.bind(target);}});
}
export async function createLocalRuntimeBindings({stateRoot='.work/runtime-state/preview'}={}) {
  const requireRuntime=createRequire(path.resolve('package.json'));
  const {Miniflare,convertV4MiniflareOptions}=requireRuntime('miniflare');
  const artifact='.work/worker-runtime/entry.js';
  if(!fs.existsSync(artifact))throw Error('Worker artifact missing; run npm run build before serving');
  const names=['SESSION_SECRET','DATABASE_URL','ENCRYPTION_KEY','APP_MODE','INCLUDED_MODEL','KODY_ORIGIN','MCP_EGRESS_MODE','GITHUB_AUTH_TOKEN','GITHUB_WEBHOOK_SECRET','GITHUB_OAUTH_CLIENT_ID','GITHUB_OAUTH_CLIENT_SECRET','GOOGLE_OAUTH_CLIENT_ID','GOOGLE_OAUTH_CLIENT_SECRET','SHOPIFY_PRIVATE_STOREFRONT_TOKEN','RESEND_API_KEY','DISCORD_WEBHOOK_URL','SENTRY_DSN','TANSTACK_MCP_ENABLED_TOOLS','TANSTACK_LOCAL_REPOS_DIR'];
  const values=Object.fromEntries(names.filter(name=>process.env[name]!==undefined).map(name=>[name,process.env[name]]));
  const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,script:fs.readFileSync(artifact,'utf8'),compatibilityDate:'2026-06-19',compatibilityFlags:['nodejs_compat'],bindings:values,cf:false,host:'127.0.0.1',port:0,inspectorPort:0,durableObjects:{STREAMS:{className:'StreamObject',useSQLite:true},WORKSPACE_SYNC:{className:'WorkspaceSync',useSQLite:true},CONVERSATIONS:{className:'Conversation',useSQLite:true}},r2Buckets:['GITHUB_CONTENT_CACHE','NPM_DOWNLOAD_CACHE','BUILDER_PROJECTS','FILES'],workflows:{WORKFLOW_RUNS:{name:'rewrite-preview-workflows',className:'TanChatWorkflow'}},isolatedResourcePersistencePath:stateRoot+'/durable-objects',resourcePersistencePath:stateRoot+'/shared'}));
  try{await runtime.ready;const bindings=await runtime.getBindings();for(const name of ['STREAMS','WORKSPACE_SYNC','CONVERSATIONS'])bindings[name]=nativeRpcNamespace(bindings[name]);const pending=new Set();return {env:{...bindings,...values},context:{waitUntil(promise){const task=Promise.resolve(promise);pending.add(task);task.catch(error=>console.error('Background runtime task failed',error)).finally(()=>pending.delete(task))}},async dispose(){await Promise.allSettled([...pending]);await runtime.dispose()}}}catch(error){await runtime.dispose();throw error}
}
