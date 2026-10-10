import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
const original=path.resolve('../tanstack-upstream/src'),target=path.resolve('services/backend/src'),sources=new Set()
function walk(value){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'){for(const key of ['nameForCondition','identifier'])if(typeof value[key]==='string'){const text=value[key],start=text.indexOf(original+'/');if(start>=0){const file=text.slice(start).split('?')[0];if(fs.existsSync(file)&&fs.statSync(file).isFile())sources.add(file)}}Object.values(value).forEach(walk)}}
for(const env of ['client','ssr'])walk(JSON.parse(fs.readFileSync('.work/module-manifests/full-api-module-manifests/'+env+'.json','utf8')))
assert.ok(sources.size>0)
const files=[]
for(const source of [...sources].sort()){
 const relative=path.relative(original,source)
 assert.ok(!relative.startsWith('routes/')&&!relative.startsWith('components/'),'Backend RPC graph reached page/UI implementation: '+relative)
 const output=path.join(target,relative),bytes=fs.readFileSync(source)
 if(fs.existsSync(output))assert.equal(fs.readFileSync(output).equals(bytes),true,'Refuse to overwrite maintained backend changes: '+relative)
 else{fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes)}
 files.push({source:'src/'+relative,target:'src/'+relative,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length})
}
fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(path.join(path.dirname(target),'package.json'),JSON.stringify({private:true,type:'module',sideEffects:false},null,2)+'\n')
fs.writeFileSync(path.join(path.dirname(target),'PROVENANCE.json'),JSON.stringify({upstream_commit:'862ccc3d191818320c3e6d217542883f80cb907a',scope:'Owned dependency closure discovered from public RPC-only client/server nested/orphan module graphs; byte-preserved source, no site/page route implementation; full API routes and protocol/DB/provider parity pending',files},null,2)+'\n')
console.log('Frozen '+files.length+' owned backend source files')
