'use client'

import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import { createContext, useContext, useState, type PropsWithChildren, type ReactNode } from 'react'

interface MonsterContextType {
  monsters: ISerializedMonster[]
  refreshMonsters: () => Promise<void>
}

const MonsterContext = createContext<MonsterContextType | null>(null)

interface MonsterProviderProps extends PropsWithChildren {
  initialMonsters: ISerializedMonster[]
}

export function MonsterProvider ({ children, initialMonsters }: MonsterProviderProps): ReactNode {
  const [monsters, setMonsters] = useState<ISerializedMonster[]>(initialMonsters)

  const refreshMonsters = async (): Promise<void> => {
    try {
      const response = await fetch('/api/monsters')

      if (!response.ok) {
        console.error(`Failed to fetch monsters: ${response.status} ${response.statusText}`)
        return
      }

      const updatedMonsters = await response.json()
      setMonsters(updatedMonsters)
    } catch (error) {
      console.error('Error fetching monsters updates:', error)
      // Continue polling despite errors - temporary network issues shouldn't stop updates
    }
  }

  return (
    <MonsterContext.Provider value={{ monsters, refreshMonsters }}>
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
