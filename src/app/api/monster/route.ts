import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import monsterSerizalizer from '@/lib/serializers/monster.serializer'
import { NextRequest } from 'next/server'

export async function GET (request: NextRequest): Promise<Response> {
  await connectMongooseToDatabase()

  const session = await getSession()

  if (session === null) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get monster ID from query params
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

  return Response.json(monsterSerizalizer(monster))
}
