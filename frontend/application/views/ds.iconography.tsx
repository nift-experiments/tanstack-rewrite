import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route=createOwnedRouteBinding("/ds/iconography");
export const routeOptions={
  head: () => ({
    meta: seo({
      title: 'Iconography | TanStack Design System',
      description:
        'Browse the full Phosphor icon library — the systematic icon set for TanStack, in all six weights.',
    }),
  }),
}
