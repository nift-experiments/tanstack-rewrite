import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/builder_/$id");
export const routeOptions={
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/chat/project/$projectId',
      params: { projectId: params.id },
      replace: true,
      reloadDocument: true,
    })
  },
}
