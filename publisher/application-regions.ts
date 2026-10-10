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

// Request-time rendering may replace only declared runtime island contents.
export function refreshPublicationIslands(publication:string,fresh:string) {
 const collect=(html:string)=>{const rows:any[]=[];function walk(node:any){const marker=node.attrs?.find((a:any)=>['data-home-island','data-landing-island'].includes(a.name));if(marker){const location=node.sourceCodeLocation;if(!location?.startTag||!location.endTag)throw Error('Incomplete publication island');rows.push({key:marker.name+':'+marker.value,location});return}for(const child of node.childNodes??[])walk(child)}walk(parse(html,{sourceCodeLocationInfo:true}));return rows}
 const replacements=new Map(collect(fresh).map(row=>[row.key,row.location]));let output=publication
 for(const row of collect(publication).sort((a,b)=>b.location.startOffset-a.location.startOffset)){const next=replacements.get(row.key);if(!next)throw Error('Missing request island '+row.key);output=output.slice(0,row.location.startTag.endOffset)+fresh.slice(next.startTag.endOffset,next.endTag.startOffset)+output.slice(row.location.endTag.startOffset)}return output
}
export function publicationFragment(html:string){const location=region(html,'data-published-region');return html.slice(location.startTag.endOffset,location.endTag.startOffset)}
