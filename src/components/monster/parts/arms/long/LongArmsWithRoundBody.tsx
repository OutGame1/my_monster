// ========================================
// LONG ARMS FOR ROUND BODY
// ========================================

import type { ReactNode } from 'react'

interface LongArmsWithRoundBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function LongArmsWithRoundBody ({
  primaryColor,
  outlineColor
}: LongArmsWithRoundBodyProps): ReactNode {
  // Round body: dangly arms from round sides, reaching down low
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm segment */}
        <rect
          x='56'
          y='92'
          width='13'
          height='24'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint */}
        <circle
          cx='62'
          cy='116'
          r='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='58'
          y='116'
          width='11'
          height='20'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand with three fingers */}
        <ellipse
          cx='63'
          cy='138'
          rx='10'
          ry='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='59' y='142' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='63' y='144' width='3' height='7' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='67' y='142' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm segment */}
        <rect
          x='131'
          y='92'
          width='13'
          height='24'
          rx='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint */}
        <circle
          cx='138'
          cy='116'
          r='6'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='131'
          y='116'
          width='11'
          height='20'
          rx='5'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand with three fingers */}
        <ellipse
          cx='137'
          cy='138'
          rx='10'
          ry='8'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='130' y='142' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='134' y='144' width='3' height='7' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='138' y='142' width='3' height='6' rx='1.5' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>
    </g>
  )
}
