import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/builder_/p/$hash");
export const routeOptions={
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/chat/p/$hash',
      params: { hash: params.hash },
      replace: true,
      reloadDocument: true,
    })
  },
}
