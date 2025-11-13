'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MonstersGrid from './MonstersGrid'
import Modal from '@/components/ui/Modal'
import CreateMonsterForm from './CreateMonsterForm'
import SectionTitle from '@/components/ui/SectionTitle'
import { createMonster, getMonsters } from '@/actions/monsters.actions'
import { PlusCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { toast } from 'react-toastify'
import CoinIcon from '@components/ui/CoinIcon'
import Skeleton from '@components/ui/Skeleton'
import MonsterCardSkeleton from './skeletons/MonsterCardSkeleton'
import { calculateMonsterCreationCost } from '@/config/monsters.config'
import type { ISerializedMonster } from '@/lib/serializers/monster.serializer'

/**
 * Main dashboard content component
 * Handles data fetching, loading states, and monster management
 * Shows skeleton while loading, then displays content
 */
export default function DashboardContent (): ReactNode {
  const { removeBalance } = useWallet()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [monsters, setMonsters] = useState<ISerializedMonster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [creationCost, setCreationCost] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monsterName, setMonsterName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const isFirstMonster = creationCost === 0

  const fetchMonsters = useCallback(async (): Promise<void> => {
    try {
      const fetchedMonsters = await getMonsters()
      setMonsters(fetchedMonsters)
      const cost = calculateMonsterCreationCost(fetchedMonsters.length)
      setCreationCost(cost)
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setMonsters])

  // Chargement initial des monstres
  useEffect(() => {
    void fetchMonsters()
  }, [fetchMonsters])

  // Détection du retour après paiement Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')

    if (paymentStatus === 'success') {
      toast.success('🎉 Paiement réussi ! Vos pièces ont été ajoutées à votre compte.')
      // Nettoyer l'URL
      router.replace('/app')
    }
  }, [searchParams, router])

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

      await fetchMonsters()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du monstre')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <div className='min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          {/* Section Title */}
          <SectionTitle
            title='Mes monstres'
            subtitle='Découvrez votre collection de créatures extraordinaires'
          />

          {/* Create Monster Button */}
          <div className='mb-8 flex'>
            {isLoading
              ? (
                <Skeleton width={320} height={80} borderRadius={16} />
                )
              : (
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
                      <p className='flex items-center gap-1 text-sm font-semibold text-tolopea-600'>
                        {isFirstMonster ? 'Gratuit ! 🎉' : `${creationCost}`}
                        <CoinIcon className='h-4 w-4' />
                      </p>
                    </div>
                  </div>
                </button>
                )}
          </div>

          {/* Monsters Collection Grid Section */}
          {isLoading
            ? (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <MonsterCardSkeleton key={i} />
                ))}
              </div>
              )
            : (
              <MonstersGrid
                monsters={monsters}
                onCreateMonster={handleOpenModal}
              />
              )}
        </div>
      </div>

      {/* Create Monster Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isFirstMonster ? 'Créer mon premier monstre' : 'Créer un nouveau monstre'}
        confirmText={isCreating
          ? 'Création...'
          : (
            <>
              Créer {isFirstMonster ? '0' : creationCost} <CoinIcon className='inline h-4 w-4' />
            </>
            )}
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
