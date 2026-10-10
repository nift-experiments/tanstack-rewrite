import {getRouteApi} from '@tanstack/react-router'

// Each binding is tied to the reconstructed route, never the nearest match.
const identities = new Map<string, {id:string; fullPath:string}>()
export function configureOwnedRouteIdentity(sourceId:string, route:{id:string;fullPath:string}) {
  const previous = identities.get(sourceId)
  if (previous && (previous.id !== route.id || previous.fullPath !== route.fullPath)) {
    throw Error('Conflicting owned route identity '+sourceId)
  }
  identities.set(sourceId, {id:route.id, fullPath:route.fullPath})
}
export function createOwnedRouteBinding(sourceId:string) {
  const identity = () => {
    const value = identities.get(sourceId)
    if (!value) throw Error('Missing owned route identity '+sourceId)
    return value
  }
  const api = () => getRouteApi(identity().id as never)
  return {
    get id(){return identity().id},
    get fullPath(){return identity().fullPath},
    useLoaderData:(options?:any)=>api().useLoaderData(options),
    useParams:(options?:any)=>api().useParams(options),
    useSearch:(options?:any)=>api().useSearch(options),
    useNavigate:(options?:any)=>api().useNavigate(options),
  }
}
