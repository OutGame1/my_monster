import type { Document, Model, Types, Schema, AnyBulkWriteOperation } from 'mongoose'
import type { QuestDefinition, QuestObjective } from '@/types/quests'

/**
 * Interface des méthodes d'instance pour les quêtes
 */
interface IQuestInstanceMethods {
  /**
   * Marque la quête comme réclamée
   */
  claim: () => Promise<void>
}

/**
 * Interface des méthodes statiques pour les quêtes
 */
interface IQuestStaticsMethods {
  /**
   * Met à jour la progression des quêtes pour objectif et un utilisateur donné.
   * @param userId - L'ID de l'utilisateur
   * @param questObjective - Le type d'objectif de quête à mettre à jour
   * @param progress - Il y a 2 cas possibles :
   *  - Un nombre : remplace la progression actuelle par ce nombre
   *  - Une fonction : reçoit la progression actuelle et doit retourner la nouvelle progression
   *
   * @example
   *  await updateQuests(userId, 'own_monsters', 5) // Définit la progression à 5
   *  await updateQuests(userId, 'own_monsters', (current) => current + 1) // Incrémente la progression de 1
   */
  updateQuests: (
    userId: string | Types.ObjectId,
    questObjective: QuestObjective,
    progress: number | ((progress: number) => number)
  ) => Promise<void>
}

/**
 * Interface des propriétés virtuelles pour les quêtes
 */
interface IQuestVirtuals {
  /**
   * La définition complète de la quête depuis la configuration
   */
  readonly quest: QuestDefinition
}

/**
 * Interface du document Mongoose pour les quêtes
 */
export interface IQuestDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId
  questId: string // ID de la quête depuis la config
  questObjective: QuestObjective // Type d'objectif de la quête
  progress: number // Progression actuelle
  completedAt?: Date // Date de complétion
  claimedAt?: Date // Date de réclamation
  lastResetAt?: Date // Pour les quêtes quotidiennes
}

/**
 * Type du modèle Mongoose pour les quêtes
 */
export type IQuestModel = Model<
IQuestDocument,
{}, // IQuestQueryHelpers
IQuestInstanceMethods,
IQuestVirtuals
> & IQuestStaticsMethods // https://mongoosejs.com/docs/typescript/statics-and-methods.html#with-generics

/**
 * Type du schéma Mongoose pour les quêtes
 */
export type IQuestSchema = Schema<
IQuestDocument,
IQuestModel,
IQuestInstanceMethods,
{}, // IQuestQueryHelpers
IQuestVirtuals,
IQuestStaticsMethods
>

/**
 * Type pour les opérations de bulk write sur les quêtes
 */
export type QuestBulkWriteOperation = AnyBulkWriteOperation<IQuestDocument>
