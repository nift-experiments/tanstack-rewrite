import fs from 'node:fs';import path from 'node:path';
// Only outputs explicitly owned by the preceding successful docs manifest are
// eligible. Maintained sources/assets and unknown files are never candidates.
export function pruneRemovedDocumentation(previous,current,{workspace='.'}={}) {
 const removed=Object.keys(previous?.routes??{}).filter(route=>!Object.hasOwn(current.routes,route));const files=[];
 for(const route of removed){
  if(!route.startsWith('/')||route.split('/').some(part=>part==='.'||part==='..')||/[\\\0]/.test(route))throw Error('Unsafe previous route '+route);
  const name=route.slice(1);
  for(const filename of ['public'+route+'.html','public/publication'+route+'.html','public/publication-meta'+route+'.json','public/downloads'+route+'.md','content/'+name+'.html','content/publication'+route+'.html','content/_heads/'+name+'.html','.work/corpus-rendered'+route+'.html','.work/article-segments'+route+'.json','.work/site-shell/'+name+'.html','.work/site-segments/'+name+'.json','.work/site-head/'+name+'.json','.work/site-context/'+name+'.json']){
   const target=path.resolve(workspace,filename),root=path.resolve(workspace)+path.sep;if(!target.startsWith(root))throw Error('Output escapes workspace '+filename);
   if(fs.existsSync(target)){if(!fs.statSync(target).isFile())throw Error('Owned output is not a file '+filename);fs.unlinkSync(target);files.push(filename)}
  }
 }
 return {removedRoutes:removed,removedFiles:files};
}
