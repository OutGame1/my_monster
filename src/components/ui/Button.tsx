import { ReactNode, PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
}

export default function Button ({
  children,
  type = 'button',
  onClick,
  className = '',
  variant = 'primary'
}: ButtonProps): ReactNode {
  const baseStyles = 'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-lg'
  const variants = {
    primary: 'bg-blood-500 hover:bg-blood-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-tolopea-100 hover:bg-tolopea-200 text-tolopea-900'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
