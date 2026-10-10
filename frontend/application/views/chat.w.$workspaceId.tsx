import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { App } from '~/chat/components/App'
import {
  validateWorkspaceSearch,
  defaultWorkspaceSearch,
} from '~/chat/core/navigation'

export const Route=createOwnedRouteBinding("/chat/w/$workspaceId");
export const routeOptions={
  validateSearch: validateWorkspaceSearch,
  search: { middlewares: [stripSearchParams(defaultWorkspaceSearch)] },
  component: App,
}
