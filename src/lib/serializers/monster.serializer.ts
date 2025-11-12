import type {
  IMonsterDocument, IMonsterTraitsDocument, IPublicMonsterDocument,
  MonsterState, MonsterArmType, MonsterBodyShape,
  MonsterEyeShape, MonsterLegType, MonsterMouthType
} from '@/db/models/monster.model'

// Sérialisation des traits d'un monstre

export interface ISerializedMonsterTraits {
  bodyShape: MonsterBodyShape
  eyeType: MonsterEyeShape
  mouthType: MonsterMouthType
  armType: MonsterArmType
  legType: MonsterLegType
  primaryColor: string
  secondaryColor: string
  outlineColor: string
  size: number
}

function monsterTraitsSerializer (rawTraits: IMonsterTraitsDocument): ISerializedMonsterTraits {
  return {
    bodyShape: rawTraits.bodyShape,
    eyeType: rawTraits.eyeType,
    mouthType: rawTraits.mouthType,
    armType: rawTraits.armType,
    legType: rawTraits.legType,
    primaryColor: rawTraits.primaryColor,
    secondaryColor: rawTraits.secondaryColor,
    outlineColor: rawTraits.outlineColor,
    size: rawTraits.size
  }
}

// Sérialisation d'un monstre complet

export interface ISerializedMonster {
  _id: string
  name: string
  level: number
  xp: number
  maxXp: number
  traits: ISerializedMonsterTraits
  state: MonsterState
  backgroundId: string | null
  isPublic: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export function monsterSerializer (rawMonster: IMonsterDocument): ISerializedMonster {
  return {
    _id: rawMonster._id.toString(),
    name: rawMonster.name,
    level: rawMonster.level,
    xp: rawMonster.xp,
    maxXp: rawMonster.maxXp,
    traits: monsterTraitsSerializer(rawMonster.traits),
    state: rawMonster.state,
    backgroundId: rawMonster.backgroundId,
    isPublic: rawMonster.isPublic,
    ownerId: rawMonster.ownerId.toString(),
    createdAt: rawMonster.createdAt.toISOString(),
    updatedAt: rawMonster.updatedAt.toISOString()
  }
}

// Sérialisation d'un monstre public (pour la galerie)

export interface ISerializedPublicMonster {
  _id: string
  name: string
  level: number
  traits: ISerializedMonsterTraits
  state: MonsterState
  backgroundId: string | null
  createdAt: string
  ownerName: string
}

export function publicMonsterSerializer (rawMonster: IPublicMonsterDocument): ISerializedPublicMonster {
  return {
    _id: rawMonster._id.toString(),
    name: rawMonster.name,
    level: rawMonster.level,
    traits: monsterTraitsSerializer(rawMonster.traits),
    state: rawMonster.state,
    backgroundId: rawMonster.backgroundId,
    createdAt: rawMonster.createdAt.toISOString(),
    ownerName: rawMonster.ownerName
  }
}
