import {publicationAssetURL} from 'owned-publication/publication-urls'
import {applicationPublicationKey} from './publication-key'
import {ApplicationPublication} from './ApplicationPublication'
import * as React from 'react'
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
  const routes=new Map<string,any>(),bindings:Array<{pattern:string;route:any}>=[]
  const children=new Map<string,any[]>()
  function create(name:string):any {
    if(routes.has(name))return routes.get(name)
    const definition=definitions.get(name)!
    const parent=definition.parent==='rootRouteImport'?root:create(definition.parent)
    const view=(applicationViews as any)[definition.source]
    const Component=view?.options.component;const isLeaf=!hierarchy.records.some(record=>record.parent===name&&selected.has(record.name));
    const component=Component??Outlet;
    const route=createRoute({
      ...view?.options,
      getParentRoute:()=>parent,
      ...(definition.path!==undefined?{path:definition.path}:{id:definition.id}),
      component,
      ...(Component&&isLeaf&&!environment?.server?{loader:async(context:any)=>{const data=await view?.options.loader?.(context);if(publication){if(environment?.initialPath?.split(/[?#]/)[0]===context.location.pathname&&environment.initialHtml?.includes('data-application-island'))publication.html=environment.initialHtml;else{const response=await fetch(publicationAssetURL('/publication-applications/'+applicationPublicationKey(view.pattern)+'.html'));if(!response.ok)throw Error('Application family publication unavailable');publication.html=await response.text()}}return data}}:{}),
      staticData:{...view?.options.staticData,...(Component&&isLeaf?{publicationFamily:'application'}:{})},
    } as any)
    routes.set(name,route)
    if(view)bindings.push({pattern:view.pattern,route})
    const siblings=children.get(definition.parent)??[]
    siblings.push(route);children.set(definition.parent,siblings)
    return route
  }
  for(const name of selected)create(name)
  for(const [name,route]of routes)route.addChildren(children.get(name)??[])
  return {
    routes:children.get('rootRouteImport')??[],
    bind(){for(const {pattern,route}of bindings)configureOwnedRouteIdentity(pattern,route)},
    count:bindings.length,
    definitions:()=>bindings.map(({pattern,route})=>({pattern,id:route.id,pathname:route.fullPath,leaf:route.options.staticData?.publicationFamily==='application',publicationKey:applicationPublicationKey(pattern)})),
  }
}
