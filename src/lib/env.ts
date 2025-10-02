import { z } from 'zod'
import envSchema from '@lib/zod_schemas/env.schema'

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(z.prettifyError(parsed.error))
  process.exit(1)
}

export default parsed.data
