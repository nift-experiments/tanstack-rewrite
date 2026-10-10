import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {createRequire} from 'node:module'
const runtimeRequire=createRequire(path.resolve('../tanstack/runtime/package.json'))
import {build} from 'esbuild'
await build({entryPoints:['publisher/project-posts.ts'],outfile:'.work/project-posts.mjs',bundle:true,platform:'node',format:'esm',packages:'external',banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},alias:{yaml:runtimeRequire.resolve('yaml')}})
const {projectPosts}=await import('../.work/project-posts.mjs')
const posts=projectPosts('sources/site/blog'),original=(await import(path.resolve('../tanstack/runtime/.content-collections/generated/allPosts.js'))).default,sort=rows=>rows.map(row=>JSON.parse(JSON.stringify(row))).sort((a,b)=>a.slug.localeCompare(b.slug))
assert.equal(posts.length,original.length);for(const [index,post]of sort(posts).entries())assert.deepEqual(post,sort(original)[index],'Exact maintained-source post projection: '+post.slug)
fs.writeFileSync('.work/backend-post-projection.mjs','export const allPosts='+JSON.stringify(posts)+';\n')
fs.writeFileSync('evidence/r3/post-projection-proof.json',JSON.stringify({scope:'Exact original blog collection fields/body derived from maintained authored sources; no Content Collections/Markdown AST in API graph',posts:posts.length,pinned_website_commit:'862ccc3d191818320c3e6d217542883f80cb907a',whole_collection_exact:true,sources:fs.readdirSync('sources/site/blog').sort().map(file=>({file,sha256:createHash('sha256').update(fs.readFileSync(path.join('sources/site/blog',file))).digest('hex')}))},null,2)+'\n')
console.log('Maintained blog projection matches '+posts.length+' original collection entries exactly')
