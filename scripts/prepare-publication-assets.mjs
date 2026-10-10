import fs from 'node:fs';import path from 'node:path';
// One-time import: untransformed assets are maintained in the Nift output tree.
if(!fs.existsSync('sources/PUBLIC-ASSETS-PROVENANCE.json')||!fs.existsSync('public/images/hero-palm-gradient.jpg'))throw Error('Maintained publication assets missing; restore them from repository source.');
// Bundler outputs have one preparation-to-publication step, never server startup.
for(const root of ['.work/shell-prototype/dist/client','.work/publication-ssr'])for(const directory of ['assets','static'])if(fs.existsSync(root+'/'+directory))fs.cpSync(root+'/'+directory,'public/'+directory,{recursive:true});
fs.mkdirSync('.work',{recursive:true});const js=fs.readdirSync('.work/shell-prototype/dist/client/assets/js').find(f=>f.startsWith('index.'));fs.writeFileSync('.work/publication-assets.json',JSON.stringify({entry:'/assets/js/'+js}));
