import {useEffect} from 'react'
import {useTags} from '@tanstack/react-router'

// The shell root is in body. Only this declared Nift head slot belongs to
// route metadata; published styles, scripts and unrelated head nodes stay owned
// by their existing producers. Tag resolution/deduplication remains Router's.
export function PublicationHead() {
  const tags=useTags()
  useEffect(()=>{
    const comments=Array.from(document.head.childNodes).filter(node=>node.nodeType===Node.COMMENT_NODE)
    const start=comments.find(node=>node.nodeValue==='REQUEST_HEAD_START')
    const end=comments.find(node=>node.nodeValue==='REQUEST_HEAD_END')
    if(!start||!end)throw Error('Declared publication head slot unavailable')
    const old:Node[]=[]
    for(let node=start.nextSibling;node&&node!==end;node=node.nextSibling)old.push(node)
    const aliases:Record<string,string>={charSet:'charset',httpEquiv:'http-equiv',crossOrigin:'crossorigin',fetchPriority:'fetchpriority',className:'class',itemProp:'itemprop'}
    const next=tags.map(tag=>{
      const element=document.createElement(tag.tag)
      for(const [name,value] of Object.entries(tag.attrs??{})){
        if(value===undefined||value===null||value===false||name==='suppressHydrationWarning'||name==='precedence')continue
        element.setAttribute(aliases[name]??name,typeof value==='boolean'?'':String(value))
      }
      if(tag.children!==undefined)element.textContent=String(tag.children)
      const same=old.find(node=>node instanceof Element&&node.isEqualNode(element))
      return same??element
    })
    for(const node of old)if(!next.includes(node as Element))node.remove()
    for(const node of next)document.head.insertBefore(node,end)
  },[tags])
  return null
}
