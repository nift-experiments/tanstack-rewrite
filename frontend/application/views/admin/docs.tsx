import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'
import { DocsCacheTab } from '~/components/admin/DocsCacheTab'

export const Route=createOwnedRouteBinding("/admin/docs");
export const routeOptions={
  component: DocsAdminPage,
}

function DocsAdminPage() {
  return (
    <div className="w-full p-4">
      <div className="mx-auto max-w-7xl">
        <DocsCacheTab />
      </div>
    </div>
  )
}
