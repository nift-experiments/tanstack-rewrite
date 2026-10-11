import {RootChrome} from 'owned-layout/RootChrome'
import {DefaultCatchBoundary} from 'retained-ui/components/DefaultCatchBoundary'
import {NotFound} from 'retained-ui/components/NotFound'
import {publicationDocsHead} from 'owned-layout/DocsHead'
import {publicationRootHead} from 'owned-layout/DocumentHead'
import {DocComponent,DocComponentProvider} from 'owned-doc-components/DocComponents'
import {installNativeNavigation} from 'owned-publication/native-navigation'
import {LibraryPublication} from 'owned-layout/LibraryPublication'
import {getLibrary} from 'retained-ui/libraries'
import React from 'react'
import {createRootRouteWithContext,createRoute,createRouter,Outlet,useRouter,useLoaderData,createMemoryHistory,redirect} from '@tanstack/react-router'
import {QueryClient} from '@tanstack/react-query'
export function getRouter(options:{runtimeIslandPublication?:{phase:string;html:string};runtimeErrorPublication?:boolean;preparePublication?:boolean;applicationPublication?:{phase:string;html:string};includeApplications?:boolean;initialPath?:string;initialHtml?:string;server?:boolean;initialUser?:any;metadata?:any;config?:any;configs?:any;partnerSeed?:string;recentPosts?:any[];prepareHome?:boolean;prepareLanding?:boolean;prepareMarketing?:boolean;prepareDocComponent?:any;landingData?:any}={}){
const queryClient=new QueryClient()
const initialLocation=options.initialPath??(window.location.pathname+window.location.search)
const initialPath=initialLocation.split(/[?#]/)[0]
let initialAvailable=true
const initialHtml=options.initialHtml??document.querySelector('#publication')!.innerHTML
function Frame({children}:{children:React.ReactNode}){return <RootChrome queryClient={queryClient}><DocComponentProvider>{false}{children}</DocComponentProvider></RootChrome>}
const root=createRootRouteWithContext<any>()({component:Outlet,shellComponent:Frame,errorComponent:DefaultCatchBoundary,notFoundComponent:()=> <NotFound/>,head:publicationRootHead,staleTime:Infinity,headers:()=>({'Cache-Control':'public, max-age=0, must-revalidate','Cloudflare-CDN-Cache-Control':'no-store'}),beforeLoad:()=>({user:options.initialUser??null}),loader:()=>({partnerPlacementSessionSeed:options.partnerSeed??'layout-proof-unseeded'})})
const docs=createRoute({getParentRoute:()=>root,path:'/$libraryId/$version/docs',staticData:{publicationNativeVersion:true},component:Outlet});const doc=createRoute({getParentRoute:()=>docs,path:'framework/$framework/$',staticData:{ownsCanonicalLink:true},headers:({loaderData,match}:any)=>options.metadata?.[match.pathname]?.headers??{},head:({match,params}:any)=>publicationDocsHead(options.metadata?.[match.pathname],params),loader:async({location})=>{if(initialAvailable&&location.pathname===initialPath){initialAvailable=false;return initialHtml;}const metaResponse=await fetch('/publication-meta'+location.pathname+'.json',{cache:'no-cache'});if(metaResponse.ok){const projection=await metaResponse.json();options.metadata??={};options.metadata[location.pathname]=projection.record;options.configs??={};options.configs[location.pathname.split('/').slice(1,3).join('/')]=projection.config;}const response=await fetch('/publication'+location.pathname+'.html',{cache:'no-cache'});if(!response.ok)throw Error('Publication not available in isolated shell proof');return response.text()},component:()=>{const html=useLoaderData({strict:false}),router=useRouter();const activate=React.useCallback((host:HTMLDivElement)=>{return installNativeNavigation(host,router)},[router]);const path=router.state.location.pathname;if(options.prepareDocComponent)return <div data-doc-component-projection><DocComponent {...options.prepareDocComponent}/></div>;return <LibraryPublication html={html} record={options.metadata[path]} config={options.configs?.[path.split('/').slice(1,3).join('/')]??options.configs?.[path.split('/')[1]]??options.config} activate={activate}/>}})
const docsIndex=createRoute({getParentRoute:()=>docs,path:'/',beforeLoad:({params})=>{const {libraryId,version}=params as any,library=getLibrary(libraryId);throw redirect({to:`/${libraryId}/${version}/docs/${'defaultDocs' in library?library.defaultDocs:'overview'}`})}});
const genericDoc=createRoute({getParentRoute:()=>docs,path:'$',staticData:doc.options.staticData,head:doc.options.head,loader:doc.options.loader,component:doc.options.component});
const router=createRouter({routeTree:root.addChildren([docs.addChildren([docsIndex,doc,genericDoc])]),context:{queryClient},defaultPreload:false,history:createMemoryHistory({initialEntries:[initialLocation]}),isServer:true});return router}
