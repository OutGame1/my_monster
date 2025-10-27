// ========================================
// LONG ARMS FOR TALL BODY
// ========================================

import type { ReactNode } from 'react'

interface LongArmsWithTallBodyProps {
  primaryColor: string
  outlineColor: string
}

export default function LongArmsWithTallBody ({
  primaryColor,
  outlineColor
}: LongArmsWithTallBodyProps): ReactNode {
  // Tall body: long mechanical-looking arms with defined joints
  return (
    <g>
      {/* Left arm */}
      <g>
        {/* Upper arm segment - more angular for tall body */}
        <rect
          x='52'
          y='88'
          width='14'
          height='20'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint - mechanical */}
        <rect
          x='55'
          y='106'
          width='8'
          height='8'
          rx='2'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='54'
          y='108'
          width='12'
          height='22'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand - blocky with fingers */}
        <rect
          x='55'
          y='130'
          width='10'
          height='8'
          rx='3'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='56' y='136' width='2.5' height='6' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='60' y='138' width='2.5' height='7' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='64' y='136' width='2.5' height='6' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>

      {/* Right arm */}
      <g>
        {/* Upper arm segment - more angular for tall body */}
        <rect
          x='134'
          y='88'
          width='14'
          height='20'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Elbow joint - mechanical */}
        <rect
          x='137'
          y='106'
          width='8'
          height='8'
          rx='2'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='2.5'
        />
        {/* Forearm segment */}
        <rect
          x='134'
          y='108'
          width='12'
          height='22'
          rx='4'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        {/* Hand - blocky with fingers */}
        <rect
          x='135'
          y='130'
          width='10'
          height='8'
          rx='3'
          fill={primaryColor}
          stroke={outlineColor}
          strokeWidth='3'
        />
        <rect x='135' y='136' width='2.5' height='6' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='139' y='138' width='2.5' height='7' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
        <rect x='143' y='136' width='2.5' height='6' rx='1' fill={primaryColor} stroke={outlineColor} strokeWidth='1.5' />
      </g>
    </g>
  )
}
