import type { IDocumentMonster, IMonster } from '@/db/models/monster.model'

export default function monsterSerizalizer (rawMonster: IDocumentMonster): IMonster {
  return {
    _id: rawMonster._id.toString(),
    name: rawMonster.name,
    level: rawMonster.level,
    traits: rawMonster.traits,
    state: rawMonster.state,
    ownerId: rawMonster.ownerId.toString(),
    createdAt: rawMonster.createdAt.toISOString(),
    updatedAt: rawMonster.updatedAt.toISOString()
  }
}
