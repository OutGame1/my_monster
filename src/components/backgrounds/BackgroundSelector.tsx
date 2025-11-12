'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import { allBackgrounds } from '@/config/backgrounds.config'
import { getMonsterBackgrounds, equipBackground, purchaseBackground } from '@/actions/backgrounds.actions'
import Modal from '@/components/ui/Modal'
import BackgroundSelectorSkeleton from './skeletons/BackgroundSelectorSkeleton'
import BackgroundCard from './BackgroundCard'
import type { ISerializedBackground } from '@/lib/serializers/background.serializer'

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
      {isLoading
        ? <BackgroundSelectorSkeleton />
        : (
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {/* Tous les backgrounds disponibles */}
            {allBackgrounds.map(background => {
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
          )}
    </Modal>
  )
}
