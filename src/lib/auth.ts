import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/db'
import env from '@lib/env'

export const auth = betterAuth({
  database: mongodbAdapter(client.db(env.MONGODB_DB_NAME)),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  }
})
