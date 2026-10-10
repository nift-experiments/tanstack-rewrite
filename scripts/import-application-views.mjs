// Explicit one-time source import, not part of normal publication builds.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const parser=createRequire(path.resolve('../tanstack/runtime/package.json'))('@babel/parser');
const upstream=path.resolve('../tanstack-upstream/src');
const destination=path.resolve('frontend/application/views');
const inventory=JSON.parse(fs.readFileSync('.work/special-family-stage/route-adaptation-inventory.json'));
const visited=new Set(),records=[];
function resolve(name,importer){
  name=name.split('?')[0];
  const base=name.startsWith('~/routes/')?upstream+'/'+name.slice(2):name.startsWith('.')?path.resolve(path.dirname(importer),name):null;
  if(!base||!base.startsWith(upstream+'/routes/'))return;
  for(const suffix of ['','.ts','.tsx','.js','/index.ts','/index.tsx'])if(fs.existsSync(base+suffix)&&fs.statSync(base+suffix).isFile())return base+suffix;
  throw Error('Missing route-local source '+name+' from '+importer);
}
function visit(file){
  if(visited.has(file))return;
  visited.add(file);
  const source=fs.readFileSync(file,'utf8'),ast=parser.parse(source,{sourceType:'module',plugins:['typescript','jsx']});
  const relative=path.relative(upstream+'/routes',file),changes=[];
  let binding;
  for(const statement of ast.program.body){
    if(statement.type==='ExportNamedDeclaration'&&statement.declaration?.type==='VariableDeclaration'){
      const declaration=statement.declaration.declarations.find(item=>item.id.name==='Route');
      if(declaration?.init?.callee?.callee?.name==='createFileRoute'){
        if(statement.declaration.declarations.length!==1)throw Error('Mixed route declaration '+file);
        binding=declaration.init.callee.arguments[0].value;
        const options=declaration.init.arguments[0];
        changes.push({start:statement.start,end:statement.end,text:'export const Route=createOwnedRouteBinding('+JSON.stringify(binding)+');\nexport const routeOptions='+source.slice(options.start,options.end)});
      }
    }
  }
  function walk(node){
    if(!node||typeof node!=='object')return;
    if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration'].includes(node.type)&&node.source&&node.importKind!=='type'&&node.exportKind!=='type'){
      const target=resolve(node.source.value,file);
      if(target){visit(target);if(node.source.value.startsWith('~/routes/'))changes.push({start:node.source.start,end:node.source.end,text:JSON.stringify('owned-application/views/'+node.source.value.slice('~/routes/'.length))});}
    }
    if(node.type==='CallExpression'&&node.callee.type==='Import'&&node.arguments[0]?.type==='StringLiteral'){
      const target=resolve(node.arguments[0].value,file);if(target)visit(target);
    }
    for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')walk(value);}
  }
  walk(ast.program);
  let maintained=source;
  for(const change of changes.sort((a,b)=>b.start-a.start))maintained=maintained.slice(0,change.start)+change.text+maintained.slice(change.end);
  if(binding)maintained="import {createOwnedRouteBinding} from 'owned-application/RouteBinding'\n"+maintained;
  const output=destination+'/'+relative;fs.mkdirSync(path.dirname(output),{recursive:true});
  if(fs.existsSync(output)&&fs.readFileSync(output,'utf8')!==maintained)throw Error('Refuse to overwrite maintained view '+output);
  fs.writeFileSync(output,maintained);
  records.push({source:'src/routes/'+relative,file:relative,pattern:binding??null,sourceSha256:createHash('sha256').update(source).digest('hex'),adaptation:binding?'Route-independent authored options/view; owned route identity binding':'Exact shared route-local helper'});
}
for(const record of inventory.records.filter(row=>row.component&&!row.service))visit(path.resolve('../tanstack-upstream',record.source));
records.sort((a,b)=>a.source.localeCompare(b.source));
fs.writeFileSync('frontend/application/PROVENANCE.json',JSON.stringify({upstreamCommit:'862ccc3d191818320c3e6d217542883f80cb907a',scope:'Owned authored application views; import does not claim publication or runtime parity',records},null,2)+'\n');
console.log('Owned application source modules:',records.length);
