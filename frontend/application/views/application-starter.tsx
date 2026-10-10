import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route=createOwnedRouteBinding("/application-starter");
export const routeOptions={
  head: () => ({
    meta: seo({
      title: 'TanStack Application Starter',
      description: 'Build amazing applications with TanStack',
    }),
  }),
  component: () => <Outlet />,
}
