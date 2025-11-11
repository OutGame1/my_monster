'use client'

import { type ReactNode, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import CoinIcon from '@/components/ui/CoinIcon'
import type { QuestWithProgress } from '@/types/quests'
import { claimQuestReward } from '@/actions/quests.actions'
import { Check, Lock } from 'lucide-react'
import { toast } from 'react-toastify'
import { useWallet } from '@/contexts/WalletContext'
import cn from 'classnames'

interface QuestCardProps {
  quest: QuestWithProgress
  onQuestClaimed: () => Promise<void>
}

/**
 * Quest card component
 * Displays a single quest with progress bar and claim button
 */
export default function QuestCard ({ quest, onQuestClaimed }: QuestCardProps): ReactNode {
  const { addBalance } = useWallet()

  const [isClaiming, setIsClaiming] = useState(false)

  const progress = quest.progress.progress
  const target = quest.definition.target
  const completed = quest.progress.completedAt !== undefined
  const claimed = quest.progress.claimedAt !== undefined
  const completedAt = quest.progress.completedAt
  const progressPercent = Math.min((progress / target) * 100, 100)

  // Formater la date de complétion
  const formatCompletedDate = (dateString: string): string => {
    const d = new Date(dateString)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleClaim = async (): Promise<void> => {
    setIsClaiming(true)

    try {
      const reward = await claimQuestReward(quest.definition.id)

      addBalance(reward)

      toast.success(`🎉 Vous avez gagné ${reward} pièces !`, {
        position: 'top-center',
        autoClose: 3000
      })

      // Recharger les quêtes pour mettre à jour l'état
      await onQuestClaimed()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la réclamation',
        {
          position: 'top-center',
          autoClose: 3000
        }
      )
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card className={cn(
      'relative transition-all duration-300 hover:shadow-xl',
      completed && !claimed && 'ring-2 ring-golden-fizz-500 ring-offset-2'
    )}
    >
      {/* Icon & Type Badge */}
      <div className='mb-4 flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-4xl'>{quest.definition.icon}</div>
          <div>
            <h3 className='text-lg font-bold text-tolopea-900'>
              {quest.definition.title}
            </h3>
            <p className='text-sm text-tolopea-600'>
              {quest.definition.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='mb-4'>
        <div className='mb-2 flex items-center justify-between text-sm'>
          <span className='font-semibold text-tolopea-700'>
            {progress} / {target}
          </span>
          <span className='text-tolopea-600'>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className='h-3 w-full overflow-hidden rounded-full bg-tolopea-100'>
          <div
            className='h-full bg-gradient-to-r from-tolopea-500 to-blood-500 transition-all duration-500'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {completedAt !== undefined && (
          <div className='mt-2 text-xs text-tolopea-500'>
            Terminée le {formatCompletedDate(completedAt)}
          </div>
        )}
      </div>

      {/* Reward & Action */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <CoinIcon className='h-6 w-6' />
          <span className='text-xl font-bold text-golden-fizz-800'>
            +{quest.definition.reward}
          </span>
        </div>

        {claimed
          ? (
            <div className='flex items-center gap-2 text-aqua-forest-600'>
              <Check className='h-5 w-5' />
              <span className='font-semibold'>Réclamé</span>
            </div>
            )
          : completed
            ? (
              <Button
                onClick={() => { void handleClaim() }}
                disabled={isClaiming}
                variant='primary'
                color='golden-fizz'
                width='fit'
              >
                {isClaiming ? 'Réclamation...' : 'Réclamer'}
              </Button>
              )
            : (
              <div className='flex items-center gap-2 text-tolopea-400'>
                <Lock className='h-5 w-5' />
                <span className='font-semibold text-sm'>En cours</span>
              </div>
              )}
      </div>
    </Card>
  )
}
