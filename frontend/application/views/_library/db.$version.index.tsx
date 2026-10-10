import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import DbLanding from '~/components/landing/DbLanding'
import {
  beforeLoadLibraryLanding,
  getLibraryLandingHead,
  getLibraryLandingHeaders,
  libraryLandingStaleTime,
  loadLibraryLandingRouteData,
} from '../-library-landing-route'

export const Route=createOwnedRouteBinding("/_library/db/$version/");
export const routeOptions={
  staleTime: libraryLandingStaleTime,
  beforeLoad: ({ params, location }) => {
    beforeLoadLibraryLanding('db', params.version, location.href)
  },
  loader: ({ params, context: { queryClient } }) =>
    loadLibraryLandingRouteData('db', params.version, queryClient),
  head: () => getLibraryLandingHead('db'),
  headers: () => getLibraryLandingHeaders('db'),
  component: DbLandingRoute,
}

function DbLandingRoute() {
  return <DbLanding />
}
