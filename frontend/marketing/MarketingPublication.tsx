import * as React from 'react'
import {useRouter} from '@tanstack/react-router'
import {PublishedRegion} from 'owned-publication/PublishedRegion'
import {installNativeNavigation} from 'owned-publication/native-navigation'
import {LandingPublicationMode,publicationChildren} from './PublicationSlots'
import * as view0 from './views/ads'
import * as view1 from './views/brand-guide'
import * as view2 from './views/ethos'
import * as view3 from './views/learn'
import * as view4 from './views/merch'
import * as view5 from './views/paid-support'
import * as view6 from './views/privacy'
import * as view7 from './views/support'
import * as view8 from './views/tenets'
import * as view9 from './views/terms'
import * as view10 from './views/partners-embed'
import * as view11 from './views/partners.netlify'
import * as view12 from './views/partners.railway'
import * as view13 from './views/partners.render'
export const marketingViews={"/ads":view0,"/brand-guide":view1,"/ethos":view2,"/learn":view3,"/merch":view4,"/paid-support":view5,"/privacy":view6,"/support":view7,"/tenets":view8,"/terms":view9,"/partners-embed":view10,"/partners/netlify":view11,"/partners/railway":view12,"/partners/render":view13}
export function MarketingViewContent({children}:{children:React.ReactNode}){const mode=React.useContext(LandingPublicationMode);return mode.activate?<>{publicationChildren(children,true,'marketing')}</>:<div data-marketing-source style={{display:'contents'}}>{publicationChildren(children,false,'marketing')}</div>}
export function MarketingView({pathname}:{pathname:string}){const view=marketingViews[pathname as keyof typeof marketingViews];if(!view)throw Error('Unknown maintained marketing view '+pathname);const Component=view.default;return <Component/>}
export function NativeMarketing({html,pathname}:{html:string;pathname:string}){const router=useRouter(),[hosts,setHosts]=React.useState(new Map<string,HTMLElement>());const activate=React.useCallback((host:HTMLDivElement)=>{const stop=installNativeNavigation(host,router),next=new Map<string,HTMLElement>();for(const element of host.querySelectorAll<HTMLElement>('[data-landing-island]')){next.set(element.dataset.landingIsland!,element);element.replaceChildren()}setHosts(next);return()=>{stop();setHosts(new Map())}},[router]);return <><PublishedRegion html={html} displayContents activate={activate}/><LandingPublicationMode.Provider value={{activate:true,hosts}}><MarketingView pathname={pathname}/></LandingPublicationMode.Provider></>}
