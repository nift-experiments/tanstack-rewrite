import {prepareProjectPaths} from './project-paths.mjs';
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';import {build} from 'esbuild';
if(fs.existsSync('sources/static'))fs.cpSync('sources/static','public',{recursive:true});
for(const directory of ['.work/publication-ssr/static','.work/shell-prototype/dist/client/static'])if(fs.existsSync(directory))fs.cpSync(directory,'public/static',{recursive:true});
const started=performance.now(),hash=v=>createHash('sha256').update(v).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});if(!fs.existsSync(p)||fs.readFileSync(p,'utf8')!==v)fs.writeFileSync(p,v)};
if(!fs.existsSync('sources/docs-inputs.json')){fs.cpSync('../tanstack/sources/docs','sources/docs',{recursive:true});fs.copyFileSync('../tanstack/sources/docs-inputs.json','sources/docs-inputs.json')}
await build({entryPoints:['frontend/retained/src/libraries/libraries.ts'],outfile:'.work/corpus-libraries.mjs',bundle:true,platform:'node',format:'esm',packages:'external',alias:{'~':path.resolve('frontend/retained/src')}});
await import('./compile-document.mjs');
const {libraries}=await import('../.work/corpus-libraries.mjs');const {renderDocumentProjection}=await import('../.work/render-document.mjs');const {parse}=createRequire(path.resolve('../tanstack/runtime/package.json'))('yaml');
const inputs=JSON.parse(fs.readFileSync('sources/docs-inputs.json'));const routes={},configs={},failures=[],pending={},tracked=[],families={};let empty=0,rendered=0;
const rendererSignature=hash(fs.readFileSync('.work/render-document.mjs'));
const cachePath='.work/corpus-cache.json',old=fs.existsSync(cachePath)?JSON.parse(fs.readFileSync(cachePath)):{};const cache={};let reused=0;
write('templates/corpus-raw.html','@script { fn(rawHtml(path)) { f := file(path); f.open(); value := f.read_all(); f.close(); return value; } }@content');
for(const library of libraries){
 if(!library.repo||!library.latestVersion)continue;
 const root=library.docsRoot??'docs';
 const versions=[...new Set(['latest',...library.availableVersions])];
 for(const version of versions){const ref=['latest',library.latestVersion].includes(version)?library.latestBranch:version;
 const entries=inputs.files.filter(e=>e.repo===library.repo&&e.ref===ref&&e.render&&e.file.startsWith(root+'/')&&e.file.endsWith('.md'));
 if(!entries.length)continue;
 const slug=library.repo.replaceAll('/','--')+'--'+ref;
 const configPath='sources/docs/'+slug+'/'+root+'/config.json';
 configs[library.id+'/'+version]=fs.existsSync(configPath)?JSON.parse(fs.readFileSync(configPath)): {sections:[]};
 for(const entry of entries){const source=fs.readFileSync(entry.source,'utf8');if(!source.trim()){empty++;continue;}
 const relative=entry.file.slice(root.length+1).replace(/\.md$/,'').replace(/\/index$/,'');const pathname=`/${library.id}/${version}/docs/${relative}`;
 if(routes[pathname])throw Error('Route collision '+pathname);
 const signature=hash(source+pathname+rendererSignature),target='.work/corpus-rendered'+pathname+'.html';let projection;
 try{if(old[pathname]?.signature===signature&&fs.existsSync(target)&&hash(fs.readFileSync(target))===old[pathname].htmlHash){projection=old[pathname].projection;reused++;}else{projection=await renderDocumentProjection(source,pathname,{}, {feedbackWrapper:false,allowPendingComponents:true});write(target,projection.html);rendered++;}
 const fm=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);const metadata=fm?parse(fm[1]):{};
 const record={...metadata,title:metadata?.title??relative.split('/').at(-1),headings:projection.headings,controls:projection.controls,filePath:entry.file,pathname,source:entry.source,libraryId:library.id,version};
 cache[pathname]={signature,htmlHash:hash(fs.readFileSync(target)),projection:{headings:projection.headings,controls:projection.controls}};
 routes[pathname]=record;families[library.id]=(families[library.id]??0)+1;
 const html=fs.readFileSync(target,'utf8');for(const match of html.matchAll(/data-pending-family="([^"]+)"/g)){pending[match[1]]??=[];pending[match[1]].push(pathname);}
 const name='publication'+pathname;write('content/'+name+'.html',`@dep("${entry.source}")@dep("${target}")$[rawHtml("${target}")]`);tracked.push({name,title:record.title,template:'templates/corpus-raw.html'});
 write('public/publication-meta'+pathname+'.json',JSON.stringify({record,config:configs[library.id+'/'+version]}));write('public/downloads'+pathname+'.md',source);
 }catch(error){failures.push({pathname,source:entry.source,error:String(error.message)});}
 }
 }
 console.log(`${library.id}: ${families[library.id]??0} routes; total ${Object.keys(routes).length}`);
}
prepareProjectPaths(routes,tracked,write);
write('.nift/tracked.json',JSON.stringify({tracked})+'\n');
const result=spawnSync(path.resolve('../tanstack-rewrite-baseline/toolchain/nift-v4.10.0'),['build'],{encoding:'utf8',maxBuffer:32*1024*1024});write('.work/corpus-nift-build.log',result.stdout+result.stderr);if(result.status!==0)throw Error('Nift build failed; see .work/corpus-nift-build.log');
const routePatterns=JSON.parse(fs.readFileSync('evidence/r1/route-contract-inventory.json')).patterns;
const ledger={scope:'Corpus generation checkpoint, not parity acceptance',pendingComponentFamilies:Object.entries(pending).map(([family,paths])=>({family,affectedRoutes:paths.length,paths})),renderFailures:failures,unimplementedRouteFamilies:routePatterns.filter(r=>!r.pattern.includes('/docs')).map(r=>({pattern:r.pattern,classification:r.classification,status:'not yet implemented by corpus publisher'})),sharedGaps:['authenticated sessions/database writes/provider callbacks','search live-service parity','production asset independence','dynamic hosting guide','redirect/content-negotiation and SEO completeness','chart/live/client example interaction owners','complete viewport/browser parity','documentation image/static-asset URL resolution','five compiled upstream RPC handlers not yet registered in owned backend','independent clean-checkout packaging']};
write('.work/corpus-cache.json',JSON.stringify(cache));write('.work/corpus-manifest.json',JSON.stringify({routes,configs}));write('investigation/CORPUS-GAPS.json',JSON.stringify(ledger,null,2)+'\n');
write('public/index.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>TanStack corpus preview</title><h1>Documentation corpus preview</h1><p>'+Object.keys(routes).length+' routes. Use npm run serve for the shared application shell; publication/ contains Nift-composed article HTML. Full parity is pending.</p><ul>'+Object.keys(routes).map(p=>'<li><a href="'+p+'">'+p+'</a></li>').join('')+'</ul></html>');
const receipt={uniqueAuthoredDocuments:new Set(Object.values(routes).map(r=>r.source)).size,generatedRoutes:Object.keys(routes).length,libraries:families,rendered,reused,emptyInputs:empty,renderFailures:failures.length,pendingComponentFamilies:Object.fromEntries(Object.entries(pending).map(([k,v])=>[k,v.length])),elapsedSeconds:(performance.now()-started)/1000,output:'public/publication/<route>.html',siteShell:'Shared retained layout, rendered per request by npm run serve',familyBindings:{tabs:'native document controller',codeCopy:'native controller with retained clipboard/toast',mermaid:'scoped React island',liveExample:'pending notice',chartExample:'pending notice',clientExample:'pending notice',services:'shared owned server-function dispatcher; incomplete protocol/backend parity'},scope:'Documentation corpus only; application/service routes inventoried in gap ledger. No full parity or final benchmark claim.'};write('evidence/r3/corpus-generation.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
