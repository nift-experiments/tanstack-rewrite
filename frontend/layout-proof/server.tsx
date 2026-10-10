import {THEME_BOOTSTRAP,HIGHLIGHT_THEME_CSS} from 'owned-layout/DocumentHead'
import {applicationBody,refreshApplicationRegion} from '../../publisher/application-regions'
import {requestHandler} from '@tanstack/react-start/server'
import {runWithStartContext} from '@tanstack/start-storage-context'
import {publicationBlogHead} from 'owned-blog/BlogPost'
import {marketingViews} from 'owned-marketing/MarketingPublication'
import React from 'react'
import {PassThrough} from 'node:stream'
import {renderToPipeableStream,renderToString} from 'react-dom/server'
import {RouterProvider,RouterContextProvider,HeadContent} from '@tanstack/react-router'
import {getRouter} from './router'
export async function renderShell(initialPath:string,initialHtml:string,initialUser:unknown=null,requestData:any={},transport?:{request:Request;fetch:(url:string,init:RequestInit)=>Promise<Response>;responseHeaders?:Headers}){
 if(transport){let renderStatus=200;let renderHeaders=new Headers();const response=await requestHandler(()=>runWithStartContext({request:transport.request,getRouter:()=>getRouter({initialPath,initialHtml,initialUser,...requestData,server:true}),startOptions:{serverFns:{fetch:transport.fetch}},contextAfterGlobalMiddlewares:{},executedRequestMiddlewares:new Set(),handlerType:"router"},async()=>{const html=await renderShell(initialPath,initialHtml,initialUser,{...requestData,onPublicationHeaders:(headers:Headers)=>{renderHeaders=headers},onPublicationStatus:(status:number)=>{renderStatus=status;requestData.onPublicationStatus?.(status)}});for(const [name,value]of transport.responseHeaders??[])renderHeaders.set(name,value);return new Response(html,{status:renderStatus,headers:renderHeaders})}))(transport.request);if(response.status>=300&&response.status<400)throw response;requestData.onPublicationStatus?.(response.status);requestData.onPublicationHeaders?.(response.headers);return response.text()}
 const applicationPublication=requestData.includeApplications?{phase:'prepare',html:initialHtml}:undefined
 const router=getRouter({initialPath,initialHtml,initialUser,...requestData,applicationPublication,server:true})
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
 if(applicationPublication&&(requestData.runtimeErrorPublication||router.state.matches.at(-1)?.staticData?.publicationFamily==='application')&&!requestData.prepareApplication){applicationPublication.html=initialHtml.includes('data-application-island')?refreshApplicationRegion(initialHtml,html):applicationBody(html);applicationPublication.phase='publish';html=renderToString(<RouterProvider router={router}/>)}
 if(/<template\b[^>]*(?:data-msg|data-dgst)/.test(html))throw Error('Unresolved publication Suspense boundary')
 return html
}

export {createPartnerPlacementSessionSeed} from 'retained-ui/utils/partner-placement'

export function marketingMetadata(){return Object.entries(marketingViews).map(([pathname,view])=>{const head=view.publicationHead(),title=head.meta?.find((meta:any)=>meta.title)?.title??pathname;return {pathname,title,head,staticData:view.publicationStaticData,headers:view.publicationHeaders()}})}

export function blogMetadata(post:any){return publicationBlogHead({loaderData:post})}

export {getRouter as createPublicationRouter}

export function applicationDefinitions(){const router=getRouter({initialPath:'/',initialHtml:'',includeApplications:true,server:true});return (router as any).publicationApplications.definitions()}
export function applicationContract(pathname:string){const router=getRouter({initialPath:pathname,initialHtml:'',includeApplications:true,server:true});const match=router.matchRoutes(pathname).at(-1);const route=match?router.routesById[match.routeId]:null;return (route?.options.staticData?.publicationFamily==='application'||route?.options.staticData?.publicationRedirect)?(router as any).publicationApplications.definitions().find((record:any)=>record.id===route.id):null}

export function publicationDocumentShellHead(){return '<script>'+THEME_BOOTSTRAP+'</script><style id="tanstack-highlight-theme">'+HIGHLIGHT_THEME_CSS+'</style><script defer src="https://namethathost.com/tracker.js" data-site="b7d91d66-ccee-480a-9d33-f7a9f109edc4" referrerpolicy="no-referrer"></script>'}
