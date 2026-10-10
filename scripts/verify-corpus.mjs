import {discoverDocInputs} from './discover-doc-inputs.mjs';
import {preparePinnedDocSourceSemantics,pinnedDocIndex,resolvePinnedDocument} from './resolve-pinned-docs.mjs';
import {readProjectPaths,resolveHtmlPaths} from './project-paths.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('.work/corpus-manifest.json'));
const routes=Object.keys(manifest.routes),sha=v=>createHash('sha256').update(v).digest('hex');
const pinnedInputs=discoverDocInputs(JSON.parse(fs.readFileSync('sources/docs-inputs.json'))),sourceSemantics=await preparePinnedDocSourceSemantics(),sourceIndex=pinnedDocIndex(pinnedInputs.files),bySource=new Map(pinnedInputs.files.map(input=>[input.source,input]));
const errors=[];const unique=new Set();const paths=readProjectPaths();
for(const pathname of routes){const record=manifest.routes[pathname];unique.add(record.source);const actual=resolveHtmlPaths(fs.readFileSync('public/publication'+pathname+'.html','utf8'),paths,'/publication'+pathname+'.html');const expected=resolveHtmlPaths(fs.readFileSync('.work/corpus-rendered'+pathname+'.html','utf8').replace(/\n$/,''),paths,'/');if(sha(actual)!==sha(expected))errors.push(pathname);assert.ok(fs.existsSync('public/publication-meta'+pathname+'.json'));assert.ok(fs.readFileSync('public/downloads'+pathname+'.md').equals(Buffer.from(resolvePinnedDocument(bySource.get(record.source),sourceIndex,sourceSemantics).text)),'Markdown download differs from pinned local source resolution');}
assert.equal(errors.length,0,'Nift output byte mismatch after checked publication URL normalization');
const inputs=JSON.parse(fs.readFileSync('sources/docs-inputs.json'));if(process.argv.includes('--pinned'))for(const input of inputs.files)assert.equal(sha(fs.readFileSync(input.source)),input.original_sha256,'Pinned source changed: '+input.source);
const receipt={importedSourceFilesByteEqualToPinnedInputs:process.argv.includes('--pinned')?inputs.files.length:undefined,routes:routes.length,uniqueAuthoredDocuments:unique.size,niftArticleBytesVerified:routes.length,metadataFilesVerified:routes.length,markdownDownloadsVerified:routes.length,publicationURLsNormalized:true,scope:'Corpus coverage and raw composition integrity after only checked URL normalization; not upstream semantic or browser parity'};
fs.writeFileSync('evidence/r3/corpus-output-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
