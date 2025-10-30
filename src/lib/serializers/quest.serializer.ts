import type { IQuestDocument } from '@/db/models/quest.model'

export interface ISerializedQuestProgress {
  id: string
  userId: string
  questId: string
  progress: number
  completed: boolean
  claimed: boolean
  completedAt?: string
  claimedAt?: string
  lastResetAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Sérialise un document Mongoose QuestProgress en objet JSON simple.
 * Convertit les ObjectId en chaînes et les dates en ISO strings.
 *
 * @param {IQuestDocument} questProgress Document Mongoose à sérialiser.
 * @returns {ISerializedQuestProgress} Objet sérialisé sans références Mongoose.
 */
export default function questSerializer (
  questProgress: IQuestDocument
): ISerializedQuestProgress {
  return {
    id: questProgress._id.toString(),
    userId: questProgress.userId.toString(),
    questId: questProgress.questId,
    progress: questProgress.progress,
    completed: questProgress.completed,
    claimed: questProgress.claimed,
    completedAt: questProgress.completedAt?.toISOString(),
    claimedAt: questProgress.claimedAt?.toISOString(),
    lastResetAt: questProgress.lastResetAt?.toISOString(),
    createdAt: questProgress.createdAt.toISOString(),
    updatedAt: questProgress.updatedAt.toISOString()
  }
}
