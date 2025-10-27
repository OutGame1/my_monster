// ========================================
// LONG ARMS FOR PEAR BODY
// ========================================

import type { ReactNode } from 'react'

interface LongArmsWithPearBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function LongArmsWithPearBody ({
  primaryColor,
  outlineColor
}: LongArmsWithPearBodyProps): ReactNode {
  // Pear body: arms from narrow shoulders, hanging alongside wide hips
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm segment */}
        <rect
          x='54'
          y='85'
          width='14'
          height='22'
          rx='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint */}
        <circle
          cx='61'
          cy='107'
          r='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='56'
          y='107'
          width='12'
          height='20'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand with three fingers */}
        <ellipse
          cx='62'
          cy='129'
          rx='10'
          ry='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='58' y='133' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='62' y='135' width='3' height='7' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='66' y='133' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm segment */}
        <rect
          x='132'
          y='85'
          width='14'
          height='22'
          rx='7'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint */}
        <circle
          cx='139'
          cy='107'
          r='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='132'
          y='107'
          width='12'
          height='20'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand with three fingers */}
        <ellipse
          cx='138'
          cy='129'
          rx='10'
          ry='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='131' y='133' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='135' y='135' width='3' height='7' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='139' y='133' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>
    </g>
  )
}
