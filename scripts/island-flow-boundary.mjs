import path from 'node:path';import {createRequire} from 'node:module';
const {parseFragment}=createRequire(path.resolve('package.json'))('parse5');
const owners=new Set(['data-home-island','data-landing-island','data-marketing-island','data-doc-component']);
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// Transparent synthetic owners do not participate in direct-child spacing.
// Preserve the original flow for a single root and for multi-root fragments.
// This touches only declared island-container attributes, never article text.
export function projectIslandFlow(html){
 if(![...owners].some(name=>html.includes(name)))return html;
 const changes=[],document=parseFragment(html,{sourceCodeLocationInfo:true});
 function set(node,name,value){const old=node.attrs.find(a=>a.name===name),location=node.sourceCodeLocation?.attrs?.[name];if(old)old.value=value;else node.attrs.push({name,value});if(location)changes.push({start:location.startOffset,end:location.endOffset,value:name+'="'+escape(value)+'"'});else{const tag=node.sourceCodeLocation?.startTag;if(tag)changes.push({start:tag.endOffset-1,end:tag.endOffset-1,value:' '+name+'="'+escape(value)+'"'})}}
 function walk(node){const style=node.attrs?.find(a=>a.name==='style'),parentClasses=node.parentNode?.attrs?.find(a=>a.name==='class')?.value.split(/\s+/).filter(c=>/(^|:)space-y-/.test(c))??[];
  if(node.attrs?.some(a=>owners.has(a.name))&&style&&/(^|;)\s*display\s*:\s*contents\b/.test(style.value)&&parentClasses.length){set(node,'style',style.value.replace(/(^|;)\s*display\s*:\s*contents\b/,'$1display:block'));if((node.childNodes??[]).filter(c=>c.tagName).length>1){const existing=node.attrs.find(a=>a.name==='class')?.value.split(/\s+/)??[];set(node,'class',[...new Set([...existing,...parentClasses])].filter(Boolean).join(' '))}}
  for(const child of node.childNodes??[])walk(child);if(node.content)walk(node.content);
 }
 walk(document);for(const change of changes.sort((a,b)=>b.start-a.start))html=html.slice(0,change.start)+change.value+html.slice(change.end);return html;
}
