'use client'

import { type ReactNode, type MouseEvent, useEffect } from 'react'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  confirmText?: string
  onConfirm?: () => void
  isConfirmDisabled?: boolean
  showCancel?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function Modal ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirmer',
  onConfirm,
  isConfirmDisabled = false,
  showCancel = true,
  size = 'medium'
}: ModalProps): ReactNode {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-6xl'
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn'
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full animate-slideUp max-h-[90vh] overflow-y-auto`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10'>
          <h2
            id='modal-title'
            className='text-2xl font-bold text-tolopea-900'
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className='px-6 py-6'>
          {children}
        </div>

        {/* Footer avec boutons */}
        {(showCancel || onConfirm !== undefined) && (
          <div className='px-6 py-4 border-t border-gray-200 flex gap-4 sticky bottom-0 bg-white'>
            {showCancel && (
              <Button
                variant='secondary'
                onClick={onClose}
                className='flex-1'
              >
                Fermer
              </Button>
            )}
            {onConfirm !== undefined && (
              <button
                onClick={onConfirm}
                disabled={isConfirmDisabled}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-lg ${
                  isConfirmDisabled
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-blood-500 hover:bg-blood-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
