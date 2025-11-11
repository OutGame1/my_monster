'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { getMonsters } from '@/actions/monsters.actions'
import { calculateMonsterCreationCost } from '@/config/monsters.config'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import DashboardContent from './DashboardContent'
import DashboardContentSkeleton from './skeletons/DashboardContentSkeleton'
import { MonsterProvider } from '@/contexts/MonsterContext'

/**
 * Dashboard content wrapper that fetches data client-side
 * Shows skeleton while loading
 */
export default function DashboardContentWrapper (): ReactNode {
  const [monsters, setMonsters] = useState<ISerializedMonster[]>([])
  const [creationCost, setCreationCost] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        const fetchedMonsters = await getMonsters()
        setMonsters(fetchedMonsters)
        setCreationCost(calculateMonsterCreationCost(fetchedMonsters.length))
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchDashboardData()
  }, [])

  if (isLoading) {
    return <DashboardContentSkeleton />
  }

  return (
    <MonsterProvider initialMonsters={monsters}>
      <DashboardContent initialCreationCost={creationCost} />
    </MonsterProvider>
  )
}
