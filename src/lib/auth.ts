import type { Session } from './auth-client'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import db from '@/db'
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

export async function getSession (onNull: () => never = () => {
  throw new Error('User not authenticated')
}): Promise<Session> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null) {
    return onNull()
  }

  return session
}
