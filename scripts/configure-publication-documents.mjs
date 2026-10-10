import fs from 'node:fs';
// Indexed authored/generated/workspace sources own only their declared files
// and roots. Unrelated requests retain the original public transport. Owned
// sources bypass remote artifact caches so maintained edits remain authoritative.
export function configurePublicationDocuments(api,libraries){
 const inputs=JSON.parse(fs.readFileSync('sources/docs-inputs.json')).files;
 const index=new Map(),roots=new Map(),trees=new Map(),revisions=new Map();
 const identity=(repo,ref)=>repo+'\0'+ref;
 const addRoot=(repo,ref,root)=>{const key=identity(repo,ref);roots.set(key,[...new Set([...(roots.get(key)??[]),root])]);};
 function addFile(repo,ref,file,source,size,sha){const key=identity(repo,ref);index.set(key+'\0'+file,source);const tree=trees.get(key)??new Map();tree.set(file,{path:file,type:'blob',size:size??fs.statSync(source).size,...(sha?{sha}:{})});const parts=file.split('/');for(let count=1;count<parts.length;count++){const directory=parts.slice(0,count).join('/');tree.set(directory,{path:directory,type:'tree'})}trees.set(key,tree);}
 for(const input of inputs){addFile(input.repo,input.ref,input.file,input.source);for(const library of libraries.filter(library=>library.repo===input.repo))addRoot(input.repo,input.ref,library.docsRoot??'docs');}
 for(const file of fs.readdirSync('sources/site/blog').filter(file=>file.endsWith('.md')))addFile('tanstack/tanstack.com','main','src/blog/'+file,'sources/site/blog/'+file);
 const generated=JSON.parse(fs.readFileSync('sources/generated/charts/PROVENANCE.json')),previews=JSON.parse(fs.readFileSync('sources/generated/charts/previews/PROVENANCE.json'));
 for(const ref of ['main',generated.commit]){revisions.set(identity(generated.repo,ref),generated.commit);addFile(generated.repo,ref,generated.file.path,'sources/generated/charts/catalog-index.json');for(const file of previews.files)addFile(generated.repo,ref,file.path,'sources/generated/charts/previews/'+file.file,file.bytes);addRoot(generated.repo,ref,'benchmarks/conformance/previews');}
 const examples=JSON.parse(fs.readFileSync('sources/examples/PROVENANCE.json'));
 for(const repository of examples.repositories)for(const ref of [repository.ref,repository.commit]){revisions.set(identity(repository.repo,ref),repository.commit);for(const prefix of repository.prefixes)addRoot(repository.repo,ref,prefix);for(const file of examples.files.filter(file=>file.repo===repository.repo&&file.ref===repository.ref))addFile(file.repo,ref,file.path,file.source,file.bytes,file.sha);}
 const owns=(repo,ref,file)=>typeof file==='string'&&(index.has(identity(repo,ref)+'\0'+file)||(repo===generated.repo&&['main',generated.commit].includes(ref)&&file==='benchmarks/conformance')||(roots.get(identity(repo,ref))??[]).some(root=>file===root||file.startsWith(root+'/')));
 const sourcePath=(repo,ref,file)=>index.get(identity(repo,ref)+'\0'+file);
 api.configurePublicationDocumentSource({owns,revision:(repo,ref)=>revisions.get(identity(repo,ref)),tree:(repo,ref,prefix)=>owns(repo,ref,prefix)?[...(trees.get(identity(repo,ref))?.values()??[])]:undefined,read:async(repo,ref,file)=>{if(!owns(repo,ref,file))return undefined;const source=sourcePath(repo,ref,file);return source?fs.readFileSync(source,'utf8'):null},bytes:async(repo,ref,file)=>{if(!owns(repo,ref,file))return undefined;const source=sourcePath(repo,ref,file);return source?fs.readFileSync(source):null}});
}
