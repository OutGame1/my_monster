import type { ReactNode } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { SocialSignInButtonProps } from '@components/forms/SocialSignInButtons'

export default function GoogleSignInButton ({ mode, onClick }: SocialSignInButtonProps): ReactNode {
  const buttonText = mode === 'signin' ? 'Continuer avec Google' : 'S\'inscrire avec Google'

  return (
    <Button
      type='button'
      variant='tertiary'
      color='tolopea'
      onClick={onClick}
      width='full'
    >
      <Image src='/socials/google.svg' alt='google' width={32} height={32} />

      {buttonText}
    </Button>
  )
}
