'use client'

import { useEffect, useState, type ReactNode } from 'react'
import MonstersGrid from './MonstersGrid'
import Modal from '@/components/ui/Modal'
import CreateMonsterForm from './CreateMonsterForm'
import { createMonster } from '@/actions/monsters.actions'
import { PlusCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { useMonster } from '@/contexts/MonsterContext'

interface DashboardContentProps {
  initialCreationCost: number
}

/**
 * Main dashboard content component
 * Orchestrates all dashboard sections: header, stats, and monsters grid
 * Manages monster creation modal
 */
export default function DashboardContent ({ initialCreationCost }: DashboardContentProps): ReactNode {
  const { removeBalance } = useWallet()
  const { refreshMonsters } = useMonster()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monsterName, setMonsterName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const isFirstMonster = initialCreationCost === 0

  useEffect(() => {
    const interval = setInterval(() => {
      void refreshMonsters()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleOpenModal = (): void => {
    setIsModalOpen(true)
    setMonsterName('')
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setMonsterName('')
  }

  const handleCreateMonster = async (): Promise<void> => {
    if (monsterName.trim() === '') {
      return
    }

    setIsCreating(true)

    try {
      // Create monster - cost validation and deduction happen server-side
      const creationCost = await createMonster(monsterName)
      handleCloseModal()

      if (creationCost > 0) {
        // Trigger coin update event if coins were spent
        removeBalance(creationCost)
      }

      await refreshMonsters()
    } catch (error) {
      console.error('Error creating monster:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-tolopea-50 via-aqua-forest-50 to-blood-50'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <div className='mb-12 text-center'>
            <h1 className='mb-4 bg-gradient-to-r from-tolopea-600 via-blood-500 to-aqua-forest-600 bg-clip-text text-5xl font-black text-transparent sm:text-6xl'>
              Mes monstres
            </h1>
            <p className='mx-auto max-w-2xl text-lg text-tolopea-700/80'>
              Découvrez votre collection de créatures extraordinaires
            </p>
            <div className='mx-auto mt-6 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-tolopea-400 to-transparent' />
          </div>

          {/* Create Monster Button */}
          <div className='mb-8 flex'>
            <button
              onClick={handleOpenModal}
              className='group relative overflow-hidden rounded-2xl bg-gradient-to-r from-tolopea-500 via-blood-500 to-aqua-forest-500 p-1 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl'
            >
              <div className='flex items-center gap-3 rounded-xl bg-white px-8 py-4 transition-all duration-300 group-hover:bg-opacity-90'>
                <PlusCircle className='h-8 w-8 text-tolopea-600' />
                <div className='text-left'>
                  <p className='text-xl font-black text-tolopea-800'>
                    {isFirstMonster ? 'Créer mon premier monstre' : 'Créer un nouveau monstre'}
                  </p>
                  <p className='text-sm font-semibold text-tolopea-600'>
                    {isFirstMonster ? 'Gratuit ! 🎉' : `${initialCreationCost} pièces 💰`}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Monsters Collection Grid Section */}
          <MonstersGrid onCreateMonster={handleOpenModal} />
        </div>
      </div>

      {/* Create Monster Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isFirstMonster ? 'Créer mon premier monstre' : 'Créer un nouveau monstre'}
        confirmText={isCreating ? 'Création...' : `Créer ${isFirstMonster ? '(Gratuit)' : `(${initialCreationCost} 💰)`}`}
        onConfirm={() => { void handleCreateMonster() }}
        isConfirmDisabled={monsterName.trim() === '' || isCreating}
        size='medium'
      >
        <CreateMonsterForm
          monsterName={monsterName}
          onNameChange={setMonsterName}
        />
      </Modal>
    </>
  )
}
