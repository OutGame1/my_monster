import type { ReactNode } from 'react'
import BaseSkeleton, { type SkeletonProps } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Skeleton wrapper component
 * Wraps react-loading-skeleton with CSS imported once
 * Use this instead of importing react-loading-skeleton directly
 */
export default function Skeleton (props: SkeletonProps): ReactNode {
  return <BaseSkeleton {...props} />
}
