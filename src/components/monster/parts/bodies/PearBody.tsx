// ========================================
// PEAR BODY - BOTTOM-HEAVY STYLE
// ========================================

import type { ReactNode } from 'react'

interface PearBodyProps {
  primaryColor: string
  secondaryColor: string
  outlineColor: string
  className?: string
}

export default function PearBody ({
  primaryColor,
  secondaryColor,
  outlineColor,
  className
}: PearBodyProps): ReactNode {
  return (
    <g className={className}>
      {/* Neck connector - rectangular for pear shape */}
      <rect
        x='88'
        y='68'
        width='24'
        height='14'
        rx='4'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='3'
      />

      {/* Upper body - narrow chest */}
      <ellipse
        cx='100'
        cy='90'
        rx='28'
        ry='16'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='4'
      />

      {/* Lower body - wide hips */}
      <ellipse
        cx='100'
        cy='122'
        rx='42'
        ry='28'
        fill={primaryColor}
        stroke={outlineColor}
        strokeWidth='4'
      />

      {/* Connecting middle section */}
      <rect
        x='72'
        y='98'
        width='56'
        height='18'
        fill={primaryColor}
      />

      {/* Hip accent patches */}
      <ellipse
        cx='78'
        cy='122'
        rx='16'
        ry='20'
        fill={secondaryColor}
        opacity='0.6'
      />
      <ellipse
        cx='122'
        cy='122'
        rx='16'
        ry='20'
        fill={secondaryColor}
        opacity='0.6'
      />

      {/* Chest plate detail */}
      <path
        d='M 85 86 Q 100 90 115 86'
        fill='none'
        stroke={secondaryColor}
        strokeWidth='3'
        opacity='0.7'
      />

      {/* Side definition lines */}
      <path
        d='M 72 102 Q 68 114 72 132'
        fill='none'
        stroke={outlineColor}
        strokeWidth='2'
        opacity='0.3'
      />
      <path
        d='M 128 102 Q 132 114 128 132'
        fill='none'
        stroke={outlineColor}
        strokeWidth='2'
        opacity='0.3'
      />
    </g>
  )
}
