import {createOwnedRouteBinding} from 'owned-application/RouteBinding'
import { createFileRoute } from '@tanstack/react-router'

export const Route=createOwnedRouteBinding("/chat/c/$conversationId/m/$messageId");
export const routeOptions={}
