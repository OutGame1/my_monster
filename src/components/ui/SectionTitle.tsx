import type { ReactNode } from 'react'

interface SectionTitleProps {
  title: string
  subtitle: string
}

/**
 * Reusable section title component with gradient text and decorative underline.
 *
 * @param props - Title and subtitle text
 * @returns Centered section title with gradient styling
 */
export default function SectionTitle ({ title, subtitle }: SectionTitleProps): ReactNode {
  return (
    <div className='flex flex-col gap-4 items-center mb-12'>
      <h1 className='bg-gradient-to-r from-tolopea-600 via-blood-500 to-aqua-forest-600 bg-clip-text text-5xl font-black text-transparent sm:text-6xl'>
        {title}
      </h1>
      <p className='max-w-2xl text-lg text-tolopea-700/80'>
        {subtitle}
      </p>
      <div className='h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-tolopea-400 to-transparent' />
    </div>
  )
}
