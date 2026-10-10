import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { redirect, createFileRoute } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/_library/$libraryId/");
export const routeOptions={
  beforeLoad: ({ params }) => {
    throw redirect({
      href: `/${params.libraryId}/latest`,
    })
  },
}
