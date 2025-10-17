'use client'

import { ReactNode, useState } from 'react'
import Modal from '@components/ui/Modal'
import InputField from '@components/ui/InputField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface AdoptMonsterModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ApiErrorResponse {
  success: boolean
  error?: string
}

const handleApiError = (error: unknown, monsterName: string): void => {
  const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
  toast.update('adopt', {
    render: `Erreur: ${errorMessage} 😿`,
    type: 'error',
    isLoading: false,
    autoClose: 5000
  })
}

export default function AdoptMonsterModal({ isOpen, onClose }: AdoptMonsterModalProps): ReactNode {
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
      const response = await fetch('/api/monsters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: monsterName.trim()
        })
      })

      const result: ApiErrorResponse = await response.json()

      if (!response.ok || !result.success) {
        const errorMessage = result.error || 'Erreur lors de l\'adoption'
        handleApiError(new Error(errorMessage), monsterName)
        setIsAdopting(false)
        return
      }

      toast.update('adopt', {
        render: `${monsterName} a été adopté avec succès ! 🎉`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      onClose()
      setMonsterName('')
      router.refresh()
    } catch (error) {
      handleApiError(error, monsterName)
    } finally {
      setIsAdopting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title='Adopter un nouveau monstre'
      confirmText='Adopter'
      onConfirm={handleAdoptMonster}
      isConfirmDisabled={monsterName.trim().length < 2 || isAdopting}
    >
      <div className='space-y-4'>
        <p className='text-gray-600'>
          Choisissez un nom pour votre nouveau compagnon ! 🐣
        </p>

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

        <div className='text-sm text-gray-500 text-center'>
          Le nom doit contenir entre 2 et 50 caractères
        </div>
      </div>
    </Modal>
  )
}
