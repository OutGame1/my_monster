import type { ReactNode } from 'react'

interface SectionTitleProps {
  title: string
  subtitle: string
}

/**
 * Reusable section title component with gradient text and decorative underline.
 *
 * @param {SectionTitleProps} props - Title and subtitle text
 * @returns {ReactNode} Centered section title with gradient styling
 */
export default function SectionTitle ({ title, subtitle }: SectionTitleProps): ReactNode {
  return (
    <div className='mb-12 text-center'>
      <h1 className='mb-4 bg-gradient-to-r from-tolopea-600 via-blood-500 to-aqua-forest-600 bg-clip-text text-5xl font-black text-transparent sm:text-6xl'>
        {title}
      </h1>
      <p className='mx-auto max-w-2xl text-lg text-tolopea-700/80'>
        {subtitle}
      </p>
      <div className='mx-auto mt-6 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-tolopea-400 to-transparent' />
    </div>
  )
}
