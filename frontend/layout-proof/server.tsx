import {applicationBody,refreshApplicationRegion} from '../../publisher/application-regions'
import {requestHandler} from '@tanstack/react-start/server'
import {runWithStartContext} from '@tanstack/start-storage-context'
import {publicationBlogHead} from 'owned-blog/BlogPost'
import {marketingViews} from 'owned-marketing/MarketingPublication'
import React from 'react'
import {PassThrough} from 'node:stream'
import {renderToPipeableStream,renderToString} from 'react-dom/server'
import {RouterProvider} from '@tanstack/react-router'
import {getRouter} from './router'
export async function renderShell(initialPath:string,initialHtml:string,initialUser:unknown=null,requestData:any={},transport?:{request:Request;fetch:(url:string,init:RequestInit)=>Promise<Response>}){
 if(transport){const response=await requestHandler(()=>runWithStartContext({request:transport.request,getRouter:()=>getRouter({initialPath,initialHtml,initialUser,...requestData,server:true}),startOptions:{serverFns:{fetch:transport.fetch}},contextAfterGlobalMiddlewares:{},executedRequestMiddlewares:new Set(),handlerType:"router"},async()=>new Response(await renderShell(initialPath,initialHtml,initialUser,requestData))))(transport.request);if(response.status>=300)throw response;return response.text()}
 const applicationPublication=requestData.includeApplications?{phase:'prepare',html:initialHtml}:undefined
 const router=getRouter({initialPath,initialHtml,initialUser,...requestData,applicationPublication,server:true})
 await router.load()
 requestData.onPublicationHead?.({meta:router.state.matches.flatMap(match=>match.meta??[]),links:router.state.matches.flatMap(match=>match.links??[]),scripts:router.state.matches.flatMap(match=>match.scripts??[])})
 // Same redirect outcome used by the pinned Router request handler.
 const result=(router as any)._serverResult
 if(result?.type==='redirect')throw result.redirect
 const failed=router.state.matches.find(match=>match.status==='error');if(failed)throw failed.error
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
 let html=renderToString(<RouterProvider router={router}/>)
 if(applicationPublication&&router.state.matches.at(-1)?.staticData?.publicationFamily==='application'&&!requestData.prepareApplication){applicationPublication.html=initialHtml.includes('data-application-island')?refreshApplicationRegion(initialHtml,html):applicationBody(html);applicationPublication.phase='publish';html=renderToString(<RouterProvider router={router}/>)}
 if(/<template\b[^>]*(?:data-msg|data-dgst)/.test(html))throw Error('Unresolved publication Suspense boundary')
 return html
}

export {createPartnerPlacementSessionSeed} from 'retained-ui/utils/partner-placement'

export function marketingMetadata(){return Object.entries(marketingViews).map(([pathname,view])=>{const head=view.publicationHead(),title=head.meta?.find((meta:any)=>meta.title)?.title??pathname;return {pathname,title,head,staticData:view.publicationStaticData,headers:view.publicationHeaders()}})}

export function blogMetadata(post:any){return publicationBlogHead({loaderData:post})}

export {getRouter as createPublicationRouter}

export function applicationDefinitions(){const router=getRouter({initialPath:'/',initialHtml:'',includeApplications:true,server:true});return (router as any).publicationApplications.definitions()}
export function applicationContract(pathname:string){const router=getRouter({initialPath:pathname,initialHtml:'',includeApplications:true,server:true});const match=router.matchRoutes(pathname).at(-1);const route=match?router.routesById[match.routeId]:null;return route?.options.staticData?.publicationFamily==='application'?(router as any).publicationApplications.definitions().find((record:any)=>record.id===route.id):null}
