import {projectIslandFlow} from './island-flow-boundary.mjs';
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const {parseFragment}=createRequire(path.resolve('package.json'))('parse5');
// Source offsets keep literal HTML/code bytes intact. Only actual URL attributes
// become Nift expressions. Literal chunks are JSON values, never Nift source.
export function projectNiftMarkup(html,pathname,routes,dataFile,binding="parts"){
 html=projectIslandFlow(html);
 const replacements=[],unknown=[];const document=parseFragment(html,{sourceCodeLocationInfo:true});
 function target(url){if(!url.startsWith('/')||url.startsWith('//'))return null;const split=url.search(/[?#]/),base=split<0?url:url.slice(0,split),suffix=split<0?'':url.slice(split);if(base==='/')return {name:'/',suffix};if(routes[base+'/latest'])return {name:base.slice(1)+'/latest',suffix};if(base==='/mcp'&&routes['/cli/latest/docs/mcp-migration'])return {name:'cli/latest/docs/mcp-migration',suffix};if(routes[base])return {name:base.slice(1),suffix};if(fs.existsSync('public'+base)&&fs.statSync('public'+base).isFile())return {name:'public'+base,suffix};unknown.push(base);return null;}
 function visit(node){for(const attribute of node.attrs??[]){if(!['href','src','poster','srcset'].includes(attribute.name))continue;const location=node.sourceCodeLocation?.attrs?.[attribute.name];if(!location)continue;const raw=html.slice(location.startOffset,location.endOffset),match=raw.match(/^([^=]+=["'])([\s\S]*)(["'])$/);if(!match)continue;const start=location.startOffset+match[1].length,value=match[2];
 const urls=attribute.name==='srcset'?[...value.matchAll(/(?:^|,\s*)([^\s,]+)/g)].map(m=>({url:m[1],index:m.index+m[0].indexOf(m[1])})):[{url:value,index:0}];
 for(const item of urls){const resolved=target(item.url);if(resolved)replacements.push({start:start+item.index,end:start+item.index+item.url.length,expression:'@path('+JSON.stringify(resolved.name)+')',suffix:resolved.suffix});}
 }for(const child of node.childNodes??[])visit(child);if(node.content)visit(node.content);}visit(document);
 replacements.sort((a,b)=>a.start-b.start);const literals=[];let source='@json('+binding+', '+JSON.stringify(dataFile)+')',cursor=0,pendingSuffix='';
 for(const replacement of replacements){literals.push(pendingSuffix+html.slice(cursor,replacement.start));source+='$['+binding+'['+(literals.length-1)+']]'+replacement.expression;cursor=replacement.end;pendingSuffix=replacement.suffix??'';}literals.push(pendingSuffix+html.slice(cursor));source+='$['+binding+'['+(literals.length-1)+']]';
 return {source,data:JSON.stringify(literals),checkedReferences:replacements.length,unknown:[...new Set(unknown)]};
}
