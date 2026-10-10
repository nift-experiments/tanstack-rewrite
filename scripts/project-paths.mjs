import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const {parseFragment}=createRequire(path.resolve('package.json'))('parse5');
// Nift resolves and checks every implemented page/asset identity. The local
// request-time shell consumes this derived map; it does not guess geometry.
export function prepareProjectPaths(routes,tracked,write){
 const entries=[];
 for(const asset of JSON.parse(fs.readFileSync('sources/PUBLIC-ASSETS-PROVENANCE.json')).files){if(asset.path.startsWith('public/'))entries.push(['/'+asset.path.slice(7),asset.path]);}
 for(const dir of ['assets','static','images','fonts']){const root='public/'+dir;if(!fs.existsSync(root))continue;for(const file of fs.readdirSync(root,{recursive:true}))if(fs.statSync(root+'/'+file).isFile()){const url='/'+dir+'/'+file.replaceAll(path.sep,'/');if(!entries.some(([known])=>known===url))entries.push([url,'public/'+dir+'/'+file]);}}
 for(const route of Object.keys(routes))entries.push([route,route.slice(1)]);
 for(const record of Object.values(routes))if(record.kind==='landing'&&record.version==='latest')entries.push(['/'+record.libraryId,record.pathname.slice(1)]);if(routes['/cli/latest/docs/mcp-migration'])entries.push(['/mcp','cli/latest/docs/mcp-migration']);
 for(const item of tracked)if(item.name.startsWith('publication-applications/'))entries.push(['/'+item.name+'.html',item.name]);
 entries.push(['/','/']);
 const body='{'+entries.map(([url,target])=>JSON.stringify(url)+':"@path('+JSON.stringify(target)+')"').join(',')+'}';
 write('content/_paths/manifest.html',body);write('templates/project-paths.html','@content');tracked.push({name:'_paths/manifest',title:'Checked project paths',template:'templates/project-paths.html'});
}
export function readProjectPaths(){
 const values=JSON.parse(fs.readFileSync('public/_paths/manifest.html','utf8'));const resolved={};
 for(const [logical,generated] of Object.entries(values)){const published=new URL(generated,'http://publication.invalid/_paths/manifest.html').pathname;resolved[logical]=logical==='/'?'/':Object.hasOwn(values,logical)&&!logical.startsWith('/assets/')&&!logical.startsWith('/static/')&&!logical.startsWith('/images/')&&!logical.startsWith('/fonts/')&&!logical.endsWith('.html')?published.replace(/\.html$/,''):published;}
 return resolved;
}
export function resolveHtmlPaths(html,paths,basePath='/'){
 const changes=[];function resolve(url){if(url.startsWith('#')||url.startsWith('//')||/^[a-z]+:/i.test(url))return url;const parsed=new URL(url,'http://publication.invalid'+basePath),base=parsed.pathname.replace(/\.html$/,'');return paths[base]?paths[base]+parsed.search+parsed.hash:paths[parsed.pathname]?paths[parsed.pathname]+parsed.search+parsed.hash:url}
 function walk(node){for(const attribute of node.attrs??[]){const pathInterface=attribute.name==='data-src'&&node.attrs?.some(item=>item.name==='id'&&item.value==='publication-path-interface');if(!pathInterface&&!['href','src','srcset','poster'].includes(attribute.name))continue;const location=node.sourceCodeLocation?.attrs?.[attribute.name];if(!location)continue;const raw=html.slice(location.startOffset,location.endOffset),match=raw.match(/^([^=]+=["'])([\s\S]*)(["'])$/);if(!match)continue;const value=match[2],updated=pathInterface?new URL(value,'http://publication.invalid'+basePath).pathname:attribute.name==='srcset'?value.replace(/(?:^|,\s*)([^\s,]+)/g,(full,url)=>full.replace(url,resolve(url))):resolve(value);if(updated!==value)changes.push({start:location.startOffset+match[1].length,end:location.endOffset-match[3].length,value:updated})}for(const child of node.childNodes??[])walk(child);if(node.content)walk(node.content)}walk(parseFragment(html,{sourceCodeLocationInfo:true}));for(const change of changes.sort((a,b)=>b.start-a.start))html=html.slice(0,change.start)+change.value+html.slice(change.end);return html;
}
