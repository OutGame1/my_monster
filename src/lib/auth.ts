import type { Session } from './auth-client'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import db, { connectMongooseToDatabase } from '@/db'
import env from '@lib/env'
import { headers } from 'next/headers'

/**
 * Instance Better Auth configurée pour l'application
 *
 * Configuration:
 * - **Adapter**: MongoDB via Mongoose
 * - **Authentification locale**: Email + mot de passe activée
 * - **OAuth providers**:
 *   - GitHub (clientId + clientSecret depuis env)
 *   - Google (clientId + clientSecret depuis env)
 *
 * Cette instance expose l'API Better Auth pour:
 * - Gestion des sessions (`auth.api.getSession`, etc.)
 * - Mise à jour utilisateur (`auth.api.updateUser`)
 * - Routes d'authentification automatiques (signIn, signUp, signOut)
 *
 * @see https://www.better-auth.com/docs
 */
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
})

/**
 * Récupère la session utilisateur actuelle côté serveur
 *
 * Workflow:
 * 1. Connexion à MongoDB (si pas déjà connecté)
 * 2. Extraction des headers de la requête Next.js
 * 3. Appel à Better Auth pour valider et récupérer la session
 *
 * Utilisations typiques:
 * - Server Components pour protéger des pages
 * - Server Actions pour authentifier les mutations
 * - API Routes pour valider les requêtes
 *
 * @returns {Promise<Session | null>} Session utilisateur si authentifié, `null` sinon
 *
 * @example
 * // Dans un Server Component
 * const session = await getSession()
 * if (!session) {
 *   redirect('/sign-in')
 * }
 *
 * @example
 * // Dans un Server Action
 * const session = await getSession()
 * if (!session) {
 *   throw new Error('Utilisateur non authentifié')
 * }
 */
export async function getSession (): Promise<Session | null> {
  await connectMongooseToDatabase()

  return await auth.api.getSession({
    headers: await headers()
  })
}
