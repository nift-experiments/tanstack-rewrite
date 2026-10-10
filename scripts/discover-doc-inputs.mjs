import fs from 'node:fs';import path from 'node:path';
// The pinned manifest is provenance; filesystem authoring determines today's
// source set. Existing flags remain authoritative and new Markdown is rendered.
export function discoverDocInputs(pinned,{sourceRoot='sources/docs'}={}){
 const previous=new Map(pinned.files.map(record=>[record.source,record]));
 const identities=new Map();for(const record of pinned.files){const key=record.repo+'\0'+record.ref;if(!identities.has(key))identities.set(key,record)}
 const files=[];
 for(const record of identities.values()){
  const slug=record.repo.replaceAll('/','--')+'--'+record.ref,root=path.join(sourceRoot,slug);
  if(!fs.existsSync(root))continue;
  for(const relative of fs.readdirSync(root,{recursive:true}).sort()){
   const source=path.join(root,relative).replaceAll(path.sep,'/');
   if(!fs.statSync(source).isFile())continue;
   const old=previous.get(source);
   if(old)files.push(old);
   else files.push({repo:record.repo,ref:record.ref,commit:record.commit,file:relative.replaceAll(path.sep,'/'),source,render:relative.endsWith('.md'),request_time:false,authoredAfterImport:true});
  }
 }
 return {roots:pinned.roots,files:files.sort((a,b)=>a.source.localeCompare(b.source))};
}
