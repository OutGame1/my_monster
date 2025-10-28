import type { IMonster } from '@/db/models/monster.model'

export type CreateMonsterFormValues = Pick<IMonster, 'name' | 'traits' | 'state' | 'level'>
