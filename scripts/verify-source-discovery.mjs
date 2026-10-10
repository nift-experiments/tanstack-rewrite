import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';import {discoverDocInputs} from './discover-doc-inputs.mjs';
const sourceRoot=fs.mkdtempSync(path.join(os.tmpdir(),'rewrite-source-discovery-')),dir=sourceRoot+'/tanstack--query--main/docs';fs.mkdirSync(dir,{recursive:true});const source=dir+'/original.md';fs.writeFileSync(source,'# Original');const pinned={roots:[{repo:'tanstack/query',ref:'main',docsRoot:'docs'}],files:[{repo:'tanstack/query',ref:'main',commit:'pinned',file:'docs/original.md',source,render:true,request_time:false,original_sha256:'pinned-provenance'}]};
try{
 assert.deepEqual(discoverDocInputs(pinned,{sourceRoot}).files,pinned.files);
 fs.writeFileSync(dir+'/new.md','# New');let files=discoverDocInputs(pinned,{sourceRoot}).files;assert.equal(files.length,2);assert.equal(files.find(r=>r.file==='docs/new.md').render,true);
 fs.renameSync(dir+'/new.md',dir+'/renamed.md');files=discoverDocInputs(pinned,{sourceRoot}).files;assert.ok(!files.some(r=>r.file==='docs/new.md'));assert.ok(files.some(r=>r.file==='docs/renamed.md'));
 fs.unlinkSync(source);files=discoverDocInputs(pinned,{sourceRoot}).files;assert.equal(files.length,1);assert.equal(files[0].file,'docs/renamed.md');console.log('Filesystem authoring discovery preserves provenance and handles add/rename/delete');
}finally{fs.rmSync(sourceRoot,{recursive:true,force:true})}
