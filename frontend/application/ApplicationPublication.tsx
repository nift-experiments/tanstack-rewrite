import * as React from 'react'
import {createPortal} from 'react-dom'
import {PublishedRegion} from 'owned-publication/PublishedRegion'

// Interactive application views own this declared region. The surrounding
// publication remains native; document/marketing articles use narrower owners.
export function ApplicationPublication({html,Component}:{html:string;Component:React.ComponentType}) {
  const [target,setTarget]=React.useState<HTMLElement|null>(null)
  const activate=React.useCallback((host:HTMLDivElement)=>{
    const region=host.querySelector<HTMLElement>('[data-application-island]')
    if(!region)throw Error('Missing application publication region')
    region.replaceChildren();setTarget(region)
    return()=>setTarget(null)
  },[])
  return <><PublishedRegion html={html} displayContents activate={activate}/>{target?createPortal(<Component/>,target):null}</>
}
