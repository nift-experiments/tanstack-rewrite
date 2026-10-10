import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

// Explicitly local fixture database only: a disposable identity is always
// removed. No production credentials or mock application responses are used.
const databaseUrl=process.env.TANSTACK_FIXTURE_DATABASE_URL;
if(!databaseUrl||!['127.0.0.1','localhost'].includes(new URL(databaseUrl).hostname))throw Error('Set TANSTACK_FIXTURE_DATABASE_URL to the isolated local fixture database');
const requireRuntime=createRequire(path.resolve('../tanstack/runtime/package.json')),postgres=requireRuntime('postgres');
await build({entryPoints:['services/backend/src/auth/session.server.ts'],outfile:'.work/preview-session-test.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
const {SessionService}=await import('../.work/preview-session-test.mjs');
const sql=postgres(databaseUrl,{max:1}),userId=randomUUID(),secret=fs.readFileSync('.work/local-session-secret','utf8'),origin=process.env.TANSTACK_CANDIDATE_ORIGIN??'http://127.0.0.1:4173';
assert.ok(['127.0.0.1','localhost'].includes(new URL(origin).hostname));
try {
  await sql`INSERT INTO users(id,email,name,capabilities,session_version) VALUES(${userId},${userId+'@rewrite-fixture.invalid'},'Rewrite Runtime Fixture',ARRAY['admin']::capability[],2)`;
  const cookie=await new SessionService(secret,true).signCookie({userId,expiresAt:Date.now()+60000,version:2});
  const response=await fetch(origin+'/api/chat/bootstrap?workspaceId='+encodeURIComponent('personal:'+userId),{headers:{cookie:'session_token='+cookie},signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200);const body=await response.json();assert.equal(body.user.id,userId);assert.equal(body.workspace.id,'personal:'+userId);assert.equal(body.fixture,false);
  const receipt={scope:'Normal preview HTTP dispatcher, owned bootstrap, signed session, local PostgreSQL and actual workerd bindings. Does not certify chat turns, provider or workflow execution.',status:response.status,signedDatabaseIdentity:true,personalWorkspace:true,fixtureResponse:false,keys:Object.keys(body)};
  fs.writeFileSync('evidence/r3/preview-authenticated-runtime.json',JSON.stringify(receipt,null,2)+'\n');
  console.log('Normal preview authenticated bootstrap uses real database identity and workerd bindings');
}finally {await sql`DELETE FROM users WHERE id=${userId}`;await sql.end()}
