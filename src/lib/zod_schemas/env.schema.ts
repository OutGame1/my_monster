import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),

  MONGODB_HOST: z.url(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string()
})

export default envSchema
