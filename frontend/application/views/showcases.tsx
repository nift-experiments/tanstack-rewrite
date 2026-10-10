import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { redirect, createFileRoute } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/showcases");
export const routeOptions={
  beforeLoad: ({ location }) => {
    throw redirect({
      href: location.href.replace(/^\/showcases/, '/showcase'),
    })
  },
}
