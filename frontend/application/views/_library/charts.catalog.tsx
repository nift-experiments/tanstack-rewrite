import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { docsConfigQueryOptions } from '~/queries/docsConfig'

export const Route=createOwnedRouteBinding("/_library/charts/catalog");
export const routeOptions={
  staleTime: 1000 * 60 * 5,
  loader: async ({ context: { queryClient } }) => ({
    config: await queryClient.ensureQueryData(
      docsConfigQueryOptions('charts', 'latest'),
    ),
    version: 'latest',
  }),
  component: ChartsCatalogLayout,
}

function ChartsCatalogLayout() {
  return <Outlet />
}
