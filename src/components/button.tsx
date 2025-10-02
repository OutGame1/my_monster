function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-4 py-2 text-md'
    case 'lg': return 'px-6 py-3 text-lg'
    case 'xl': return 'px-8 py-4 text-xl'
  }
}

function getVariant (variant: 'primary' | 'ghost' | 'underline' | 'outline'): string {
  switch (variant) {
    case 'primary': return 'bg-aqua-forest-500 hover:bg-aqua-forest-600'
    case 'ghost': return 'bg-transparent text-aqua-forest-500 hover:bg-aqua-forest-100'
    case 'underline': return 'underline hover:no-underline underline-offset-6'
    case 'outline': return 'border border-aqua-forest-200 text-aqua-forest-400'
  }
}

function Button ({
  children = 'click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = true
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
}): React.ReactNode {
  return (
    <button
      className={`rounded-md ${disabled ? '' : 'transition-all duration-300 cursor-pointer active:scale-95'} ${getSize(size)} ${getVariant(variant)}`}
      onClick={onclick}
    >
      {children}
    </button>
  )
}

export default Button
