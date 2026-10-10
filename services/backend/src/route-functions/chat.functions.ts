import { createServerFn } from '@tanstack/react-start'
export const initialAppearance = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { readInitialAppearance } =
      await import('~/chat/server/appearance-html')
    return readInitialAppearance()
  },
)
