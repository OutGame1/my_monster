import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { monsterSerializer } from '@/lib/serializers/monster.serializer'
import { NextRequest } from 'next/server'

/**
 * Endpoint GET renvoyant un monstre appartenant à l'utilisateur authentifié via son identifiant.
 *
 * @param request Requête HTTP entrante contenant le paramètre `id`.
 * @returns {Promise<Response>} Réponse JSON avec le monstre ou code d'erreur approprié.
 */
export async function GET (request: NextRequest): Promise<Response> {
  const session = await getSession()

  if (session === null) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Récupération de l'identifiant du monstre dans la query string
  const searchParams = request.nextUrl.searchParams
  const monsterId = searchParams.get('id')

  if (monsterId === null) {
    return new Response('Monster ID required', { status: 400 })
  }

  const monster = await Monster.findOne({
    _id: monsterId,
    ownerId: session.user.id
  }).exec()

  if (monster === null) {
    return new Response('Monster not found', { status: 404 })
  }

  return Response.json(monsterSerializer(monster))
}
