'use client'

import type { ReactNode } from 'react'
import type { socialProviderList } from 'better-auth/social-providers'
import { authClient } from '@/lib/auth-client'
import GithubSignInButton from './socialSignInButtons/GithubSignInButton'
import GoogleSignInButton from './socialSignInButtons/GoogleSignInButton'

type SocialProviders = typeof socialProviderList[number]

interface SocialSignInButtonsProps {
  mode: 'signin' | 'signup'
}

export interface SocialSignInButtonProps extends SocialSignInButtonsProps {
  onClick: () => void
}

/**
 * Boutons de connexion avec les providers sociaux (GitHub).
 */
export default function SocialSignInButtons ({ mode }: SocialSignInButtonsProps): ReactNode {
  const handleProviderSignIn = (provider: SocialProviders): void => {
    void authClient.signIn.social({
      provider,
      callbackURL: '/app'
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative flex items-center justify-center'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-tolopea-200' />
        </div>
        <div className='relative bg-tolopea-50 px-4 text-sm text-tolopea-600'>
          ou
        </div>
      </div>

      <GithubSignInButton mode={mode} onClick={() => handleProviderSignIn('github')} />

      <GoogleSignInButton mode={mode} onClick={() => handleProviderSignIn('google')} />
    </div>
  )
}
