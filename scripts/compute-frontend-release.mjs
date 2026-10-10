import fs from 'node:fs';import {createHash} from 'node:crypto';
// A release identifies the declared browser/compiler input closure, not docs
// content or backend builds. Nift still decides when this producer executes.
export function computeFrontendRelease(){const graph=JSON.parse(fs.readFileSync('content/_build/frontend.deps.json')),hash=createHash('sha256');for(const filename of graph.dependencies){if(!fs.statSync(filename).isFile())continue;hash.update(filename+'\0');hash.update(fs.readFileSync(filename));hash.update('\0')}return hash.digest('hex')}
