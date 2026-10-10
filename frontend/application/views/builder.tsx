import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/builder");
export const routeOptions={
  beforeLoad: () => {
    throw redirect({ to: '/chat', replace: true, reloadDocument: true })
  },
}
