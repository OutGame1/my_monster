'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
import type { Session } from '@/lib/auth-client'

/**
 * Props du composant ProfileImage
 */
interface ProfileImageProps {
  /** Session utilisateur contenant les informations du profil */
  session: Session
  /** Largeur de l'image en pixels */
  width: number
  /** Hauteur de l'image en pixels */
  height: number
  /** Callback optionnel appelé en cas d'échec de chargement de l'image */
  onError?: () => void
}

/**
 * Composant d'affichage de la photo de profil utilisateur avec fallback
 *
 * Comportement:
 * - Si `session.user.image` est une URL valide et que l'image se charge: affiche l'image via Next.js Image
 * - Si l'URL est invalide ou le chargement échoue: affiche une icône User générique
 * - Si l'utilisateur n'a jamais défini d'image: affiche l'icône User
 *
 * Gestion d'erreur:
 * - Déclenche le callback `onError` uniquement si l'utilisateur possède une URL d'image
 *   mais que le chargement a échoué (permet de différencier "pas d'image" vs "image cassée")
 * - État d'erreur persistant via `useState` pour éviter les tentatives répétées
 *
 * Optimisations:
 * - Loading eager pour affichage immédiat (photos de profil critiques)
 * - Object-cover pour maintenir le ratio d'aspect
 *
 * @param props - Props du composant
 * @returns Image de profil ou icône de fallback
 */
export default function ProfileImage ({ session, width, height, onError }: ProfileImageProps): ReactNode {
  const src = session.user.image

  const [error, setError] = useState(false)

  if (typeof src !== 'string' || error) {
    return (
      <User className='p-2' width={width} height={height} />
    )
  }

  const handleError = (): void => {
    setError(true)
    if (typeof src === 'string') {
      /*
       * On déclenche le callback onError seulement si
       * l'utilisateur possède une image, mais qu'elle
       * n'a pas pu être chargée
       */
      onError?.()
    }
  }

  return (
    <Image
      src={src}
      alt={session.user.name}
      loading='eager'
      width={width}
      height={height}
      className='object-cover'
      onError={handleError}
    />
  )
}
