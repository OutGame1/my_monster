'use client'

import { ReactNode, useState } from 'react'
import Modal from '@components/ui/Modal'
import InputField from '@components/ui/InputField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { createMonster } from '@/actions/monsters.actions'
import { MonsterType } from '@/db/models/monster.model'

interface AdoptMonsterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdoptMonsterModal ({ isOpen, onClose }: AdoptMonsterModalProps): ReactNode {
  const router = useRouter()
  const [monsterName, setMonsterName] = useState('')
  const [isAdopting, setIsAdopting] = useState(false)

  const handleCloseModal = (): void => {
    if (!isAdopting) {
      onClose()
      setMonsterName('')
    }
  }

  const handleAdoptMonster = async (): Promise<void> => {
    if (monsterName.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères', {
        autoClose: 3000
      })
      return
    }

    setIsAdopting(true)
    toast.loading('Adoption en cours... 🥚', { toastId: 'adopt' })

    try {
      // Appel direct à l'action serveur
      const result = await createMonster({
        name: monsterName.trim(),
        type: MonsterType.FIRE // Type par défaut, pourrait être aléatoire
      })

      if (!result.success) {
        toast.update('adopt', {
          render: `Erreur: ${result.error || 'Erreur lors de l\'adoption'} 😿`,
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        return
      }

      toast.update('adopt', {
        render: `${monsterName} a éclos avec succès ! 🎉`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      onClose()
      setMonsterName('')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      toast.update('adopt', {
        render: `Erreur: ${errorMessage} 😿`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
    } finally {
      setIsAdopting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title='Adopter un nouveau monstre'
      confirmText='Faire éclore'
      onConfirm={handleAdoptMonster}
      isConfirmDisabled={monsterName.trim().length < 2 || isAdopting}
    >
      <div className='space-y-6'>
        <p className='text-gray-600'>
          Choisissez un nom pour votre œuf mystérieux ! 🥚
        </p>

        {/* Œuf mystérieux - pas d'aperçu avant l'éclosion */}
        <div className='flex justify-center py-8 bg-gradient-to-b from-purple-50 to-white rounded-lg relative overflow-hidden'>
          {/* Effet de brillance animé */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse' />

          <div className='relative'>
            <div className='text-9xl animate-bounce'>
              🥚
            </div>
            {monsterName.trim().length >= 2 && (
              <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-purple-600 whitespace-nowrap animate-pulse'>
                ✨ Prêt à éclore ! ✨
              </div>
            )}
          </div>
        </div>

        <InputField
          type='text'
          name='monsterName'
          label='Nom du monstre'
          value={monsterName}
          onChangeText={setMonsterName}
          placeholder='Ex: Bloopy, Flammy...'
          required
          maxLength={50}
        />

        <div className='text-sm text-gray-500 text-center space-y-2'>
          <p>
            {monsterName.trim().length >= 2
              ? '🎉 Votre œuf est prêt à éclore !'
              : 'Le nom doit contenir entre 2 et 50 caractères'}
          </p>
          <p className='text-xs italic text-gray-400'>
            Vous découvrirez votre monstre après l&apos;éclosion !
          </p>
        </div>
      </div>
    </Modal>
  )
}
