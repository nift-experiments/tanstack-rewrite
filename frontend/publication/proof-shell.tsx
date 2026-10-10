import React from 'react'
import {PublishedRegion} from './PublishedRegion'
export function ProofShell({initialHtml}:{initialHtml:string}) {
 const [html,setHtml]=React.useState(initialHtml),[count,setCount]=React.useState(0)
 return <><button id="shell-update" onClick={()=>setCount(x=>x+1)}>Shell update {count}</button><button id="navigate" onClick={async()=>{const response=await fetch('/second.html');if(!response.ok)throw Error('Publication missing');setHtml(await response.text())}}>Install next publication</button><PublishedRegion html={html}/></>
}
