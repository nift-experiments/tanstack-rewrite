import React from 'react'
import {PassThrough} from 'node:stream'
import {renderToPipeableStream,renderToString} from 'react-dom/server'
import {RouterProvider} from '@tanstack/react-router'
import {getRouter} from '../shell-proof/router'
export async function renderShell(initialPath:string,initialHtml:string,initialUser:unknown=null){
 const router=getRouter({initialPath,initialHtml,initialUser,server:true})
 await router.load()
 // Resolve retained lazy views first. Streaming Router output can contain
 // script-revealed segments even after allReady; publication must be visible
 // without those scripts. The second pass serializes the same loaded request
 // tree synchronously. Both passes belong to measurable publication rendering.
 await new Promise<void>((resolve,reject)=>{
  const output=new PassThrough()
  output.resume()
  output.on('end',resolve)
  output.on('error',reject)
  const stream=renderToPipeableStream(<RouterProvider router={router}/>,{
   onAllReady(){queueMicrotask(()=>stream.pipe(output))},onShellError:reject,onError:reject,
  })
 })
 const html=renderToString(<RouterProvider router={router}/>)
 if(/<template\b[^>]*(?:data-msg|data-dgst)/.test(html))throw Error('Unresolved publication Suspense boundary')
 return html
}
