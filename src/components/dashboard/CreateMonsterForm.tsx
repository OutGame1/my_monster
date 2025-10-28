'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import InputField from '@/components/ui/InputField'
import MonsterAvatar from '@/components/monster/MonsterAvatar'
import { generateMonsterTraits } from '@/monster/generator'
import type { MonsterTraits } from '@/db/models/monster.model'

interface CreateMonsterFormProps {
  onNameChange: (name: string) => void
  monsterName: string
}

/**
 * Monster creation form component
 * Handles name input and displays live preview of the generated monster
 */
export default function CreateMonsterForm ({
  onNameChange,
  monsterName
}: CreateMonsterFormProps): ReactNode {
  const [traits, setTraits] = useState<MonsterTraits>(() => generateMonsterTraits('DefaultMonster'))

  const handleNameChange = (value: string): void => {
    onNameChange(value)
    if (value.trim() !== '') {
      setTraits(generateMonsterTraits(value))
    }
  }

  return (
    <div className='space-y-6'>
      {/* Monster Name Input */}
      <div>
        <InputField
          type='text'
          name='monster-name'
          label='Nom de votre monstre'
          value={monsterName}
          onChangeText={handleNameChange}
          placeholder='Ex: Fluffy, Sparkle, Shadow...'
          required
        />
        <p className='mt-2 text-sm text-gray-600'>
          💡 Le nom détermine l'apparence unique de votre monstre !
        </p>
      </div>

      {/* Monster Preview */}
      {monsterName.trim() !== '' && (
        <div className='rounded-xl border-2 border-tolopea-200 bg-gradient-to-br from-tolopea-50 to-aqua-forest-50 p-6'>
          <h3 className='mb-4 text-center text-lg font-semibold text-tolopea-800'>
            Aperçu de {monsterName}
          </h3>
          <div className='flex justify-center'>
            <MonsterAvatar
              traits={traits}
              animation='happy'
              size={200}
            />
          </div>
          <div className='mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700'>
            <div>
              <span className='font-medium'>Corps:</span> {traits.bodyShape}
            </div>
            <div>
              <span className='font-medium'>Bras:</span> {traits.armType}
            </div>
            <div>
              <span className='font-medium'>Jambes:</span> {traits.legType}
            </div>
            <div>
              <span className='font-medium'>Yeux:</span> {traits.eyeType}
            </div>
            <div>
              <span className='font-medium'>Bouche:</span> {traits.mouthType}
            </div>
            <div>
              <span className='font-medium'>Taille:</span> {traits.size}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
