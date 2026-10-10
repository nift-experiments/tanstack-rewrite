import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { App } from '~/chat/components/App'
import {
  defaultWorkspaceSearch,
  validateWorkspaceSearch,
} from '~/chat/core/navigation'

export const Route=createOwnedRouteBinding("/chat/c/$conversationId");
export const routeOptions={
  validateSearch: validateWorkspaceSearch,
  search: { middlewares: [stripSearchParams(defaultWorkspaceSearch)] },
  component: App,
}
