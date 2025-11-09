'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Utensils, Gamepad2, Heart, Lightbulb, Moon } from 'lucide-react'
import Button from '@/components/ui/Button'
import LevelUpModal from './LevelUpModal'
import { performMonsterAction } from '@/actions/monsters.actions'
import type { ActionType } from '@/types/monsters'
import { useRouter } from 'next/navigation'

interface MonsterActionsProps {
  monsterId: string
  monsterName: string
  onCoinsEarned?: (coins: number) => void
  onActionComplete?: () => void
}

/**
 * Monster action buttons component
 * Provides interactive buttons for monster care actions in a 2x3 grid
 * Maps each monster state to an appropriate action with specific colors:
 * - hungry → Nourrir (Feed) - golden-fizz
 * - gamester → Jouer (Play) - blood
 * - sad → Réconforter (Comfort) - tolopea
 * - angry → Apaiser (Calm) - aqua-forest
 * - sleepy → Bercer (Lull to sleep) - seance
 */
export default function MonsterActions ({
  monsterId,
  monsterName,
  onCoinsEarned,
  onActionComplete
}: MonsterActionsProps): ReactNode {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [levelUpState, setLevelUpState] = useState({
    isOpen: false,
    newLevel: 1
  })

  const handleAction = async (actionType: ActionType): Promise<void> => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      const result = await performMonsterAction(monsterId, actionType)

      if (result.success) {
        // Trigger coin animation
        if (onCoinsEarned !== undefined) {
          onCoinsEarned(result.coinsEarned)
        }

        // Show level-up modal if leveled up
        if (result.leveledUp) {
          setLevelUpState({
            isOpen: true,
            newLevel: result.newLevel
          })
        }

        // Notify parent to refresh monster data immediately
        if (onActionComplete !== undefined) {
          onActionComplete()
        }

        // Refresh the page to show updated XP and state
        router.refresh()
      } else {
        console.error('Action failed:', result.message)
      }
    } catch (error) {
      console.error('Error performing action:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFeed = (): void => {
    void handleAction('feed')
  }

  const handlePlay = (): void => {
    void handleAction('play')
  }

  const handleComfort = (): void => {
    void handleAction('comfort')
  }

  const handleCalm = (): void => {
    void handleAction('calm')
  }

  const handleLullaby = (): void => {
    void handleAction('lullaby')
  }

  return (
    <>
      <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
        <h3 className='mb-4 text-lg font-semibold text-tolopea-800'>Actions</h3>

        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
          {/* Feed Button - for hungry state */}
          <Button
            onClick={handleFeed}
            color='golden-fizz'
            variant='primary'
            disabled={isProcessing}
          >
            Nourrir
            <Utensils size={32} />
          </Button>

          {/* Play Button - for gamester state */}
          <Button
            onClick={handlePlay}
            color='blood'
            variant='primary'
            disabled={isProcessing}
          >
            Jouer
            <Gamepad2 size={32} />
          </Button>

          {/* Comfort Button - for sad state */}
          <Button
            onClick={handleComfort}
            color='tolopea'
            variant='primary'
            disabled={isProcessing}
          >
            Réconforter
            <Heart size={32} />
          </Button>

          {/* Calm Button - for angry state */}
          <Button
            onClick={handleCalm}
            color='aqua-forest'
            variant='primary'
            disabled={isProcessing}
          >
            Apaiser
            <Lightbulb size={32} />
          </Button>

          {/* Lullaby Button - for sleepy state */}
          <Button
            onClick={handleLullaby}
            color='seance'
            variant='primary'
            disabled={isProcessing}
          >
            Bercer
            <Moon size={32} />
          </Button>
        </div>

        <p className='mt-4 text-center text-sm text-gray-600'>
          {isProcessing ? 'Action en cours...' : 'Interagissez avec votre monstre pour le garder heureux !'}
        </p>
      </div>

      <LevelUpModal
        isOpen={levelUpState.isOpen}
        monsterName={monsterName}
        newLevel={levelUpState.newLevel}
        onClose={() => { setLevelUpState({ ...levelUpState, isOpen: false }) }}
      />
    </>
  )
}
