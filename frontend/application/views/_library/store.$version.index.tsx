import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import StoreLanding from '~/components/landing/StoreLanding'
import {
  beforeLoadLibraryLanding,
  getLibraryLandingHead,
  getLibraryLandingHeaders,
  libraryLandingStaleTime,
  loadLibraryLandingRouteData,
} from '../-library-landing-route'

export const Route=createOwnedRouteBinding("/_library/store/$version/");
export const routeOptions={
  staleTime: libraryLandingStaleTime,
  beforeLoad: ({ params, location }) => {
    beforeLoadLibraryLanding('store', params.version, location.href)
  },
  loader: ({ params, context: { queryClient } }) =>
    loadLibraryLandingRouteData('store', params.version, queryClient),
  head: () => getLibraryLandingHead('store'),
  headers: () => getLibraryLandingHeaders('store'),
  component: StoreLandingRoute,
}

function StoreLandingRoute() {
  return <StoreLanding />
}
