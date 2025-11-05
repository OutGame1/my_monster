import type { Session } from './auth-client'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import db, { connectMongooseToDatabase } from '@/db'
import env from '@lib/env'
import { headers } from 'next/headers'

export const auth = betterAuth({
  database: mongodbAdapter(db),
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

export async function getSession (): Promise<Session | null> {
  await connectMongooseToDatabase()

  return await auth.api.getSession({
    headers: await headers()
  })
}
