import React from 'react'
import {PassThrough} from 'node:stream'
import {renderToPipeableStream,renderToString} from 'react-dom/server'
import {RouterProvider,RouterContextProvider,HeadContent} from '@tanstack/react-router'
import {getRouter} from './docs-preparation-router'
export async function renderShell(initialPath:string,initialHtml:string,initialUser:unknown=null,requestData:any={}){
 const router=getRouter({initialPath,initialHtml,initialUser,...requestData,server:true})
 await router.load()
 const routeHeaders=new Headers();for(const match of router.state.matches)for(const [name,value]of new Headers(match.headers))routeHeaders.set(name,value);requestData.onPublicationHeaders?.(routeHeaders)
 requestData.onPublicationHead?.({meta:router.state.matches.flatMap(match=>match.meta??[]),links:router.state.matches.flatMap(match=>match.links??[]),scripts:router.state.matches.flatMap(match=>match.scripts??[]),html:(router.state.matches.some(match=>match.staticData?.baseParent)?'<base target="_parent"/>':'')+renderToString(<RouterContextProvider router={router}><HeadContent/></RouterContextProvider>)})
 // Same redirect outcome used by the pinned Router request handler.
 const result=(router as any)._serverResult
 if(result?.type==='redirect')throw result.redirect
 requestData.onPublicationStatus?.(result?.type==='render'?result.status:200)
 // Resolve retained lazy views first. Streaming Router output can contain
 // script-revealed segments even after allReady; publication must be visible
 // without those scripts. The second pass serializes the same loaded request
 // tree synchronously. Both passes belong to measurable publication rendering.
 await new Promise<void>((resolve,reject)=>{
  const output=new PassThrough()
  output.resume()
  output.on('end',resolve)
  output.on('error',reject)
  let piped=false
  const stream=renderToPipeableStream(<RouterProvider router={router}/>,{
   onAllReady(){if(piped)return;piped=true;queueMicrotask(()=>stream.pipe(output))},onShellError:reject,onError:reject,
  })
 })
 let html=renderToString(<RouterProvider router={router}/>)
 if(/<template\b[^>]*(?:data-msg|data-dgst)/.test(html))throw Error('Unresolved publication Suspense boundary')
 return html
}
