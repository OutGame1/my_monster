import { z } from 'zod'

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),

  MONGODB_HOST: z.url(),
  MONGODB_DB_NAME: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string()
})

export default envSchema
