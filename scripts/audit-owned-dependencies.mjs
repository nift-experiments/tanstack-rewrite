import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const pkg=JSON.parse(fs.readFileSync('package.json'));
const packages=[];
for(const [name,expected] of Object.entries({...pkg.devDependencies,...pkg.dependencies}).sort()) {
  const filename=fs.realpathSync('node_modules/'+name+'/package.json');
  assert.ok(filename.startsWith(path.resolve('node_modules')+'/'),'Borrowed dependency: '+name);
  const installed=JSON.parse(fs.readFileSync(filename));
  assert.equal(installed.version,expected,'Locked direct dependency differs: '+name);
  packages.push({name,version:installed.version});
}
const graphs=[];
for(const filename of ['shell-module-manifests/client.json','ssr-module-manifests/publication.json','ssr-module-manifests/preparation.json','full-api-module-manifests/ssr.json','full-api-module-manifests/worker-ssr.json']) {
  const raw=fs.readFileSync('.work/module-manifests/'+filename);
  const identifiers=[];
  function walk(rows){for(const row of rows){if(row.identifier)identifiers.push(row.identifier);walk(row.modules??[])}}
  walk(JSON.parse(raw).modules);
  for(const marker of ['/tanstack/runtime/','/t12-architecture/rsbuild-toolchain/','/usr/share/nodejs/'])assert.deepEqual(identifiers.filter(value=>value.includes(marker)),[],'Borrowed graph input: '+marker);
  graphs.push({filename,moduleIdentifiers:identifiers.length,sha256:createHash('sha256').update(raw).digest('hex')});
}
fs.writeFileSync('evidence/r3/owned-dependencies.json',JSON.stringify({scope:'Direct locked package versions and actual normal browser, request/preparation SSR, Node API and Worker compiler graphs. Clean-checkout and full runtime acceptance are separate gates.',packageManager:pkg.packageManager,packages,graphs},null,2)+'\n');
console.log(`${packages.length} direct packages owned and pinned; five production compiler graphs exclude borrowed runtime/system packages`);
