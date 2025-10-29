'use client'

import type { ReactNode } from 'react'
import InputField from '@/components/ui/InputField'

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
  return (
    <div className='space-y-6'>
      {/* Monster Name Input */}
      <div>
        <InputField
          type='text'
          name='monster-name'
          label='Nom de votre monstre'
          value={monsterName}
          onChangeText={onNameChange}
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
