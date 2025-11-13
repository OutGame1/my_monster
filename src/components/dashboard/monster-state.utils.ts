import type { MonsterState, StateInfo } from '@/types/monsters'

export const stateInfoMap: Record<MonsterState, StateInfo> = {
  happy: {
    label: 'Heureux',
    emoji: '😊',
    color: 'bg-aqua-forest-100 text-aqua-forest-700 border-aqua-forest-300'
  },
  sad: {
    label: 'Triste',
    emoji: '😢',
    color: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300'
  },
  gamester: {
    label: 'Joueur',
    emoji: '🎮',
    color: 'bg-tolopea-100 text-tolopea-700 border-tolopea-300'
  },
  angry: {
    label: 'En colère',
    emoji: '😠',
    color: 'bg-blood-100 text-blood-700 border-blood-300'
  },
  hungry: {
    label: 'Affamé',
    emoji: '🍔',
    color: 'bg-amber-100 text-amber-700 border-amber-300'
  },
  sleepy: {
    label: 'Somnolant',
    emoji: '😴',
    color: 'bg-purple-100 text-purple-700 border-purple-300'
  }
}
