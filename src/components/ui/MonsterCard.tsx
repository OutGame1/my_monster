'use client'

import { ReactNode } from 'react'
import InfoBadge from './InfoBadge'
import type { SerializedMonster } from '@/types/monster.types'

interface MonsterCardProps {
  monster: SerializedMonster
}

const RARITY_COLORS: Record<string, string> = {
  Commun: 'bg-gray-400',
  'Peu commun': 'bg-green-400',
  Rare: 'bg-blue-400',
  Epique: 'bg-purple-400',
  Legendaire: 'bg-yellow-400'
}

const MOOD_EMOJIS: Record<string, string> = {
  Joyeux: '😊',
  Affame: '😋',
  Fatigue: '😴',
  Energique: '⚡',
  Triste: '😢',
  Excite: '🤩'
}

const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const getRarityColor = (rarity: string): string => {
  const normalized = normalizeString(rarity)
  return RARITY_COLORS[normalized] || 'bg-gray-400'
}

const getMoodEmoji = (mood: string): string => {
  const normalized = normalizeString(mood)
  return MOOD_EMOJIS[normalized] || '😊'
}

export default function MonsterCard ({ monster }: MonsterCardProps): ReactNode {
  const healthPercentage = Math.min(100, Math.floor((monster.stats.health / monster.stats.maxHealth) * 100))
  const happinessPercentage = Math.min(100, monster.stats.happiness)
  const energyPercentage = Math.min(100, monster.stats.energy)
  const hungerPercentage = Math.min(100, monster.stats.hunger)
  const needsCare = monster.stats.hunger > 80 || monster.stats.happiness < 30 || monster.stats.energy < 20

  return (
    <div
      className='bg-white rounded-2xl p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden'
      style={{ borderColor: monster.appearance.primaryColor }}
    >
      {monster.isShiny && (
        <div className='absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse'>
          ✨ SHINY
        </div>
      )}

      <div className='flex items-center gap-4 mb-4'>
        <div
          className='w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md'
          style={{ backgroundColor: `${monster.appearance.primaryColor}33` }}
        >
          {monster.appearance.emoji}
        </div>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-tolopea-900'>
            {monster.name}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getRarityColor(monster.rarity)}`}>
              {monster.rarity}
            </span>
            <span className='text-sm text-gray-600'>
              Niveau {monster.level}
            </span>
          </div>
        </div>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <InfoBadge label='Type' value={monster.type} />
        <InfoBadge
          label={getMoodEmoji(monster.mood)}
          value={monster.mood}
          className='flex items-center gap-1'
        />
      </div>

      <div className='space-y-3'>
        <StatBar
          icon='❤️'
          label='Santé'
          value={monster.stats.health}
          maxValue={monster.stats.maxHealth}
          percentage={healthPercentage}
          color='bg-red-500'
        />
        <StatBar
          icon='😊'
          label='Bonheur'
          value={monster.stats.happiness}
          percentage={happinessPercentage}
          color='bg-yellow-500'
          suffix='%'
        />
        <StatBar
          icon='⚡'
          label='Énergie'
          value={monster.stats.energy}
          percentage={energyPercentage}
          color='bg-blue-500'
          suffix='%'
        />
        <StatBar
          icon='🍖'
          label='Faim'
          value={monster.stats.hunger}
          percentage={hungerPercentage}
          color='bg-orange-500'
          suffix='%'
        />
      </div>

      {needsCare && (
        <div className='mt-4 bg-red-50 border border-red-200 rounded-lg p-2 text-center'>
          <span className='text-red-600 text-sm font-semibold'>⚠️ A besoin de soins !</span>
        </div>
      )}
    </div>
  )
}

interface StatBarProps {
  icon: string
  label: string
  value: number
  maxValue?: number
  percentage: number
  color: string
  suffix?: string
}

function StatBar ({ icon, label, value, maxValue, percentage, color, suffix = '' }: StatBarProps): ReactNode {
  const displayValue = maxValue !== undefined ? `${value}/${maxValue}` : `${value}${suffix}`

  return (
    <div>
      <div className='flex justify-between text-xs mb-1'>
        <span className='font-semibold text-gray-700'>{icon} {label}</span>
        <span className='text-gray-600'>{displayValue}</span>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
