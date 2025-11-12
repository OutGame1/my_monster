'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'
import type { Session } from '@/lib/auth-client'

interface ProfileImageProps {
  session: Session
  width: number
  height: number
  onError?: () => void
}

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
