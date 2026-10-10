import {publicationAssetURL} from 'owned-publication/publication-urls'
import {applicationPublicationKey} from './publication-key'
import {createRoute, Outlet} from '@tanstack/react-router'
import hierarchy from './route-hierarchy.json'
import {applicationViews} from './registry'
import {configureOwnedRouteIdentity} from './RouteBinding'

// The inventory supplies identities/parents only. Views are maintained separately;
// the frozen generated upstream route implementation is never imported.
export function createApplicationRoutes(root:any,publication?:{phase:string;html:string},environment?:{server?:boolean;initialPath?:string;initialHtml?:string}) {
  const definitions=new Map(hierarchy.records.map(record=>[record.name,record]))
  const selected=new Set<string>()
  for(const definition of hierarchy.records) {
    if(!(definition.source in applicationViews))continue
    let current:any=definition
    while(current){selected.add(current.name);current=definitions.get(current.parent)}
  }
  const routes=new Map<string,any>(),bindings:Array<{pattern:string;route:any;view:any}>=[]
  const children=new Map<string,any[]>()
  function create(name:string):any {
    if(routes.has(name))return routes.get(name)
    const definition=definitions.get(name)!
    const parent=definition.parent==='rootRouteImport'?root:create(definition.parent)
    const view=(applicationViews as any)[definition.source]
    const Component=view?.options.component;
    const component=Component??Outlet;
    const route=createRoute({
      ...view?.options,
      getParentRoute:()=>parent,
      ...(definition.path!==undefined?{path:definition.path}:{id:definition.id}),
      component,
      staticData:{...view?.options.staticData},
    } as any)
    routes.set(name,route)
    if(view)bindings.push({pattern:view.pattern,route,view})
    const siblings=children.get(definition.parent)??[]
    siblings.push(route);children.set(definition.parent,siblings)
    return route
  }
  for(const name of selected)create(name)
  for(const [name,route]of routes)route.addChildren(children.get(name)??[])
  return {
    routes:children.get('rootRouteImport')??[],
    bind(router:any){
      for(const {pattern,route}of bindings)configureOwnedRouteIdentity(pattern,route)
      // A view with nested parameter routes can still be its own endpoint.
      // The initialized Router's actual index/priority rules are authoritative.
      for(const {pattern,route,view}of bindings){
        if(router.matchRoutes(route.fullPath).at(-1)?.routeId!==route.id)continue
        if(!view.options.component&&!view.options.beforeLoad)continue
        if(!view.options.component)route.options.staticData.publicationRedirect=true
        route.options.staticData.publicationFamily='application'
        if(environment?.server)continue
        const originalLoader=route.options.loader
        route.options.loader=async(context:any)=>{
          const data=await originalLoader?.(context)
          if(publication){
            if(environment?.initialPath?.split(/[?#]/)[0]===context.location.pathname&&environment.initialHtml?.includes('data-application-island'))publication.html=environment.initialHtml
            else{const response=await fetch(publicationAssetURL('/publication-applications/'+applicationPublicationKey(pattern)+'.html'));if(!response.ok)throw Error('Application family publication unavailable');publication.html=await response.text()}
          }
          return data
        }
      }
    },
    count:bindings.length,
    definitions:()=>bindings.map(({pattern,route})=>({pattern,id:route.id,pathname:route.fullPath,leaf:route.options.staticData?.publicationFamily==='application',redirect:Boolean(route.options.staticData?.publicationRedirect),publicationKey:applicationPublicationKey(pattern)})),
  }
}
