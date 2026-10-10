import {clearPublicationIsland} from 'owned-publication/PublicationHydrate'
import {installNativeNavigation} from 'owned-publication/native-navigation'
import {useRouter} from '@tanstack/react-router'
import * as React from 'react'
import {PublishedRegion} from 'owned-publication/PublishedRegion'
import {LandingPublicationMode} from './PublicationSlots'
const modules={
 ai:React.lazy(()=>import('retained-ui/components/landing/AiLanding')) ,
 charts:React.lazy(()=>import('retained-ui/components/landing/ChartsLanding')) ,
 cli:React.lazy(()=>import('retained-ui/components/landing/CliLanding')) ,
 config:React.lazy(()=>import('retained-ui/components/landing/ConfigLanding')) ,
 db:React.lazy(()=>import('retained-ui/components/landing/DbLanding')) ,
 devtools:React.lazy(()=>import('retained-ui/components/landing/DevtoolsLanding')) ,
 form:React.lazy(()=>import('retained-ui/components/landing/FormLanding')) ,
 highlight:React.lazy(()=>import('retained-ui/components/landing/HighlightLanding')) ,
 hotkeys:React.lazy(()=>import('retained-ui/components/landing/HotkeysLanding')) ,
 intent:React.lazy(()=>import('retained-ui/components/landing/IntentLanding')) ,
 markdown:React.lazy(()=>import('retained-ui/components/landing/MarkdownLanding')) ,
 pacer:React.lazy(()=>import('retained-ui/components/landing/PacerLanding')) ,
 query:React.lazy(()=>import('retained-ui/components/landing/QueryLanding')) ,
 ranger:React.lazy(()=>import('retained-ui/components/landing/RangerLanding')) ,
 router:React.lazy(()=>import('retained-ui/components/landing/RouterLanding')) ,
 start:React.lazy(()=>import('retained-ui/components/landing/StartLanding')) ,
 store:React.lazy(()=>import('retained-ui/components/landing/StoreLanding')) ,
 table:React.lazy(()=>import('retained-ui/components/landing/TableLanding')) ,
 virtual:React.lazy(()=>import('retained-ui/components/landing/VirtualLanding')) ,
 workflow:React.lazy(()=>import('retained-ui/components/landing/WorkflowLanding')) ,
}
export function LandingView({libraryId,data={}}:{libraryId:string;data?:any}){if(libraryId==='charts'&&!data.catalog)data={catalog:{revision:'pending-catalog',cases:[]},catalogOrderSeed:'publication-no-session'};const Component=modules[libraryId as keyof typeof modules];return Component?<React.Suspense fallback={null}><Component {...data}/></React.Suspense>:<main data-landing-source><h1>{libraryId}</h1><p role="status">This landing family remains in the parity gap ledger.</p></main>}
export function NativeLanding({html,libraryId,data}:{html:string;libraryId:string;data?:any}){const router=useRouter();const [hosts,setHosts]=React.useState(new Map<string,HTMLElement>());const activate=React.useCallback((host:HTMLDivElement)=>{const stopNavigation=installNativeNavigation(host,router);const next=new Map<string,HTMLElement>();for(const element of host.querySelectorAll<HTMLElement>('[data-landing-island]')){next.set(element.dataset.landingIsland!,element);clearPublicationIsland(element)}setHosts(next);return()=>{stopNavigation();setHosts(new Map())}},[router]);return <><PublishedRegion html={html} displayContents activate={activate}/><LandingPublicationMode.Provider value={{activate:true,hosts}}><LandingView libraryId={libraryId} data={data}/></LandingPublicationMode.Provider></>}
