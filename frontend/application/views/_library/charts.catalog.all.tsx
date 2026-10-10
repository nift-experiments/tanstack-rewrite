import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/_library/charts/catalog/all");
export const routeOptions={
  beforeLoad: () => {
    throw redirect({ to: '/charts/catalog' })
  },
}
