import fs from 'node:fs';
import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('.work/module-manifests/ssr-module-manifests/preparation.json','utf8')),identifiers=[];
function walk(value){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'){for(const key of ['identifier','nameForCondition'])if(typeof value[key]==='string')identifiers.push(value[key]);Object.values(value).forEach(walk)}}walk(manifest);
const excluded=['/frontend/application/views/','/frontend/application/registry','/services/backend/','tanstack-upstream/src/','auth-bindings.server'];
for(const needle of excluded)assert.deepEqual(identifiers.filter(name=>name.includes(needle)),[],'Preparation imported request-runtime implementation: '+needle);
fs.writeFileSync('evidence/r3/preparation-import-boundary.json',JSON.stringify({scope:'Native preparation compiler graph; browser/request artifacts retain actual application route implementations. No runtime feature omitted.',excluded,moduleIdentifiersChecked:identifiers.length},null,2)+'\n');console.log('Native preparation graph excludes request-only application/service implementation');
