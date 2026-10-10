import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {MermaidBlock} from '../components/MermaidBlock'
let islandIndex=0
export function activateMermaid(host: ParentNode){
 const roots=[]
 for(const element of host.querySelectorAll<HTMLElement>('[data-island="mermaid"]')){
  const props=JSON.parse(element.getAttribute('data-island-props')!)
  roots.push({element,root:hydrateRoot(element,<MermaidBlock {...props}/>,{identifierPrefix:'mermaid-island-'+(islandIndex++)+'-',onRecoverableError:error=>console.error('Mermaid hydration error',error)})})
  element.setAttribute('data-island-active','true')
 }
 return ()=>{for(const {element,root} of roots){root.unmount();element.removeAttribute('data-island-active')}}
}
