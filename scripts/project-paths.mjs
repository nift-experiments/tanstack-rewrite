import fs from 'node:fs';import path from 'node:path';
// Nift resolves and checks every implemented page/asset identity. The local
// request-time shell consumes this derived map; it does not guess geometry.
export function prepareProjectPaths(routes,tracked,write){
 const entries=[];
 for(const dir of ['assets','static','images']){const root='public/'+dir;if(!fs.existsSync(root))continue;for(const file of fs.readdirSync(root,{recursive:true}))if(fs.statSync(root+'/'+file).isFile())entries.push(['/'+dir+'/'+file.replaceAll(path.sep,'/'),'public/'+dir+'/'+file]);}
 for(const route of Object.keys(routes))entries.push([route,'publication'+route]);
 const body='{'+entries.map(([url,target])=>JSON.stringify(url)+':"@path('+JSON.stringify(target)+')"').join(',')+'}';
 write('content/_paths/manifest.html',body);write('templates/project-paths.html','@content');tracked.push({name:'_paths/manifest',title:'Checked project paths',template:'templates/project-paths.html'});
}
export function readProjectPaths(){
 const values=JSON.parse(fs.readFileSync('public/_paths/manifest.html','utf8'));const resolved={};
 for(const [logical,generated] of Object.entries(values)){const published=new URL(generated,'http://publication.invalid/_paths/manifest.html').pathname;resolved[logical]=published.startsWith('/publication/')?published.slice('/publication'.length).replace(/\.html$/,''):published;}
 return resolved;
}
export function resolveHtmlPaths(html,paths){return html.replace(/\b(src|href)="(\/[^"]*)"/g,(original,attribute,url)=>{const split=url.search(/[?#]/);const base=split<0?url:url.slice(0,split),suffix=split<0?'':url.slice(split);return paths[base]?`${attribute}="${paths[base]}${suffix}"`:original});}
