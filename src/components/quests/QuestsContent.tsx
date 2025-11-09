'use client'

import { type ReactNode, useState } from 'react'
import type { QuestWithProgress, QuestType } from '@/types/quests'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import QuestCard from './QuestCard'
import { Clock, Trophy } from 'lucide-react'
import { count } from '@/lib/utils'
import cn from 'classnames'

interface QuestsContentProps {
  dailyQuests: QuestWithProgress[]
  achievements: QuestWithProgress[]
}

/**
 * Renvoie un booléen indiquant si une quête est réclamable.
 * @param q La quête
 * @returns Un booléen indiquant si la quête est réclamable
 */
const claimable = (q: QuestWithProgress): boolean => q.progress.completed && !q.progress.claimed

/**
 * Quests content component
 * Displays daily quests and achievements with progress tracking
 */
export default function QuestsContent ({ dailyQuests, achievements }: QuestsContentProps): ReactNode {
  const [activeTab, setActiveTab] = useState<QuestType>('daily')

  const currentQuests = activeTab === 'daily' ? dailyQuests : achievements

  // Compte des quêtes à récupérer (complétées mais non réclamées)
  const claimableDailyCount = count(dailyQuests, claimable)
  const claimableAchievementsCount = count(achievements, claimable)

  return (
    <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Section Title */}
        <SectionTitle
          title='Quêtes & Succès'
          subtitle='Accomplissez des objectifs pour gagner des pièces'
        />

        {/* Info Card */}
        <Card className='mb-8 bg-gradient-to-r from-tolopea-50 to-aqua-forest-50'>
          <div className='flex items-start gap-3'>
            <Clock className='h-6 w-6 text-tolopea-600 flex-shrink-0 mt-1' />
            <div>
              <p className='font-semibold text-tolopea-900'>
                Les quêtes quotidiennes se renouvellent chaque jour à minuit
              </p>
              <p className='text-sm text-tolopea-700 mt-1'>
                Complétez-les avant la réinitialisation pour ne pas perdre votre progression !
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className='mb-8 flex gap-4'>
          <button
            onClick={() => { setActiveTab('daily') }}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-tolopea-500 to-tolopea-600 text-white shadow-lg'
                : 'bg-white text-tolopea-700 hover:bg-tolopea-50'
            )}
          >
            <Clock className='h-5 w-5' />
            Quêtes quotidiennes ({claimableDailyCount})
          </button>
          <button
            onClick={() => { setActiveTab('achievement') }}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
              activeTab === 'achievement'
                ? 'bg-gradient-to-r from-blood-500 to-blood-600 text-white shadow-lg'
                : 'bg-white text-blood-700 hover:bg-blood-50'
            )}
          >
            <Trophy className='h-5 w-5' />
            Succès ({claimableAchievementsCount})
          </button>
        </div>

        {/* Quests Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {currentQuests.map((quest) => (
            <QuestCard
              key={quest.definition.id}
              quest={quest}
            />
          ))}
        </div>

        {/* Empty State */}
        {currentQuests.length === 0 && (
          <Card className='text-center py-12'>
            <p className='text-tolopea-700 text-lg'>
              Aucune quête disponible pour le moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
