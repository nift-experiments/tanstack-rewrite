import fs from 'node:fs';import path from 'node:path';
// Enumerate the input graph only. No source hashes/mtimes or build decisions:
// Nift evaluates these explicit dependencies in its configured native mode.
export function refreshBuildDependencies(){
 for(const action of ['frontend','preparation','backend','posts']){
  const filename='content/_build/'+action+'.deps.json',previous=JSON.parse(fs.readFileSync(filename,'utf8')),roots=previous.inputRoots??previous.dependencies,dependencies=new Set(['scripts/refresh-build-dependencies.mjs']);
  function visit(filename){const stat=fs.lstatSync(filename);if(stat.isSymbolicLink())throw Error('Build input root contains symlink: '+filename);dependencies.add(filename.replaceAll(path.sep,'/'));if(stat.isDirectory())for(const entry of fs.readdirSync(filename).sort())visit(path.join(filename,entry))}
  for(const root of roots)visit(root);
  const next=JSON.stringify({inputRoots:roots,dependencies:[...dependencies].sort()},null,2)+'\n';if(fs.readFileSync(filename,'utf8')!==next)fs.writeFileSync(filename,next);
 }
}
if(process.argv[1]===new URL(import.meta.url).pathname)refreshBuildDependencies();
