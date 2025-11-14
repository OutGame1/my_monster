import { Schema, Types, models, model } from 'mongoose'
import type { IQuestModel, IQuestSchema } from '@/types/models/quest.model'
import { questObjectives, questsIdMap, questsObjectiveMap } from '@/config/quests.config'
import type { QuestDefinition, QuestObjective } from '@/types/quests'

const questSchema: IQuestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  questId: {
    type: String,
    required: true
  },
  questObjective: {
    type: String,
    required: true,
    enum: questObjectives
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date
  },
  claimedAt: {
    type: Date
  },
  lastResetAt: {
    type: Date
  }
}, {
  versionKey: false,
  timestamps: false,
  methods: {
    async claim (): Promise<void> {
      if (this.completedAt === undefined) {
        throw new Error('La quête n\'est pas encore complétée')
      }

      if (this.claimedAt !== undefined) {
        throw new Error('Vous avez déjà réclamé cette récompense')
      }

      this.claimedAt = new Date()

      await this.save()
    }
  },
  statics: {
    async updateQuests (
      userId: string | Types.ObjectId,
      questObjective: QuestObjective,
      progress: number | ((progress: number) => number)
    ): Promise<void> {
      for (const { id: questId } of questsObjectiveMap[questObjective]) {
        let quest = await QuestModel.findOne({ userId, questId }).exec()

        if (quest === null) {
          // On créer la quête si elle n'existe pas encore
          quest = new QuestModel({
            userId,
            questId,
            questObjective
          })
        }

        // Ne pas mettre à jour si déjà complété
        if (quest.completedAt !== undefined) {
          continue
        }

        quest.progress = typeof progress === 'number' ? progress : progress(quest.progress)

        await quest.save()
      }
    }
  },
  virtuals: {
    quest: {
      get (): QuestDefinition {
        const quest = questsIdMap.get(this.questId)
        if (quest === undefined) {
          throw new Error(`Quest definition not found for questId: ${this.questId}`)
        }
        return quest
      }
    }
  }
})

// Index composé pour retrouver rapidement les quêtes d'un utilisateur
questSchema.index({ userId: 1, questId: 1 }, { unique: true })

/**
 * Hook pre-save : Marque automatiquement la quête comme complétée
 * lorsque la progression atteint la cible
 */
questSchema.pre('save', function (next) {
  if (this.progress >= this.quest.target) {
    // On ramène la progression à la cible maximale pour éviter que ça déborde
    this.progress = this.quest.target

    if (this.completedAt === undefined) {
      // Complétion de la quête
      this.completedAt = new Date()
    }
  }

  next()
})

const QuestModel: IQuestModel = models.Quest as IQuestModel ?? model('Quest', questSchema)

export default QuestModel
