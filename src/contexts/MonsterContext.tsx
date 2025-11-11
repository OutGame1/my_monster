'use client'

import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import { createContext, useContext, useState, type PropsWithChildren, type ReactNode } from 'react'

interface MonsterContextType {
  monsters: ISerializedMonster[]
  setMonsters: React.Dispatch<React.SetStateAction<ISerializedMonster[]>>
}

const MonsterContext = createContext<MonsterContextType | null>(null)

export function MonsterProvider ({ children }: PropsWithChildren): ReactNode {
  const [monsters, setMonsters] = useState<ISerializedMonster[]>([])

  return (
    <MonsterContext.Provider value={{ monsters, setMonsters }}>
      {children}
    </MonsterContext.Provider>
  )
}

export function useMonster (): MonsterContextType {
  const context = useContext(MonsterContext)
  if (context === null) {
    throw new Error('useMonster must be used within MonsterProvider')
  }
  return context
}
