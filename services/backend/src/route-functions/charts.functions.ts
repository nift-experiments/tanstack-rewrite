import { createServerFn } from '@tanstack/react-start'
export const getChartsCatalogOrderSeed = createServerFn({ method: 'GET' }).handler(
  () => globalThis.crypto.randomUUID(),
)
