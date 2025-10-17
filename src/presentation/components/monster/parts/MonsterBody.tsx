// ========================================
// COMPOSANT CORPS - PRÉSENTATION
// ========================================
// Rendu SVG du corps du monstre selon sa forme

import React, { ReactNode } from 'react'
import { BodyShape, ColorPalette, PatternStyle, MonsterSize } from '@/core/models/monster-visual.model'

interface MonsterBodyProps {
  shape: BodyShape
  colors: ColorPalette
  pattern: PatternStyle
  size: MonsterSize
}

const SIZE_SCALES: Record<MonsterSize, number> = {
  tiny: 0.6,
  small: 0.8,
  medium: 1,
  large: 1.2,
  huge: 1.4
}

export default function MonsterBody ({ shape, colors, pattern, size }: MonsterBodyProps): ReactNode {
  const scale = SIZE_SCALES[size]

  // Génération d'IDs uniques pour les dégradés
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`
  const shineId = `shine-${Math.random().toString(36).substring(2, 9)}`
  const shadowId = `shadow-${Math.random().toString(36).substring(2, 9)}`

  // Composant réutilisable pour les oreilles mignonnes
  const renderEars = (type: 'round' | 'pointy' | 'long') => {
    if (type === 'round') {
      return (
        <g id='ears-round'>
          <circle cx='70' cy='80' r={12 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <circle cx='130' cy='80' r={12 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <circle cx='70' cy='80' r={6 * scale} fill={colors.accent} opacity='0.6' />
          <circle cx='130' cy='80' r={6 * scale} fill={colors.accent} opacity='0.6' />
        </g>
      )
    } else if (type === 'pointy') {
      return (
        <g id='ears-pointy'>
          <path d='M 65 85 L 60 65 L 75 80 Z' fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <path d='M 135 85 L 140 65 L 125 80 Z' fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <path d='M 67 82 L 64 70 L 73 80 Z' fill={colors.accent} opacity='0.5' />
          <path d='M 133 82 L 136 70 L 127 80 Z' fill={colors.accent} opacity='0.5' />
        </g>
      )
    } else { // long
      return (
        <g id='ears-long'>
          <ellipse cx='65' cy='75' rx={8 * scale} ry={20 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' transform='rotate(-20 65 75)' />
          <ellipse cx='135' cy='75' rx={8 * scale} ry={20 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' transform='rotate(20 135 75)' />
          <ellipse cx='65' cy='75' rx={4 * scale} ry={12 * scale} fill={colors.accent} opacity='0.5' transform='rotate(-20 65 75)' />
          <ellipse cx='135' cy='75' rx={4 * scale} ry={12 * scale} fill={colors.accent} opacity='0.5' transform='rotate(20 135 75)' />
        </g>
      )
    }
  }

  // Bras/pattes mignonnes
  const renderLimbs = () => (
    <g id='limbs'>
      {/* Bras gauche */}
      <ellipse
        cx='70'
        cy='120'
        rx={8 * scale}
        ry={18 * scale}
        fill={colors.primary}
        stroke={colors.secondary}
        strokeWidth='2'
        transform='rotate(-15 70 120)'
      />
      <circle cx='65' cy='130' r={6 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />

      {/* Bras droit */}
      <ellipse
        cx='130'
        cy='120'
        rx={8 * scale}
        ry={18 * scale}
        fill={colors.primary}
        stroke={colors.secondary}
        strokeWidth='2'
        transform='rotate(15 130 120)'
      />
      <circle cx='135' cy='130' r={6 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />

      {/* Pattes */}
      <ellipse cx='85' cy='160' rx={12 * scale} ry={8 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
      <ellipse cx='115' cy='160' rx={12 * scale} ry={8 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />

      {/* Petits orteils mignons */}
      <g opacity='0.7'>
        <circle cx='80' cy='162' r={2 * scale} fill={colors.secondary} />
        <circle cx='85' cy='163' r={2 * scale} fill={colors.secondary} />
        <circle cx='90' cy='162' r={2 * scale} fill={colors.secondary} />

        <circle cx='110' cy='162' r={2 * scale} fill={colors.secondary} />
        <circle cx='115' cy='163' r={2 * scale} fill={colors.secondary} />
        <circle cx='120' cy='162' r={2 * scale} fill={colors.secondary} />
      </g>
    </g>
  )

  const bodyShapes: Record<BodyShape, ReactNode> = {
    round: (
      <g>
        {/* Oreilles rondes */}
        {renderEars('round')}

        {/* Corps rond mignon */}
        <circle
          cx='100'
          cy='110'
          r={50 * scale}
          fill={`url(#${gradientId})`}
          stroke={colors.secondary}
          strokeWidth='3'
          filter={`url(#${shadowId})`}
        />

        {/* Brillance */}
        <ellipse
          cx='85'
          cy='95'
          rx={22 * scale}
          ry={28 * scale}
          fill={`url(#${shineId})`}
          opacity='0.5'
        />

        {/* Ventre clair */}
        <ellipse
          cx='100'
          cy='120'
          rx={30 * scale}
          ry={35 * scale}
          fill='white'
          opacity='0.3'
        />

        {/* Membres */}
        {renderLimbs()}
      </g>
    ),
    oval: (
      <g>
        {/* Oreilles longues */}
        {renderEars('long')}

        {/* Corps ovale */}
        <ellipse
          cx='100'
          cy='110'
          rx={40 * scale}
          ry={55 * scale}
          fill={`url(#${gradientId})`}
          stroke={colors.secondary}
          strokeWidth='3'
          filter={`url(#${shadowId})`}
        />

        {/* Brillance */}
        <ellipse
          cx='90'
          cy='90'
          rx={18 * scale}
          ry={25 * scale}
          fill={`url(#${shineId})`}
          opacity='0.5'
        />

        {/* Ventre */}
        <ellipse
          cx='100'
          cy='120'
          rx={25 * scale}
          ry={40 * scale}
          fill='white'
          opacity='0.25'
        />

        {/* Membres */}
        {renderLimbs()}
      </g>
    ),
    serpent: (
      <g>
        {/* Corps serpentin avec tête mignonne */}
        <path
          d={`M 100 ${50 * scale} Q 120 ${80 * scale}, 100 ${110 * scale} Q 80 ${140 * scale}, 100 ${170 * scale}`}
          fill='none'
          stroke={`url(#${gradientId})`}
          strokeWidth={30 * scale}
          strokeLinecap='round'
          filter={`url(#${shadowId})`}
        />

        {/* Tête ronde au sommet */}
        <circle
          cx='100'
          cy={50 * scale}
          r={22 * scale}
          fill={colors.primary}
          stroke={colors.secondary}
          strokeWidth='2'
          filter={`url(#${shadowId})`}
        />

        {/* Petites oreilles pointues */}
        <circle cx='88' cy={45 * scale} r={6 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='1.5' />
        <circle cx='112' cy={45 * scale} r={6 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='1.5' />

        {/* Brillance sur le corps */}
        <path
          d={`M 92 ${60 * scale} Q 112 ${85 * scale}, 92 ${115 * scale} Q 75 ${145 * scale}, 92 ${165 * scale}`}
          fill='none'
          stroke='white'
          strokeWidth={4}
          strokeLinecap='round'
          opacity='0.3'
        />

        {/* Petites pattes le long du corps */}
        <g opacity='0.8'>
          <ellipse cx='75' cy='100' rx='5' ry='8' fill={colors.secondary} />
          <ellipse cx='125' cy='100' rx='5' ry='8' fill={colors.secondary} />
          <ellipse cx='75' cy='130' rx='5' ry='8' fill={colors.secondary} />
          <ellipse cx='125' cy='130' rx='5' ry='8' fill={colors.secondary} />
        </g>
      </g>
    ),
    humanoid: (
      <g>
        {/* Oreilles pointues */}
        {renderEars('pointy')}

        {/* Tête mignonne */}
        <ellipse
          cx='100'
          cy='85'
          rx={32 * scale}
          ry={38 * scale}
          fill={`url(#${gradientId})`}
          stroke={colors.secondary}
          strokeWidth='3'
          filter={`url(#${shadowId})`}
        />

        {/* Corps */}
        <ellipse
          cx='100'
          cy='135'
          rx={28 * scale}
          ry={40 * scale}
          fill={`url(#${gradientId})`}
          stroke={colors.secondary}
          strokeWidth='3'
          filter={`url(#${shadowId})`}
        />

        {/* Brillances */}
        <ellipse cx='88' cy='75' rx={12 * scale} ry={16 * scale} fill={`url(#${shineId})`} opacity='0.5' />
        <ellipse cx='92' cy='125' rx={10 * scale} ry={15 * scale} fill={`url(#${shineId})`} opacity='0.4' />

        {/* Ventre */}
        <ellipse cx='100' cy='140' rx={18 * scale} ry={28 * scale} fill='white' opacity='0.3' />

        {/* Bras plus détaillés */}
        <g id='detailed-arms'>
          <ellipse cx='70' cy='115' rx={8 * scale} ry={20 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' transform='rotate(-25 70 115)' />
          <circle cx='62' cy='128' r={7 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />

          <ellipse cx='130' cy='115' rx={8 * scale} ry={20 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' transform='rotate(25 130 115)' />
          <circle cx='138' cy='128' r={7 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
        </g>

        {/* Jambes */}
        <g id='legs'>
          <ellipse cx='88' cy='165' rx={10 * scale} ry={18 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <ellipse cx='112' cy='165' rx={10 * scale} ry={18 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />

          {/* Pieds */}
          <ellipse cx='85' cy='178' rx={13 * scale} ry={7 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <ellipse cx='115' cy='178' rx={13 * scale} ry={7 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
        </g>
      </g>
    ),
    blob: (
      <g>
        {/* Oreilles rondes qui dépassent */}
        {renderEars('round')}

        {/* Corps gélatineux mignon */}
        <path
          d={`M 100,${65 * scale} 
              Q ${135 * scale},${72 * scale} ${132 * scale},${110 * scale}
              Q ${128 * scale},${145 * scale} 100,${155 * scale}
              Q ${72 * scale},${145 * scale} ${68 * scale},${110 * scale}
              Q ${65 * scale},${72 * scale} 100,${65 * scale} Z`}
          fill={`url(#${gradientId})`}
          stroke={colors.secondary}
          strokeWidth='3'
          filter={`url(#${shadowId})`}
        />

        {/* Effets gélatineux multiples */}
        <ellipse cx='80' cy='90' rx={28 * scale} ry={32 * scale} fill={`url(#${shineId})`} opacity='0.6' />
        <circle cx='110' cy='115' r={12 * scale} fill='white' opacity='0.25' />
        <circle cx='90' cy='125' r={8 * scale} fill='white' opacity='0.2' />

        {/* Ventre très clair */}
        <ellipse cx='100' cy='120' rx={30 * scale} ry={35 * scale} fill='white' opacity='0.3' />

        {/* Petites pattes qui dépassent */}
        <g opacity='0.9'>
          <ellipse cx='75' cy='145' rx={10 * scale} ry={8 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
          <ellipse cx='125' cy='145' rx={10 * scale} ry={8 * scale} fill={colors.primary} stroke={colors.secondary} strokeWidth='2' />
        </g>

        {/* Petits bras gélatineux */}
        <ellipse cx='65' cy='110' rx={6 * scale} ry={12 * scale} fill={colors.primary} opacity='0.8' />
        <ellipse cx='135' cy='110' rx={6 * scale} ry={12 * scale} fill={colors.primary} opacity='0.8' />
      </g>
    )
  }

  const renderPattern = (): ReactNode | null => {
    switch (pattern) {
      case 'spots':
        return (
          <g opacity='0.5'>
            <circle cx='85' cy='95' r={8 * scale} fill={colors.secondary} />
            <circle cx='115' cy='105' r={10 * scale} fill={colors.secondary} />
            <circle cx='95' cy='125' r={7 * scale} fill={colors.secondary} />
            <circle cx='110' cy='90' r={6 * scale} fill={colors.secondary} />
            <circle cx='78' cy='115' r={9 * scale} fill={colors.secondary} />
            {/* Contours des spots pour plus de définition */}
            <circle cx='85' cy='95' r={8 * scale} fill='none' stroke='white' strokeWidth='1' opacity='0.3' />
            <circle cx='115' cy='105' r={10 * scale} fill='none' stroke='white' strokeWidth='1' opacity='0.3' />
          </g>
        )
      case 'stripes':
        return (
          <g opacity='0.4'>
            <rect x='70' y='88' width='60' height={6 * scale} fill={colors.secondary} rx='3' />
            <rect x='70' y='108' width='60' height={6 * scale} fill={colors.secondary} rx='3' />
            <rect x='70' y='128' width='60' height={6 * scale} fill={colors.secondary} rx='3' />
          </g>
        )
      case 'scales':
        return (
          <g opacity='0.4'>
            {[0, 1, 2, 3].map(row =>
              [0, 1, 2, 3, 4].map(col => (
                <circle
                  key={`${row}-${col}`}
                  cx={78 + col * 11}
                  cy={85 + row * 13}
                  r={4 * scale}
                  fill='none'
                  stroke={colors.secondary}
                  strokeWidth='1.5'
                />
              ))
            )}
          </g>
        )
      case 'stars':
        return (
          <g opacity='0.7'>
            <text x='82' y='100' fontSize={16 * scale} fill={colors.accent}>★</text>
            <text x='108' y='115' fontSize={14 * scale} fill={colors.accent}>★</text>
            <text x='90' y='128' fontSize={12 * scale} fill={colors.accent}>★</text>
            <text x='112' y='95' fontSize={10 * scale} fill={colors.accent}>✦</text>
            <text x='80' y='120' fontSize={10 * scale} fill={colors.accent}>✦</text>
          </g>
        )
      case 'smooth':
      default:
        return null
    }
  }

  return (
    <g id='body'>
      {/* Définitions SVG (dégradés et filtres) */}
      <defs>
        {/* Dégradé principal plus doux */}
        <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor={colors.primary} />
          <stop offset='50%' stopColor={colors.primary} stopOpacity='0.95' />
          <stop offset='100%' stopColor={colors.secondary} stopOpacity='0.9' />
        </linearGradient>

        {/* Dégradé de brillance */}
        <radialGradient id={shineId}>
          <stop offset='0%' stopColor='white' stopOpacity='0.9' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </radialGradient>

        {/* Filtre d'ombre douce */}
        <filter id={shadowId}>
          <feGaussianBlur in='SourceAlpha' stdDeviation='2' />
          <feOffset dx='1' dy='2' result='offsetblur' />
          <feComponentTransfer>
            <feFuncA type='linear' slope='0.25' />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      {/* Ombre au sol plus douce */}
      <ellipse
        cx='100'
        cy='185'
        rx={45 * scale}
        ry={8 * scale}
        fill={colors.shadow}
        opacity='0.4'
      />

      {/* Corps principal */}
      {bodyShapes[shape]}

      {/* Motif par-dessus */}
      {renderPattern()}

      {/* Joues roses mignonnes */}
      <g id='cute-cheeks' opacity='0.6'>
        <ellipse cx='70' cy='110' rx={8 * scale} ry={6 * scale} fill='#FF69B4' />
        <ellipse cx='130' cy='110' rx={8 * scale} ry={6 * scale} fill='#FF69B4' />
      </g>
    </g>
  )
}
