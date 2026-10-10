import fs from 'node:fs';import path from 'node:path';
// Untransformed publication assets are maintained source, never startup copies.
if(!fs.existsSync('sources/PUBLIC-ASSETS-PROVENANCE.json')||!fs.existsSync('public/images/hero-palm-gradient.jpg'))throw Error('Maintained publication assets missing; restore them from repository source.');
export const publicationBundleRoots=['.work/shell-prototype/dist/client','.work/publication-ssr','.work/publication-preparation-ssr'];
// Resolve the complete producer set before writing: identical shared outputs are
// valid, but one producer must never silently overwrite another's asset bytes.
const outputs=new Map();
for(const root of publicationBundleRoots)for(const directory of ['assets','static']){
 if(!fs.existsSync(root+'/'+directory))continue;
 for(const relative of fs.readdirSync(root+'/'+directory,{recursive:true})){
  const input=path.join(root,directory,relative);if(!fs.statSync(input).isFile())continue;
  const output=path.join(directory,relative),previous=outputs.get(output);
  if(previous&&!fs.readFileSync(previous).equals(fs.readFileSync(input)))throw Error('Conflicting bundle publication asset: '+output+' from '+previous+' and '+input);
  outputs.set(output,input);
 }
}
for(const [output,input]of outputs){const target=path.join('public',output);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(input,target);}
fs.mkdirSync('.work',{recursive:true});const js=fs.readdirSync('.work/shell-prototype/dist/client/assets/js').find(f=>f.startsWith('index.'));if(!js)throw Error('Browser entry bundle missing');fs.writeFileSync('.work/publication-assets.json',JSON.stringify({entry:'/assets/js/'+js}));
