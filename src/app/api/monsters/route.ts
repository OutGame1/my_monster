import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'

export async function GET (): Promise<Response> {
  const session = await getSession()

  if (session === null) {
    return new Response('Unauthorized', { status: 401 })
  }

  await connectMongooseToDatabase()
  const monsters = await Monster.find({ ownerId: session.user.id }).exec()

  // Sérialisation JSON pour éviter les problèmes de typage Next.js
  return Response.json(monsters)
}
