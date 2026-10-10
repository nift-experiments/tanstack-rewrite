import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/ds/maintainers");
export const routeOptions={
  beforeLoad: () => {
    throw redirect({ to: '/ds/avatar', hash: 'maintainer-card' })
  },
}
