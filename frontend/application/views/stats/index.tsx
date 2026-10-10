import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { redirect, createFileRoute } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/stats/");
export const routeOptions={
  beforeLoad: () => {
    throw redirect({ to: '/stats/npm' })
  },
}
