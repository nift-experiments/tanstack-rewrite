import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import HighlightLanding from '~/components/landing/HighlightLanding'
import {
  beforeLoadLibraryLanding,
  getLibraryLandingHead,
  getLibraryLandingHeaders,
  libraryLandingStaleTime,
  loadLibraryLandingRouteData,
} from '../-library-landing-route'

export const Route=createOwnedRouteBinding("/_library/highlight/$version/");
export const routeOptions={
  staleTime: libraryLandingStaleTime,
  beforeLoad: ({ params, location }) => {
    beforeLoadLibraryLanding('highlight', params.version, location.href)
  },
  loader: ({ params, context: { queryClient } }) =>
    loadLibraryLandingRouteData('highlight', params.version, queryClient),
  head: () => getLibraryLandingHead('highlight'),
  headers: () => getLibraryLandingHeaders('highlight'),
  component: HighlightLandingRoute,
}

function HighlightLandingRoute() {
  return <HighlightLanding />
}
