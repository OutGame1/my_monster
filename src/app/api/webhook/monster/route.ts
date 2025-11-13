import type { AnyBulkWriteOperation, Types } from 'mongoose'
import { connectMongooseToDatabase } from '@/db'
import Monster, { type IMonsterDocument } from '@/db/models/monster.model'
import { MONSTER_STATES } from '@/config/monsters.config'
import type { MonsterState } from '@/types/monsters'

const NON_HAPPY_STATES = MONSTER_STATES.filter(state => state !== 'happy')

const randomState = (): MonsterState => NON_HAPPY_STATES[Math.floor(Math.random() * NON_HAPPY_STATES.length)]

async function handleCronJob (): Promise<void> {
  try {
    await connectMongooseToDatabase()

    // Ensemble des IDs des monstres avec projection minimale
    const monsters: Array<{ _id: Types.ObjectId }> = await Monster.find({}, { _id: 1 }).lean().exec()

    if (monsters.length === 0) {
      console.log('⏭️  No monsters to update')
      return
    }

    console.log(`🔄 Starting monster state update for ${monsters.length} monsters`)

    // Prépare les opérations bulk
    const bulkOps = monsters.map<AnyBulkWriteOperation<IMonsterDocument>>(monster => {
      return {
        updateOne: {
          filter: { _id: monster._id },
          update: { $set: { state: randomState() } }
        }
      }
    })

    // On exécute en batch car c'est plus efficace qu'une boucle
    const result = await Monster.bulkWrite(bulkOps, { ordered: false })

    console.log('✅ Monster states updated successfully:', {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      total: monsters.length
    })
  } catch (error) {
    console.error('❌ Error updating monster states in cron job:', error)
  }
}

/**
 * Webhook Vercel Cron - Exécuté toutes les 15 minutes
 * Change aléatoirement l'état de tous les monstres
 */
export async function GET (): Promise<Response> {
  // Traitement asynchrone en arrière-plan
  void handleCronJob()
  return new Response()
}
