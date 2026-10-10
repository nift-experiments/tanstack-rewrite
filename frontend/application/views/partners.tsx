import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/partners");
export const routeOptions={
  component: PartnersLayout,
}

function PartnersLayout() {
  return <Outlet />
}
