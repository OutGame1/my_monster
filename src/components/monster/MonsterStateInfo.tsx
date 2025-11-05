'use client'

import { type ReactNode, useState } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import { stateInfoMap } from '@/components/dashboard/monster-state.utils'
import { Lock, Globe } from 'lucide-react'
import { toggleMonsterPublicStatus } from '@/actions/monsters.actions'
import { toast } from 'react-toastify'
import cn from 'classnames'

interface MonsterStateInfoProps {
  monster: ISerializedMonster
}

/**
 * Monster state information component
 * Displays the current emotional/physical state of the monster
 */
export default function MonsterStateInfo ({ monster }: MonsterStateInfoProps): ReactNode {
  const [isPublic, setIsPublic] = useState(monster.isPublic)
  const [isToggling, setIsToggling] = useState(false)

  const {
    label,
    emoji
  } = stateInfoMap[monster.state]

  const handleTogglePublicStatus = async (): Promise<void> => {
    setIsToggling(true)

    try {
      await toggleMonsterPublicStatus(monster._id)

      if (isPublic) {
        toast.success('🔒 Monstre rendu privé ! Il n\'est plus visible dans la galerie.')
        setIsPublic(false)
      } else {
        toast.success('🌍 Monstre rendu public ! Il sera visible dans la galerie.')
        setIsPublic(true)
      }
    } catch (error) {
      console.error('Error toggling public status:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className='rounded-2xl border border-tolopea-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-tolopea-800'>État actuel</h3>

        {/* Public/Private Toggle */}
        <button
          onClick={() => { void handleTogglePublicStatus() }}
          disabled={isToggling}
          className={cn(
            'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
            'hover:scale-105 active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isPublic
              ? 'bg-aqua-forest-100 text-aqua-forest-700 hover:bg-aqua-forest-200'
              : 'bg-tolopea-100 text-tolopea-700 hover:bg-tolopea-200'
          )}
        >
          {isPublic
            ? (
              <>
                <Globe className='h-4 w-4' />
                <span>Public</span>
              </>
              )
            : (
              <>
                <Lock className='h-4 w-4' />
                <span>Privé</span>
              </>
              )}
        </button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='text-5xl'>{emoji}</div>
        <p className='text-2xl font-bold text-gray-800'>
          {monster.name} est <span className='text-tolopea-600'>{label.toLowerCase()}</span> !
        </p>
      </div>
    </div>
  )
}
