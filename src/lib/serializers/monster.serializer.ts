import type {
  IMonsterDocument, MonsterState,
  MonsterArmType, MonsterBodyShape,
  MonsterEyeShape, MonsterLegType,
  MonsterMouthType
} from '@/db/models/monster.model'

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

export interface ISerializedMonster {
  _id: string
  name: string
  level: number
  xp: number
  maxXp: number
  traits: ISerializedMonsterTraits
  state: MonsterState
  isPublic: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface ISerializedPublicMonster {
  _id: string
  name: string
  level: number
  traits: ISerializedMonsterTraits
  state: MonsterState
  createdAt: string
  ownerName: string
}

export default function monsterSerizalizer (rawMonster: IMonsterDocument): ISerializedMonster {
  return {
    _id: rawMonster._id.toString(),
    name: rawMonster.name,
    level: rawMonster.level,
    xp: rawMonster.xp,
    maxXp: rawMonster.maxXp,
    traits: {
      bodyShape: rawMonster.traits.bodyShape,
      eyeType: rawMonster.traits.eyeType,
      mouthType: rawMonster.traits.mouthType,
      armType: rawMonster.traits.armType,
      legType: rawMonster.traits.legType,
      primaryColor: rawMonster.traits.primaryColor,
      secondaryColor: rawMonster.traits.secondaryColor,
      outlineColor: rawMonster.traits.outlineColor,
      size: rawMonster.traits.size
    },
    state: rawMonster.state,
    isPublic: rawMonster.isPublic,
    ownerId: rawMonster.ownerId.toString(),
    createdAt: rawMonster.createdAt.toISOString(),
    updatedAt: rawMonster.updatedAt.toISOString()
  }
}
