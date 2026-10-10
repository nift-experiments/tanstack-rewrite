import fs from 'node:fs';import assert from 'node:assert/strict';
const paths=[
  "/builder",
  "/builder/ai",
  "/builder/esbuild",
  "/builder/new?template=react",
  "/builder/fixture-project",
  "/builder/p/fixture-share",
  "/ds/maintainers",
  "/showcases?sort=popular",
  "/stats",
  "/charts/catalog/all",
  "/chat/new-project",
  "/chat/project/fixture-project",
  "/chat/w/fixture-workspace/b/fixture-bot",
  "/chat/w/fixture-workspace/home/attention"
],rows=[];
const referenceOrigin=process.env.TANSTACK_REFERENCE_ORIGIN??'http://127.0.0.1:4121',candidateOrigin=process.env.TANSTACK_CANDIDATE_ORIGIN??'http://127.0.0.1:4173';
for(const pathname of paths){const values=[];for(const origin of [referenceOrigin,candidateOrigin]){const response=await fetch(origin+pathname,{redirect:'manual',signal:AbortSignal.timeout(15000)});values.push({status:response.status,location:response.headers.get('location')});await response.body?.cancel()}rows.push({pathname,reference:values[0],candidate:values[1]});assert.deepEqual(values[1],values[0],pathname)}
fs.writeFileSync('evidence/r3/route-control-parity.json',JSON.stringify({scope:'Pinned reference vs owned shared route controls; anonymous redirects with query/hash preservation, not full authenticated chat parity',rows},null,2)+'\n');console.log(rows.length+' shared route-control outcomes match the pinned reference');
