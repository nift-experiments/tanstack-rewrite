import { createServerFn } from '@tanstack/react-start'
export const authorizeCliSession = createServerFn({ method: 'POST' })
  .validator((data: { ticketId: string }) => data)
  .handler(async ({ data: { ticketId } }) => {
    const [{ getRequest }, authIndex, cliTickets] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('~/auth/index.server'),
      import('~/auth/cli-tickets.server'),
    ])
    const {
      getAuthService,
      getSessionService,
      getUserRepository,
      SESSION_DURATION_MS,
    } = authIndex
    const { authorizeCliTicket, getCliTicket } = cliTickets
    const request = getRequest()

    const ticket = getCliTicket(ticketId)
    if (!ticket) {
      return { status: 'invalid' as const }
    }

    const authService = getAuthService()
    const user = await authService.getCurrentUser(request)
    if (!user) {
      return { status: 'unauthenticated' as const }
    }

    const userRepository = getUserRepository()
    const dbUser = await userRepository.findById(user.userId)
    if (!dbUser) {
      return { status: 'invalid' as const }
    }

    const sessionService = getSessionService()
    const expiresAt = Date.now() + SESSION_DURATION_MS
    const sessionToken = await sessionService.signCookie({
      userId: dbUser.id,
      expiresAt,
      version: dbUser.sessionVersion,
    })

    const authorized = authorizeCliTicket(ticketId, dbUser.id, sessionToken)
    if (!authorized) {
      return { status: 'invalid' as const }
    }

    return { status: 'authorized' as const, name: user.name ?? user.email }
  })
