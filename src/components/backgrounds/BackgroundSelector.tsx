'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'
import cn from 'classnames'
import { allBackgrounds } from '@/config/backgrounds.config'
import { getMonsterBackgrounds, equipBackground, purchaseBackground } from '@/actions/backgrounds.actions'
import { rarities, rarityMap } from '@/config/rarity.config'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Skeleton from '@components/ui/Skeleton'
import BackgroundCard from './BackgroundCard'
import type { ISerializedBackground } from '@/lib/serializers/background.serializer'
import type { Rarity } from '@/types/accessories'

interface BackgroundSelectorProps {
  monsterId: string
  monsterName: string
  currentBackgroundId: string | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal de sélection d'arrière-plan pour un monstre
 * Affiche tous les backgrounds disponibles et permet l'achat direct
 */
export default function BackgroundSelector ({
  monsterId,
  monsterName,
  currentBackgroundId,
  isOpen,
  onClose
}: BackgroundSelectorProps): ReactNode {
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<ISerializedBackground[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(currentBackgroundId)
  const [isSaving, setIsSaving] = useState(false)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all')

  // Chargement des backgrounds possédés
  useEffect(() => {
    if (!isOpen) return

    const loadBackgrounds = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const backgrounds = await getMonsterBackgrounds(monsterId)
        setOwnedBackgrounds(backgrounds)
        setSelectedId(currentBackgroundId)
      } catch (error) {
        console.error('Error loading backgrounds:', error)
        toast.error('Erreur lors du chargement des arrière-plans')
      } finally {
        setIsLoading(false)
      }
    }

    void loadBackgrounds()
  }, [monsterId, currentBackgroundId, isOpen])

  // Vérifier si un background est possédé
  const isOwned = (backgroundId: string): boolean => {
    return ownedBackgrounds.some(bg => bg.backgroundId === backgroundId)
  }

  // Acheter un background
  const handlePurchase = async (backgroundId: string): Promise<void> => {
    setPurchasingId(backgroundId)

    try {
      const newBackground = await purchaseBackground(backgroundId, monsterId)
      setOwnedBackgrounds(prev => [...prev, newBackground])
      setSelectedId(backgroundId) // Sélectionner automatiquement après achat
      toast.success('Arrière-plan acheté avec succès !')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'achat'
      toast.error(message)
    } finally {
      setPurchasingId(null)
    }
  }

  const handleSave = async (): Promise<void> => {
    setIsSaving(true)

    try {
      await equipBackground(monsterId, selectedId)
      toast.success(`Arrière-plan ${selectedId === null ? 'retiré' : 'équipé'} !`)
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la modification'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveBackground = (): void => {
    setSelectedId(null)
  }

  // Filtrer les backgrounds par rareté
  const filteredBackgrounds = rarityFilter === 'all'
    ? allBackgrounds
    : allBackgrounds.filter(bg => bg.rarity === rarityFilter)

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Changer l'arrière-plan de ${monsterName}`}
      size='large'
      confirmText={isSaving ? 'Enregistrement...' : 'Enregistrer'}
      onConfirm={() => { void handleSave() }}
      isConfirmDisabled={isSaving || selectedId === currentBackgroundId || isLoading}
    >
      <div className='flex flex-col gap-4'>
        {!isLoading && (
          <div className='flex flex-wrap gap-2 items-center justify-between'>
            {/* Filtres par rareté */}
            <div className='flex flex-wrap items-center  gap-2'>
              <button
                onClick={() => setRarityFilter('all')}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  rarityFilter === 'all'
                    ? 'bg-tolopea-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                Tous
              </button>
              {rarities.map((rarity) => {
                const config = rarityMap[rarity]
                const isActive = rarityFilter === rarity
                return (
                  <button
                    key={rarity}
                    onClick={() => setRarityFilter(rarity)}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-all text-white',
                      isActive ? 'shadow-md ring-2 ring-offset-2 ring-tolopea-500' : '',
                      config.style.backgroundColor
                    )}
                  >
                    {config.name}
                  </button>
                )
              })}
            </div>

            {/* Bouton pour retirer l'arrière-plan */}
            {currentBackgroundId !== null && (
              <Button
                onClick={handleRemoveBackground}
                variant='tertiary'
                width='fit'
                disabled={selectedId === null}
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Retirer l&apos;arrière-plan
              </Button>
            )}
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} height={180} className='rounded-lg' />
            ))
            : filteredBackgrounds.map(background => {
              const owned = isOwned(background.id)
              const selected = selectedId === background.id
              const isPurchasing = purchasingId === background.id

              return (
                <BackgroundCard
                  key={background.id}
                  background={background}
                  selected={selected}
                  owned={owned}
                  onSelect={() => setSelectedId(background.id)}
                  onPurchase={() => { void handlePurchase(background.id) }}
                  isPurchasing={isPurchasing}
                />
              )
            })}
        </div>
      </div>
    </Modal>
  )
}
