import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import { ChartsCatalog } from '~/components/charts/ChartsCatalogPages'
import { getChartsCatalogAll } from '~/utils/charts-catalog.functions'
import { seo } from '~/utils/seo'

export const Route=createOwnedRouteBinding("/_library/charts/catalog/");
export const routeOptions={
  loader: () => getChartsCatalogAll(),
  component: ChartsCatalogIndexRoute,
  head: () => ({
    meta: seo({
      title: 'Charts Catalog | TanStack',
      description: 'Executable TanStack Charts examples.',
    }),
  }),
}

function ChartsCatalogIndexRoute() {
  const data = Route.useLoaderData()
  return <ChartsCatalog cases={data.cases} revision={data.revision} />
}
