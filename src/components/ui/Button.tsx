import { ReactNode, PropsWithChildren } from 'react'

type ColorType = 'blood' | 'tolopea' | 'aqua-forest' | 'golden-fizz' | 'seance'
type VariantType = 'primary' | 'secondary' | 'tertiary'

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  variant?: VariantType
  color?: ColorType
}

const colorMap: Record<ColorType, Record<VariantType, string>> = {
  blood: {
    primary: 'bg-blood-500 hover:bg-blood-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-blood-100 hover:bg-blood-200 text-blood-900',
    tertiary: 'border-2 border-blood-500 text-blood-600 hover:bg-blood-50'
  },
  tolopea: {
    primary: 'bg-tolopea-500 hover:bg-tolopea-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-tolopea-100 hover:bg-tolopea-200 text-tolopea-900',
    tertiary: 'border-2 border-tolopea-500 text-tolopea-600 hover:bg-tolopea-50'
  },
  'aqua-forest': {
    primary: 'bg-aqua-forest-500 hover:bg-aqua-forest-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-aqua-forest-100 hover:bg-aqua-forest-200 text-aqua-forest-900',
    tertiary: 'border-2 border-aqua-forest-500 text-aqua-forest-600 hover:bg-aqua-forest-50'
  },
  'golden-fizz': {
    primary: 'bg-golden-fizz-500 hover:bg-golden-fizz-600 text-gray-900 shadow-lg hover:shadow-xl',
    secondary: 'bg-golden-fizz-100 hover:bg-golden-fizz-200 text-golden-fizz-900',
    tertiary: 'border-2 border-golden-fizz-500 text-golden-fizz-700 hover:bg-golden-fizz-50'
  },
  seance: {
    primary: 'bg-seance-500 hover:bg-seance-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-seance-100 hover:bg-seance-200 text-seance-900',
    tertiary: 'border-2 border-seance-500 text-seance-600 hover:bg-seance-50'
  }
}

export default function Button ({
  children,
  type = 'button',
  disabled,
  onClick,
  variant = 'primary',
  color = 'blood'
}: ButtonProps): ReactNode {
  const baseStyles = 'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-lg'
  const colorClasses = colorMap[color][variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${colorClasses}`}
    >
      {children}
    </button>
  )
}
