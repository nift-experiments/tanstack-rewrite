import fs from 'node:fs';
import assert from 'node:assert/strict';
// Bounded projection of the pinned migration corpus for a final-schema fixture.
// Production migrations remain byte-preserved and are not run by publication.
export function fixtureDatabaseCatalog() {
  const functions=new Map(),triggers=new Map();let declarations=0;
  for(const file of fs.readdirSync('services/database/migrations').filter(x=>x.endsWith('.sql')).sort()) {
    const source=fs.readFileSync('services/database/migrations/'+file,'utf8');
    const matches=[...source.matchAll(/^CREATE(?: OR REPLACE)? FUNCTION\s+([\w.]+)\s*\(([^)]*)\)[\s\S]*?\bAS\s+\$\$[\s\S]*?\$\$\s*;/gm)];
    assert.equal(matches.length,[...source.matchAll(/^CREATE(?: OR REPLACE)? FUNCTION\b/gm)].length,'Unsupported fixture function syntax: '+file);
    for(const match of matches){declarations++;functions.set(match[1]+'('+match[2]+')',{source:file,sql:match[0].replace(/^CREATE(?: OR REPLACE)? FUNCTION/,'CREATE OR REPLACE FUNCTION')});}
    const rows=[...source.matchAll(/^CREATE TRIGGER\s+(\w+)\s+[^;]*?\bON\s+([\w."]+)\s+[^;]*;/gm)];
    assert.equal(rows.length,[...source.matchAll(/^CREATE TRIGGER\b/gm)].length,'Unsupported fixture trigger syntax: '+file);
    for(const match of rows)triggers.set(match[2]+'.'+match[1],{source:file,sql:'DROP TRIGGER IF EXISTS '+match[1]+' ON '+match[2]+';\n'+match[0]});
    assert.ok(!/^DROP (?:FUNCTION|TRIGGER)\b/m.test(source),'Fixture catalog needs an explicit drop rule: '+file);
  }
  assert.ok(functions.size&&triggers.size);
  return {functions:[...functions.values()],triggers:[...triggers.values()],declarations};
}
