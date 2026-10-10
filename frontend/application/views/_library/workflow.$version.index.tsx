import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import WorkflowLanding from '~/components/landing/WorkflowLanding'
import {
  beforeLoadLibraryLanding,
  getLibraryLandingHead,
  getLibraryLandingHeaders,
  libraryLandingStaleTime,
  loadLibraryLandingRouteData,
} from '../-library-landing-route'

export const Route=createOwnedRouteBinding("/_library/workflow/$version/");
export const routeOptions={
  staleTime: libraryLandingStaleTime,
  beforeLoad: ({ params, location }) => {
    beforeLoadLibraryLanding('workflow', params.version, location.href)
  },
  loader: ({ params, context: { queryClient } }) =>
    loadLibraryLandingRouteData('workflow', params.version, queryClient),
  head: () => getLibraryLandingHead('workflow'),
  headers: () => getLibraryLandingHeaders('workflow'),
  component: WorkflowLandingRoute,
}

function WorkflowLandingRoute() {
  return <WorkflowLanding />
}
