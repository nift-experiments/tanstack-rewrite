import React from 'react'
import {createRootRouteWithContext,createRoute,createRouter,Outlet,useRouter,createMemoryHistory} from '@tanstack/react-router'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {Footer} from 'retained-ui/components/Footer'
import {Navbar} from 'retained-ui/components/Navbar'
import {ThemeProvider} from 'retained-ui/components/ThemeProvider'
import {SearchProvider} from 'retained-ui/contexts/SearchContext'
import {LoginModalProvider} from 'retained-ui/contexts/LoginModalContext'
import {LibrariesOverlayProvider} from 'retained-ui/contexts/LibrariesOverlayContext'
import {ToastProvider} from 'retained-ui/components/ToastProvider'
import {PublishedRegion} from 'owned-publication/PublishedRegion'
import {LibraryPublication} from 'owned-layout/LibraryPublication'
export function getRouter(options:{initialPath?:string;initialHtml?:string;server?:boolean;initialUser?:any;metadata?:any;config?:any;partnerSeed?:string}={}){
const queryClient=new QueryClient()
const initialPath=options.initialPath??window.location.pathname
let initialAvailable=true
const initialHtml=options.initialHtml??document.querySelector('#publication')!.innerHTML
function Frame(){return <QueryClientProvider client={queryClient}><ThemeProvider><SearchProvider><LoginModalProvider><ToastProvider><LibrariesOverlayProvider><Navbar><Outlet/><Footer/></Navbar></LibrariesOverlayProvider></ToastProvider></LoginModalProvider></SearchProvider></ThemeProvider></QueryClientProvider>}
const root=createRootRouteWithContext<any>()({component:Frame,beforeLoad:()=>({user:options.initialUser??null}),loader:()=>({partnerPlacementSessionSeed:options.partnerSeed??'layout-proof-unseeded'})})
const docs=createRoute({getParentRoute:()=>root,path:'/$libraryId/$version/docs',component:Outlet});const doc=createRoute({getParentRoute:()=>docs,path:'framework/$framework/$',loader:async({location})=>{if(initialAvailable&&location.pathname===initialPath){initialAvailable=false;return initialHtml;}const response=await fetch('/publication'+location.pathname+'.html',{cache:'no-cache'});if(!response.ok)throw Error('Publication not available in isolated shell proof');return response.text()},component:()=>{const html=doc.useLoaderData(),router=useRouter();const activate=React.useCallback((host:HTMLDivElement)=>{const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const link=(event.target as Element).closest('a');if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||!/^\/[^/]+\/[^/]+\/docs\/framework\/[^/]+\//.test(url.pathname)||url.pathname===location.pathname)return;event.preventDefault();router.navigate({to:url.pathname,hash:url.hash.slice(1)})};host.addEventListener('click',click);return ()=>host.removeEventListener('click',click)},[router]);const path=router.state.location.pathname;return <LibraryPublication html={html} record={options.metadata[path]} config={options.config} activate={activate}/>}})
return createRouter({routeTree:root.addChildren([docs.addChildren([doc])]),context:{queryClient},defaultPreload:false,...(options.server?{history:createMemoryHistory({initialEntries:[initialPath]}),isServer:true}:{})})}

