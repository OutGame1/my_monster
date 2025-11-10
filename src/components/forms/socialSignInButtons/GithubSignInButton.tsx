import type { ReactNode } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import type { SocialSignInButtonProps } from '@components/forms/SocialSignInButtons'

export default function GithubSignInButton ({ mode, onClick }: SocialSignInButtonProps): ReactNode {
  const buttonText = mode === 'signin' ? 'Continuer avec GitHub' : 'S\'inscrire avec GitHub'

  return (
    <Button
      type='button'
      variant='tertiary'
      color='tolopea'
      onClick={onClick}
      width='full'
    >
      <Image src='/socials/github.svg' alt='github' width={32} height={32} />
      {buttonText}
    </Button>
  )
}
