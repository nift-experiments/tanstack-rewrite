import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'
import { NotFound } from '~/components/NotFound'

export const Route=createOwnedRouteBinding("/blog");
export const routeOptions={
  head: () => ({
    meta: seo({
      title: 'Blog | TanStack',
      description: 'The latest news and blog posts from TanStack!',
    }),
  }),
}

export function PostNotFound() {
  return <NotFound />
}
