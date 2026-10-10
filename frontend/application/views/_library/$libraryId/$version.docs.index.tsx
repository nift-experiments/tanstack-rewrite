import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { redirect, createFileRoute } from '@tanstack/react-router'
import { getLibrary } from '~/libraries'

export const Route=createOwnedRouteBinding("/_library/$libraryId/$version/docs/");
export const routeOptions={
  beforeLoad: (ctx) => {
    const { libraryId } = ctx.params
    const library = getLibrary(libraryId)

    throw redirect({
      from: '/$libraryId/$version/docs',
      to: './$',
      params: {
        _splat: 'defaultDocs' in library ? library.defaultDocs : 'overview',
      },
    })
  },
}
