import React from 'react'

// React owns the host; this boundary owns its published HTML descendants.
// Keep the hydration markup object fixed for this mount so shell updates cannot
// ask React to restore an earlier publication. New publication installs happen
// explicitly after commit, with lifecycle cleanup for declared child islands.
export function PublishedRegion({html,activate}: {html:string;activate?:(host:HTMLDivElement)=>void|(()=>void)}) {
  const host=React.useRef<HTMLDivElement>(null)
  const hydrationMarkup=React.useRef({__html:html})
  const installedHtml=React.useRef(html)
  const cleanup=React.useRef<void|(()=>void)>(undefined)
  React.useLayoutEffect(()=>{
    const element=host.current!
    if(installedHtml.current!==html){cleanup.current?.();element.innerHTML=html;installedHtml.current=html;cleanup.current=activate?.(element)}
  },[html,activate])
  React.useLayoutEffect(()=>{cleanup.current=activate?.(host.current!);return ()=>cleanup.current?.()},[])
  return <div ref={host} data-published-region dangerouslySetInnerHTML={hydrationMarkup.current}/>
}
