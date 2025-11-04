import { prettifyError } from 'zod'
import { publicEnvSchema } from '@/lib/zod_schemas/env.schema'

const parsed = publicEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid public environment variables:', prettifyError(parsed.error))
  throw new Error('Invalid public environment variables')
}

export default parsed.data
