import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

// Local hosting only: actual owned workerd classes, never publication creation.
// Dependency isolation is tracked separately; this bridge currently uses the
// pinned campaign runtime, matching the backend compiler.
export async function createLocalRuntimeBindings() {
  const requireRuntime=createRequire(path.resolve('../tanstack/runtime/package.json'));
  const {Miniflare,convertV4MiniflareOptions}=requireRuntime('miniflare');
  const artifact='.work/worker-runtime/entry.js';
  if(!fs.existsSync(artifact))throw Error('Worker artifact missing; run npm run build before serving');
  const names=['SESSION_SECRET','DATABASE_URL','ENCRYPTION_KEY','APP_MODE','INCLUDED_MODEL','KODY_ORIGIN','MCP_EGRESS_MODE','GITHUB_AUTH_TOKEN','GITHUB_WEBHOOK_SECRET','GITHUB_OAUTH_CLIENT_ID','GITHUB_OAUTH_CLIENT_SECRET','GOOGLE_OAUTH_CLIENT_ID','GOOGLE_OAUTH_CLIENT_SECRET','SHOPIFY_PRIVATE_STOREFRONT_TOKEN','RESEND_API_KEY','DISCORD_WEBHOOK_URL','SENTRY_DSN','TANSTACK_MCP_ENABLED_TOOLS','TANSTACK_LOCAL_REPOS_DIR'];
  const values=Object.fromEntries(names.filter(name=>process.env[name]!==undefined).map(name=>[name,process.env[name]]));
  const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,script:fs.readFileSync(artifact,'utf8'),compatibilityDate:'2026-06-19',compatibilityFlags:['nodejs_compat'],bindings:values,cf:false,host:'127.0.0.1',port:0,inspectorPort:0,durableObjects:{STREAMS:{className:'StreamObject',useSQLite:true},WORKSPACE_SYNC:{className:'WorkspaceSync',useSQLite:true},CONVERSATIONS:{className:'Conversation',useSQLite:true}},r2Buckets:['GITHUB_CONTENT_CACHE','NPM_DOWNLOAD_CACHE','BUILDER_PROJECTS','FILES'],workflows:{WORKFLOW_RUNS:{name:'rewrite-preview-workflows',className:'TanChatWorkflow'}},isolatedResourcePersistencePath:'.work/runtime-state/preview/durable-objects',resourcePersistencePath:'.work/runtime-state/preview/shared'}));
  try{await runtime.ready;const bindings=await runtime.getBindings();const pending=new Set();return {env:{...bindings,...values},context:{waitUntil(promise){const task=Promise.resolve(promise);pending.add(task);task.catch(error=>console.error('Background runtime task failed',error)).finally(()=>pending.delete(task))}},async dispose(){await Promise.allSettled([...pending]);await runtime.dispose()}}}catch(error){await runtime.dispose();throw error}
}
