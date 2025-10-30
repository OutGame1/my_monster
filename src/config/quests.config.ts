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
 * Objectifs simples et rapides, faibles récompenses pour encourager l'achat
 */
export const dailyQuests: QuestDefinition[] = [
  {
    id: 'daily_feed_3',
    type: 'daily',
    objective: 'feed_monsters',
    target: 3,
    reward: 5,
    title: 'Heure du goûter',
    description: 'Nourrir 3 fois vos monstres',
    icon: '🍖'
  },
  {
    id: 'daily_play_3',
    type: 'daily',
    objective: 'play_monsters',
    target: 3,
    reward: 5,
    title: 'Temps de jeu',
    description: 'Jouer 3 fois avec vos monstres',
    icon: '🎮'
  },
  {
    id: 'daily_care_3_different',
    type: 'daily',
    objective: 'care_different_monsters',
    target: 3,
    reward: 8,
    title: 'Dresseur attentionné',
    description: "S'occuper de 3 monstres différents",
    icon: '💝'
  },
  {
    id: 'daily_total_actions_5',
    type: 'daily',
    objective: 'total_actions',
    target: 5,
    reward: 6,
    title: 'Journée active',
    description: 'Effectuer 5 actions au total',
    icon: '⚡'
  },
  {
    id: 'daily_comfort_5',
    type: 'daily',
    objective: 'comfort_monsters',
    target: 5,
    reward: 7,
    title: 'Câlins réconfortants',
    description: 'Réconforter 5 fois vos monstres',
    icon: '🤗'
  },
  {
    id: 'daily_calm_3',
    type: 'daily',
    objective: 'calm_monsters',
    target: 3,
    reward: 5,
    title: 'Apaisement du soir',
    description: 'Calmer 3 fois vos monstres',
    icon: '😌'
  },
  {
    id: 'daily_lullaby_3',
    type: 'daily',
    objective: 'lullaby_monsters',
    target: 3,
    reward: 5,
    title: 'Berceuse nocturne',
    description: 'Bercer 3 fois vos monstres',
    icon: '🌙'
  },
  {
    id: 'daily_total_actions_10',
    type: 'daily',
    objective: 'total_actions',
    target: 10,
    reward: 12,
    title: 'Super actif',
    description: 'Effectuer 10 actions au total',
    icon: '💪'
  }
]

/**
 * Mapping des quêtes quotidiennes par ID pour un accès rapide
 */
export const dailyQuestIds = dailyQuests.map(q => q.id)

/**
 * Succès (Achievements) - Objectifs permanents
 * Objectifs plus difficiles, récompenses importantes pour encourager l'engagement long terme
 */
export const achievements: QuestDefinition[] = [
  {
    id: 'achievement_own_5',
    type: 'achievement',
    objective: 'own_monsters',
    target: 5,
    reward: 30,
    title: 'Collectionneur débutant',
    description: 'Posséder 5 monstres',
    icon: '🐾'
  },
  {
    id: 'achievement_own_10',
    type: 'achievement',
    objective: 'own_monsters',
    target: 10,
    reward: 75,
    title: 'Éleveur confirmé',
    description: 'Posséder 10 monstres',
    icon: '🏆'
  },
  {
    id: 'achievement_own_15',
    type: 'achievement',
    objective: 'own_monsters',
    target: 15,
    reward: 150,
    title: 'Maître éleveur',
    description: 'Posséder 15 monstres',
    icon: '👑'
  },
  {
    id: 'achievement_feed_250',
    type: 'achievement',
    objective: 'feed_monsters',
    target: 250,
    reward: 50,
    title: 'Chef cuisinier',
    description: 'Nourrir 250 fois vos monstres',
    icon: '👨‍🍳'
  },
  {
    id: 'achievement_feed_500',
    type: 'achievement',
    objective: 'feed_monsters',
    target: 500,
    reward: 150,
    title: 'Maître des festins',
    description: 'Nourrir 500 fois vos monstres',
    icon: '🍽️'
  },
  {
    id: 'achievement_feed_1000',
    type: 'achievement',
    objective: 'feed_monsters',
    target: 1000,
    reward: 250,
    title: 'Grand banquet',
    description: 'Nourrir 1000 fois vos monstres',
    icon: '🍖'
  },
  {
    id: 'achievement_play_250',
    type: 'achievement',
    objective: 'play_monsters',
    target: 250,
    reward: 50,
    title: 'Compagnon de jeu',
    description: 'Jouer 250 fois avec vos monstres',
    icon: '🎲'
  },
  {
    id: 'achievement_play_500',
    type: 'achievement',
    objective: 'play_monsters',
    target: 500,
    reward: 150,
    title: 'Expert du divertissement',
    description: 'Jouer 500 fois avec vos monstres',
    icon: '🎭'
  },
  {
    id: 'achievement_play_1000',
    type: 'achievement',
    objective: 'play_monsters',
    target: 1000,
    reward: 250,
    title: 'Maître du jeu',
    description: 'Jouer 1000 fois avec vos monstres',
    icon: '🎪'
  },
  {
    id: 'achievement_comfort_250',
    type: 'achievement',
    objective: 'comfort_monsters',
    target: 250,
    reward: 50,
    title: 'Cœur tendre',
    description: 'Réconforter 250 fois vos monstres',
    icon: '💖'
  },
  {
    id: 'achievement_comfort_500',
    type: 'achievement',
    objective: 'comfort_monsters',
    target: 500,
    reward: 150,
    title: 'Ange gardien',
    description: 'Réconforter 500 fois vos monstres',
    icon: '😇'
  },
  {
    id: 'achievement_comfort_1000',
    type: 'achievement',
    objective: 'comfort_monsters',
    target: 1000,
    reward: 250,
    title: 'Maître des câlins',
    description: 'Réconforter 1000 fois vos monstres',
    icon: '💝'
  },
  {
    id: 'achievement_calm_250',
    type: 'achievement',
    objective: 'calm_monsters',
    target: 250,
    reward: 50,
    title: 'Pacificateur',
    description: 'Calmer 250 fois vos monstres',
    icon: '�️'
  },
  {
    id: 'achievement_calm_500',
    type: 'achievement',
    objective: 'calm_monsters',
    target: 500,
    reward: 150,
    title: 'Maître du zen',
    description: 'Calmer 500 fois vos monstres',
    icon: '🧘'
  },
  {
    id: 'achievement_calm_1000',
    type: 'achievement',
    objective: 'calm_monsters',
    target: 1000,
    reward: 250,
    title: 'Sage apaisement',
    description: 'Calmer 1000 fois vos monstres',
    icon: '☮️'
  },
  {
    id: 'achievement_lullaby_250',
    type: 'achievement',
    objective: 'lullaby_monsters',
    target: 250,
    reward: 50,
    title: 'Chanteur nocturne',
    description: 'Bercer 250 fois vos monstres',
    icon: '🌙'
  },
  {
    id: 'achievement_lullaby_500',
    type: 'achievement',
    objective: 'lullaby_monsters',
    target: 500,
    reward: 150,
    title: 'Virtuose des berceuses',
    description: 'Bercer 500 fois vos monstres',
    icon: '🎵'
  },
  {
    id: 'achievement_lullaby_1000',
    type: 'achievement',
    objective: 'lullaby_monsters',
    target: 1000,
    reward: 250,
    title: 'Maître des rêves',
    description: 'Bercer 1000 fois vos monstres',
    icon: '⭐'
  },
  {
    id: 'achievement_total_actions_500',
    type: 'achievement',
    objective: 'total_actions',
    target: 500,
    reward: 50,
    title: 'Dresseur dévoué',
    description: 'Effectuer 500 actions au total',
    icon: '🌟'
  },
  {
    id: 'achievement_total_actions_1000',
    type: 'achievement',
    objective: 'total_actions',
    target: 1000,
    reward: 100,
    title: 'Dresseur légendaire',
    description: 'Effectuer 1000 actions au total',
    icon: '✨'
  },
  {
    id: 'achievement_total_actions_2000',
    type: 'achievement',
    objective: 'total_actions',
    target: 2000,
    reward: 175,
    title: 'Légende vivante',
    description: 'Effectuer 2000 actions au total',
    icon: '🏅'
  },
  {
    id: 'achievement_level_10',
    type: 'achievement',
    objective: 'level_up_monster',
    target: 10,
    reward: 100,
    title: 'Entraîneur expert',
    description: 'Faire monter un monstre au niveau 10',
    icon: '📈'
  },
  {
    id: 'achievement_level_20',
    type: 'achievement',
    objective: 'level_up_monster',
    target: 20,
    reward: 200,
    title: 'Maître entraîneur',
    description: 'Faire monter un monstre au niveau 20',
    icon: '🚀'
  },
  {
    id: 'achievement_coins_500',
    type: 'achievement',
    objective: 'reach_coins',
    target: 500,
    reward: 50,
    title: 'Petit économe',
    description: 'Gagner 500 pièces au total',
    icon: '🪙'
  },
  {
    id: 'achievement_coins_1000',
    type: 'achievement',
    objective: 'reach_coins',
    target: 1000,
    reward: 100,
    title: 'Économe',
    description: 'Gagner 1000 pièces au total',
    icon: '💰'
  },
  {
    id: 'achievement_coins_2500',
    type: 'achievement',
    objective: 'reach_coins',
    target: 2500,
    reward: 200,
    title: 'Riche éleveur',
    description: 'Gagner 2500 pièces au total',
    icon: '🤑'
  },
  {
    id: 'achievement_coins_5000',
    type: 'achievement',
    objective: 'reach_coins',
    target: 5000,
    reward: 350,
    title: 'Millionnaire',
    description: 'Gagner 5000 pièces au total',
    icon: '💎'
  }
]

export const allQuests = [...dailyQuests, ...achievements]
