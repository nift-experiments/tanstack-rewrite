import {discoverDocInputs} from './discover-doc-inputs.mjs';
import {pruneRemovedDocumentation} from './prune-publication.mjs';
import {prepareApplicationPublication} from './prepare-application-publication.mjs';
import {prepareDocumentHeaders} from './prepare-document-headers.mjs';
import {prepareDocComponents} from './prepare-doc-components.mjs';
import {prepareBlog} from './prepare-blog.mjs';
import {prepareMarketing} from './prepare-marketing.mjs';
import {preparePinnedDocSourceSemantics,pinnedDocIndex,resolvePinnedDocument} from './resolve-pinned-docs.mjs';
import {prepareLandings} from './prepare-landings.mjs';
import {prepareStylesheet} from './prepare-stylesheet.mjs';
import {preparePagePublication} from './prepare-page-publication.mjs';
import './prepare-publication-assets.mjs';
import './prepare-posts.mjs';
import './prepare-homepage.mjs';
import {projectNiftMarkup} from './project-nift-markup.mjs';
import {prepareProjectPaths} from './project-paths.mjs';
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';import {build} from 'esbuild';
const runtimeGaps=fs.existsSync('investigation/RUNTIME-GAPS.json')?JSON.parse(fs.readFileSync('investigation/RUNTIME-GAPS.json')):null;
const previousPublication=fs.existsSync('.work/corpus-manifest.json')?JSON.parse(fs.readFileSync('.work/corpus-manifest.json')):null;
const started=performance.now(),hash=v=>createHash('sha256').update(v).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});if(!fs.existsSync(p)||fs.readFileSync(p,'utf8')!==v)fs.writeFileSync(p,v)};
if(!fs.existsSync('sources/docs-inputs.json')){fs.cpSync('../tanstack/sources/docs','sources/docs',{recursive:true});fs.copyFileSync('../tanstack/sources/docs-inputs.json','sources/docs-inputs.json')}
await build({entryPoints:['frontend/retained/src/libraries/libraries.ts'],outfile:'.work/corpus-libraries.mjs',bundle:true,platform:'node',format:'esm',packages:'external',alias:{'~':path.resolve('frontend/retained/src')}});
await import('./compile-document.mjs');
const {libraries}=await import('../.work/corpus-libraries.mjs');const {renderDocumentProjection}=await import('../.work/render-document.mjs');const {parse}=createRequire(path.resolve('../tanstack/runtime/package.json'))('yaml');
const documentHeaders=await prepareDocumentHeaders();
const inputs=discoverDocInputs(JSON.parse(fs.readFileSync('sources/docs-inputs.json'))),sourceSemantics=await preparePinnedDocSourceSemantics(),sourceIndex=pinnedDocIndex(inputs.files);const routes={},configs={},failures=[],pending={},tracked=[],families={};let empty=0,rendered=0;
const rendererSignature=hash(fs.readFileSync('.work/render-document.mjs')+fs.readdirSync('.work/publication-preparation-ssr',{recursive:true}).filter(file=>file.endsWith('.mjs')).sort().map(file=>file+hash(fs.readFileSync('.work/publication-preparation-ssr/'+file))).join(''));
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
 for(const entry of entries){const resolved=resolvePinnedDocument(entry,sourceIndex,sourceSemantics),source=resolved.text;if(source===null){failures.push({source:entry.source,error:'Pinned upstream source-reference depth limit reached'});continue;}if(!source.trim()){empty++;continue;}
 const relative=entry.file.slice(root.length+1).replace(/\.md$/,'').replace(/\/index$/,'');const pathname=`/${library.id}/${version}/docs/${relative}`;
 if(routes[pathname])throw Error('Route collision '+pathname);
 const signature=hash(source+pathname+rendererSignature+fs.readFileSync('scripts/prepare-doc-components.mjs')),target='.work/corpus-rendered'+pathname+'.html';let projection;
 try{if(old[pathname]?.signature===signature&&fs.existsSync(target)&&hash(fs.readFileSync(target))===old[pathname].htmlHash){projection=old[pathname].projection;reused++;}else{projection=await renderDocumentProjection(source,pathname,{}, {feedbackWrapper:false,allowPendingComponents:true});projection.html=await prepareDocComponents(projection.html,pathname);write(target,projection.html);rendered++;}
 const metadata=sourceSemantics.parseFrontMatter(source).data;
 const record={...metadata,headers:{...documentHeaders.getDocsCacheHeaders({libraryId:library.id,version}),...documentHeaders.getDocsEmbedRuntimeHeaders({content:source,version})},title:typeof metadata.title==='string'?metadata.title:'Content temporarily unavailable',description:typeof metadata.description==='string'&&metadata.description.trim()?metadata.description:projection.description,keywords:sourceSemantics.extractFrontMatterKeywords(metadata.keywords),frameworks:projection.frameworks,headings:projection.headings,controls:projection.controls,filePath:entry.file,pathname,source:entry.source,sourceDependencies:resolved.dependencies,referenceDepth:resolved.referenceDepth,libraryId:library.id,version};
 cache[pathname]={signature,htmlHash:hash(fs.readFileSync(target)),projection:{description:projection.description,frameworks:projection.frameworks,headings:projection.headings,controls:projection.controls}};
 routes[pathname]=record;families[library.id]=(families[library.id]??0)+1;
 const html=fs.readFileSync(target,'utf8');for(const match of html.matchAll(/data-pending-family="([^"]+)"/g)){pending[match[1]]??=[];pending[match[1]].push(pathname);}
 const name='publication'+pathname;tracked.push({name,title:record.title,template:'templates/corpus-raw.html'});
 write('public/publication-meta'+pathname+'.json',JSON.stringify({record,config:configs[library.id+'/'+version]}));write('public/downloads'+pathname+'.md',source);
 }catch(error){failures.push({pathname,source:entry.source,error:String(error.message)});}
 }
 }
 console.log(`${library.id}: ${families[library.id]??0} routes; total ${Object.keys(routes).length}`);
}
if(failures.length)throw Error('Documentation preparation failed for '+failures.length+' routes: '+JSON.stringify(failures.slice(0,5)));
for(const record of Object.values(routes)){const library=libraries.find(library=>library.id===record.libraryId);const latestPath=record.pathname.replace('/'+record.libraryId+'/'+record.version+'/','/'+record.libraryId+'/latest/');if(record.version!=='latest'&&record.version!==library.latestVersion&&routes[latestPath])record.canonicalPathOverride=latestPath;}
for(const record of Object.values(routes))write('public/publication-meta'+record.pathname+'.json',JSON.stringify({record,config:configs[record.libraryId+'/'+record.version]}));
const landings=await prepareLandings(configs);const marketing=await prepareMarketing(),blog=await prepareBlog();const publishedRoutes={...routes,...landings,...marketing,...blog};
const articleCacheFile='.work/article-source-cache.json',previousArticles=fs.existsSync(articleCacheFile)?JSON.parse(fs.readFileSync(articleCacheFile)):{};const articleSources={};const pathSignature=hash(Object.keys(publishedRoutes).sort().join('\n')+fs.readFileSync('scripts/project-nift-markup.mjs'));
for(const record of Object.values(routes)){const pathname=record.pathname,prepared='.work/corpus-rendered'+pathname+'.html',html=fs.readFileSync(prepared,'utf8'),dataFile='.work/article-segments'+pathname+'.json',contentFile='content/publication'+pathname+'.html',signature=hash(html+pathSignature+JSON.stringify(record.sourceDependencies)),previous=previousArticles[pathname];if(previous?.signature===signature&&fs.existsSync(dataFile)&&fs.existsSync(contentFile)&&hash(fs.readFileSync(dataFile))===previous.dataHash&&hash(fs.readFileSync(contentFile))===previous.contentHash){articleSources[pathname]=previous;}else{const projection=projectNiftMarkup(html,pathname,publishedRoutes,dataFile);write(dataFile,projection.data);write(contentFile,record.sourceDependencies.map(dependency=>`@dep(${JSON.stringify(dependency)})`).join('')+`@dep(${JSON.stringify(prepared)})`+projection.source);articleSources[pathname]={signature,dataHash:hash(fs.readFileSync(dataFile)),contentHash:hash(fs.readFileSync(contentFile)),unknown:projection.unknown};}}
write(articleCacheFile,JSON.stringify(articleSources));
write('content/publication/home.html','@dep(".work/home/article.html")$[rawHtml(".work/home/article.html")]');tracked.push({name:'publication/home',title:'Homepage content',template:'templates/corpus-raw.html'});
write('public/publication-meta/home.json',fs.readFileSync('.work/home/recent-posts.json','utf8'));
for(const record of Object.values({...landings,...marketing,...blog})){const target=(record.kind==='blog'?'.work/blog-rendered':record.kind==='marketing'?'.work/marketing-rendered':'.work/landing-rendered')+record.pathname+'.html',dataFile='.work/landing-segments'+record.pathname+'.json',projection=projectNiftMarkup(fs.readFileSync(target,'utf8'),record.pathname,publishedRoutes,dataFile);write(dataFile,projection.data);write('content/publication'+record.pathname+'.html',(record.source?`@dep(${JSON.stringify(record.source)})`:'')+`@dep(${JSON.stringify(target)})`+projection.source);tracked.push({name:'publication'+record.pathname,title:record.title,template:'templates/corpus-raw.html'});write('public/publication-meta'+record.pathname+'.json',JSON.stringify({record,config:{sections:[]}}));}
prepareStylesheet(tracked,write);
await preparePagePublication(publishedRoutes,configs,tracked);
const applications=prepareApplicationPublication(tracked,write);
prepareProjectPaths(publishedRoutes,tracked,write);
for(const item of tracked)item.depends=['_build/preparation'];
tracked.unshift({name:'_build/frontend',title:'Owned browser and publication renderer compilation',build:'scripts/build-frontend.f', 'output-ext':'.json'},{name:'_build/preparation',title:'Corpus preparation',build:'scripts/build-preparation.f',depends:['_build/frontend','_build/posts'],'output-ext':'.json'},{name:'_build/posts',title:'Maintained blog projection',build:'scripts/build-posts.f','output-ext':'.json'},{name:'_build/backend',title:'Owned service compilation',build:'scripts/build-backend.f',depends:['_build/posts'],'output-ext':'.json'},{name:'_build/worker',title:'Owned Worker API and runtime packaging',build:'scripts/build-worker.f',depends:['_build/backend'],'output-ext':'.json'});
const pruned=pruneRemovedDocumentation(previousPublication,{routes});write('.work/discovered-doc-inputs.json',JSON.stringify(inputs));
write('.nift/tracked.json',JSON.stringify({tracked})+'\n');
if(!process.argv.includes('--prepare-only')){const result=spawnSync(path.resolve('../tanstack-rewrite-baseline/toolchain/nift-v4.10.0'),['build'],{encoding:'utf8',maxBuffer:32*1024*1024});write('.work/corpus-nift-build.log',result.stdout+result.stderr);if(result.status!==0)throw Error('Nift build failed; see .work/corpus-nift-build.log');}
const routePatterns=JSON.parse(fs.readFileSync('evidence/r1/route-contract-inventory.json')).patterns;
const activeOwners={};for(const record of Object.values(routes)){const html=fs.readFileSync('.work/corpus-rendered'+record.pathname+'.html','utf8');for(const match of html.matchAll(/data-doc-component="([^"]+)"/g)){activeOwners[match[1]]??=[];activeOwners[match[1]].push(record.pathname)}}
const ledger={activeExampleFamilies:Object.entries(activeOwners).map(([family,paths])=>({family,affectedRoutes:new Set(paths).size,occurrences:paths.length,paths:[...new Set(paths)],status:'Retained component regions integrated; runtime/visual parity pending'})),scope:'Corpus generation checkpoint, not parity acceptance',sourceReferenceResolution:{files:inputs.files.filter(input=>input.file.endsWith('.md')&&sourceSemantics.parseFrontMatter(fs.readFileSync(input.source,'utf8')).data.ref).length,status:'Pinned local source resolution active; rendered/browser parity pending'},pendingComponentFamilies:Object.entries(pending).map(([family,paths])=>({family,affectedRoutes:new Set(paths).size,occurrences:paths.length,paths:[...new Set(paths)]})),renderFailures:failures,applicationFamilies:applications.map(record=>({...record,status:'Nift native boundary and request-time application owner connected; full parity pending'})),unimplementedRouteFamilies:routePatterns.filter(r=>!r.pattern.includes('/docs')&&r.pattern!=='/'&&!Object.hasOwn(publishedRoutes,r.pattern)&&!applications.some(application=>application.pathname.replace(/\/$/,'')===r.pattern.replace(/\/$/,''))).map(r=>({pattern:r.pattern,classification:r.classification,status:'Not connected to authored static publication or application-family contract; runtime API coverage tracked separately'})),...(runtimeGaps?{workerRuntime:runtimeGaps}:{}),sharedGaps:['authenticated sessions/database writes/provider callbacks','search live-service parity','production asset independence','dynamic hosting guide','redirect/content-negotiation and SEO completeness','chart/live/client example interaction owners','complete viewport/browser parity','documentation image/static-asset URL resolution','Cloudflare Worker-backed chat stream runtime verification','independent clean-checkout packaging']};
write('.work/corpus-cache.json',JSON.stringify(cache));write('.work/corpus-manifest.json',JSON.stringify({routes,configs,landings,marketing,blog,applications}));write('investigation/CORPUS-GAPS.json',JSON.stringify(ledger,null,2)+'\n');

const receipt={sourceLifecycle:{discoveredInputs:inputs.files.length,removedRoutes:pruned.removedRoutes,removedOutputFiles:pruned.removedFiles.length},uniqueAuthoredDocuments:new Set(Object.values(routes).map(r=>r.source)).size,generatedRoutes:Object.keys(routes).length,libraries:families,rendered,reused,emptyInputs:empty,renderFailures:failures.length,pendingComponentFamilies:Object.fromEntries(Object.entries(pending).map(([k,v])=>[k,v.length])),elapsedSeconds:(performance.now()-started)/1000,output:'public/<route>.html plus public/index.html; article fragments support native Router navigation',siteShell:'Nift-published complete pages; declared session/shell slots evaluated at request time',familyBindings:{tabs:'native document controller',codeCopy:'native controller with retained clipboard/toast',mermaid:'scoped React island',liveExample:'retained explicit component region; parity pending',chartExample:'retained explicit component region; parity pending',clientExample:'retained explicit component region; parity pending',services:'shared owned server-function dispatcher; incomplete protocol/backend parity'},scope:'Homepage plus documentation corpus; owned API families are separately compiled. Remaining application/marketing/service parity gaps stay in the ledger. No final parity or benchmark claim.'};write('evidence/r3/corpus-generation.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));

write('public/_build/preparation.json',JSON.stringify({routes:Object.keys(routes).length,homepage:true,preparedAt:new Date().toISOString()}));
