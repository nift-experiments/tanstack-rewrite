import { createFileRoute } from '@tanstack/react-router'
import { appBuildId } from '~/chat/core/app-version'
import {getCurrentHostRuntimeEnv} from '~/server/runtime/host.server'
export const Route = createFileRoute('/api/chat/app-version')({ server: { handlers: { GET: () => Response.json({ build: getCurrentHostRuntimeEnv()?.APP_BUILD_ID ?? appBuildId }, { headers: { 'Cache-Control': 'no-store' } }) } } })
