import {parse} from 'parse5'

function region(html:string,attribute:string) {
  let found:any
  function walk(node:any){
    if(node.attrs?.some((value:any)=>value.name===attribute)){
      if(found)throw Error('Duplicate application publication region '+attribute)
      found=node
    }
    for(const child of node.childNodes??[])walk(child)
  }
  walk(parse(html,{sourceCodeLocationInfo:true}))
  if(!found?.sourceCodeLocation?.startTag||!found.sourceCodeLocation.endTag)throw Error('Missing application publication region '+attribute)
  return found.sourceCodeLocation
}
export function applicationBody(html:string) {
  const location=region(html,'data-application-source')
  return html.slice(location.startOffset,location.endOffset)
}
export function refreshApplicationRegion(publication:string,fresh:string) {
  const maintained=region(publication,'data-application-island')
  const dynamic=region(fresh,'data-application-island')
  return publication.slice(0,maintained.startTag.endOffset)+
    fresh.slice(dynamic.startTag.endOffset,dynamic.endTag.startOffset)+
    publication.slice(maintained.endTag.startOffset)
}
