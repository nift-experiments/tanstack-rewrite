import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('.work/corpus-manifest.json'));
const routes=Object.keys(manifest.routes),sha=v=>createHash('sha256').update(v).digest('hex');
const errors=[];const unique=new Set();
for(const pathname of routes){const record=manifest.routes[pathname];unique.add(record.source);const actual=fs.readFileSync('public/publication'+pathname+'.html');const expected=fs.readFileSync('.work/corpus-rendered'+pathname+'.html','utf8').replace(/\n$/,'');if(sha(actual)!==sha(expected))errors.push(pathname);assert.ok(fs.existsSync('public/publication-meta'+pathname+'.json'));assert.ok(fs.existsSync('public/downloads'+pathname+'.md'));}
assert.equal(errors.length,0,'Nift output byte mismatch');
const receipt={routes:routes.length,uniqueAuthoredDocuments:unique.size,niftArticleBytesVerified:routes.length,metadataFilesVerified:routes.length,markdownDownloadsVerified:routes.length,scope:'Corpus coverage and raw composition integrity; not full browser parity'};
fs.writeFileSync('evidence/r3/corpus-output-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
