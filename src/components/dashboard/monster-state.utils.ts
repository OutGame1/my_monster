import type { MonsterState } from '@/db/models/monster.model'

/**
 * Get emoji representation for a monster state
 */
export const getStateEmoji = (state: MonsterState): string => {
  const emojiMap: Record<MonsterState, string> = {
    happy: '😊',
    sad: '😢',
    gamester: '🎮',
    angry: '😠',
    hungry: '🍔',
    sleepy: '😴'
  }
  return emojiMap[state] ?? emojiMap.happy
}

/**
 * Get Tailwind CSS classes for a monster state badge
 */
export const getStateColor = (state: MonsterState): string => {
  const colorMap: Record<MonsterState, string> = {
    happy: 'bg-aqua-forest-100 text-aqua-forest-700 border-aqua-forest-300',
    sad: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300',
    gamester: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300',
    angry: 'bg-blood-100 text-blood-700 border-blood-300',
    hungry: 'bg-amber-100 text-amber-700 border-amber-300',
    sleepy: 'bg-purple-100 text-purple-700 border-purple-300'
  }
  return colorMap[state] ?? 'bg-gray-100 text-gray-700 border-gray-300'
}
