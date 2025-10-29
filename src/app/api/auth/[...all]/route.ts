import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Handlers Next.js redirigeant les requêtes GET/POST vers le moteur d'authentification Better Auth.
 */
export const { POST, GET } = toNextJsHandler(auth)
