import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import RangerLanding from '~/components/landing/RangerLanding'
import {
  beforeLoadLibraryLanding,
  getLibraryLandingHead,
  getLibraryLandingHeaders,
  libraryLandingStaleTime,
  loadLibraryLandingRouteData,
} from '../-library-landing-route'

export const Route=createOwnedRouteBinding("/_library/ranger/$version/");
export const routeOptions={
  staleTime: libraryLandingStaleTime,
  beforeLoad: ({ params, location }) => {
    beforeLoadLibraryLanding('ranger', params.version, location.href)
  },
  loader: ({ params, context: { queryClient } }) =>
    loadLibraryLandingRouteData('ranger', params.version, queryClient),
  head: () => getLibraryLandingHead('ranger'),
  headers: () => getLibraryLandingHeaders('ranger'),
  component: RangerLandingRoute,
}

function RangerLandingRoute() {
  return <RangerLanding />
}
