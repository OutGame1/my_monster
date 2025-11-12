'use client'

import { useState, useRef, type ReactNode, type ChangeEvent } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { updateProfileImage } from '@/actions/user.actions'
import ProfileImage from './ProfileImage'
import { useSession } from '@/contexts/SessionContext'

/**
 * Composant permettant de modifier la photo de profil de l'utilisateur
 * Gère l'upload d'image via Cloudinary avec validations côté client
 *
 * Fonctionnalités:
 * - Sélection de fichier via input caché déclenché au clic sur l'avatar
 * - Validations côté client:
 *   - Type de fichier: doit commencer par `image/`
 *   - Taille: maximum 5 MB
 * - Conversion du fichier en data URL via FileReader
 * - Affichage d'un loader pendant l'upload
 * - Overlay au hover avec icône caméra pour indiquer l'action possible
 * - Badge caméra permanent dans le coin inférieur droit
 * - Rafraîchissement automatique de la page après upload réussi
 * - Notifications toast en cas d'erreur (type invalide, taille excessive, échec upload)
 *
 * États visuels:
 * - Normal: Avatar avec badge caméra
 * - Hover: Overlay semi-transparent avec icône caméra agrandie
 * - Upload: Loader animé avec fond sombre
 *
 * @returns {ReactNode} Interface de modification de photo de profil
 */
export default function ProfileImageUploader (): ReactNode {
  const session = useSession()
  const router = useRouter()

  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = (): void => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.item(0)
    if (!(file instanceof File)) return

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide')
      return
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 MB')
      return
    }

    setIsUploading(true)

    // Convertir le fichier en data URL
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        await updateProfileImage(reader.result)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error))
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className='relative group cursor-pointer' onClick={handleImageClick}>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={(e) => { void handleFileChange(e) }}
        className='hidden'
        disabled={isUploading}
      />

      {/* Avatar avec overlay au hover */}
      <div className='relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-tolopea-500 to-blood-500 text-3xl font-bold text-white shadow-lg overflow-hidden'>
        <ProfileImage
          session={session}
          width={96}
          height={96}
          onError={() => toast.warn('Impossible de charger votre photo de profil. Veuillez accepter nos excuses pour ce désagrément.')}
        />

        {/* Overlay au hover */}
        {!isUploading && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <Camera className='h-8 w-8 text-white' />
          </div>
        )}

        {/* Loader pendant l'upload */}
        {isUploading && (
          <div className='absolute inset-0 bg-black/70 flex items-center justify-center'>
            <Loader2 className='h-8 w-8 text-white animate-spin' />
          </div>
        )}
      </div>

      {/* Badge caméra */}
      <div className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-tolopea-600 border-2 border-white shadow-md'>
        {isUploading
          ? (
            <Loader2 className='h-4 w-4 text-white animate-spin' />
            )
          : (
            <Camera className='h-4 w-4 text-white' />
            )}
      </div>
    </div>
  )
}
