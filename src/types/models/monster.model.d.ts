import type { Document, Model, Types, Schema, AnyBulkWriteOperation } from 'mongoose'
import type {
  MonsterArmType,
  MonsterBodyShape,
  MonsterEyeShape,
  MonsterLegType,
  MonsterMouthType, MonsterState
} from '@/types/monsters'

/**
 * Interface du document mongoose représentant les traits d'un monstre.
 */
export interface IMonsterTraitsDocument extends Document<Types.ObjectId> {
  bodyShape: MonsterBodyShape
  eyeType: MonsterEyeShape
  mouthType: MonsterMouthType
  armType: MonsterArmType
  legType: MonsterLegType
  primaryColor: string // Hex color for body
  secondaryColor: string // Hex color for accents/details
  outlineColor: string // Hex color for outlines (usually dark)
  size: number // 80-120 scale percentage
}

/**
 * Interface du document mongoose représentant un monstre.
 */
export interface IMonsterDocument extends Document<Types.ObjectId> {
  name: string
  level: number
  xp: number
  maxXp: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  backgroundId: string | null // ID du background équipé (référence au catalogue)
  isPublic: boolean
  ownerId: Types.ObjectId
  lastCaredAt?: Date // Dernière fois qu'on s'est occupé du monstre (pour quête daily)
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface du document mongoose représentant un monstre de la galerie publique
 * avec les informations de l'utilisateur propriétaire.
 */
export interface IPublicMonsterDocument extends Document<Types.ObjectId> {
  name: string
  level: number
  traits: IMonsterTraitsDocument
  state: MonsterState
  backgroundId: string | null
  createdAt: Date
  ownerName: string // Nom de l'utilisateur propriétaire (jointure sur 'user')
}

/**
 * Type mongoose pour le schéma des traits d'un monstre.
 */
export type IMonsterTraitsSchema = Schema<IMonsterTraitsDocument>

/**
 * Interface du modèle mongoose pour les monstres.
 */
export type IMonsterModel = Model<IMonsterDocument>

/**
 * Type mongoose pour le schéma d'un monstre.
 */
export type IMonsterSchema = Schema<IMonsterDocument, IMonsterModel>

/**
 * Type mongoose pour les opérations de bulk write sur les monstres.
 */
export type MonsterBulkWriteOperation = AnyBulkWriteOperation<IMonsterDocument>
