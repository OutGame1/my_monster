import { connectMongooseToDatabase } from '@/db'
import Quest from '@/db/models/quest.model'
import { dailyQuests } from '@/config/quests.config'
import cronRoute from '@/lib/cron'

/**
 * Supprime toutes les quêtes quotidiennes de tous les utilisateurs
 */
async function handleCronJob (): Promise<void> {
  try {
    await connectMongooseToDatabase()

    // Extraire les IDs de toutes les quêtes quotidiennes
    const dailyQuestIds = dailyQuests.map(quest => quest.id)

    console.log(`🗑️  Starting daily quests reset for ${dailyQuestIds.length} quest types`)

    // Supprimer toutes les quêtes quotidiennes en une seule requête
    const result = await Quest.deleteMany({
      questId: { $in: dailyQuestIds }
    }).exec()

    console.log('✅ Daily quests reset successful:', {
      deleted: result.deletedCount,
      questTypes: dailyQuestIds.length
    })
  } catch (error) {
    console.error('❌ Error resetting daily quests in cron job:', error)
  }
}

export async function GET (req: Request): Promise<Response> {
  return await cronRoute(req, handleCronJob)
}
