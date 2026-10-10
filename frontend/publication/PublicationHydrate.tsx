import * as React from 'react'
import {Hydrate as OriginalHydrate} from '@tanstack/react-start'

const PublicationPortal=React.createContext(false)
export function publicationPortal(children:React.ReactNode){return <PublicationPortal.Provider value>{children}</PublicationPortal.Provider>}
function ActivatedContent({children,onHydrated}:{children:React.ReactNode;onHydrated?:()=>void}){React.useEffect(()=>{onHydrated?.()},[onHydrated]);return children}
// Start's deferred boundary assumes React hydrates existing SSR nodes. A Nift
// portal is a new mount in an explicitly activated region: deferring it again
// would replace the published content with an offscreen skeleton. Activate its
// children with the same wrapper/Suspense contract; ordinary Start boundaries
// retain the original strategy. This eager work belongs in pipeline measurements.
export function Hydrate(props:React.ComponentProps<typeof OriginalHydrate>){
 const activated=React.useContext(PublicationPortal)
 if(!activated)return <OriginalHydrate {...props}/>
 return <div><React.Suspense fallback={props.fallback??null}><ActivatedContent onHydrated={props.onHydrated}>{props.children}</ActivatedContent></React.Suspense></div>
}
