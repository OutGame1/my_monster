'use client'

import { useState, type ReactNode } from 'react'
import { Paintbrush } from 'lucide-react'
import Image from 'next/image'
import { backgroundsIdMap } from '@/config/backgrounds.config'
import BackgroundSelector from './BackgroundSelector'

interface MonsterBackgroundDisplayProps {
  monsterId: string
  monsterName: string
  backgroundId: string | null
  /** Composant monstre à afficher par-dessus le background */
  children: ReactNode
  /** Si true, affiche le bouton pour changer le background */
  showChangeButton?: boolean
  /** Callback appelé après un changement d'arrière-plan */
  onBackgroundChanged?: () => void
}

/**
 * Affiche un monstre avec son arrière-plan équipé
 * Permet de changer l'arrière-plan via un modal
 */
export default function MonsterBackgroundDisplay ({
  monsterId,
  monsterName,
  backgroundId,
  children,
  showChangeButton = false,
  onBackgroundChanged
}: MonsterBackgroundDisplayProps): ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const background = backgroundId !== null ? backgroundsIdMap.get(backgroundId) : undefined

  const handleModalClose = (): void => {
    setIsModalOpen(false)
    // Appeler le callback si fourni pour rafraîchir les données
    onBackgroundChanged?.()
  }

  return (
    <div className='relative w-full mx-auto'>
      {/* Arrière-plan */}
      <div className='relative rounded-lg overflow-hidden shadow-lg'>
        {background !== undefined
          ? (
            <div className='relative w-full aspect-square'>
              <Image
                src={background.imageUrl}
                alt={background.name}
                fill
                sizes='(max-width: 768px) 100vw, 600px'
                priority
              />
              {/* Monstre par-dessus */}
              <div className='absolute inset-0 flex items-center justify-center'>
                {children}
              </div>
            </div>
            )
          : (
            <div className='relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200'>
              {/* Monstre par-dessus */}
              <div className='absolute inset-0 flex items-center justify-center'>
                {children}
              </div>
            </div>
            )}

        {/* Bouton pour changer l'arrière-plan */}
        {showChangeButton && (
          <button
            className='absolute top-2 right-2 rounded-full bg-white/70 backdrop-blur-sm p-2 transition-all duration-200 hover:bg-white/90 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg'
            onClick={() => { setIsModalOpen(true) }}
          >
            <Paintbrush
              width={24}
              height={24}
              className='text-gray-700'
            />
          </button>
        )}
      </div>

      {/* Modal de sélection */}
      <BackgroundSelector
        monsterId={monsterId}
        monsterName={monsterName}
        currentBackgroundId={backgroundId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
