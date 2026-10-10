import {readProjectPaths,resolveHtmlPaths} from './project-paths.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('.work/corpus-manifest.json'));
const routes=Object.keys(manifest.routes),sha=v=>createHash('sha256').update(v).digest('hex');
const errors=[];const unique=new Set();const paths=readProjectPaths();
for(const pathname of routes){const record=manifest.routes[pathname];unique.add(record.source);const actual=resolveHtmlPaths(fs.readFileSync('public/publication'+pathname+'.html','utf8'),paths,'/publication'+pathname+'.html');const expected=fs.readFileSync('.work/corpus-rendered'+pathname+'.html','utf8').replace(/\n$/,'');if(sha(actual)!==sha(expected))errors.push(pathname);assert.ok(fs.existsSync('public/publication-meta'+pathname+'.json'));assert.ok(fs.readFileSync('public/downloads'+pathname+'.md').equals(fs.readFileSync(record.source)),'Markdown download differs from maintained source');}
assert.equal(errors.length,0,'Nift output byte mismatch after checked publication URL normalization');
const receipt={routes:routes.length,uniqueAuthoredDocuments:unique.size,niftArticleBytesVerified:routes.length,metadataFilesVerified:routes.length,markdownDownloadsVerified:routes.length,publicationURLsNormalized:true,scope:'Corpus coverage and raw composition integrity after only checked URL normalization; not upstream semantic or browser parity'};
fs.writeFileSync('evidence/r3/corpus-output-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
