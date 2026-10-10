import { createServerFn } from '@tanstack/react-start'
export const getWorkshopSeed = createServerFn({ method: 'GET' }).handler(async () => {
  const now = Date.now()
  const tenSecondInterval = Math.floor(now / 10000) // Round down to 10-second intervals
  return tenSecondInterval.toString()
})
