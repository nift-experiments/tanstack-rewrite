import {createServerFn} from '@tanstack/react-start';import {getRequest} from '@tanstack/react-start/server';import {getAuthService,getAuthGuards,type Capability} from './auth-bindings.server';
export const getCurrentUser = createServerFn({ method: 'POST' }).handler(
  async () => {
    const request = getRequest()
    const authService = getAuthService()

    return authService.getCurrentUser(request)
  },
)

export const requireAuth = createServerFn({ method: 'POST' }).handler(
  async () => {
    const request = getRequest()
    const guards = getAuthGuards()

    return guards.requireAuth(request)
  },
)

export const requireCapability = createServerFn({ method: 'POST' })
  .validator((data: { capability: string }) => ({
    capability: data.capability as Capability,
  }))
  .handler(async ({ data: { capability } }) => {
    const request = getRequest()
    const guards = getAuthGuards()

    return guards.requireCapability(request, capability)
  })

