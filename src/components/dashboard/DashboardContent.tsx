'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'
import type { Session } from '@/lib/auth-client'
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import MonstersGrid from './MonstersGrid'
import Modal from '@/components/ui/Modal'
import CreateMonsterForm from './CreateMonsterForm'
import { createMonster } from '@/actions/monsters.actions'
import { generateMonsterTraits } from '@/monster/generator'
import { useRouter } from 'next/navigation'

interface DashboardContentProps {
  session: Session
  monsters: ISerializedMonster[]
}

/**
 * Main dashboard content component
 * Orchestrates all dashboard sections: header, stats, and monsters grid
 * Manages monster creation modal
 */
export default function DashboardContent ({ session, monsters }: DashboardContentProps): ReactNode {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monsterList, setMonsterList] = useState(monsters)
  const [monsterName, setMonsterName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const fetchAndUpdateMonsters = async (): Promise<void> => {
      try {
        const response = await fetch('/api/monsters')

        if (!response.ok) {
          console.error(`Failed to fetch monsters: ${response.status} ${response.statusText}`)
          return
        }

        const updatedMonsters = await response.json()
        setMonsterList(updatedMonsters)
      } catch (error) {
        console.error('Error fetching monsters updates:', error)
        // Continue polling despite errors - temporary network issues shouldn't stop updates
      }
    }

    const interval = setInterval(() => {
      void fetchAndUpdateMonsters()
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
      const traits = generateMonsterTraits(monsterName)

      await createMonster({
        name: monsterName,
        traits,
        state: 'happy',
        level: 1
      })

      handleCloseModal()
      router.refresh()
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
          {/* Welcome Header Section */}
          <DashboardHeader userName={session.user.name} onCreateMonster={handleOpenModal} />

          {/* Statistics Overview Section */}
          <DashboardStats monsters={monsterList} />

          {/* Section Title */}
          <div className='mb-6 flex items-center gap-3'>
            <h2 className='text-3xl font-bold text-tolopea-800'>
              Mes monstres
            </h2>
            <div className='h-1 flex-1 rounded-full bg-gradient-to-r from-tolopea-300 via-aqua-forest-300 to-transparent' />
          </div>

          {/* Monsters Collection Grid Section */}
          <MonstersGrid monsters={monsterList} onCreateMonster={handleOpenModal} />
        </div>
      </div>

      {/* Create Monster Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='Créer un nouveau monstre'
        confirmText={isCreating ? 'Création...' : 'Créer mon monstre'}
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
