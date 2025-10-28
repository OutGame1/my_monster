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
    </div>
  )
}
