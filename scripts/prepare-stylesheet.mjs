import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const req=createRequire(path.resolve('../tanstack/runtime/package.json'));
const postcss=req('postcss'),parseValue=req('postcss-value-parser');

function projectStylesheet(file,name,tracked,write){
 const css=fs.readFileSync(file,'utf8'),changes=[];
 postcss.parse(css).walkDecls(decl=>{
  const offset=decl.source.start.offset+decl.prop.length+decl.raws.between.length;
  parseValue(decl.value).walk(node=>{
   if(node.type!=='function'||node.value!=='url')return;
   const value=node.nodes[0];
   if(!value||!value.value.startsWith('/')||value.value.startsWith('//'))return;
   const target='public'+value.value;
   if(!fs.existsSync(target))throw Error('Stylesheet publication asset missing: '+target);
   const start=offset+value.sourceIndex+(value.type==='string'?1:0);
   changes.push({start,end:start+value.value.length,expression:'@path('+JSON.stringify(target)+')'});
  });
 });
 const dataFile='.work/stylesheet-segments/'+name+'.json',parts=[];
 let source='@dep('+JSON.stringify(file)+')@json(parts, '+JSON.stringify(dataFile)+')',cursor=0;
 for(const change of changes.sort((a,b)=>a.start-b.start)){
  parts.push(css.slice(cursor,change.start));
  source+='$[parts['+(parts.length-1)+']]'+change.expression;cursor=change.end;
 }
 parts.push(css.slice(cursor));source+='$[parts['+(parts.length-1)+']]';
 write(dataFile,JSON.stringify(parts));write('content/'+name+'.css',source);
 tracked.push({name,title:'Checked stylesheet projection',template:'templates/corpus-raw.html','content-ext':'.css','output-ext':'.css'});
 return changes.length;
}
export function prepareStylesheet(tracked,write){
 let checkedReferences=projectStylesheet('sources/styles/site.css','assets/site',tracked,write);
 const generated=new Map();
 for(const root of ['.work/shell-prototype/dist/client','.work/publication-ssr']){
  for(const directory of ['assets','static']){
   if(!fs.existsSync(root+'/'+directory))continue;
   for(const file of fs.readdirSync(root+'/'+directory,{recursive:true})){
    if(file.endsWith('.css')&&fs.statSync(root+'/'+directory+'/'+file).isFile())generated.set(directory+'/'+file,root+'/'+directory+'/'+file);
   }
  }
 }
 for(const [output,input]of generated)checkedReferences+=projectStylesheet(input,output.slice(0,-4),tracked,write);
 return {checkedReferences,stylesheets:generated.size+1};
}
