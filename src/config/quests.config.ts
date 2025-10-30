/**
 * Configuration du système de quêtes.
 * Définit les types de quêtes, leurs objectifs et leurs récompenses.
 */

export type QuestType = 'daily' | 'achievement'

export type QuestObjective =
  | 'feed_monsters' // Nourrir X fois
  | 'play_monsters' // Jouer X fois
  | 'comfort_monsters' // Réconforter X fois
  | 'calm_monsters' // Calmer X fois
  | 'lullaby_monsters' // Bercer X fois
  | 'care_different_monsters' // S'occuper de X monstres différents
  | 'own_monsters' // Posséder X monstres
  | 'total_actions' // Effectuer X actions au total
  | 'level_up_monster' // Faire monter un monstre au niveau X
  | 'reach_coins' // Atteindre X pièces

export interface QuestDefinition {
  id: string
  type: QuestType
  objective: QuestObjective
  target: number // Nombre à atteindre
  reward: number // Pièces gagnées
  title: string
  description: string
  icon: string // Emoji ou icône
}

/**
 * Quêtes quotidiennes - Se renouvellent chaque jour à minuit
 * Objectifs simples et rapides, faibles récompenses
 */
export const dailyQuests: QuestDefinition[] = [
  {
    id: 'daily_feed_3',
    type: 'daily',
    objective: 'feed_monsters',
    target: 3,
    reward: 15,
    title: 'Heure du goûter',
    description: 'Nourrir 3 fois vos monstres',
    icon: '🍖'
  },
  {
    id: 'daily_play_3',
    type: 'daily',
    objective: 'play_monsters',
    target: 3,
    reward: 15,
    title: 'Temps de jeu',
    description: 'Jouer 3 fois avec vos monstres',
    icon: '🎮'
  },
  {
    id: 'daily_care_3_different',
    type: 'daily',
    objective: 'care_different_monsters',
    target: 3,
    reward: 20,
    title: 'Dresseur attentionné',
    description: "S'occuper de 3 monstres différents",
    icon: '💝'
  },
  {
    id: 'daily_total_actions_5',
    type: 'daily',
    objective: 'total_actions',
    target: 5,
    reward: 25,
    title: 'Journée active',
    description: 'Effectuer 5 actions au total',
    icon: '⚡'
  },
  {
    id: 'daily_comfort_2',
    type: 'daily',
    objective: 'comfort_monsters',
    target: 2,
    reward: 10,
    title: 'Câlins réconfortants',
    description: 'Réconforter 2 fois vos monstres',
    icon: '🤗'
  }
]

/**
 * Mapping des quêtes quotidiennes par ID pour un accès rapide
 */
export const dailyQuestIds = dailyQuests.map(q => q.id)

/**
 * Succès (Achievements) - Objectifs permanents
 * Objectifs plus longs, récompenses plus importantes
 */
export const achievements: QuestDefinition[] = [
  {
    id: 'achievement_own_5',
    type: 'achievement',
    objective: 'own_monsters',
    target: 5,
    reward: 100,
    title: 'Collectionneur débutant',
    description: 'Posséder 5 monstres',
    icon: '👥'
  },
  {
    id: 'achievement_own_10',
    type: 'achievement',
    objective: 'own_monsters',
    target: 10,
    reward: 250,
    title: 'Éleveur confirmé',
    description: 'Posséder 10 monstres',
    icon: '🏆'
  },
  {
    id: 'achievement_feed_50',
    type: 'achievement',
    objective: 'feed_monsters',
    target: 50,
    reward: 150,
    title: 'Chef cuisinier',
    description: 'Nourrir 50 fois vos monstres',
    icon: '👨‍🍳'
  },
  {
    id: 'achievement_feed_100',
    type: 'achievement',
    objective: 'feed_monsters',
    target: 100,
    reward: 300,
    title: 'Maître des festins',
    description: 'Nourrir 100 fois vos monstres',
    icon: '🍽️'
  },
  {
    id: 'achievement_play_50',
    type: 'achievement',
    objective: 'play_monsters',
    target: 50,
    reward: 150,
    title: 'Compagnon de jeu',
    description: 'Jouer 50 fois avec vos monstres',
    icon: '🎲'
  },
  {
    id: 'achievement_total_actions_100',
    type: 'achievement',
    objective: 'total_actions',
    target: 100,
    reward: 200,
    title: 'Dresseur dévoué',
    description: 'Effectuer 100 actions au total',
    icon: '🌟'
  },
  {
    id: 'achievement_total_actions_500',
    type: 'achievement',
    objective: 'total_actions',
    target: 500,
    reward: 500,
    title: 'Légende vivante',
    description: 'Effectuer 500 actions au total',
    icon: '👑'
  },
  {
    id: 'achievement_level_10',
    type: 'achievement',
    objective: 'level_up_monster',
    target: 10,
    reward: 200,
    title: 'Entraîneur exQuestWithProgresspert',
    description: 'Faire monter un monstre au niveau 10',
    icon: '📈'
  },
  {
    id: 'achievement_coins_1000',
    type: 'achievement',
    objective: 'reach_coins',
    target: 1000,
    reward: 100,
    title: 'Économe',
    description: 'Atteindre 1000 pièces',
    icon: '💰'
  },
  {
    id: 'achievement_coins_5000',
    type: 'achievement',
    objective: 'reach_coins',
    target: 5000,
    reward: 500,
    title: 'Millionnaire',
    description: 'Atteindre 5000 pièces',
    icon: '💎'
  }
]

export const allQuests = [...dailyQuests, ...achievements]
