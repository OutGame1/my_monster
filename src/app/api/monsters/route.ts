import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { monsterSerializer } from '@/lib/serializers/monster.serializer'

/**
 * Endpoint GET listant tous les monstres appartenant à l'utilisateur authentifié.
 *
 * @returns {Promise<Response>} Réponse JSON contenant la collection sérialisée de monstres.
 */
export async function GET (): Promise<Response> {
  await connectMongooseToDatabase()

  const session = await getSession()

  if (session === null) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monsters = await Monster.find({ ownerId: session.user.id }).exec()

  return Response.json(monsters.map(monsterSerializer))
}
