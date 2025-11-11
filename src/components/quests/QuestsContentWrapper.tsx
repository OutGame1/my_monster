'use client'

import { type ReactNode, useEffect, useState, useCallback } from 'react'
import type { QuestWithProgress } from '@/types/quests'
import { getQuestsWithProgress } from '@/actions/quests.actions'
import QuestsContent from './QuestsContent'
import QuestsContentSkeleton from '@/components/quests/skeletons/QuestsContentSkeleton'

/**
 * Quests content wrapper that fetches data client-side
 * Shows skeleton while loading
 */
export default function QuestsContentWrapper (): ReactNode {
  const [dailyQuests, setDailyQuests] = useState<QuestWithProgress[]>([])
  const [achievements, setAchievements] = useState<QuestWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchQuests = useCallback(async (): Promise<void> => {
    try {
      const { daily, achievement } = await getQuestsWithProgress()
      setDailyQuests(daily)
      setAchievements(achievement)
    } catch (error) {
      console.error('Erreur lors du chargement des quêtes:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchQuests()
  }, [fetchQuests])

  if (isLoading) {
    return <QuestsContentSkeleton />
  }

  return <QuestsContent dailyQuests={dailyQuests} achievements={achievements} onQuestClaimed={fetchQuests} />
}
