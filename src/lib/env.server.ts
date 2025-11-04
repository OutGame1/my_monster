import { prettifyError } from 'zod'
import { serverEnvSchema } from '@/lib/zod_schemas/env.schema'

// Protection explicite contre l'usage côté client
if (typeof window !== 'undefined') {
  throw new Error('❌ SECURITY ERROR: env.server.ts cannot be imported on the client side. Use env.public.ts for public environment variables.')
}

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid server environment variables:', prettifyError(parsed.error))
  throw new Error('Invalid server environment variables')
}

export default parsed.data
