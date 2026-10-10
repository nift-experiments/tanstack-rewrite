import * as React from 'react'
import {Hydrate as OriginalHydrate} from '@tanstack/react-start'

const publishedMarkup=new WeakMap<Element,string>()
const PublicationPortal=React.createContext<string|null>(null)
// Capture only the region explicitly surrendered by the publication owner.
export function clearPublicationIsland(host:Element){publishedMarkup.set(host,host.innerHTML);host.replaceChildren()}
export function publicationPortal(children:React.ReactNode,host:Element){return <PublicationPortal.Provider value={publishedMarkup.get(host)??null}>{children}</PublicationPortal.Provider>}
// A fresh portal cannot hydrate the server nodes. Keep their published projection
// as its initial fallback while the original strategy controls activation. Nested
// boundaries retain Start's ordinary strategy and query timing.
export function Hydrate(props:React.ComponentProps<typeof OriginalHydrate>){
 const markup=React.useContext(PublicationPortal)
 const fallback=React.useMemo(()=>{
  if(markup===null)return props.fallback
  const holder=document.createElement('div');holder.innerHTML=markup
  const first=holder.firstElementChild
  const body=holder.childElementCount===1&&first?.tagName==='DIV'?first.innerHTML:markup
  return <div style={{display:'contents'}} dangerouslySetInnerHTML={{__html:body}}/>
 },[markup,props.fallback])
 return <OriginalHydrate {...props} fallback={fallback}><PublicationPortal.Provider value={null}>{props.children}</PublicationPortal.Provider></OriginalHydrate>
}
