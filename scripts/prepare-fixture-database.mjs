import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';import {build} from 'esbuild';import postgres from 'postgres';
import {fixtureDatabaseCatalog} from './fixture-database-catalog.mjs';
const value=process.env.TANSTACK_FIXTURE_DATABASE_URL;
if(!value)throw Error('Set TANSTACK_FIXTURE_DATABASE_URL to the isolated local nift_rewrite_fixture database');
const url=new URL(value);
assert.ok(['localhost','127.0.0.1'].includes(url.hostname)&&/^\/nift_rewrite_fixture(?:_[a-z0-9_]+)?$/.test(url.pathname),'Refuse non-fixture/non-loopback database');
const catalog=fixtureDatabaseCatalog();const sql=postgres(value,{max:1,onnotice:()=>{}});
try {
  const [existing]=await sql`SELECT to_regclass('public.users') IS NOT NULL AS present`;
  if(!existing.present){
    fs.mkdirSync('.work/fixture-database',{recursive:true});
    await build({entryPoints:['services/backend/src/db/schema.ts'],outfile:'.work/fixture-database/schema.cjs',bundle:true,platform:'node',format:'cjs',packages:'external',alias:{'~':path.resolve('services/backend/src')}});
    fs.writeFileSync('.work/fixture-database/drizzle.config.cjs',"module.exports={dialect:'postgresql',schema:'./.work/fixture-database/schema.cjs',dbCredentials:{url:process.env.TANSTACK_FIXTURE_DATABASE_URL}};\n");
    const result=spawnSync(process.execPath,[path.resolve('node_modules/drizzle-kit/bin.cjs'),'push','--config','.work/fixture-database/drizzle.config.cjs','--force'],{stdio:'inherit'});
    assert.equal(result.status,0,'Fixture schema provisioning failed');
  }
  await sql.begin(async tx=>{
    for(const row of catalog.functions)await tx.unsafe(row.sql,[],{prepare:false});
    for(const row of catalog.triggers)await tx.unsafe(row.sql,[],{prepare:false});
    await tx`INSERT INTO chat_workspace_sync_clock(workspace_id) SELECT id FROM chat_workspaces ON CONFLICT DO NOTHING`;
    await tx`INSERT INTO chat_workspace_sync_members(workspace_id,user_id) SELECT workspace_id,user_id FROM chat_memberships ON CONFLICT DO NOTHING`;
  });
  fs.writeFileSync('evidence/r3/fixture-database-catalog.json',JSON.stringify({scope:'Explicit isolated local fixture only; final maintained Drizzle schema plus retained final SQL function/trigger definitions. No production database or publication-driven DDL.',functions:catalog.functions.length,triggers:catalog.triggers.length,originalFunctionDeclarations:catalog.declarations},null,2)+'\n');
  console.log('Isolated fixture contains '+catalog.functions.length+' original SQL functions and '+catalog.triggers.length+' original triggers');
}finally{await sql.end()}
